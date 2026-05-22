# WifiSenseBox Public Website & Documentation

This project is the public-facing website for **WifiSenseBox**, providing marketing pages, technical documentation, and resources for the WifiSenseBox ecosystem.

## Project Overview

WifiSenseBox provides privacy-first ambient sensing solutions using GDPR-compliant WiFi sensing and radar technology. We replace invasive cameras with affordable standalone hardware that detects human presence, falls, breathing, and activity across various sectors including senior care, smart homes, and industrial safety.

### Tech Stack

- **Framework:** [Astro 6](https://astro.build/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Interactivity:** [React](https://react.dev/)
- **Deployment:** Static Site Generation (SSG)

### Architecture

- **Marketing Site (`src/pages/`):** Custom Astro pages for the landing page and specialized funnels.
- **Categories & Use Cases (`src/content/`):** Dynamic routing based on product taxonomy (Senior Care, Smart Office, etc.).
- **Localization:** Full i18n support for English and German.

## Building and Running

### Prerequisites

- Node.js (v24+ recommended)
- npm

### Key Commands

| Command           | Action                                             |
| :---------------- | :------------------------------------------------- |
| `npm install`     | Install dependencies                               |
| `npm run dev`     | Start local development server at `localhost:4321` |
| `npm run build`   | Build the static site to the `dist/` directory     |
| `npm run preview` | Preview the production build locally               |

## Development Conventions

### Content Management

- **Categories & Use Cases:** Managed via Astro Content Collections.
- **Localization:**
  - **Static Pages:** English versions live in `src/pages/`. Translations live in `src/pages/[locale]/`.
  - **UI Strings:** Managed via JSON files in `src/i18n/`.
  - **Navigation:** Use the `l()` helper (derived from `t.ts`) to ensure internal links preserve the user's language.

### Navigation Bar

- **Source:** `src/layouts/Site.astro` (single global nav, no separate Nav component).
- **Locale-aware links:** all internal links go through the `l()` helper so `/foo` resolves to `/foo` for EN and `/de/foo` for DE.
- **Structure (left → right):**
  - **Logo** — links to home; the standalone "Home" link is intentionally omitted to save space.
  - **How it works** — direct link.
  - **Category dropdowns** — one per entry in the `categories` content collection, sorted by `rank`. Hover reveals all use cases for that category plus the **ROI Calculator** link as a bottom item.
  - **Legal dropdown** — Impressum / Datenschutz (Privacy) / AGB (Terms). Top link goes to Impressum.
  - **LocaleSwitcher** — EN/DE toggle.
  - **Waitlist CTA** button (anchors to `#waitlist`).
- **Dropdown pattern:** `group` + `group-hover:block` Tailwind utility (no JS). A `pt-2` spacer keeps hover continuous between the trigger and the panel.
- **Mobile:** desktop nav is hidden below `md`; a sticky waitlist CTA bar (`#sticky-cta`) appears on scroll when the inline waitlist form is out of view.
- **Adding a nav item:** edit `Site.astro` directly. If crowding becomes a problem, shorten labels or move secondary items into an existing dropdown (e.g. ROI Calculator already lives inside each category dropdown rather than as a top-level link).

### Waitlist / Lead Capture

- **Component:** `src/components/WaitlistForm.astro`
- **Provider:** [Formspree](https://formspree.io)
- **Endpoint:** Configured via `PUBLIC_FORMSPREE_ID` env var.
- **Success redirect:** Formspree's `_next` hidden field returns the user to the landing page with `?subscribed=1` (waitlist) or `?sent=1` (contact form).

### Analytics — Meta Pixel

- **Base pixel:** Installed inline in `<head>` in `src/layouts/Site.astro` (pixel ID `1785955559052587`). Fires `PageView` on every page.
- **Lead event policy:** `Lead` fires **only on post-submission success**, never on click or submit, to keep lead quality high:
  - **Waitlist:** `src/components/WaitlistForm.astro` checks for `?subscribed=1` after the Formspree redirect, fires `Lead` with `content_name: 'Waitlist Subscription'`, then strips the param via `URLSearchParams` + `history.replaceState` to prevent double-fire on refresh.
  - **Contact:** `src/pages/[...locale]/contact.astro` mirrors the same pattern with `?sent=1` and `content_name: 'Contact Form Submission'`.
- **Pattern when adding new lead events:** redirect to a success param, fire `fbq('track', 'Lead', { content_name, content_category })` from an `is:inline` IIFE, then delete the success param. Do not fire on submit handlers — bots and validation failures inflate counts.

### Legal Requirements

As a German entity, the `impressum.astro` and `datenschutz.astro` pages are legally mandatory.
