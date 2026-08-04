<template>
  <main
    class="flex-grow pt-4 pb-36 px-4 md:px-8 flex flex-col gap-6 max-w-4xl mx-auto w-full bg-background dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200"
  >
    <!-- Header Section (RF-33: Logo + Nombre Comercial preview) -->
    <div
      class="flex items-center gap-4 mt-4 p-4 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-2xl shadow-sm"
    >
      <div
        class="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-outline-variant/80 shadow-md flex items-center justify-center relative group flex-shrink-0 p-1.5"
      >
        <img
          alt="Logotipo Corporativo"
          class="w-full h-full object-contain rounded-xl"
          :src="
            fotoPerfil ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBv7ieXvxtMvK4Bf5kvEuqFTPF59k2wFj0FOiA-v1xXN5VHCH9_ZcdYzKj6xGbyBIeLHVW5FuXPuhZ8ghouEp8A22nMpZV0iW6Zvg_YQ0avpohEqle9p-AR9bgPXdnJadM20BCP6_nuDkNCMnR9ywHb5fxRNfK1sAIL6bXl7qjeDQaRa5J--hkEcazv-m8Brqe_BbKSdIGlVhXvuRzLzSM3HSd57GyjW2Ueeh0XvBP7u4bT3o0EWgnO0Q'
          "
        />
      </div>

      <div class="min-w-0 flex-grow">
        <h1
          class="text-xl font-bold text-on-background dark:text-slate-100 truncate"
        >
          {{ nombreComercial || "Mi Organización" }}
        </h1>
        <p
          class="text-xs text-on-surface-variant dark:text-slate-300 flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-sm text-primary"
            >domain</span
          >
          Configuración e Identidad Corporativa (Organización)
        </p>
      </div>

      <NuxtLink
        :to="`/company/${companyId}`"
        class="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold rounded-xl transition flex items-center gap-1 active:scale-95"
      >
        <span class="material-symbols-outlined text-sm">visibility</span>
        Ver Perfil Público
      </NuxtLink>
    </div>

    <!-- Segmented Navigation Tabs -->
    <div
      class="w-full border-b border-outline-variant/60 overflow-x-auto hide-scrollbar"
    >
      <nav class="flex gap-4 min-w-max pb-1">
        <button
          v-for="tab in tabItems"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'text-primary border-b-2 border-primary font-bold'
              : 'text-on-surface-variant dark:text-slate-300 hover:text-primary',
          ]"
          class="pb-2.5 px-2 text-xs font-medium transition-colors flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-base">{{
            tab.icon
          }}</span>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Draft Restore Notification Banner -->
    <div
      v-if="hasDraft"
      class="bg-primary/10 border border-primary/20 text-on-surface text-xs p-3 rounded-xl flex items-center justify-between"
    >
      <span class="flex items-center gap-1.5 font-medium">
        <span class="material-symbols-outlined text-base text-primary"
          >info</span
        >
        Se ha restaurado un borrador con cambios sin guardar de la organización.
      </span>
      <button
        type="button"
        @click="discardDraft"
        class="text-rose-500 hover:text-rose-600 font-bold transition"
      >
        Descartar
      </button>
    </div>

    <!-- Tab 1: Identidad Visual -->
    <section v-show="activeTab === 'identidad'" class="flex flex-col gap-6">
      <CompanyIdentityTab
        v-model:fotoPerfil="fotoPerfil"
        v-model:nombreComercial="nombreComercial"
        v-model:sector="sector"
        v-model:latitude="latitude"
        v-model:longitude="longitude"
        v-model:locationName="locationName"
        :companyId="companyId"
      />
    </section>

    <!-- Tab 2: Perfil Corporativo -->
    <section v-show="activeTab === 'perfil'" class="flex flex-col gap-6">
      <CompanyProfileTab
        v-model:descripcion="descripcion"
        v-model:mision="mision"
        v-model:vision="vision"
        v-model:beneficios="beneficios"
      />
    </section>

    <!-- Tab 3: Documentos Corporativos -->
    <section v-show="activeTab === 'documentos'" class="flex flex-col gap-6">
      <CompanyDocumentsTab
        v-model:documentosCorporativos="documentosCorporativos"
        :companyId="companyId"
        @previewDoc="previewDoc"
      />
    </section>

    <!-- Tab 4: Marca y Redes -->
    <section v-show="activeTab === 'marca'" class="flex flex-col gap-6">
      <CompanyBrandTab v-model:website="website" v-model:linkedin="linkedin" />
    </section>

    <!-- Tab 5: Verificación Fiscal -->
    <section v-show="activeTab === 'verificacion'" class="flex flex-col gap-6">
      <CompanyVerificationTab
        v-model:taxId="taxId"
        v-model:documentoVerificacion="documentoVerificacion"
        :estatusVerificacion="estatusVerificacion"
        :companyId="companyId"
        :submittingVerification="submittingVerification"
        @verify="handleVerificationRequest"
      />
    </section>

    <!-- Tab 6: Seguridad y MFA -->
    <section v-show="activeTab === 'seguridad'" class="flex flex-col gap-6">
      <MfaSettingsCard
        :user-id="companyId || ''"
        :initial-mfa-state="mfaEnabled"
        @mfa-updated="(state) => (mfaEnabled = state)"
      />
    </section>

    <!-- Standardized Corporate Document Viewer -->
    <AppDocumentViewer
      v-model="isPdfModalOpen"
      :url="activePreviewUrl"
      :title="activePreviewName"
    />

    <!-- Save Action Button -->
    <button
      @click="handleSave"
      :disabled="saving"
      class="bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-semibold text-sm h-12 rounded-xl transition shadow-md shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 duration-100 mt-4"
    >
      <span class="material-symbols-outlined text-lg">{{
        saving ? "sync" : "save"
      }}</span>
      {{ saving ? "Guardando..." : "Guardar Perfil de la Organización" }}
    </button>
  </main>
</template>

<script setup lang="ts">
import { useAppFeedback } from "~/composables/useAppFeedback";

// Component imports
import CompanyIdentityTab from "~/components/company/settings/CompanyIdentityTab.vue";
import CompanyProfileTab from "~/components/company/settings/CompanyProfileTab.vue";
import CompanyDocumentsTab from "~/components/company/settings/CompanyDocumentsTab.vue";
import CompanyBrandTab from "~/components/company/settings/CompanyBrandTab.vue";
import CompanyVerificationTab from "~/components/company/settings/CompanyVerificationTab.vue";

interface DocumentoCorporativo {
  id: string;
  tipo: string;
  nombre: string;
  url: string;
  fechaCarga: string;
}

useSeoMeta({
  title: "Configuración Corporativa - JobNet",
  description:
    "Administra la identidad visual, perfil corporativo y documentos relevantes de la organización",
});

useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
      crossorigin: "",
    },
  ],
});

const router = useRouter();
const config = useRuntimeConfig();
const { data: sessionData, status } = useAuth();
const { showSuccess, showError, showWarning } = useAppFeedback();

const activeTab = ref("identidad");
const mfaEnabled = ref(false);

const tabItems = [
  { id: "identidad", label: "Identidad Visual", icon: "palette" },
  { id: "perfil", label: "Perfil Corporativo", icon: "business" },
  { id: "documentos", label: "Documentos Relevantes", icon: "verified" },
  { id: "marca", label: "Marca y Redes", icon: "language" },
  { id: "verificacion", label: "Verificación Fiscal", icon: "verified_user" },
  { id: "seguridad", label: "Seguridad y MFA", icon: "shield_lock" },
];

const companyId = ref("");
const nombreComercial = ref("");
const sector = ref("Tecnología y Software");
const fotoPerfil = ref("");
const descripcion = ref("");
const mision = ref("");
const vision = ref("");
const beneficios = ref("");
const website = ref("");
const linkedin = ref("");
const taxId = ref("");
const documentoVerificacion = ref("");
const estatusVerificacion = ref("");
const latitude = ref(19.2826);
const longitude = ref(-99.6557);
const locationName = ref("");
const documentosCorporativos = ref<DocumentoCorporativo[]>([]);

const isPdfModalOpen = ref(false);
const activePreviewUrl = ref("");
const activePreviewName = ref("");
const loading = ref(true);
const saving = ref(false);
const submittingVerification = ref(false);

const hasDraft = ref(false);
let isRestoring = false;

const previewDoc = (doc: DocumentoCorporativo) => {
  activePreviewUrl.value = doc.url;
  activePreviewName.value = doc.nombre || doc.tipo;
  isPdfModalOpen.value = true;
};

const saveDraft = () => {
  if (process.client && !isRestoring) {
    if (
      nombreComercial.value ||
      descripcion.value ||
      mision.value ||
      documentosCorporativos.value.length > 0
    ) {
      localStorage.setItem(
        "jobnet_draft_company_edit",
        JSON.stringify({
          nombreComercial: nombreComercial.value,
          sector: sector.value,
          descripcion: descripcion.value,
          mision: mision.value,
          vision: vision.value,
          beneficios: beneficios.value,
          latitude: latitude.value,
          longitude: longitude.value,
          locationName: locationName.value,
          website: website.value,
          linkedin: linkedin.value,
          taxId: taxId.value,
          fotoPerfil: fotoPerfil.value,
          documentosCorporativos: documentosCorporativos.value,
        }),
      );
    }
  }
};

const loadDraft = () => {
  if (process.client) {
    const saved = localStorage.getItem("jobnet_draft_company_edit");
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (
          draft.nombreComercial ||
          draft.descripcion ||
          draft.mision ||
          draft.documentosCorporativos?.length > 0
        ) {
          isRestoring = true;
          nombreComercial.value = draft.nombreComercial || "";
          sector.value = draft.sector || "Tecnología y Software";
          descripcion.value = draft.descripcion || "";
          mision.value = draft.mision || "";
          vision.value = draft.vision || "";
          beneficios.value = draft.beneficios || "";
          if (draft.latitude) latitude.value = draft.latitude;
          if (draft.longitude) longitude.value = draft.longitude;
          if (draft.locationName) locationName.value = draft.locationName;
          website.value = draft.website || "";
          linkedin.value = draft.linkedin || "";
          taxId.value = draft.taxId || "";
          fotoPerfil.value = draft.fotoPerfil || "";
          documentosCorporativos.value = draft.documentosCorporativos || [];
          hasDraft.value = true;
          isRestoring = false;
        }
      } catch (e) {
        console.error("Error loading company edit draft:", e);
      }
    }
  }
};

const discardDraft = () => {
  if (process.client) {
    localStorage.removeItem("jobnet_draft_company_edit");
    hasDraft.value = false;
    fetchCompanyProfile();
  }
};

watch(
  [
    nombreComercial,
    sector,
    descripcion,
    mision,
    vision,
    beneficios,
    documentosCorporativos,
    website,
    linkedin,
    fotoPerfil,
  ],
  () => {
    saveDraft();
  },
  { deep: true },
);

const fetchCompanyProfile = async () => {
  if (status.value !== "authenticated" || !sessionData.value?.user?.id) {
    router.push("/login");
    return;
  }
  companyId.value = sessionData.value.user.id;
  loading.value = true;
  try {
    const profile = await $fetch<any>(
      `${config.public.apiUrl}/profile/${companyId.value}`,
    );
    if (profile) {
      nombreComercial.value = profile.nombre || profile.nombreComercial || "";
      sector.value = profile.sector || "Tecnología y Software";
      descripcion.value = profile.biografia || profile.descripcion || "";
      mision.value = profile.mision || "";
      vision.value = profile.vision || "";
      beneficios.value = profile.beneficios || profile.culturaLaboral || "";
      fotoPerfil.value = profile.fotoPerfil || "";
      website.value = profile.website || profile.enlacesWeb?.website || "";
      linkedin.value = profile.linkedin || profile.enlacesWeb?.linkedin || "";
      taxId.value = profile.taxId || "";
      documentoVerificacion.value = profile.documentoVerificacion || "";
      estatusVerificacion.value = profile.estatusVerificacion || "";
      mfaEnabled.value = Boolean(profile.mfaConfigured || profile.mfaEnabled);
      documentosCorporativos.value = profile.documentosCorporativos || [];
      if (profile.ubicacion) {
        if (profile.ubicacion.lat) latitude.value = profile.ubicacion.lat;
        if (profile.ubicacion.lng) longitude.value = profile.ubicacion.lng;
        if (profile.ubicacion.name) locationName.value = profile.ubicacion.name;
      }
    }
  } catch (error) {
    console.error("Error fetching company profile:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchCompanyProfile();
  loadDraft();
});

const handleSave = async () => {
  if (!companyId.value) return;
  saving.value = true;
  try {
    const response = await $fetch(
      `${config.public.apiUrl}/profile/${companyId.value}`,
      {
        method: "POST",
        body: {
          nombre: nombreComercial.value,
          nombreComercial: nombreComercial.value,
          sector: sector.value,
          biografia: descripcion.value,
          descripcion: descripcion.value,
          mision: mision.value,
          vision: vision.value,
          beneficios: beneficios.value,
          culturaLaboral: beneficios.value,
          fotoPerfil: fotoPerfil.value,
          documentosCorporativos: documentosCorporativos.value,
          ubicacion: {
            lat: latitude.value,
            lng: longitude.value,
            name: locationName.value,
          },
          taxId: taxId.value,
          enlacesWeb: { website: website.value, linkedin: linkedin.value },
        },
      },
    );

    if (response) {
      if (process.client) {
        localStorage.removeItem("jobnet_draft_company_edit");
        hasDraft.value = false;
      }
      showSuccess(
        "Perfil Corporativo Guardado",
        "Los datos de tu organización fueron actualizados correctamente.",
        2500,
      );
      setTimeout(() => {
        router.push(`/company/${companyId.value}`);
      }, 1500);
    }
  } catch (error: any) {
    console.error("Error saving company configuration:", error);
    showError(
      "Error al Guardar Perfil Corporativo",
      "Error al intentar guardar el perfil corporativo.",
      null,
    );
  } finally {
    saving.value = false;
  }
};

const handleVerificationRequest = async () => {
  if (!taxId.value || !documentoVerificacion.value || !companyId.value) {
    showWarning(
      "Datos Incompletos",
      "Ingresa tu RFC y el Documento de Verificación.",
      4000,
    );
    return;
  }
  submittingVerification.value = true;
  try {
    await $fetch(`${config.public.apiUrl}/profile/${companyId.value}`, {
      method: "POST",
      body: {
        taxId: taxId.value,
        documentoVerificacion: documentoVerificacion.value,
        estatusVerificacion: "En revisión",
        organizacionVerificada: false,
      },
    });
    estatusVerificacion.value = "En revisión";
    showSuccess(
      "Solicitud Enviada",
      "Tu solicitud de verificación fue enviada al equipo de moderación.",
      3500,
    );
  } catch (error: any) {
    console.error("Error requesting verification:", error);
    showError(
      "Error en Solicitud",
      error?.data?.error || "Ocurrió un error al solicitar la verificación.",
      null,
    );
  } finally {
    submittingVerification.value = false;
  }
};
</script>

<style>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
