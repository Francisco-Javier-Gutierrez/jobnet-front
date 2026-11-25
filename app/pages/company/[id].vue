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

    <!-- Tabs and Content Skeleton -->
    <section class="px-margin-mobile mb-8 animate-pulse">
      <!-- Tabs Navigation Skeleton (4 tabs) -->
      <div
        class="flex items-center gap-3 border-b border-outline-variant/30 pb-4 overflow-x-auto hide-scrollbar mb-8"
      >
        <div
          class="h-10 w-36 bg-surface-variant/60 dark:bg-slate-800 rounded-xl flex-shrink-0 border-b-2 border-primary/50"
        ></div>
        <div
          class="h-10 w-36 bg-surface-variant/30 dark:bg-slate-800/50 rounded-xl flex-shrink-0"
        ></div>
        <div
          class="h-10 w-36 bg-surface-variant/30 dark:bg-slate-800/50 rounded-xl flex-shrink-0"
        ></div>
        <div
          class="h-10 w-44 bg-surface-variant/30 dark:bg-slate-800/50 rounded-xl flex-shrink-0"
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
    <!-- Feedback Alert Banner for Staff Sanction Operations -->
    <div
      v-if="successMsg"
      class="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-3 shadow-sm animate-fade-in"
    >
      <div class="flex items-center gap-2 text-sm font-semibold">
        <span class="material-symbols-outlined text-emerald-600"
          >check_circle</span
        >
        <span>{{ successMsg }}</span>
      </div>
      <button
        @click="successMsg = ''"
        class="text-emerald-600 hover:text-emerald-800 transition"
      >
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    </div>

    <!-- Status Notice Banner: Revision State (Fase 1 / Fase 2) -->
    <div
      v-if="orgStatus === 'REVISION'"
      class="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
    >
      <div class="flex items-start sm:items-center gap-3">
        <span class="material-symbols-outlined text-amber-600 text-2xl"
          >warning</span
        >
        <div>
          <h4 class="font-bold text-sm">
            Organización en Estado de Revisión (Fase de Apelación)
          </h4>
          <p class="text-xs text-amber-800/80 dark:text-amber-300/80">
            Esta cuenta tiene una notificación de infracción en curso y se
            encuentra en periodo de gracia para apelar.
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink
          v-if="isOwner"
          to="/support"
          class="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-[16px]"
            >support_agent</span
          >
          Enviar Apelación
        </NuxtLink>
        <NuxtLink
          v-if="isStaff"
          to="/mod/appeals"
          class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-[16px]">forum</span>
          Ver Canal de Apelación
        </NuxtLink>
        <button
          v-if="isStaff"
          @click="openSanctionModal(companyForSanction)"
          class="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-[16px]">gavel</span>
          Emitir Dictamen
        </button>
      </div>
    </div>

    <!-- Status Notice Banner: Suspended State (Fase 3) -->
    <div
      v-else-if="orgStatus === 'SUSPENDIDA'"
      class="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
    >
      <div class="flex items-start sm:items-center gap-3">
        <span class="material-symbols-outlined text-rose-600 text-2xl"
          >block</span
        >
        <div>
          <h4 class="font-bold text-sm">Cuenta Suspendida por Infracción</h4>
          <p class="text-xs text-rose-800/80 dark:text-rose-300/80">
            El acceso de inicio de sesión se encuentra bloqueado y sus ofertas
            han sido ocultadas del portal.
          </p>
        </div>
      </div>
      <div v-if="isStaff" class="flex items-center gap-2">
        <button
          @click="openSanctionModal(companyForSanction)"
          class="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-[16px]">gavel</span>
          Reactivar Cuenta
        </button>
      </div>
    </div>

    <CompanyHeaderProfile
      :company="company"
      :is-owner="isOwner"
      :is-staff="isStaff"
      :org-status="orgStatus"
      @report="showReportCompanyModal = true"
      @open-sanction="openSanctionModal(companyForSanction)"
      @select-tab="companyTab = $event"
    />

    <!-- Ficha de Datos Corporativos visible en primer plano (homogéneo con perfil de candidato cuando es propietario) -->
    <section
      v-if="isOwner"
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] p-6 md:p-8 space-y-6 mb-6 border border-outline-variant/60"
    >
      <CompanyAboutSection
        :company="company"
        :web-links="webLinks"
        @preview-doc="previewCompanyDoc"
      />
    </section>

    <!-- Pestañas inferiores de actividad: Vacantes vigentes / Mis publicaciones / Guardados / Verificación -->
    <CompanyLists
      :company-tab="companyTab"
      :company="company"
      :is-owner="isOwner"
      :web-links="webLinks"
      :company-posts="companyPosts"
      :company-bookmarked-posts="companyBookmarkedPosts"
      :company-bookmarked-jobs="companyBookmarkedJobs"
      :loading-company-posts="loadingCompanyPosts"
      :current-user-id="currentUserId"
      @update:company-tab="companyTab = $event"
      @preview-doc="previewCompanyDoc"
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
      target-type="ORGANIZACION"
      :target-id="companyId"
      :target-title="company.name"
      @close="showReportCompanyModal = false"
    />

    <!-- Sanction Modal for Administrators / Moderators -->
    <SanctionModal
      v-model="isSanctionModalOpen"
      :selected-org="selectedOrg"
      :sanction-steps="sanctionSteps"
      v-model:suspension-reason-input="suspensionReasonInput"
      v-model:grace-days-input="graceDaysInput"
      :get-org-status-key="getOrgStatusKey"
      @apply-sanction="applySanction"
    />
  </main>
</template>

<script setup lang="ts">
import { useCompanyProfile } from "~/composables/useCompanyProfile";
import { useOrgActions } from "~/composables/useOrgActions";
import SanctionModal from "~/components/admin/organizations/SanctionModal.vue";
import CompanyAboutSection from "~/components/profiles/CompanyAboutSection.vue";

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
  companyBookmarkedJobs,
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
  refresh,
} = useCompanyProfile();

const { data: session } = useAuth();

const isStaff = computed(() => {
  const rawRole =
    (session.value?.user as any)?.tipoUsuario ||
    (session.value?.user as any)?.role;
  const userRole = (rawRole || "").toUpperCase();
  return (
    userRole === "ADMIN" || userRole === "MODERATOR" || userRole === "MODERADOR"
  );
});

const {
  successMsg,
  isSanctionModalOpen,
  selectedOrg,
  suspensionReasonInput,
  graceDaysInput,
  sanctionSteps,
  getOrgStatusKey,
  openSanctionModal,
  applySanction,
} = useOrgActions(refresh);

const orgStatus = computed(() => getOrgStatusKey(company.value));

const companyForSanction = computed(() => ({
  ...company.value,
  id: companyId,
  companyId,
  nombre: company.value.name || company.value.nombre || "Organización",
}));

useSeoMeta({
  title: `${company.value.name} - Perfil de Organización`,
  description: `Detalle y ofertas de ${company.value.name} en JobNet`,
});

const goBack = () => {
  const router = useRouter();
  router.back();
};
</script>
