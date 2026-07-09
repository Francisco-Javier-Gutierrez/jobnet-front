<template>
  <main
    class="w-full max-w-container-max mx-auto md:px-gutter md:py-8 px-margin-mobile pb-16"
  >
    <!-- Profile Header Card -->
    <section
      class="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col items-center text-center"
    >
      <div class="relative mb-4">
        <img
          :alt="candidate.name"
          class="w-32 h-32 rounded-full object-cover shadow-sm"
          :src="candidate.avatar"
        />
        <div
          class="absolute bottom-0 right-0 bg-secondary text-on-secondary w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-white"
        >
          <span class="material-symbols-outlined text-[16px]"
            >check_circle</span
          >
        </div>
      </div>
      <h1
        class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1"
      >
        {{ candidate.name }}
      </h1>
      <p
        class="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mb-3"
      >
        <span class="material-symbols-outlined text-[16px]">location_on</span>
        {{ candidate.location }}
      </p>
      <div
        class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md mb-6 inline-flex items-center gap-1"
      >
        <span class="w-2 h-2 rounded-full bg-secondary"></span>
        {{ candidate.status }}
      </div>
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
          :href="`mailto:${candidate.email}`"
          class="flex-1 bg-primary hover:bg-tertiary-container text-on-primary h-12 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <span class="material-symbols-outlined">mail</span>
          Contactar
        </a>
        <div class="relative flex-1">
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
          <!-- Dropdown Content -->
          <div
            v-if="showDropdown"
            class="absolute top-full left-0 w-full mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-10 py-1"
            id="webLinksDropdown"
          >
            <a
              v-for="link in candidate.webLinks"
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
    </section>

    <!-- About Me Section -->
    <section
      class="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05)]"
    >
      <h2 class="font-headline-sm text-headline-sm text-on-surface mb-3">
        Sobre mí
      </h2>
      <p
        class="font-body-md text-body-md text-on-surface-variant leading-relaxed"
      >
        {{ candidate.bio }}
      </p>
    </section>

    <!-- Documents Carousel -->
    <section>
      <h2 class="font-headline-sm text-headline-sm text-on-surface mb-3 px-1">
        Documentos
      </h2>
      <div
        class="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
      >
        <!-- Document Card -->
        <div
          v-for="doc in candidate.documents"
          :key="doc.name"
          class="snap-start shrink-0 w-64 bg-surface-container-lowest rounded-xl p-4 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05)] flex items-start gap-4 border border-outline-variant border-opacity-30"
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
          <div>
            <h3
              class="font-label-md text-label-md text-on-surface truncate w-36"
            >
              {{ doc.name }}
            </h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant">
              {{ doc.meta }}
            </p>
            <a
              :href="doc.url"
              @click.prevent="selectedDocUrl = doc.url"
              class="text-primary font-label-md text-label-md mt-2 flex items-center gap-1 cursor-pointer"
            >
              Ver
              <span class="material-symbols-outlined text-[16px]"
                >arrow_forward</span
              >
            </a>
          </div>
        </div>
      </div>

      <!-- Document Preview Container -->
      <div
        v-if="selectedDocUrl"
        class="mt-4 bg-surface-container rounded-xl p-4 border border-outline-variant/60 flex flex-col gap-3 relative"
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

    <!-- Skills Section -->
    <section
      class="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05)]"
    >
      <h2 class="font-headline-sm text-headline-sm text-on-surface mb-4">
        Habilidades
      </h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="skill in candidate.skills"
          :key="skill"
          class="bg-[#EEF2FF] text-primary px-3 py-1.5 rounded-full font-label-sm text-label-sm"
        >
          {{ skill }}
        </span>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const candidateId = route.params.id as string;
const { data } = useAuth();
const config = useRuntimeConfig();

const isOwner = computed(() => data.value?.user?.id === route.params.id);
const { data: profileData } = await useAsyncData(
  `candidate-profile-${candidateId}`,
  () =>
    $fetch(`${config.public.apiUrl}/profile/${candidateId}`)
      .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
      .catch(() => null),
);

const showDropdown = ref(false);
const selectedDocUrl = ref("");

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const closeDropdown = () => {
  showDropdown.value = false;
};

onMounted(() => {
  if (process.client) {
    document.addEventListener("click", closeDropdown);
  }
});

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener("click", closeDropdown);
  }
});

const goBack = () => {
  router.back();
};

const candidate = ref({
  id: candidateId,
  name: "Alejandro Silva",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCXAEoSGnRj8H0wGXzUw5MrOgP_IaT7c7ZCUEXpOYd9OK91zyWW1YgZQXFzSpfjHtbFNGZ3TAKFBYgR5F1HG-rX7O6D6vLQXTJ7bLhNRpGQVjG8f1jaZUrl8LjOQOcX4iyo3HLdg8AJzLFxwgEnobskXSayYG2veHbE7qmD6SMJZJWvV9LdIMiNd3AcqXELde8tqc37DqnTJN85k8vdcgqUijvyI8mJ-HEeZ4UDAyFCsQHyRbcpkbYWIQ",
  location: "Madrid, Spain",
  status: "Actively Looking",
  email: "alejandro.silva@example.com",
  bio: "Diseñador de Producto Digital con más de 5 años de experiencia creando experiencias centradas en el usuario. Apasionado por la accesibilidad, los sistemas de diseño y la resolución de problemas complejos mediante interfaces intuitivas.",
  webLinks: [
    {
      name: "Portfolio",
      url: "https://portfolio.alejandrosilva.com",
      icon: "language",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/alejandrosilva",
      icon: "link",
    },
  ],
  documents: [
    {
      name: "CV Formal.pdf",
      meta: "Última act: Hace 2 días",
      type: "pdf",
      url: "#",
    },
    {
      name: "Portfolio Visual.pdf",
      meta: "24 MB",
      type: "image",
      url: "#",
    },
  ],
  skills: [
    "Figma",
    "Design Systems",
    "UX Research",
    "Prototyping",
    "HTML/CSS",
    "Wireframing",
  ],
});

// If profile exists in DynamoDB, apply real details
if (profileData.value) {
  const p = profileData.value as any;
  candidate.value.name = p.nombre || p.name || "Sin Nombre";
  candidate.value.email = p.email || "";
  candidate.value.avatar =
    p.fotoPerfil ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCXAEoSGnRj8H0wGXzUw5MrOgP_IaT7c7ZCUEXpOYd9OK91zyWW1YgZQXFzSpfjHtbFNGZ3TAKFBYgR5F1HG-rX7O6D6vLQXTJ7bLhNRpGQVjG8f1jaZUrl8LjOQOcX4iyo3HLdg8AJzLFxwgEnobskXSayYG2veHbE7qmD6SMJZJWvV9LdIMiNd3AcqXELde8tqc37DqnTJN85k8vdcgqUijvyI8mJ-HEeZ4UDAyFCsQHyRbcpkbYWIQ";
  candidate.value.bio = p.biografia || "Sin biografía profesional.";
  candidate.value.location =
    typeof p.ubicacion === "string"
      ? p.ubicacion
      : p.ubicacion?.city || p.ubicacion?.pais || "Ubicación no especificada";
  candidate.value.status = p.estadoBusqueda || "En búsqueda activa";
  candidate.value.skills = p.habilidades || [];
  candidate.value.webLinks = p.enlacesWeb
    ? Object.entries(p.enlacesWeb).map(([name, url]) => ({
        name,
        url: url as string,
        icon: name.toLowerCase() === "portfolio" ? "language" : "link",
      }))
    : [];
  candidate.value.documents = p.documentosProfesionales
    ? Object.entries(p.documentosProfesionales).map(
        ([name, doc]: [string, any]) => ({
          name,
          meta: doc.meta || "Archivo adjunto",
          type: doc.type || "pdf",
          url: doc.url || "#",
        }),
      )
    : [];
}

useSeoMeta({
  title: `${candidate.value.name} - Perfil`,
  description: `Perfil público del candidato ${candidate.value.name} en JobNet`,
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
