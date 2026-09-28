export type AuthorizedPickup = {
    id: string;
    fullName: string;
    active: boolean;
};
export type PickupCheckoutInput = {
    childInPremises: boolean;
    pickupPersonId: string | null;
    authorizedList: AuthorizedPickup[];
    directorOverride: boolean;
};
/** Gün sonu alert: check-in var, check-out yoxdur */
export declare function childStillInPremises(lastCheckInAt: Date | null, lastCheckOutAt: Date | null): boolean;
export declare function validateCheckout(input: PickupCheckoutInput): {
    ok: true;
} | {
    ok: false;
    reason: string;
    requiresOverride: boolean;
};
