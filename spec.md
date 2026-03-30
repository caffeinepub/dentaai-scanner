# DantaNova — High Quality UI Upgrade + Debug Panel

## Current State
DantaNova is a full-stack dental AI scanning app with 15+ pages including Home, Scan, Analysis, Results, History, Find Dentist, Dentist Register/Dashboard, Booking, My Bookings, Messaging, Dental Passport flows, QR Code, Demo, Privacy, and Terms. The design uses a deep black + gold OKLCH design system with Tailwind/shadcn. Most pages are functional but the visual quality, loading states, micro-interactions, and overall polish are at a basic level. There is no testing/debug tooling page.

## Requested Changes (Diff)

### Add
- A `/ui-test` debug panel page with:
  - Quick navigation links to every route in the app
  - "Simulate Scan" buttons for Healthy (score 90), Moderate (score 55), Severe (score 25) results so tester can jump directly to ResultsPage with fake data
  - Page status checklist (shows which pages are reachable)
  - Component preview section (shows LogoCircle, buttons, badges, status colors)
  - A floating "Debug" badge accessible site-wide (small, bottom-left) that links to /ui-test
- Better micro-interactions: subtle hover scale effects on cards, smooth button press feedback
- Loading skeleton states on pages that fetch backend data (FindDentistPage, HistoryPage, BookByCodePage, DentistDashboardPage)
- Smooth page entry animations (staggered fade-in-up) where missing
- Hero section upgrade on HomePage: add a subtle animated radial gradient background pulse behind the logo
- Improve empty states across all pages to be more visually rich (icon + title + description + CTA)
- Add a sticky top navigation/breadcrumb on interior pages for easy back navigation

### Modify
- HomePage: improve visual hierarchy — section headings should use `text-gradient-gold`, spacing more generous, section dividers more visible
- All `glass-card` elements: increase border opacity slightly (0.45 → 0.55) for better depth, add subtle inner shadow
- Buttons: ensure all primary gold buttons have consistent `glow-primary` glow class applied
- ResultsPage: add a subtle "confetti" micro-animation when health score is ≥ 80
- DemoPage: already has good animation; no major changes needed
- FindDentistPage: improve the dentist card layout to show a search/filter row more prominently at top
- Footer: standardize across all pages — same structure everywhere (copyright, Privacy, Terms, developer credit, email)
- Overall: ensure every page uses consistent `max-w-2xl mx-auto` content width with `px-4 py-6` padding

### Remove
- No features should be removed

## Implementation Plan
1. Create `src/frontend/src/pages/UITestPage.tsx` — full debug/test panel page
2. Add `/ui-test` route to App.tsx router
3. Add a small floating debug badge (bottom-left corner) visible site-wide in App.tsx or main layout — only shows when NOT on the /ui-test page
4. Add `ScanContext` test injection helpers so the simulate buttons on UITestPage can push fake scan results and navigate to /results
5. Apply visual polish to HomePage: gradient headings, better section spacing, hero pulse animation
6. Add loading skeleton components to data-fetching pages
7. Standardize footer across all pages
8. Polish card borders and button glows for consistent premium feel
