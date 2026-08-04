<template>
  <div
    class="bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200 flex flex-col font-sans"
  >
    <!-- Main Container -->
    <main
      class="flex-grow max-w-lg mx-auto w-full px-4 py-8 space-y-6"
      role="main"
    >
      <!-- Quick Vacancy Discovery Banner -->
      <div
        class="bg-gradient-to-r from-primary/10 via-surface-container-lowest to-secondary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between shadow-sm"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold"
          >
            <span class="material-symbols-outlined text-xl">work</span>
          </div>
          <div class="text-left">
            <h3 class="text-xs font-bold text-on-background">
              Bolsa de Vacantes
            </h3>
            <p class="text-[11px] text-on-surface-variant dark:text-slate-300">
              Explora las ofertas activas y postúlate
            </p>
          </div>
        </div>
        <NuxtLink
          to="/feed"
          class="px-3.5 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-sm active:scale-95 flex-shrink-0"
        >
          <span>Ver Vacantes</span>
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </NuxtLink>
      </div>

      <!-- Feed Container -->
      <div class="flex flex-col gap-6">
        <!-- Skeleton Loading Feed -->
        <template v-if="postsLoading">
          <div
            v-for="i in 3"
            :key="i"
            class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm animate-pulse p-4"
          >
            <!-- Header Skeleton -->
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-outline/20"></div>
              <div class="flex-grow flex flex-col gap-2">
                <div class="h-4 w-28 bg-outline/20 rounded"></div>
                <div class="h-3 w-36 bg-outline/20 rounded"></div>
              </div>
            </div>
            <!-- Body Text Skeleton -->
            <div class="h-3.5 w-full bg-outline/20 rounded mb-2"></div>
            <div class="h-3.5 w-5/6 bg-outline/20 rounded mb-4"></div>

            <!-- Media Placeholder Skeleton -->
            <div
              v-if="i === 1"
              class="aspect-video w-full bg-outline/10 rounded-xl mb-4"
            ></div>

            <!-- Footer Actions Skeleton -->
            <div
              class="flex items-center gap-4 border-t border-outline-variant/30 pt-3 mt-2"
            >
              <div class="h-4 w-12 bg-outline/20 rounded"></div>
              <div class="h-4 w-12 bg-outline/20 rounded"></div>
              <div class="h-4 w-8 bg-outline/20 rounded"></div>
            </div>
          </div>
        </template>

        <!-- Feed Card -->
        <template v-else-if="feedItems.length > 0">
          <PostCard
            v-for="item in feedItems"
            :key="item.uniqueId"
            :post="item"
            :current-user-id="currentUserId"
            :is-bookmarked="isBookmarked(item)"
            @like="toggleLike"
            @bookmark="toggleBookmark"
            @share="sharePost"
            @navigate="navigateToPost"
          />
        </template>

        <!-- Empty Feed State -->
        <template v-else>
          <div
            class="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl shadow-sm px-6"
          >
            <div
              class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
            >
              <span class="material-symbols-outlined text-[40px] text-primary"
                >forum</span
              >
            </div>
            <h2 class="text-xl font-bold text-on-background mb-2">
              No hay publicaciones en la comunidad
            </h2>
            <p
              class="text-on-surface-variant dark:text-slate-300 text-sm max-w-sm mb-6"
            >
              Aún no se han compartido publicaciones en el feed. ¡Sé el primero
              en compartir algo interesante con la comunidad!
            </p>
          </div>
        </template>
      </div>
    </main>

    <!-- Bottom Sheet Modal (Facebook / Mobile Style) -->
    <div
      v-if="selectedPost"
      class="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      @click="closeBottomSheet"
    >
      <!-- Bottom Sheet Panel -->
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 w-full max-w-lg rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh]"
        :class="isDragging ? '' : 'transition-transform duration-300'"
        :style="{
          transform:
            sheetOffset > 0
              ? `translateY(${sheetOffset}px)`
              : 'translateY(0px)',
        }"
        @click.stop
      >
        <!-- Drag Handle Indicator -->
        <div
          class="py-3 flex justify-center cursor-ns-resize touch-none select-none"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
          @mousedown="onMouseDown"
          @click="closeBottomSheet"
        >
          <div
            class="w-12 h-1.5 rounded-full bg-outline/20 hover:bg-outline/40 transition"
          ></div>
        </div>

        <!-- Header -->
        <div
          class="px-4 pb-3 border-b border-outline-variant/20 flex items-center justify-between cursor-ns-resize touch-none select-none"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
          @mousedown="onMouseDown"
        >
          <h3
            class="text-sm font-bold text-on-background flex items-center gap-1 pointer-events-none"
          >
            <span class="material-symbols-outlined text-primary text-lg"
              >forum</span
            >
            Publicación y Comentarios
          </h3>
          <button
            @click="closeBottomSheet"
            class="text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high p-1.5 rounded-full transition"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <!-- Content Area (Scrollable) -->
        <div class="overflow-y-auto flex-grow p-4 space-y-6">
          <!-- The Post Card -->
          <PostCard
            :post="selectedPost"
            :current-user-id="currentUserId"
            :is-bookmarked="isBookmarked(selectedPost)"
            :is-detail="true"
            @like="toggleLike"
            @bookmark="toggleBookmark"
            @share="sharePost"
          />

          <!-- Comments List -->
          <div
            class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-4 border border-outline-variant/30 space-y-4"
          >
            <h4
              class="text-xs font-bold text-on-background flex items-center gap-1 pb-2 border-b border-outline-variant/20"
            >
              Comentarios y Respuestas ({{ commentsCount(selectedPost) }})
            </h4>

            <!-- Input Form -->
            <form @submit.prevent="submitComment" class="flex flex-col gap-2">
              <textarea
                v-model="newCommentText"
                placeholder="Escribe un comentario público..."
                rows="2"
                class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl p-3 text-xs text-on-background outline-none transition placeholder-on-surface-variant/50 resize-none font-sans"
              ></textarea>
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="!newCommentText.trim() || isSubmittingComment"
                  class="bg-primary hover:bg-primary-container text-white disabled:bg-primary/40 font-bold text-[10px] px-4 py-2 rounded-lg transition flex items-center gap-1.5"
                >
                  <span v-if="isSubmittingComment" class="animate-spin text-xs"
                    >⌛</span
                  >
                  <span>{{
                    isSubmittingComment ? "Enviando..." : "Comentar"
                  }}</span>
                </button>
              </div>
            </form>

            <!-- Threaded tree list -->
            <div
              v-if="commentTree.length === 0"
              class="text-center py-6 text-on-surface-variant dark:text-slate-300/60 text-xs"
            >
              <span
                class="material-symbols-outlined text-[28px] text-outline mb-1"
                >comments_disabled</span
              >
              <p>No hay comentarios todavía.</p>
            </div>
            <div v-else class="space-y-4 pt-2">
              <div
                v-for="node in commentTree"
                :key="node.id"
                class="p-3 bg-surface-container-low/20 border border-outline-variant/30 rounded-xl space-y-2 relative group text-left transition-all duration-200"
                :class="{ 'opacity-60 bg-slate-50/50': node.isDeleted }"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <div
                      class="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shadow-sm"
                    >
                      {{ node.user ? node.user.charAt(0).toUpperCase() : "U" }}
                    </div>
                    <div>
                      <h5 class="text-[11px] font-bold text-on-background">
                        {{ node.user || "Usuario" }}
                      </h5>
                      <span
                        class="text-[9px] text-on-surface-variant dark:text-slate-300/75"
                        >{{ node.timeAgo || "Hace un momento" }}</span
                      >
                    </div>
                  </div>
                  <button
                    v-if="!node.isDeleted && canDeleteComment(node)"
                    @click="deleteComment(node.id)"
                    class="text-rose-600 hover:bg-rose-50 p-1 rounded-md transition opacity-0 group-hover:opacity-100"
                  >
                    <span class="material-symbols-outlined text-xs"
                      >delete</span
                    >
                  </button>
                </div>
                <p
                  class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
                  :class="{
                    'italic text-on-surface-variant dark:text-slate-300/60':
                      node.isDeleted,
                  }"
                >
                  {{ node.text }}
                </p>

                <!-- Actions -->
                <div v-if="!node.isDeleted" class="flex items-center gap-3">
                  <button
                    @click="toggleReplyForm(node.id)"
                    class="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
                  >
                    <span class="material-symbols-outlined text-xs">reply</span>
                    Responder
                  </button>
                </div>

                <!-- Reply Form -->
                <form
                  v-if="replyingToId === node.id"
                  @submit.prevent="submitReply(node.id)"
                  class="mt-2 flex gap-1.5 animate-fade-in"
                >
                  <input
                    v-model="replyText"
                    type="text"
                    placeholder="Respuesta..."
                    class="flex-grow bg-surface border border-outline-variant/60 focus:border-primary rounded-lg px-3 py-1.5 text-xs text-on-background outline-none transition"
                  />
                  <button
                    type="submit"
                    :disabled="!replyText.trim() || isSubmittingReply"
                    class="bg-secondary text-white disabled:bg-secondary/40 font-bold text-[10px] px-3 py-1.5 rounded-lg hover:bg-[#005236] transition flex items-center gap-1"
                  >
                    <span>{{
                      isSubmittingReply ? "Enviando..." : "Responder"
                    }}</span>
                  </button>
                </form>

                <!-- Nested (Replies Level 2) -->
                <div
                  v-if="node.children && node.children.length > 0"
                  class="ml-6 mt-3 border-l-2 border-outline-variant/20 pl-3 space-y-3"
                >
                  <div
                    v-for="reply in node.children"
                    :key="reply.id"
                    class="p-2.5 bg-surface-container-low/40 border border-outline-variant/10 rounded-xl space-y-1 relative group transition-all duration-200"
                    :class="{ 'opacity-60 bg-slate-50/50': reply.isDeleted }"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-1.5">
                        <div
                          class="w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-[9px]"
                        >
                          {{
                            reply.user
                              ? reply.user.charAt(0).toUpperCase()
                              : "U"
                          }}
                        </div>
                        <div>
                          <h6 class="text-[10px] font-bold text-on-background">
                            {{ reply.user || "Usuario" }}
                          </h6>
                          <span
                            class="text-[8px] text-on-surface-variant dark:text-slate-300/75"
                            >{{ reply.timeAgo || "Hace un momento" }}</span
                          >
                        </div>
                      </div>
                      <button
                        v-if="!reply.isDeleted && canDeleteComment(reply)"
                        @click="deleteComment(reply.id)"
                        class="text-rose-600 hover:bg-rose-50 p-0.5 rounded transition opacity-0 group-hover:opacity-100"
                      >
                        <span class="material-symbols-outlined text-[10px]"
                          >delete</span
                        >
                      </button>
                    </div>
                    <p
                      class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
                      :class="{
                        'italic text-on-surface-variant dark:text-slate-300/60':
                          reply.isDeleted,
                      }"
                    >
                      {{ reply.text }}
                    </p>
                  </div>
                </div>
              </div>
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
            Para dar me gusta, guardar en marcadores o interactuar con
            publicaciones, necesitas contar con una cuenta profesional en
            JobNet.
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
import { useUploadStore } from "~/stores/upload";
import PostCard from "~/components/PostCard.vue";

useSeoMeta({
  title: "JobNet - Feed de Comunidad",
  description:
    "El feed profesional inteligente para compartir publicaciones con desarrolladores y empresas.",
});

const router = useRouter();
const { data: session, status } = useAuth();

// Loading indicator
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
const feedItems = ref<any[]>([]);
const postsList = ref<any[]>([]);

const currentUserId = computed(() => {
  return (
    (session.value?.user as any)?.id ||
    session.value?.user?.email ||
    "anonymous-user"
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

// Load Posts from AWS API Gateway
const loadPosts = async () => {
  try {
    const data = await $fetch<any[]>("/api/posts");
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
};

// Publish Post with AWS Presigned S3 uploads and API POST
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

  // 1. Upload image if selected to S3 via presigned PUT url
  if (selectedImageFile.value) {
    const res = await uploadStore.uploadFile(selectedImageFile.value, "posts");
    if (res.success) {
      mediaUrl = res.url;
    } else {
      showError("Error", "Error al subir la imagen a S3: " + res.error);
      isPublishing.value = false;
      return;
    }
  }

  // 2. Upload PDF if selected to S3 via presigned PUT url
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
  if (userRole === "EMPRESA") {
    role = "Empresa";
  } else if (userRole === "ADMIN") {
    role = "Admin";
  } else if (userRole === "MODERATOR") {
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
    // Reset fields
    newPostContent.value = "";
    clearAttachment();
    isPublishing.value = false;
  }
};

// Toggle likes on AWS backend (with Optimistic UI updates)
const toggleLike = async (item: any) => {
  if (status.value !== "authenticated") {
    showAuthModal.value = true;
    return;
  }

  if (!item.likesList) {
    item.likesList = [];
  }

  // Backup current state for potential rollback
  const originalLikesList = [...item.likesList];
  const originalLikesCount = item.likes || 0;

  // Optimistic update
  const idx = item.likesList.indexOf(currentUserId.value);
  const wasLiked = idx !== -1;
  if (wasLiked) {
    item.likesList.splice(idx, 1);
  } else {
    item.likesList.push(currentUserId.value);
  }
  item.likes = item.likesList.length;

  try {
    const res = await $fetch<any>(`/api/posts/${item.uniqueId}/like`, {
      method: "POST",
      body: { userUuid: currentUserId.value },
    });

    // Reconcile list in case it changed on server
    const idxNow = item.likesList.indexOf(currentUserId.value);
    if (res.liked) {
      if (idxNow === -1) {
        item.likesList.push(currentUserId.value);
      }
    } else {
      if (idxNow !== -1) {
        item.likesList.splice(idxNow, 1);
      }
    }
    item.likes = item.likesList.length;
  } catch (e) {
    console.error("Error toggling like (rolling back):", e);
    // Rollback to original state on failure
    item.likesList = originalLikesList;
    item.likes = originalLikesCount;
  }
};

// Toggle bookmarks (with Optimistic UI updates)
const toggleBookmark = async (item: any) => {
  if (status.value !== "authenticated") {
    showAuthModal.value = true;
    return;
  }
  if (!item.bookmarksList) {
    item.bookmarksList = [];
  }

  // Backup current state for potential rollback
  const originalBookmarksList = [...item.bookmarksList];

  // Optimistic update
  const idx = item.bookmarksList.indexOf(currentUserId.value);
  const wasBookmarked = idx !== -1;
  if (wasBookmarked) {
    item.bookmarksList.splice(idx, 1);
  } else {
    item.bookmarksList.push(currentUserId.value);
  }

  try {
    const res = await $fetch<any>(`/api/posts/${item.uniqueId}/bookmark`, {
      method: "POST",
      body: { userUuid: currentUserId.value },
    });

    // Reconcile list in case it changed on server
    const idxNow = item.bookmarksList.indexOf(currentUserId.value);
    if (res.bookmarked) {
      if (idxNow === -1) {
        item.bookmarksList.push(currentUserId.value);
      }
    } else {
      if (idxNow !== -1) {
        item.bookmarksList.splice(idxNow, 1);
      }
    }
  } catch (e) {
    console.error("Error toggling bookmark (rolling back):", e);
    // Rollback to original state on failure
    item.bookmarksList = originalBookmarksList;
  }
};

// Bottom Sheet state
const selectedPost = ref<any>(null);
const newCommentText = ref("");
const replyingToId = ref<string | null>(null);
const replyText = ref("");

// Bottom Sheet touch and mouse dragging state
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
  // Only allow dragging downwards (positive offset)
  if (diff > 0) {
    sheetOffset.value = diff;
  }
};

const onDragEnd = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  // If dragged down more than 150px, close the bottom sheet
  if (sheetOffset.value > 150) {
    closeBottomSheet();
  }
  sheetOffset.value = 0;
};

const onTouchStart = (event: TouchEvent) => {
  onDragStart(event.touches[0].clientY);
};

const onTouchMove = (event: TouchEvent) => {
  onDragMove(event.touches[0].clientY);
};

const onTouchEnd = () => {
  onDragEnd();
};

const onMouseDown = (event: MouseEvent) => {
  event.preventDefault();
  onDragStart(event.clientY);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

const onMouseMove = (event: MouseEvent) => {
  onDragMove(event.clientY);
};

const onMouseUp = () => {
  onDragEnd();
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
};

const commentsCount = (postItem: any) => {
  return postItem?.comments?.length || 0;
};

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

// Share post
const sharePost = (item: any) => {
  showSuccess(
    "Éxito",
    `Enlace copiado al portapapeles: http://localhost:3000/feed/${item.uniqueId}`,
  );
};

// Tree assembly for selected post comments
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

// Submit a main comment
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
    const created = await $fetch<any>(
      `/api/posts/${selectedPost.value.uniqueId}/comment`,
      {
        method: "POST",
        body: {
          author: username,
          content: newCommentText.value.trim(),
          parentId: null,
        },
      },
    );

    const updatedComments = [...(selectedPost.value.comments || []), created];
    selectedPost.value = {
      ...selectedPost.value,
      comments: updatedComments,
    };
    newCommentText.value = "";

    // Sync with postsList to update feed card comment counter
    const postInList = postsList.value.find(
      (p: any) => p.uniqueId === selectedPost.value.uniqueId,
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
  if (!replyText.value.trim() || !selectedPost.value || isSubmittingReply.value)
    return;
  const username = session.value?.user?.name || "Usuario Anónimo";

  isSubmittingReply.value = true;
  try {
    const created = await $fetch<any>(
      `/api/posts/${selectedPost.value.uniqueId}/comment`,
      {
        method: "POST",
        body: {
          author: username,
          content: replyText.value.trim(),
          parentId: parentId,
        },
      },
    );

    const updatedComments = [...(selectedPost.value.comments || []), created];
    selectedPost.value = {
      ...selectedPost.value,
      comments: updatedComments,
    };
    replyText.value = "";
    replyingToId.value = null;

    // Sync with postsList to update feed card comment counter
    const postInList = postsList.value.find(
      (p: any) => p.uniqueId === selectedPost.value.uniqueId,
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

// Deletion authority check
const canDeleteComment = (node: any) => {
  if (status.value !== "authenticated") return false;
  if (node.user === session.value?.user?.name) return true;
  const role = (session.value?.user as any)?.tipoUsuario?.toUpperCase();
  return role === "ADMIN" || role === "MODERATOR";
};

// Delete comment (prunes entirely if alone/reply, or placeholder if it has children)
const deleteComment = async (id: string) => {
  if (!selectedPost.value?.comments) return;

  try {
    const res = await $fetch<any>(
      `/api/posts/${selectedPost.value.uniqueId}/comment/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );

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

    // Assign new object reference to trigger Vue 3 reactivity immediately
    selectedPost.value = {
      ...selectedPost.value,
      comments: nextComments,
    };

    // Sync with postsList to preserve local modifications in feed mapping
    const postInList = postsList.value.find(
      (p: any) => p.uniqueId === selectedPost.value.uniqueId,
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
</script>

<style scoped>
.font-fill-1 {
  font-variation-settings: "FILL" 1;
}
</style>
