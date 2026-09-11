# Seerix

Marketing site for Seerix, the Search Console platform that explains why your
traffic changed.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and GSAP.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Structure

```
app/
  layout.tsx          Fonts, metadata, page shell
  page.tsx            Section composition and footer
  globals.css         Tailwind theme: palette, type scale
components/new-landing/
  navbar.tsx          Sticky header, mega-menu, mobile menu
  hero.tsx            Headline, CTAs, trust marks
  how-it-works.tsx    Three-step explainer
  stats.tsx           Staggered figures grid
  value-prop.tsx      Four capability cards
  trust.tsx           Why the answers hold up
  pricing.tsx         Three plans
  faq.tsx             Accordion
  cta.tsx             Closing call to action
  ui/                 Shared primitives
```

Sections are composed in `app/page.tsx`. `PageRails` draws the vertical rules
that run down the content column, so it needs a positioned ancestor.

## Design system

Theme tokens live in the `@theme` block in `app/globals.css`, not in a
`tailwind.config` file (Tailwind v4 keeps configuration in CSS).

- **Palette**: White Grey `#DCDDDD`, Genji Grey `#888084`, Amakusa Black
  `#36363B`, plus a derived ramp for gradients, hovers and the solid press
  shadow under every button.
- **Type**: Space Grotesk for display, DM Sans for body, Geist Mono for
  figures, Inter for UI.

Buttons share a pattern worth matching if you add one: a `0 4px 0 0` solid
shadow that shortens on `:active` so the control reads as physically pressed.

## Responsive

Mobile-first, with layout shifts at Tailwind's `sm` (640px), `md` (768px) and
`lg` (1024px).

- Full navigation appears at `lg`; below that it collapses into a menu that
  reuses the same link data, locks body scroll while open and closes on
  Escape, on navigation and when the viewport grows past `lg`.
- The staggered stats grid is a single column until `lg`, where absolute
  column starts and top offsets build the offset composition.
- Large mono figures step down a size below `sm` and are allowed to wrap.
- The oversized footer wordmark is an SVG that scales to its container; its
  height tracks the measured glyph box so it does not reserve desktop-height
  space on a phone.

## Motion

GSAP drives the scroll and mount animations (`BlockReveal`, `CountUp`,
`StrokeText`, `ParticleDissolve`). `prefers-reduced-motion` is honoured
globally in `globals.css`, which near-zeroes durations; components that
animate also carry `motion-reduce:` variants where a transform would
otherwise persist.

## Copy conventions

Body copy uses plain punctuation rather than em dashes. When editing copy,
note that a dash can hide as the HTML entity `&mdash;` or as a `\u2014`
escape inside a metadata string, so search for those forms too.

## Deploy

Deploys as a standard Next.js app. On Vercel, import the repository and accept
the defaults; no environment variables are required.
