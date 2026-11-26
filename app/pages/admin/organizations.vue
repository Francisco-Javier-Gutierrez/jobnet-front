<template>
  <div
    class="max-w-7xl mx-auto px-6 py-8 w-full bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 dark:text-slate-100 transition-colors duration-200"
  >
    <div
      class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div>
        <h1
          class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Control de Organizaciones
        </h1>
        <p
          class="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm mt-1"
        >
          Visualiza, verifica y gestiona sanciones de las organizaciones del
          sistema.
        </p>
      </div>
      <AppActionButton
        @click="refresh()"
        :loading="loading"
        icon="refresh"
        icon-class="text-[18px]"
        loading-text="Sincronizando..."
        label="Sincronizar Datos"
        class="self-start bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 dark:text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 active:scale-95 duration-100 shadow-sm"
      />
    </div>

    <OrganizationStats
      :loading="loading"
      :orgs-length="orgs.length"
      :verified-count="verifiedCount"
      :in-review-count="inReviewCount"
      :suspended-count="suspendedCount"
    />

    <div
      v-if="successMsg"
      class="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-sm font-semibold"
    >
      <span class="material-symbols-outlined text-lg">check_circle</span>
      {{ successMsg }}
    </div>

    <OrganizationFilters
      :loading="loading"
      v-model:modelSearchInput="searchInput"
      v-model:modelFilterVerification="filterVerification"
      v-model:modelFilterAccountStatus="filterAccountStatus"
      v-model:modelFilterDateStart="filterDateStart"
      v-model:modelFilterDateEnd="filterDateEnd"
      @execute-search="executeServerSearch"
      @clear-search-input="clearSearchInput"
      @clear-filters="clearFilters"
    />

    <OrganizationTable
      :loading="loading"
      :paginated-orgs="paginatedOrgs"
      :filtered-orgs-length="filteredOrgs.length"
      v-model:current-page="currentPage"
      :total-pages="totalPages"
      :get-org-status-key="getOrgStatusKey"
      :is-toggling-verification="isTogglingVerification"
      @toggle-verification="toggleVerification"
      @open-sanction-modal="openSanctionModal"
    />

    <SanctionModal
      v-model="isSanctionModalOpen"
      :selected-org="selectedOrg"
      :sanction-steps="sanctionSteps"
      v-model:suspension-reason-input="suspensionReasonInput"
      v-model:grace-days-input="graceDaysInput"
      :get-org-status-key="getOrgStatusKey"
      :is-submitting="isApplyingSanction"
      @apply-sanction="applySanction"
    />
  </div>
</template>

<script setup lang="ts">
import { useAdminOrganizations } from "~/composables/useAdminOrganizations";
import { useOrgActions } from "~/composables/useOrgActions";

useSeoMeta({
  title: "Control de Organizaciones - Administrador",
  description:
    "Tabla de control maestro y gestión de sanciones de organizaciones registradas en JobNet",
});

const {
  searchInput,
  filterVerification,
  filterAccountStatus,
  filterDateStart,
  filterDateEnd,
  currentPage,
  loading,
  orgs,
  verifiedCount,
  inReviewCount,
  suspendedCount,
  filteredOrgs,
  totalPages,
  paginatedOrgs,
  refresh,
  executeServerSearch,
  clearSearchInput,
  clearFilters,
  getOrgStatusKey,
} = useAdminOrganizations();

const {
  successMsg,
  isSanctionModalOpen,
  selectedOrg,
  suspensionReasonInput,
  graceDaysInput,
  sanctionSteps,
  isApplyingSanction,
  isTogglingVerification,
  toggleVerification,
  openSanctionModal,
  applySanction,
} = useOrgActions(refresh);
</script>
