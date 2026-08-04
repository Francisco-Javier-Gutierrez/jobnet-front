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
        <span v-if="isSaving" class="animate-spin text-xs">⌛</span>
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

    <!-- Main Form Components Stack -->
    <div class="flex flex-col gap-6">
      <SettingsPersonalInfo
        v-model:name="formData.name"
        v-model:bio="formData.bio"
        v-model:fotoPerfil="formData.fotoPerfil"
      />

      <SettingsExperienceList v-model:experiencia="formData.experiencia" />

      <SettingsEducationList v-model:educacion="formData.educacion" />

      <SettingsSkillsSection
        v-model:skills="formData.skills"
        :catalogSkills="catalogStore.skills"
      />

      <SettingsSectorsSection
        v-model:sectors="formData.sectores"
        :catalogSectors="catalogStore.sectors"
      />

      <SettingsCvUploader
        v-model:cvUrl="formData.cvUrl"
        v-model:cvName="formData.cvName"
      />

      <SettingsAdditionalDocs
        v-model:documentosAdicionales="formData.documentosAdicionales"
      />

      <SettingsWebLinks v-model:links="formData.links" />

      <SettingsLocationMap
        v-model:lat="formData.lat"
        v-model:lng="formData.lng"
        @locationName="(name) => (formData.location = name)"
      />
    </div>

    <!-- Bottom Save Action -->
    <div class="mt-8 flex justify-end">
      <button
        type="button"
        @click="saveProfile"
        :disabled="isSaving"
        class="bg-primary hover:bg-primary-container text-white font-bold text-xs px-8 py-3.5 rounded-2xl transition flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
      >
        <span v-if="isSaving" class="animate-spin text-xs">⌛</span>
        <span v-else class="material-symbols-outlined text-sm">save</span>
        <span>{{
          isSaving ? "Guardando Perfil..." : "Guardar Cambios del Perfil"
        }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAppFeedback } from "~/composables/useAppFeedback";
import { useCatalogStore } from "~/stores/catalog";

definePageMeta({
  middleware: "auth",
});

const { status, data: session } = useAuth();
const isSaving = ref(false);

const { showSuccess, showError } = useAppFeedback();
const catalogStore = useCatalogStore();

const formData = ref({
  name: "",
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
      location: formData.value.location,
      bio: formData.value.bio,
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
      showSuccess(
        "Perfil Actualizado",
        "Tus datos personales y profesionales han sido guardados exitosamente.",
        3500,
      );
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
