# AGENTS.md

This document provides an overview of the project for AI agents working on it in future sessions.

## Project Overview

A digital wedding invitation for **Amal & Mohamed**, wedding date **July 17, 2026**. Built as a single-page React app using TanStack Start + Tailwind CSS, deployed on Netlify.

## Architecture

- **Framework**: TanStack Start (React, SSR-ready)
- **Styling**: Tailwind CSS v4 + custom CSS in `src/styles.css`
- **Routing**: TanStack Router (single route `/`)
- **Fonts**: Cinzel (display/serif caps), Cormorant Garamond (script/italic names), EB Garamond (body)

## Key Files

| File | Purpose |
|------|---------|
| `src/routes/index.tsx` | Main wedding invitation page — all UI logic lives here |
| `src/styles.css` | All custom CSS (color vars, animations, card styles, envelope) |
| `src/routes/__root.tsx` | Root layout — sets `<head>` meta and loads Google Fonts |

## Design Decisions

- **Envelope opening animation**: On load, user sees a wax-sealed envelope. Tapping it triggers a CSS envelope-open animation, then fades in the card.
- **Color palette**: Warm cream/ivory background with gold (`#b8965a`) as the signature accent. Avoids cool tones entirely.
- **Typography**: Cinzel for display/labels, Cormorant Garamond italic for the couple's names and verse, EB Garamond for body text.
- **Countdown timer**: Real-time JS countdown to `2026-07-17T19:00:00` local time.
- **Falling petals**: CSS-only animation of rose/gold petal shapes raining in the background.

## Things to Update

- **Venue**: Currently shows "Location to be announced". Update `venue-name` and `venue-detail` text in `index.tsx`, and uncomment the `venue-map-link` anchor when the location is confirmed.
- **RSVP link**: The RSVP button is disabled with "Coming Soon". Replace the `<button>` with an `<a href="...">` pointing to a Google Form or similar when ready.
- **Wedding time**: Currently set to 7:00 PM. Adjust the `WEDDING_DATE` constant and `date-time` text if needed.

## Coding Conventions

- All styling in `src/styles.css` via CSS custom properties (no Tailwind utilities for design-specific rules).
- Keep `index.tsx` as the single route — no need to add routes unless the couple wants sub-pages (gallery, guestbook, etc.).
- Animations use `transform`/`opacity` only for performance.
