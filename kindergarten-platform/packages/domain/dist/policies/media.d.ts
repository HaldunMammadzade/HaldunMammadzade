export type MediaTagInput = {
    childIds: string[];
    childrenMediaConsent: Record<string, boolean>;
};
/** Razılıq olmayan uşaq media-ya tag edilə bilməz */
export declare function validateMediaTags(input: MediaTagInput): {
    ok: true;
} | {
    ok: false;
    reason: string;
    blockedChildIds: string[];
};
