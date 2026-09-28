import { ChildEnrollmentStatus } from "../enums.js";
export type EnrollmentTransitionContext = {
    requiredDocumentsSigned: boolean;
    directorApproved: boolean;
};
export declare function canTransitionEnrollment(from: ChildEnrollmentStatus, to: ChildEnrollmentStatus, ctx: EnrollmentTransitionContext): {
    ok: true;
} | {
    ok: false;
    reason: string;
};
/** Aktiv olmayan uşaq üçün davamiyyət/check-in bloklanır */
export declare function childMayAttend(status: ChildEnrollmentStatus): boolean;
