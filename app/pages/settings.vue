<template>
  <div class="max-w-2xl mx-auto px-4 py-8 w-full bg-background min-h-screen">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-on-background mb-2">
        Configuración de Cuenta
      </h1>
      <p class="text-on-surface-variant text-sm">
        Gestiona tus datos personales, preferencias de búsqueda y documentos
        profesionales.
      </p>
    </div>

    <!-- Feedback messages -->
    <div
      v-if="successMessage"
      class="mb-4 bg-secondary/10 border border-secondary/20 text-secondary p-4 rounded-xl flex items-center gap-2 text-sm font-semibold"
    >
      <span class="material-symbols-outlined text-lg">check_circle</span>
      {{ successMessage }}
    </div>

    <!-- Draft Restore Notification Banner -->
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

    <div class="flex flex-col gap-6">
      <!-- Section 1: Información Personal -->
      <div
        class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
      >
        <h2
          class="text-base font-bold text-on-background mb-2 flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-primary">person</span>
          Información Personal
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-on-surface-variant" for="name"
              >Nombre Completo</label
            >
            <input
              v-model="name"
              id="name"
              type="text"
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label
              class="text-xs font-bold text-on-surface-variant"
              for="location"
              >Ubicación</label
            >
            <input
              v-model="location"
              id="location"
              type="text"
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
              placeholder="Ej: Madrid, España"
            />
          </div>
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-on-surface-variant" for="bio"
            >Biografía Profesional</label
          >
          <textarea
            v-model="bio"
            id="bio"
            rows="3"
            class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition resize-none"
          ></textarea>
        </div>

        <!-- Ubicación Geográfica (Leaflet Map) -->
        <div class="flex flex-col gap-2 mt-2">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-on-surface-variant"
              >Geolocalización en Mapa</label
            >
            <button
              type="button"
              @click="useCurrentLocation"
              class="text-xs font-bold text-primary hover:underline flex items-center gap-1 transition"
            >
              <span class="material-symbols-outlined text-sm">my_location</span>
              Usar ubicación actual
            </button>
          </div>
          <p class="text-[11px] text-on-surface-variant leading-relaxed">
            Haz clic en el mapa o arrastra el marcador para definir tus
            coordenadas. Esto rellenará automáticamente el campo de ubicación
            con tu ciudad y país correspondientes.
          </p>
          <div
            id="candidate-leaflet-map"
            class="w-full h-48 rounded-xl border border-outline-variant/60 overflow-hidden bg-surface-container-low shadow-sm z-10"
          ></div>
        </div>
      </div>

      <!-- Section 2: Documentos -->
      <div
        class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
      >
        <h2
          class="text-base font-bold text-on-background mb-2 flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-secondary"
            >description</span
          >
          Documentos de Postulación
        </h2>
        <p class="text-xs text-on-surface-variant leading-relaxed">
          Sube tu Currículum Vitae oficial (PDF) para enviarlo al postularte a
          las vacantes.
        </p>

        <!-- Current CV display -->
        <div
          v-if="cvUrl"
          class="flex items-center gap-3 bg-secondary/5 border border-secondary/20 rounded-xl px-4 py-3"
        >
          <span class="material-symbols-outlined text-secondary text-xl"
            >picture_as_pdf</span
          >
          <div class="flex-grow min-w-0">
            <p class="text-sm font-semibold text-on-background truncate">
              {{ cvFileName || "CV Adjunto" }}
            </p>
            <p class="text-xs text-on-surface-variant">Archivo cargado</p>
          </div>
          <a
            :href="cvUrl"
            target="_blank"
            rel="noopener"
            class="text-primary text-xs font-bold hover:underline flex-shrink-0"
            >Ver</a
          >
        </div>

        <!-- Upload area -->
        <div
          @click="$refs.cvFileInput.click()"
          @dragover.prevent="cvDragOver = true"
          @dragleave.prevent="cvDragOver = false"
          @drop.prevent="handleCvDrop"
          :class="[
            cvDragOver
              ? 'border-primary bg-primary/5'
              : 'border-outline-variant bg-surface-container-low/40',
          ]"
          class="border-2 border-dashed hover:border-primary rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition"
        >
          <span
            v-if="!uploadStore.uploading"
            class="material-symbols-outlined text-on-surface-variant text-3xl mb-2"
            >upload_file</span
          >
          <div
            v-if="uploadStore.uploading"
            class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"
          ></div>
          <span class="text-sm font-semibold text-on-surface">{{
            uploadStore.uploading
              ? uploadStore.uploadProgress
              : "Seleccionar o arrastrar archivo PDF"
          }}</span>
          <span class="text-xs text-on-surface-variant/80 mt-1"
            >Límite de tamaño: 5MB</span
          >
          <input
            type="file"
            ref="cvFileInput"
            @change="handleCvSelect"
            accept="application/pdf"
            class="hidden"
          />
        </div>
        <p v-if="cvError" class="text-xs text-rose-600 font-semibold">
          {{ cvError }}
        </p>
      </div>

      <!-- Section 3: Habilidades -->
      <div
        class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
      >
        <h2
          class="text-base font-bold text-on-background mb-2 flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-tertiary"
            >local_offer</span
          >
          Habilidades Técnicas
        </h2>

        <!-- Selected Skill Tags -->
        <div class="flex flex-wrap gap-2 mb-2">
          <span
            v-for="skill in skills"
            :key="skill"
            class="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs flex items-center gap-1.5 font-bold"
          >
            {{ skill }}
            <button
              type="button"
              @click="removeSkill(skill)"
              class="hover:text-rose-600 transition flex items-center"
            >
              <span class="material-symbols-outlined text-xs">close</span>
            </button>
          </span>
          <span
            v-if="skills.length === 0"
            class="text-xs text-on-surface-variant italic"
          >
            Ninguna habilidad seleccionada. Selecciona del catálogo abajo.
          </span>
        </div>

        <!-- Catalog autocomplete input box -->
        <div
          class="space-y-3 bg-surface-container-low/40 p-4 border border-outline-variant/50 rounded-xl"
        >
          <div class="flex gap-2">
            <div class="relative flex-grow">
              <span
                class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm"
                >search</span
              >
              <input
                v-model="skillSearchQuery"
                type="text"
                placeholder="Buscar habilidades en el catálogo..."
                class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl pl-9 pr-4 py-2 text-xs text-on-background outline-none transition"
              />
            </div>

            <!-- Quick Add Option for non-existing skills -->
            <button
              type="button"
              @click="handleQuickAddSkill"
              :disabled="!skillSearchQuery.trim()"
              class="bg-surface border border-outline-variant hover:border-primary hover:bg-primary/5 text-primary text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50"
            >
              Crear y Agregar
            </button>
          </div>

          <div
            v-if="
              skillSearchQuery.trim() &&
              !filteredCatalogSkills.some(
                (s) =>
                  s.name.toLowerCase() ===
                  skillSearchQuery.toLowerCase().trim(),
              )
            "
            class="text-[10px] text-amber-600 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg flex items-start gap-1.5 leading-relaxed"
          >
            <span class="material-symbols-outlined text-xs mt-0.5"
              >warning</span
            >
            <span>
              Esta habilidad no se encuentra en el catálogo y será enviada al
              equipo de moderación para su aprobación. Se asociará temporalmente
              a tu perfil; por favor, valida la ortografía antes de crearla.
            </span>
          </div>

          <!-- Suggested Master Catalog Skills -->
          <div class="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            <button
              v-for="masterSkill in filteredCatalogSkills"
              :key="masterSkill.id"
              type="button"
              @click="selectCatalogSkill(masterSkill.name)"
              class="bg-surface hover:bg-surface-container-high border border-outline-variant/50 hover:border-primary text-on-surface hover:text-primary transition px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-[10px]">add</span>
              {{ masterSkill.name }}
            </button>
            <span
              v-if="filteredCatalogSkills.length === 0"
              class="text-[11px] text-on-surface-variant italic py-1"
            >
              No se encontraron habilidades adicionales. Escribe para crear una
              nueva.
            </span>
          </div>
        </div>
      </div>

      <!-- Section: Sectores de Interés -->
      <div
        class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
      >
        <h2
          class="text-base font-bold text-on-background mb-2 flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-primary"
            >business_center</span
          >
          Sectores de Interés
        </h2>
        <p class="text-xs text-on-surface-variant leading-relaxed">
          Indica los sectores de industria a los que perteneces o te interesa
          postularte.
        </p>

        <!-- Selected Sector Tags -->
        <div class="flex flex-wrap gap-2 mb-2">
          <span
            v-for="sector in sectors"
            :key="sector"
            class="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs flex items-center gap-1.5 font-bold"
          >
            {{ sector }}
            <button
              type="button"
              @click="removeSector(sector)"
              class="hover:text-rose-600 transition flex items-center"
            >
              <span class="material-symbols-outlined text-xs">close</span>
            </button>
          </span>
          <span
            v-if="sectors.length === 0"
            class="text-xs text-on-surface-variant italic"
          >
            Ningún sector seleccionado aún. Selecciona del catálogo abajo.
          </span>
        </div>

        <!-- Catalog autocomplete input box -->
        <div
          class="space-y-3 bg-surface-container-low/40 p-4 border border-outline-variant/50 rounded-xl"
        >
          <div class="flex gap-2">
            <div class="relative flex-grow">
              <span
                class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm"
                >search</span
              >
              <input
                v-model="sectorSearchQuery"
                type="text"
                placeholder="Buscar sectores en el catálogo..."
                class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl pl-9 pr-4 py-2 text-xs text-on-background outline-none transition"
              />
            </div>

            <button
              type="button"
              @click="handleQuickAddSector"
              :disabled="!sectorSearchQuery.trim()"
              class="bg-surface border border-outline-variant hover:border-primary hover:bg-primary/5 text-primary text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50"
            >
              Crear y Agregar
            </button>
          </div>

          <div
            v-if="
              sectorSearchQuery.trim() &&
              !filteredCatalogSectors.some(
                (s) =>
                  s.name.toLowerCase() ===
                  sectorSearchQuery.toLowerCase().trim(),
              )
            "
            class="text-[10px] text-amber-600 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg flex items-start gap-1.5 leading-relaxed"
          >
            <span class="material-symbols-outlined text-xs mt-0.5"
              >warning</span
            >
            <span>
              Este sector no se encuentra en el catálogo y será enviado al
              equipo de moderación para su aprobación. Se asociará temporalmente
              a tu perfil; por favor, valida la ortografía antes de crearlo.
            </span>
          </div>

          <!-- Suggested Master Catalog Sectors -->
          <div class="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            <button
              v-for="masterSector in filteredCatalogSectors"
              :key="masterSector.id"
              type="button"
              @click="selectCatalogSector(masterSector.name)"
              class="bg-surface hover:bg-surface-container-high border border-outline-variant/50 hover:border-primary text-on-surface hover:text-primary transition px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-[10px]">add</span>
              {{ masterSector.name }}
            </button>
            <span
              v-if="filteredCatalogSectors.length === 0"
              class="text-[11px] text-on-surface-variant italic py-1"
            >
              No se encontraron sectores adicionales. Escribe para crear uno
              nuevo.
            </span>
          </div>
        </div>
      </div>

      <!-- Section 4: Seguridad -->
      <div
        class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
      >
        <h2
          class="text-base font-bold text-on-background mb-2 flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-rose-500">security</span>
          Seguridad y Acceso
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NuxtLink
            to="/reset-password"
            class="p-4 border border-outline-variant/60 hover:border-primary rounded-xl hover:bg-primary/5 transition flex items-center justify-between group"
          >
            <span
              class="text-xs font-bold text-on-surface-variant group-hover:text-primary transition"
              >Cambiar Contraseña</span
            >
            <span
              class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition text-sm"
              >chevron_right</span
            >
          </NuxtLink>
          <NuxtLink
            to="/mfa"
            class="p-4 border border-outline-variant/60 hover:border-primary rounded-xl hover:bg-primary/5 transition flex items-center justify-between group"
          >
            <span
              class="text-xs font-bold text-on-surface-variant group-hover:text-primary transition"
              >Configurar MFA</span
            >
            <span
              class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition text-sm"
              >chevron_right</span
            >
          </NuxtLink>
        </div>
      </div>

      <!-- Save Action -->
      <button
        @click="saveSettings"
        :disabled="saving"
        class="bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-semibold text-sm h-12 rounded-xl transition shadow-md shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 duration-100"
      >
        <span class="material-symbols-outlined text-lg">{{
          saving ? "sync" : "save"
        }}</span>
        {{ saving ? "Guardando..." : "Guardar Configuración" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useUploadStore } from "../stores/upload";
import { useCatalogStore } from "../stores/catalog";

// Load Leaflet stylesheet in the head
useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
      crossorigin: "",
    },
  ],
});

useSeoMeta({
  title: "Ajustes de Perfil - JobNet",
  description:
    "Configura tu cuenta y datos de postulación como candidato en JobNet",
});

const router = useRouter();
const config = useRuntimeConfig();
const { data: session, status } = useAuth();
const uploadStore = useUploadStore();
const catalogStore = useCatalogStore();

const name = ref("");
const location = ref("");
const bio = ref("");
const skills = ref<string[]>([]);
const sectors = ref<string[]>([]);
const saving = ref(false);
const successMessage = ref("");

// Leaflet Map State
const lat = ref(19.432608); // CDMX Default
const lng = ref(-99.133209);
let map: any = null;
let marker: any = null;

// Catalog search state
const skillSearchQuery = ref("");
const sectorSearchQuery = ref("");

// CV upload state
const cvUrl = ref("");
const cvFileName = ref("");
const cvDragOver = ref(false);
const cvError = ref("");

// Draft State
const hasDraft = ref(false);
let isRestoring = false;

const saveDraft = () => {
  if (process.client && !isRestoring) {
    if (
      name.value ||
      bio.value ||
      location.value ||
      skills.value.length > 0 ||
      sectors.value.length > 0
    ) {
      localStorage.setItem(
        "jobnet_draft_settings",
        JSON.stringify({
          name: name.value,
          location: location.value,
          bio: bio.value,
          skills: skills.value,
          sectors: sectors.value,
          cvUrl: cvUrl.value,
          cvFileName: cvFileName.value,
          lat: lat.value,
          lng: lng.value,
        }),
      );
    }
  }
};

const loadDraft = () => {
  if (process.client) {
    const saved = localStorage.getItem("jobnet_draft_settings");
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (
          draft.name ||
          draft.bio ||
          draft.location ||
          draft.skills?.length > 0 ||
          draft.sectors?.length > 0
        ) {
          isRestoring = true;
          name.value = draft.name || "";
          location.value = draft.location || "";
          bio.value = draft.bio || "";
          skills.value = draft.skills || [];
          sectors.value = draft.sectors || [];
          cvUrl.value = draft.cvUrl || "";
          cvFileName.value = draft.cvFileName || "";
          lat.value = draft.lat || 19.432608;
          lng.value = draft.lng || -99.133209;
          hasDraft.value = true;
          isRestoring = false;
          if (map && marker) {
            map.setView([lat.value, lng.value], 11);
            marker.setLatLng([lat.value, lng.value]);
          }
        }
      } catch (e) {
        console.error("Error loading settings draft:", e);
      }
    }
  }
};

const discardDraft = () => {
  if (process.client) {
    localStorage.removeItem("jobnet_draft_settings");
    hasDraft.value = false;
    // reload profile from db
    fetchProfile();
  }
};

// Auto-save watch
watch(
  [name, location, bio, skills, sectors, cvUrl, cvFileName, lat, lng],
  () => {
    saveDraft();
  },
  { deep: true },
);

// Computed filtered catalog skills
const filteredCatalogSkills = computed(() => {
  const query = skillSearchQuery.value.toLowerCase().trim();
  return catalogStore.skills.filter((skill) => {
    const matchesQuery = skill.name.toLowerCase().includes(query);
    const notSelectedYet = !skills.value.some(
      (s) => s.toLowerCase() === skill.name.toLowerCase(),
    );
    return matchesQuery && notSelectedYet;
  });
});

// Computed filtered catalog sectors
const filteredCatalogSectors = computed(() => {
  const query = sectorSearchQuery.value.toLowerCase().trim();
  return catalogStore.sectors.filter((sector) => {
    const matchesQuery = sector.name.toLowerCase().includes(query);
    const notSelectedYet = !sectors.value.some(
      (s) => s.toLowerCase() === sector.name.toLowerCase(),
    );
    return matchesQuery && notSelectedYet;
  });
});

const fetchProfile = async () => {
  if (status.value !== "authenticated" || !session.value?.user?.id) {
    router.push("/login");
    return;
  }

  try {
    const data = await $fetch<any>(
      `${config.public.apiUrl}/profile/${session.value.user.id}`,
    );
    if (data) {
      name.value = data.nombre || "";
      bio.value = data.biografia || "";

      // Load location coordinates/info
      if (data.ubicacion && typeof data.ubicacion === "object") {
        lat.value = data.ubicacion.lat || 19.432608;
        lng.value = data.ubicacion.lng || -99.133209;
        location.value =
          data.ubicacion.formatted ||
          [data.ubicacion.city, data.ubicacion.pais]
            .filter(Boolean)
            .join(", ") ||
          "";
      } else {
        location.value = data.ubicacion || "";
      }

      skills.value = data.habilidades || [];
      sectors.value = data.sectores || [];
      cvUrl.value = data.cvUrl || "";
      cvFileName.value = data.cvFileName || "";

      // Move map and marker to loaded position if initialized
      if (map && marker) {
        map.setView([lat.value, lng.value], 11);
        marker.setLatLng([lat.value, lng.value]);
      }
    }
  } catch (e) {
    console.error("Error loading candidate profile for settings:", e);
  }
};

// Function to perform reverse geocoding using OSM Nominatim
const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const response = await $fetch<any>(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
    );
    if (response && response.address) {
      const addr = response.address;
      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.suburb ||
        addr.county ||
        "";
      const country = addr.country || "";
      if (city && country) {
        location.value = `${city}, ${country}`;
      } else if (response.display_name) {
        const parts = response.display_name.split(",");
        const cleanParts = parts.slice(0, 2).map((p: string) => p.trim());
        location.value = cleanParts.join(", ");
      }
    }
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
  }
};

const useCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        lat.value = Number(position.coords.latitude.toFixed(6));
        lng.value = Number(position.coords.longitude.toFixed(6));
        if (map && marker) {
          map.setView([lat.value, lng.value], 13);
          marker.setLatLng([lat.value, lng.value]);
        }
        await reverseGeocode(lat.value, lng.value);
      },
      (error) => {
        console.error("Error detecting current location:", error);
      },
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};

onMounted(async () => {
  await fetchProfile();
  await catalogStore.fetchCatalog();
  loadDraft();

  // Initialize Leaflet map on client side
  if (import.meta.client) {
    const L = await import("leaflet");

    map = L.map("candidate-leaflet-map", { attributionControl: false }).setView(
      [lat.value, lng.value],
      11,
    );

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: "",
      },
    ).addTo(map);

    marker = L.marker([lat.value, lng.value], {
      draggable: true,
    }).addTo(map);

    // Sync coordinates when dragging
    marker.on("dragend", async () => {
      const position = marker.getLatLng();
      lat.value = Number(position.lat.toFixed(6));
      lng.value = Number(position.lng.toFixed(6));
      await reverseGeocode(lat.value, lng.value);
    });

    // Move marker when clicking on the map
    map.on("click", async (e: any) => {
      marker.setLatLng(e.latlng);
      lat.value = Number(e.latlng.lat.toFixed(6));
      lng.value = Number(e.latlng.lng.toFixed(6));
      await reverseGeocode(lat.value, lng.value);
    });
  }
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});

const selectCatalogSkill = (skillName: string) => {
  if (!skills.value.some((s) => s.toLowerCase() === skillName.toLowerCase())) {
    skills.value.push(skillName);
  }
  skillSearchQuery.value = "";
};

const removeSkill = (skillName: string) => {
  skills.value = skills.value.filter((s) => s !== skillName);
};

const handleQuickAddSkill = async () => {
  const queryName = skillSearchQuery.value.trim();
  if (!queryName) return;

  // 1. Suggest skill to the global master catalog (moderator queue)
  await catalogStore.suggestSkill(queryName);

  // 2. Add locally to active candidate profile skills
  selectCatalogSkill(queryName);
  skillSearchQuery.value = "";
};

// Sectores selection actions
const selectCatalogSector = (sectorName: string) => {
  if (
    !sectors.value.some((s) => s.toLowerCase() === sectorName.toLowerCase())
  ) {
    sectors.value.push(sectorName);
  }
  sectorSearchQuery.value = "";
};

const removeSector = (sectorName: string) => {
  sectors.value = sectors.value.filter((s) => s !== sectorName);
};

const handleQuickAddSector = async () => {
  const queryName = sectorSearchQuery.value.trim();
  if (!queryName) return;

  await catalogStore.addItem(queryName, "Sector");
  selectCatalogSector(queryName);
  sectorSearchQuery.value = "";
};

// CV upload handlers
const processCvFile = async (file: File) => {
  cvError.value = "";

  if (file.type !== "application/pdf") {
    cvError.value = "Solo se permiten archivos PDF.";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    cvError.value = "El archivo supera el límite de 5MB.";
    return;
  }

  const userId = session.value?.user?.id || "anonymous";
  const result = await uploadStore.uploadFile(file, "cv", userId);

  if (result.success) {
    cvUrl.value = result.url;
    cvFileName.value = file.name;
    successMessage.value = "¡CV cargado exitosamente!";
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } else {
    cvError.value = result.error || "Error al subir el CV.";
  }
};

const handleCvSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) processCvFile(file);
};

const handleCvDrop = (event: DragEvent) => {
  cvDragOver.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) processCvFile(file);
};

const saveSettings = async () => {
  if (!session.value?.user?.id) return;
  saving.value = true;
  successMessage.value = "";

  const parts = location.value.split(",").map((p) => p.trim());
  const city = parts[0] || "";
  const pais = parts[1] || "";

  try {
    const response = await $fetch(
      `${config.public.apiUrl}/profile/${session.value.user.id}`,
      {
        method: "POST",
        body: {
          nombre: name.value,
          biografia: bio.value,
          ubicacion: {
            city,
            pais,
            lat: lat.value,
            lng: lng.value,
            formatted: location.value,
          },
          habilidades: skills.value,
          sectores: sectors.value,
          cvUrl: cvUrl.value,
          cvFileName: cvFileName.value,
        },
      },
    );
    if (response) {
      // Clear draft on successful save
      if (process.client) {
        localStorage.removeItem("jobnet_draft_settings");
        hasDraft.value = false;
      }
      successMessage.value =
        "¡Configuración de candidato guardada con éxito! Redirigiendo a tu perfil...";
      setTimeout(() => {
        successMessage.value = "";
        router.push(`/candidate/${session.value?.user?.id}`);
      }, 1500);
    }
  } catch (e) {
    console.error("Error updating settings:", e);
  } finally {
    saving.value = false;
  }
};
</script>
