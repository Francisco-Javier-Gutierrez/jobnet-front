<template>
  <div
    @click="handleClick"
    :class="[
      'select-none transition-colors duration-200',
      isDetail
        ? 'bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-4'
        : 'bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm cursor-pointer',
    ]"
  >
    <!-- HEADER: User/Company info -->
    <div class="flex items-center gap-3 p-4 prevent-post-nav">
      <!-- Avatar with click modal trigger -->
      <div
        @click.stop="showAvatarModal = true"
        class="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary-container flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0 cursor-pointer hover:opacity-85 transition active:scale-95 overflow-hidden"
        title="Ver foto de perfil"
      >
        <img
          v-if="post.authorAvatar || post.fotoPerfil"
          :src="post.authorAvatar || post.fotoPerfil"
          :alt="post.author || 'Avatar'"
          class="w-full h-full object-cover"
        />
        <span v-else>
          {{ post.author ? post.author.charAt(0).toUpperCase() : "U" }}
        </span>
      </div>

      <div class="flex-grow min-w-0">
        <div class="flex items-center gap-2">
          <!-- Author text with profile redirect click -->
          <h3
            @click.stop="navigateToAuthor"
            class="text-sm font-bold text-on-background dark:text-slate-100 truncate cursor-pointer hover:underline hover:text-primary dark:hover:text-indigo-400 transition select-text"
            title="Ver perfil del autor"
          >
            {{ post.author || "Usuario JobNet" }}
          </h3>
        </div>
        <p
          class="text-[11px] text-on-surface-variant dark:text-slate-300/80 dark:text-slate-400 truncate animate-fade-in select-none"
        >
          {{ displayRole }} ·
          <span class="select-text">{{ formatTime(post.createdAt) }}</span>
        </p>
      </div>

      <!-- 3-Dots Menu (...) for reporting post -->
      <div class="relative ml-auto flex-shrink-0">
        <button
          @click.stop="showMenu = !showMenu"
          class="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Opciones"
        >
          <span class="material-symbols-outlined text-[20px]">more_vert</span>
        </button>
        <div
          v-if="showMenu"
          @click.stop
          class="absolute right-0 top-8 z-30 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 text-xs animate-fade-in"
        >
          <button
            @click.stop="openReportModal"
            class="w-full text-left px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold flex items-center gap-2 transition"
          >
            <span class="material-symbols-outlined text-base">flag</span>
            Reportar publicación
          </button>
        </div>
      </div>
    </div>

    <!-- POST IMAGE/MEDIA CONTAINER -->
    <div
      v-if="post.media"
      class="aspect-video w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden border-y border-outline-variant/20 dark:border-slate-800 cursor-pointer"
      @click.stop="showMediaModal = true"
    >
      <img
        :src="post.media"
        alt="Imagen del post"
        class="w-full h-full object-cover hover:scale-105 transition duration-300"
      />
    </div>

    <!-- PDF DOCUMENT CONTAINER -->
    <div
      v-if="post.pdfUrl"
      class="border-y border-outline-variant/20 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 prevent-post-nav"
    >
      <div
        class="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div class="flex items-center gap-2 text-xs">
          <span class="material-symbols-outlined text-rose-600 text-[24px]"
            >picture_as_pdf</span
          >
          <div class="text-left">
            <p
              class="font-bold text-on-background dark:text-slate-100 max-w-[200px] sm:max-w-[240px] truncate select-text"
            >
              {{ post.pdfName || "Documento PDF" }}
            </p>
            <p
              class="text-[10px] text-on-surface-variant dark:text-slate-400 select-none"
            >
              Documento Adjunto
            </p>
          </div>
        </div>
        <div class="flex gap-2 justify-end sm:justify-start">
          <button
            @click.stop="showPdfModal = true"
            type="button"
            class="bg-primary/10 dark:bg-indigo-500/20 hover:bg-primary/20 text-primary dark:text-indigo-400 font-bold text-xs px-3.5 py-1.5 rounded-lg transition flex items-center gap-1 active:scale-95"
          >
            <span class="material-symbols-outlined text-xs">visibility</span>
            Vista Previa
          </button>
          <a
            :href="post.pdfUrl"
            target="_blank"
            class="bg-white dark:bg-slate-800 border border-outline-variant dark:border-slate-700 hover:border-primary text-primary dark:text-indigo-400 font-bold text-xs px-3.5 py-1.5 rounded-lg transition active:scale-95"
            @click.stop
          >
            Ver Documento
          </a>
        </div>
      </div>
    </div>

    <!-- POST CONTENT BODY (select-text allowed) -->
    <div class="p-4 flex flex-col gap-3">
      <p
        class="text-sm text-on-surface-variant dark:text-slate-300 dark:text-slate-200 leading-relaxed text-left select-text"
      >
        {{ post.content }}
      </p>
    </div>

    <!-- BOTTOM ACTIONS BAR -->
    <div
      class="px-4 py-2 flex items-center gap-1 border-t border-outline-variant/30 prevent-post-nav select-none"
    >
      <button
        @click="handleLikeClick"
        class="flex items-center gap-1.5 transition py-1.5 px-2.5 rounded-lg hover:bg-surface-container-low"
        :class="
          isLiked
            ? 'text-rose-600 font-bold'
            : 'text-on-surface-variant dark:text-slate-300 hover:text-rose-600'
        "
      >
        <span
          class="material-symbols-outlined text-[20px]"
          :class="{ 'font-fill-1 text-rose-600': isLiked }"
        >
          {{ isLiked ? "favorite" : "favorite_border" }}
        </span>
        <span class="text-xs font-semibold">{{ likesCount }}</span>
      </button>
      <button
        @click="handleCommentClick"
        class="flex items-center gap-1.5 text-on-surface-variant dark:text-slate-300 hover:text-primary transition py-1.5 px-2.5 rounded-lg hover:bg-surface-container-low"
      >
        <span class="material-symbols-outlined text-[20px]"
          >chat_bubble_outline</span
        >
        <span class="text-xs font-semibold">{{ commentsCount }}</span>
      </button>
      <button
        @click.stop="$emit('share', post)"
        class="flex items-center gap-1.5 text-on-surface-variant dark:text-slate-300 hover:text-secondary transition py-1.5 px-2.5 rounded-lg hover:bg-surface-container-low"
      >
        <span class="material-symbols-outlined text-[20px]">share</span>
      </button>
      <button
        @click="handleBookmarkClick"
        class="ml-auto transition py-1.5 px-2.5 rounded-lg hover:bg-surface-container-low"
        :class="
          effectiveIsBookmarked
            ? 'text-amber-500 font-bold'
            : 'text-on-surface-variant dark:text-slate-300 hover:text-amber-500'
        "
      >
        <span
          class="material-symbols-outlined text-[20px]"
          :class="{ 'font-fill-1 text-amber-500': effectiveIsBookmarked }"
        >
          {{ effectiveIsBookmarked ? "bookmark" : "bookmark_border" }}
        </span>
      </button>
    </div>

    <!-- MODAL 1: Author Profile Picture / Avatar Modal -->
    <Teleport to="body">
      <div
        v-if="showAvatarModal"
        class="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none"
        @click.stop="showAvatarModal = false"
      >
        <div
          class="relative bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-6 shadow-2xl w-[90vw] h-[90vh] max-w-5xl max-h-[90vh] flex flex-col items-center justify-center text-center space-y-6 overflow-hidden"
          @click.stop
        >
          <button
            @click.stop="showAvatarModal = false"
            type="button"
            class="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface-variant dark:text-slate-300 flex items-center justify-center transition shadow-md z-10"
            title="Cerrar vista"
          >
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
          <div
            class="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-primary to-secondary-container flex items-center justify-center text-white text-5xl sm:text-7xl font-bold shadow-2xl border-4 border-white/20 overflow-hidden"
          >
            <img
              v-if="post.authorAvatar || post.fotoPerfil"
              :src="post.authorAvatar || post.fotoPerfil"
              :alt="post.author || 'Avatar'"
              class="w-full h-full object-cover"
            />
            <span v-else>
              {{ post.author ? post.author.charAt(0).toUpperCase() : "U" }}
            </span>
          </div>

          <div>
            <h2
              class="text-xl sm:text-3xl font-bold text-on-background select-text"
            >
              {{ post.author || "Usuario JobNet" }}
            </h2>
            <p
              class="text-xs sm:text-base text-on-surface-variant dark:text-slate-300/80 mt-1 select-text"
            >
              {{ displayRole }}
            </p>
          </div>
          <button
            @click.stop="
              showAvatarModal = false;
              navigateToAuthor();
            "
            class="px-6 py-3 bg-primary hover:bg-primary-container text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-lg flex items-center gap-2 active:scale-95"
          >
            <span class="material-symbols-outlined text-base">person</span>
            Ver Perfil Completo
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Standardized Document Viewer -->
    <AppDocumentViewer
      v-model="showPdfModal"
      :url="post.pdfUrl"
      :title="post.pdfName || 'Documento PDF'"
    />

    <!-- MODAL 3: Media Image Preview Modal -->
    <Teleport to="body">
      <div
        v-if="showMediaModal"
        class="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none"
        @click.stop="showMediaModal = false"
      >
        <div
          class="relative bg-surface-container-lowest border border-outline-variant/60 rounded-3xl shadow-2xl w-[90vw] h-[90vh] max-w-5xl max-h-[90vh] flex flex-col overflow-hidden items-center justify-center"
          @click.stop
        >
          <button
            @click.stop="showMediaModal = false"
            type="button"
            class="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface-variant dark:text-slate-300 flex items-center justify-center transition shadow-md z-10"
            title="Cerrar vista previa"
          >
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
          <img
            :src="post.media"
            alt="Imagen ampliada"
            class="max-w-full max-h-full object-contain p-4"
          />
        </div>
      </div>
    </Teleport>

    <!-- Report Modal -->
    <ReportModal
      :is-open="showReportModal"
      target-type="POST"
      :target-id="post.uniqueId || post.id"
      :target-title="
        post.content
          ? post.content.substring(0, 40) + '...'
          : post.author || 'Publicación'
      "
      @close="showReportModal = false"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    post: any;
    currentUserId?: string;
    isBookmarked?: boolean;
    isDetail?: boolean;
  }>(),
  {
    isDetail: false,
    isBookmarked: undefined,
  },
);

const emit = defineEmits(["like", "bookmark", "share", "navigate"]);

const showAvatarModal = ref(false);
const showPdfModal = ref(false);
const showMediaModal = ref(false);
const showMenu = ref(false);
const showReportModal = ref(false);

const { status, data: authSession } = useAuth();
const { openProtectedModal } = useProtectedAction();

const displayRole = computed(() => {
  const rawRole = (props.post?.role || props.post?.tipoUsuario || "")
    .toString()
    .trim();
  const upperRole = rawRole.toUpperCase();

  if (
    upperRole === "EMPRESA" ||
    upperRole === "ORGANIZACION" ||
    props.post?.isCompany
  ) {
    return "Empresa";
  }

  return "Candidato";
});

const handleLikeClick = (e: Event) => {
  e.stopPropagation();
  if (status.value !== "authenticated") {
    openProtectedModal();
    return;
  }
  emit("like", props.post);
};

const handleBookmarkClick = (e: Event) => {
  e.stopPropagation();
  if (status.value !== "authenticated") {
    openProtectedModal();
    return;
  }
  emit("bookmark", props.post);
};

const handleCommentClick = (e: Event) => {
  e.stopPropagation();
  if (status.value !== "authenticated") {
    openProtectedModal();
    return;
  }
  emit("navigate", props.post.uniqueId);
};

const openReportModal = () => {
  showMenu.value = false;
  if (status.value !== "authenticated") {
    openProtectedModal();
    return;
  }
  showReportModal.value = true;
};

const isLiked = computed(() => {
  const post = props.post;
  if (!post) return false;

  const authUser = authSession.value?.user as any;
  const loggedEmail = authUser?.email?.toLowerCase();
  const loggedId = authUser?.id;
  const passedUserId = props.currentUserId?.toLowerCase();

  const likes =
    post.likesList || post.likedBy || post.likes_list || post.likes || [];
  if (Array.isArray(likes)) {
    return likes.some((item: any) => {
      const s = String(item).toLowerCase();
      return (
        (passedUserId && s === passedUserId) ||
        (loggedEmail && s === loggedEmail) ||
        (loggedId && s === String(loggedId).toLowerCase())
      );
    });
  }

  return Boolean(post.isLiked || post.liked);
});

const effectiveIsBookmarked = computed(() => {
  const post = props.post;
  if (!post) return false;

  const authUser = authSession.value?.user as any;
  const loggedEmail = authUser?.email?.toLowerCase();
  const loggedId = authUser?.id;
  const passedUserId = props.currentUserId?.toLowerCase();

  const bookmarks =
    post.bookmarksList || post.bookmarkedBy || post.bookmarks || [];
  if (Array.isArray(bookmarks)) {
    const foundInList = bookmarks.some((item: any) => {
      const s = String(item).toLowerCase();
      return (
        (passedUserId && s === passedUserId) ||
        (loggedEmail && s === loggedEmail) ||
        (loggedId && s === String(loggedId).toLowerCase())
      );
    });
    if (foundInList) return true;
  }

  if (props.isBookmarked === true) return true;

  return Boolean(post.isBookmarked || post.bookmarked);
});

const likesCount = computed(() => {
  return props.post?.likesList
    ? props.post.likesList.length
    : props.post?.likes || 0;
});

const commentsCount = computed(() => {
  return props.post?.comments?.length || 0;
});

const handleClick = (event: Event) => {
  if (props.isDetail) return;

  const target = event.target as HTMLElement;
  if (
    target.closest("button") ||
    target.closest("a") ||
    target.closest("input") ||
    target.closest(".prevent-post-nav")
  ) {
    return;
  }
  emit("navigate", props.post.uniqueId);
};

const navigateToAuthor = () => {
  const id =
    props.post?.authorUuid ||
    props.post?.authorId ||
    props.post?.userId ||
    props.post?.author;
  if (!id) return;
  if (props.post?.role === "Empresa" || props.post?.isCompany) {
    navigateTo(`/company/${encodeURIComponent(id)}`);
  } else {
    navigateTo(`/candidate/${encodeURIComponent(id)}`);
  }
};
</script>

<style scoped>
.font-fill-1 {
  font-variation-settings: "FILL" 1;
}
</style>
