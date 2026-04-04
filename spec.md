# DantaNova Homepage Enhancement

## Current State

HomePage.tsx (2061 lines) has:
- Sticky navbar with logo, QR Code, History, Profile, Sign In
- Hero with headline "Detect Dental Problems Before They Cost You Thousands", two CTAs (Start Free Scan, Watch Demo, Our Pitch), and trust microcopy
- Credibility bar with stats
- Stats row (4 metric cards)
- AI Trust / Why Trust Our AI section
- Product Proof section (text list of scan output items)
- Differentiation comparison table
- Dental Passport section
- How It Works (3-step card row)
- Book a Dentist section (3 big cards)
- Scale signals / Growing Fast strip
- About / Founder section
- Testimonials (12 static + real-time user-submitted)
- Before/After comparison
- Testimonial submission form
- Footer

ResultsPage.tsx has IssueCard component showing tooth number, status badge (Healthy/Risk/Cavity), condition name, recommendation, and a HealthScoreGauge.

## Requested Changes (Diff)

### Add
1. **Clear headline + CTA** -- Strengthen the hero headline to be sharper, more outcome-driven. Add a trust nudge ("No app download needed", "100% private") right below the primary CTA button. Make the primary CTA button larger with stronger contrast.
2. **Show real scan output** -- Add a new "Sample Scan Output" section between the Product Proof section and the comparison table. It should visually simulate what a real results screen looks like: a mock health score gauge (number + ring), 2-3 mock issue cards (one cavity, one risk, one healthy tooth) using the same STATUS_CONFIG color coding as ResultsPage.tsx, and a triage severity banner (Moderate severity shown). This makes it concrete and believable.
3. **Add "How it works"** -- The section already exists but needs visual improvement: add a short animated visual or icon illustration per step to make it feel more interactive. Add a 4th step "Book a Dentist if Needed" to close the loop.
4. **Add demo/sample scan** -- Add a CTA banner just above the "How It Works" section with a prominent "Try a Demo Scan" button that links to /demo. Should be visually distinct (gold gradient background with dark text).
5. **Add trust elements (testimonials, stats)** -- Upgrade the stats row to be larger/bolder with animated count-up effect (use Framer Motion). Add a "Trusted By" social proof strip above the testimonials section with trust badges: "Blockchain Secured", "GDPR Compliant", "End-to-End Encrypted", "94% Accuracy", "Free Forever". Pin the top 3 best testimonials visually as featured (larger card with a gold border glow). Existing 12 testimonials remain below.

### Modify
- Hero headline: change to "AI Dental Scan in 30 Seconds — Know Your Oral Health Instantly" (main), subheadline "Detect cavities, gum disease & 15+ conditions from your phone. No clinic visit needed."
- Primary CTA: make it larger (`py-5 px-10 text-lg`) with a stronger glow
- How It Works: add a 4th step card "04 — Book a Dentist" with a CalendarCheck icon
- Credibility bar: keep as-is

### Remove
- Nothing should be removed

## Implementation Plan

1. **Update hero headline and CTA** in the hero section of HomePage.tsx
2. **Add SampleScanOutput component** inline in HomePage.tsx -- a mock results preview with health score, 3 issue cards, and triage banner
3. **Add DemoScanCTA banner** component above How It Works
4. **Update How It Works** to have 4 steps and richer step icons
5. **Upgrade stats row** with larger type and motion
6. **Add TrustBadgeStrip** above testimonials
7. **Feature 3 top testimonials** with gold-glow card treatment
8. All changes in HomePage.tsx only -- no other files need to change
