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
  // Scan and Tooth Data Model
  type ToothStatus = {
    #healthy;
    #risk;
    #cavity;
  };

  type ToothRecord = {
    number : Nat; // Tooth 1-32
    status : ToothStatus;
    condition : Text;
    recommendation : Text;
  };

  type ScanResult = {
    timestamp : Time.Time;
    overallScore : Nat; // 0-100
    teeth : [ToothRecord];
  };

  module ScanResult {
    public func compare(scan1 : ScanResult, scan2 : ScanResult) : Order.Order {
      Int.compare(scan1.timestamp, scan2.timestamp);
    };
  };

  // User Profile Model
  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userScanResults = Map.empty<Principal, [ScanResult]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

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

  // User Profile Functions
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

  // Submit Scan (any user, including guests)
  public shared ({ caller }) func submitScan(scan : ScanResult) : async () {
    validateScan(scan);
    let existingScans = switch (userScanResults.get(caller)) {
      case (null) { [] };
      case (?scans) { scans };
    };
    let updatedScans = existingScans.concat([scan]);
    userScanResults.add(caller, updatedScans);
  };

  // Get caller's scan history (logged-in users only)
  public query ({ caller }) func getCallerScanHistory() : async [ScanResult] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access scan history");
    };
    switch (userScanResults.get(caller)) {
      case (null) { [] };
      case (?scans) { scans.reverse() };
    };
  };

  // Get specific user's scan history (admin and owner only)
  public query ({ caller }) func getUserScanHistory(user : Principal) : async [ScanResult] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own scan history");
    };
    switch (userScanResults.get(user)) {
      case (null) { [] };
      case (?scans) { scans.reverse() };
    };
  };

  // Get latest scan for caller (users only)
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

  // Delete scan results (users only)
  public shared ({ caller }) func deleteUserScans() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete scans");
    };
    userScanResults.remove(caller);
  };
};
