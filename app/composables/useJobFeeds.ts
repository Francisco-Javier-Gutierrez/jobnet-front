import { useUploadStore } from "~/stores/upload";
import { useAppFeedback } from "~/composables/useAppFeedback";
import { useAuth } from "#imports";
import { useShare } from "#imports";

import type { Post, Job } from "~/types";

export function useJobFeeds() {
  const { showError, showSuccess, showInfo } = useAppFeedback();
  const { data: session, status } = useAuth();
  const { sharePost, shareJob } = useShare();

  const postsLoading = ref(true);
  const isPublishing = ref(false);
  const isSubmittingComment = ref(false);
  const isSubmittingReply = ref(false);
  const showAuthModal = ref(false);

  // State for post creation files
  const selectedImageFile = ref<File | null>(null);
  const selectedPdfFile = ref<File | null>(null);
  const newPostContent = ref("");
  const previewImage = ref<string | null>(null);
  const previewPdf = ref<string | null>(null);
  const previewPdfName = ref("");
  const imageInput = ref<HTMLInputElement | null>(null);
  const pdfInput = ref<HTMLInputElement | null>(null);

  // Unified reactive feed items
  const feedItems = ref<(Post | Job)[]>([]);
  const postsList = ref<Post[]>([]);

  const currentUserId = computed(() => {
    return (
      session.value?.user?.id || session.value?.user?.email || "anonymous-user"
    );
  });

  const isLiked = (item: any) => {
    if (!item.likesList) return false;
    return item.likesList.includes(currentUserId.value);
  };

  const isBookmarked = (item: any) => {
    if (!item.bookmarksList) return false;
    return item.bookmarksList.includes(currentUserId.value);
  };

  const likesCount = (item: any) => {
    return item.likesList ? item.likesList.length : item.likes || 0;
  };

  // Select image
  const triggerImageSelect = () => {
    imageInput.value?.click();
  };
  const handleImageSelect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      selectedImageFile.value = file;
      previewImage.value = URL.createObjectURL(file); // Instant browser local URL!

      // Clear PDF
      selectedPdfFile.value = null;
      previewPdf.value = null;
      previewPdfName.value = "";
    }
  };

  // Select PDF
  const triggerPdfSelect = () => {
    pdfInput.value?.click();
  };
  const handlePdfSelect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      if (file.type !== "application/pdf") {
        showInfo("Notificación", "Por favor selecciona un archivo PDF.");
        return;
      }
      selectedPdfFile.value = file;
      previewPdf.value = "pdf-selected";
      previewPdfName.value = file.name;

      // Clear Image
      selectedImageFile.value = null;
      previewImage.value = null;
    }
  };

  // Clear attachment
  const clearAttachment = () => {
    selectedImageFile.value = null;
    selectedPdfFile.value = null;
    previewImage.value = null;
    previewPdf.value = null;
    previewPdfName.value = "";
    if (imageInput.value) imageInput.value.value = "";
    if (pdfInput.value) pdfInput.value.value = "";
  };

  // Load Posts from API
  const loadPosts = async () => {
    try {
      const config = useRuntimeConfig();
      const baseUrl = config.public.apiUrl || "";
      const targetUrl = baseUrl ? `${baseUrl}/posts` : "/api/posts";
      const data = await $fetch<any[]>(targetUrl);
      postsList.value = data;
    } catch (error) {
      console.error("Error loading posts:", error);
      postsList.value = [];
    }
  };

  const savePostsToLocalStorage = () => {
    if (process.client) {
      localStorage.setItem(
        "jobnet-community-posts",
        JSON.stringify(postsList.value),
      );
    }
  };

  const buildFeed = () => {
    feedItems.value = postsList.value.map((post) => ({
      ...post,
      newCommentText: "",
      showPreview: false,
    }));
    if (selectedPost.value) {
      const updatedPost = feedItems.value.find(
        (p: any) => p.uniqueId === selectedPost.value.uniqueId,
      );
      if (updatedPost) {
        selectedPost.value = updatedPost;
      }
    }

    feedItems.value.sort((a, b) => {
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    });
  };

  // Publish Post with S3 uploads and API POST
  const publishPost = async () => {
    if (
      !newPostContent.value.trim() &&
      !selectedImageFile.value &&
      !selectedPdfFile.value
    )
      return;
    isPublishing.value = true;

    let mediaUrl = "";
    let pdfUrl = "";

    const uploadStore = useUploadStore();

    if (selectedImageFile.value) {
      const res = await uploadStore.uploadFile(
        selectedImageFile.value,
        "posts",
      );
      if (res.success) {
        mediaUrl = res.url;
      } else {
        showError("Error", "Error al subir la imagen a S3: " + res.error);
        isPublishing.value = false;
        return;
      }
    }

    if (selectedPdfFile.value) {
      const res = await uploadStore.uploadFile(selectedPdfFile.value, "posts");
      if (res.success) {
        pdfUrl = res.url;
      } else {
        showError("Error", "Error al subir el archivo PDF a S3: " + res.error);
        isPublishing.value = false;
        return;
      }
    }

    const author = session.value?.user?.name || "Usuario JobNet";
    let role = "Candidato";
    const userRole = (session.value?.user as any)?.tipoUsuario;
    if (userRole === "ORGANIZACION") {
      role = "Organización";
    } else if (userRole === "ADMIN") {
      role = "Admin";
    } else if (userRole === "MODERATOR" || userRole === "MODERADOR") {
      role = "Moderador";
    }

    const newPostPayload = {
      author,
      role,
      authorUuid: currentUserId.value,
      content: newPostContent.value.trim(),
      media: mediaUrl || undefined,
      pdfUrl: pdfUrl || undefined,
      pdfName: previewPdfName.value || undefined,
    };

    try {
      const createdPost = await $fetch<any>("/api/posts", {
        method: "POST",
        body: newPostPayload,
      });
      postsList.value.unshift(createdPost);
      buildFeed();
    } catch (e) {
      console.error("Error publishing post:", e);
      showError("Error", "Error al publicar la publicación en el servidor.");
    } finally {
      newPostContent.value = "";
      clearAttachment();
      isPublishing.value = false;
    }
  };

  const toggleLike = async (item: any) => {
    if (status.value !== "authenticated") {
      showAuthModal.value = true;
      return;
    }

    if (!item.likesList) {
      item.likesList = [];
    }

    const originalLikesList = [...item.likesList];
    const originalLikesCount =
      item.likesCount ?? item.likes ?? item.likesList.length;
    const originalIsLiked = item.isLiked;

    const idx = item.likesList.indexOf(currentUserId.value);
    const wasLiked = idx !== -1;
    if (wasLiked) {
      item.likesList.splice(idx, 1);
      if (typeof item.likesCount === "number") {
        item.likesCount = Math.max(0, item.likesCount - 1);
      } else {
        item.likesCount = item.likesList.length;
      }
      item.isLiked = false;
    } else {
      item.likesList.push(currentUserId.value);
      if (typeof item.likesCount === "number") {
        item.likesCount = item.likesCount + 1;
      } else {
        item.likesCount = item.likesList.length;
      }
      item.isLiked = true;
    }
    item.likes = item.likesList.length;

    try {
      const isJob =
        item.isVacancy || item.tipo === "VACANTE" || item.type === "VACANCY";
      const endpoint = isJob
        ? `/api/jobs/${item.id || item.uniqueId}/like`
        : `/api/posts/${item.uniqueId || item.id}/like`;

      const res = await $fetch<any>(endpoint, {
        method: "POST",
        body: { userUuid: currentUserId.value },
      });

      const idxNow = item.likesList.indexOf(currentUserId.value);
      if (res?.liked) {
        if (idxNow === -1) {
          item.likesList.push(currentUserId.value);
        }
        item.isLiked = true;
      } else if (res?.liked === false) {
        if (idxNow !== -1) {
          item.likesList.splice(idxNow, 1);
        }
        item.isLiked = false;
      }
      item.likes = item.likesList.length;
      if (typeof res?.likesCount === "number") {
        item.likesCount = res.likesCount;
      }
    } catch (e) {
      console.error("Error toggling like:", e);
      item.likesList = originalLikesList;
      item.likes = originalLikesCount;
      item.likesCount = originalLikesCount;
      item.isLiked = originalIsLiked;
    }
  };

  const toggleBookmark = async (item: any) => {
    if (status.value !== "authenticated") {
      showAuthModal.value = true;
      return;
    }
    if (!item.bookmarksList) {
      item.bookmarksList = [];
    }

    const originalBookmarksList = [...item.bookmarksList];
    const originalBookmarksCount =
      item.bookmarksCount ?? item.bookmarksList.length;
    const originalIsBookmarked = item.isBookmarked;

    const idx = item.bookmarksList.indexOf(currentUserId.value);
    const wasBookmarked = idx !== -1;
    if (wasBookmarked) {
      item.bookmarksList.splice(idx, 1);
      if (typeof item.bookmarksCount === "number") {
        item.bookmarksCount = Math.max(0, item.bookmarksCount - 1);
      } else {
        item.bookmarksCount = item.bookmarksList.length;
      }
      item.isBookmarked = false;
    } else {
      item.bookmarksList.push(currentUserId.value);
      if (typeof item.bookmarksCount === "number") {
        item.bookmarksCount = item.bookmarksCount + 1;
      } else {
        item.bookmarksCount = item.bookmarksList.length;
      }
      item.isBookmarked = true;
    }

    try {
      const isJob =
        item.isVacancy || item.tipo === "VACANTE" || item.type === "VACANCY";
      const endpoint = isJob
        ? `/api/jobs/${item.id || item.uniqueId}/bookmark`
        : `/api/posts/${item.uniqueId || item.id}/bookmark`;

      const res = await $fetch<any>(endpoint, {
        method: "POST",
        body: { userUuid: currentUserId.value },
      });

      const idxNow = item.bookmarksList.indexOf(currentUserId.value);
      if (res?.bookmarked) {
        if (idxNow === -1) {
          item.bookmarksList.push(currentUserId.value);
        }
        item.isBookmarked = true;
      } else if (res?.bookmarked === false) {
        if (idxNow !== -1) {
          item.bookmarksList.splice(idxNow, 1);
        }
        item.isBookmarked = false;
      }
      if (typeof res?.bookmarksCount === "number") {
        item.bookmarksCount = res.bookmarksCount;
      }
    } catch (e) {
      console.error("Error toggling bookmark:", e);
      item.bookmarksList = originalBookmarksList;
      item.bookmarksCount = originalBookmarksCount;
      item.isBookmarked = originalIsBookmarked;
    }
  };

  // Bottom Sheet state
  const selectedPost = ref<any>(null);
  const newCommentText = ref("");
  const replyingToId = ref<string | null>(null);
  const replyText = ref("");

  const startY = ref(0);
  const isDragging = ref(false);
  const sheetOffset = ref(0);

  const onDragStart = (clientY: number) => {
    startY.value = clientY;
    isDragging.value = true;
  };

  const onDragMove = (clientY: number) => {
    if (!isDragging.value) return;
    const diff = clientY - startY.value;
    if (diff > 0) {
      sheetOffset.value = diff;
    }
  };

  const onDragEnd = () => {
    if (!isDragging.value) return;
    isDragging.value = false;
    if (sheetOffset.value > 150) {
      closeBottomSheet();
    }
    sheetOffset.value = 0;
  };

  const onTouchStart = (event: TouchEvent) =>
    onDragStart(event.touches[0].clientY);
  const onTouchMove = (event: TouchEvent) =>
    onDragMove(event.touches[0].clientY);
  const onTouchEnd = () => onDragEnd();

  const onMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    onDragStart(event.clientY);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (event: MouseEvent) => onDragMove(event.clientY);
  const onMouseUp = () => {
    onDragEnd();
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const commentsCount = (postItem: any) => postItem?.comments?.length || 0;

  const closeBottomSheet = () => {
    selectedPost.value = null;
    newCommentText.value = "";
    replyingToId.value = null;
    replyText.value = "";
    sheetOffset.value = 0;
    if (process.client) {
      document.body.style.overflow = "";
    }
  };

  watch(selectedPost, (newVal) => {
    if (process.client) {
      if (newVal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  });

  onBeforeUnmount(() => {
    if (process.client) {
      document.body.style.overflow = "";
    }
  });

  const navigateToPost = (postId: string) => {
    selectedPost.value =
      feedItems.value.find((p: any) => p.uniqueId === postId) || null;
  };

  const handleSharePost = async (post: any) => {
    await sharePost(post);
  };

  const handleShareJob = async (job: any) => {
    await shareJob(job);
  };

  interface CommentItem {
    id: string;
    parentId?: string | null;
    user: string;
    text: string;
    timeAgo?: string;
  }

  type CommentNode = CommentItem & { children: CommentNode[] };

  const commentTree = computed<CommentNode[]>(() => {
    if (!selectedPost.value?.comments) return [];

    const nodes = new Map<string, CommentNode>();
    const roots: CommentNode[] = [];

    selectedPost.value.comments.forEach((c: any) => {
      nodes.set(String(c.id), {
        ...c,
        parentId: c.parentId || null,
        children: [],
      });
    });

    nodes.forEach((node) => {
      const parentId = node.parentId;
      const parent = parentId ? nodes.get(String(parentId)) : undefined;

      if (parent && parent.id !== node.id) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    });

    roots.sort((a, b) => b.id.localeCompare(a.id));

    const sortChildren = (nodesList: CommentNode[]) => {
      nodesList.sort((a, b) => a.id.localeCompare(b.id));
      nodesList.forEach((child) => sortChildren(child.children));
    };
    roots.forEach((root) => sortChildren(root.children));

    return roots;
  });

  const submitComment = async () => {
    if (status.value !== "authenticated") {
      showAuthModal.value = true;
      return;
    }
    if (
      !newCommentText.value.trim() ||
      !selectedPost.value ||
      isSubmittingComment.value
    )
      return;
    const username = session.value?.user?.name || "Usuario Anónimo";

    isSubmittingComment.value = true;
    try {
      const isJob =
        selectedPost.value.isVacancy ||
        selectedPost.value.tipo === "VACANTE" ||
        selectedPost.value.type === "VACANCY";
      const endpoint = isJob
        ? `/api/jobs/${selectedPost.value.id || selectedPost.value.uniqueId}/comment`
        : `/api/posts/${selectedPost.value.uniqueId || selectedPost.value.id}/comment`;

      const created = await $fetch<any>(endpoint, {
        method: "POST",
        body: {
          author: username,
          content: newCommentText.value.trim(),
          parentId: null,
        },
      });

      const updatedComments = [...(selectedPost.value.comments || []), created];
      selectedPost.value = {
        ...selectedPost.value,
        comments: updatedComments,
      };
      newCommentText.value = "";

      const selectedId = selectedPost.value.uniqueId || selectedPost.value.id;
      const postInList = postsList.value.find(
        (p: any) => (p.uniqueId || p.id) === selectedId,
      );
      if (postInList) {
        postInList.comments = updatedComments;
      }
      buildFeed();
    } catch (e) {
      console.error("Error submitting comment:", e);
      showError("Error", "Error al guardar el comentario.");
    } finally {
      isSubmittingComment.value = false;
    }
  };

  const toggleReplyForm = (id: string) => {
    if (status.value !== "authenticated") {
      showAuthModal.value = true;
      return;
    }
    if (replyingToId.value === id) {
      replyingToId.value = null;
    } else {
      replyingToId.value = id;
      replyText.value = "";
    }
  };

  const submitReply = async (parentId: string) => {
    if (status.value !== "authenticated") {
      showAuthModal.value = true;
      return;
    }
    if (
      !replyText.value.trim() ||
      !selectedPost.value ||
      isSubmittingReply.value
    )
      return;
    const username = session.value?.user?.name || "Usuario Anónimo";

    isSubmittingReply.value = true;
    try {
      const isJob =
        selectedPost.value.isVacancy ||
        selectedPost.value.tipo === "VACANTE" ||
        selectedPost.value.type === "VACANCY";
      const endpoint = isJob
        ? `/api/jobs/${selectedPost.value.id || selectedPost.value.uniqueId}/comment`
        : `/api/posts/${selectedPost.value.uniqueId || selectedPost.value.id}/comment`;

      const created = await $fetch<any>(endpoint, {
        method: "POST",
        body: {
          author: username,
          content: replyText.value.trim(),
          parentId: parentId,
        },
      });

      const updatedComments = [...(selectedPost.value.comments || []), created];
      selectedPost.value = {
        ...selectedPost.value,
        comments: updatedComments,
      };
      replyText.value = "";
      replyingToId.value = null;

      const selectedId = selectedPost.value.uniqueId || selectedPost.value.id;
      const postInList = postsList.value.find(
        (p: any) => (p.uniqueId || p.id) === selectedId,
      );
      if (postInList) {
        postInList.comments = updatedComments;
      }
      buildFeed();
    } catch (e) {
      console.error("Error submitting reply:", e);
      showError("Error", "Error al guardar la respuesta.");
    } finally {
      isSubmittingReply.value = false;
    }
  };

  const canDeleteComment = (node: any) => {
    if (status.value !== "authenticated") return false;
    if (node.user === session.value?.user?.name) return true;
    const role = (session.value?.user as any)?.tipoUsuario?.toUpperCase();
    return role === "ADMIN" || role === "MODERATOR" || role === "MODERADOR";
  };

  const deleteComment = async (id: string) => {
    if (!selectedPost.value?.comments) return;
    try {
      const isJob =
        selectedPost.value.isVacancy ||
        selectedPost.value.tipo === "VACANTE" ||
        selectedPost.value.type === "VACANCY";
      const endpoint = isJob
        ? `/api/jobs/${selectedPost.value.id || selectedPost.value.uniqueId}/comment/${encodeURIComponent(id)}`
        : `/api/posts/${selectedPost.value.uniqueId || selectedPost.value.id}/comment/${encodeURIComponent(id)}`;

      const res = await $fetch<any>(endpoint, { method: "DELETE" });

      const targetIndex = selectedPost.value.comments.findIndex(
        (c: any) => String(c.id) === String(id),
      );

      let nextComments = [...selectedPost.value.comments];

      if (targetIndex !== -1) {
        const target = nextComments[targetIndex];
        const isLevel2 = !!target.parentId;

        if (res?.action === "SOFT_DELETED_PARENT" || res?.isDeleted) {
          nextComments[targetIndex] = {
            ...target,
            text: "Comentario no disponible",
            user: "Eliminado",
            isDeleted: true,
          };
        } else if (isLevel2) {
          nextComments.splice(targetIndex, 1);
          const parentId = target.parentId;
          const parentIndex = nextComments.findIndex(
            (c: any) => String(c.id) === String(parentId),
          );
          if (parentIndex !== -1 && nextComments[parentIndex].isDeleted) {
            const parentHasOtherChildren = nextComments.some(
              (c: any) =>
                String(c.parentId) === String(parentId) && c.id !== target.id,
            );
            if (!parentHasOtherChildren) {
              nextComments.splice(parentIndex, 1);
            }
          }
        } else {
          const hasChildren = nextComments.some(
            (c: any) => String(c.parentId) === String(id),
          );
          if (hasChildren) {
            nextComments[targetIndex] = {
              ...target,
              text: "Comentario no disponible",
              user: "Eliminado",
              isDeleted: true,
            };
          } else {
            nextComments.splice(targetIndex, 1);
          }
        }
      } else {
        nextComments = nextComments.filter(
          (c: any) => String(c.id) !== String(id),
        );
      }

      selectedPost.value = {
        ...selectedPost.value,
        comments: nextComments,
      };

      const selectedId = selectedPost.value.uniqueId || selectedPost.value.id;
      const postInList = postsList.value.find(
        (p: any) => (p.uniqueId || p.id) === selectedId,
      );
      if (postInList) {
        postInList.comments = nextComments;
      }
      buildFeed();
    } catch (e) {
      console.error("Error deleting comment:", e);
      showError("Error", "Error al eliminar el comentario del servidor.");
    }
  };

  onMounted(async () => {
    postsLoading.value = true;
    await loadPosts();
    buildFeed();
    postsLoading.value = false;
  });

  return {
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
  };
}
