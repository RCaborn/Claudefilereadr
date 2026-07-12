// Marketplace — students browse open briefs and see their application state.

import { getState, select } from "../store.js";
import { html, toNode, marker, typeTag, money, appBadge, emptyState } from "../ui.js";

// Filter survives navigation via sessionStorage where available; the module
// variable keeps it working where storage access throws (sandboxed iframes).
let memFilter = "ALL";
function getFilter() {
  try { return sessionStorage.getItem("terna.mkt.filter") || memFilter; } catch (e) { return memFilter; }
}
function setFilter(v) {
  memFilter = v;
  try { sessionStorage.setItem("terna.mkt.filter", v); } catch (e) {}
}

export function render(ctx) {
  const { session } = ctx;
  const studentId = session.personaId;
  const state = getState();

  const filter = getFilter();

  // students browse open briefs; their past applications live on the dashboard
  const openBriefs = state.briefs.filter((b) => b.status === "open");
  const visible = filter === "ALL" ? openBriefs : openBriefs.filter((b) => b.type === filter);

  const cards = visible.map((b) => {
    const client = select.clientOfBrief(b);
    const app = select.applicationOf(b.id, studentId);
    const cadence = b.payCadence === "monthly" ? "/month" : "fixed · per project";
    const scope = b.scopeItems.slice(0, 3).map((s) => html`<li>${s}</li>`);
    const footer = app
      ? html`<div>${appBadge(app.status)}</div>`
      : html`<a class="btn btn-outline" href="#/briefs/${b.id}">View brief</a>`;
    return html`
      <article class="card">
        <p class="tag">${typeTag(b.type)}</p>
        <h3>${b.title}</h3>
        <p class="sub-line">${client ? client.name : ""} · ${client ? client.town : ""}</p>
        <p class="price">${money(b.studentPay)} <small>${cadence}</small></p>
        <ul class="dash">${scope}</ul>
        <div class="spacer"></div>
        ${footer}
      </article>`;
  });

  const filters = ["ALL", "A", "B", "C"].map((f) => html`
    <button type="button" class="toggle${f === filter ? " on" : ""}" data-filter="${f}" aria-pressed="${f === filter ? "true" : "false"}">${f === "ALL" ? "All" : `[${f}]`}</button>
  `);

  const body = visible.length
    ? html`<div class="cards">${cards}</div>`
    : emptyState("// nothing open in this filter right now — new briefs land most weeks.");

  const root = toNode(html`
    <div class="wrap view-lead">
      ${marker("02", "Marketplace")}
      <div class="section-head" style="margin-top:1rem;">
        <h1>Open briefs. Scoped by the studio.</h1>
        <p class="note">// every brief is pre-scoped and guaranteed — you deliver, we supervise and QA.</p>
      </div>
      <div class="toggle-group" style="margin-bottom:2rem;">${filters}</div>
      ${body}
    </div>`);

  root.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setFilter(btn.getAttribute("data-filter"));
      ctx.navigate("#/marketplace");   // same-route → force re-render
    });
  });

  return root;
}
