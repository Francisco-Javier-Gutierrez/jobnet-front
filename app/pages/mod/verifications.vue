<template>
  <div
    class="max-w-5xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-on-background mb-2">
        Verificaciones Corporativas (Moderador)
      </h1>
      <p class="text-on-surface-variant dark:text-slate-300 text-sm">
        Evalúa y aprueba las constancias de situación fiscal para otorgar la
        insignia de verificación a las organizaciones.
      </p>
    </div>

    <!-- Verifications queue -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm"
    >
      <div
        class="p-6 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/20"
      >
        <h2 class="text-sm font-bold text-on-background">
          Solicitudes de verificación
        </h2>
        <span
          class="bg-secondary/10 text-secondary text-xs px-2.5 py-0.5 rounded-full font-bold"
          >{{ requests.length }} Pendiente{{
            requests.length !== 1 ? "s" : ""
          }}</span
        >
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="p-8 space-y-6">
        <div
          v-for="n in 2"
          :key="n"
          class="animate-pulse flex flex-col sm:flex-row justify-between gap-4"
        >
          <div class="flex-grow space-y-2">
            <div class="h-4 bg-outline-variant/30 rounded w-1/3"></div>
            <div class="h-3 bg-outline-variant/30 rounded w-1/4"></div>
            <div class="h-3 bg-outline-variant/30 rounded w-1/2"></div>
            <div
              class="h-[200px] bg-outline-variant/20 rounded max-w-2xl mt-4"
            ></div>
          </div>
          <div
            class="h-10 bg-outline-variant/30 rounded w-24 self-center"
          ></div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="requests.length === 0"
        class="p-12 text-center flex flex-col items-center justify-center text-on-surface-variant dark:text-slate-300"
      >
        <span class="material-symbols-outlined text-[48px] text-primary/40 mb-3"
          >verified_user</span
        >
        <p class="text-sm font-semibold text-on-surface">Cola limpia</p>
        <p class="text-xs text-on-surface-variant dark:text-slate-300 mt-1">
          No hay solicitudes de verificación de organizaciones pendientes de
          revisión.
        </p>
      </div>

      <!-- Requests List -->
      <div v-else class="divide-y divide-outline-variant/30">
        <div
          v-for="req in requests"
          :key="req.companyId"
          class="p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
        >
          <div class="min-w-0">
            <h3 class="text-sm font-bold text-on-background mb-1">
              Organización: {{ req.companyName }}
            </h3>
            <p class="text-xs text-on-surface-variant dark:text-slate-300 mb-1">
              RFC:
              <span class="font-mono text-on-background font-semibold">{{
                req.taxId
              }}</span>
            </p>
            <p class="text-xs text-on-surface-variant dark:text-slate-300 mb-3">
              Email: {{ req.email }}
            </p>
            <div class="flex flex-col gap-2">
              <a
                v-if="req.docUrl"
                :href="req.docUrl"
                target="_blank"
                class="inline-flex items-center gap-1.5 text-primary hover:text-primary-container text-xs font-bold hover:underline"
              >
                <span class="material-symbols-outlined text-sm"
                  >picture_as_pdf</span
                >
                Ver Constancia Fiscal (PDF)
              </a>

              <!-- Google Drive / Docs Native Embedded PDF Viewer Iframe -->
              <div
                v-if="req.docUrl"
                class="mt-2 w-full max-w-2xl border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm aspect-[4/3] bg-surface"
              >
                <iframe
                  :src="`https://docs.google.com/viewer?url=${encodeURIComponent(req.docUrl)}&embedded=true`"
                  class="w-full h-full border-none"
                  title="Visor de Documento Fiscal (Google Drive Viewer)"
                  role="document"
                  aria-label="Constancia de situación fiscal"
                ></iframe>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0 self-center">
            <button
              @click="handleAction(req.companyId, true)"
              class="bg-secondary hover:bg-[#005236] text-white font-bold text-xs px-4 py-2.5 rounded-lg transition active:scale-95 duration-100 flex items-center gap-1 shadow-sm"
            >
              <span class="material-symbols-outlined text-sm">verified</span>
              Aprobar
            </button>
            <button
              @click="handleAction(req.companyId, false)"
              class="bg-surface border border-outline-variant hover:border-rose-600 text-on-surface-variant dark:text-slate-300 hover:text-rose-600 font-semibold text-xs px-4 py-2.5 rounded-lg transition active:scale-95 duration-100"
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MOCK_VERIFICATIONS } from "~/utils/mockData";

useSeoMeta({
  title: "Verificaciones Corporativas - JobNet",
  description:
    "Bandeja de verificación de documentos tributarios corporativos para moderadores",
});

const config = useRuntimeConfig();
const requests = ref<any[]>([]);
const loading = ref(true);

const fetchRequests = async () => {
  loading.value = true;
  try {
    const data = await $fetch<any[]>(
      `${config.public.apiUrl}/moderator/verifications`,
    );
    requests.value = data && data.length > 0 ? data : MOCK_VERIFICATIONS;
  } catch (e) {
    console.error("Error loading verification requests:", e);
    requests.value = MOCK_VERIFICATIONS;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRequests();
});

const handleAction = async (companyId: string, approve: boolean) => {
  try {
    await $fetch(
      `${config.public.apiUrl}/moderator/verifications/${companyId}/resolve`,
      {
        method: "POST",
        body: {
          approve,
        },
      },
    );
    requests.value = requests.value.filter((r) => r.companyId !== companyId);
  } catch (e) {
    console.error("Error updating company verification:", e);
  }
};
</script>
