# DantaNova

## Current State
UserProfile has only `name`. DentistProfile has `name`, specialty, license, location, bio, languages -- no email. Dentist Booking Code shown in dashboard is the cryptographic Principal ID (long random string). BookByCodePage requires pasting the full Principal ID to find a dentist.

## Requested Changes (Diff)

### Add
- `email` field to `UserProfile` (name + email)
- `email` field to `DentistProfile`
- Backend map `emailToDentistPrincipal: Map<Text, Principal>` for email-based lookup
- Backend query `getDentistByEmail(email: Text): async ?{profile: DentistProfile; principal: Principal}` returning profile and principal
- Backend query `getUserByEmail` equivalent via stored email in profile

### Modify
- `registerDentistProfile` and `updateDentistProfile`: store email in emailToDentistPrincipal map
- `saveCallerUserProfile`: now accepts `{name: Text; email: Text}`
- DentistRegisterPage: add email input field
- DentistDashboardPage: show dentist's email as the Booking Code (instead of Principal ID)
- BookByCodePage: search by email address (not Principal ID), UI updated to say "Enter Dentist Email"
- ProfilePage: show email; add form to save name + email

### Remove
- Nothing removed

## Implementation Plan
1. Update Motoko backend: add email to UserProfile, add email to DentistProfile, add emailToDentistPrincipal map, add getDentistByEmail query
2. Regenerate backend bindings
3. Update DentistRegisterPage to include email field
4. Update DentistDashboardPage: Booking Code section shows dentist's email
5. Update BookByCodePage: search by email, calls getDentistByEmail
6. Update ProfilePage: show email, allow saving name + email
