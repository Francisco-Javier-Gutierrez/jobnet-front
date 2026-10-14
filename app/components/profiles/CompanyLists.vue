<template>
  <section
    class="px-margin-mobile mb-8 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 p-6 rounded-2xl border border-outline-variant/60 shadow-sm space-y-6"
  >
    <div
      class="flex items-center gap-3 border-b border-outline-variant/30 pb-4 overflow-x-auto"
    >
      <button
        type="button"
        @click="$emit('update:companyTab', 'vacancies')"
        :class="[
          companyTab === 'vacancies'
            ? 'bg-primary text-white shadow-sm font-bold'
            : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container-high',
        ]"
        class="px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 active:scale-95 flex-shrink-0"
      >
        <span class="material-symbols-outlined text-base">work_history</span>
        <span>Vacantes abiertas ({{ company.vacancies.length }})</span>
      </button>

      <button
        type="button"
        @click="$emit('update:companyTab', 'posts')"
        :class="[
          companyTab === 'posts'
            ? 'bg-primary text-white shadow-sm font-bold'
            : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container-high',
        ]"
        class="px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 active:scale-95 flex-shrink-0"
      >
        <span class="material-symbols-outlined text-base">article</span>
        <span>Publicaciones ({{ companyPosts.length }})</span>
      </button>

      <button
        type="button"
        @click="$emit('update:companyTab', 'bookmarks')"
        :class="[
          companyTab === 'bookmarks'
            ? 'bg-primary text-white shadow-sm font-bold'
            : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container-high',
        ]"
        class="px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 active:scale-95 flex-shrink-0"
      >
        <span class="material-symbols-outlined text-base">bookmark</span>
        <span>Guardados ({{ companyBookmarkedPosts.length }})</span>
      </button>
    </div>

    <!-- Tab 1: Vacantes Abiertas -->
    <div v-if="companyTab === 'vacancies'" class="space-y-4">
      <div
        v-if="company.vacancies.length === 0"
        class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 italic"
      >
        No hay vacantes abiertas registradas actualmente.
      </div>
      <div v-else class="grid grid-cols-1 gap-4">
        <JobCard
          v-for="job in company.vacancies"
          :key="job.id"
          :job="job"
          :current-user-id="currentUserId"
          @like="$emit('likeJob', $event)"
          @bookmark="$emit('bookmarkJob', $event)"
          @share="$emit('shareJob', $event)"
          @navigate="(id) => $router.push(`/jobs/${id}`)"
        />
      </div>
    </div>

    <!-- Tab 2: Publicaciones -->
    <div v-if="companyTab === 'posts'" class="space-y-4">
      <div
        v-if="loadingCompanyPosts"
        class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 animate-pulse"
      >
        Cargando publicaciones...
      </div>
      <div
        v-else-if="companyPosts.length === 0"
        class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 italic"
      >
        No hay publicaciones de la organización para mostrar.
      </div>
      <div v-else class="grid grid-cols-1 gap-4">
        <PostCard
          v-for="post in companyPosts"
          :key="post.uniqueId"
          :post="post"
          :current-user-id="currentUserId"
          @navigate="(id) => $router.push(`/posts/${id}`)"
          @like="$emit('likePost', $event)"
          @bookmark="$emit('bookmarkPost', $event)"
          @share="$emit('sharePost', $event)"
        />
      </div>
    </div>

    <!-- Tab 3: Guardados -->
    <div v-if="companyTab === 'bookmarks'" class="space-y-4">
      <div
        v-if="loadingCompanyPosts"
        class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 animate-pulse"
      >
        Cargando publicaciones guardadas...
      </div>
      <div
        v-else-if="companyBookmarkedPosts.length === 0"
        class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 italic"
      >
        No tienes publicaciones guardadas.
      </div>
      <div v-else class="grid grid-cols-1 gap-4">
        <PostCard
          v-for="post in companyBookmarkedPosts"
          :key="post.uniqueId"
          :post="post"
          :current-user-id="currentUserId"
          @navigate="(id) => $router.push(`/posts/${id}`)"
          @like="$emit('likePost', $event)"
          @bookmark="$emit('bookmarkPost', $event)"
          @share="$emit('sharePost', $event)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Post, Job, CompanyProfile } from "~/types";

defineProps<{
  companyTab: string;
  company: CompanyProfile;
  companyPosts: Post[];
  companyBookmarkedPosts: Post[];
  loadingCompanyPosts: boolean;
  currentUserId: string;
}>();

defineEmits<{
  (e: "update:companyTab", tab: string): void;
  (e: "likeJob", job: Job): void;
  (e: "bookmarkJob", job: Job): void;
  (e: "shareJob", job: Job): void;
  (e: "likePost", post: Post): void;
  (e: "bookmarkPost", post: Post): void;
  (e: "sharePost", post: Post): void;
}>();
</script>
