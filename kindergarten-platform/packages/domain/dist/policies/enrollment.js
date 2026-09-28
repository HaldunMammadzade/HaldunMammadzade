import { ChildEnrollmentStatus } from "../enums.js";
const ALLOWED_TRANSITIONS = {
    [ChildEnrollmentStatus.Draft]: [ChildEnrollmentStatus.Invited],
    [ChildEnrollmentStatus.Invited]: [ChildEnrollmentStatus.DocumentsPending],
    [ChildEnrollmentStatus.DocumentsPending]: [ChildEnrollmentStatus.Active],
    [ChildEnrollmentStatus.Active]: [
        ChildEnrollmentStatus.Suspended,
        ChildEnrollmentStatus.Graduated,
        ChildEnrollmentStatus.Withdrawn,
    ],
    [ChildEnrollmentStatus.Suspended]: [
        ChildEnrollmentStatus.Active,
        ChildEnrollmentStatus.Withdrawn,
    ],
    [ChildEnrollmentStatus.Graduated]: [],
    [ChildEnrollmentStatus.Withdrawn]: [],
};
export function canTransitionEnrollment(from, to, ctx) {
    const allowed = ALLOWED_TRANSITIONS[from];
    if (!allowed.includes(to)) {
        return {
            ok: false,
            reason: `Keçid icazəli deyil: ${from} → ${to}`,
        };
    }
    if (from === ChildEnrollmentStatus.DocumentsPending &&
        to === ChildEnrollmentStatus.Active) {
        if (!ctx.requiredDocumentsSigned) {
            return { ok: false, reason: "Məcburi sənədlər tam deyil" };
        }
        if (!ctx.directorApproved) {
            return { ok: false, reason: "Direktor təsdiqi tələb olunur" };
        }
    }
    return { ok: true };
}
/** Aktiv olmayan uşaq üçün davamiyyət/check-in bloklanır */
export function childMayAttend(status) {
    return status === ChildEnrollmentStatus.Active;
}
