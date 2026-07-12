# Terna Studio Portal

The studio-side web app where St Andrews graduates browse briefs, deliver
projects under studio supervision, and build a verified portfolio — and where
the studio posts briefs, accepts applications, and signs off QA.

It's a **static front-end prototype**: plain HTML + CSS + vanilla JavaScript
(ES modules), no build step, no server, no framework. All state lives in the
browser's `localStorage`, seeded with realistic demo data. It reuses the Terna
marketing-site design system (see `../site/`) so it's on brand out of the box.

## Run it

ES modules need to be served over HTTP (not opened as `file://`):

```bash
cd ..            # repo root (the parent of portal/)
python3 -m http.server 8000
# then open http://localhost:8000/portal/
```

Any static host works too — GitHub Pages, Netlify, or a `portal.terna.studio`
subdomain. Just serve the `portal/` directory.

## Demo personas (no passwords)

Pick one on the sign-in screen; switch any time from the header chip.

| Persona | Role | What they show off |
|---|---|---|
| **Isla Robertson** | Student (Prove) | Two active engagements, one awaiting QA, a shipped portfolio entry, pay history |
| **Tom Okafor** | Student (Deliver) | A Care Plan mid-remediation, monthly pay |
| **Freya MacLeod** | Student (Train) | Fresh member — empty states + a pending application |
| **Eilidh Bruce** | Studio admin | Post briefs, accept/decline applications, record QA verdicts |

## The delivery loop

Admin posts a brief → student applies in the **marketplace** → admin accepts
(auto-declining rivals, releasing a due payment) → student ticks **milestones**
and submits a deliverable in the **workspace** → admin records a **QA verdict**.
A pass mints a **verified portfolio** entry and marks the payment paid; a fail
sends a remediation note back for the student to resubmit.

## Layout

```
portal/
├── index.html          app shell (header, mount point, footer)
├── css/portal.css      design system (ported tokens) + portal components
└── js/
    ├── app.js          boot, role-gated routing, nav, persona switch
    ├── router.js       hash route table + matcher
    ├── store.js        state, localStorage, seed/reset, all domain actions
    ├── seed.js         SEED_VERSION + demo dataset
    ├── ui.js           safe templating + Terna-idiom components
    └── views/          login · dashboard · marketplace · brief · workspace ·
                        portfolio · admin · adminBriefs · adminBrief
```

## Resetting

The footer's **`// reset demo data`** link restores the seeded state. The store
also auto-reseeds when `SEED_VERSION` in `seed.js` is bumped, so schema changes
never leave a stale store behind.
