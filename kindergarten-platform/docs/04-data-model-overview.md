# Data model (entity əlaqələri)

```
Platform
  └── Tenant (Kindergarten)
        ├── Branch (optional)
        ├── SubscriptionPlan / TenantSubscription
        ├── KindergartenSettings
        ├── Group
        │     └── GroupSchedule
        ├── StaffUser ── StaffGroupAssignment ──► Group
        ├── Child
        │     ├── ChildGuardian ──► GuardianUser (Parent app user)
        │     ├── ChildDocument / Consent
        │     ├── ChildMedicalProfile
        │     ├── AuthorizedPickupPerson
        │     └── ChildEnrollment (status history)
        ├── AttendanceDay / AttendanceRecord
        ├── CheckInOutEvent
        ├── DailyCareReport (entries per day)
        ├── MediaAsset ── MediaChildTag ──► Child
        ├── Conversation ── Message
        ├── Announcement
        ├── CalendarEvent
        ├── MealMenu (week)
        ├── FeePlan / FeeComponent
        ├── Invoice ── InvoiceLine
        ├── Payment
        ├── MedicationPlan ── MedicationDoseLog
        └── AuditLog
```

## Kritik unikal constraint-lər

- `(tenant_id, child_id, date)` — bir davamiyyət günü.
- `(tenant_id, invoice_id, line_no)` — faktura sətri.
- `(tenant_id, guardian_user_id, child_id)` — unikal qəyyum əlaqəsi.
- `(tenant_id, staff_user_id, group_id)` — təyinat.

## Uşaq status enum

`draft | invited | documents_pending | active | suspended | graduated | withdrawn`

## Check-in/out

`CheckInOutEvent`: type in/out, child_id, staff_id, pickup_person_id nullable, timestamp, geo optional, photo optional.

## Multi-bağça valideyn

`GuardianUser` platform səviyyəsində; `ChildGuardian` tenant-scoped — eyni telefon bir neçə bağçada fərqli uşaqlara bağlana bilər.
