// Terna Studio Portal — demo seed data.
// Pure data + version constant. No logic, no store access.
// Bump SEED_VERSION whenever the schema or seed content changes so stale
// localStorage stores auto-reseed on next load.

export const SEED_VERSION = 1;

export const COHORT = "Cohort 03 · Spring 2026";

// Money is stored as integer pence throughout.
const A_CLIENT = 150000, A_PAY = 65000;   // [A] Sprint — £1,500 client / £650 student
const B_CLIENT = 0,      B_PAY = 176000;  // [B] Project — £0 client / £1,760 student
const C_CLIENT = 30000,  C_PAY = 12000;   // [C] Care Plan — £300 / £120 per month

export function buildSeed() {
  return {
    seedVersion: SEED_VERSION,

    // ---- people ----
    students: [
      {
        id: "stu-isla", name: "Isla Robertson", short: "Isla R.",
        degree: "MSc Computer Science", cohort: COHORT, stage: "prove",
        joinedAt: "2026-02-16",
        bio: "Automation-minded, two ships behind her. Now proving she can own the client relationship.",
      },
      {
        id: "stu-tom", name: "Tom Okafor", short: "Tom O.",
        degree: "BSc Mathematics", cohort: COHORT, stage: "deliver",
        joinedAt: "2026-02-16",
        bio: "Strong on data plumbing. Mid-delivery on his first Care Plan.",
      },
      {
        id: "stu-freya", name: "Freya MacLeod", short: "Freya M.",
        degree: "MA Economics", cohort: COHORT, stage: "train",
        joinedAt: "2026-06-29",
        bio: "Just through vetting. Trained up and ready for a first brief.",
      },
    ],
    staff: [
      { id: "adm-eilidh", name: "Eilidh Bruce", short: "Eilidh B.", role: "admin", title: "Studio Lead" },
    ],

    // ---- clients (from the site's East Neuk map) ----
    clients: [
      { id: "cli-guardbridge", name: "Guardbridge Timber Co.", town: "Guardbridge", sector: "Timber merchant & sawmill", blurb: "Trade counter and yard, mostly repeat trade accounts." },
      { id: "cli-eastsands",   name: "East Sands Lettings",     town: "St Andrews",  sector: "Holiday-let management",   blurb: "Manages 20-odd short-term lets around the town." },
      { id: "cli-kinnessburn", name: "Kinnessburn Bakehouse",  town: "St Andrews",  sector: "Artisan bakery & café",    blurb: "Wholesale to cafés plus a shopfront on Market Street." },
      { id: "cli-linksview",   name: "Links View Guest House",  town: "St Andrews",  sector: "Guest house & B&B",        blurb: "Eleven rooms, booked mostly through the golf season." },
      { id: "cli-crail",       name: "Crail Harbour Gallery",   town: "Crail",       sector: "Coastal art gallery",      blurb: "Sells local artists' work on consignment." },
      { id: "cli-anstruther",  name: "Anstruther Shellfish Co.",town: "Anstruther",  sector: "Shellfish wholesale",      blurb: "Lands, grades and delivers shellfish across Fife." },
    ],

    // ---- briefs (8, covering every status) ----
    briefs: [
      {
        id: "brf-01", type: "A", title: "Overdue invoices, chased automatically",
        clientId: "cli-guardbridge",
        summary: "Invoices go out on time; chasing them doesn't happen at all. Build the reminder engine — polite at day 7, firm at day 21, a call list at day 30 — wired into the ledger they already use.",
        scopeItems: [
          "Map the current invoice ledger and payment terms",
          "Draft the reminder cadence: day 7, day 21, day 30",
          "Build the reminder automation against the ledger",
          "Test on last quarter's overdue invoices",
        ],
        clientPrice: A_CLIENT, studentPay: A_PAY, payCadence: "fixed",
        status: "open", assignedStudentId: null, supervisor: "Studio",
        postedAt: "2026-07-04", dueAt: "2026-08-08",
        note: "// client checked — ledger is Xero, no migration needed.",
        milestones: [
          { id: "brf-01-m1", title: "Map the current invoice ledger and payment terms", done: false, doneAt: null },
          { id: "brf-01-m2", title: "Draft the reminder cadence (day 7 / 21 / 30)", done: false, doneAt: null },
          { id: "brf-01-m3", title: "Build the reminder automation against the ledger", done: false, doneAt: null },
          { id: "brf-01-m4", title: "Test on last quarter's overdue invoices", done: false, doneAt: null },
        ],
      },
      {
        id: "brf-02", type: "B", title: "Stock and orders, one honest spreadsheet",
        clientId: "cli-crail",
        summary: "Consignment stock lives in three notebooks and someone's memory. Give the gallery one master sheet that knows what's in, what's sold, and what to reorder.",
        scopeItems: [
          "Audit how stock and consignments are tracked today",
          "Design one master sheet: stock, sales, reorder points",
          "Wire supplier and artist emails into the sheet",
          "Handover session with the owner",
        ],
        clientPrice: B_CLIENT, studentPay: B_PAY, payCadence: "fixed",
        status: "open", assignedStudentId: null, supervisor: "Studio",
        postedAt: "2026-07-02", dueAt: "2026-08-15",
        note: "// funded placement — paperwork handled by the studio.",
        milestones: [
          { id: "brf-02-m1", title: "Audit how stock is tracked today", done: false, doneAt: null },
          { id: "brf-02-m2", title: "Design the master sheet (stock / sales / reorder)", done: false, doneAt: null },
          { id: "brf-02-m3", title: "Wire supplier + artist emails into the sheet", done: false, doneAt: null },
          { id: "brf-02-m4", title: "Handover session with the owner", done: false, doneAt: null },
        ],
      },
      {
        id: "brf-03", type: "A", title: "Quotes out in minutes, not days",
        clientId: "cli-eastsands",
        summary: "Every enquiry waits two days for a hand-typed quote. Build a template with auto-pricing so a quote goes out the same hour, every time.",
        scopeItems: [
          "Collect the last 20 quotes and their line items",
          "Build the quote template with auto-pricing",
          "Add the one-click PDF and send step",
          "Owner sign-off on three live quotes",
        ],
        clientPrice: A_CLIENT, studentPay: A_PAY, payCadence: "fixed",
        status: "open", assignedStudentId: null, supervisor: "Studio",
        postedAt: "2026-07-01", dueAt: "2026-08-01",
        note: "// pricing rules confirmed with the owner up front.",
        milestones: [
          { id: "brf-03-m1", title: "Collect the last 20 quotes and line items", done: false, doneAt: null },
          { id: "brf-03-m2", title: "Build the quote template with auto-pricing", done: false, doneAt: null },
          { id: "brf-03-m3", title: "Add the one-click PDF + send step", done: false, doneAt: null },
          { id: "brf-03-m4", title: "Owner sign-off on three live quotes", done: false, doneAt: null },
        ],
      },
      {
        id: "brf-04", type: "B", title: "Booking follow-ups that send themselves",
        clientId: "cli-linksview",
        summary: "Pre-arrival details and post-stay thank-yous get sent when someone remembers. Automate the whole set off the booking calendar so it never gets missed.",
        scopeItems: [
          "Pull the booking calendar and guest fields",
          "Draft the pre-arrival and post-stay message set",
          "Build the send-on-checkout automation",
          "Add the review-request step",
          "Two-week live test with the owner",
        ],
        clientPrice: B_CLIENT, studentPay: B_PAY, payCadence: "fixed",
        status: "in_delivery", assignedStudentId: "stu-isla", supervisor: "Studio",
        postedAt: "2026-06-18", dueAt: "2026-07-28",
        note: "// weekly check-in: Fridays, studio.",
        milestones: [
          { id: "brf-04-m1", title: "Pull the booking calendar + guest fields", done: true,  doneAt: "2026-06-27" },
          { id: "brf-04-m2", title: "Draft the pre-arrival + post-stay message set", done: true,  doneAt: "2026-07-03" },
          { id: "brf-04-m3", title: "Build the send-on-checkout automation", done: true,  doneAt: "2026-07-10" },
          { id: "brf-04-m4", title: "Add the review-request step", done: false, doneAt: null },
          { id: "brf-04-m5", title: "Two-week live test with the owner", done: false, doneAt: null },
        ],
      },
      {
        id: "brf-05", type: "A", title: "The month's numbers, one report",
        clientId: "cli-anstruther",
        summary: "The owner rebuilds the same figures by hand every month-end. Pull sales, costs and VAT into one page that sends itself on the 1st.",
        scopeItems: [
          "List every number the owner checks monthly",
          "Pull sales, costs and VAT into one source",
          "Build the one-page monthly report",
          "Automate the month-end send",
        ],
        clientPrice: A_CLIENT, studentPay: A_PAY, payCadence: "fixed",
        status: "in_qa", assignedStudentId: "stu-isla", supervisor: "Studio",
        postedAt: "2026-06-25", dueAt: "2026-07-24",
        note: "// bank export is CSV — no open-banking needed.",
        milestones: [
          { id: "brf-05-m1", title: "List every number the owner checks monthly", done: true, doneAt: "2026-06-30" },
          { id: "brf-05-m2", title: "Pull sales, costs and VAT into one source", done: true, doneAt: "2026-07-04" },
          { id: "brf-05-m3", title: "Build the one-page monthly report", done: true, doneAt: "2026-07-08" },
          { id: "brf-05-m4", title: "Automate the month-end send", done: true, doneAt: "2026-07-09" },
        ],
      },
      {
        id: "brf-06", type: "C", title: "Care Plan — keep the Bakehouse running",
        clientId: "cli-kinnessburn",
        summary: "The Bakehouse's automations drift as prices and suppliers change. Watch them, fix what breaks, and ship one improvement a month.",
        scopeItems: [
          "Monitor the price-list sync and order reminders",
          "Fix what breaks, before the owner notices",
          "Ship one improvement each month",
          "Keep a named contact who knows the setup",
        ],
        clientPrice: C_CLIENT, studentPay: C_PAY, payCadence: "monthly",
        status: "in_delivery", assignedStudentId: "stu-tom", supervisor: "Studio",
        postedAt: "2026-04-18", dueAt: "2026-07-31",
        note: "// steady-state retainer — this month's improvement is in review.",
        milestones: [
          { id: "brf-06-m1", title: "May — price-list sync fixed", done: true,  doneAt: "2026-05-28" },
          { id: "brf-06-m2", title: "June — supplier-order reminder added", done: true,  doneAt: "2026-06-27" },
          { id: "brf-06-m3", title: "July — margin alert on price changes", done: false, doneAt: null },
        ],
      },
      {
        id: "brf-07", type: "A", title: "CRM cleaned and wired to follow-ups",
        clientId: "cli-eastsands",
        summary: "A contact list full of duplicates and no follow-up. Tidied, tagged by stage, and wired into a sequence that actually fires.",
        scopeItems: [
          "De-duplicate and tidy the contact list",
          "Tag contacts by stage and source",
          "Wire tags into the follow-up sequence",
          "Handover and one month of monitoring",
        ],
        clientPrice: A_CLIENT, studentPay: A_PAY, payCadence: "fixed",
        status: "shipped", assignedStudentId: "stu-isla", supervisor: "Studio",
        postedAt: "2026-05-08", dueAt: "2026-05-30",
        note: "// first ship of the cohort. Clean handover.",
        milestones: [
          { id: "brf-07-m1", title: "De-duplicate and tidy the contact list", done: true, doneAt: "2026-05-16" },
          { id: "brf-07-m2", title: "Tag contacts by stage and source", done: true, doneAt: "2026-05-21" },
          { id: "brf-07-m3", title: "Wire tags into the follow-up sequence", done: true, doneAt: "2026-05-27" },
          { id: "brf-07-m4", title: "Handover + one month of monitoring", done: true, doneAt: "2026-05-30" },
        ],
      },
      {
        id: "brf-08", type: "B", title: "Delivery runs planned in one click",
        clientId: "cli-anstruther",
        summary: "Delivery rounds planned by hand every morning. A planner that builds the rounds off the order list and prints a run sheet per driver.",
        scopeItems: [
          "Map current delivery rounds and constraints",
          "Build the round-planner from the order list",
          "One-click run sheet with driver notes",
          "Live test over a delivery week",
        ],
        clientPrice: B_CLIENT, studentPay: B_PAY, payCadence: "fixed",
        status: "shipped", assignedStudentId: "stu-tom", supervisor: "Studio",
        postedAt: "2026-05-22", dueAt: "2026-06-20",
        note: "// funded placement, converted to a glowing reference.",
        milestones: [
          { id: "brf-08-m1", title: "Map current delivery rounds and constraints", done: true, doneAt: "2026-05-30" },
          { id: "brf-08-m2", title: "Build the round-planner from the order list", done: true, doneAt: "2026-06-07" },
          { id: "brf-08-m3", title: "One-click run sheet with driver notes", done: true, doneAt: "2026-06-14" },
          { id: "brf-08-m4", title: "Live test over a delivery week", done: true, doneAt: "2026-06-20" },
        ],
      },
    ],

    // ---- applications ----
    applications: [
      { id: "app-01", briefId: "brf-02", studentId: "stu-freya", note: "Economics background means spreadsheets are home turf — I'd want to know how often stock actually turns over before designing the reorder logic.", status: "pending", submittedAt: "2026-07-06", decidedAt: null, declineReason: null },
      { id: "app-02", briefId: "brf-03", studentId: "stu-isla", note: "I built the East Sands CRM sequence, so I already know their pricing quirks. One question: are quotes ever discounted off-list?", status: "pending", submittedAt: "2026-07-07", decidedAt: null, declineReason: null },
      { id: "app-03", briefId: "brf-03", studentId: "stu-tom", note: "Keen to take a Sprint solo.", status: "declined", submittedAt: "2026-07-05", decidedAt: "2026-07-06", declineReason: "Scope needs a Prove-stage member — held for a future brief." },
      { id: "app-04", briefId: "brf-04", studentId: "stu-isla", note: "Comfortable with calendar-triggered automations.", status: "accepted", submittedAt: "2026-06-20", decidedAt: "2026-06-22", declineReason: null },
      { id: "app-05", briefId: "brf-05", studentId: "stu-isla", note: "Reporting is my strongest area.", status: "accepted", submittedAt: "2026-06-25", decidedAt: "2026-06-26", declineReason: null },
      { id: "app-06", briefId: "brf-06", studentId: "stu-tom", note: "Happy to own a recurring relationship.", status: "accepted", submittedAt: "2026-04-20", decidedAt: "2026-04-22", declineReason: null },
      { id: "app-07", briefId: "brf-07", studentId: "stu-isla", note: "Ready for a first ship.", status: "accepted", submittedAt: "2026-05-10", decidedAt: "2026-05-12", declineReason: null },
      { id: "app-08", briefId: "brf-08", studentId: "stu-tom", note: "Logistics is a good fit for me.", status: "accepted", submittedAt: "2026-05-25", decidedAt: "2026-05-27", declineReason: null },
    ],

    // ---- deliverables ----
    deliverables: [
      {
        id: "dlv-01", briefId: "brf-06", studentId: "stu-tom",
        title: "July improvement — margin alert on price changes",
        url: "https://example.com/bakehouse/margin-alert",
        notes: "Sheet + Apps Script trigger. Fires an alert whenever a product's cost is edited.",
        version: 1, status: "qa_fail", submittedAt: "2026-07-08",
        qa: { verdict: "fail", note: "Alert fires on every price edit, not just increases — add a threshold (say >2%) and only fire when the margin actually drops, then resubmit.", reviewedBy: "Studio", reviewedAt: "2026-07-10" },
        history: [],
      },
      {
        id: "dlv-02", briefId: "brf-05", studentId: "stu-isla",
        title: "One-page monthly report + auto-send",
        url: "https://example.com/anstruther/monthly-report",
        notes: "Pulls from the sales sheet and the bank CSV export. Sends 09:00 on the 1st.",
        version: 1, status: "submitted", submittedAt: "2026-07-09",
        qa: null, history: [],
      },
      {
        id: "dlv-03", briefId: "brf-07", studentId: "stu-isla",
        title: "CRM tidy + follow-up wiring",
        url: "https://example.com/eastsands/crm",
        notes: "Contacts de-duped, tagged by stage, wired to the follow-up sequence.",
        version: 1, status: "qa_pass", submittedAt: "2026-05-28",
        qa: { verdict: "pass", note: "Clean handover, monitoring in place. Client confirmed follow-ups firing correctly.", reviewedBy: "Studio", reviewedAt: "2026-05-30" },
        history: [],
      },
      {
        id: "dlv-04", briefId: "brf-08", studentId: "stu-tom",
        title: "Round planner + run sheets",
        url: "https://example.com/anstruther/delivery-runs",
        notes: "Planner builds rounds from the order list; one-click run sheet per driver.",
        version: 1, status: "qa_pass", submittedAt: "2026-06-18",
        qa: { verdict: "pass", note: "Tested over a full week. Driver time down, no missed drops.", reviewedBy: "Studio", reviewedAt: "2026-06-20" },
        history: [],
      },
    ],

    // ---- verified portfolio (minted on QA pass) ----
    portfolio: [
      {
        id: "pf-01", studentId: "stu-isla", briefId: "brf-07", deliverableId: "dlv-03",
        title: "CRM cleaned and wired to follow-ups",
        clientName: "East Sands Lettings", town: "St Andrews", type: "A",
        outcomeStatement: "Contacts de-duplicated, tagged by stage, and wired into an automatic follow-up sequence.",
        scopeItems: [
          "De-duplicate and tidy the contact list",
          "Tag contacts by stage and source",
          "Wire tags into the follow-up sequence",
          "Handover and one month of monitoring",
        ],
        shippedAt: "2026-05-30", verifiedBy: "Terna Studio QA",
      },
      {
        id: "pf-02", studentId: "stu-tom", briefId: "brf-08", deliverableId: "dlv-04",
        title: "Delivery runs planned in one click",
        clientName: "Anstruther Shellfish Co.", town: "Anstruther", type: "B",
        outcomeStatement: "Delivery rounds planned automatically from the order list, with a one-click run sheet per driver.",
        scopeItems: [
          "Map current delivery rounds and constraints",
          "Build the round-planner from the order list",
          "One-click run sheet with driver notes",
          "Live test over a delivery week",
        ],
        shippedAt: "2026-06-20", verifiedBy: "Terna Studio QA",
      },
    ],

    // ---- payments (integer pence) ----
    payments: [
      { id: "pay-01", studentId: "stu-isla", briefId: "brf-07", label: "Sprint — East Sands Lettings", amount: A_PAY, status: "paid", dueAt: "2026-05-30", paidAt: "2026-05-31" },
      { id: "pay-02", studentId: "stu-isla", briefId: "brf-05", label: "Sprint — Anstruther Shellfish Co.", amount: A_PAY, status: "due", dueAt: "2026-07-24", paidAt: null },
      { id: "pay-03", studentId: "stu-isla", briefId: "brf-04", label: "Project — Links View Guest House", amount: B_PAY, status: "due", dueAt: "2026-07-28", paidAt: null },
      { id: "pay-04", studentId: "stu-tom", briefId: "brf-08", label: "Project — Anstruther Shellfish Co.", amount: B_PAY, status: "paid", dueAt: "2026-06-20", paidAt: "2026-06-21" },
      { id: "pay-05", studentId: "stu-tom", briefId: "brf-06", label: "Care Plan — Kinnessburn (May)", amount: C_PAY, status: "paid", dueAt: "2026-05-31", paidAt: "2026-05-31" },
      { id: "pay-06", studentId: "stu-tom", briefId: "brf-06", label: "Care Plan — Kinnessburn (June)", amount: C_PAY, status: "paid", dueAt: "2026-06-30", paidAt: "2026-06-30" },
      { id: "pay-07", studentId: "stu-tom", briefId: "brf-06", label: "Care Plan — Kinnessburn (July)", amount: C_PAY, status: "due", dueAt: "2026-07-31", paidAt: null },
    ],

    // running counter base for id generation (store bumps this)
    counters: { app: 8, dlv: 4, pf: 2, pay: 7, brf: 8, mil: 0 },
  };
}
