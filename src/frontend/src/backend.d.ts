import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ToothRecord {
    status: ToothStatus;
    number: bigint;
    recommendation: string;
    condition: string;
}
export type Time = bigint;
export interface ScanResult {
    teeth: Array<ToothRecord>;
    overallScore: bigint;
    timestamp: Time;
}
export interface DentistProfile {
    bio: string;
    name: string;
    languages: Array<string>;
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
export interface UserProfile {
    name: string;
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
    getDentistLanguages(dentist: Principal): Promise<Array<string> | null>;
    getDentistProfile(dentist: Principal): Promise<DentistProfile | null>;
    getDentistSlots(dentistId: Principal): Promise<Array<AvailabilitySlot>>;
    getFeedbackList(): Promise<Array<FeedbackEntry>>;
    getPatientBookings(): Promise<Array<Booking>>;
    getUnreadMessageCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserScanHistory(user: Principal): Promise<Array<ScanResult>>;
    getVisitorCount(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    markPaymentPaid(bookingId: bigint): Promise<void>;
    markPaymentReleased(bookingId: bigint): Promise<void>;
    recordVisit(): Promise<void>;
    registerDentistProfile(profile: DentistProfile): Promise<void>;
    removeAvailabilitySlot(slotId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(bookingId: bigint, text: string): Promise<bigint>;
    submitFeedback(text: string): Promise<void>;
    submitScan(scan: ScanResult): Promise<void>;
    updateDentistProfile(profile: DentistProfile): Promise<void>;
}
