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

        <div
          class="border-2 border-dashed border-outline-variant hover:border-primary rounded-xl p-6 flex flex-col items-center justify-center bg-surface-container-low/40 cursor-pointer transition"
        >
          <span
            class="material-symbols-outlined text-on-surface-variant text-3xl mb-2"
            >upload_file</span
          >
          <span class="text-sm font-semibold text-on-surface"
            >Seleccionar archivo PDF</span
          >
          <span class="text-xs text-on-surface-variant/80 mt-1"
            >Límite de tamaño: 5MB</span
          >
        </div>
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
        <div class="flex flex-wrap gap-2 mb-2">
          <span
            v-for="skill in skills"
            :key="skill"
            class="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs flex items-center gap-1.5 font-bold"
          >
            {{ skill }}
            <button
              @click="removeSkill(skill)"
              class="hover:text-rose-600 transition flex items-center"
            >
              <span class="material-symbols-outlined text-xs">close</span>
            </button>
          </span>
        </div>
        <div class="flex gap-2">
          <input
            v-model="newSkill"
            @keyup.enter="addSkill"
            type="text"
            placeholder="Agregar habilidad (Ej: Vue, TypeScript)"
            class="flex-grow bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition"
          />
          <button
            @click="addSkill"
            class="bg-primary hover:bg-primary-container text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition active:scale-95 duration-100"
          >
            Agregar
          </button>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

useSeoMeta({
  title: "Ajustes de Perfil - JobNet",
  description:
    "Configura tu cuenta y datos de postulación como candidato en JobNet",
});

const router = useRouter();
const config = useRuntimeConfig();
const { data: session, status } = useAuth();

const name = ref("");
const location = ref("");
const bio = ref("");
const skills = ref<string[]>([]);
const newSkill = ref("");
const saving = ref(false);
const successMessage = ref("");

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
      location.value =
        typeof data.ubicacion === "string"
          ? data.ubicacion
          : data.ubicacion?.city || data.ubicacion?.pais || "";
      skills.value = data.habilidades || [];
    }
  } catch (e) {
    console.error("Error loading candidate profile for settings:", e);
  }
};

onMounted(() => {
  fetchProfile();
});

const addSkill = () => {
  if (!newSkill.value.trim()) return;
  const normalized = newSkill.value.trim();
  if (!skills.value.includes(normalized)) {
    skills.value.push(normalized);
  }
  newSkill.value = "";
};

const removeSkill = (skill: string) => {
  skills.value = skills.value.filter((s) => s !== skill);
};

const saveSettings = async () => {
  if (!session.value?.user?.id) return;
  saving.value = true;
  successMessage.value = "";

  try {
    await $fetch(`${config.public.apiUrl}/profile/${session.value.user.id}`, {
      method: "POST",
      body: {
        nombre: name.value,
        biografia: bio.value,
        ubicacion: location.value,
        habilidades: skills.value,
      },
    });
    successMessage.value = "¡Configuración de candidato guardada con éxito!";
    setTimeout(() => {
      successMessage.value = "";
    }, 4000);
  } catch (e) {
    console.error("Error updating settings:", e);
  } finally {
    saving.value = false;
  }
};
</script>
