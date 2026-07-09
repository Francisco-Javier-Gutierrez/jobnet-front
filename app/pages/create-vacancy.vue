<template>
  <div class="max-w-2xl mx-auto px-4 py-8 w-full bg-background min-h-screen">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-on-background mb-2">
        Crear Nueva Vacante
      </h1>
      <p class="text-on-surface-variant text-sm">
        Registra una oferta de empleo para comenzar a recibir candidaturas.
      </p>
    </div>

    <!-- Alert Messages -->
    <div
      v-if="successMessage"
      class="mb-4 bg-secondary/10 border border-secondary/20 text-secondary p-4 rounded-xl flex items-center gap-2 text-sm font-semibold"
    >
      <span class="material-symbols-outlined text-lg">check_circle</span>
      {{ successMessage }}
    </div>
    <div
      v-if="errorMessage"
      class="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 p-4 rounded-xl flex items-center gap-2 text-sm font-semibold"
    >
      <span class="material-symbols-outlined text-lg">error</span>
      {{ errorMessage }}
    </div>

    <form
      @submit.prevent="handleSubmit"
      class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-5 shadow-sm"
    >
      <!-- Job Title -->
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-bold text-on-surface-variant" for="title"
          >Título del Puesto</label
        >
        <input
          v-model="title"
          id="title"
          type="text"
          required
          placeholder="Ej: Senior Frontend Engineer"
          class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
        />
      </div>

      <!-- Mode & Salary -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant"
            for="modality"
            >Modalidad de Trabajo</label
          >
          <select
            v-model="modality"
            id="modality"
            class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23777587%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1.5em_1.5em] pr-10"
          >
            <option value="Remoto">Remoto</option>
            <option value="Híbrido">Híbrido</option>
            <option value="Presencial">Presencial</option>
          </select>
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-on-surface-variant" for="salary"
            >Salario Mensual (MXN)</label
          >
          <input
            v-model.number="salary"
            id="salary"
            type="number"
            placeholder="Ej: 45000"
            class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
          />
        </div>
      </div>

      <!-- Description -->
      <div class="flex flex-col gap-1.5">
        <label
          class="text-xs font-bold text-on-surface-variant"
          for="description"
          >Descripción de Responsabilidades</label
        >
        <textarea
          v-model="description"
          id="description"
          rows="5"
          required
          placeholder="Describe las funciones, requisitos y lo que ofrece el puesto..."
          class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition resize-none"
        ></textarea>
      </div>

      <!-- Coordinates (Lat/Lng) -->
      <div
        class="bg-surface-container-low/50 p-4 border border-outline-variant/60 rounded-xl flex flex-col gap-3"
      >
        <h3 class="text-xs font-bold text-on-background">
          Coordenadas Geográficas (Para el buscador con mapa)
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label
              class="text-[10px] font-bold text-on-surface-variant"
              for="lat"
              >Latitud</label
            >
            <input
              v-model.number="lat"
              id="lat"
              type="number"
              step="0.000001"
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label
              class="text-[10px] font-bold text-on-surface-variant"
              for="lng"
              >Longitud</label
            >
            <input
              v-model.number="lng"
              id="lng"
              type="number"
              step="0.000001"
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
            />
          </div>
        </div>
        <button
          type="button"
          @click="setToMexicoCity"
          class="text-primary hover:text-primary-container text-[10px] font-bold transition text-left self-start"
        >
          Usar coordenadas de Ciudad de México (Centro)
        </button>
      </div>

      <!-- Habilidades Requeridas -->
      <div class="flex flex-col gap-1.5">
        <label class="text-xs font-bold text-on-surface-variant"
          >Habilidades Requeridas</label
        >
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
        </div>
        <div class="flex gap-2">
          <input
            v-model="newSkill"
            @keyup.enter.prevent="addSkill"
            type="text"
            placeholder="Ej: React, AWS, Docker"
            class="flex-grow bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2 text-xs text-on-background outline-none transition"
          />
          <button
            type="button"
            @click="addSkill"
            class="bg-surface border border-outline-variant hover:border-primary hover:bg-primary/5 text-primary text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            Agregar
          </button>
        </div>
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        :disabled="submitting"
        class="bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-semibold text-sm h-12 rounded-xl transition shadow-md shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 duration-100 mt-2"
      >
        <span class="material-symbols-outlined text-lg">{{
          submitting ? "sync" : "post_add"
        }}</span>
        {{ submitting ? "Publicando..." : "Publicar Vacante" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

useSeoMeta({
  title: "Publicar Oferta de Empleo - JobNet",
  description:
    "Crea una nueva vacante de reclutamiento en la plataforma JobNet",
});

const router = useRouter();
const config = useRuntimeConfig();
const { data: session, status } = useAuth();

const title = ref("");
const modality = ref("Remoto");
const salary = ref<number | null>(null);
const description = ref("");
const lat = ref(19.432608); // Default CDMX
const lng = ref(-99.133209);
const skills = ref<string[]>([]);
const newSkill = ref("");

const submitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const companyName = ref("Empresa Corporativa");

const fetchCompanyName = async () => {
  if (status.value !== "authenticated" || !session.value?.user?.id) {
    router.push("/login");
    return;
  }

  try {
    const profile = await $fetch<any>(
      `${config.public.apiUrl}/profile/${session.value.user.id}`,
    );
    if (profile) {
      companyName.value = profile.nombre || "Empresa Corporativa";
    }
  } catch (e) {
    console.error("Error fetching company name for vacancy posting:", e);
  }
};

onMounted(() => {
  fetchCompanyName();
});

const addSkill = () => {
  if (!newSkill.value.trim()) return;
  const s = newSkill.value.trim();
  if (!skills.value.includes(s)) {
    skills.value.push(s);
  }
  newSkill.value = "";
};

const removeSkill = (skill: string) => {
  skills.value = skills.value.filter((s) => s !== skill);
};

const setToMexicoCity = () => {
  lat.value = 19.432608;
  lng.value = -99.133209;
};

const handleSubmit = async () => {
  if (!session.value?.user?.id) return;

  submitting.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    const response = await $fetch<any>(`${config.public.apiUrl}/jobs`, {
      method: "POST",
      body: {
        title: title.value,
        company: companyName.value,
        empresaUuid: session.value.user.id,
        lat: lat.value,
        lng: lng.value,
        modalidad: modality.value,
        salario: salary.value || 0,
        descripcion: description.value,
        habilidadesRequeridas: skills.value,
      },
    });

    if (response) {
      successMessage.value = "¡Vacante publicada con éxito en la plataforma!";
      title.value = "";
      description.value = "";
      salary.value = null;
      skills.value = [];

      setTimeout(() => {
        router.push("/my-vacancies");
      }, 1500);
    }
  } catch (error: any) {
    console.error("Error creating vacancy:", error);
    errorMessage.value = "Error al intentar registrar la vacante de empleo.";
  } finally {
    submitting.value = false;
  }
};
</script>
