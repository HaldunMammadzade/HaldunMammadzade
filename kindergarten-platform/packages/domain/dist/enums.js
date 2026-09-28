/** Uşaq qəbul lifecycle — docs/01-business-logic.md §4.2 */
export var ChildEnrollmentStatus;
(function (ChildEnrollmentStatus) {
    ChildEnrollmentStatus["Draft"] = "draft";
    ChildEnrollmentStatus["Invited"] = "invited";
    ChildEnrollmentStatus["DocumentsPending"] = "documents_pending";
    ChildEnrollmentStatus["Active"] = "active";
    ChildEnrollmentStatus["Suspended"] = "suspended";
    ChildEnrollmentStatus["Graduated"] = "graduated";
    ChildEnrollmentStatus["Withdrawn"] = "withdrawn";
})(ChildEnrollmentStatus || (ChildEnrollmentStatus = {}));
export var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["Present"] = "present";
    AttendanceStatus["AbsenceExcused"] = "absence_excused";
    AttendanceStatus["AbsenceUnexcused"] = "absence_unexcused";
    AttendanceStatus["Sick"] = "sick";
    AttendanceStatus["Holiday"] = "holiday";
    AttendanceStatus["PickupEarly"] = "pickup_early";
})(AttendanceStatus || (AttendanceStatus = {}));
export var CheckEventType;
(function (CheckEventType) {
    CheckEventType["CheckIn"] = "check_in";
    CheckEventType["CheckOut"] = "check_out";
})(CheckEventType || (CheckEventType = {}));
export var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["Draft"] = "draft";
    InvoiceStatus["Issued"] = "issued";
    InvoiceStatus["PartiallyPaid"] = "partially_paid";
    InvoiceStatus["Paid"] = "paid";
    InvoiceStatus["Overdue"] = "overdue";
    InvoiceStatus["WrittenOff"] = "written_off";
})(InvoiceStatus || (InvoiceStatus = {}));
export var StaffRole;
(function (StaffRole) {
    StaffRole["Director"] = "director";
    StaffRole["Accountant"] = "accountant";
    StaffRole["LeadTeacher"] = "lead_teacher";
    StaffRole["AssistantTeacher"] = "assistant_teacher";
    StaffRole["Nurse"] = "nurse";
    StaffRole["Reception"] = "reception";
})(StaffRole || (StaffRole = {}));
export var GuardianPermission;
(function (GuardianPermission) {
    GuardianPermission["PrimaryContact"] = "primary_contact";
    GuardianPermission["CanPickup"] = "can_pickup";
    GuardianPermission["MediaConsent"] = "media_consent";
    GuardianPermission["ReceiveBilling"] = "receive_billing";
})(GuardianPermission || (GuardianPermission = {}));
