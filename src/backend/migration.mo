import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import AccessControl "authorization/access-control";

module {
  // Persistent types
  type ToothStatus = {
    #healthy;
    #risk;
    #cavity;
  };

  type ToothRecord = {
    number : Nat;
    status : ToothStatus;
    condition : Text;
    recommendation : Text;
  };

  type ScanResult = {
    timestamp : Time.Time;
    overallScore : Nat;
    teeth : [ToothRecord];
  };

  public type UserProfile = {
    name : Text;
  };

  public type FeedbackEntry = {
    author : Principal;
    text : Text;
    timestamp : Time.Time;
  };

  type DentistProfile = {
    name : Text;
    specialty : Text;
    licenseNumber : Text;
    location : Text;
    languages : [Text];
    bio : Text;
    isVerified : Bool;
  };

  type AvailabilitySlot = {
    slotId : Nat;
    dentistId : Principal;
    dateTimeLabel : Text;
    isBooked : Bool;
  };

  type BookingStatus = {
    #pending;
    #confirmed;
    #declined;
    #completed;
  };

  type PaymentStatus = {
    #unpaid;
    #paid;
    #released;
  };

  type Booking = {
    bookingId : Nat;
    patientId : Principal;
    dentistId : Principal;
    slotId : Nat;
    status : BookingStatus;
    paymentStatus : PaymentStatus;
    createdAt : Time.Time;
  };

  type Message = {
    messageId : Nat;
    bookingId : Nat;
    sender : Principal;
    text : Text;
    timestamp : Time.Time;
  };

  // Old actor state (without new persistent fields)
  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    userScanResults : Map.Map<Principal, [ScanResult]>;
    userProfiles : Map.Map<Principal, UserProfile>;
    feedbackList : Map.Map<Nat, FeedbackEntry>;
    visitors : Map.Map<Principal, Bool>;
    feedbackCount : Nat;
    visitorCount : Nat;
  };

  // New actor state (with new persistent fields initialized)
  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    userScanResults : Map.Map<Principal, [ScanResult]>;
    userProfiles : Map.Map<Principal, UserProfile>;
    feedbackList : Map.Map<Nat, FeedbackEntry>;
    dentistProfiles : Map.Map<Principal, DentistProfile>;
    availabilitySlots : Map.Map<Nat, AvailabilitySlot>;
    bookings : Map.Map<Nat, Booking>;
    messages : Map.Map<Nat, Message>;
    visitors : Map.Map<Principal, Bool>;
    feedbackCount : Nat;
    visitorCount : Nat;
    nextSlotId : Nat;
    nextBookingId : Nat;
    nextMessageId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      dentistProfiles = Map.empty<Principal, DentistProfile>();
      availabilitySlots = Map.empty<Nat, AvailabilitySlot>();
      bookings = Map.empty<Nat, Booking>();
      messages = Map.empty<Nat, Message>();
      nextSlotId = 1;
      nextBookingId = 1;
      nextMessageId = 1;
    };
  };
};

