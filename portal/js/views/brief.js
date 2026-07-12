// Brief detail + apply flow (student).

import { select, actions } from "../store.js";
import { html, toNode, marker, typeName, money, dateFmt, relDue, appBadge, toast, isOverdue } from "../ui.js";

export function render(ctx) {
  const { params, session } = ctx;
  const studentId = session.personaId;
  const b = select.brief(params.id);

  if (!b) { ctx.navigate("#/marketplace"); return document.createElement("div"); }

  const client = select.clientOfBrief(b);
  const app = select.applicationOf(b.id, studentId);
  const cadence = b.payCadence === "monthly" ? "/month" : "fixed · one-off";
  const scope = b.scopeItems.map((s) => html`<li>${s}</li>`);

  // apply panel state
  let applyPanel;
  if (app) {
    applyPanel = html`
      <div class="stack">
        <div class="status-line">${appBadge(app.status)}<span class="note">applied ${dateFmt(app.submittedAt)}</span></div>
        ${app.status === "declined" && app.declineReason
          ? html`<div class="callout"><span class="c-label">[ Studio note ]</span><p>${app.declineReason}</p></div>` : ""}
        ${app.note ? html`<p class="note-block">// your note: ${app.note}</p>` : ""}
        ${app.status === "pending"
          ? html`<div><button type="button" class="btn btn-outline btn-sm" id="withdraw-app">Withdraw application</button></div>` : ""}
      </div>`;
  } else if (b.status === "open") {
    applyPanel = html`
      <form class="form" id="apply-form" style="max-width:38rem;">
        <div class="field">
          <label for="apply-note">Your application</label>
          <p class="hint">// one paragraph: why you, and one question you'd ask the client.</p>
          <textarea id="apply-note" name="note" rows="4" required></textarea>
        </div>
        <div><button type="submit" class="btn btn-solid">Apply for this brief</button></div>
      </form>`;
  } else {
    applyPanel = html`<p class="note-block">// this brief is no longer open — it's been assigned to a member.</p>`;
  }

  const root = toNode(html`
    <div class="wrap view-lead">
      <a class="crumb" href="#/marketplace">← Marketplace</a>
      ${marker(`[${b.type}]`, typeName(b.type))}
      <div class="section-head" style="margin-top:1rem;">
        <h1>${b.title}</h1>
        <p class="sub-line">${client ? client.name : ""} · ${client ? client.town : ""}${client ? html` · ${client.sector}` : ""}</p>
        <p>${b.summary}</p>
      </div>

      <div class="cards two" style="margin-bottom:2.6rem;align-items:start;">
        <article class="card on-card">
          <p class="tag">[ The scope ]</p>
          <ul class="dash">${scope}</ul>
          <p class="price" style="border:0;padding:0;margin-top:0.4rem;">${money(b.studentPay)} <small>${cadence}</small></p>
          <p class="fine">Due ${dateFmt(b.dueAt)} · <span style="${isOverdue(b.dueAt) ? "color:var(--ink);font-weight:700;" : ""}">${relDue(b.dueAt)}</span></p>
        </article>
        <article class="card">
          <p class="tag">[ What the studio provides ]</p>
          <ul class="dash">
            <li>A brief already scoped — no guessing what the client wants</li>
            <li>Weekly supervision and a named studio contact</li>
            <li>QA on every delivery before it reaches the client</li>
            <li>The outcome underwritten by the Terna guarantee</li>
          </ul>
          ${b.note ? html`<p class="fine">${b.note}</p>` : ""}
        </article>
      </div>

      <div class="block">
        <div class="block-head"><h2>Apply</h2></div>
        ${applyPanel}
      </div>
    </div>`);

  const form = root.querySelector("#apply-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = form.elements.note.value;
      const res = actions.applyToBrief(b.id, studentId, note);
      if (res.ok) toast("Application sent — the studio will review it.");
      else toast(res.error || "Could not apply.", "✗");
    });
  }

  const withdrawBtn = root.querySelector("#withdraw-app");
  if (withdrawBtn && app) {
    withdrawBtn.addEventListener("click", () => {
      const r = actions.withdrawApplication(app.id);
      if (r.ok) toast("Application withdrawn.");
    });
  }

  return root;
}
