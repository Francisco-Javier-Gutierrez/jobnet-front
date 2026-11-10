<template>
  <main
    class="w-full max-w-container-max mx-auto md:px-gutter md:py-8 px-margin-mobile pb-16 space-y-6"
  >
    <!-- Header del Panel Personal de Favoritos -->
    <header
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4"
    >
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3.5">
          <div
            class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0"
          >
            <span class="material-symbols-outlined text-2xl font-fill-1"
              >bookmark</span
            >
          </div>
          <div>
            <h1
              class="text-2xl font-extrabold text-on-surface tracking-tight flex items-center gap-2"
            >
              Guardados
            </h1>
            <p class="text-xs text-on-surface-variant dark:text-slate-400">
              Tu colección privada de vacantes y publicaciones guardadas en
              JobNet.
            </p>
          </div>
        </div>

        <!-- Botones de Acción Rápida -->
        <div class="flex items-center gap-2.5">
          <NuxtLink
            to="/vacancies"
            class="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-sm">work</span>
            <span>Explorar Vacantes</span>
          </NuxtLink>
          <NuxtLink
            to="/"
            class="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-sm">dynamic_feed</span>
            <span>Ver Muro</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Banner de Privacidad y Protección de Datos -->
      <div
        class="flex items-center gap-3 p-4 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl text-xs text-indigo-950 dark:text-indigo-200 shadow-sm"
      >
        <span
          class="material-symbols-outlined text-indigo-600 text-xl flex-shrink-0"
          >verified_user</span
        >
        <div class="leading-relaxed">
          <strong class="font-bold"
            >Directiva de Privacidad y Confidencialidad:</strong
          >
          Tus elementos guardados se conservan bajo estricta reserva y
          protección de datos. Ningún otro usuario, empresa o visitante del
          portal puede acceder a tu historial de favoritos.
        </div>
      </div>

      <!-- Filtros por tipo de contenido -->
      <div
        class="flex items-center gap-2 pt-2 border-t border-outline-variant/30"
      >
        <button
          type="button"
          @click="activeFilter = 'ALL'"
          :class="[
            activeFilter === 'ALL'
              ? 'bg-primary text-white font-bold shadow-sm'
              : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high',
          ]"
          class="px-4 py-2 rounded-xl text-xs transition"
        >
          Todos ({{ totalCount }})
        </button>

        <button
          type="button"
          @click="activeFilter = 'JOBS'"
          :class="[
            activeFilter === 'JOBS'
              ? 'bg-primary text-white font-bold shadow-sm'
              : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high',
          ]"
          class="px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm">work</span>
          <span>Ofertas Laborales ({{ bookmarkedJobs.length }})</span>
        </button>

        <button
          type="button"
          @click="activeFilter = 'POSTS'"
          :class="[
            activeFilter === 'POSTS'
              ? 'bg-primary text-white font-bold shadow-sm'
              : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high',
          ]"
          class="px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm">article</span>
          <span>Publicaciones ({{ bookmarkedPosts.length }})</span>
        </button>
      </div>
    </header>

    <!-- Estado de Carga -->
    <div
      v-if="pending"
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-3xl p-12 text-center text-xs text-on-surface-variant animate-pulse space-y-3"
    >
      <div
        class="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"
      ></div>
      <p class="font-semibold">Cargando tus elementos favoritos privados...</p>
    </div>

    <!-- Estado Vacío -->
    <div
      v-else-if="displayedCount === 0"
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4"
    >
      <div
        class="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center text-on-surface-variant"
      >
        <span class="material-symbols-outlined text-3xl">bookmark_border</span>
      </div>
      <div class="max-w-md mx-auto space-y-1">
        <h3 class="text-base font-bold text-on-surface">
          No tienes elementos guardados en esta categoría
        </h3>
        <p class="text-xs text-on-surface-variant dark:text-slate-400">
          Cuando encuentres una vacante atractiva o una publicación relevante en
          JobNet, presiona el icono de marcador para conservarla en tu panel
          privado.
        </p>
      </div>
      <div class="flex justify-center gap-3 pt-2">
        <NuxtLink
          to="/vacancies"
          class="px-5 py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl transition shadow-sm"
        >
          Buscar Empleo
        </NuxtLink>
        <NuxtLink
          to="/"
          class="px-5 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold rounded-xl transition"
        >
          Ir al Muro
        </NuxtLink>
      </div>
    </div>

    <!-- Contenido de Elementos Guardados -->
    <div v-else class="space-y-8">
      <!-- Sección Ofertas Laborales -->
      <section
        v-if="
          (activeFilter === 'ALL' || activeFilter === 'JOBS') &&
          bookmarkedJobs.length > 0
        "
        class="space-y-4"
      >
        <div class="flex items-center justify-between px-1">
          <h2
            class="text-sm font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400 flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-base text-primary"
              >work</span
            >
            <span
              >Ofertas de Empleo Guardadas ({{ bookmarkedJobs.length }})</span
            >
          </h2>
          <span class="text-xs text-on-surface-variant/70"
            >Solo visibles por ti</span
          >
        </div>

        <div class="grid grid-cols-1 gap-4">
          <JobCard
            v-for="job in bookmarkedJobs"
            :key="job.id || job.uniqueId"
            :job="job"
            :current-user-id="currentUserId"
            :is-bookmarked="true"
            :is-liked="job.isLiked"
            @navigate="(id) => $router.push(`/jobs/${id}`)"
            @like="toggleJobLike"
            @bookmark="toggleJobBookmark"
            @share="shareJob"
          />
        </div>
      </section>

      <!-- Sección Publicaciones -->
      <section
        v-if="
          (activeFilter === 'ALL' || activeFilter === 'POSTS') &&
          bookmarkedPosts.length > 0
        "
        class="space-y-4"
      >
        <div class="flex items-center justify-between px-1">
          <h2
            class="text-sm font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400 flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-base text-primary"
              >article</span
            >
            <span>Publicaciones Guardadas ({{ bookmarkedPosts.length }})</span>
          </h2>
          <span class="text-xs text-on-surface-variant/70"
            >Solo visibles por ti</span
          >
        </div>

        <div class="grid grid-cols-1 gap-4">
          <PostCard
            v-for="post in bookmarkedPosts"
            :key="post.uniqueId"
            :post="post"
            :current-user-id="currentUserId"
            :is-bookmarked="true"
            :is-liked="post.isLiked"
            @navigate="(id) => $router.push(`/posts/${id}`)"
            @like="togglePostLike"
            @bookmark="togglePostBookmark"
            @share="sharePost"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import {
  useAuth,
  useRuntimeConfig,
  useLazyAsyncData,
  useSeoMeta,
  useRouter,
} from "#imports";
import { useShare } from "~/composables/useShare";

useSeoMeta({
  title: "Panel Personal de Favoritos - JobNet",
  description:
    "Accede a tus publicaciones y ofertas laborales guardadas de forma estrictamente privada y confidencial.",
});

const { data: session, status } = useAuth();
const router = useRouter();
const config = useRuntimeConfig();
const { sharePost, shareJob } = useShare();

const currentUserId = computed(() => {
  return (session.value?.user as any)?.id || session.value?.user?.email || "";
});

// Guard: Redirigir si no está autenticado
watchEffect(() => {
  if (status.value === "unauthenticated") {
    router.replace("/login");
  }
});

const activeFilter = ref<"ALL" | "JOBS" | "POSTS">("ALL");
const bookmarkedPosts = ref<any[]>([]);
const bookmarkedJobs = ref<any[]>([]);

const {
  data: bookmarksData,
  pending,
  refresh,
} = useLazyAsyncData(
  "user-personal-favorites",
  async () => {
    if (!currentUserId.value) return { data: [], posts: [], jobs: [] };
    return $fetch<any>(
      `/api/profile/${encodeURIComponent(currentUserId.value)}/bookmarks?userId=${encodeURIComponent(currentUserId.value)}`,
      {
        headers: { "x-user-id": currentUserId.value },
      },
    ).catch(() => ({ data: [], posts: [], jobs: [] }));
  },
  { watch: [currentUserId] },
);

watch(
  bookmarksData,
  (val: any) => {
    if (val) {
      if (Array.isArray(val.posts) && val.posts.length > 0) {
        bookmarkedPosts.value = val.posts;
      } else if (Array.isArray(val.data)) {
        bookmarkedPosts.value = val.data.filter(
          (i: any) =>
            (i.PK && i.PK.startsWith("POST#")) ||
            i.uniqueId ||
            (i.content && !i.modalidad),
        );
      } else {
        bookmarkedPosts.value = [];
      }

      if (Array.isArray(val.jobs) && val.jobs.length > 0) {
        bookmarkedJobs.value = val.jobs;
      } else if (Array.isArray(val.data)) {
        bookmarkedJobs.value = val.data.filter(
          (i: any) =>
            (i.PK && i.PK.startsWith("VACANCY#")) ||
            i.empresaUuid !== undefined ||
            i.modalidad !== undefined ||
            i.salario !== undefined ||
            i.title !== undefined,
        );
      } else {
        bookmarkedJobs.value = [];
      }
    }
  },
  { immediate: true },
);

const totalCount = computed(
  () => bookmarkedJobs.value.length + bookmarkedPosts.value.length,
);

const displayedCount = computed(() => {
  if (activeFilter.value === "JOBS") return bookmarkedJobs.value.length;
  if (activeFilter.value === "POSTS") return bookmarkedPosts.value.length;
  return totalCount.value;
});

// Toggle Job Bookmark (Optimistic removal from favorites)
const toggleJobBookmark = async (job: any) => {
  const jId = job.id || job.uniqueId;
  const idx = bookmarkedJobs.value.findIndex(
    (j) => (j.id || j.uniqueId) === jId,
  );
  if (idx !== -1) {
    bookmarkedJobs.value.splice(idx, 1);
  }

  try {
    await $fetch(`/api/jobs/${jId}/bookmark`, {
      method: "POST",
      body: { userUuid: currentUserId.value },
    });
  } catch (e) {
    console.error("Error toggling job bookmark:", e);
  }
};

// Toggle Job Like
const toggleJobLike = async (job: any) => {
  if (!currentUserId.value) return;
  if (!job.likesList) job.likesList = [];

  const jId = job.id || job.uniqueId;
  const idx = job.likesList.indexOf(currentUserId.value);
  if (idx !== -1) {
    job.likesList.splice(idx, 1);
    if (typeof job.likesCount === "number") {
      job.likesCount = Math.max(0, job.likesCount - 1);
    }
    job.isLiked = false;
  } else {
    job.likesList.push(currentUserId.value);
    if (typeof job.likesCount === "number") {
      job.likesCount = job.likesCount + 1;
    } else {
      job.likesCount = job.likesList.length;
    }
    job.isLiked = true;
  }
  job.likes = job.likesList.length;

  try {
    await $fetch(`/api/jobs/${jId}/like`, {
      method: "POST",
      body: { userUuid: currentUserId.value },
    });
  } catch (e) {
    console.error("Error toggling job like:", e);
  }
};

// Toggle Post Bookmark (Optimistic removal from favorites)
const togglePostBookmark = async (post: any) => {
  const pId = post.uniqueId || post.id;
  const idx = bookmarkedPosts.value.findIndex(
    (p) => (p.uniqueId || p.id) === pId,
  );
  if (idx !== -1) {
    bookmarkedPosts.value.splice(idx, 1);
  }

  try {
    await $fetch(`/api/posts/${pId}/bookmark`, {
      method: "POST",
      body: { userUuid: currentUserId.value },
    });
  } catch (e) {
    console.error("Error toggling post bookmark:", e);
  }
};

// Toggle Post Like
const togglePostLike = async (post: any) => {
  if (!currentUserId.value) return;
  if (!post.likesList) post.likesList = [];

  const idx = post.likesList.indexOf(currentUserId.value);
  if (idx !== -1) {
    post.likesList.splice(idx, 1);
    if (typeof post.likesCount === "number") {
      post.likesCount = Math.max(0, post.likesCount - 1);
    }
    post.isLiked = false;
  } else {
    post.likesList.push(currentUserId.value);
    if (typeof post.likesCount === "number") {
      post.likesCount = post.likesCount + 1;
    } else {
      post.likesCount = post.likesList.length;
    }
    post.isLiked = true;
  }
  post.likes = post.likesList.length;

  try {
    await $fetch(`/api/posts/${post.uniqueId || post.id}/like`, {
      method: "POST",
      body: { userUuid: currentUserId.value },
    });
  } catch (e) {
    console.error("Error toggling post like:", e);
  }
};
</script>
