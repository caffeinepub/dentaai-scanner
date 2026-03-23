# DantaNova - Privacy & Legal Pages

## Current State
DantaNova is a live dental AI scanning app with sign-in, scan history, feedback, and QR code features. A PrivacyPage.tsx exists but immediately redirects to home (was removed per earlier user request). No Terms of Service page exists. No cookie notice exists. Footer has no legal links.

## Requested Changes (Diff)

### Add
- Privacy Policy page (`/privacy`) -- full written policy covering data collection, storage, GDPR rights (right to access, deletion, portability), data retention, contact info. Linked from footer.
- Terms of Service page (`/terms`) -- full written ToS covering use of app, disclaimer that results are not medical advice, user responsibilities, intellectual property. Linked from footer.
- Cookie Notice banner -- small bottom banner shown once per session. DantaNova uses localStorage (for consent/session state) but no tracking cookies. Banner informs user of this and has a dismiss button. Stored in localStorage so it doesn't reappear.
- Footer links -- add "Privacy Policy" and "Terms of Service" links in all page footers.

### Modify
- `App.tsx` -- add routes for `/privacy` and `/terms`
- `PrivacyPage.tsx` -- replace redirect-to-home stub with full Privacy Policy content
- All page footers -- add legal links

### Remove
- Nothing removed

## Implementation Plan
1. Write full PrivacyPage.tsx with GDPR-compliant Privacy Policy content
2. Create TermsPage.tsx with Terms of Service content
3. Create CookieNotice.tsx component -- bottom banner, dismissable, uses localStorage
4. Add `/terms` route in App.tsx
5. Mount CookieNotice in App.tsx
6. Update footer in HomePage.tsx and all other pages to include Privacy Policy and Terms of Service links
