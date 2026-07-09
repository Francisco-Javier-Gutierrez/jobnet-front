<template>
  <main
    class="flex-grow pt-4 pb-36 px-margin-mobile flex flex-col gap-lg max-w-lg mx-auto w-full"
  >
    <!-- Header Section -->
    <div flex class="flex items-center gap-md mt-md">
      <div
        class="w-16 h-16 rounded-full overflow-hidden bg-surface-container-highest border border-outline-variant flex-shrink-0"
      >
        <img
          alt="Corporate Logo"
          class="w-full h-full object-cover"
          :src="
            fotoPerfil ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBv7ieXvxtMvK4Bf5kvEuqFTPF59k2wFj0FOiA-v1xXN5VHCH9_ZcdYzKj6xGbyBIeLHVW5FuXPuhZ8ghouEp8A22nMpZV0iW6Zvg_YQ0avpohEqle9p-AR9bgPXdnJadM20BCP6_nuDkNCMnR9ywHb5fxRNfK1sAIL6bXl7qjeDQaRa5J--hkEcazv-m8Brqe_BbKSdIGlVhXvuRzLzSM3HSd57GyjW2Ueeh0XvBP7u4bT3o0EWgnO0Q'
          "
        />
      </div>
      <div>
        <h2 class="font-headline-sm text-headline-sm text-on-background">
          {{ nombreComercial || "Mi Empresa" }}
        </h2>
        <p class="font-body-sm text-body-sm text-on-surface-variant">
          Configuración de cuenta
        </p>
        <span
          class="inline-block mt-xs bg-surface-variant text-on-surface-variant font-label-sm text-label-sm px-2 py-1 rounded-full"
          >Admin</span
        >
      </div>
    </div>

    <!-- Segmented Control / Scrollable Tabs -->
    <div
      class="w-full border-b border-outline-variant overflow-x-auto hide-scrollbar py-2"
    >
      <nav class="flex gap-lg px-2 min-w-max">
        <button
          v-for="tab in tabItems"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="
            activeTab === tab.id
              ? 'text-primary border-b-2 border-primary'
              : 'text-on-surface-variant hover:text-primary'
          "
          class="relative pb-2 font-label-md text-label-md transition-colors"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Notifications/Status Messages -->
    <div
      v-if="successMessage"
      class="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg flex items-center gap-2 text-sm"
    >
      <span class="material-symbols-outlined text-emerald-600"
        >check_circle</span
      >
      {{ successMessage }}
    </div>
    <div
      v-if="errorMessage"
      class="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg flex items-center gap-2 text-sm"
    >
      <span class="material-symbols-outlined text-rose-600">error</span>
      {{ errorMessage }}
    </div>

    <!-- Section 1: Identidad Corporativa -->
    <section v-show="activeTab === 'identidad'" class="flex flex-col gap-md">
      <div class="card-level-1">
        <div class="flex flex-col items-center gap-md mb-lg">
          <div
            class="w-24 h-24 rounded-full overflow-hidden bg-surface-container-low border-2 border-dashed border-outline-variant flex items-center justify-center relative group cursor-pointer"
          >
            <img
              alt="Logo Actual"
              class="w-full h-full object-cover"
              :src="
                fotoPerfil ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuB-kAxYiqUVx6tHKlDK5SNr0zwWVBLqHTMh0nMwiKzxf3JGhF8My8n-lyyC1shFROOiguKeBtbu5VHpD2-N4rHzf2mliF5qk7Oz0w9zildHGIcvXWgAy3bgO02AZM4UPolFah2hYdkTeWfwdTMYMCiCO2Bw8FEEMwH6g4FsO5o74b_fc13Ej5TkxuJT3b-YBgcBtSAOGC0PsXX7LNLOdstSZ-OVGuSiYJo1QxKVyTG44eRDPPJelHtYeQ'
              "
            />
            <div
              class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span
                class="material-symbols-outlined text-white"
                style="font-variation-settings: &quot;FILL&quot; 1"
                >add_a_photo</span
              >
            </div>
            <input
              type="file"
              ref="logoFileInput"
              @change="handleLogoUpload"
              accept="image/*"
              class="hidden"
            />
          </div>
          <button
            @click="$refs.logoFileInput.click()"
            :disabled="uploadingLogo"
            class="bg-primary-fixed text-on-primary-fixed font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-fixed-dim transition-colors shadow-sm disabled:opacity-50"
          >
            {{ uploadingLogo ? "Subiendo..." : "Actualizar Logotipo" }}
          </button>
        </div>
        <div class="flex flex-col gap-md">
          <div class="flex flex-col gap-xs">
            <label
              class="font-label-md text-label-md text-on-surface"
              for="nombre-comercial"
              >Nombre Comercial</label
            >
            <input
              v-model="nombreComercial"
              class="form-input rounded-lg px-3 py-2 font-body-md text-body-md text-on-background w-full"
              id="nombre-comercial"
              type="text"
              placeholder="Ej: Mi Empresa S.A."
            />
          </div>
          <div class="flex flex-col gap-xs">
            <label
              class="font-label-md text-label-md text-on-surface"
              for="sector"
              >Sector Económico</label
            >
            <select
              v-model="sector"
              class="form-input rounded-lg px-3 py-2 font-body-md text-body-md text-on-background w-full appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23777587%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1.5em_1.5em] pr-10"
              id="sector"
            >
              <option value="Tecnología y Software">
                Tecnología y Software
              </option>
              <option value="Recursos Humanos">Recursos Humanos</option>
              <option value="Finanzas">Finanzas</option>
              <option value="Salud">Salud</option>
              <option value="Educación">Educación</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div class="flex flex-col gap-xs">
            <label
              class="font-label-md text-label-md text-on-surface"
              for="descripcion"
              >Descripción</label
            >
            <textarea
              v-model="descripcion"
              class="form-input rounded-lg px-3 py-2 font-body-md text-body-md text-on-background w-full resize-none"
              id="descripcion"
              rows="4"
              placeholder="Escribe aquí de qué trata tu organización..."
            ></textarea>
          </div>

          <!-- Latitude and Longitude read-only inputs -->
          <div class="grid grid-cols-2 gap-sm">
            <div class="flex flex-col gap-xs">
              <label
                class="font-label-md text-label-md text-on-surface"
                for="latitude"
                >Latitud</label
              >
              <input
                v-model.number="latitude"
                class="form-input rounded-lg px-3 py-2 font-body-md text-body-md text-on-background w-full bg-surface-container-low"
                id="latitude"
                type="number"
                step="0.000001"
                readonly
                aria-readonly="true"
              />
            </div>
            <div class="flex flex-col gap-xs">
              <label
                class="font-label-md text-label-md text-on-surface"
                for="longitude"
                >Longitud</label
              >
              <input
                v-model.number="longitude"
                class="form-input rounded-lg px-3 py-2 font-body-md text-body-md text-on-background w-full bg-surface-container-low"
                id="longitude"
                type="number"
                step="0.000001"
                readonly
                aria-readonly="true"
              />
            </div>
          </div>

          <!-- Leaflet Map Container -->
          <div class="flex flex-col gap-xs">
            <label class="font-label-md text-label-md text-on-surface"
              >Ubicación en el mapa</label
            >
            <div
              class="h-[250px] w-full rounded-xl overflow-hidden border border-outline-variant/60 relative"
              id="map-container"
            >
              <div id="company-leaflet-map" class="absolute inset-0 z-10"></div>
            </div>
            <span class="text-[10px] text-on-surface-variant/80"
              >Haz clic en el mapa o arrastra el marcador para fijar las
              coordenadas.</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Section 2: Presencia de Marca -->
    <section v-show="activeTab === 'marca'" class="flex flex-col gap-md">
      <div class="card-level-1 flex flex-col gap-md">
        <h3 class="font-headline-sm text-headline-sm text-on-background mb-sm">
          Enlaces Profesionales
        </h3>
        <div class="flex flex-col gap-xs">
          <label
            class="font-label-md text-label-md text-on-surface"
            for="sitio-web"
            >Sitio Web</label
          >
          <div class="relative">
            <span
              class="absolute left-3 top-2.5 material-symbols-outlined text-outline"
              >language</span
            >
            <input
              v-model="website"
              class="form-input rounded-lg pl-10 pr-3 py-2 font-body-md text-body-md text-on-background w-full"
              id="sitio-web"
              placeholder="https://www.ejemplo.com"
              type="url"
            />
          </div>
        </div>
        <div class="flex flex-col gap-xs">
          <label
            class="font-label-md text-label-md text-on-surface"
            for="linkedin"
            >LinkedIn</label
          >
          <div class="relative">
            <span
              class="absolute left-3 top-2.5 material-symbols-outlined text-outline"
              >work</span
            >
            <input
              v-model="linkedin"
              class="form-input rounded-lg pl-10 pr-3 py-2 font-body-md text-body-md text-on-background w-full"
              id="linkedin"
              placeholder="https://linkedin.com/company/..."
              type="url"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: Verificación -->
    <section v-show="activeTab === 'verificacion'" class="flex flex-col gap-md">
      <div class="card-level-1 verification-card relative overflow-hidden">
        <div
          class="absolute top-0 right-0 bg-[#10B981] text-white px-3 py-1 rounded-bl-lg font-label-sm text-label-sm font-bold flex items-center gap-1"
        >
          <span
            class="material-symbols-outlined text-sm"
            style="font-size: 16px"
            >verified</span
          >
          Recomendado
        </div>
        <div class="flex flex-col items-center text-center mt-sm mb-lg">
          <div
            class="w-16 h-16 rounded-full bg-[#ecfdf5] text-[#10B981] flex items-center justify-center mb-sm"
          >
            <span
              class="material-symbols-outlined"
              style="
                font-size: 32px;
                font-variation-settings: &quot;FILL&quot; 1;
              "
              >verified_user</span
            >
          </div>
          <h3 class="font-headline-sm text-headline-sm text-on-background">
            Obtener Insignia de Confianza
          </h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant mt-2">
            Sube tu constancia de situación fiscal reciente para verificar tu
            empresa y destacar en las búsquedas de candidatos.
          </p>
        </div>

        <div
          @click="$refs.pdfFileInput.click()"
          class="border-2 border-dashed border-[#10B981]/50 rounded-xl p-lg flex flex-col items-center justify-center bg-[#f0fdf4] mb-lg cursor-pointer hover:bg-[#dcfce7] transition-colors"
        >
          <span
            class="material-symbols-outlined text-[#10B981] mb-2"
            style="font-size: 28px"
            >upload_file</span
          >
          <span class="font-label-md text-label-md text-[#065f46]">{{
            pdfFileName || "Toca para subir PDF"
          }}</span>
          <span
            class="font-body-sm text-label-sm text-[#059669] mt-1 text-center"
            >Tamaño máximo 5MB</span
          >
          <input
            type="file"
            ref="pdfFileInput"
            @change="handlePdfSelect"
            accept="application/pdf"
            class="hidden"
          />
        </div>

        <div v-if="taxId" class="mb-4">
          <label class="font-label-md text-label-md text-on-surface block mb-1"
            >RFC / Identificador Fiscal</label
          >
          <input
            v-model="taxId"
            class="form-input rounded-lg px-3 py-2 font-body-md text-body-md text-on-background w-full"
            type="text"
            placeholder="Ej: ABC123456XYZ"
          />
        </div>

        <button
          @click="handleVerificationRequest"
          :disabled="submittingVerification || !pdfFile"
          class="w-full bg-[#10B981] text-white font-label-md text-label-md h-12 rounded-lg hover:bg-[#059669] transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {{
            submittingVerification ? "Subiendo..." : "Solicitar Verificación"
          }}
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </section>

    <!-- Section 4: Seguridad -->
    <section v-show="activeTab === 'seguridad'" class="flex flex-col gap-md">
      <div class="card-level-1 flex flex-col gap-md">
        <h3 class="font-headline-sm text-headline-sm text-on-background mb-2">
          Seguridad de la Cuenta
        </h3>

        <NuxtLink
          to="/reset-password"
          class="w-full flex items-center justify-between p-md border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors group"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors"
            >
              <span class="material-symbols-outlined">password</span>
            </div>
            <div class="text-left">
              <span class="block font-label-md text-label-md text-on-background"
                >Cambiar Contraseña</span
              >
              <span
                class="block font-body-sm text-label-sm text-on-surface-variant"
                >Cambia las credenciales de tu cuenta</span
              >
            </div>
          </div>
          <span class="material-symbols-outlined text-outline"
            >chevron_right</span
          >
        </NuxtLink>

        <NuxtLink
          to="/setup-mfa"
          class="w-full flex items-center justify-between p-md border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors group"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors"
            >
              <span class="material-symbols-outlined">security</span>
            </div>
            <div class="text-left">
              <span class="block font-label-md text-label-md text-on-background"
                >Configurar MFA</span
              >
              <span
                class="block font-body-sm text-label-sm text-on-surface-variant text-error"
                >Autenticación de 2 factores</span
              >
            </div>
          </div>
          <span class="material-symbols-outlined text-outline"
            >chevron_right</span
          >
        </NuxtLink>
      </div>
    </section>

    <!-- Footer Action -->
    <div class="mt-8 mb-12 w-full px-4 max-w-lg mx-auto">
      <button
        @click="handleSave"
        :disabled="saving"
        class="w-full bg-primary text-white font-label-md text-label-md h-12 rounded-lg hover:bg-primary-container transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span
          class="material-symbols-outlined text-sm"
          style="font-variation-settings: &quot;FILL&quot; 1"
          >{{ saving ? "sync" : "save" }}</span
        >
        {{ saving ? "Guardando..." : "Guardar Configuración" }}
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

useSeoMeta({
  title: "Configuración Corporativa - JobNet",
  description: "Administra los detalles corporativos de tu organización",
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

const activeTab = ref("identidad");

const tabItems = [
  { id: "identidad", label: "Identidad", icon: "corporate_fare" },
  { id: "marca", label: "Marca", icon: "featured_video" },
  { id: "verificacion", label: "Verificación", icon: "verified_user" },
  { id: "seguridad", label: "Seguridad", icon: "lock" },
];

// Form fields state
const companyId = ref("");
const nombreComercial = ref("");
const sector = ref("Tecnología y Software");
const descripcion = ref("");
const latitude = ref(19.4326);
const longitude = ref(-99.1332);
const website = ref("");
const linkedin = ref("");
const taxId = ref("");
const fotoPerfil = ref("");

// Map variables
let map: any = null;
let marker: any = null;

// Actions state
const loading = ref(true);
const saving = ref(false);
const uploadingLogo = ref(false);
const submittingVerification = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Verification file state
const pdfFile = ref<File | null>(null);
const pdfFileName = ref("");

const goBack = () => {
  router.back();
};

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
      nombreComercial.value = profile.nombre || "";
      sector.value = profile.sector || "Tecnología y Software";
      descripcion.value = profile.biografia || "";
      fotoPerfil.value = profile.fotoPerfil || "";
      taxId.value = profile.taxId || "";

      if (profile.ubicacion) {
        if (typeof profile.ubicacion === "string") {
          latitude.value = 19.4326;
          longitude.value = -99.1332;
        } else {
          latitude.value = parseFloat(profile.ubicacion.lat) || 19.4326;
          longitude.value = parseFloat(profile.ubicacion.lng) || -99.1332;
        }
      }

      if (map && marker) {
        map.setView([latitude.value, longitude.value], 13);
        marker.setLatLng([latitude.value, longitude.value]);
      }

      if (profile.enlacesWeb) {
        website.value = profile.enlacesWeb.website || "";
        linkedin.value = profile.enlacesWeb.linkedin || "";
      }
    }
  } catch (error) {
    console.error("Error fetching company profile:", error);
    errorMessage.value =
      "No se pudo cargar el perfil corporativo de la base de datos.";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchCompanyProfile();

  if (process.client) {
    const L = await import("leaflet");

    // Initialize map centered at current coordinates
    map = L.map("company-leaflet-map").setView(
      [latitude.value, longitude.value],
      13,
    );

    // Add voyager light-themed tiles
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      },
    ).addTo(map);

    // Create draggable marker
    marker = L.marker([latitude.value, longitude.value], {
      draggable: true,
    }).addTo(map);

    // Marker drag event
    marker.on("dragend", () => {
      const latLng = marker.getLatLng();
      latitude.value = Number(latLng.lat.toFixed(6));
      longitude.value = Number(latLng.lng.toFixed(6));
    });

    // Map click event
    map.on("click", (e: any) => {
      marker.setLatLng(e.latlng);
      latitude.value = Number(e.latlng.lat.toFixed(6));
      longitude.value = Number(e.latlng.lng.toFixed(6));
    });
  }
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});

const handleSave = async () => {
  if (!companyId.value) return;

  saving.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    await $fetch(`${config.public.apiUrl}/profile/${companyId.value}`, {
      method: "POST",
      body: {
        nombre: nombreComercial.value,
        sector: sector.value,
        biografia: descripcion.value,
        fotoPerfil: fotoPerfil.value,
        ubicacion: {
          lat: latitude.value,
          lng: longitude.value,
        },
        taxId: taxId.value,
        enlacesWeb: {
          website: website.value,
          linkedin: linkedin.value,
        },
      },
    });

    successMessage.value =
      "¡Configuración guardada exitosamente en la base de datos!";
    setTimeout(() => {
      successMessage.value = "";
    }, 4000);
  } catch (error: any) {
    console.error("Error saving company configuration:", error);
    errorMessage.value = "Error al intentar guardar el perfil corporativo.";
  } finally {
    saving.value = false;
  }
};

// S3 Upload Logo logic
const handleLogoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  uploadingLogo.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    // 1. Get presigned upload URL from serverless API
    const response = await $fetch<any>(`${config.public.apiUrl}/upload-url`);
    if (!response.url) throw new Error("No presigned URL returned from API");

    // 2. Upload file directly to S3
    await $fetch(response.url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    // 3. Construct public S3 URL (using key)
    const publicUrl = response.url.split("?")[0];
    fotoPerfil.value = publicUrl;

    successMessage.value = "¡Logotipo subido exitosamente!";
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error: any) {
    console.error("Error uploading logo:", error);
    errorMessage.value = "Error al intentar subir el logotipo corporativo.";
  } finally {
    uploadingLogo.value = false;
  }
};

const handlePdfSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value =
      "El tamaño del archivo supera el límite permitido de 5MB.";
    pdfFile.value = null;
    pdfFileName.value = "";
    return;
  }

  pdfFile.value = file;
  pdfFileName.value = file.name;
  errorMessage.value = "";
};

const handleVerificationRequest = async () => {
  if (!pdfFile.value || !companyId.value) return;

  submittingVerification.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    // 1. Get presigned upload URL from backend
    const response = await $fetch<any>(`${config.public.apiUrl}/upload-url`);
    if (!response.url) throw new Error("Failed to get upload URL");

    // 2. Upload PDF file directly to S3
    await $fetch(response.url, {
      method: "PUT",
      body: pdfFile.value,
      headers: {
        "Content-Type": "application/pdf",
      },
    });

    const docUrl = response.url.split("?")[0];

    // 3. Notify verification request (updates taxId/verified request)
    await $fetch(`${config.public.apiUrl}/profile/${companyId.value}`, {
      method: "POST",
      body: {
        taxId: taxId.value,
        organizacionVerificada: false, // Request pending
        documentoVerificacion: docUrl,
      },
    });

    successMessage.value =
      "¡Constancia fiscal cargada exitosamente! Solicitud enviada.";
    pdfFile.value = null;
    pdfFileName.value = "";
  } catch (error: any) {
    console.error("Error requesting verification:", error);
    errorMessage.value = "Ocurrió un error al cargar la constancia fiscal.";
  } finally {
    submittingVerification.value = false;
  }
};
</script>

<style>
/* Custom scrollbar for tabs */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
