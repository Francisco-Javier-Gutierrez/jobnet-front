<template>
  <div
    class="max-w-2xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <!-- Breadcrumb / Back button -->
    <div class="mb-6">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-1 text-primary hover:text-primary-container text-xs font-bold transition animate-fade-in"
      >
        <span class="material-symbols-outlined text-sm">arrow_back</span>
        Volver al muro
      </NuxtLink>
    </div>

    <!-- Post Card Details -->
    <PostCard
      v-if="post"
      :post="post"
      :current-user-id="currentUserId"
      :is-bookmarked="isBookmarked"
      :is-liked="isLiked"
      :is-detail="true"
      @like="toggleLike"
      @bookmark="toggleBookmark"
      @share="sharePost"
    />

    <!-- COMMENTS SECTION -->
    <div
      v-if="post"
      class="mt-6 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 shadow-sm space-y-6 text-left"
    >
      <h2
        class="text-base font-bold text-on-background flex items-center gap-1.5 border-b border-outline-variant/30 pb-4"
      >
        <span class="material-symbols-outlined text-primary text-lg"
          >forum</span
        >
        Comentarios y Respuestas ({{ commentsCount }})
      </h2>

      <!-- Main Comment Input -->
      <form @submit.prevent="submitComment" class="flex flex-col gap-3">
        <textarea
          v-model="newCommentText"
          placeholder="Escribe un comentario público..."
          rows="3"
          class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl p-4 text-xs text-on-background outline-none transition placeholder-on-surface-variant/50 resize-none font-sans"
        ></textarea>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="!newCommentText.trim()"
            class="bg-primary hover:bg-primary-container text-white disabled:bg-primary/40 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            Comentar
          </button>
        </div>
      </form>

      <!-- Threaded Comments Tree -->
      <div
        v-if="commentTree.length === 0"
        class="text-center py-8 text-on-surface-variant dark:text-slate-300/60 text-xs"
      >
        <span class="material-symbols-outlined text-[32px] text-outline mb-2"
          >comments_disabled</span
        >
        <p>
          No hay comentarios todavía. Sé el primero en iniciar la conversación.
        </p>
      </div>

      <div v-else class="space-y-6">
        <!-- Render Comments Tree Recursively -->
        <div
          v-for="node in commentTree"
          :key="node.id"
          class="p-4 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/40 rounded-xl space-y-3 relative group"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shadow-inner"
              >
                {{ node.user.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h4 class="text-xs font-bold text-on-background">
                  {{ node.user }}
                </h4>
                <span
                  class="text-[10px] text-on-surface-variant dark:text-slate-300/80"
                  >{{ node.timeAgo || "Hace un momento" }}</span
                >
              </div>
            </div>
            <button
              v-if="canDeleteComment(node)"
              @click="deleteComment(node.id)"
              class="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition opacity-0 group-hover:opacity-100"
              title="Eliminar comentario"
            >
              <span class="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>

          <p
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
          >
            {{ node.text }}
          </p>

          <!-- Action bar (Reply trigger) -->
          <div class="flex items-center gap-3 pt-1">
            <button
              @click="toggleReplyForm(node.id)"
              class="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
            >
              <span class="material-symbols-outlined text-sm">reply</span>
              Responder
            </button>
          </div>

          <!-- Reply input form -->
          <form
            v-if="replyingToId === node.id"
            @submit.prevent="submitReply(node.id)"
            class="mt-3 flex gap-2 animate-fade-in"
          >
            <input
              v-model="replyText"
              type="text"
              placeholder="Escribe una respuesta..."
              class="flex-grow bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2 text-xs text-on-background outline-none transition"
            />
            <button
              type="submit"
              :disabled="!replyText.trim()"
              class="bg-secondary text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-[#005236] transition shadow-sm"
            >
              Responder
            </button>
          </form>

          <!-- Nested Replies (Level 2) -->
          <div
            v-if="node.children && node.children.length > 0"
            class="ml-6 md:ml-8 mt-4 border-l-2 border-outline-variant/30 pl-4 space-y-4"
          >
            <div
              v-for="reply in node.children"
              :key="reply.id"
              class="p-3 bg-surface-container-low/40 border border-outline-variant/20 rounded-xl space-y-2 relative group"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div
                    class="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-[10px] shadow-sm"
                  >
                    {{ reply.user.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h5 class="text-[11px] font-bold text-on-background">
                      {{ reply.user }}
                    </h5>
                    <span
                      class="text-[9px] text-on-surface-variant dark:text-slate-300/80"
                      >{{ reply.timeAgo || "Hace un momento" }}</span
                    >
                  </div>
                </div>
                <button
                  v-if="canDeleteComment(reply)"
                  @click="deleteComment(reply.id)"
                  class="text-rose-600 hover:bg-rose-50 p-1 rounded-md transition opacity-0 group-hover:opacity-100"
                  title="Eliminar respuesta"
                >
                  <span class="material-symbols-outlined text-xs">delete</span>
                </button>
              </div>
              <p
                class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
              >
                {{ reply.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Auth Intercept Modal -->
    <div
      v-if="showAuthModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300"
    >
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl text-center space-y-5 transform transition-all scale-100"
      >
        <div
          class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner"
        >
          <span class="material-symbols-outlined text-3xl">lock</span>
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-bold text-on-background">Acción Protegida</h3>
          <p
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
          >
            Para dar me gusta, guardar en marcadores o participar en la
            conversación respondiendo y comentando publicaciones, necesitas
            contar con una cuenta profesional en JobNet.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-3 pt-2">
          <button
            @click="showAuthModal = false"
            class="bg-slate-100 hover:bg-slate-200 text-on-surface-variant dark:text-slate-300 font-bold text-xs py-2.5 px-4 rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            @click="router.push('/login')"
            class="bg-primary hover:bg-primary-container text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-sm"
          >
            Iniciar Sesión
          </button>
        </div>
        <p class="text-[10px] text-on-surface-variant dark:text-slate-300/70">
          ¿Aún no tienes cuenta?
          <NuxtLink
            to="/register"
            class="text-primary font-bold hover:underline"
            >Registrarse</NuxtLink
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppFeedback } from "~/composables/useAppFeedback";
const { showError, showSuccess, showInfo } = useAppFeedback();
useSeoMeta({
  title: "Publicación - JobNet",
  description: "Detalle de publicación en la comunidad profesional.",
});

const route = useRoute();
const router = useRouter();
const { data: session, status } = useAuth();

const postId = route.params.id as string;
const post = ref<any>(null);
const showPdf = ref(false);
const showAuthModal = ref(false);

const newCommentText = ref("");
const replyingToId = ref<string | null>(null);
const replyText = ref("");
const isSubmittingComment = ref(false);
const isSubmittingReply = ref(false);

// Load post details from localStorage
const loadPost = async () => {
  try {
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiUrl || "";
    const targetUrl = baseUrl ? `${baseUrl}/posts` : "/api/posts";
    const list = await $fetch<any[]>(targetUrl);
    post.value = list.find((p: any) => p.uniqueId === postId) || null;
  } catch (error) {
    console.error("Error loading post:", error);
    post.value = null;
  }
};

const savePosts = (updatedList: any[]) => {
  if (process.client) {
    localStorage.setItem("jobnet-community-posts", JSON.stringify(updatedList));
  }
};

const currentUserId = computed(() => {
  return (
    (session.value?.user as any)?.id ||
    session.value?.user?.email ||
    "anonymous-user"
  );
});

const isLiked = computed(() => {
  if (!post.value?.likesList) return false;
  return post.value.likesList.includes(currentUserId.value);
});

const isBookmarked = computed(() => {
  if (!post.value?.bookmarksList) return false;
  return post.value.bookmarksList.includes(currentUserId.value);
});

const likesCount = computed(() => {
  return post.value?.likesList
    ? post.value.likesList.length
    : post.value?.likes || 0;
});

const toggleLike = async () => {
  if (status.value !== "authenticated") {
    showAuthModal.value = true;
    return;
  }
  if (!post.value) return;

  if (!post.value.likesList) {
    post.value.likesList = [];
  }

  const originalLikesList = [...post.value.likesList];
  const originalLikes = post.value.likes || 0;
  const originalLikesCount = post.value.likesCount;

  const idx = post.value.likesList.indexOf(currentUserId.value);
  if (idx !== -1) {
    post.value.likesList.splice(idx, 1);
    if (typeof post.value.likesCount === "number") {
      post.value.likesCount = Math.max(0, post.value.likesCount - 1);
    }
    post.value.isLiked = false;
  } else {
    post.value.likesList.push(currentUserId.value);
    if (typeof post.value.likesCount === "number") {
      post.value.likesCount = post.value.likesCount + 1;
    } else {
      post.value.likesCount = post.value.likesList.length;
    }
    post.value.isLiked = true;
  }
  post.value.likes = post.value.likesList.length;

  try {
    const res = await $fetch<any>(`/api/posts/${post.value.uniqueId}/like`, {
      method: "POST",
      body: { userUuid: currentUserId.value },
    });

    const idxNow = post.value.likesList.indexOf(currentUserId.value);
    if (res?.liked) {
      if (idxNow === -1) {
        post.value.likesList.push(currentUserId.value);
      }
      post.value.isLiked = true;
    } else if (res?.liked === false) {
      if (idxNow !== -1) {
        post.value.likesList.splice(idxNow, 1);
      }
      post.value.isLiked = false;
    }
    post.value.likes = post.value.likesList.length;
    if (typeof res?.likesCount === "number") {
      post.value.likesCount = res.likesCount;
    }
  } catch (e) {
    console.error("Error toggling like:", e);
    post.value.likesList = originalLikesList;
    post.value.likes = originalLikes;
    post.value.likesCount = originalLikesCount;
  }
};

const toggleBookmark = async () => {
  if (status.value !== "authenticated") {
    showAuthModal.value = true;
    return;
  }
  if (!post.value) return;
  if (!post.value.bookmarksList) {
    post.value.bookmarksList = [];
  }
  const originalBookmarksList = [...post.value.bookmarksList];
  const originalBookmarksCount = post.value.bookmarksCount;

  const idx = post.value.bookmarksList.indexOf(currentUserId.value);
  if (idx !== -1) {
    post.value.bookmarksList.splice(idx, 1);
    if (typeof post.value.bookmarksCount === "number") {
      post.value.bookmarksCount = Math.max(0, post.value.bookmarksCount - 1);
    }
    post.value.isBookmarked = false;
  } else {
    post.value.bookmarksList.push(currentUserId.value);
    if (typeof post.value.bookmarksCount === "number") {
      post.value.bookmarksCount = post.value.bookmarksCount + 1;
    } else {
      post.value.bookmarksCount = post.value.bookmarksList.length;
    }
    post.value.isBookmarked = true;
  }
  updateGlobalPost();

  try {
    const res = await $fetch<any>(
      `/api/posts/${post.value.uniqueId}/bookmark`,
      {
        method: "POST",
        body: { userUuid: currentUserId.value },
      },
    );
    if (typeof res?.bookmarksCount === "number") {
      post.value.bookmarksCount = res.bookmarksCount;
    }
  } catch (e) {
    console.error("Error toggling bookmark:", e);
    post.value.bookmarksList = originalBookmarksList;
    post.value.bookmarksCount = originalBookmarksCount;
  }
};

const updateGlobalPost = () => {
  if (process.client) {
    const saved = localStorage.getItem("jobnet-community-posts");
    if (saved) {
      const list = JSON.parse(saved);
      const idx = list.findIndex((p: any) => p.uniqueId === postId);
      if (idx !== -1) {
        list[idx] = post.value;
        savePosts(list);
      }
    }
  }
};

const { sharePost: sharePostUtil, shareUrl } = useShare();
const sharePost = async () => {
  if (post.value) {
    await sharePostUtil(post.value);
    updateGlobalPost();
  } else if (process.client) {
    shareUrl(window.location.href);
  }
};

// Comments counts
const commentsCount = computed(() => {
  return post.value?.comments?.length || 0;
});

// Tree assembly (Supports inline replies tree like Comuni-red)
interface CommentItem {
  id: string;
  parentId?: string | null;
  user: string;
  text: string;
  timeAgo?: string;
}

type CommentNode = CommentItem & { children: CommentNode[] };

const commentTree = computed<CommentNode[]>(() => {
  if (!post.value?.comments) return [];

  const nodes = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  post.value.comments.forEach((c: any) => {
    // Treat legacy comments without parentId as root comments
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

  // Sort roots: newest first
  roots.sort((a, b) => b.id.localeCompare(a.id));

  // Sort replies: oldest first
  const sortChildren = (nodesList: CommentNode[]) => {
    nodesList.sort((a, b) => a.id.localeCompare(b.id));
    nodesList.forEach((child) => sortChildren(child.children));
  };
  roots.forEach((root) => sortChildren(root.children));

  return roots;
});

// Submit a main comment
const submitComment = async () => {
  if (status.value !== "authenticated") {
    showAuthModal.value = true;
    return;
  }
  if (!newCommentText.value.trim() || !post.value || isSubmittingComment.value)
    return;
  const username = session.value?.user?.name || "Usuario Anónimo";

  isSubmittingComment.value = true;
  try {
    const created = await $fetch<any>(
      `/api/posts/${post.value.uniqueId}/comment`,
      {
        method: "POST",
        body: {
          author: username,
          content: newCommentText.value.trim(),
          parentId: null,
        },
      },
    );

    const updatedComments = [...(post.value.comments || []), created];
    post.value = {
      ...post.value,
      comments: updatedComments,
    };
    newCommentText.value = "";
  } catch (e) {
    console.error("Error submitting comment:", e);
    showError("Error", "Error al guardar el comentario.");
  } finally {
    isSubmittingComment.value = false;
  }
};

// Reply form toggles
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

// Submit inline reply
const submitReply = async (parentId: string) => {
  if (status.value !== "authenticated") {
    showAuthModal.value = true;
    return;
  }
  if (!replyText.value.trim() || !post.value || isSubmittingReply.value) return;
  const username = session.value?.user?.name || "Usuario Anónimo";

  isSubmittingReply.value = true;
  try {
    const created = await $fetch<any>(
      `/api/posts/${post.value.uniqueId}/comment`,
      {
        method: "POST",
        body: {
          author: username,
          content: replyText.value.trim(),
          parentId: parentId,
        },
      },
    );

    const updatedComments = [...(post.value.comments || []), created];
    post.value = {
      ...post.value,
      comments: updatedComments,
    };
    replyText.value = "";
    replyingToId.value = null;
  } catch (e) {
    console.error("Error submitting reply:", e);
    showError("Error", "Error al guardar la respuesta.");
  } finally {
    isSubmittingReply.value = false;
  }
};

// Deletion authority check
const canDeleteComment = (node: any) => {
  if (status.value !== "authenticated") return false;
  if (node.user === session.value?.user?.name) return true;
  const role = (session.value?.user as any)?.tipoUsuario?.toUpperCase();
  return role === "ADMIN" || role === "MODERATOR";
};

// Delete comment (prunes entirely if alone/reply, or placeholder if it has children)
const deleteComment = async (id: string) => {
  if (!post.value?.comments) return;

  try {
    const res = await $fetch<any>(
      `/api/posts/${post.value.uniqueId}/comment/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );

    const targetIndex = post.value.comments.findIndex(
      (c: any) => String(c.id) === String(id),
    );

    let nextComments = [...post.value.comments];

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

    // Re-assign object reference to trigger Vue 3 reactivity immediately
    post.value = {
      ...post.value,
      comments: nextComments,
    };
  } catch (e) {
    console.error("Error deleting comment:", e);
    showError("Error", "Error al eliminar el comentario del servidor.");
  }
};

onMounted(async () => {
  await loadPost();
});
</script>

<style scoped>
.font-fill-1 {
  font-variation-settings: "FILL" 1;
}
</style>
