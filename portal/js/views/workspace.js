// Project workspace (assigned student) — brief, milestones, deliverables + QA.

import { select, actions } from "../store.js";
import { html, toNode, typeTag, money, dateFmt, relDue, briefBadge, dlvBadge, meter, toast, isOverdue, urlLine } from "../ui.js";

export function render(ctx) {
  const { params, session } = ctx;
  const studentId = session.personaId;
  const b = select.brief(params.id);

  // role/ownership gate — only the assigned student
  if (!b || b.assignedStudentId !== studentId) { ctx.navigate("#/dashboard"); return document.createElement("div"); }

  const client = select.clientOfBrief(b);
  const deliverables = select.deliverablesFor(b.id)
    .filter((d) => d.studentId === studentId)
    .slice()
    .sort((a, c) => (c.submittedAt || "").localeCompare(a.submittedAt || ""));
  const doneCount = b.milestones.filter((m) => m.done).length;
  const canEditMilestones = b.status === "in_delivery";
  const hasFail = deliverables.some((d) => d.status === "qa_fail");
  const hasSubmitted = deliverables.some((d) => d.status === "submitted");

  // ---- milestones ----
  const milestoneRows = b.milestones.map((m) => html`
    <div class="milestone${m.done ? " done" : ""}">
      <button type="button" class="box${m.done ? " done" : ""}" data-milestone="${m.id}"
        ${canEditMilestones ? "" : "disabled"} aria-pressed="${m.done ? "true" : "false"}"
        aria-label="${m.done ? "Mark incomplete" : "Mark complete"}">${m.done ? "✓" : ""}</button>
      <div class="m-body">
        <span class="m-title">${m.title}</span>
        ${m.done && m.doneAt ? html`<span class="m-meta">done ${dateFmt(m.doneAt)}</span>` : ""}
      </div>
    </div>`);

  const startBanner = b.status === "assigned"
    ? html`<div class="row" style="margin-bottom:1.2rem;">
        <button type="button" class="btn btn-solid" id="start-work">Start work</button>
        <span class="note">// ticking the checklist unlocks once you start.</span>
      </div>` : "";

  // ---- deliverables ----
  const deliverableBlocks = deliverables.map((d) => {
    let qaBlock = "";
    if (d.status === "qa_fail" && d.qa) {
      qaBlock = html`
        <div class="callout">
          <span class="c-label">[ ✗ Remediation ]</span>
          <p>${d.qa.note}</p>
        </div>
        <form class="form resubmit" data-dlv="${d.id}" style="max-width:100%;gap:0.9rem;">
          <div class="field">
            <label>Updated link</label>
            <input type="url" name="url" value="${d.url}" placeholder="https://…">
          </div>
          <div class="field">
            <label>What changed</label>
            <textarea name="notes" rows="2" placeholder="// what you fixed since the last version">${d.notes}</textarea>
          </div>
          <div><button type="submit" class="btn btn-solid btn-sm">Resubmit for QA</button></div>
        </form>`;
    } else if (d.status === "submitted") {
      qaBlock = html`<p class="note-block">// [ In QA ] — the studio checks every delivery before it reaches the client.</p>`;
    } else if (d.status === "qa_pass" && d.qa) {
      qaBlock = html`<div class="callout pass"><span class="c-label">[ ✓ Passed ]</span><p>${d.qa.note}</p></div>`;
    }
    return html`
      <div class="deliverable">
        <div class="d-head">
          <span class="d-title">${d.title} <span class="d-meta">v${d.version}</span></span>
          ${dlvBadge(d.status)}
        </div>
        ${urlLine(d.url)}
        ${d.notes ? html`<p>${d.notes}</p>` : ""}
        ${d.submittedAt ? html`<p class="d-meta">submitted ${dateFmt(d.submittedAt)}</p>` : ""}
        ${qaBlock}
      </div>`;
  });

  const submitForm = (b.status === "in_delivery" && !hasFail && !hasSubmitted)
    ? html`
      <form class="form" id="submit-form" style="margin-top:1.4rem;max-width:100%;">
        <div class="field">
          <label for="d-title">Deliverable</label>
          <input type="text" id="d-title" name="title" placeholder="What you're handing over" required>
        </div>
        <div class="field-inline">
          <div class="field">
            <label for="d-url">Link</label>
            <input type="url" id="d-url" name="url" placeholder="https://… (sheet, doc, demo)">
          </div>
          <div class="field">
            <label for="d-notes">Notes for the studio</label>
            <input type="text" id="d-notes" name="notes" placeholder="// how to check it works">
          </div>
        </div>
        <div><button type="submit" class="btn btn-solid">Submit for QA</button></div>
      </form>`
    : (b.status === "assigned"
        ? html`<p class="note-block">// start work and tick the milestones — then you can submit for QA.</p>`
        : (b.status === "shipped"
            ? html`<p class="note-block">// shipped and signed off. Nothing more to submit here.</p>`
            : ""));

  const root = toNode(html`
    <div class="wrap view-lead">
      <a class="crumb" href="#/dashboard">← Dashboard</a>
      <div class="between">
        <p class="tag" style="font-family:var(--mono);font-weight:700;letter-spacing:0.18em;text-transform:uppercase;font-size:0.8rem;">${typeTag(b.type)}</p>
        ${briefBadge(b.status)}
      </div>
      <h1 style="margin-top:0.6rem;">${b.title}</h1>
      <p class="sub-line">${client ? client.name : ""} · ${client ? client.town : ""}</p>

      <div class="dark strip" style="margin-top:1.6rem;">
        <span class="gmark">↦</span>
        <div class="grow"><strong>The named outcome</strong><p>${b.summary}</p></div>
      </div>

      <div class="block" style="margin-top:2.4rem;">
        <div class="block-head"><h3>[1] Brief</h3></div>
        <ul class="dash">${b.scopeItems.map((s) => html`<li>${s}</li>`)}</ul>
        <p class="fine" style="margin-top:1rem;">Pay ${money(b.studentPay)}${b.payCadence === "monthly" ? " / month" : ""} · ${b.status === "shipped" ? html`shipped · was due ${dateFmt(b.dueAt)}` : html`Due ${dateFmt(b.dueAt)} · <span style="${isOverdue(b.dueAt) ? "color:var(--ink);font-weight:700;" : ""}">${relDue(b.dueAt)}</span>`}</p>
        <p class="note" style="margin-top:0.4rem;">// supervisor: Studio · weekly check-in Fridays.</p>
      </div>

      <div class="block">
        <div class="block-head"><h3>[2] Milestones</h3><span>${meter(doneCount, b.milestones.length)}</span></div>
        ${startBanner}
        <div class="milestones">${milestoneRows}</div>
      </div>

      <div class="block">
        <div class="block-head"><h3>[3] Deliverables</h3></div>
        ${deliverables.length ? html`<div class="stack">${deliverableBlocks}</div>` : html`<p class="note-block">// nothing submitted yet.</p>`}
        ${submitForm}
      </div>
    </div>`);

  // ---- wiring ----
  const startBtn = root.querySelector("#start-work");
  if (startBtn) startBtn.addEventListener("click", () => { const r = actions.startWork(b.id); if (r.ok) toast("Work started — checklist unlocked."); });

  root.querySelectorAll("[data-milestone]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = actions.toggleMilestone(b.id, btn.getAttribute("data-milestone"));
      if (!r.ok && r.error) toast(r.error, "✗");
    });
  });

  const submitForm2 = root.querySelector("#submit-form");
  if (submitForm2) submitForm2.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = submitForm2.elements;
    const r = actions.submitDeliverable(b.id, studentId, { title: f.title.value, url: f.url.value, notes: f.notes.value });
    if (r.ok) toast("Submitted for QA — the studio will review it.");
    else toast(r.error || "Could not submit.", "✗");
  });

  root.querySelectorAll("form.resubmit").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const r = actions.resubmitDeliverable(form.getAttribute("data-dlv"), { url: form.elements.url.value, notes: form.elements.notes.value });
      if (r.ok) toast("Resubmitted — back in the QA queue.");
      else toast("Could not resubmit.", "✗");
    });
  });

  return root;
}
