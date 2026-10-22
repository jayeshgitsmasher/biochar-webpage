# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static marketing site for **NatWorks Transformation** (biochar carbon dioxide removal projects, Verra VM0044). Plain HTML/CSS/vanilla JS — no build step, package manager, framework, linter, or tests. The only external dependency is Google Fonts (Inter, Montserrat).

## Running

Open `index.html` directly in a browser, or serve the folder so relative links and `window.location.pathname` behave like production:

```
python -m http.server 8000
```

## Architecture

Four pages share one layout: `index.html`, `biochar.html`, `projects.html`, `contact.html`.

- **No templating / shared partials.** The navbar (including the inline SVG logo) and the footer are copy-pasted into every page. Any nav, footer, logo, or copyright change must be made in all four files.
- **CSS layering:** every page loads `css/styles.css` (design tokens in `:root` — colors, gradients, spacing, font sizes, radii — plus all shared components) and `css/animations.css` (keyframes and `.reveal*` / `.hero-animate-*` classes). `biochar.html`, `projects.html`, and `contact.html` also have a large page-specific `<style>` block in `<head>`. Use the `:root` custom properties rather than hard-coding colors.
- **`js/main.js`** is loaded on every page and drives behavior through markup conventions, so most features are added by writing HTML, not JS:
  - `.reveal`, `.reveal-left`, `.reveal-right` → get `.visible` when scrolled into view.
  - `data-count="631" data-suffix="K+"` → animated counter.
  - `<div id="particles">` → background particle field.
  - Active nav link is chosen by matching `href` against the current filename.
- **`js/projects.js`** (projects page only) — filter bar and detail modal. Each `.project-detail-card` carries its data twice: as visible markup *and* as `data-*` attributes (`data-project-id`, `data-title`, `data-methodology`, `data-type`, `data-country`, `data-volume`, `data-status`, `data-desc`, `data-categories`). The modal is built from the `data-*` attributes (plus the card's `.pdc-tag` elements), so edits to a project must update both. Filtering does a substring match of the button's `data-filter` against the space-separated `data-categories`.
- **Inline page scripts:** `contact.html` has client-side-only form validation; the form is not submitted anywhere (no backend). `biochar.html` has its own stability-bar animation.

## Gotchas

- Stability bars are animated twice on `biochar.html`: `main.js` `initStabilityBars()` sets `width` to the raw `data-width` (e.g. `"95"`, no unit — invalid CSS, so it does nothing), and the inline script in `biochar.html` sets it correctly as `95%`. Keep `data-width` as a bare number, or fix both places together.
- Project figures (e.g. 631K lifetime, 90K/yr Bio-SALAM 1, project counts like "View All 11 Projects") are hard-coded in several places on `index.html` and `projects.html`; keep them consistent when changing data.
