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
export function childStillInPremises(
  lastCheckInAt: Date | null,
  lastCheckOutAt: Date | null,
): boolean {
  if (!lastCheckInAt) return false;
  if (!lastCheckOutAt) return true;
  return lastCheckInAt.getTime() > lastCheckOutAt.getTime();
}

export function validateCheckout(
  input: PickupCheckoutInput,
): { ok: true } | { ok: false; reason: string; requiresOverride: boolean } {
  if (!input.childInPremises) {
    return {
      ok: false,
      reason: "Uşaq bağçada qeyd olunmur (check-in yoxdur)",
      requiresOverride: false,
    };
  }

  if (input.directorOverride) {
    return { ok: true };
  }

  if (!input.pickupPersonId) {
    return {
      ok: false,
      reason: "Götürən şəxs seçilməlidir",
      requiresOverride: false,
    };
  }

  const person = input.authorizedList.find(
    (p) => p.id === input.pickupPersonId && p.active,
  );
  if (!person) {
    return {
      ok: false,
      reason: "Götürən şəxs siyahıda deyil — direktor/resepsiya override",
      requiresOverride: true,
    };
  }

  return { ok: true };
}
