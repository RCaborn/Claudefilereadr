// Terna Studio Portal — entry point / orchestrator.
// Boots the store subscription, resolves routes with role-gating, renders the
// role nav + current view, and wires global chrome (persona switch, reset demo).

import { getState, subscribe, getSession, getPersona, resetDemo } from "./store.js";
import { parseHash, matchRoute, homeFor } from "./router.js";
import { html, toHTML, toNode, logoSvg } from "./ui.js";

import { render as login } from "./views/login.js";
import { render as dashboard } from "./views/dashboard.js";
import { render as marketplace } from "./views/marketplace.js";
import { render as brief } from "./views/brief.js";
import { render as workspace } from "./views/workspace.js";
import { render as portfolio } from "./views/portfolio.js";
import { render as admin } from "./views/admin.js";
import { render as adminBriefs } from "./views/adminBriefs.js";
import { render as adminBrief } from "./views/adminBrief.js";

const VIEWS = { login, dashboard, marketplace, brief, workspace, portfolio, admin, adminBriefs, adminBrief };
// adminBrief serves new / edit modes of the same module
VIEWS.adminBriefNew = (ctx) => adminBrief({ ...ctx, mode: "new" });
VIEWS.adminBriefEdit = (ctx) => adminBrief({ ...ctx, mode: "edit" });

const NAV = {
  student: [
    { hash: "#/dashboard", label: "Dashboard", path: "/dashboard" },
    { hash: "#/marketplace", label: "Marketplace", path: "/marketplace" },
    { hash: "#/portfolio", label: "Portfolio", path: "/portfolio" },
  ],
  admin: [
    { hash: "#/admin", label: "Overview", path: "/admin" },
    { hash: "#/admin/briefs", label: "Briefs", path: "/admin/briefs" },
  ],
};

export function navigate(hash) {
  if (location.hash === hash) renderApp();     // force re-render on same-route nav
  else location.hash = hash;                   // triggers hashchange → renderApp
}

function isActive(navPath, currentPath) {
  if (navPath === "/admin/briefs") return currentPath.startsWith("/admin/briefs");
  return currentPath === navPath;
}

function renderNav(session, currentPath) {
  const nav = document.getElementById("nav");
  if (!nav) return;
  if (!session) { nav.innerHTML = ""; return; }
  const persona = getPersona(session.personaId);
  const links = (NAV[session.role] || []).map((item) => html`
    <a class="nav-link${item.path && isActive(item.path, currentPath) ? " active" : ""}" href="${item.hash}">${item.label}</a>
  `);
  const chip = html`
    <a class="persona-chip" href="#/login" title="Switch persona">
      [${persona ? persona.short : "—"}] <span class="switch">Switch ↺</span>
    </a>`;
  nav.innerHTML = toHTML(html`${links}${chip}`);
}

function renderApp() {
  const app = document.getElementById("app");
  if (!app) return;
  const session = getSession();
  const { path } = parseHash();
  const match = matchRoute(path);

  // ---- role-gating / redirects ----
  if (!session) {
    if (!(match && match.route.view === "login")) { navigate("#/login"); return; }
  } else if (path !== "/login") {
    if (!match) { navigate(homeFor(session.role)); return; }
    if (match.route.role && match.route.role !== session.role) { navigate(homeFor(session.role)); return; }
  }

  // ---- resolve view ----
  const viewName = match ? match.route.view : "login";
  const viewFn = VIEWS[viewName] || login;
  const params = match ? match.params : {};
  const persona = session ? getPersona(session.personaId) : null;

  const ctx = { state: getState(), params, session, persona, navigate };
  let node;
  try {
    node = viewFn(ctx);
  } catch (err) {
    console.error("View render failed:", viewName, err);
    node = toNode(html`<div class="wrap view-section"><p class="note-block">// Something went wrong rendering this view. Try reset demo data.</p></div>`);
  }
  app.replaceChildren(node);
  renderNav(session, path);
  window.scrollTo(0, 0);
}

// ---- wiring ----
function boot() {
  const resetBtn = document.getElementById("reset-demo");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset all demo data back to the seeded state? This clears anything you changed in this browser.")) {
        resetDemo();
        renderApp();
      }
    });
  }
  window.addEventListener("hashchange", renderApp);
  subscribe(renderApp);       // any store mutation re-renders the active view
  renderApp();                // initial paint
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
