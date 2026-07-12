// Verified portfolio (student) — QA-passed work, presented as a credential.

import { select } from "../store.js";
import { html, toNode, marker, typeTag, dateFmt, emptyState } from "../ui.js";

export function render(ctx) {
  const { session } = ctx;
  const studentId = session.personaId;
  const entries = select.portfolioBy(studentId)
    .slice()
    .sort((a, b) => (b.shippedAt || "").localeCompare(a.shippedAt || ""));

  const clients = new Set(entries.map((e) => e.clientName));
  const towns = new Set(entries.map((e) => e.town).filter(Boolean));

  const stats = entries.length ? html`
    <div class="stats three">
      <div class="stat"><span class="big tnum">${entries.length}</span><span class="cap">Verified ships</span></div>
      <div class="stat"><span class="big tnum">${clients.size}</span><span class="cap">Clients served</span></div>
      <div class="stat"><span class="big tnum">${towns.size}</span><span class="cap">Towns</span></div>
    </div>` : "";

  const cards = entries.map((e) => html`
    <article class="card">
      <div class="between"><p class="tag">${typeTag(e.type)}</p></div>
      <h3>${e.title}</h3>
      <p class="sub-line">${e.clientName} · ${e.town}</p>
      <p>${e.outcomeStatement}</p>
      <ul class="dash">${e.scopeItems.map((s) => html`<li>${s}</li>`)}</ul>
      <div class="spacer"></div>
      <hr class="rule">
      <p class="fine">[✓] Verified by ${e.verifiedBy} · ${e.id} · shipped ${dateFmt(e.shippedAt)}</p>
    </article>`);

  const body = entries.length
    ? html`<div class="cards">${cards}</div>`
    : html`<div class="dark strip"><span class="gmark">[ ]</span><div class="grow"><strong>No ships yet</strong><p>// your first verified ship will appear here. Train → Deliver → Prove.</p></div></div>`;

  const root = toNode(html`
    <div class="wrap view-lead">
      ${marker("04", "Verified portfolio")}
      <div class="section-head" style="margin-top:1rem;">
        <h1>Shipped. Checked. Signed off.</h1>
        <p class="note">// every entry below passed studio QA and ran in a real business.</p>
      </div>
      ${stats}
      ${body}
    </div>`);

  return root;
}
