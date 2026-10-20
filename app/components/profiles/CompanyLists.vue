<template>
  <section
    class="px-margin-mobile mb-8 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 p-6 rounded-2xl border border-outline-variant/60 shadow-sm space-y-6"
  >
    <!-- Navigation Tabs Bar: 4 Independent Tabs (+ Bookmarks for Owner) -->
    <div
      class="flex items-center gap-2 sm:gap-3 border-b border-outline-variant/30 pb-4 overflow-x-auto hide-scrollbar"
      role="tablist"
      aria-label="Pestañas de la organización"
    >
      <!-- Tab 1: Ficha Corporativa -->
      <button
        type="button"
        id="tab-ficha"
        role="tab"
        :aria-selected="companyTab === 'ficha'"
        @click="$emit('update:companyTab', 'ficha')"
        :class="[
          companyTab === 'ficha'
            ? 'bg-primary text-white shadow-sm font-bold'
            : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container-high',
        ]"
        class="px-4 sm:px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 active:scale-95 flex-shrink-0"
      >
        <span class="material-symbols-outlined text-base">domain</span>
        <span>Ficha Corporativa</span>
      </button>

      <!-- Tab 2: Vacantes Vigentes -->
      <button
        type="button"
        id="tab-vacancies"
        role="tab"
        :aria-selected="companyTab === 'vacancies'"
        @click="$emit('update:companyTab', 'vacancies')"
        :class="[
          companyTab === 'vacancies'
            ? 'bg-primary text-white shadow-sm font-bold'
            : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container-high',
        ]"
        class="px-4 sm:px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 active:scale-95 flex-shrink-0"
      >
        <span class="material-symbols-outlined text-base">work_history</span>
        <span>Vacantes vigentes ({{ visibleVacancies.length }})</span>
      </button>

      <!-- Tab 3: Publicaciones en la Comunidad -->
      <button
        type="button"
        id="tab-posts"
        role="tab"
        :aria-selected="companyTab === 'posts'"
        @click="$emit('update:companyTab', 'posts')"
        :class="[
          companyTab === 'posts'
            ? 'bg-primary text-white shadow-sm font-bold'
            : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container-high',
        ]"
        class="px-4 sm:px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 active:scale-95 flex-shrink-0"
      >
        <span class="material-symbols-outlined text-base">article</span>
        <span>Publicaciones ({{ companyPosts.length }})</span>
      </button>

      <!-- Tab 4: Estatus Oficial de su Distintivo de Verificación -->
      <button
        type="button"
        id="tab-verification"
        role="tab"
        :aria-selected="companyTab === 'verification'"
        @click="$emit('update:companyTab', 'verification')"
        :class="[
          companyTab === 'verification'
            ? 'bg-primary text-white shadow-sm font-bold'
            : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container-high',
        ]"
        class="px-4 sm:px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 active:scale-95 flex-shrink-0"
      >
        <span
          class="material-symbols-outlined text-base"
          :class="isVerified ? 'text-secondary dark:text-emerald-300' : ''"
        >
          verified
        </span>
        <span>Distintivo de Verificación</span>
      </button>

      <!-- Tab 5: Guardados (Estrictamente confidencial, accesible solo por la propia organización) -->
      <button
        v-if="isOwner"
        type="button"
        id="tab-bookmarks"
        role="tab"
        :aria-selected="companyTab === 'bookmarks'"
        @click="$emit('update:companyTab', 'bookmarks')"
        :class="[
          companyTab === 'bookmarks'
            ? 'bg-primary text-white shadow-sm font-bold'
            : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container-high',
        ]"
        class="px-4 sm:px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 active:scale-95 flex-shrink-0"
      >
        <span class="material-symbols-outlined text-base">bookmark</span>
        <span>Guardados ({{ companyBookmarkedPosts.length }})</span>
      </button>
    </div>

    <!-- Tab Content 1: Ficha Corporativa -->
    <div
      v-if="companyTab === 'ficha'"
      id="tabpanel-ficha"
      role="tabpanel"
      aria-labelledby="tab-ficha"
      class="animate-fade-in"
    >
      <CompanyAboutSection
        :company="company"
        :web-links="webLinks"
        @preview-doc="$emit('previewDoc', $event)"
      />
    </div>

    <!-- Tab Content 2: Vacantes Abiertas Vigentes -->
    <div
      v-else-if="companyTab === 'vacancies'"
      id="tabpanel-vacancies"
      role="tabpanel"
      aria-labelledby="tab-vacancies"
      class="space-y-4 animate-fade-in"
    >
      <div
        v-if="isSuspended && !isOwner"
        class="py-8 text-center text-xs text-rose-600 dark:text-rose-400 font-medium bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200/60 dark:border-rose-900/40 space-y-1"
      >
        <span class="material-symbols-outlined text-2xl mb-1 block">visibility_off</span>
        <p class="font-bold">Vacantes temporalmente ocultas</p>
        <p class="text-[11px] text-slate-500 dark:text-slate-400">
          Las vacantes de esta organización han sido ocultadas automáticamente del portal debido a la suspensión de la cuenta.
        </p>
      </div>
      <div
        v-else-if="visibleVacancies.length === 0"
        class="py-12 text-center text-xs text-on-surface-variant dark:text-slate-300 italic bg-surface-container-low/30 rounded-xl border border-outline-variant/30 space-y-2"
      >
        <span class="material-symbols-outlined text-3xl text-slate-400 block">work_off</span>
        <p>No hay vacantes abiertas registradas actualmente en esta organización.</p>
      </div>
      <div v-else class="grid grid-cols-1 gap-4">
        <JobCard
          v-for="job in visibleVacancies"
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

    <!-- Tab Content 3: Publicaciones en la Comunidad -->
    <div
      v-else-if="companyTab === 'posts'"
      id="tabpanel-posts"
      role="tabpanel"
      aria-labelledby="tab-posts"
      class="space-y-4 animate-fade-in"
    >
      <div
        v-if="loadingCompanyPosts"
        class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 animate-pulse"
      >
        Cargando publicaciones...
      </div>
      <div
        v-else-if="companyPosts.length === 0"
        class="py-12 text-center text-xs text-on-surface-variant dark:text-slate-300 italic bg-surface-container-low/30 rounded-xl border border-outline-variant/30 space-y-2"
      >
        <span class="material-symbols-outlined text-3xl text-slate-400 block">article</span>
        <p>No hay publicaciones de la organización para mostrar.</p>
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

    <!-- Tab Content 4: Distintivo Oficial de Verificación Empresarial -->
    <div
      v-else-if="companyTab === 'verification'"
      id="tabpanel-verification"
      role="tabpanel"
      aria-labelledby="tab-verification"
      class="animate-fade-in"
    >
      <CompanyVerificationSection
        :company="company"
        @preview-doc="$emit('previewDoc', $event)"
      />
    </div>

    <!-- Tab Content 5: Guardados (Solo Propietario) -->
    <div
      v-else-if="companyTab === 'bookmarks' && isOwner"
      id="tabpanel-bookmarks"
      role="tabpanel"
      aria-labelledby="tab-bookmarks"
      class="space-y-4 animate-fade-in"
    >
      <div
        class="flex items-center gap-3 p-3.5 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs text-indigo-900 dark:text-indigo-200"
      >
        <span class="material-symbols-outlined text-indigo-600 text-lg flex-shrink-0">lock</span>
        <span>
          <strong>Directiva de Privacidad:</strong> Las publicaciones guardadas se conservan de forma estrictamente privada y confidencial.
        </span>
      </div>

      <div
        v-if="loadingCompanyPosts"
        class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 animate-pulse"
      >
        Cargando publicaciones guardadas...
      </div>
      <div
        v-else-if="companyBookmarkedPosts.length === 0"
        class="py-12 text-center text-xs text-on-surface-variant dark:text-slate-300 italic bg-surface-container-low/30 rounded-xl border border-outline-variant/30"
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
import { computed } from "vue";
import type { Post, Job, CompanyProfile, WebLinkItem } from "~/types";
import CompanyAboutSection from "~/components/profiles/CompanyAboutSection.vue";
import CompanyVerificationSection from "~/components/profiles/CompanyVerificationSection.vue";

const props = withDefaults(
  defineProps<{
    companyTab: string;
    company: CompanyProfile;
    companyPosts: Post[];
    companyBookmarkedPosts: Post[];
    loadingCompanyPosts: boolean;
    currentUserId: string;
    isOwner?: boolean;
    webLinks?: WebLinkItem[];
  }>(),
  {
    isOwner: false,
    webLinks: () => [],
  },
);

const isSuspended = computed(() => {
  const statusStr = [
    props.company.estatus,
    props.company.estadoCuenta,
    (props.company as any).suspensionStatus,
  ]
    .filter(Boolean)
    .join(" ")
    .toUpperCase();
  return (
    statusStr.includes("SUSPEND") ||
    statusStr.includes("BLOQUEAD") ||
    props.company.bloqueada === true
  );
});

const isVerified = computed(() => {
  return (
    props.company.verified ||
    props.company.organizacionVerificada ||
    props.company.estatusVerificacion === "VERIFICADA"
  );
});

const visibleVacancies = computed(() => {
  if (isSuspended.value && !props.isOwner) {
    return [];
  }
  return props.company.vacancies || [];
});

defineEmits<{
  (e: "update:companyTab", tab: string): void;
  (e: "previewDoc", doc: any): void;
  (e: "likeJob", job: Job): void;
  (e: "bookmarkJob", job: Job): void;
  (e: "shareJob", job: Job): void;
  (e: "likePost", post: Post): void;
  (e: "bookmarkPost", post: Post): void;
  (e: "sharePost", post: Post): void;
}>();
</script>
