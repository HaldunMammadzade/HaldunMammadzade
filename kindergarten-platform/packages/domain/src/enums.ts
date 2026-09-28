/** Uşaq qəbul lifecycle — docs/01-business-logic.md §4.2 */
export enum ChildEnrollmentStatus {
  Draft = "draft",
  Invited = "invited",
  DocumentsPending = "documents_pending",
  Active = "active",
  Suspended = "suspended",
  Graduated = "graduated",
  Withdrawn = "withdrawn",
}

export enum AttendanceStatus {
  Present = "present",
  AbsenceExcused = "absence_excused",
  AbsenceUnexcused = "absence_unexcused",
  Sick = "sick",
  Holiday = "holiday",
  PickupEarly = "pickup_early",
}

export enum CheckEventType {
  CheckIn = "check_in",
  CheckOut = "check_out",
}

export enum InvoiceStatus {
  Draft = "draft",
  Issued = "issued",
  PartiallyPaid = "partially_paid",
  Paid = "paid",
  Overdue = "overdue",
  WrittenOff = "written_off",
}

export enum StaffRole {
  Director = "director",
  Accountant = "accountant",
  LeadTeacher = "lead_teacher",
  AssistantTeacher = "assistant_teacher",
  Nurse = "nurse",
  Reception = "reception",
}

export enum GuardianPermission {
  PrimaryContact = "primary_contact",
  CanPickup = "can_pickup",
  MediaConsent = "media_consent",
  ReceiveBilling = "receive_billing",
}
