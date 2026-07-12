// Terna Studio Portal — shared render helpers.
// Pure functions: safe HTML templating + Terna-idiom components.
// No store access; views pass data in.

class Raw { constructor(s) { this.__raw = s; } }
export const raw = (s) => new Raw(s);

export function esc(v) {
  return String(v == null ? "" : v).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function part(v) {
  if (v == null || v === false || v === true) return "";
  if (v instanceof Raw) return v.__raw;
  if (Array.isArray(v)) return v.map(part).join("");
  return esc(v);
}

// tagged template — interpolations escaped unless already Raw (e.g. nested html``)
export function html(strings, ...vals) {
  let out = strings[0];
  for (let i = 0; i < vals.length; i++) out += part(vals[i]) + strings[i + 1];
  return new Raw(out);
}
export function toHTML(v) { return v instanceof Raw ? v.__raw : part(v); }

// parse a single-root template into an element
export function toNode(v) {
  const tpl = document.createElement("template");
  tpl.innerHTML = toHTML(v).trim();
  return tpl.content.firstElementChild;
}

// ---------- formatting ----------
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function money(pence) {
  const pounds = (pence || 0) / 100;
  const s = pounds.toLocaleString("en-GB", { minimumFractionDigits: pounds % 1 ? 2 : 0, maximumFractionDigits: 2 });
  return `£${s}`;
}

export function dateFmt(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function toUTC(iso) { const [y, m, d] = iso.split("-").map(Number); return Date.UTC(y, m - 1, d); }

export function relDue(iso) {
  if (!iso) return "";
  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const days = Math.round((toUTC(iso) - todayUTC) / 86400000);
  if (days === 0) return "due today";
  if (days === 1) return "due tomorrow";
  if (days === -1) return "1 day overdue";
  if (days > 0) return `in ${days} days`;
  return `${-days} days overdue`;
}

export function isOverdue(iso) {
  if (!iso) return false;
  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return toUTC(iso) < todayUTC;
}

// ---------- Terna components ----------
export function logoSvg(size = 30, stroke = 4) {
  return raw(`<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="M12 6 H6 V34 H12" stroke="currentColor" stroke-width="${stroke}" fill="none"/>
    <path d="M28 6 H34 V34 H28" stroke="currentColor" stroke-width="${stroke}" fill="none"/>
    <path d="M13 14 H27 M20 14 V28" stroke="currentColor" stroke-width="${stroke}" fill="none"/>
  </svg>`);
}

export function marker(pill, label) {
  return html`<div class="marker"><span class="pill">${pill}</span><span class="label">${label}</span></div>`;
}

export function typeName(type) {
  return type === "A" ? "The Sprint" : type === "B" ? "The Project" : "The Care Plan";
}
export function typeTag(type) { return html`[${type}] ${typeName(type)}`; }

export function badge(text, variant = "outline") {
  const cls = variant === "solid" ? "badge solid"
    : variant === "invert" ? "badge invert"
    : variant === "ghost" ? "badge ghost" : "badge";
  return html`<span class="${raw(cls)}">${text}</span>`;
}

export function briefBadge(status) {
  switch (status) {
    case "open": return badge("[ Open ]");
    case "assigned": return badge("[ Assigned ]");
    case "in_delivery": return badge("[ In delivery ]");
    case "in_qa": return badge("[ In QA ]", "invert");
    case "shipped": return badge("[ ✓ Shipped ]", "solid");
    default: return badge(status);
  }
}
export function appBadge(status) {
  switch (status) {
    case "pending": return badge("[ Applied — pending ]", "ghost");
    case "accepted": return badge("[ ✓ Accepted ]", "solid");
    case "declined": return badge("[ Declined ]", "ghost");
    default: return badge(status);
  }
}
export function dlvBadge(status) {
  switch (status) {
    case "submitted": return badge("[ In QA ]", "invert");
    case "qa_pass": return badge("[ ✓ Passed ]", "solid");
    case "qa_fail": return badge("[ ✗ Remediate ]");
    default: return badge(status);
  }
}
export function payBadge(status) {
  return status === "paid" ? badge("[ Paid ]", "solid") : badge("[ Due ]", "ghost");
}

const STAGES = [["train", "Train"], ["deliver", "Deliver"], ["prove", "Prove"], ["convert", "Convert"]];
export function stagePath(stage, onDark = false) {
  const inner = STAGES.map(([key, label], i) => {
    const now = key === stage ? " now" : "";
    const arrow = i < STAGES.length - 1 ? html`<span class="arrow">→</span>` : "";
    return html`<span class="step${raw(now)}">${label}</span>${arrow}`;
  });
  return html`<div class="stage-path${raw(onDark ? " on-dark" : "")}">${inner}</div>`;
}

export function meter(done, total) {
  const blocks = Array.from({ length: total }, (_, i) => (i < done ? "▪" : "·")).join("");
  return html`<span class="meter">[${raw(blocks)}] <span class="frac">${done}/${total}</span></span>`;
}

export function emptyState(msg, onDark = false) {
  return html`<div class="empty${raw(onDark ? " dark" : "")}">${msg}</div>`;
}

// ---------- toast ----------
export function toast(msg, mark = "✓") {
  const host = document.getElementById("toast-host");
  if (!host) return;
  const node = toNode(html`<div class="toast" role="status"><span class="t-mark">[${raw(mark)}]</span> ${msg}</div>`);
  host.appendChild(node);
  setTimeout(() => {
    node.style.transition = "opacity 200ms ease";
    node.style.opacity = "0";
    setTimeout(() => node.remove(), 220);
  }, 3400);
}
