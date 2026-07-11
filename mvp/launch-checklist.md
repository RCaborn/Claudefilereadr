# Terna MVP launch checklist — Base44, from prompt to live

Work top to bottom. The build source is `mvp/base44-prompt.md`; the design reference is the
HTML at `site/index.html` and `site/graduates.html` (pixel truth for how everything should
look).

## 1. Build

- [ ] Create the app at base44.com — paste **Prompt 1** (master build) as the initial prompt.
- [ ] Review the generated app against the HTML reference before doing anything else.
- [ ] Paste **Prompt 2** (design QA). Re-check: the usual drift is coloured focus rings,
      rounded buttons, and a stray accent colour on links.
- [ ] Paste **Prompt 3** (dashboard + Phase-0 scoreboard).
- [ ] Paste **Prompt 4** (offer one-pagers). Print-preview all three.

## 2. Configure

- [ ] Admin access: your account only — confirm no public signup route to /admin.
- [ ] Notification email: point new-Enquiry and new-Application alerts at your real inbox
      (placeholder `hello@terna.studio` until that mailbox exists — a Gmail is fine for
      Phase-0).
- [ ] Domain: Base44 subdomain is fine for Phase-0; connect `terna.studio` when bought
      (Base44 supports custom domains on paid plans).

## 3. End-to-end tests (do all of them, on your phone as well)

- [ ] Submit one test enquiry from **each** offer card (A, B, C) plus one via "Book a call".
      Verify: each lands in the admin Pipeline with the **correct offer attribution**, and
      an email notification arrives for each.
- [ ] Submit one test application at /apply with a real URL. Verify it appears in the
      Applications tab + email arrives.
- [ ] Seed 3 fake OutreachTargets: one `signed` (sprint_a) + kicker `yes`, one `pitched` +
      kicker `no`, one `not_contacted`. Verify the scoreboard reads "1/10 signed A or B"
      and "1/10 credible yes", verdict "IN PROGRESS — 2 of 10 pitched".
- [ ] Flip enough seeds to cross both pass lines and confirm the verdict flips to PASS;
      then delete all seed data.
- [ ] Mobile pass at ~390px: no horizontal scroll, cards stack, forms usable.
- [ ] Print the three one-pagers; check clean black-on-white output and the signature strip.

## 4. Go live

- [ ] Publish the app.
- [ ] Load the 10 real outreach targets into the dashboard (see `phase0-kit.md` §1).
- [ ] Print 10 sets of one-pagers.
- [ ] Start the Phase-0 clock: 2–3 weeks, count signatures, let the scoreboard decide.

## Known placeholders

- `hello@terna.studio` appears in the footer, contact section, and one-pagers — swap when
  the mailbox exists.
- No calendar booking in the MVP: "Book a call" routes to the enquiry form with
  offer = scoping call. Add Calendly/booking later if call volume justifies it.
