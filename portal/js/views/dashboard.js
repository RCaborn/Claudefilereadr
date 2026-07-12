// Student dashboard — membership, KPIs, engagements, deadlines, pay, applications.

import { select, actions } from "../store.js";
import { html, toNode, marker, typeTag, money, dateFmt, relDue, briefBadge, appBadge, payBadge, meter, stagePath, emptyState, isOverdue, toast } from "../ui.js";

const ACTIVE = ["assigned", "in_delivery", "in_qa"];

export function render(ctx) {
  const { session } = ctx;
  const studentId = session.personaId;
  const student = select.student(studentId);
  const briefs = select.briefsFor(studentId);
  const active = briefs.filter((b) => ACTIVE.includes(b.status));
  const payments = select.paymentsBy(studentId);
  const pf = select.portfolioBy(studentId);
  const apps = select.applicationsBy(studentId).filter((a) => a.status !== "accepted");

  const paid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const due = payments.filter((p) => p.status === "due").reduce((s, p) => s + p.amount, 0);

  // ---- KPI row ----
  const stats = html`
    <div class="stats">
      <div class="stat"><span class="big tnum">${active.length}</span><span class="cap">Active engagements</span></div>
      <div class="stat"><span class="big tnum">${money(paid)}</span><span class="cap">Paid to date</span></div>
      <div class="stat"><span class="big tnum">${money(due)}</span><span class="cap">Outstanding / due</span></div>
      <div class="stat"><span class="big tnum">${pf.length}</span><span class="cap">Verified ships</span></div>
    </div>`;

  // ---- active engagement cards ----
  const engCards = active.map((b) => {
    const client = select.clientOfBrief(b);
    const doneCount = b.milestones.filter((m) => m.done).length;
    return html`
      <article class="card">
        <div class="between"><p class="tag">${typeTag(b.type)}</p>${briefBadge(b.status)}</div>
        <h3>${b.title}</h3>
        <p class="sub-line">${client ? client.name : ""} · ${client ? client.town : ""}</p>
        <div class="spacer"></div>
        <p>${meter(doneCount, b.milestones.length)}</p>
        <p class="fine">Due ${dateFmt(b.dueAt)} · ${relDue(b.dueAt)}</p>
        <a class="btn btn-outline" href="#/project/${b.id}">Open workspace →</a>
      </article>`;
  });
  const engagements = active.length
    ? html`<div class="cards">${engCards}</div>`
    : emptyState("// no active engagements — head to the marketplace and apply for a brief.");

  // ---- upcoming deadlines ----
  const deadlineRows = active
    .slice()
    .sort((a, b) => (a.dueAt || "").localeCompare(b.dueAt || ""))
    .map((b) => {
      const nextM = b.milestones.find((m) => !m.done);
      return html`
        <tr>
          <td><span class="cell-strong"><a href="#/project/${b.id}">${b.title}</a></span></td>
          <td>${nextM ? nextM.title : html`<span class="muted">All milestones done</span>`}</td>
          <td class="num">${dateFmt(b.dueAt)}</td>
          <td class="num"><span style="${isOverdue(b.dueAt) ? "font-weight:700;" : "color:var(--grey);"}">${relDue(b.dueAt)}</span></td>
        </tr>`;
    });
  const deadlines = active.length
    ? html`<div class="table-wrap"><table class="data">
        <thead><tr><th>Engagement</th><th>Next up</th><th class="num">Due</th><th class="num">When</th></tr></thead>
        <tbody>${deadlineRows}</tbody></table></div>`
    : emptyState("// nothing scheduled yet.");

  // ---- pay summary ----
  const payRows = payments
    .slice()
    .sort((a, b) => (b.dueAt || "").localeCompare(a.dueAt || ""))
    .map((p) => html`
      <tr>
        <td>${p.label}</td>
        <td class="num">${money(p.amount)}</td>
        <td>${payBadge(p.status)}</td>
        <td class="num">${p.status === "paid" ? dateFmt(p.paidAt) : dateFmt(p.dueAt)}</td>
      </tr>`);
  const paySummary = payments.length
    ? html`<div class="table-wrap"><table class="data">
        <thead><tr><th>Item</th><th class="num">Amount</th><th>Status</th><th class="num">Date</th></tr></thead>
        <tbody>${payRows}
          <tr class="total"><td>Paid to date</td><td class="num">${money(paid)}</td><td></td><td class="num">${money(due)} due</td></tr>
        </tbody></table></div>`
    : emptyState("// no payments yet — your first ship starts the ledger.");

  // ---- applications ----
  const appRows = apps.map((a) => {
    const b = select.brief(a.briefId);
    return html`
      <tr>
        <td><a href="#/briefs/${a.briefId}">${b ? b.title : a.briefId}</a></td>
        <td>${appBadge(a.status)}</td>
        <td class="num">${dateFmt(a.submittedAt)}</td>
        <td>${a.status === "declined" && a.declineReason
          ? html`<span class="cell-sub">${a.declineReason}</span>`
          : a.status === "pending"
            ? html`<button type="button" class="btn btn-outline btn-sm" data-withdraw="${a.id}">Withdraw</button>`
            : ""}</td>
      </tr>`;
  });
  const applications = apps.length
    ? html`<div class="table-wrap"><table class="data">
        <thead><tr><th>Brief</th><th>Status</th><th class="num">Applied</th><th>Note</th></tr></thead>
        <tbody>${appRows}</tbody></table></div>`
    : emptyState("// no open applications.");

  const root = toNode(html`
    <div class="wrap view-lead">
      ${marker("01", "Dashboard")}
      <h1 style="margin-top:1rem;">Hello, ${student ? student.name.split(" ")[0] : "there"}.</h1>

      <div class="dark strip" style="margin-top:1.6rem;">
        <span class="gmark" aria-hidden="true">[✓]</span>
        <div class="grow">
          <strong>Member in good standing</strong>
          <p>${student ? student.cohort : ""} · vetted on a work sample, not a CV.</p>
          <div style="margin-top:0.8rem;">${stagePath(student ? student.stage : "train", true)}</div>
        </div>
      </div>

      ${stats}

      <div class="block">
        <div class="block-head"><h2>Active engagements</h2></div>
        ${engagements}
      </div>

      <div class="block">
        <div class="block-head"><h2>Upcoming deadlines</h2></div>
        ${deadlines}
      </div>

      <div class="block">
        <div class="block-head"><h2>Pay</h2></div>
        ${paySummary}
      </div>

      <div class="block">
        <div class="block-head"><h2>Applications</h2></div>
        ${applications}
      </div>
    </div>`);

  root.querySelectorAll("[data-withdraw]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = actions.withdrawApplication(btn.getAttribute("data-withdraw"));
      if (r.ok) toast("Application withdrawn.");
    });
  });

  return root;
}
