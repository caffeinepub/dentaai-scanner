import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface ScanResult {
    teeth: Array<ToothRecord>;
    overallScore: bigint;
    timestamp: Time;
}
export interface DentistWithPrincipal {
    principal: Principal;
    profile: DentistProfile;
}
export interface AvailabilitySlot {
    dateTimeLabel: string;
    slotId: bigint;
    isBooked: boolean;
    dentistId: Principal;
}
export interface FeedbackEntry {
    text: string;
    author: Principal;
    timestamp: Time;
}
export interface ToothRecord {
    status: ToothStatus;
    number: bigint;
    recommendation: string;
    condition: string;
}
export interface DentistProfile {
    bio: string;
    name: string;
    languages: Array<string>;
    email: string;
    specialty: string;
    isVerified: boolean;
    licenseNumber: string;
    location: string;
}
export interface Message {
    bookingId: bigint;
    messageId: bigint;
    text: string;
    sender: Principal;
    timestamp: Time;
}
export interface Booking {
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    bookingId: bigint;
    patientId: Principal;
    createdAt: Time;
    slotId: bigint;
    dentistId: Principal;
}
export interface UserProfile {
    name: string;
    email: string;
}
export interface Testimonial {
    testimonialId: bigint;
    name: string;
    role: string;
    quote: string;
    author: Principal;
    timestamp: Time;
    rating: bigint;
}
export interface DentalPassport {
    passportId: bigint;
    patientId: Principal;
    homeDentistId: Principal;
    passportCode: string;
    treatmentHistory: string;
    currentConditions: string;
    allergies: string;
    preApprovedBudget: bigint;
    notes: string;
    isActive: boolean;
    createdAt: Time;
}
export interface ReimbursementRequest {
    requestId: bigint;
    passportId: bigint;
    travelingDentistId: Principal;
    homeDentistId: Principal;
    treatmentDescription: string;
    amount: bigint;
    platformFee: bigint;
    status: ReimbursementStatus;
    createdAt: Time;
}
export enum BookingStatus {
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed",
    declined = "declined"
}
export enum PaymentStatus {
    paid = "paid",
    unpaid = "unpaid",
    released = "released"
}
export enum ToothStatus {
    risk = "risk",
    healthy = "healthy",
    cavity = "cavity"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum ReimbursementStatus {
    pending = "pending",
    approved = "approved",
    declined = "declined"
}
export interface backendInterface {
    addAvailabilitySlot(dateTimeLabel: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookSlot(dentistId: Principal, slotId: bigint): Promise<bigint>;
    completeBooking(bookingId: bigint): Promise<void>;
    confirmBooking(bookingId: bigint): Promise<void>;
    declineBooking(bookingId: bigint): Promise<void>;
    deleteUserScans(): Promise<void>;
    getAllDentists(): Promise<Array<DentistProfile>>;
    getBookingMessages(bookingId: bigint): Promise<Array<Message>>;
    getCallerLatestScan(): Promise<ScanResult | null>;
    getCallerScanHistory(): Promise<Array<ScanResult>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDentistBookings(): Promise<Array<Booking>>;
    getDentistByEmail(email: string): Promise<DentistWithPrincipal | null>;
    getDentistLanguages(dentist: Principal): Promise<Array<string> | null>;
    getDentistProfile(dentist: Principal): Promise<DentistProfile | null>;
    getDentistSlots(dentistId: Principal): Promise<Array<AvailabilitySlot>>;
    getFeedbackList(): Promise<Array<FeedbackEntry>>;
    getMyPassport(): Promise<DentalPassport | null>;
    getMyReimbursementRequests(): Promise<Array<ReimbursementRequest>>;
    getPassportByCode(code: string): Promise<DentalPassport | null>;
    getPassportsIssuedByMe(): Promise<Array<DentalPassport>>;
    getPatientBookings(): Promise<Array<Booking>>;
    getReimbursementRequestsForMe(): Promise<Array<ReimbursementRequest>>;
    getTestimonials(): Promise<Array<Testimonial>>;
    getUnreadMessageCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserScanHistory(user: Principal): Promise<Array<ScanResult>>;
    getVisitorCount(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    issuePassport(patientEmail: string, treatmentHistory: string, currentConditions: string, allergies: string, preApprovedBudget: bigint, notes: string): Promise<{ ok: bigint } | { err: string }>;
    markPaymentPaid(bookingId: bigint): Promise<void>;
    markPaymentReleased(bookingId: bigint): Promise<void>;
    recordVisit(): Promise<void>;
    registerDentistProfile(profile: DentistProfile): Promise<void>;
    removeAvailabilitySlot(slotId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    selfIssuePassport(treatmentHistory: string, currentConditions: string, allergies: string, preApprovedBudget: bigint, notes: string): Promise<{ ok: bigint } | { err: string }>;
    sendMessage(bookingId: bigint, text: string): Promise<bigint>;
    settleReimbursement(requestId: bigint, approve: boolean): Promise<{ ok: boolean } | { err: string }>;
    submitFeedback(text: string): Promise<void>;
    submitReimbursementRequest(passportCode: string, treatmentDescription: string, amount: bigint): Promise<{ ok: bigint } | { err: string }>;
    submitScan(scan: ScanResult): Promise<void>;
    submitTestimonial(name: string, role: string, quote: string, rating: bigint): Promise<bigint>;
    updateDentistProfile(profile: DentistProfile): Promise<void>;
}
