# DentaAI Scanner

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Home screen with app branding and "Start Scan" CTA
- Multi-step guided camera scan flow: Front, Upper Jaw, Lower Jaw, Left Side, Right Side
- Camera capture UI with overlay guide frame per scan angle
- Simulated AI analysis screen with animated progress and detection steps
- Results screen with interactive 3D dental arch model (React Three Fiber) showing upper and lower teeth
- Each tooth colored: green (healthy), yellow (risk), red (cavity/decay) based on simulated analysis
- Clickable teeth showing a detail tooltip with condition name and recommendation
- Scan history stored in backend (date, overall score, per-tooth data)
- Legend panel and overall health score summary
- "Scan Again" and "Save Report" actions

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: store scan results (tooth statuses, overall score, timestamp) and retrieve history
2. Select camera component
3. Frontend:
   - Landing/home page
   - Guided scan wizard (5 positions, camera capture per step)
   - Simulated AI processing animation
   - Results page with Three.js 3D dental arch (upper + lower arch, 16 teeth each)
   - Tooth color coding and click-to-detail interaction
   - History list page
