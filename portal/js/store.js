// Terna Studio Portal — data layer.
// Owns in-memory state, localStorage persistence, seed/reset, a tiny pub-sub,
// and every domain action. State-machine transitions and cross-entity side
// effects live here; views may only call actions, never mutate state directly.

import { SEED_VERSION, buildSeed } from "./seed.js";

const DATA_KEY = "terna.portal.data";
const SESSION_KEY = "terna.portal.session";

let state = load();
let listeners = [];

// ---------- persistence ----------
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(DATA_KEY));
    if (raw && raw.seedVersion === SEED_VERSION) return raw;
  } catch (e) { /* corrupt JSON → fall through to reseed */ }
  const fresh = buildSeed();
  try { localStorage.setItem(DATA_KEY, JSON.stringify(fresh)); } catch (e) {}
  return fresh;
}

function commit() {
  try { localStorage.setItem(DATA_KEY, JSON.stringify(state)); } catch (e) {}
  listeners.forEach((fn) => fn());
}

export function getState() { return state; }
export function subscribe(fn) { listeners.push(fn); return () => { listeners = listeners.filter((l) => l !== fn); }; }
export function resetDemo() { state = buildSeed(); commit(); }

// ---------- id + date helpers ----------
function nextId(prefix) {
  state.counters[prefix] = (state.counters[prefix] || 0) + 1;
  return `${prefix}-${String(state.counters[prefix]).padStart(2, "0")}`;
}
function today() { return new Date().toISOString().slice(0, 10); }
function addDays(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
}
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function monthName(iso) { return MONTH_NAMES[Number(iso.split("-")[1]) - 1] || ""; }

// ---------- selectors (read-only convenience) ----------
export const select = {
  student: (id) => state.students.find((s) => s.id === id) || null,
  client: (id) => state.clients.find((c) => c.id === id) || null,
  brief: (id) => state.briefs.find((b) => b.id === id) || null,
  clientOfBrief: (brief) => (brief ? state.clients.find((c) => c.id === brief.clientId) || null : null),
  applicationsFor: (briefId) => state.applications.filter((a) => a.briefId === briefId),
  applicationsBy: (studentId) => state.applications.filter((a) => a.studentId === studentId),
  applicationOf: (briefId, studentId) => state.applications.find((a) => a.briefId === briefId && a.studentId === studentId) || null,
  deliverablesFor: (briefId) => state.deliverables.filter((d) => d.briefId === briefId),
  deliverable: (id) => state.deliverables.find((d) => d.id === id) || null,
  portfolioBy: (studentId) => state.portfolio.filter((p) => p.studentId === studentId),
  paymentsBy: (studentId) => state.payments.filter((p) => p.studentId === studentId),
  briefsFor: (studentId) => state.briefs.filter((b) => b.assignedStudentId === studentId),
};

// ---------- personas / session ----------
export function getPersonas() {
  return [
    ...state.students.map((s) => ({ id: s.id, name: s.name, short: s.short, role: "student", meta: s })),
    ...state.staff.map((s) => ({ id: s.id, name: s.name, short: s.short, role: "admin", meta: s })),
  ];
}
export function getPersona(id) { return getPersonas().find((p) => p.id === id) || null; }
// In-memory fallback keeps sign-in working where storage is unavailable
// (private browsing, sandboxed iframes) — it just won't survive a reload.
let memSession = null;

export function getSession() {
  try {
    const raw = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (raw && raw.personaId && getPersona(raw.personaId)) return raw;
  } catch (e) {}
  if (memSession && getPersona(memSession.personaId)) return memSession;
  return null;
}
export function setSession(personaId) {
  const persona = getPersona(personaId);
  if (!persona) return null;
  const session = { personaId, role: persona.role };
  memSession = session;
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) {}
  return session;
}

// ---------- actions ----------
// Each mutates `state` then calls commit() exactly once.

function applyToBrief(briefId, studentId, note) {
  const brief = select.brief(briefId);
  if (!brief || brief.status !== "open") return { ok: false, error: "Brief is not open." };
  if (select.applicationOf(briefId, studentId)) return { ok: false, error: "Already applied." };
  const app = {
    id: nextId("app"), briefId, studentId, note: (note || "").trim(),
    status: "pending", submittedAt: today(), decidedAt: null, declineReason: null,
  };
  state.applications.push(app);
  commit();
  return { ok: true, application: app };
}

function withdrawApplication(appId) {
  const app = state.applications.find((a) => a.id === appId);
  if (!app || app.status !== "pending") return { ok: false };
  state.applications = state.applications.filter((a) => a.id !== appId);
  commit();
  return { ok: true };
}

function acceptApplication(appId) {
  const app = state.applications.find((a) => a.id === appId);
  if (!app || app.status !== "pending") return { ok: false, error: "Application is not pending." };
  const brief = select.brief(app.briefId);
  if (!brief || brief.status !== "open") return { ok: false, error: "Brief is no longer open." };

  app.status = "accepted";
  app.decidedAt = today();

  // auto-decline sibling pending applications on this brief
  state.applications
    .filter((a) => a.briefId === brief.id && a.id !== app.id && a.status === "pending")
    .forEach((a) => { a.status = "declined"; a.decidedAt = today(); a.declineReason = "Brief assigned to another member."; });

  // assign the brief
  brief.status = "assigned";
  brief.assignedStudentId = app.studentId;

  // create the due payment
  const client = select.clientOfBrief(brief);
  const typeLabel = brief.type === "A" ? "Sprint" : brief.type === "B" ? "Project" : "Care Plan";
  state.payments.push({
    id: nextId("pay"), studentId: app.studentId, briefId: brief.id,
    label: `${typeLabel} — ${client ? client.name : "Client"}`,
    amount: brief.studentPay, status: "due", dueAt: brief.dueAt, paidAt: null,
  });

  commit();
  return { ok: true };
}

function declineApplication(appId, reason) {
  const app = state.applications.find((a) => a.id === appId);
  if (!app || app.status !== "pending") return { ok: false };
  app.status = "declined";
  app.decidedAt = today();
  app.declineReason = (reason || "").trim() || "Not a fit for this brief right now.";
  commit();
  return { ok: true };
}

function createBrief(data) {
  const type = ["A", "B", "C"].includes(data.type) ? data.type : "A";
  const pay = type === "A" ? 65000 : type === "B" ? 176000 : 12000;
  const clientPrice = type === "A" ? 150000 : type === "B" ? 0 : 30000;
  const id = nextId("brf");
  const scopeItems = linesToArray(data.scopeText);
  // no milestones given → the scope items are the delivery checklist
  const milestoneTitles = linesToArray(data.milestonesText);
  const milestones = (milestoneTitles.length ? milestoneTitles : scopeItems).map((title, i) => ({
    id: `${id}-m${i + 1}`, title, done: false, doneAt: null,
  }));
  const brief = {
    id, type, title: (data.title || "").trim() || "Untitled brief",
    clientId: data.clientId,
    summary: (data.summary || "").trim(),
    scopeItems,
    clientPrice, studentPay: Number.isFinite(data.studentPay) && data.studentPay > 0 ? data.studentPay : pay,
    payCadence: type === "C" ? "monthly" : "fixed",
    status: "open", assignedStudentId: null, supervisor: "Studio",
    postedAt: today(), dueAt: data.dueAt || today(),
    note: (data.note || "").trim(),
    milestones,
  };
  state.briefs.unshift(brief);
  commit();
  return { ok: true, brief };
}

function updateBrief(briefId, data) {
  const brief = select.brief(briefId);
  if (!brief) return { ok: false };
  if (data.title != null) brief.title = data.title.trim() || brief.title;
  if (data.summary != null) brief.summary = data.summary.trim();
  if (data.note != null) brief.note = data.note.trim();
  if (Number.isFinite(data.studentPay) && data.studentPay > 0) brief.studentPay = data.studentPay;
  if (data.dueAt && data.dueAt !== brief.dueAt) {
    brief.dueAt = data.dueAt;
    // keep the student's pay table consistent with the re-scoped deadline
    state.payments
      .filter((p) => p.briefId === briefId && p.status === "due")
      .forEach((p) => { p.dueAt = data.dueAt; });
  }
  if (data.scopeText != null) brief.scopeItems = linesToArray(data.scopeText);
  // type + client lock once assigned; editable while open
  if (brief.status === "open") {
    if (data.clientId) brief.clientId = data.clientId;
    if (["A", "B", "C"].includes(data.type) && data.type !== brief.type) {
      brief.type = data.type;
      brief.payCadence = data.type === "C" ? "monthly" : "fixed";
      brief.clientPrice = data.type === "A" ? 150000 : data.type === "B" ? 0 : 30000;
    }
  }
  if (data.milestonesText != null) {
    const titles = linesToArray(data.milestonesText);
    // preserve done state by matching existing titles; consume each match so
    // duplicate titles bind to distinct milestone objects
    const pool = brief.milestones.slice();
    brief.milestones = titles.map((title, i) => {
      const idx = pool.findIndex((m) => m.title === title);
      if (idx !== -1) return pool.splice(idx, 1)[0];
      return { id: `${briefId}-m${i + 1}-${nextId("mil")}`, title, done: false, doneAt: null };
    });
  }
  commit();
  return { ok: true };
}

function startWork(briefId) {
  const brief = select.brief(briefId);
  if (!brief || brief.status !== "assigned") return { ok: false };
  brief.status = "in_delivery";
  commit();
  return { ok: true };
}

function toggleMilestone(briefId, milestoneId) {
  const brief = select.brief(briefId);
  if (!brief) return { ok: false };
  if (brief.status !== "in_delivery") return { ok: false, error: "Milestones can only be changed while in delivery." };
  const m = brief.milestones.find((x) => x.id === milestoneId);
  if (!m) return { ok: false };
  m.done = !m.done;
  m.doneAt = m.done ? today() : null;
  commit();
  return { ok: true };
}

function submitDeliverable(briefId, studentId, data) {
  const brief = select.brief(briefId);
  if (!brief || brief.status !== "in_delivery") return { ok: false, error: "Brief is not in delivery." };
  const dlv = {
    id: nextId("dlv"), briefId, studentId,
    title: (data.title || "").trim() || "Deliverable",
    url: (data.url || "").trim(),
    notes: (data.notes || "").trim(),
    version: 1, status: "submitted", submittedAt: today(),
    qa: null, history: [],
  };
  state.deliverables.push(dlv);
  brief.status = "in_qa";
  commit();
  return { ok: true, deliverable: dlv };
}

function resubmitDeliverable(deliverableId, data) {
  const dlv = select.deliverable(deliverableId);
  if (!dlv || dlv.status !== "qa_fail") return { ok: false };
  const brief = select.brief(dlv.briefId);
  if (!brief) return { ok: false };
  // archive the failed version
  dlv.history.push({ version: dlv.version, url: dlv.url, notes: dlv.notes, submittedAt: dlv.submittedAt, qa: dlv.qa });
  dlv.version += 1;
  if (data.title != null && data.title.trim()) dlv.title = data.title.trim();
  if (data.url != null) dlv.url = data.url.trim();
  if (data.notes != null) dlv.notes = data.notes.trim();
  dlv.status = "submitted";
  dlv.submittedAt = today();
  dlv.qa = null;
  brief.status = "in_qa";
  commit();
  return { ok: true };
}

function recordQaVerdict(deliverableId, verdict, note) {
  const dlv = select.deliverable(deliverableId);
  if (!dlv || dlv.status !== "submitted") return { ok: false, error: "Nothing to review." };
  const brief = select.brief(dlv.briefId);
  if (!brief) return { ok: false };
  const stamp = today();
  const cleanNote = (note || "").trim();

  if (verdict === "pass") {
    dlv.status = "qa_pass";
    dlv.qa = { verdict: "pass", note: cleanNote || "Passed studio QA.", reviewedBy: "Studio", reviewedAt: stamp };

    // mint a verified portfolio entry — for Care Plans each monthly improvement
    // is its own distinct ship, credited from the deliverable
    const client = select.clientOfBrief(brief);
    const isCare = brief.type === "C";
    state.portfolio.push({
      id: nextId("pf"), studentId: dlv.studentId, briefId: brief.id, deliverableId: dlv.id,
      title: isCare ? dlv.title : brief.title,
      clientName: client ? client.name : "Client", town: client ? client.town : "",
      type: brief.type,
      outcomeStatement: isCare ? (dlv.notes || brief.summary) : brief.summary,
      scopeItems: isCare ? [] : brief.scopeItems.slice(),
      shippedAt: stamp, verifiedBy: "Terna Studio QA",
    });

    // brief transition: A/B ship; C returns to steady-state delivery
    brief.status = isCare ? "in_delivery" : "shipped";

    // release the earliest outstanding payment on this brief
    const duePay = state.payments
      .filter((p) => p.briefId === brief.id && p.status === "due")
      .sort((a, b) => (a.dueAt || "").localeCompare(b.dueAt || ""))[0];
    if (duePay) { duePay.status = "paid"; duePay.paidAt = stamp; }

    // Care Plans are a rolling retainer: queue next month's payment
    if (isCare) {
      const nextDue = addDays(duePay ? duePay.dueAt : stamp, 30);
      state.payments.push({
        id: nextId("pay"), studentId: dlv.studentId, briefId: brief.id,
        label: `Care Plan — ${client ? client.name : "Client"} (${monthName(nextDue)})`,
        amount: brief.studentPay, status: "due", dueAt: nextDue, paidAt: null,
      });
    }

    commit();
    return { ok: true, verdict: "pass" };
  }

  // fail
  dlv.status = "qa_fail";
  dlv.qa = { verdict: "fail", note: cleanNote || "Needs another pass — see notes.", reviewedBy: "Studio", reviewedAt: stamp };
  brief.status = "in_delivery";
  commit();
  return { ok: true, verdict: "fail" };
}

// ---------- utils ----------
function linesToArray(text) {
  return String(text || "")
    .split("\n")
    .map((l) => l.replace(/^[-–—\s]+/, "").trim())
    .filter(Boolean);
}

export const actions = {
  applyToBrief, withdrawApplication, acceptApplication, declineApplication,
  createBrief, updateBrief, startWork, toggleMilestone,
  submitDeliverable, resubmitDeliverable, recordQaVerdict,
};
