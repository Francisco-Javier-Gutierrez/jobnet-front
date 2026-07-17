<template>
  <!-- Loading State -->
  <main
    v-if="loading"
    class="w-full max-w-container-max mx-auto md:px-gutter md:py-8 px-margin-mobile pb-16 space-y-6 animate-pulse"
  >
    <!-- Header Card Skeleton -->
    <div
      class="bg-surface-container-lowest rounded-xl border border-outline-variant/60 overflow-hidden shadow-sm"
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
      class="bg-surface-container-lowest rounded-xl border border-outline-variant/60 p-6 space-y-4"
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
      class="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] p-lg md:p-xl text-center max-w-md"
    >
      <span class="material-symbols-outlined text-error text-5xl mb-4"
        >error_outline</span
      >
      <h2 class="font-headline-md text-headline-md text-on-surface mb-2">
        No se pudo cargar el perfil
      </h2>
      <p class="font-body-md text-body-md text-on-surface-variant mb-6">
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
    <!-- Header Card -->
    <section
      class="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] overflow-hidden"
    >
      <!-- Decorative top color bar -->
      <div class="bg-primary h-2 w-full"></div>

      <div class="p-lg md:p-xl flex flex-col items-center text-center">
        <!-- Profile Picture -->
        <div class="relative mb-4">
          <img
            :alt="profile.nombre"
            class="w-32 h-32 rounded-full object-cover shadow-sm border-4 border-surface-container-lowest"
            :src="profile.fotoPerfil || defaultAvatar"
          />
        </div>

        <!-- Name -->
        <h1 class="font-headline-lg text-headline-lg text-on-surface mb-1">
          {{ profile.nombre || "Sin Nombre" }}
        </h1>

        <!-- Location -->
        <p
          v-if="locationText"
          class="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mb-3"
        >
          <span class="material-symbols-outlined text-[16px]">location_on</span>
          {{ locationText }}
        </p>

        <!-- Status Badge -->
        <div
          class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md mb-6 inline-flex items-center gap-1"
        >
          <span class="w-2 h-2 rounded-full bg-secondary"></span>
          {{ profile.estadoBusqueda || "En búsqueda activa" }}
        </div>

        <!-- Action Buttons -->
        <div class="w-full flex gap-3 max-w-sm mb-2">
          <NuxtLink
            v-if="isOwner"
            to="/settings"
            class="flex-1 bg-primary hover:bg-tertiary-container text-on-primary h-12 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <span class="material-symbols-outlined">edit</span>
            Editar Perfil
          </NuxtLink>
          <a
            v-else
            :href="`mailto:${profile.email}`"
            class="flex-1 bg-primary hover:bg-tertiary-container text-on-primary h-12 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <span class="material-symbols-outlined">mail</span>
            Contactar
          </a>

          <!-- Enlaces Web Dropdown -->
          <div v-if="webLinks.length > 0" class="relative flex-1">
            <button
              @click.stop="toggleDropdown"
              class="w-full bg-surface-container-low text-on-surface h-12 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 transition-transform active:scale-95 border border-outline-variant"
              id="webLinksBtn"
            >
              Enlaces Web
              <span
                class="material-symbols-outlined text-[20px] transition-transform duration-200"
                :class="{ 'rotate-180': showDropdown }"
                >expand_more</span
              >
            </button>
            <div
              v-if="showDropdown"
              class="absolute top-full left-0 w-full mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-10 py-1"
              id="webLinksDropdown"
            >
              <a
                v-for="link in webLinks"
                :key="link.name"
                class="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors font-body-sm text-body-sm text-on-surface"
                :href="link.url"
                target="_blank"
                rel="noopener"
              >
                <span class="material-symbols-outlined text-outline">{{
                  link.icon
                }}</span>
                {{ link.name }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Documents Horizontal Scroll -->
    <section v-if="documents.length > 0">
      <h2
        class="font-headline-md text-headline-md text-on-background mb-md flex items-center gap-sm px-1"
      >
        <span class="material-symbols-outlined">description</span>
        Documentos
      </h2>
      <div
        class="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
      >
        <div
          v-for="doc in documents"
          :key="doc.name"
          class="snap-start shrink-0 w-64 bg-surface-container-low border border-surface-container hover:border-primary-container p-md rounded-lg flex items-start gap-md transition-all group shadow-sm hover:shadow-md"
        >
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
            :class="
              doc.type === 'pdf'
                ? 'bg-error-container text-on-error-container'
                : 'bg-surface-container-high text-primary'
            "
          >
            <span class="material-symbols-outlined">{{
              doc.type === "pdf" ? "picture_as_pdf" : "image"
            }}</span>
          </div>
          <div class="flex-grow min-w-0">
            <h3
              class="font-label-md text-label-md text-on-surface truncate w-36 group-hover:text-primary transition-colors"
            >
              {{ doc.name }}
            </h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant mb-2">
              {{ doc.meta }}
            </p>
            <div class="flex gap-3">
              <button
                @click="selectedDocUrl = doc.url"
                class="text-primary hover:underline font-label-sm text-label-sm flex items-center gap-0.5 cursor-pointer"
              >
                <span class="material-symbols-outlined text-[16px]"
                  >visibility</span
                >
                Ver
              </button>
              <a
                :href="doc.url"
                download
                target="_blank"
                class="text-secondary hover:underline font-label-sm text-label-sm flex items-center gap-0.5"
              >
                <span class="material-symbols-outlined text-[16px]"
                  >download</span
                >
                Descargar
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Document Preview Container -->
      <div
        v-if="selectedDocUrl"
        class="mt-4 bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60 flex flex-col gap-3 relative shadow-sm"
      >
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-on-background truncate">
            Vista Previa de Documento
          </h4>
          <button
            @click="selectedDocUrl = ''"
            class="text-on-surface-variant hover:text-error transition flex items-center gap-1 font-semibold text-xs"
            aria-label="Cerrar vista previa"
          >
            <span class="material-symbols-outlined text-sm">close</span>
            Cerrar
          </button>
        </div>
        <div
          class="w-full border border-outline-variant/30 rounded-lg overflow-hidden aspect-[4/3] bg-surface"
        >
          <iframe
            :src="`https://docs.google.com/viewer?url=${encodeURIComponent(selectedDocUrl)}&embedded=true`"
            class="w-full h-full border-none"
            title="Visor de Documento de Candidato"
          ></iframe>
        </div>
      </div>
    </section>

    <!-- Body Card -->
    <section
      class="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] p-lg md:p-xl space-y-8"
    >
      <!-- Sobre mí -->
      <div>
        <h2
          class="font-headline-md text-headline-md text-on-background mb-md flex items-center gap-sm border-b border-surface-container pb-sm"
        >
          <span class="material-symbols-outlined">person</span>
          Sobre mí
        </h2>
        <p
          v-if="profile.biografia"
          class="font-body-md text-body-md text-on-surface-variant leading-relaxed"
        >
          {{ profile.biografia }}
        </p>
        <p
          v-else
          class="font-body-md text-body-md text-on-surface-variant italic"
        >
          Este candidato aún no ha agregado una biografía.
        </p>
      </div>

      <!-- Habilidades -->
      <div>
        <h2
          class="font-headline-md text-headline-md text-on-background mb-md flex items-center gap-sm border-b border-surface-container pb-sm"
        >
          <span class="material-symbols-outlined">build</span>
          Habilidades
        </h2>
        <div v-if="skills.length > 0" class="flex flex-wrap gap-2">
          <span
            v-for="skill in skills"
            :key="skill"
            class="bg-surface-container text-primary font-label-md text-label-md px-4 py-2 rounded-full border border-surface-container-high hover:bg-primary-container hover:text-on-primary-container transition-colors"
          >
            {{ skill }}
          </span>
        </div>
        <p
          v-else
          class="font-body-md text-body-md text-on-surface-variant italic"
        >
          No se han agregado habilidades aún.
        </p>
      </div>

      <!-- Sectores -->
      <div v-if="sectors.length > 0">
        <h2
          class="font-headline-md text-headline-md text-on-background mb-md flex items-center gap-sm border-b border-surface-container pb-sm"
        >
          <span class="material-symbols-outlined">business_center</span>
          Sectores de Interés
        </h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="sector in sectors"
            :key="sector"
            class="bg-surface-container text-secondary font-label-md text-label-md px-4 py-2 rounded-full border border-surface-container-high hover:bg-secondary-container hover:text-on-secondary-container transition-colors"
          >
            {{ sector }}
          </span>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const candidateId = route.params.id as string;
const { data: authData } = useAuth();
const config = useRuntimeConfig();

const defaultAvatar =
  "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=128";

// --- State ---
const loading = ref(true);
const error = ref(false);
const errorMessage = ref("");
const profile = ref<Record<string, any>>({});
const showDropdown = ref(false);
const selectedDocUrl = ref("");

// --- Ownership Check ---
const isOwner = computed(() => {
  const user = authData.value?.user as any;
  if (!user) return false;
  return user.id === candidateId || user.email === candidateId;
});

// --- Computed from profile data ---
const locationText = computed(() => {
  const loc = profile.value.ubicacion;
  if (!loc) return "";
  if (typeof loc === "string") return loc;
  return [loc.city, loc.pais].filter(Boolean).join(", ") || "";
});

const skills = computed<string[]>(() => {
  return profile.value.habilidades || [];
});

const sectors = computed<string[]>(() => {
  return profile.value.sectores || [];
});

const webLinks = computed(() => {
  const links = profile.value.enlacesWeb;
  if (!links || typeof links !== "object") return [];
  return Object.entries(links).map(([name, url]) => ({
    name,
    url: url as string,
    icon: getWebLinkIcon(name),
  }));
});

const documents = computed(() => {
  const docs: Array<{ name: string; meta: string; type: string; url: string }> =
    [];

  // Include CV if available
  if (profile.value.cvUrl) {
    docs.push({
      name: "Curriculum Vitae",
      meta: "PDF",
      type: "pdf",
      url: profile.value.cvUrl,
    });
  }

  // Include other professional documents
  if (
    profile.value.documentosProfesionales &&
    typeof profile.value.documentosProfesionales === "object"
  ) {
    for (const [name, doc] of Object.entries(
      profile.value.documentosProfesionales,
    )) {
      const d = doc as any;
      docs.push({
        name,
        meta: d.meta || "Archivo adjunto",
        type: d.type || "pdf",
        url: d.url || "#",
      });
    }
  }

  return docs;
});

// --- Helpers ---
function getWebLinkIcon(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("github")) return "code";
  if (lower.includes("portfolio")) return "language";
  if (lower.includes("linkedin")) return "link";
  return "link";
}

// --- Fetch Profile ---
async function fetchProfile() {
  loading.value = true;
  error.value = false;
  errorMessage.value = "";

  try {
    const res = await $fetch<any>(
      `${config.public.apiUrl}/profile/${candidateId}`,
    );
    const data = typeof res === "string" ? JSON.parse(res) : res;

    if (!data) {
      throw new Error("Perfil no encontrado");
    }

    profile.value = data;
  } catch (e: any) {
    error.value = true;
    errorMessage.value =
      e?.data?.message ||
      e?.message ||
      "Ocurrió un error al cargar el perfil. Por favor, inténtalo de nuevo.";
  } finally {
    loading.value = false;
  }
}

async function refreshProfile() {
  await fetchProfile();
}

// --- Dropdown ---
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const closeDropdown = () => {
  showDropdown.value = false;
};

onMounted(() => {
  if (import.meta.client) {
    document.addEventListener("click", closeDropdown);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener("click", closeDropdown);
  }
});

// --- Init ---
fetchProfile();

// --- SEO ---
useSeoMeta({
  title: `${profile.value.nombre || "Candidato"} - Perfil`,
  description: `Perfil público del candidato ${profile.value.nombre || ""} en JobNet`,
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
