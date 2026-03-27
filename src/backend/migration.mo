import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

module {
  type OldToothStatus = {
    #healthy;
    #risk;
    #cavity;
  };

  type OldToothRecord = {
    number : Nat;
    status : OldToothStatus;
    condition : Text;
    recommendation : Text;
  };

  type OldScanResult = {
    timestamp : Int;
    overallScore : Nat;
    teeth : [OldToothRecord];
  };

  type OldFeedbackEntry = {
    author : Principal;
    text : Text;
    timestamp : Int;
  };

  type OldMessage = {
    messageId : Nat;
    bookingId : Nat;
    sender : Principal;
    text : Text;
    timestamp : Int;
  };

  type OldTestimonial = {
    testimonialId : Nat;
    author : Principal;
    name : Text;
    role : Text;
    quote : Text;
    rating : Nat;
    timestamp : Int;
  };

  type OldTestimonialMap = Map.Map<Nat, OldTestimonial>;

  type OldBookingStatus = {
    #pending;
    #confirmed;
    #declined;
    #completed;
  };

  type OldPaymentStatus = {
    #unpaid;
    #paid;
    #released;
  };

  type OldBooking = {
    bookingId : Nat;
    patientId : Principal;
    dentistId : Principal;
    slotId : Nat;
    status : OldBookingStatus;
    paymentStatus : OldPaymentStatus;
    createdAt : Int;
  };

  type OldAvailabilitySlot = {
    slotId : Nat;
    dentistId : Principal;
    dateTimeLabel : Text;
    isBooked : Bool;
  };

  type OldUserProfile = {
    name : Text;
  };

  type OldDentistProfile = {
    name : Text;
    specialty : Text;
    licenseNumber : Text;
    location : Text;
    languages : [Text];
    bio : Text;
    isVerified : Bool;
  };

  type OldActor = {
    userScanResults : Map.Map<Principal, [OldScanResult]>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    feedbackList : Map.Map<Nat, OldFeedbackEntry>;
    dentistProfiles : Map.Map<Principal, OldDentistProfile>;
    availabilitySlots : Map.Map<Nat, OldAvailabilitySlot>;
    bookings : Map.Map<Nat, OldBooking>;
    messages : Map.Map<Nat, OldMessage>;
    testimonials : OldTestimonialMap;
    visitors : Map.Map<Principal, Bool>;
    feedbackCount : Nat;
    visitorCount : Nat;
    nextSlotId : Nat;
    nextBookingId : Nat;
    nextMessageId : Nat;
    nextTestimonialId : Nat;
  };

  func convertOldUserProfileToNew(old : OldUserProfile) : { name : Text; email : Text } {
    { name = old.name; email = "" };
  };

  func convertOldDentistProfileToNew(old : OldDentistProfile) : {
    name : Text;
    email : Text;
    specialty : Text;
    licenseNumber : Text;
    location : Text;
    languages : [Text];
    bio : Text;
    isVerified : Bool;
  } {
    {
      name = old.name;
      email = "";
      specialty = old.specialty;
      licenseNumber = old.licenseNumber;
      location = old.location;
      languages = old.languages;
      bio = old.bio;
      isVerified = old.isVerified;
    };
  };

  type NewToothStatus = {
    #healthy;
    #risk;
    #cavity;
  };

  type NewToothRecord = {
    number : Nat;
    status : NewToothStatus;
    condition : Text;
    recommendation : Text;
  };

  type NewScanResult = {
    timestamp : Int;
    overallScore : Nat;
    teeth : [NewToothRecord];
  };

  type NewUserProfile = {
    name : Text;
    email : Text;
  };

  type NewDentistProfile = {
    name : Text;
    email : Text;
    specialty : Text;
    licenseNumber : Text;
    location : Text;
    languages : [Text];
    bio : Text;
    isVerified : Bool;
  };

  type NewActor = {
    userScanResults : Map.Map<Principal, [NewScanResult]>;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    feedbackList : Map.Map<Nat, OldFeedbackEntry>;
    dentistProfiles : Map.Map<Principal, NewDentistProfile>;
    availabilitySlots : Map.Map<Nat, OldAvailabilitySlot>;
    bookings : Map.Map<Nat, OldBooking>;
    messages : Map.Map<Nat, OldMessage>;
    testimonials : OldTestimonialMap;
    visitors : Map.Map<Principal, Bool>;
    emailToDentistPrincipal : Map.Map<Text, Principal>;
    feedbackCount : Nat;
    visitorCount : Nat;
    nextSlotId : Nat;
    nextBookingId : Nat;
    nextMessageId : Nat;
    nextTestimonialId : Nat;
  };
  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_p, oldProfile) { convertOldUserProfileToNew(oldProfile) }
    );
    let newDentistProfiles = old.dentistProfiles.map<Principal, OldDentistProfile, NewDentistProfile>(
      func(_p, oldProfile) { convertOldDentistProfileToNew(oldProfile) }
    );
    {
      userScanResults = old.userScanResults;
      userProfiles = newUserProfiles;
      feedbackList = old.feedbackList;
      dentistProfiles = newDentistProfiles;
      availabilitySlots = old.availabilitySlots;
      bookings = old.bookings;
      messages = old.messages;
      testimonials = old.testimonials;
      visitors = old.visitors;
      emailToDentistPrincipal = Map.empty<Text, Principal>();
      feedbackCount = old.feedbackCount;
      visitorCount = old.visitorCount;
      nextSlotId = old.nextSlotId;
      nextBookingId = old.nextBookingId;
      nextMessageId = old.nextMessageId;
      nextTestimonialId = old.nextTestimonialId;
    };
  };
};
