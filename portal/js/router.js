// Terna Studio Portal — hash router.
// Pure route table + matcher. View dispatch and role-gating live in app.js.

export const ROUTES = [
  { path: "/login",             view: "login",         role: null },
  { path: "/dashboard",         view: "dashboard",     role: "student" },
  { path: "/marketplace",       view: "marketplace",   role: "student" },
  { path: "/briefs/:id",        view: "brief",         role: "student" },
  { path: "/project/:id",       view: "workspace",     role: "student" },
  { path: "/portfolio",         view: "portfolio",     role: "student" },
  { path: "/admin",             view: "admin",         role: "admin" },
  { path: "/admin/briefs",         view: "adminBriefs",    role: "admin" },
  { path: "/admin/briefs/new",     view: "adminBriefNew",  role: "admin" },
  { path: "/admin/briefs/:id",     view: "adminBrief",     role: "admin" },
  { path: "/admin/briefs/:id/edit",view: "adminBriefEdit", role: "admin" },
];

// current hash → { path } e.g. "#/briefs/brf-01" → "/briefs/brf-01"
export function parseHash() {
  let h = location.hash || "";
  if (h.startsWith("#")) h = h.slice(1);
  if (!h.startsWith("/")) h = "/" + h;
  return { path: h };
}

// match a path against ROUTES; return { route, params } or null
export function matchRoute(path) {
  const segs = path.split("/").filter(Boolean);
  for (const route of ROUTES) {
    const rsegs = route.path.split("/").filter(Boolean);
    if (rsegs.length !== segs.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < rsegs.length; i++) {
      if (rsegs[i].startsWith(":")) params[rsegs[i].slice(1)] = decodeURIComponent(segs[i]);
      else if (rsegs[i] !== segs[i]) { ok = false; break; }
    }
    if (ok) return { route, params };
  }
  return null;
}

export function homeFor(role) {
  return role === "admin" ? "#/admin" : "#/dashboard";
}

// Deep-link preservation across the login redirect. Module state (not
// storage) so it works even where storage access throws.
let pendingHash = null;
export function stashPending(hash) { pendingHash = hash; }
export function takePending() { const h = pendingHash; pendingHash = null; return h; }
