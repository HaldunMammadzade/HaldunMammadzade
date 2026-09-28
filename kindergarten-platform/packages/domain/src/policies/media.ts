export type MediaTagInput = {
  childIds: string[];
  childrenMediaConsent: Record<string, boolean>;
};

/** Razılıq olmayan uşaq media-ya tag edilə bilməz */
export function validateMediaTags(
  input: MediaTagInput,
): { ok: true } | { ok: false; reason: string; blockedChildIds: string[] } {
  const blocked = input.childIds.filter(
    (id) => !input.childrenMediaConsent[id],
  );
  if (blocked.length > 0) {
    return {
      ok: false,
      reason: "Foto/video razılığı olmayan uşaqlar tag edilə bilməz",
      blockedChildIds: blocked,
    };
  }
  return { ok: true };
}
