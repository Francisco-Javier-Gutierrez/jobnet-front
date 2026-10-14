<template>
  <!-- Premium Loading Skeleton -->
  <main
    v-if="loading"
    class="w-full max-w-container-max mx-auto md:px-gutter md:py-8 px-margin-mobile pb-16"
  >
    <!-- Header / Banner Section Skeleton -->
    <section
      class="relative bg-surface-container-high dark:bg-slate-800/40 h-40 md:h-52 rounded-2xl shadow-sm mb-24 md:mb-28 animate-pulse overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"
      ></div>

      <!-- Corporate Logo Overlap Skeleton -->
      <div
        class="absolute -bottom-20 md:-bottom-24 left-1/2 -translate-x-1/2 w-48 h-48 md:w-60 md:h-60 bg-surface dark:bg-slate-900 rounded-3xl border-4 border-surface dark:border-slate-800 flex items-center justify-center p-3 z-20 shadow-xl"
      >
        <div
          class="w-full h-full bg-surface-variant/50 dark:bg-slate-800 rounded-2xl"
        ></div>
      </div>
    </section>

    <!-- Central Identity Card Skeleton -->
    <section
      class="px-margin-mobile flex flex-col items-center text-center mt-2 mb-10 space-y-4 animate-pulse"
    >
      <!-- Title Skeleton -->
      <div
        class="h-10 w-64 md:w-96 bg-surface-variant/60 dark:bg-slate-800 rounded-xl mb-1"
      ></div>

      <!-- Verified Badge Skeleton -->
      <div
        class="h-8 w-48 bg-surface-variant/40 dark:bg-slate-800/60 rounded-full mb-1"
      ></div>

      <!-- Sector Skeleton -->
      <div
        class="h-5 w-40 bg-surface-variant/30 dark:bg-slate-800/50 rounded-lg mb-3"
      ></div>

      <!-- Action Buttons Skeleton -->
      <div
        class="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md mt-2"
      >
        <div
          class="h-11 w-full bg-surface-variant/50 dark:bg-slate-800/70 rounded-xl shadow-sm"
        ></div>
        <div
          class="h-11 w-full bg-surface-container-low dark:bg-slate-800/30 border border-outline-variant/40 rounded-xl"
        ></div>
        <div
          class="h-11 w-full bg-surface-container-low dark:bg-slate-800/30 border border-outline-variant/40 rounded-xl"
        ></div>
      </div>
    </section>

    <!-- About Us Skeleton -->
    <section class="px-margin-mobile mb-10 space-y-6 animate-pulse">
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/40 space-y-6"
      >
        <div>
          <!-- Section Heading -->
          <div
            class="h-6 w-48 bg-surface-variant/60 dark:bg-slate-800 rounded-lg mb-5"
          ></div>

          <!-- Paragraph Skeleton -->
          <div class="space-y-3">
            <div
              class="h-4 w-full bg-surface-variant/40 dark:bg-slate-800/70 rounded-md"
            ></div>
            <div
              class="h-4 w-11/12 bg-surface-variant/40 dark:bg-slate-800/70 rounded-md"
            ></div>
            <div
              class="h-4 w-4/5 bg-surface-variant/40 dark:bg-slate-800/70 rounded-md"
            ></div>
            <div
              class="h-4 w-5/6 bg-surface-variant/40 dark:bg-slate-800/70 rounded-md"
            ></div>
          </div>
        </div>

        <!-- Mision/Vision Grid Skeleton -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div
            class="h-40 bg-surface-variant/30 dark:bg-slate-800/40 rounded-2xl border border-outline-variant/30 p-5 flex flex-col gap-3"
          >
            <div
              class="h-5 w-24 bg-surface-variant/50 dark:bg-slate-800/60 rounded-md"
            ></div>
            <div
              class="h-3 w-full bg-surface-variant/30 dark:bg-slate-800/40 rounded mt-2"
            ></div>
            <div
              class="h-3 w-5/6 bg-surface-variant/30 dark:bg-slate-800/40 rounded"
            ></div>
            <div
              class="h-3 w-4/5 bg-surface-variant/30 dark:bg-slate-800/40 rounded"
            ></div>
          </div>
          <div
            class="h-40 bg-surface-variant/30 dark:bg-slate-800/40 rounded-2xl border border-outline-variant/30 p-5 flex flex-col gap-3"
          >
            <div
              class="h-5 w-24 bg-surface-variant/50 dark:bg-slate-800/60 rounded-md"
            ></div>
            <div
              class="h-3 w-full bg-surface-variant/30 dark:bg-slate-800/40 rounded mt-2"
            ></div>
            <div
              class="h-3 w-4/5 bg-surface-variant/30 dark:bg-slate-800/40 rounded"
            ></div>
            <div
              class="h-3 w-11/12 bg-surface-variant/30 dark:bg-slate-800/40 rounded"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabs and Content Skeleton -->
    <section class="px-margin-mobile mb-8 animate-pulse">
      <!-- Tabs Navigation Skeleton -->
      <div
        class="flex items-center gap-4 border-b border-outline-variant/30 pb-4 overflow-x-auto hide-scrollbar mb-8"
      >
        <div
          class="h-10 w-32 bg-surface-variant/60 dark:bg-slate-800 rounded-xl flex-shrink-0 border-b-2 border-primary/50"
        ></div>
        <div
          class="h-10 w-40 bg-surface-variant/30 dark:bg-slate-800/50 rounded-xl flex-shrink-0"
        ></div>
        <div
          class="h-10 w-36 bg-surface-variant/30 dark:bg-slate-800/50 rounded-xl flex-shrink-0"
        ></div>
      </div>

      <!-- Job/Post Cards Grid Skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="i in 3"
          :key="i"
          class="h-64 bg-surface-container-lowest dark:bg-slate-900 rounded-3xl border border-outline-variant/40 p-6 flex flex-col justify-between shadow-sm"
        >
          <div>
            <!-- Job Title -->
            <div
              class="h-6 w-3/4 bg-surface-variant/60 dark:bg-slate-800 rounded-lg mb-4"
            ></div>

            <!-- Badges -->
            <div class="flex flex-wrap gap-2 mb-5">
              <div
                class="h-6 w-20 bg-surface-variant/40 dark:bg-slate-800/60 rounded-md"
              ></div>
              <div
                class="h-6 w-24 bg-surface-variant/40 dark:bg-slate-800/60 rounded-md"
              ></div>
            </div>

            <!-- Description -->
            <div class="space-y-2 mt-4">
              <div
                class="h-3 w-full bg-surface-variant/30 dark:bg-slate-800/50 rounded"
              ></div>
              <div
                class="h-3 w-5/6 bg-surface-variant/30 dark:bg-slate-800/50 rounded"
              ></div>
            </div>
          </div>

          <!-- Card Footer -->
          <div
            class="flex justify-between items-center border-t border-outline-variant/30 pt-4 mt-4"
          >
            <div
              class="h-4 w-24 bg-surface-variant/40 dark:bg-slate-800/60 rounded-md"
            ></div>
            <div
              class="h-9 w-28 bg-surface-variant/50 dark:bg-slate-800/80 rounded-xl"
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
    <CompanyHeaderProfile
      :company="company"
      :is-owner="isOwner"
      @report="showReportCompanyModal = true"
    />

    <CompanyAboutSection
      :company="company"
      :web-links="webLinks"
      @preview-doc="previewCompanyDoc"
    />

    <CompanyLists
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
import { useCompanyProfile } from "~/composables/useCompanyProfile";

const {
  companyId,
  company,
  webLinks,
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
  title: `${company.value.name} - Perfil de Organización`,
  description: `Detalle y ofertas de ${company.value.name} en JobNet`,
});

const goBack = () => {
  const router = useRouter();
  router.back();
};
</script>
