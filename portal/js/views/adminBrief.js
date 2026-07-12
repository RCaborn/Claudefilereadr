// Admin brief workbench — post/edit a brief, decide applications, record QA verdicts.

import { getState, select, actions } from "../store.js";
import { html, toNode, marker, typeTag, typeName, money, dateFmt, relDue, briefBadge, appBadge, dlvBadge, emptyState, toast } from "../ui.js";

const PAY_DEFAULT = { A: 650, B: 1760, C: 120 };

export function render(ctx) {
  if (ctx.mode === "new") return renderForm(ctx, null);
  const brief = select.brief(ctx.params.id);
  if (!brief) { ctx.navigate("#/admin/briefs"); return document.createElement("div"); }
  if (ctx.mode === "edit") return renderForm(ctx, brief);
  return renderWorkbench(ctx, brief);
}

// ---------- new / edit form ----------
function renderForm(ctx, brief) {
  const state = getState();
  const isNew = !brief;
  const type0 = brief ? brief.type : "A";
  const clientOptions = state.clients.map((c) => html`<option value="${c.id}"${brief && brief.clientId === c.id ? " selected" : ""}>${c.name} · ${c.town}</option>`);
  const typeToggles = ["A", "B", "C"].map((t) => html`
    <button type="button" class="toggle${t === type0 ? " on" : ""}" data-type="${t}">[${t}] ${typeName(t)}</button>`);

  const root = toNode(html`
    <div class="wrap view-lead">
      <a class="crumb" href="${isNew ? "#/admin" : `#/admin/briefs/${brief.id}`}">← ${isNew ? "Overview" : "Back to brief"}</a>
      ${marker(isNew ? "NEW" : "EDIT", isNew ? "Post a brief" : "Edit brief")}
      <h1 style="margin-top:1rem;">${isNew ? "Scope a new brief." : brief.title}</h1>

      <form class="form" id="brief-form" style="margin-top:1.6rem;">
        <div class="field">
          <span class="field-label">Type</span>
          <div class="toggle-group">${typeToggles}</div>
          <input type="hidden" name="type" value="${type0}">
        </div>
        <div class="field">
          <label for="bf-title">Named outcome</label>
          <p class="hint">// what the client gets, in plain words.</p>
          <input type="text" id="bf-title" name="title" value="${brief ? brief.title : ""}" placeholder="Overdue invoices, chased automatically" required>
        </div>
        <div class="field-inline">
          <div class="field">
            <label for="bf-client">Client</label>
            <select id="bf-client" name="clientId"${brief && brief.status !== "open" ? " disabled" : ""}>${clientOptions}</select>
          </div>
          <div class="field">
            <label for="bf-due">Due date</label>
            <input type="date" id="bf-due" name="dueAt" value="${brief ? brief.dueAt : ""}">
          </div>
        </div>
        <div class="field">
          <label for="bf-summary">Summary</label>
          <textarea id="bf-summary" name="summary" rows="3" placeholder="Two sentences in the studio voice.">${brief ? brief.summary : ""}</textarea>
        </div>
        <div class="field">
          <label for="bf-scope">Scope items</label>
          <p class="hint">// one per line — rendered as the checklist and the scope bullets.</p>
          <textarea id="bf-scope" name="scopeText" rows="4">${brief ? brief.scopeItems.join("\n") : ""}</textarea>
        </div>
        <div class="field">
          <label for="bf-milestones">Milestones</label>
          <p class="hint">// one per line — the delivery checklist the member ticks.</p>
          <textarea id="bf-milestones" name="milestonesText" rows="4">${brief ? brief.milestones.map((m) => m.title).join("\n") : ""}</textarea>
        </div>
        <div class="field-inline">
          <div class="field">
            <label for="bf-pay">Student pay (£)</label>
            <input type="number" id="bf-pay" name="pay" min="0" step="10" value="${brief ? brief.studentPay / 100 : PAY_DEFAULT[type0]}">
          </div>
          <div class="field">
            <label for="bf-note">Studio note</label>
            <input type="text" id="bf-note" name="note" value="${brief ? brief.note : ""}" placeholder="// context for the member">
          </div>
        </div>
        <div class="row">
          <button type="submit" class="btn btn-solid">${isNew ? "Post brief" : "Save changes"}</button>
          <a class="btn btn-outline" href="${isNew ? "#/admin/briefs" : `#/admin/briefs/${brief.id}`}">Cancel</a>
        </div>
      </form>
    </div>`);

  // type toggle → sync hidden input + pay default
  const typeInput = root.querySelector('input[name="type"]');
  const payInput = root.querySelector('input[name="pay"]');
  root.querySelectorAll("[data-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const t = btn.getAttribute("data-type");
      typeInput.value = t;
      root.querySelectorAll("[data-type]").forEach((b) => b.classList.toggle("on", b === btn));
      if (isNew) payInput.value = PAY_DEFAULT[t];
    });
  });

  root.querySelector("#brief-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target.elements;
    const payload = {
      type: f.type.value,
      title: f.title.value,
      clientId: f.clientId.value,
      summary: f.summary.value,
      scopeText: f.scopeText.value,
      milestonesText: f.milestonesText.value,
      studentPay: Math.round(Number(f.pay.value) * 100) || 0,
      dueAt: f.dueAt.value,
      note: f.note.value,
    };
    if (isNew) {
      const r = actions.createBrief(payload);
      if (r.ok) { toast("Brief posted — now open in the marketplace."); ctx.navigate(`#/admin/briefs/${r.brief.id}`); }
    } else {
      const r = actions.updateBrief(brief.id, payload);
      if (r.ok) { toast("Brief updated."); ctx.navigate(`#/admin/briefs/${brief.id}`); }
    }
  });

  return root;
}

// ---------- detail workbench ----------
function renderWorkbench(ctx, brief) {
  const client = select.clientOfBrief(brief);
  const assignee = brief.assignedStudentId ? select.student(brief.assignedStudentId) : null;
  const apps = select.applicationsFor(brief.id);
  const deliverables = select.deliverablesFor(brief.id).slice().sort((a, b) => (b.submittedAt || "").localeCompare(a.submittedAt || ""));

  // applications
  const appRows = apps
    .slice()
    .sort((a, b) => (a.submittedAt || "").localeCompare(b.submittedAt || ""))
    .map((a) => {
      const student = select.student(a.studentId);
      const actionsCell = a.status === "pending"
        ? html`<div class="row-actions">
            <button type="button" class="btn btn-solid btn-sm" data-accept="${a.id}">Accept</button>
            <button type="button" class="btn btn-outline btn-sm" data-decline="${a.id}">Decline</button>
          </div>`
        : html`${appBadge(a.status)}${a.status === "declined" && a.declineReason ? html`<br><span class="cell-sub">${a.declineReason}</span>` : ""}`;
      return html`
        <tr>
          <td><span class="cell-strong">${student ? student.name : a.studentId}</span><br><span class="cell-sub">${student ? student.stage : ""}</span></td>
          <td>${a.note}</td>
          <td class="num">${dateFmt(a.submittedAt)}</td>
          <td>${actionsCell}</td>
        </tr>`;
    });
  const appsSection = apps.length
    ? html`<div class="table-wrap"><table class="data">
        <thead><tr><th>Applicant</th><th>Note</th><th class="num">Applied</th><th></th></tr></thead>
        <tbody>${appRows}</tbody></table></div>`
    : emptyState("// no applications on this brief yet.");

  // deliverables + QA
  const dlvBlocks = deliverables.map((d) => {
    const student = select.student(d.studentId);
    let qaZone;
    if (d.status === "submitted") {
      qaZone = html`
        <form class="form qa-form" data-dlv="${d.id}" style="max-width:100%;gap:0.9rem;margin-top:0.4rem;">
          <div class="field">
            <span class="field-label">Verdict</span>
            <div class="toggle-group">
              <button type="button" class="toggle" data-verdict="pass">[✓] Pass</button>
              <button type="button" class="toggle" data-verdict="fail">[✗] Fail</button>
            </div>
            <input type="hidden" name="verdict" value="">
          </div>
          <div class="field">
            <label>QA note</label>
            <p class="hint">// pass note becomes the portfolio verification line — fail note goes back as remediation.</p>
            <textarea name="note" rows="2"></textarea>
          </div>
          <div><button type="submit" class="btn btn-solid btn-sm">Record verdict</button></div>
        </form>`;
    } else if (d.qa) {
      const cls = d.qa.verdict === "pass" ? "callout pass" : "callout";
      const label = d.qa.verdict === "pass" ? "[ ✓ Passed ]" : "[ ✗ Failed — remediation sent ]";
      qaZone = html`<div class="${cls === "callout pass" ? "callout pass" : "callout"}"><span class="c-label">${label}</span><p>${d.qa.note}</p><p class="d-meta" style="${d.qa.verdict === "pass" ? "color:var(--on-ink-soft);" : ""}">reviewed ${dateFmt(d.qa.reviewedAt)}</p></div>`;
    } else qaZone = "";

    const histNote = d.history.length ? html`<p class="d-meta">${d.history.length} earlier version${d.history.length > 1 ? "s" : ""} · now v${d.version}</p>` : "";

    return html`
      <div class="deliverable">
        <div class="d-head">
          <span class="d-title">${d.title} <span class="d-meta">v${d.version} · ${student ? student.name : ""}</span></span>
          ${dlvBadge(d.status)}
        </div>
        ${d.url ? html`<p class="d-meta"><a href="${d.url}" target="_blank" rel="noopener">${d.url}</a></p>` : ""}
        ${d.notes ? html`<p>${d.notes}</p>` : ""}
        ${histNote}
        ${qaZone}
      </div>`;
  });
  const dlvSection = deliverables.length
    ? html`<div class="stack">${dlvBlocks}</div>`
    : emptyState("// nothing submitted for QA yet.");

  const root = toNode(html`
    <div class="wrap view-lead">
      <a class="crumb" href="#/admin/briefs">← All briefs</a>
      <div class="between">
        <p class="tag" style="font-family:var(--mono);font-weight:700;letter-spacing:0.18em;text-transform:uppercase;font-size:0.8rem;">${typeTag(brief.type)}</p>
        ${briefBadge(brief.status)}
      </div>
      <h1 style="margin-top:0.6rem;">${brief.title}</h1>
      <p class="sub-line">${client ? client.name : ""} · ${client ? client.town : ""}</p>
      <p style="margin-top:1rem;max-width:44rem;">${brief.summary}</p>
      <p class="fine" style="margin-top:0.8rem;">${money(brief.studentPay)}${brief.payCadence === "monthly" ? " / month" : ""} · Due ${dateFmt(brief.dueAt)} · ${relDue(brief.dueAt)} · ${assignee ? html`assigned to ${assignee.name}` : "unassigned"}</p>

      <div class="block" style="margin-top:2.4rem;">
        <div class="block-head"><h2>Applications</h2></div>
        ${appsSection}
      </div>

      <div class="block">
        <div class="block-head"><h2>Deliverables &amp; QA</h2></div>
        ${dlvSection}
      </div>

      <details class="block">
        <summary class="linkish" style="cursor:pointer;">// edit this brief</summary>
        <div style="margin-top:1.2rem;">
          <a class="btn btn-outline btn-sm" href="#/admin/briefs/${brief.id}/edit">Open editor</a>
          <p class="note" style="margin-top:0.6rem;">// type and client lock once a brief is assigned.</p>
        </div>
      </details>
    </div>`);

  // ---- wiring ----
  root.querySelectorAll("[data-accept]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = actions.acceptApplication(btn.getAttribute("data-accept"));
      if (r.ok) toast("Brief assigned — other applicants declined.");
      else toast(r.error || "Could not accept.", "✗");
    });
  });
  root.querySelectorAll("[data-decline]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const reason = prompt("Reason for declining (optional — sent to the applicant):", "");
      if (reason === null) return;
      const r = actions.declineApplication(btn.getAttribute("data-decline"), reason);
      if (r.ok) toast("Application declined.");
    });
  });

  root.querySelectorAll("form.qa-form").forEach((form) => {
    const verdictInput = form.querySelector('input[name="verdict"]');
    form.querySelectorAll("[data-verdict]").forEach((btn) => {
      btn.addEventListener("click", () => {
        verdictInput.value = btn.getAttribute("data-verdict");
        form.querySelectorAll("[data-verdict]").forEach((b) => b.classList.toggle("on", b === btn));
      });
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const verdict = verdictInput.value;
      if (!verdict) { toast("Pick pass or fail first.", "!"); return; }
      const note = form.elements.note.value;
      const r = actions.recordQaVerdict(form.getAttribute("data-dlv"), verdict, note);
      if (r.ok && r.verdict === "pass") toast("Shipped — portfolio entry minted, payment released.");
      else if (r.ok) toast("Sent back for remediation.");
      else toast(r.error || "Could not record verdict.", "✗");
    });
  });

  return root;
}
