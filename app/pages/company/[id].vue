<template>
  <!-- Loading State -->
  <main
    v-if="loading"
    class="w-full max-w-container-max mx-auto md:px-gutter md:py-8 px-margin-mobile pb-16 animate-pulse"
  >
    <!-- Header / Banner Section Skeleton -->
    <section
      class="relative bg-surface-variant/40 dark:bg-slate-800/50 h-40 md:h-52 rounded-2xl mb-24 md:mb-28"
    >
      <!-- Corporate Logo Overlap Skeleton -->
      <div
        class="absolute -bottom-20 md:-bottom-24 left-1/2 -translate-x-1/2 w-48 h-48 md:w-60 md:h-60 bg-surface dark:bg-slate-900 rounded-3xl border-4 border-surface dark:border-slate-800 flex items-center justify-center p-3 md:p-3.5 z-20"
      >
        <div
          class="w-full h-full bg-surface-variant/50 dark:bg-slate-800 rounded-2xl"
        ></div>
      </div>
    </section>

    <!-- Central Identity Card Skeleton -->
    <section
      class="px-margin-mobile flex flex-col items-center text-center mt-2 mb-8 space-y-4"
    >
      <div
        class="h-10 w-64 md:w-96 bg-surface-variant/50 dark:bg-slate-800 rounded-xl mb-2"
      ></div>
      <div
        class="h-7 w-40 bg-surface-variant/40 dark:bg-slate-800/80 rounded-full mb-1"
      ></div>
      <div
        class="h-5 w-48 bg-surface-variant/30 dark:bg-slate-800/60 rounded-md mb-2"
      ></div>

      <!-- Action Buttons Skeleton -->
      <div
        class="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md mt-2"
      >
        <div
          class="h-10 w-full bg-surface-variant/40 dark:bg-slate-800/70 rounded-lg"
        ></div>
        <div
          class="h-10 w-full bg-surface-variant/40 dark:bg-slate-800/70 rounded-lg"
        ></div>
        <div
          class="h-10 w-full bg-surface-variant/40 dark:bg-slate-800/70 rounded-lg"
        ></div>
      </div>
    </section>

    <!-- About Us Skeleton -->
    <section class="px-margin-mobile mb-10 space-y-6">
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-outline-variant/30 space-y-6"
      >
        <div>
          <div
            class="h-8 w-48 bg-surface-variant/50 dark:bg-slate-800 rounded-lg mb-4"
          ></div>
          <div class="space-y-3">
            <div
              class="h-4 w-full bg-surface-variant/40 dark:bg-slate-800/70 rounded"
            ></div>
            <div
              class="h-4 w-11/12 bg-surface-variant/40 dark:bg-slate-800/70 rounded"
            ></div>
            <div
              class="h-4 w-4/5 bg-surface-variant/40 dark:bg-slate-800/70 rounded"
            ></div>
          </div>
        </div>

        <!-- Mision/Vision Grid Skeleton -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div
            class="h-32 bg-surface-variant/30 dark:bg-slate-800/50 rounded-xl"
          ></div>
          <div
            class="h-32 bg-surface-variant/30 dark:bg-slate-800/50 rounded-xl"
          ></div>
        </div>
      </div>
    </section>

    <!-- Tabs and Content Skeleton -->
    <section
      class="px-margin-mobile mb-8 bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6"
    >
      <!-- Tabs Skeleton -->
      <div
        class="flex items-center gap-3 border-b border-outline-variant/20 pb-4 overflow-x-auto hide-scrollbar"
      >
        <div
          class="h-10 w-40 bg-surface-variant/50 dark:bg-slate-800 rounded-xl flex-shrink-0"
        ></div>
        <div
          class="h-10 w-36 bg-surface-variant/30 dark:bg-slate-800/60 rounded-xl flex-shrink-0"
        ></div>
        <div
          class="h-10 w-36 bg-surface-variant/30 dark:bg-slate-800/60 rounded-xl flex-shrink-0"
        ></div>
      </div>

      <!-- Job Cards Skeleton -->
      <div class="flex flex-col gap-4">
        <div
          v-for="i in 3"
          :key="i"
          class="h-44 bg-surface-variant/20 dark:bg-slate-800/30 rounded-xl border border-surface-variant/30 p-5 flex flex-col justify-between"
        >
          <div>
            <div
              class="h-6 w-3/4 bg-surface-variant/40 dark:bg-slate-800/60 rounded-md mb-4"
            ></div>
            <div class="flex gap-2">
              <div
                class="h-6 w-24 bg-surface-variant/30 dark:bg-slate-800/50 rounded-full"
              ></div>
              <div
                class="h-6 w-32 bg-surface-variant/30 dark:bg-slate-800/50 rounded-full"
              ></div>
            </div>
          </div>
          <div
            class="flex justify-between items-center border-t border-surface-variant/30 pt-4 mt-4"
          >
            <div
              class="h-5 w-28 bg-surface-variant/40 dark:bg-slate-800/60 rounded-md"
            ></div>
            <div
              class="h-9 w-32 bg-surface-variant/50 dark:bg-slate-800/80 rounded-lg"
            ></div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Real Content -->
  <main
    v-else
    class="w-full max-w-container-max mx-auto md:px-gutter md:py-8 px-margin-mobile pb-16"
  >
    <ProfilesCompanyHeaderProfile 
      :company="company" 
      :is-owner="isOwner" 
      @report="showReportCompanyModal = true" 
    />

    <ProfilesCompanyAboutSection 
      :company="company" 
      @preview-doc="previewCompanyDoc" 
    />

    <ProfilesCompanyLists 
      :company-tab="companyTab"
      :company="company"
      :company-posts="companyPosts"
      :company-bookmarked-posts="companyBookmarkedPosts"
      :loading-company-posts="loadingCompanyPosts"
      :current-user-id="currentUserId"
      @update:company-tab="companyTab = $event"
      @like-job="toggleJobLike"
      @bookmark-job="toggleJobBookmark"
      @share-job="shareJob"
      @like-post="toggleLike"
      @bookmark-post="toggleBookmark"
      @share-post="sharePost"
    />

    <!-- Standardized Corporate Document Viewer -->
    <AppDocumentViewer
      v-model="isPdfModalOpen"
      :url="activePreviewUrl"
      :title="activePreviewName"
    />

    <!-- Report Company Modal -->
    <ReportModal
      :is-open="showReportCompanyModal"
      target-type="EMPRESA"
      :target-id="companyId"
      :target-title="company.name"
      @close="showReportCompanyModal = false"
    />
  </main>
</template>

<script setup lang="ts">
import { useCompanyProfile } from '~/composables/useCompanyProfile';

const {
  companyId,
  company,
  isOwner,
  loading,
  companyTab,
  loadingCompanyPosts,
  companyPosts,
  companyBookmarkedPosts,
  currentUserId,
  showReportCompanyModal,
  isPdfModalOpen,
  activePreviewUrl,
  activePreviewName,
  previewCompanyDoc,
  toggleLike,
  toggleBookmark,
  toggleJobLike,
  toggleJobBookmark,
  sharePost,
  shareJob,
} = useCompanyProfile();

useSeoMeta({
  title: `${company.value.name} - Perfil de Empresa`,
  description: `Detalle y ofertas de ${company.value.name} en JobNet`,
});

const goBack = () => {
  const router = useRouter();
  router.back();
};
</script>
