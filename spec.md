# DantaNova — Professional SaaS Overhaul

## Current State
DantaNova is a functioning AI dental scanner + emergency dentist connection platform with black/gold branding. The homepage has stats, How It Works, Why DantaNova, Dental Passport section, booking cards, testimonials, before/after, and a demo. The site works but lacks trust signals, product proof, outcome-driven messaging, founder identity, AI credibility, and startup-level UX polish.

## Requested Changes (Diff)

### Add
- **Hero section rewrite**: Outcome-driven headline ("Detect Cavities Before They Cost You Thousands"), subheadline targeting patients, 2 CTAs (Try Free Scan + Watch Demo), trust micro-copy ("Free • No equipment • Results in 30s")
- **Accuracy & credibility bar**: "94% detection accuracy • Trained on 50,000+ dental images • Results reviewed by dental professionals" immediately below hero CTA
- **AI Trust Section**: How the AI works — neural network trained on clinical dental images, 15+ conditions, false positive rate, blockchain-secured data. Simple 3-card layout.
- **Founder/About Section**: "Built by Swanandi Vispute" — story behind DantaNova, mission, contact. Gives the product a face and a reason to exist.
- **Differentiation Section**: Comparison table — DantaNova vs. Traditional Checkup vs. Generic Apps. Columns: cost, speed, availability, conditions detected, record sharing.
- **Growth/Scale signals**: "Join 5,000+ users" counter-style stat row, "Processing scans across 12 cities", "Coming soon: Teledentistry consultations"
- **Real-world context**: Clinic-feel visuals — dental imagery generated for hero and AI section
- **Onboarding clarity**: Step-indicator at top of every functional page. Homepage shows "It's free. Scan takes 30 seconds. No equipment needed." below CTA.
- **Micro UX**: Scroll-triggered fade-in on all sections, smooth hover transitions on all cards, consistent button hierarchy (primary gold, secondary outline), section dividers

### Modify
- **Hero headline**: Change from generic to outcome-driven
- **Stats row**: Add visual emphasis and icons, make it feel like social proof not just numbers
- **Testimonials**: Upgrade styling — photo avatar circles, name, city, star rating, quote card with gold left border
- **Footer**: Add "About", "How It Works" anchor links. Better layout — 3 columns.
- **Navigation**: Add smooth scroll to homepage sections. Active state on current route.
- **Feature cards**: Add subtle glow on hover, better icon treatment

### Remove
- Nothing to remove

## Implementation Plan
1. Rewrite HomePage.tsx hero with outcome-driven copy, trust signals, accuracy bar, clear CTA hierarchy
2. Add AI Trust / How It Works (technical) section with 3 cards explaining model, dataset, accuracy
3. Add Founder/About section with name, mission story, contact
4. Add Differentiation comparison table section
5. Add scale/growth signals bar (scans processed, cities, coming soon)
6. Upgrade testimonials with avatar, city, quote card styling
7. Add scroll-triggered animations (framer-motion) on all sections
8. Improve button hierarchy and hover transitions throughout
9. Footer 3-column layout with anchor nav links
10. Use generated dental context images in hero and AI section
