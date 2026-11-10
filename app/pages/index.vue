<template>
  <div
    class="bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200 flex flex-col font-sans"
  >
    <!-- Main Container -->
    <main
      class="flex-grow max-w-lg mx-auto w-full px-4 py-8 space-y-6"
      role="main"
    >
      <HomeQuickVacancyBanner />

      <HomeFeedContainer
        :posts-loading="postsLoading"
        :feed-items="feedItems"
        :current-user-id="currentUserId"
        :is-bookmarked="isBookmarked"
        :is-liked="isLiked"
        @toggle-like="toggleLike"
        @toggle-bookmark="toggleBookmark"
        @share-job="handleShareJob"
        @share-post="handleSharePost"
        @navigate-to-post="navigateToPost"
      />
    </main>

    <HomeBottomSheet
      :selected-post="selectedPost"
      :current-user-id="currentUserId"
      :is-bookmarked="isBookmarked"
      :is-liked="isLiked"
      :comments-count="commentsCount"
      :comment-tree="commentTree"
      :can-delete-comment="canDeleteComment"
      :is-dragging="isDragging"
      :sheet-offset="sheetOffset"
      :new-comment-text="newCommentText"
      :is-submitting-comment="isSubmittingComment"
      :replying-to-id="replyingToId"
      :reply-text="replyText"
      :is-submitting-reply="isSubmittingReply"
      @close="closeBottomSheet"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @mousedown="onMouseDown"
      @toggle-like="toggleLike"
      @toggle-bookmark="toggleBookmark"
      @share-post="handleSharePost"
      @update:newCommentText="newCommentText = $event"
      @submit-comment="submitComment"
      @delete-comment="deleteComment"
      @toggle-reply-form="toggleReplyForm"
      @update:replyText="replyText = $event"
      @submit-reply="submitReply"
    />

    <HomeAuthModal
      :show-auth-modal="showAuthModal"
      @close="showAuthModal = false"
      @login="router.push('/login')"
    />
  </div>
</template>

<script setup lang="ts">
import { useJobFeeds } from "~/composables/useJobFeeds";
import { useRouter } from "vue-router";

useSeoMeta({
  title: "JobNet - Feed de Comunidad",
  description:
    "El feed profesional inteligente para compartir publicaciones con desarrolladores y organizaciones.",
});

const router = useRouter();

const {
  postsLoading,
  isPublishing,
  isSubmittingComment,
  isSubmittingReply,
  showAuthModal,
  selectedImageFile,
  selectedPdfFile,
  newPostContent,
  previewImage,
  previewPdf,
  previewPdfName,
  imageInput,
  pdfInput,
  feedItems,
  postsList,
  currentUserId,
  selectedPost,
  newCommentText,
  replyingToId,
  replyText,
  startY,
  isDragging,
  sheetOffset,
  commentTree,
  isLiked,
  isBookmarked,
  likesCount,
  triggerImageSelect,
  handleImageSelect,
  triggerPdfSelect,
  handlePdfSelect,
  clearAttachment,
  loadPosts,
  savePostsToLocalStorage,
  buildFeed,
  publishPost,
  toggleLike,
  toggleBookmark,
  onDragStart,
  onDragMove,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  commentsCount,
  closeBottomSheet,
  navigateToPost,
  handleSharePost,
  handleShareJob,
  submitComment,
  toggleReplyForm,
  submitReply,
  canDeleteComment,
  deleteComment,
} = useJobFeeds();
</script>
