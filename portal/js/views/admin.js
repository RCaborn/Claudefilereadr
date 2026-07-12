// Admin overview — KPIs + applications queue + QA queue.

import { getState, select, actions } from "../store.js";
import { html, toNode, marker, typeTag, dateFmt, emptyState, toast, decisionCell, wireDecisions } from "../ui.js";

export function render(ctx) {
  const state = getState();
  const openBriefs = state.briefs.filter((b) => b.status === "open");
  const pending = state.applications.filter((a) => a.status === "pending");
  const awaitingQA = state.deliverables.filter((d) => d.status === "submitted");
  const ships = state.portfolio.length;

  const stats = html`
    <div class="stats">
      <div class="stat"><span class="big tnum">${openBriefs.length}</span><span class="cap">Open briefs</span></div>
      <div class="stat"><span class="big tnum">${pending.length}</span><span class="cap">Pending applications</span></div>
      <div class="stat"><span class="big tnum">${awaitingQA.length}</span><span class="cap">Awaiting QA</span></div>
      <div class="stat"><span class="big tnum">${ships}</span><span class="cap">Verified ships</span></div>
    </div>`;

  // ---- applications queue ----
  const appRows = pending
    .slice()
    .sort((a, b) => (a.submittedAt || "").localeCompare(b.submittedAt || ""))
    .map((a) => {
      const student = select.student(a.studentId);
      const brief = select.brief(a.briefId);
      return html`
        <tr>
          <td><span class="cell-strong">${student ? student.name : a.studentId}</span><br><span class="cell-sub">${student ? student.stage : ""} · ${student ? student.degree : ""}</span></td>
          <td><a href="#/admin/briefs/${a.briefId}">${brief ? brief.title : a.briefId}</a><br><span class="cell-sub">${brief ? typeTag(brief.type) : ""}</span></td>
          <td>${a.note}</td>
          <td class="num">${dateFmt(a.submittedAt)}</td>
          <td>${decisionCell(a.id)}</td>
        </tr>`;
    });
  const appsQueue = pending.length
    ? html`<div class="table-wrap"><table class="data">
        <thead><tr><th>Applicant</th><th>Brief</th><th>Note</th><th class="num">Applied</th><th></th></tr></thead>
        <tbody>${appRows}</tbody></table></div>`
    : emptyState("// applications queue clear — nothing awaiting a decision.");

  // ---- QA queue ----
  const qaRows = awaitingQA
    .slice()
    .sort((a, b) => (a.submittedAt || "").localeCompare(b.submittedAt || ""))
    .map((d) => {
      const student = select.student(d.studentId);
      const brief = select.brief(d.briefId);
      return html`
        <tr>
          <td><span class="cell-strong">${d.title}</span><br><span class="cell-sub">v${d.version}</span></td>
          <td>${student ? student.name : d.studentId}</td>
          <td><a href="#/admin/briefs/${d.briefId}">${brief ? brief.title : d.briefId}</a></td>
          <td class="num">${dateFmt(d.submittedAt)}</td>
          <td><a class="btn btn-outline btn-sm" href="#/admin/briefs/${d.briefId}">Review →</a></td>
        </tr>`;
    });
  const qaQueue = awaitingQA.length
    ? html`<div class="table-wrap"><table class="data">
        <thead><tr><th>Deliverable</th><th>Member</th><th>Brief</th><th class="num">Submitted</th><th></th></tr></thead>
        <tbody>${qaRows}</tbody></table></div>`
    : emptyState("// QA queue clear — nothing awaiting review.");

  const root = toNode(html`
    <div class="wrap view-lead">
      ${marker("01", "Studio overview")}
      <div class="between" style="margin-top:1rem;">
        <h1>The studio floor.</h1>
        <a class="btn btn-solid" href="#/admin/briefs/new">+ Post brief</a>
      </div>
      ${stats}
      <div class="block">
        <div class="block-head"><h2>Applications</h2><a class="crumb" href="#/admin/briefs" style="margin:0;">All briefs →</a></div>
        ${appsQueue}
      </div>
      <div class="block">
        <div class="block-head"><h2>Awaiting QA</h2></div>
        ${qaQueue}
      </div>
    </div>`);

  // ---- wiring ----
  wireDecisions(root, {
    onAccept: (id) => {
      const r = actions.acceptApplication(id);
      if (r.ok) toast("Brief assigned — other applicants declined.");
      else toast(r.error || "Could not accept.", "✗");
    },
    onDecline: (id, reason) => {
      const r = actions.declineApplication(id, reason);
      if (r.ok) toast("Application declined.");
    },
  });

  return root;
}
