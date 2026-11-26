<template>
  <div
    class="px-4 py-2 flex items-center gap-1 border-t border-outline-variant/30 select-none"
    :class="containerClass"
  >
    <!-- LIKE BUTTON -->
    <button
      type="button"
      @click="handleLikeClick"
      class="flex items-center gap-1.5 transition py-1.5 px-2.5 rounded-lg hover:bg-surface-container-low"
      :class="
        isLiked
          ? 'text-rose-600 font-bold'
          : 'text-on-surface-variant dark:text-slate-300 hover:text-rose-600'
      "
      :title="likeTitle"
    >
      <span
        class="material-symbols-outlined text-[20px]"
        :class="{ 'font-fill-1 text-rose-600': isLiked }"
      >
        {{ isLiked ? "favorite" : "favorite_border" }}
      </span>
      <span class="text-xs font-semibold">{{ likesCount }}</span>
    </button>

    <!-- COMMENT / DETAIL BUTTON -->
    <button
      type="button"
      @click="handleCommentClick"
      class="flex items-center gap-1.5 text-on-surface-variant dark:text-slate-300 hover:text-primary transition py-1.5 px-2.5 rounded-lg hover:bg-surface-container-low"
      :title="commentTitle"
    >
      <span class="material-symbols-outlined text-[20px]"
        >chat_bubble_outline</span
      >
      <span class="text-xs font-semibold">{{ commentsCount }}</span>
    </button>

    <!-- SHARE BUTTON -->
    <button
      type="button"
      @click.stop="handleShareClick"
      class="flex items-center gap-1.5 transition py-1.5 px-2.5 rounded-lg hover:bg-surface-container-low"
      :class="
        isSharedLocally
          ? 'text-secondary font-bold'
          : 'text-on-surface-variant dark:text-slate-300 hover:text-secondary'
      "
      :title="shareTitle"
    >
      <span
        class="material-symbols-outlined text-[20px]"
        :class="{ 'font-fill-1 text-secondary': isSharedLocally }"
        >share</span
      >
      <span class="text-xs font-semibold">{{ sharesCount }}</span>
    </button>

    <!-- BOOKMARK / SAVE BUTTON -->
    <button
      type="button"
      @click="handleBookmarkClick"
      class="ml-auto flex items-center gap-1.5 transition py-1.5 px-2.5 rounded-lg hover:bg-surface-container-low"
      :class="
        isBookmarked
          ? 'text-amber-500 font-bold'
          : 'text-on-surface-variant dark:text-slate-300 hover:text-amber-500'
      "
      :title="bookmarkTitle"
    >
      <span
        class="material-symbols-outlined text-[20px]"
        :class="{ 'font-fill-1 text-amber-500': isBookmarked }"
      >
        {{ isBookmarked ? "bookmark" : "bookmark_border" }}
      </span>
      <span class="text-xs font-semibold">{{ bookmarksCount }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    itemId?: string;
    storagePrefix?: "shared-posts" | "shared-jobs";
    currentUserId?: string;
    isLiked?: boolean;
    isBookmarked?: boolean;
    likesCount?: number;
    commentsCount?: number;
    sharesCount?: number;
    bookmarksCount?: number;
    requireAuthForComment?: boolean;
    containerClass?: string;
    likeTitle?: string;
    commentTitle?: string;
    shareTitle?: string;
    bookmarkTitle?: string;
  }>(),
  {
    itemId: "",
    storagePrefix: "shared-posts",
    currentUserId: "",
    isLiked: false,
    isBookmarked: false,
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    bookmarksCount: 0,
    requireAuthForComment: false,
    containerClass: "",
    likeTitle: undefined,
    commentTitle: undefined,
    shareTitle: undefined,
    bookmarkTitle: undefined,
  },
);

const emit = defineEmits<{
  (e: "like"): void;
  (e: "comment"): void;
  (e: "share"): void;
  (e: "bookmark"): void;
}>();

const { status, data: authSession } = useAuth();
const { openProtectedModal } = useProtectedAction();
const isSharedLocally = ref(false);

const effectiveUserId = computed(() => {
  return props.currentUserId || (authSession.value?.user as any)?.id || "anonymous";
});

onMounted(() => {
  if (process.client && props.itemId) {
    const key = `${props.storagePrefix}-${effectiveUserId.value}`;
    try {
      const shared = JSON.parse(localStorage.getItem(key) || "[]");
      isSharedLocally.value = Array.isArray(shared) && shared.includes(props.itemId);
    } catch {
      isSharedLocally.value = false;
    }
  }
});

const handleLikeClick = (e: Event) => {
  e.stopPropagation();
  if (status.value !== "authenticated") {
    openProtectedModal();
    return;
  }
  emit("like");
};

const handleCommentClick = (e: Event) => {
  e.stopPropagation();
  if (props.requireAuthForComment && status.value !== "authenticated") {
    openProtectedModal();
    return;
  }
  emit("comment");
};

const handleShareClick = (e: Event) => {
  e.stopPropagation();
  if (process.client && props.itemId) {
    const key = `${props.storagePrefix}-${effectiveUserId.value}`;
    try {
      const shared = JSON.parse(localStorage.getItem(key) || "[]");
      const list = Array.isArray(shared) ? shared : [];
      if (!list.includes(props.itemId)) {
        list.push(props.itemId);
        localStorage.setItem(key, JSON.stringify(list));
      }
      isSharedLocally.value = true;
    } catch {
      isSharedLocally.value = true;
    }
  }
  emit("share");
};

const handleBookmarkClick = (e: Event) => {
  e.stopPropagation();
  if (status.value !== "authenticated") {
    openProtectedModal();
    return;
  }
  emit("bookmark");
};
</script>
