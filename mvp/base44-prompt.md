# Terna MVP — Base44 prompt pack

How to use: paste **Prompt 1** into Base44 as a new app and let it build. Review the result,
then paste **Prompts 2–4** one at a time as follow-up messages, checking the app between each.
Don't paste them all at once — staged prompts keep the builder focused and let you catch drift
early. After Prompt 4, run `mvp/launch-checklist.md`.

---

## Prompt 1 — Master build

```
Build a website + intake app for TERNA, a graduate talent studio in St Andrews, Fife,
Scotland. Terna sells fixed-price, guaranteed business-automation outcomes to local small
businesses, delivered by vetted graduates under studio supervision, and places those
graduates into permanent jobs after clients have watched them work.

The app has three parts: (1) a two-page public marketing site, (2) two public intake forms
that write to a database and notify me by email, (3) a private admin dashboard only I can
access. Reproduce all copy below EXACTLY as written — do not paraphrase, "improve", or add
marketing copy of your own.

=== DESIGN SYSTEM (strict) ===
Monochrome, editorial, print-inspired. No images, no stock photos, no icons except the
typographic marks described below.
- Page background cream #EFEDE3; card background #F7F5EC; all text near-black ink #14130F;
  secondary text grey #6E6A5C; hairline borders #D9D5C6. NO other colours anywhere — no
  blues, no gradients, no accent colour. Hover states invert (black bg ↔ cream text).
- Headings: monospace font (Space Mono or JetBrains Mono), bold, UPPERCASE, slight
  letterspacing. Body: neutral sans-serif (Helvetica/system), 17px, line-height 1.65.
- Wordmark: "TERNA" letterspaced wide, preceded by a bracket mark "[T]" (the letter T inside
  square brackets, drawn as a simple black glyph).
- Tagline: "CURATED · VETTED · LOCAL".
- Buttons: rectangular, 2px solid black border, monospace bold label. Primary = solid black
  with cream text; secondary = transparent with black text. On dark sections, invert.
- Section markers: a small black pill badge with a white monospace number ("01"–"07") next
  to an UPPERCASE letterspaced grey label. Every section starts with one.
- Some sections are dark strips: solid black #14130F background, cream text, grey-cream
  secondary text (#B9B6A8).
- Cards: cream background, 1.5px solid black border, generous padding. Bullet lists use an
  em-dash "—" as the bullet character.
- Fully responsive; at mobile widths cards and columns stack to one column. No horizontal
  scrolling at 390px.

=== PAGE 1: HOME (route "/") — audience: small-business owners ===
Header: [T] TERNA left. Nav right: "What we do", "How it works", "For graduates" (links to
/graduates), and a black button "Book a call" (scrolls to the enquiry form).

HERO: large [T] mark, then H1: "Fixed price. Named outcome. [Guaranteed]."
Tagline line: "CURATED · VETTED · LOCAL"
Sub: "We automate the boring parts of your business — invoicing, follow-ups, reporting —
delivered by vetted St Andrews graduates, scoped, supervised, and underwritten by us."
Buttons: "Book a free 20-minute scoping call" (primary, scrolls to enquiry form), "See what
we do" (secondary, scrolls to offers).
Small monospace footnote: "// You don't need to know what to ask for. That's our job."

SECTION 01 — pill "01", label "WHAT WE DO".
H2: "Three ways to start. None of them require you to write a brief."
Intro: "Every engagement is scoped by us, delivered by a vetted graduate, and
quality-checked by the studio before it reaches you."
Three bordered cards side by side:

Card 1 — tag "[A] THE SPRINT". H3: "One job off your plate, in weeks". Price: "£1,500"
(small: "fixed · one-off"). Body: "Pick one named outcome. We deliver it, working, or you
don't pay." Bullets: "Invoice-chasing, automated" / "CRM cleaned and wired to follow-ups" /
"Quotes generated in minutes, not days" / "Your monthly numbers, in one report".
Button: "Ask about a Sprint" → opens the enquiry form with offer pre-set to "Sprint (A)".
Fine print: "Money-back guarantee. If it doesn't work, we fix it or refund it."

Card 2 — tag "[B] THE PROJECT". H3: "A graduate on your problem for four weeks — free to
you". Price: "£0" (small: "subsidy-funded placement"). Body: "Funded through university and
internship subsidy schemes. We find the funding, scope the work, and supervise every week.
You keep everything they build." Bullets: "We handle the paperwork" / "Weekly check-ins run
by us, not you" / "No obligation at the end". Button: "Ask about a free project" → enquiry
form with offer pre-set to "Project (B)". Fine print: "Places limited by available funding —
first come, first served."

Card 3 — tag "[C] THE CARE PLAN". H3: "We keep it all running, month after month". Price:
"£300" (small: "/month"). Body: "Automations drift, reports break, follow-ups get missed.
We watch yours, fix what breaks, and quietly improve things as your business changes."
Bullets: "Monitoring and fixes included" / "One improvement shipped each month" / "A named
person who knows your setup". Button: "Ask about a Care Plan" → enquiry form with offer
pre-set to "Care Plan (C)". Fine print: "Cancel any time. Most Care Plan clients start with
a Sprint first."

SECTION 02 — DARK STRIP — pill "02", label "THE MONTH-LONG INTERVIEW".
H2: "Loved working with them? Hire them."
Body: "Every Terna engagement doubles as a working interview. You've watched them deliver
for a month — no CV sift, no interview theatre, no 140-applicant pile. If you want to keep
them, we make it simple."
Big stat aside (left-bordered): "~£3,500" with caption "typical hiring fee — a fraction of
the 15–20% of salary recruiters charge, for a candidate you've already seen do the job."

SECTION 03 — pill "03", label "HOW IT WORKS".
H2: "You bring the headache. We bring everything else."
Four steps, each with monospace number, heading, and body:
[1] "We scope it" — "A 20-minute call. We find the job worth doing and write the brief — you
never have to specify anything technical."
[2] "We match & supervise" — "A vetted graduate does the work under studio supervision.
Weekly progress you can see, no management on your plate."
[3] "We check every delivery" — "Nothing reaches you until it passes studio quality review.
You judge results, not promise."
[4] "We stand behind it" — "If something doesn't work as agreed, we remediate at our cost —
or refund you. Simple as that."
Then a black guarantee box with a "[✓]" mark: bold heading "THE TERNA GUARANTEE", body
"Every delivery is quality-checked by the studio. Every miss is remediated or refunded.
Your risk is a 20-minute phone call."

SECTION 04 — pill "04", label "WHY THIS WORKS".
H2: "Consultancy results without the consultancy invoice"
Body paragraph 1: "The tools that automate invoicing, reporting, and follow-ups have never
been more capable — or more affordable. What most small firms are missing isn't budget. It's
someone to identify the opportunity, do the work, and stand behind it."
Body paragraph 2: "Terna graduates are trained on exactly these tools and work under
experienced studio supervision. You get the outcome a consultancy would charge five figures
for, at a price that makes sense for a five-person firm."
Two left-bordered stats: "3–10×" — "less than typical consultancy pricing for the same
automation outcomes (UK implementations commonly run £8k–£25k)." and "100%" — "of
deliveries quality-reviewed by the studio before they reach you — and guaranteed after."

SECTION 05 — pill "05", label "LOCAL BY DESIGN".
H2: "Within cycling distance, on purpose"
Body: "Terna only works with businesses in St Andrews and the East Neuk. We meet in person,
we know your town, and our graduates come from your doorstep — one of the strongest talent
pools in Scotland."
Grey note: "If something needs looking at, we come to you. Try getting that from a national
platform."
Beside it, a typewriter-style monospace "map": rows of grey middle dots "·" with the place
names [ST ANDREWS], [GUARDBRIDGE], [CRAIL], [ANSTRUTHER] in bold black brackets scattered
among them.

SECTION 06 — DARK BLOCK — pill "06", label "FOR GRADUATES".
H2: "Real work. Real pay. A portfolio that proves itself."
Body: "Cold applications run at 140-to-1 odds. At Terna you're paid to deliver real outcomes
for real local businesses — with studio training, supervision, and a track record employers
can watch, not just read."
Bullets: "Paid project work, not coffee runs" / "Training on the automation tools firms
actually buy" / "A verified portfolio of shipped work" / "A direct route to firms that never
visit campus".
Buttons: "Apply to join Terna" (→ /apply) and "Read the graduate page" (→ /graduates).
Fine print: "Small cohorts. We vet hard — that's the whole point."

SECTION 07 — pill "07", label "GET STARTED". This section CONTAINS the SME enquiry form.
H2: "Twenty minutes. We'll find the job worth doing."
Body: "No pitch deck, no obligation. If we can't see a clear win for your business, we'll
tell you that too."
ENQUIRY FORM fields: Name (required), Business name (required), Email (required), Phone
(optional), "What are you interested in?" (required dropdown: "Sprint (A) — £1,500 fixed" /
"Free 4-week project (B)" / "Care Plan (C) — £300/mo" / "Hiring a graduate" / "Not sure yet —
scoping call"), Message (optional textarea, placeholder "What's eating your week?").
Submit button: "Send — we reply within one working day". On submit: save to database, email
me a notification, show confirmation: "Got it. We reply within one working day — usually
faster." The offer dropdown must pre-select correctly when opened from the offer-card
buttons or the "Book a call" buttons (scoping call).
Monospace footnote: "// Based in St Andrews. We reply within one working day."

FOOTER: [T] TERNA, tagline "CURATED · VETTED · LOCAL", line: "St Andrews, Fife · For
graduates · hello@terna.studio · © 2026 Terna" (For graduates links to /graduates).

=== PAGE 2: FOR GRADUATES (route "/graduates") ===
Same header, but nav: "For businesses" (→ /), "The work", "Pay & vetting", black button
"Apply" (→ /apply).

HERO: [T] mark. H1: "Be seen working. Not screened."
Tagline: "PAID · TRAINED · PLACED"
Sub: "Cold applications run at 140-to-1. Terna pays you to deliver real work for real
St Andrews businesses — trained, supervised, and quality-checked by the studio — so
employers watch you deliver instead of skimming your CV."
Button: "Apply to join Terna" (→ /apply).
Footnote: "// Small cohorts. St Andrews & the East Neuk. Real pay, real clients."

SECTION 01 — pill "01", label "THE ODDS". H2: "The funnel is broken. You aren't."
Intro: "The graduate market has never asked you to prove less and promise more. We think
the fix is simple: get judged on shipped work, not screened applications."
Three top-bordered stats: "140 : 1" — "applications per graduate vacancy. That's a lottery,
not a hiring process." / "−30%" — "entry-level listings since AI tools arrived. The junior
tasks are being automated — unless you're the one wielding the tools." / "3×" — "more likely
to still be underemployed years later if your first role undersells you. The first job
matters most."

SECTION 02 — pill "02", label "THE WORK" (card-background band).
H2: "Real briefs. Real businesses. Real invoices with your work behind them."
Intro: "No case studies, no simulations. Every engagement is a paying (or funded) local
business with a named outcome the studio has scoped and guaranteed."
Three cards:
[A] SPRINTS — "Ship one outcome in weeks" — "A fixed-scope automation build —
invoice-chasing, CRM clean-ups, reporting packs — delivered to a paying client under studio
supervision." Bullets: "Scoped by the studio, built by you" / "Weekly reviews with your
supervisor" / "QA'd before it ships — you learn what 'done' means". Fine print: "Paid per
project."
[B] PROJECTS — "Four weeks embedded in a local firm" — "A funded placement inside a
St Andrews or East Neuk business, solving one real problem end-to-end while the studio
supervises." Bullets: "Subsidy-funded — the studio handles the paperwork" / "You're the
person on the ground" / "The strongest working interview there is". Fine print: "Funded
placement, paid to you."
[C] CARE PLANS — "Own a client relationship" — "As you progress, you become the named person
keeping a client's automations and reporting running month after month." Bullets:
"Recurring, fractional work across clients" / "Client trust with your name on it" / "The
role that turns into a job offer". Fine print: "Monthly retainer work for experienced
members."

SECTION 03 — pill "03", label "HOW YOU GROW". H2: "Train. Deliver. Prove. Convert."
[1] "Train" — "Studio training on the automation tools businesses actually buy — not
academic exercises. You learn by building what clients pay for."
[2] "Deliver" — "Real client work under supervision, with weekly reviews. You're never left
alone with a brief — and never hidden from the client either."
[3] "Prove" — "Every delivery passes studio QA before it ships. Your portfolio is verified,
shipped work — evidence, not claims."
[4] "Convert" — "Clients hire the people they've watched deliver. When they want to keep
you, the studio makes it simple — and celebrates it."

SECTION 04 — pill "04", label "PAY & VETTING" (card-background band). Two columns:
"WHAT YOU GET": "Paid per project — no unpaid 'exposure', no coffee runs" / "Studio training
and a supervisor who reviews your work weekly" / "Fractional retainer work as you progress —
steady income from several clients" / "A verified portfolio and a direct route to firms that
never visit campus".
"WHAT WE ASK": "A work sample, not CV theatre — we vet on what you can build" / "Small
cohorts, kept small on purpose" / "Studio standards: deadlines met, QA passed, clients
answered" / "Membership is earned continuously — the badge means something because we
protect it".

SECTION 05 — DARK STRIP — pill "05", label "THE ROUTE TO A REAL JOB".
H2: "Every project is a month-long interview."
Body: "Firms don't hire Terna members off a CV. They hire after watching you scope-check,
build, miss, fix, and ship. By the time an offer comes, the risk question is already
answered — for both of you. And when you're hired, the studio backfills your clients: your
conversion is the model working, not a loose end."
Big stat: "0" — "CVs sifted, cover letters written, or ATS filters passed between you and an
offer here. You get hired on evidence."

SECTION 06 — pill "06", label "APPLY". H2: "Odds you can act on."
Body: "Tell us who you are and show us something you've built — anything. If we think
you'll thrive here, we'll set you a short work sample. No CV required."
Button: "Apply to join Terna" (→ /apply).
Footnote: "// Small cohorts. We vet hard — that's the whole point. Replies within one
working day."
Same footer as home, with tagline "PAID · TRAINED · PLACED".

=== PAGE 3: APPLY (route "/apply") ===
Minimal page, same brand. [T] mark, H1: "Show us something you've built."
Body: "Anything counts — a spreadsheet that saved someone time, a script, a website, a
society you ran well. We vet on evidence, not credentials. No CV required."
APPLICATION FORM fields: Name (required), Email (required), Degree / course & year
(required, free text), Link to something you've built (required, URL), Anything else?
(optional textarea). Submit: "Apply — we reply within one working day". On submit: save to
database, email me a notification, confirmation: "Received. If we think you'll thrive here,
we'll send you a short work sample next."

=== DATA MODEL ===
Entity "Enquiry": name, business, email, phone (optional), offer (enum: sprint_a, project_b,
care_plan_c, hiring, unsure), message, status (enum: new, call_booked, scoped, signed,
delivered, converted, closed_lost; default new), notes (long text, admin-only), createdAt.
Entity "Application": name, email, degree, workSampleUrl, message, status (enum: new,
work_sample_sent, reviewed, accepted, rejected; default new), notes (admin-only), createdAt.
Entity "OutreachTarget": business, contactName, sector, contactChannel (enum: warm_intro,
in_person, email, phone), offerPitched (enum: sprint_a, project_b, care_plan_c, none_yet),
response (enum: not_contacted, pitched, interested, signed, declined; default
not_contacted), signedOffer (enum: none, sprint_a, project_b, care_plan_c; default none),
kickerAnswer (enum: not_asked, yes, leaning_yes, no; default not_asked), notes, createdAt.

=== ADMIN (route "/admin", login required, only me — no public signup) ===
Simple dashboard listing Enquiries and Applications newest-first with status editing and
notes. (A fuller dashboard is specified in a follow-up prompt — keep this one basic.)
Email notifications for every new Enquiry and Application go to the app owner's email.
```

---

## Prompt 2 — Design QA pass

```
Do a strict design QA pass against the Terna design system. Fix every violation:
1. NO colour anywhere except cream #EFEDE3, card #F7F5EC, ink #14130F, grey #6E6A5C, border
   #D9D5C6, and dark-strip secondary #B9B6A8. Find and remove any blue links, coloured
   buttons, coloured form-focus rings, or default-theme accents — including on form inputs,
   dropdowns, success messages, and the admin pages.
2. All headings monospace, bold, UPPERCASE, letterspaced. Body sans-serif. No serif fonts,
   no decorative fonts.
3. Buttons: rectangular (no rounded corners beyond 0–2px), 2px solid black border, monospace
   label. Hover inverts colours. No shadows, no gradients.
4. Every section starts with its black pill number badge + uppercase grey label, in order
   01–07 (home) and 01–06 (graduates).
5. Dark strips are pure #14130F with cream text; check contrast of secondary text.
6. No stock images, no illustrations, no emoji, no icon libraries. The only graphic devices
   are the [T] bracket mark, the pill badges, em-dash bullets, and the dot-grid map.
7. Mobile at 390px wide: no horizontal scrolling, cards stack, nav collapses to wordmark +
   primary button.
8. Forms: labels above fields, hairline #D9D5C6 borders, black 2px focus outline, monospace
   submit buttons.
List every change you made.
```

---

## Prompt 3 — Admin dashboard + Phase-0 scoreboard

```
Expand /admin into a proper operations dashboard with four tabs. Keep it owner-only.

TAB 1 "Pipeline": Enquiries as a kanban or grouped list by status (new → call_booked →
scoped → signed → delivered → converted, plus closed_lost). Each card: name, business,
offer, age in days, notes. Inline status change. Filter by offer.

TAB 2 "Applications": Applications list with status (new → work_sample_sent → reviewed →
accepted/rejected), link out to workSampleUrl, notes.

TAB 3 "Phase-0 scoreboard" — this is the decision instrument, make it prominent:
- Metric 1: count of OutreachTargets with signedOffer = sprint_a or project_b, shown as
  "X / 10 signed offer A or B" with a pass line at 3. Green-state text "PASS LINE MET" only
  in black/cream styling (no green colour — use a filled black badge).
- Metric 2: count of OutreachTargets with kickerAnswer = yes or leaning_yes, shown as
  "X / 10 credible yes to the £3.5k hire question" with a pass line at 5.
- Verdict banner: if BOTH pass lines met → "PHASE 0: PASS — proceed to delivery playbooks."
  If 10 targets pitched and either line missed → "PHASE 0: FAIL — change city or change
  wedge before building anything." Otherwise → "IN PROGRESS — N of 10 pitched."
- Below: the OutreachTarget table with inline editing of all fields, add/remove rows, and
  CSV export of all three entities.

TAB 4 "Enquiry sources": simple counts of Enquiries by offer value, so I can see which
public offer card generates interest.

Design: same Terna system — cream, ink, monospace headings, pill badges, no colour.
```

---

## Prompt 4 — Offer one-pagers

```
Add three print-friendly one-pager routes: /offers/sprint, /offers/project, /offers/careplan.
Each is a single A4/A5-styled page in the Terna design system for handing to a business
owner in person. No navigation header — just the content and a footer. Each contains:
- [T] TERNA wordmark + tagline "CURATED · VETTED · LOCAL"
- The offer tag ([A] THE SPRINT / [B] THE PROJECT / [C] THE CARE PLAN), its H3 headline,
  price, body copy, and bullets EXACTLY as on the home page (reuse that copy verbatim).
- The guarantee box: "THE TERNA GUARANTEE — Every delivery is quality-checked by the studio.
  Every miss is remediated or refunded."
- A signature strip at the bottom: "Yes — let's do this." with lines for Name / Business /
  Date, and small print "This expression of interest is not a contract; we'll confirm scope
  in writing before any work starts."
- Contact line: hello@terna.studio · St Andrews, Fife.
Add a small "Print" button (hidden when printing) and make sure print CSS gives clean
black-on-white output with no backgrounds bleeding.
```
