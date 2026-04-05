# DantaNova – Tony Stark Level Upgrade

## Current State
DantaNova is a full-stack AI dental platform on ICP with React+TypeScript frontend, Motoko backend. The current design uses black/gold palette, Bricolage Grotesque + Satoshi fonts, OKLCH color system, glass cards, and 3D dental arch (React Three Fiber). It has 19+ routes including home, scan, results, history, dentist finder/register/dashboard, booking, messaging, passport system, QR code, demo, pitch page, UI test panel. Homepage has hero, stats, how-it-works, dental passport section, booking cards, testimonials, before/after, CTA banner, and footer.

## Requested Changes (Diff)

### Add
- **Iron Man / Tony Stark HUD hero**: Fullscreen animated scan overlay with scan-line moving vertically, connection points forming 3D mesh, "AI Analyzing..." HUD text, neon blue (#00D1FF) + electric purple (#7B61FF) color accents layered over existing dark background
- **Neural Network animation section**: Dynamic nodes connecting with animated edges, simulating AI thinking
- **Live Demo Section**: Drag & drop area with instant animated AI preview showing cavity heatmap results
- **AI Trust Section**: Accuracy %, model details, data privacy badges with animated counters
- **Scan Heatmap visual**: Red=issue/Green=healthy overlay in results/demo
- **Micro-interactions**: Hover glow pulse on buttons, 3D tilt on cards, ripple on upload, number count-up on health score
- **Marketing Dashboard** page at `/marketing-dashboard`
- **Operations Dashboard** page at `/operations-dashboard`
- **Support Dashboard** page at `/support-dashboard`
- Neon blue + electric purple accent variables alongside existing gold system

### Modify
- **Design system**: Add neon blue (#00D1FF → oklch(0.82 0.16 205)) and electric purple (#7B61FF → oklch(0.62 0.2 280)) as CSS variables alongside gold
- **Hero section**: Overlay Iron Man-style HUD elements: animated scan line, mesh formation points, glowing reticle rings, HUD text
- **index.css**: Add neon blue gradient utility, electric pulse keyframe animation, scan-line keyframe, hud-glow class
- **App.tsx**: Add routes for 3 new dashboard pages
- **HomePage**: Replace/augment hero with Iron Man scan HUD, add neural network section, live demo section, AI trust section between existing sections
- **Results page**: Add animated count-up on health score, heatmap color intensity on issue cards

### Remove
- Nothing removed; all existing features preserved

## Implementation Plan
1. Update `index.css`: add neon blue + electric purple CSS variables, scan-line animation keyframe, hud-pulse keyframe, neural-net glow classes, neon gradient utilities, 3D card tilt CSS
2. Create `MarketingDashboardPage.tsx`, `OperationsDashboardPage.tsx`, `SupportDashboardPage.tsx` with full SaaS dashboard UIs
3. Update `App.tsx`: add 3 new dashboard routes
4. Update `HomePage.tsx`: Iron Man hero HUD overlay (animated scan line, mesh points, HUD rings, AI analyzing text), Neural Network animation section (canvas-based animated nodes), Live Demo Section (drag+drop with instant heatmap preview), AI Trust section (animated counters for accuracy/scans/speed), enhanced micro-interactions on all interactive elements
5. Delegate all frontend work to frontend subagent
