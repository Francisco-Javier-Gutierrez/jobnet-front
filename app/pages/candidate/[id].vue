<template>
  <!-- Loading State -->
  <main
    v-if="loading"
    class="w-full max-w-container-max mx-auto md:px-gutter md:py-8 px-margin-mobile pb-16 space-y-6 animate-pulse"
  >
    <!-- Header Card Skeleton -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 rounded-xl border border-outline-variant/60 overflow-hidden shadow-sm"
    >
      <div class="bg-outline/10 h-2 w-full"></div>
      <div class="p-8 flex flex-col items-center text-center">
        <!-- Avatar Skeleton -->
        <div class="w-32 h-32 rounded-full bg-outline/20 mb-4"></div>
        <!-- Name Skeleton -->
        <div class="h-7 w-48 bg-outline/20 rounded-lg mb-2"></div>
        <!-- Location Skeleton -->
        <div class="h-4 w-32 bg-outline/20 rounded mb-4"></div>
        <!-- Badge Skeleton -->
        <div class="h-6 w-40 bg-outline/20 rounded-full mb-6"></div>
        <!-- Button Skeleton -->
        <div class="w-full flex gap-3 max-w-sm">
          <div class="flex-1 h-12 bg-outline/20 rounded-lg"></div>
          <div class="flex-1 h-12 bg-outline/20 rounded-lg"></div>
        </div>
      </div>
    </div>

    <!-- Details Card Skeleton -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 rounded-xl border border-outline-variant/60 p-6 space-y-4"
    >
      <div class="h-5 w-36 bg-outline/20 rounded-lg"></div>
      <div class="space-y-2">
        <div class="h-4 w-full bg-outline/10 rounded"></div>
        <div class="h-4 w-5/6 bg-outline/10 rounded"></div>
        <div class="h-4 w-4/5 bg-outline/10 rounded"></div>
      </div>
    </div>
  </main>

  <!-- Error State -->
  <main
    v-else-if="error"
    class="w-full max-w-container-max mx-auto md:px-gutter md:py-8 px-margin-mobile pb-16 flex items-center justify-center min-h-[60vh]"
  >
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] p-lg md:p-xl text-center max-w-md"
    >
      <span class="material-symbols-outlined text-error text-5xl mb-4"
        >error_outline</span
      >
      <h2 class="font-headline-md text-headline-md text-on-surface mb-2">
        No se pudo cargar el perfil
      </h2>
      <p
        class="font-body-md text-body-md text-on-surface-variant dark:text-slate-300 mb-6"
      >
        {{ errorMessage }}
      </p>
      <button
        @click="refreshProfile"
        class="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
      >
        Reintentar
      </button>
    </div>
  </main>

  <!-- Profile Content -->
  <main
    v-else
    class="w-full max-w-container-max mx-auto md:px-gutter md:py-8 px-margin-mobile pb-16 space-y-6"
  >
    <!-- Header Profile -->
    <CandidateHeaderProfile
      :profile="profile"
      :default-avatar="defaultAvatar"
      :location-text="locationText"
      :is-owner="isOwner"
      :web-links="webLinks"
    />

    <!-- Documents Horizontal Scroll -->
    <CandidateDocumentsList :documents="documents" @open="openDocViewer" />

    <!-- Standardized Universal Document Viewer -->
    <AppDocumentViewer
      v-model="showDocViewer"
      :url="selectedDocUrl"
      :title="selectedDocTitle"
    />

    <!-- Body Card -->
    <section
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] p-lg md:p-xl space-y-8"
    >
      <!-- Sobre mí y Sectores -->
      <CandidateAboutSection :profile="profile" :sectors="sectors" />

      <!-- Trayectoria Laboral (Experiencia) -->
      <CandidateExperienceList :experiencia="profile.experiencia" />

      <!-- Formación Académica (Educación) -->
      <CandidateEducationList :educacion="profile.educacion" />

      <!-- Habilidades Técnicas -->
      <CandidateSkillsList :skills="skills" />
    </section>

    <!-- Bottom Section Tabs: [Mis publicaciones] / [Guardados] -->
    <CandidateActivityTabs
      v-model="activeTab"
      :user-posts="userPosts"
      :bookmarked-posts="bookmarkedPosts"
      :loading-posts="loadingPosts"
      :auth-data="authData"
      :is-bookmarked="isBookmarked"
      @like="toggleLike"
      @bookmark="toggleBookmark"
      @share="sharePost"
    />
  </main>
</template>

<script setup lang="ts">
import { useSeoMeta } from "#app";
import { useCandidateProfile } from "~/composables/useCandidateProfile";
import CandidateHeaderProfile from "~/components/profiles/CandidateHeaderProfile.vue";
import CandidateAboutSection from "~/components/profiles/CandidateAboutSection.vue";
import CandidateExperienceList from "~/components/profiles/CandidateExperienceList.vue";
import CandidateEducationList from "~/components/profiles/CandidateEducationList.vue";
import CandidateSkillsList from "~/components/profiles/CandidateSkillsList.vue";
import CandidateDocumentsList from "~/components/profiles/CandidateDocumentsList.vue";
import CandidateActivityTabs from "~/components/profiles/CandidateActivityTabs.vue";

const {
  loading,
  error,
  errorMessage,
  profile,
  defaultAvatar,
  locationText,
  skills,
  sectors,
  webLinks,
  documents,
  isOwner,
  refreshProfile,
  fetchProfile,
  selectedDocUrl,
  selectedDocTitle,
  showDocViewer,
  openDocViewer,
  activeTab,
  loadingPosts,
  userPosts,
  bookmarkedPosts,
  toggleLike,
  toggleBookmark,
  isBookmarked,
  sharePost,
  authData,
} = useCandidateProfile();

// --- Init ---
fetchProfile();

// --- SEO ---
useSeoMeta({
  title: () => `${profile.value.nombre || "Candidato"} - Perfil`,
  description: () =>
    `Perfil público del candidato ${profile.value.nombre || ""} en JobNet`,
});
</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
