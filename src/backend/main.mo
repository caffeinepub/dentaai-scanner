import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
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

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userScanResults = Map.empty<Principal, [ScanResult]>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let feedbackList = Map.empty<Nat, FeedbackEntry>();
  var feedbackCount : Nat = 0;
  var visitorCount : Nat = 0;
  let visitors = Map.empty<Principal, Bool>();

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

  // Visitor tracking
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

  // Feedback
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

  // User Profile
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
};
