// Login / persona picker — the prototype "sign in".

import { getPersonas, setSession } from "../store.js";
import { html, toNode, logoSvg, stagePath } from "../ui.js";
import { homeFor, matchRoute, takePending } from "../router.js";

export function render(ctx) {
  const personas = getPersonas();
  const students = personas.filter((p) => p.role === "student");
  const admins = personas.filter((p) => p.role === "admin");

  const studentCards = students.map((p) => {
    const s = p.meta;
    return html`
      <button type="button" class="card" data-persona="${p.id}" style="text-align:left;cursor:pointer;">
        <p class="tag">[Student]</p>
        <h3>${s.name}</h3>
        <p class="sub-line">${s.degree}</p>
        <p class="sub-line">${s.cohort}</p>
        <div class="spacer"></div>
        ${stagePath(s.stage)}
        <p class="fine">${s.bio}</p>
      </button>`;
  });

  const adminCards = admins.map((p) => html`
    <button type="button" class="card dark" data-persona="${p.id}" style="text-align:left;cursor:pointer;">
      <p class="tag">[Studio]</p>
      <h3>${p.meta.name}</h3>
      <p class="sub-line" style="color:var(--on-ink-dim);">${p.meta.title}</p>
      <div class="spacer"></div>
      <p class="fine" style="color:var(--on-ink-dim);">Post briefs, accept applications, sign off QA. The studio side of the loop.</p>
    </button>`);

  const root = toNode(html`
    <div class="wrap view-lead">
      <div style="margin-bottom:2rem;color:var(--ink);">${logoSvg(64, 3.5)}</div>
      <h1>Pick a persona.</h1>
      <p class="note" style="margin-top:1.4rem;">// prototype sign-in — no passwords, all data lives in this browser.</p>
      <div class="cards" style="margin-top:2.4rem;">
        ${studentCards}${adminCards}
      </div>
      <p class="note" style="margin-top:2rem;">// switch personas any time from the header to walk both sides of the studio.</p>
    </div>`);

  root.querySelectorAll("[data-persona]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const session = setSession(btn.getAttribute("data-persona"));
      if (!session) return;
      // resume a stashed deep link if this persona's role is allowed there
      const pending = takePending();
      if (pending) {
        let path = pending.startsWith("#") ? pending.slice(1) : pending;
        if (!path.startsWith("/")) path = "/" + path;
        const m = matchRoute(path);
        if (m && (!m.route.role || m.route.role === session.role)) { ctx.navigate(pending); return; }
      }
      ctx.navigate(homeFor(session.role));
    });
  });

  return root;
}
