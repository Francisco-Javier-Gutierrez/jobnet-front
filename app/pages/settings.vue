<template>
  <div
    class="max-w-3xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-on-background mb-2">
          Configuración de Perfil de Candidato
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-sm">
          Gestiona tu información personal, experiencia laboral, formación
          académica, habilidades y currículum vitae PDF.
        </p>
      </div>

      <!-- Save Profile Button -->
      <button
        type="button"
        @click="saveProfile"
        :disabled="isSaving"
        class="bg-primary hover:bg-primary-container text-white font-bold text-xs px-6 py-3 rounded-xl transition flex items-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
      >
        <span
          v-if="isSaving"
          class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"
          aria-hidden="true"
        ></span>
        <span v-else class="material-symbols-outlined text-sm">save</span>
        <span>{{ isSaving ? "Guardando..." : "Guardar Cambios" }}</span>
      </button>
    </div>

    <!-- Draft Banner -->
    <div
      v-if="hasDraft"
      class="mb-4 bg-primary/10 border border-primary/20 text-on-surface text-xs p-3 rounded-xl flex items-center justify-between"
    >
      <span class="flex items-center gap-1.5 font-medium">
        <span class="material-symbols-outlined text-base text-primary"
          >info</span
        >
        Se ha restaurado un borrador con cambios sin guardar de tu
        configuración.
      </span>
      <button
        type="button"
        @click="discardDraft"
        class="text-rose-500 hover:text-rose-600 font-bold transition"
      >
        Descartar
      </button>
    </div>

    <!-- Segmented Navigation Tabs -->
    <div
      class="w-full border-b border-outline-variant/60 overflow-x-auto overflow-y-hidden touch-pan-x hide-scrollbar mb-6"
    >
      <nav class="flex flex-nowrap gap-4 w-max pb-1 px-1">
        <button
          v-for="tab in tabItems"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'text-primary border-b-2 border-primary font-bold'
              : 'text-on-surface-variant dark:text-slate-300 hover:text-primary',
          ]"
          class="pb-2.5 px-2 text-xs font-medium transition-colors flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap"
        >
          <span class="material-symbols-outlined text-base">{{
            tab.icon
          }}</span>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Main Form Components Stack -->
    <div class="flex flex-col gap-6">
      <section v-show="activeTab === 'personales'" class="flex flex-col gap-6">
        <SettingsPersonalInfo
          v-model:name="formData.name"
          v-model:titulo-profesional="formData.tituloProfesional"
          v-model:location="formData.location"
          v-model:bio="formData.bio"
          v-model:foto-perfil="formData.fotoPerfil"
        />
        <SettingsLocationMap
          v-model:lat="formData.lat"
          v-model:lng="formData.lng"
          @locationName="(name) => (formData.location = name)"
        />
      </section>

      <section v-show="activeTab === 'profesional'" class="flex flex-col gap-6">
        <SettingsExperienceList v-model:experiencia="formData.experiencia" />
        <SettingsSectorsSection
          v-model:sectors="formData.sectores"
          :catalogSectors="catalogStore.sectors"
        />
      </section>

      <section v-show="activeTab === 'habilidades'" class="flex flex-col gap-6">
        <SettingsEducationList v-model:educacion="formData.educacion" />
        <SettingsSkillsSection
          v-model:skills="formData.skills"
          :catalogSkills="catalogStore.skills"
        />
      </section>

      <section v-show="activeTab === 'documentos'" class="flex flex-col gap-6">
        <SettingsCvUploader
          v-model:cvUrl="formData.cvUrl"
          v-model:cvName="formData.cvName"
          :profile="formData"
        />

        <SettingsAdditionalDocs
          v-model:documentosAdicionales="formData.documentosAdicionales"
        />
      </section>

      <section v-show="activeTab === 'enlaces'" class="flex flex-col gap-6">
        <SettingsWebLinks v-model:links="formData.links" />
      </section>

      <section v-show="activeTab === 'seguridad'" class="flex flex-col gap-6">
        <SettingsLinkedAccountsCard
          :is-federated="isFederatedUser"
          :user-email="(session?.user as any)?.email || formData.email"
        />
        <MfaSettingsCard
          :user-id="(session?.user as any)?.id || ''"
          :initial-mfa-state="formData.mfaEnabled"
          :is-federated="isFederatedUser"
          @mfa-updated="(state) => (formData.mfaEnabled = state)"
        />
        <SettingsPasswordCard :is-federated="isFederatedUser" />
      </section>
    </div>

    <!-- Bottom Save Action -->
    <div class="mt-8 flex justify-end">
      <button
        type="button"
        @click="saveProfile"
        :disabled="isSaving"
        class="bg-primary hover:bg-primary-container text-white font-bold text-xs px-8 py-3.5 rounded-2xl transition flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
      >
        <span
          v-if="isSaving"
          class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"
          aria-hidden="true"
        ></span>
        <span v-else class="material-symbols-outlined text-sm">save</span>
        <span>{{
          isSaving ? "Guardando Perfil..." : "Guardar Cambios del Perfil"
        }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppFeedback } from "~/composables/useAppFeedback";
import { useCatalogStore } from "~/stores/catalog";

definePageMeta({
  middleware: "auth",
});

const { status, data: session } = useAuth();
const isSaving = ref(false);

const { showFeedback, showError } = useAppFeedback();
const catalogStore = useCatalogStore();

const activeTab = ref("personales");
const tabItems = [
  { id: "personales", label: "Datos Personales", icon: "person" },
  { id: "profesional", label: "Experiencia", icon: "work" },
  { id: "habilidades", label: "Educación", icon: "school" },
  { id: "documentos", label: "Documentos", icon: "description" },
  { id: "enlaces", label: "Enlaces", icon: "language" },
  { id: "seguridad", label: "Seguridad y MFA", icon: "shield_lock" },
];

const formData = ref({
  name: "",
  tituloProfesional: "",
  location: "",
  bio: "",
  fotoPerfil: "",
  experiencia: [] as any[],
  educacion: [] as any[],
  skills: [] as string[],
  sectores: [] as string[],
  cvUrl: "",
  cvName: "",
  documentosAdicionales: [] as any[],
  links: [] as any[],
  lat: 19.4326,
  lng: -99.1332,
  mfaEnabled: false,
});

const isFederatedProfile = ref(false);
const isFederatedUser = computed(() => {
  const user = session.value?.user as any;
  return Boolean(
    user?.isFederated ||
    user?.provider === "cognito" ||
    (typeof user?.id === "string" &&
      user.id.toLowerCase().startsWith("google_")) ||
    isFederatedProfile.value,
  );
});

const { hasDraft, discardDraft } = useDraftAutoSave(
  "jobnet_profile_settings_draft",
  formData,
);

onMounted(async () => {
  catalogStore.fetchCatalog();
  if (session.value?.user?.id) {
    try {
      const config = useRuntimeConfig();
      const apiBase =
        config.public.apiBase ||
        "https://olhoy8ebq7.execute-api.us-east-1.amazonaws.com";
      const res = await fetch(`${apiBase}/profile/${session.value.user.id}`);
      if (res.ok) {
        const profile = await res.json();
        formData.value.name =
          profile.nombre || profile.name || session.value.user.name || "";
        formData.value.tituloProfesional =
          profile.tituloProfesional ||
          profile.titularProfesional ||
          profile.titular ||
          profile.puestoDeseado ||
          "";
        formData.value.location =
          profile.location || profile.ubicacionTexto || "";
        formData.value.bio = profile.bio || profile.biografia || "";
        formData.value.fotoPerfil =
          profile.fotoPerfil || profile.avatarUrl || "";
        formData.value.experiencia = profile.experiencia || [];
        formData.value.educacion = profile.educacion || [];
        formData.value.skills = profile.habilidades || profile.skills || [];
        formData.value.sectores =
          profile.sectores || profile.sectoresLaborales || [];
        formData.value.cvUrl = profile.cvUrl || profile.cvPdfUrl || "";
        formData.value.cvName = profile.cvName || "";
        formData.value.documentosAdicionales =
          profile.documentosAdicionales ||
          profile.documentosProfesionales ||
          [];
        formData.value.mfaEnabled = Boolean(
          profile.mfaEnabled || profile.mfaConfigured,
        );
        if (profile.isFederated || profile.origenRegistro === "GOOGLE_OAUTH") {
          isFederatedProfile.value = true;
        }
        if (Array.isArray(profile.links)) {
          formData.value.links = profile.links;
        } else if (
          profile.enlacesWeb &&
          typeof profile.enlacesWeb === "object"
        ) {
          formData.value.links = Object.entries(profile.enlacesWeb).map(
            ([label, url]) => ({ label, url: url as string }),
          );
        } else {
          formData.value.links = [];
        }
        formData.value.lat = profile.lat || 19.4326;
        formData.value.lng = profile.lng || -99.1332;
      }
    } catch (e) {
      console.warn("Failed to load user profile from backend", e);
    }
  }
});

async function saveProfile() {
  isSaving.value = true;

  try {
    const userId = session.value?.user?.id || "anonymous";
    const config = useRuntimeConfig();
    const apiBase =
      config.public.apiBase ||
      "https://olhoy8ebq7.execute-api.us-east-1.amazonaws.com";

    const payload = {
      nombre: formData.value.name,
      tituloProfesional: formData.value.tituloProfesional,
      titularProfesional: formData.value.tituloProfesional,
      titular: formData.value.tituloProfesional,
      location: formData.value.location,
      bio: formData.value.bio,
      biografia: formData.value.bio,
      fotoPerfil: formData.value.fotoPerfil,
      experiencia: formData.value.experiencia,
      educacion: formData.value.educacion,
      habilidades: formData.value.skills,
      sectores: formData.value.sectores,
      sectoresLaborales: formData.value.sectores,
      cvUrl: formData.value.cvUrl,
      cvName: formData.value.cvName,
      documentosAdicionales: formData.value.documentosAdicionales,
      documentosProfesionales: formData.value.documentosAdicionales,
      links: formData.value.links,
      enlacesWeb: formData.value.links.reduce((acc: any, item: any) => {
        if (item.label && item.url) acc[item.label] = item.url;
        return acc;
      }, {}),
      lat: formData.value.lat,
      lng: formData.value.lng,
    };

    const res = await fetch(`${apiBase}/profile/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showFeedback({
        type: "success",
        title: "Perfil Actualizado",
        message:
          "Tus datos personales y profesionales han sido guardados exitosamente.",
        autoCloseTimeout: 3500,
        onClose: () => {
          navigateTo("/profile");
        },
      });

      const { setProfilePic } = useProfileState();
      setProfilePic(formData.value.fotoPerfil);

      // Explicitly clear Nuxt cache for this profile to fetch fresh data on redirect
      clearNuxtData(`candidate-profile-${userId}`);
      clearNuxtData(); // Fallback to clear all payload caches if needed

      discardDraft();
    } else {
      throw new Error("No se pudo guardar la información en el servidor.");
    }
  } catch (err: any) {
    showError(
      "Error al Guardar Perfil",
      err.message || "Error al actualizar perfil.",
      null,
    );
  } finally {
    isSaving.value = false;
  }
}
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
