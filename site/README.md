# Terna — site source

The complete HTML for [terna.studio](https://www.terna.studio): a St Andrews graduate studio selling
fixed-price, guaranteed automation outcomes to local SMEs, with a hiring pipeline attached.

Brand system: cream ground (`#EFEDE3`), near-black ink (`#14130F`), no colour, monospace masthead
typography, the `[T]` bracket mark, tagline **CURATED · VETTED · LOCAL**.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home / SME landing page — the three Phase-0 offers (£1,500 Sprint, free subsidy-funded Project, £300/mo Care Plan), the ~£3,500 try-before-you-hire strip, how-it-works, guarantee, local section. |
| `graduates.html` | Full graduates page — the odds, the work, how you grow, pay & vetting, route to a job, apply. |
| `graduates/01-hero.html` … `graduates/07-apply.html` | Each graduates section as a standalone, self-contained file for pasting into individual Wix embed blocks. |

Every page is fully self-contained (inline CSS, no external requests) and responsive.
`graduates.html` contains `<!-- ===SPLIT:xx=== -->` markers showing where the per-section files come from.

## Importing into Wix

Use Wix's **import from URL** (or the Claude design import) with the raw GitHub URLs:

```
https://raw.githubusercontent.com/RCaborn/Claudefilereadr/claude/grad-sme-utilisation-gap-vo2iwu/site/index.html
https://raw.githubusercontent.com/RCaborn/Claudefilereadr/claude/grad-sme-utilisation-gap-vo2iwu/site/graduates.html
```

For piecemeal embedding, paste each `graduates/*.html` file into its own Embed HTML block
(give the block full width; links inside use `target="_top"` so they escape the iframe).

## Placeholders to swap after import

- All CTAs point at `https://www.terna.studio/...` routes (`/contact?offer=sprint-a|project-b|careplan-c|scoping-call`, `/apply`).
  Wire these to Wix Forms/Bookings so enquiries are captured and attributed to offers A/B/C.
- The contact email shown is `hello@terna.studio`.
- Cross-page links (`index.html` ↔ `graduates.html`) are relative; remap them to Wix page routes after import.
