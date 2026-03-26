# DantaNova — Real Dentist-Patient Connection

## Current State
The app has a `/find-dentist` page with 6 hardcoded sample dentist profiles. The "Request Appointment" button shows a toast but does nothing real. No dentist registration, no real booking, no messaging, no payment.

## Requested Changes (Diff)

### Add
- **Dentist Registration** — dentists sign up with name, specialty, license number, location, languages, bio; stored on backend
- **Dentist Availability** — dentists set available date/time slots from their dashboard
- **Booking System** — patient selects a time slot from a dentist's real availability, creates a booking request; dentist can confirm or decline from their dashboard
- **In-App Messaging** — per-booking chat between patient and dentist; both sides can send/read messages
- **Simulated Payment** — patient marks payment as "paid" when booking is confirmed; dentist sees payment status as "received" after visit is marked complete
- **Dentist Dashboard** — manage profile, availability slots, incoming booking requests, and messages
- **Patient Bookings Page** — patients see all their bookings with status, can message dentist, mark visit complete
- **In-app notification badges** — unread message count shown on navigation

### Modify
- **FindDentistPage** — fetch dentists from backend instead of hardcoded data; "Book" button navigates to real booking flow
- **App.tsx** — add new routes: /dentist-register, /dentist-dashboard, /book, /my-bookings, /messages/:bookingId

### Remove
- Hardcoded DENTISTS array from FindDentistPage

## Implementation Plan
1. Backend: Add DentistProfile, AvailabilitySlot, Booking, Message types and all CRUD methods
2. Regenerate backend bindings
3. Frontend: DentistRegisterPage — form to sign up as a dentist
4. Frontend: DentistDashboardPage — manage availability, view/confirm bookings, chat
5. Frontend: BookingPage — patient picks a slot and submits booking request
6. Frontend: MyBookingsPage — patient's booking history with status and messaging
7. Frontend: MessagingPage — in-app chat per booking
8. Update FindDentistPage to use real backend data
9. Add routes in App.tsx
