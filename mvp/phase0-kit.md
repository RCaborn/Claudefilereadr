# Terna Phase-0 kit — validate before you build

Purpose: put three concrete offers in front of ~10 local SMEs and **count signatures, not
nods**. This is the research doc's sharpened Phase-0 (§8): if the pass criteria aren't met,
the local-density premise is broken — change city or change wedge before building anything
else. Timebox: **2–3 weeks** from first pitch.

## 1. Target profile

Ten digital-native SMEs within cycling distance of St Andrews (include the East Neuk —
Guardbridge, Crail, Anstruther). "Digital-native" = they already run bookings, invoicing, or
a CRM in software, however badly. Roughly 3–30 staff. Good hunting grounds:

- Letting/estate agents, accountancy and bookkeeping practices, solicitors
- Golf tour operators, accommodation and hospitality groups, restaurants with private-dining/events
- Breweries, distilleries, food producers with wholesale order books
- Vets, dental and private clinics
- Trades firms with an office (electrical, plumbing, building) — quote-heavy businesses
- Marketing/web/design shops (they feel the automation gap directly)

Prioritise: (1) warm intros, (2) businesses where you can name the boring job out loud on
first contact ("you're still chasing invoices by hand, aren't you?").

## 2. The three offers (pitch verbatim)

- **Offer A — The Sprint, £1,500 fixed.** One named outcome — invoice-chasing automated, CRM
  cleaned and wired to follow-ups, quotes in minutes, monthly numbers in one report. "We
  deliver it working, or you don't pay."
- **Offer B — The Project, £0 to you.** A graduate on one problem for four weeks,
  subsidy-funded. "We find the funding, scope the work, and supervise every week. You keep
  everything they build."
- **Offer C — The Care Plan, £300/mo.** "We keep your automations and reporting running,
  fix what breaks, and ship one improvement a month. Cancel any time."

**The kicker (ask every single one, after any offer lands):**
> "If they were good, would you pay ~£3,500 to hire them permanently — knowing you'd already
> watched them deliver for a month?"

## 3. Outreach script (in person or short email)

Opening: "I run Terna — we take St Andrews graduates, train them on automation tools, and
use them to take one boring job off a local business's plate. Fixed price, guaranteed, we
supervise everything. Can I show you three ways in — one of them is free?"

Then: hand over (or attach) the one-pagers from `/offers/sprint`, `/offers/project`,
`/offers/careplan`. Ask which boring job eats the most of their week. Offer the 20-minute
scoping call. Ask the kicker before leaving, whatever else happens.

20-minute scoping call agenda: (5) their workflow and where time dies → (10) name one
outcome, agree what "done" looks like → (5) pick an offer, ask for the signature, ask the
kicker.

## 4. Logging rules (the scoreboard only works if these hold)

- Every business pitched gets an **OutreachTarget** row in the admin dashboard, same day.
- A "signature" = a signed one-pager, a paid deposit, or a booked start date in writing.
  Verbal enthusiasm is `interested`, not `signed`.
- Record the kicker answer honestly: `yes` needs a number and no flinch; hedges are
  `leaning_yes`; polite deflection is `no`.
- Log `declined` with the reason in notes — the failure reasons are the wedge-change data.

## 5. Pass criteria and decision tree

**PASS = both of:** ≥3/10 sign Offer A or B **and** ≥5/10 give a credible yes to the kicker.

- **Pass →** proceed: build delivery playbooks for the two most-signed outcomes, recruit the
  first grad cohort (2–3, vetted by work sample), deliver with founder QA on everything, and
  start the first Care-Plan conversions.
- **Fail on signatures, pass on kicker →** the wedge is wrong but the placement engine has
  demand: consider leading with try-before-you-hire instead of sprints.
- **Fail on kicker, pass on signatures →** delivery demand without hiring intent: the model
  drifts toward a services shop — decide deliberately whether that's acceptable (lower
  multiple, per research §6) before continuing.
- **Fail both →** change city or change wedge. Do not build anything else first.

## 6. Watch-list while running Phase-0 (research §7)

- **Guarantee cost**: every remediation is founder time — log hours spent on any miss from
  deal one.
- **Backfill metric**: from the first placement onwards, track whether the client's
  recurring work survives the grad's departure. If backfill fails, the model is drifting to
  pure recruitment.
- **Incumbent flanking**: note every target that says "our accountant/web guy already does
  this" — that's the me-too risk signal.
- **Subsidy fragility**: Offer B depends on discretionary funds (Santander-type,
  growth-hub). Confirm the actual funding rail before pitching B as "free", and never make
  it load-bearing.
