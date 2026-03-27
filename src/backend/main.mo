import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Nat "mo:core/Nat";

import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
  // ===================== TYPES ==============================
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

  module ScanResult {
    public func compare(scan1 : ScanResult, scan2 : ScanResult) : Order.Order {
      Int.compare(scan1.timestamp, scan2.timestamp);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  public type FeedbackEntry = {
    author : Principal;
    text : Text;
    timestamp : Time.Time;
  };

  public type DentistProfile = {
    name : Text;
    specialty : Text;
    licenseNumber : Text;
    location : Text;
    languages : [Text];
    bio : Text;
    isVerified : Bool;
  };

  public type AvailabilitySlot = {
    slotId : Nat;
    dentistId : Principal;
    dateTimeLabel : Text;
    isBooked : Bool;
  };

  public type BookingStatus = {
    #pending;
    #confirmed;
    #declined;
    #completed;
  };

  public type PaymentStatus = {
    #unpaid;
    #paid;
    #released;
  };

  public type Booking = {
    bookingId : Nat;
    patientId : Principal;
    dentistId : Principal;
    slotId : Nat;
    status : BookingStatus;
    paymentStatus : PaymentStatus;
    createdAt : Time.Time;
  };

  public type Message = {
    messageId : Nat;
    bookingId : Nat;
    sender : Principal;
    text : Text;
    timestamp : Time.Time;
  };

  // ===================== STATE ==============================

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userScanResults = Map.empty<Principal, [ScanResult]>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let feedbackList = Map.empty<Nat, FeedbackEntry>();
  let dentistProfiles = Map.empty<Principal, DentistProfile>();
  let availabilitySlots = Map.empty<Nat, AvailabilitySlot>();
  let bookings = Map.empty<Nat, Booking>();
  let messages = Map.empty<Nat, Message>();
  let visitors = Map.empty<Principal, Bool>();

  var feedbackCount : Nat = 0;
  var visitorCount : Nat = 0;
  var nextSlotId : Nat = 1;
  var nextBookingId : Nat = 1;
  var nextMessageId : Nat = 1;

  // ===================== TOOLS ==============================

  func validateScan(scan : ScanResult) {
    if (scan.teeth.size() != 32) {
      Runtime.trap("Each scan must include 32 tooth records");
    };
    for (tooth in scan.teeth.values()) {
      if (tooth.number < 1 or tooth.number > 32) {
        Runtime.trap("Invalid tooth number: " # tooth.number.toText());
      };
    };
  };

  // ================ VISITOR TRACKING ========================

  public shared ({ caller }) func recordVisit() : async () {
    switch (visitors.get(caller)) {
      case (null) {
        visitors.add(caller, true);
        visitorCount += 1;
      };
      case (?_) {};
    };
  };

  public query func getVisitorCount() : async Nat {
    visitorCount;
  };

  // ===================== FEEDBACK ===========================

  public shared ({ caller }) func submitFeedback(text : Text) : async () {
    if (text.size() == 0) {
      Runtime.trap("Feedback cannot be empty");
    };
    let entry : FeedbackEntry = {
      author = caller;
      text = text;
      timestamp = Time.now();
    };
    feedbackList.add(feedbackCount, entry);
    feedbackCount += 1;
  };

  public query ({ caller }) func getFeedbackList() : async [FeedbackEntry] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view feedback");
    };
    var result : [FeedbackEntry] = [];
    var i : Nat = 0;
    while (i < feedbackCount) {
      switch (feedbackList.get(i)) {
        case (?entry) { result := result.concat([entry]) };
        case (null) {};
      };
      i += 1;
    };
    result;
  };

  // ================== USER PROFILE ==========================

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ====================== SCANS =============================

  public shared ({ caller }) func submitScan(scan : ScanResult) : async () {
    validateScan(scan);
    let existingScans = switch (userScanResults.get(caller)) {
      case (null) { [] };
      case (?scans) { scans };
    };
    let updatedScans = existingScans.concat([scan]);
    userScanResults.add(caller, updatedScans);
  };

  public query ({ caller }) func getCallerScanHistory() : async [ScanResult] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access scan history");
    };
    switch (userScanResults.get(caller)) {
      case (null) { [] };
      case (?scans) { scans.reverse() };
    };
  };

  public query ({ caller }) func getUserScanHistory(user : Principal) : async [ScanResult] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own scan history");
    };
    switch (userScanResults.get(user)) {
      case (null) { [] };
      case (?scans) { scans.reverse() };
    };
  };

  public query ({ caller }) func getCallerLatestScan() : async ?ScanResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access latest scan");
    };
    switch (userScanResults.get(caller)) {
      case (null) { null };
      case (?scans) {
        if (scans.size() == 0) { return null };
        ?scans.reverse()[0];
      };
    };
  };

  public shared ({ caller }) func deleteUserScans() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete scans");
    };
    userScanResults.remove(caller);
  };

  // ==================== DENTIST PROFILE =====================

  public shared ({ caller }) func registerDentistProfile(profile : DentistProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register");
    };
    let newProfile : DentistProfile = { profile with isVerified = false };
    dentistProfiles.add(caller, newProfile);
  };

  public shared ({ caller }) func updateDentistProfile(profile : DentistProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    switch (dentistProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Not found: Only existing dentist can update profile");
      };
      case (?existingProfile) {
        let updatedProfile : DentistProfile = {
          profile with
          isVerified = existingProfile.isVerified
        };
        dentistProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query func getAllDentists() : async [DentistProfile] {
    let iter = dentistProfiles.values();
    iter.toArray();
  };

  public query func getDentistProfile(dentist : Principal) : async ?DentistProfile {
    dentistProfiles.get(dentist);
  };

  public query func getDentistLanguages(dentist : Principal) : async ?[Text] {
    switch (dentistProfiles.get(dentist)) {
      case (null) { null };
      case (?profile) { ?profile.languages };
    };
  };

  // ================== AVAILABILITY SLOTS ====================

  public shared ({ caller }) func addAvailabilitySlot(dateTimeLabel : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add slots");
    };
    switch (dentistProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Only registered dentists can add slots");
      };
      case (?_) {
        let slot : AvailabilitySlot = {
          slotId = nextSlotId;
          dentistId = caller;
          dateTimeLabel;
          isBooked = false;
        };
        availabilitySlots.add(nextSlotId, slot);
        nextSlotId += 1;
        slot.slotId;
      };
    };
  };

  public shared ({ caller }) func removeAvailabilitySlot(slotId : Nat) : async () {
    switch (availabilitySlots.get(slotId)) {
      case (null) { Runtime.trap("Slot does not exist!") };
      case (?slot) {
        if (slot.dentistId != caller) {
          Runtime.trap("Unauthorized: Only dentist can remove slot");
        };
        if (slot.isBooked) {
          Runtime.trap("Cannot remove booked slot");
        };
        availabilitySlots.remove(slotId);
      };
    };
  };

  public query func getDentistSlots(dentistId : Principal) : async [AvailabilitySlot] {
    availabilitySlots.values().filter(
      func(slot) {
        slot.dentistId == dentistId;
      }
    ).toArray();
  };

  // ==================== BOOKINGS ============================

  public shared ({ caller }) func bookSlot(dentistId : Principal, slotId : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can book slots");
    };
    switch (availabilitySlots.get(slotId)) {
      case (null) { Runtime.trap("Slot does not exist!") };
      case (?slot) {
        if (not (slot.dentistId == dentistId)) {
          Runtime.trap("Dentist does not own this slot");
        };
        if (slot.isBooked) { Runtime.trap("Slot is already booked!") };
        let booking : Booking = {
          bookingId = nextBookingId;
          patientId = caller;
          dentistId;
          slotId;
          status = #pending;
          paymentStatus = #unpaid;
          createdAt = Time.now();
        };
        bookings.add(nextBookingId, booking);
        nextBookingId += 1;
        let updatedSlot : AvailabilitySlot = {
          slot with isBooked = true;
        };
        availabilitySlots.add(slotId, updatedSlot);
        booking.bookingId;
      };
    };
  };

  public shared ({ caller }) func confirmBooking(bookingId : Nat) : async () {
    switch (bookings.get(bookingId)) {
      case (null) {
        Runtime.trap("Booking does not exist");
      };
      case (?booking) {
        if (booking.dentistId != caller) {
          Runtime.trap("Unauthorized: Only dentist can modify booking status");
        };
        if (booking.status != #pending) {
          Runtime.trap("Cannot confirm non-pending booking");
        };
        let updatedBooking : Booking = {
          booking with
          status = #confirmed;
        };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  public shared ({ caller }) func declineBooking(bookingId : Nat) : async () {
    switch (bookings.get(bookingId)) {
      case (null) {
        Runtime.trap("Booking does not exist");
      };
      case (?booking) {
        if (booking.dentistId != caller) {
          Runtime.trap("Unauthorized: Only dentist can modify booking status");
        };
        if (booking.status != #pending) {
          Runtime.trap("Cannot decline non-pending booking");
        };
        let updatedBooking : Booking = {
          booking with
          status = #declined;
        };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  public shared ({ caller }) func completeBooking(bookingId : Nat) : async () {
    switch (bookings.get(bookingId)) {
      case (null) {
        Runtime.trap("Booking does not exist");
      };
      case (?booking) {
        if (booking.patientId != caller) {
          Runtime.trap("Unauthorized: Only patient can complete booking");
        };
        if (booking.status != #confirmed) {
          Runtime.trap("Cannot complete non-confirmed booking");
        };
        let updatedBooking : Booking = {
          booking with
          status = #completed;
        };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  public shared ({ caller }) func markPaymentPaid(bookingId : Nat) : async () {
    switch (bookings.get(bookingId)) {
      case (null) {
        Runtime.trap("Booking does not exist");
      };
      case (?booking) {
        if (booking.patientId != caller) {
          Runtime.trap("Unauthorized: Only patient can mark payment as paid");
        };
        if (booking.status != #confirmed) {
          Runtime.trap("Cannot pay for non-confirmed booking");
        };
        if (booking.paymentStatus != #unpaid) {
          Runtime.trap("Cannot mark payment already paid/released");
        };
        let updatedBooking : Booking = {
          booking with
          paymentStatus = #paid;
        };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  public shared ({ caller }) func markPaymentReleased(bookingId : Nat) : async () {
    switch (bookings.get(bookingId)) {
      case (null) {
        Runtime.trap("Booking does not exist");
      };
      case (?booking) {
        if (booking.dentistId != caller) {
          Runtime.trap("Unauthorized: Only dentist can release payment");
        };
        if (booking.status != #completed) {
          Runtime.trap("Cannot release payment for non-completed booking");
        };
        if (booking.paymentStatus != #paid) {
          Runtime.trap("Cannot release unpaid payment");
        };
        let updatedBooking : Booking = {
          booking with
          paymentStatus = #released;
        };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  public query ({ caller }) func getPatientBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };
    bookings.values().filter(
      func(booking) {
        booking.patientId == caller;
      }
    ).toArray();
  };

  public query ({ caller }) func getDentistBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };
    bookings.values().filter(
      func(booking) {
        booking.dentistId == caller;
      }
    ).toArray();
  };

  // ==================== MESSAGING ===========================

  public shared ({ caller }) func sendMessage(bookingId : Nat, text : Text) : async Nat {
    switch (bookings.get(bookingId)) {
      case (null) {
        Runtime.trap("Booking does not exist!");
      };
      case (?booking) {
        if (not (caller == booking.patientId or caller == booking.dentistId)) {
          Runtime.trap("Unauthorized: Can only send message for your own booking");
        };
        let message : Message = {
          messageId = nextMessageId;
          bookingId;
          sender = caller;
          text;
          timestamp = Time.now();
        };
        messages.add(nextMessageId, message);
        nextMessageId += 1;
        message.messageId;
      };
    };
  };

  public query ({ caller }) func getBookingMessages(bookingId : Nat) : async [Message] {
    switch (bookings.get(bookingId)) {
      case (null) { [] };
      case (?booking) {
        if (not (caller == booking.patientId or caller == booking.dentistId)) {
          Runtime.trap("Unauthorized: Can only read messages for your own booking");
        };
        messages.values().filter(
          func(message) { message.bookingId == bookingId }
        ).toArray();
      };
    };
  };

  public query ({ caller }) func getUnreadMessageCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view message count");
    };
    let userBookings = bookings.filter(
      func(_id, booking) {
        booking.patientId == caller or booking.dentistId == caller;
      }
    );
    var count = 0;
    for ((_, booking) in userBookings.entries()) {
      switch (messages.get(booking.bookingId)) {
        case (null) {};
        case (?msg) {
          if (msg.sender != caller) { count += 1 };
        };
      };
    };
    count;
  };
};

