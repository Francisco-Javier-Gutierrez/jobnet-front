import { useAuth } from "#imports";

export type ContentKind = "post" | "job";

export interface ToggleInteractionOptions {
  userId?: string;
  userIdentifiers?: string[];
  extraTargets?: any[];
  onUnauthenticated?: () => void;
  onSuccess?: (res: any, item: any) => void;
  onError?: (err: unknown, item: any) => void;
}

/**
 * Resolves the canonical item ID for posts (`uniqueId || id`) and jobs (`id || uniqueId`).
 */
export function resolveItemId(item: any, kind: ContentKind): string {
  if (!item) return "";
  if (kind === "job") return String(item.id || item.uniqueId || "");
  return String(item.uniqueId || item.id || "");
}

/**
 * Infers whether an arbitrary feed item is a job/vacancy or a community post.
 */
export function inferContentKind(item: any): ContentKind {
  if (item?.isVacancy || item?.tipo === "VACANTE" || item?.type === "VACANCY") {
    return "job";
  }
  return "post";
}

function collectUserIdentifiers(
  authUser: any,
  passedUserId?: string,
  extra?: string[],
): string[] {
  const ids = new Set<string>();
  const add = (val: unknown) => {
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      ids.add(String(val).toLowerCase());
    }
  };
  add(passedUserId);
  add(authUser?.id);
  add(authUser?.email);
  extra?.forEach(add);
  return Array.from(ids);
}

function matchesAnyUser(list: unknown[], identifiers: string[]): boolean {
  if (!Array.isArray(list) || list.length === 0 || identifiers.length === 0) {
    return false;
  }
  return list.some((entry) =>
    identifiers.includes(String(entry).toLowerCase()),
  );
}

/**
 * Standardized check for whether a post or job is liked by the current user.
 */
export function isItemLiked(
  item: any,
  userIdentifiers: string[] = [],
): boolean {
  if (!item) return false;
  const list = item.likesList || item.likedBy || item.likes_list || [];
  if (matchesAnyUser(list, userIdentifiers)) return true;
  return Boolean(item.isLiked || item.liked);
}

/**
 * Standardized check for whether a post or job is bookmarked by the current user.
 */
export function isItemBookmarked(
  item: any,
  userIdentifiers: string[] = [],
): boolean {
  if (!item) return false;
  const list =
    item.bookmarksList ||
    item.bookmarkedBy ||
    item.savedBy ||
    item.bookmarks ||
    [];
  if (matchesAnyUser(list, userIdentifiers)) return true;
  return Boolean(item.isBookmarked || item.bookmarked);
}

/**
 * Standardized likes count resolution prioritizing explicit numeric counters,
 * falling back to list length.
 */
export function getItemLikesCount(item: any): number {
  if (!item) return 0;
  if (typeof item.likesCount === "number") return item.likesCount;
  if (typeof item.likes === "number") return item.likes;
  if (Array.isArray(item.likesList)) return item.likesList.length;
  if (Array.isArray(item.likedBy)) return item.likedBy.length;
  return 0;
}

/**
 * Standardized bookmarks count resolution.
 */
export function getItemBookmarksCount(item: any): number {
  if (!item) return 0;
  const list =
    item.bookmarksList || item.bookmarkedBy || item.savedBy || item.bookmarks;
  if (Array.isArray(list) && list.length > 0) return list.length;
  if (typeof item.bookmarksCount === "number") return item.bookmarksCount;
  return Array.isArray(list) ? list.length : 0;
}

/**
 * Standardized comments count resolution.
 */
export function getItemCommentsCount(item: any): number {
  if (!item) return 0;
  if (typeof item.commentsCount === "number") return item.commentsCount;
  if (Array.isArray(item.comments)) return item.comments.length;
  return 0;
}

/**
 * Shared composable for liking and bookmarking both posts and vacancies/jobs
 * with consistent optimistic UI updates, server sync, and error rollback.
 */
export function useContentInteractions() {
  const { data: session, status } = useAuth();

  const currentUserId = computed(() => {
    const user = session.value?.user as any;
    return String(user?.id || user?.email || "");
  });

  const getUserIdentifiers = (
    passedUserId?: string,
    extra?: string[],
  ): string[] => {
    return collectUserIdentifiers(session.value?.user, passedUserId, extra);
  };

  const toggleLike = async (
    item: any,
    kind?: ContentKind,
    options: ToggleInteractionOptions = {},
  ) => {
    if (!item) return;

    const effectiveKind = kind ?? inferContentKind(item);
    const uid = options.userId || currentUserId.value;
    if (!uid) {
      options.onUnauthenticated?.();
      return;
    }

    const itemId = resolveItemId(item, effectiveKind);
    if (!itemId) return;

    const identifiers = getUserIdentifiers(uid, options.userIdentifiers);
    const targets = Array.from(
      new Set([item, ...(options.extraTargets || [])].filter(Boolean)),
    );

    const snapshots = targets.map((t) => {
      if (!Array.isArray(t.likesList)) t.likesList = [];
      return {
        target: t,
        likesList: [...t.likesList],
        likesCount: t.likesCount,
        likes: t.likes,
        isLiked: t.isLiked,
      };
    });

    targets.forEach((t) => {
      const idx = t.likesList.findIndex((entry: unknown) =>
        identifiers.includes(String(entry).toLowerCase()),
      );
      const wasLiked = idx !== -1 || Boolean(t.isLiked || t.liked);
      const currentCount = getItemLikesCount(t);

      if (wasLiked) {
        if (idx !== -1) t.likesList.splice(idx, 1);
        const nextCount = Math.max(0, currentCount - 1);
        t.likesCount = nextCount;
        t.likes = nextCount;
        t.isLiked = false;
        t.liked = false;
      } else {
        if (idx === -1) t.likesList.push(uid);
        const nextCount = currentCount + 1;
        t.likesCount = nextCount;
        t.likes = nextCount;
        t.isLiked = true;
        t.liked = true;
      }
    });

    const endpoint =
      effectiveKind === "job"
        ? `/api/jobs/${itemId}/like`
        : `/api/posts/${itemId}/like`;

    try {
      const res = await $fetch<any>(endpoint, {
        method: "POST",
        body: { userUuid: uid, userId: uid },
      });

      targets.forEach((t) => {
        if (Array.isArray(res?.likesList)) {
          t.likesList = [...res.likesList];
        } else if (typeof res?.liked === "boolean") {
          const idxNow = t.likesList.findIndex((entry: unknown) =>
            identifiers.includes(String(entry).toLowerCase()),
          );
          if (res.liked && idxNow === -1) t.likesList.push(uid);
          if (!res.liked && idxNow !== -1) t.likesList.splice(idxNow, 1);
          t.isLiked = res.liked;
          t.liked = res.liked;
        }
        if (typeof res?.likesCount === "number") {
          t.likesCount = res.likesCount;
          t.likes = res.likesCount;
        }
      });

      options.onSuccess?.(res, item);
    } catch (e) {
      console.error(`Error toggling ${effectiveKind} like:`, e);
      snapshots.forEach((snap) => {
        snap.target.likesList = snap.likesList;
        snap.target.likesCount = snap.likesCount;
        snap.target.likes = snap.likes;
        snap.target.isLiked = snap.isLiked;
      });
      options.onError?.(e, item);
    }
  };

  const toggleBookmark = async (
    item: any,
    kind?: ContentKind,
    options: ToggleInteractionOptions = {},
  ) => {
    if (!item) return;

    const effectiveKind = kind ?? inferContentKind(item);
    const uid = options.userId || currentUserId.value;
    if (!uid) {
      options.onUnauthenticated?.();
      return;
    }

    const itemId = resolveItemId(item, effectiveKind);
    if (!itemId) return;

    const identifiers = getUserIdentifiers(uid, options.userIdentifiers);
    const targets = Array.from(
      new Set([item, ...(options.extraTargets || [])].filter(Boolean)),
    );

    const snapshots = targets.map((t) => {
      if (!Array.isArray(t.bookmarksList)) t.bookmarksList = [];
      return {
        target: t,
        bookmarksList: [...t.bookmarksList],
        bookmarksCount: t.bookmarksCount,
        isBookmarked: t.isBookmarked,
      };
    });

    targets.forEach((t) => {
      const idx = t.bookmarksList.findIndex((entry: unknown) =>
        identifiers.includes(String(entry).toLowerCase()),
      );
      const wasBookmarked =
        idx !== -1 || Boolean(t.isBookmarked || t.bookmarked);
      const currentCount = getItemBookmarksCount(t);

      if (wasBookmarked) {
        if (idx !== -1) t.bookmarksList.splice(idx, 1);
        t.bookmarksCount = Math.max(0, currentCount - 1);
        t.isBookmarked = false;
        t.bookmarked = false;
      } else {
        if (idx === -1) t.bookmarksList.push(uid);
        t.bookmarksCount = currentCount + 1;
        t.isBookmarked = true;
        t.bookmarked = true;
      }
    });

    const endpoint =
      effectiveKind === "job"
        ? `/api/jobs/${itemId}/bookmark`
        : `/api/posts/${itemId}/bookmark`;

    try {
      const res = await $fetch<any>(endpoint, {
        method: "POST",
        body: { userUuid: uid, userId: uid },
      });

      targets.forEach((t) => {
        if (Array.isArray(res?.bookmarksList)) {
          t.bookmarksList = [...res.bookmarksList];
        } else if (typeof res?.bookmarked === "boolean") {
          const idxNow = t.bookmarksList.findIndex((entry: unknown) =>
            identifiers.includes(String(entry).toLowerCase()),
          );
          if (res.bookmarked && idxNow === -1) t.bookmarksList.push(uid);
          if (!res.bookmarked && idxNow !== -1)
            t.bookmarksList.splice(idxNow, 1);
          t.isBookmarked = res.bookmarked;
          t.bookmarked = res.bookmarked;
        }
        if (typeof res?.bookmarksCount === "number") {
          t.bookmarksCount = res.bookmarksCount;
        }
      });

      options.onSuccess?.(res, item);
    } catch (e) {
      console.error(`Error toggling ${effectiveKind} bookmark:`, e);
      snapshots.forEach((snap) => {
        snap.target.bookmarksList = snap.bookmarksList;
        snap.target.bookmarksCount = snap.bookmarksCount;
        snap.target.isBookmarked = snap.isBookmarked;
      });
      options.onError?.(e, item);
    }
  };

  return {
    session,
    status,
    currentUserId,
    getUserIdentifiers,
    isItemLiked,
    isItemBookmarked,
    getItemLikesCount,
    getItemBookmarksCount,
    getItemCommentsCount,
    toggleLike,
    toggleBookmark,
  };
}
