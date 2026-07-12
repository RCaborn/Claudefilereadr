// Admin briefs list — every brief, any status.

import { getState, select } from "../store.js";
import { html, toNode, marker, typeTag, money, dateFmt, briefBadge } from "../ui.js";

export function render(ctx) {
  const state = getState();
  const briefs = state.briefs.slice().sort((a, b) => (b.postedAt || "").localeCompare(a.postedAt || ""));

  const rows = briefs.map((b) => {
    const client = select.clientOfBrief(b);
    const assignee = b.assignedStudentId ? select.student(b.assignedStudentId) : null;
    const pendingCount = select.applicationsFor(b.id).filter((a) => a.status === "pending").length;
    return html`
      <tr>
        <td><span class="cell-strong"><a href="#/admin/briefs/${b.id}">${b.title}</a></span><br><span class="cell-sub">${typeTag(b.type)} · ${b.id}</span></td>
        <td>${client ? client.name : ""}<br><span class="cell-sub">${client ? client.town : ""}</span></td>
        <td>${briefBadge(b.status)}${pendingCount ? html`<br><span class="cell-sub">${pendingCount} pending</span>` : ""}</td>
        <td>${assignee ? assignee.name : html`<span class="muted">—</span>`}</td>
        <td class="num">${money(b.studentPay)}${b.payCadence === "monthly" ? "/mo" : ""}</td>
        <td class="num">${dateFmt(b.dueAt)}</td>
      </tr>`;
  });

  const root = toNode(html`
    <div class="wrap view-lead">
      ${marker("02", "Briefs")}
      <div class="between" style="margin-top:1rem;">
        <h1>Every brief on the board.</h1>
        <a class="btn btn-solid" href="#/admin/briefs/new">+ Post brief</a>
      </div>
      <div class="table-wrap" style="margin-top:1.6rem;"><table class="data">
        <thead><tr><th>Brief</th><th>Client</th><th>Status</th><th>Assignee</th><th class="num">Pay</th><th class="num">Due</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </div>`);

  return root;
}
