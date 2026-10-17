<template>
  <section
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] p-lg md:p-xl space-y-6"
  >
    <div class="flex items-center gap-3 border-b border-surface-container pb-4">
      <button
        type="button"
        @click="activeTab = 'posts'"
        :class="[
          activeTab === 'posts'
            ? 'bg-primary text-white shadow-sm font-bold'
            : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container-high',
        ]"
        class="px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 active:scale-95"
      >
        <span class="material-symbols-outlined text-base">article</span>
        <span>Mis publicaciones ({{ userPosts.length }})</span>
      </button>

      <!-- Guardados: estrictamente privado para el propio usuario -->
      <button
        v-if="isOwner"
        type="button"
        @click="activeTab = 'bookmarks'"
        :class="[
          activeTab === 'bookmarks'
            ? 'bg-primary text-white shadow-sm font-bold'
            : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container-high',
        ]"
        class="px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 active:scale-95"
      >
        <span class="material-symbols-outlined text-base">bookmark</span>
        <span>Guardados ({{ totalBookmarked }})</span>
      </button>
    </div>

    <!-- Tab Content 1: Mis Publicaciones -->
    <div v-if="activeTab === 'posts'" class="space-y-4">
      <div
        v-if="loadingPosts"
        class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 animate-pulse"
      >
        Cargando publicaciones...
      </div>
      <div
        v-else-if="userPosts.length === 0"
        class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 italic"
      >
        No hay publicaciones para mostrar.
      </div>
      <div v-else class="grid grid-cols-1 gap-4">
        <PostCard
          v-for="post in userPosts"
          :key="post.uniqueId"
          :post="post"
          :current-user-id="
            (authData?.user as any)?.id || authData?.user?.email || ''
          "
          :is-bookmarked="isBookmarked(post)"
          @navigate="(id) => $router.push(`/posts/${id}`)"
          @like="$emit('like', $event)"
          @bookmark="$emit('bookmark', $event)"
          @share="$emit('share', $event)"
        />
      </div>
    </div>

    <!-- Tab Content 2: Guardados (Estrictamente confidencial y privado) -->
    <div v-if="activeTab === 'bookmarks' && isOwner" class="space-y-5">
      <!-- Directiva de privacidad y confidencialidad -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs text-indigo-900 dark:text-indigo-200"
      >
        <div class="flex items-center gap-2.5">
          <span class="material-symbols-outlined text-indigo-600 text-lg flex-shrink-0">lock</span>
          <span>
            <strong>Privacidad de Guardados:</strong> Tus vacantes y publicaciones guardadas son estrictamente confidenciales. Solo tú puedes verlas.
          </span>
        </div>
        <NuxtLink
          to="/saved"
          class="inline-flex items-center gap-1 font-bold text-primary dark:text-indigo-400 hover:underline flex-shrink-0"
        >
          <span>Página completa</span>
          <span class="material-symbols-outlined text-sm">open_in_new</span>
        </NuxtLink>
      </div>

      <!-- Filtro rápido de tipo de favorito -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="favoriteSubTab = 'ALL'"
          :class="[
            favoriteSubTab === 'ALL'
              ? 'bg-primary text-white font-bold'
              : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high',
          ]"
          class="px-3.5 py-1.5 rounded-lg text-xs transition"
        >
          Todos ({{ totalBookmarked }})
        </button>
        <button
          type="button"
          @click="favoriteSubTab = 'JOBS'"
          :class="[
            favoriteSubTab === 'JOBS'
              ? 'bg-primary text-white font-bold'
              : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high',
          ]"
          class="px-3.5 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm">work</span>
          <span>Ofertas de Empleo ({{ bookmarkedJobs.length }})</span>
        </button>
        <button
          type="button"
          @click="favoriteSubTab = 'POSTS'"
          :class="[
            favoriteSubTab === 'POSTS'
              ? 'bg-primary text-white font-bold'
              : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high',
          ]"
          class="px-3.5 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm">article</span>
          <span>Publicaciones ({{ bookmarkedPosts.length }})</span>
        </button>
      </div>

      <div
        v-if="loadingPosts"
        class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 animate-pulse"
      >
        Cargando tus favoritos...
      </div>

      <div
        v-else-if="displayedBookmarksCount === 0"
        class="py-10 text-center text-xs text-on-surface-variant dark:text-slate-400 space-y-2"
      >
        <span class="material-symbols-outlined text-3xl text-outline-variant">bookmark_border</span>
        <p class="font-medium">No tienes elementos guardados en esta categoría.</p>
        <p class="text-[11px] text-on-surface-variant/70">
          Explora ofertas o publicaciones en el portal y presiona el botón de guardar para agregarlas a tu panel confidencial.
        </p>
      </div>

      <div v-else class="space-y-6">
        <!-- Ofertas Laborales Guardadas -->
        <div
          v-if="(favoriteSubTab === 'ALL' || favoriteSubTab === 'JOBS') && bookmarkedJobs.length > 0"
          class="space-y-3"
        >
          <h4 class="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm text-primary">work</span>
            <span>Ofertas Laborales Guardadas ({{ bookmarkedJobs.length }})</span>
          </h4>
          <div class="grid grid-cols-1 gap-4">
            <JobCard
              v-for="job in bookmarkedJobs"
              :key="job.id || job.uniqueId"
              :job="job"
              :current-user-id="(authData?.user as any)?.id || authData?.user?.email || ''"
              :is-bookmarked="true"
              @navigate="(id) => $router.push(`/jobs/${id}`)"
              @like="$emit('like-job', $event)"
              @bookmark="$emit('bookmark-job', $event)"
              @share="$emit('share-job', $event)"
            />
          </div>
        </div>

        <!-- Publicaciones Guardadas -->
        <div
          v-if="(favoriteSubTab === 'ALL' || favoriteSubTab === 'POSTS') && bookmarkedPosts.length > 0"
          class="space-y-3"
        >
          <h4 class="text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-slate-400 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm text-primary">article</span>
            <span>Publicaciones Guardadas ({{ bookmarkedPosts.length }})</span>
          </h4>
          <div class="grid grid-cols-1 gap-4">
            <PostCard
              v-for="post in bookmarkedPosts"
              :key="post.uniqueId"
              :post="post"
              :current-user-id="
                (authData?.user as any)?.id || authData?.user?.email || ''
              "
              :is-bookmarked="true"
              @navigate="(id) => $router.push(`/posts/${id}`)"
              @like="$emit('like', $event)"
              @bookmark="$emit('bookmark', $event)"
              @share="$emit('share', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Post } from "~/types";
import type { Session } from "next-auth";

const props = withDefaults(
  defineProps<{
    userPosts: Post[];
    bookmarkedPosts: Post[];
    bookmarkedJobs?: any[];
    loadingPosts: boolean;
    authData: Session | null;
    modelValue: "posts" | "bookmarks";
    isOwner?: boolean;
    isBookmarked: (post: Post) => boolean;
  }>(),
  {
    bookmarkedJobs: () => [],
    isOwner: false,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", val: "posts" | "bookmarks"): void;
  (e: "like", val: Post): void;
  (e: "bookmark", val: Post): void;
  (e: "share", val: Post): void;
  (e: "like-job", val: any): void;
  (e: "bookmark-job", val: any): void;
  (e: "share-job", val: any): void;
}>();

const activeTab = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const favoriteSubTab = ref<"ALL" | "JOBS" | "POSTS">("ALL");

const totalBookmarked = computed(
  () => props.bookmarkedPosts.length + (props.bookmarkedJobs?.length || 0),
);

const displayedBookmarksCount = computed(() => {
  if (favoriteSubTab.value === "JOBS") return props.bookmarkedJobs?.length || 0;
  if (favoriteSubTab.value === "POSTS") return props.bookmarkedPosts.length;
  return totalBookmarked.value;
});
</script>
