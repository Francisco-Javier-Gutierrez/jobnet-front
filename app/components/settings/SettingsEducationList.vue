<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
  >
    <div class="flex items-center justify-between">
      <h2
        class="text-base font-bold text-on-background flex items-center gap-2"
      >
        <span
          class="material-symbols-outlined text-primary dark:text-inverse-primary"
          >school</span
        >
        Formación Académica (Educación)
      </h2>
      <button
        type="button"
        @click="addEducacion"
        class="bg-primary/10 dark:bg-primary/20 hover:bg-purple-100 text-primary dark:text-inverse-primary text-xs font-bold px-3 py-1.5 rounded-xl border border-primary/20 dark:border-primary/40 transition flex items-center gap-1 active:scale-95"
      >
        <span class="material-symbols-outlined text-sm">add</span>
        Agregar Educación
      </button>
    </div>

    <p class="text-xs text-on-surface-variant dark:text-slate-400">
      Registra tus títulos universitarios, grados académicos o certificaciones
      educativas.
    </p>

    <div
      v-if="educacion.length === 0"
      class="text-xs text-on-surface-variant dark:text-slate-400 italic py-3 text-center bg-surface-container-low/30 rounded-xl border border-dashed border-outline-variant/50"
    >
      No has agregado formación académica. Haz clic en "Agregar Educación" para
      registrar tus estudios.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(edu, idx) in educacion"
        :key="edu.id || idx"
        class="bg-surface-container-low/40 dark:bg-slate-800/40 border border-outline-variant/50 dark:border-slate-800 rounded-xl p-4 space-y-3 relative group"
      >
        <div
          class="flex items-center justify-between border-b border-outline-variant/40 pb-2"
        >
          <span class="text-xs font-bold text-primary dark:text-inverse-primary">
            Educación #{{ idx + 1 }}
          </span>
          <button
            type="button"
            @click="removeEducacion(idx)"
            class="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1 transition"
            title="Eliminar esta educación"
          >
            <span class="material-symbols-outlined text-sm">delete</span>
            Eliminar
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label
              class="text-[11px] font-bold text-on-surface-variant dark:text-slate-300"
            >
              Grado Obtenido / Titulación *
            </label>
            <input
              v-model="edu.grado"
              type="text"
              placeholder="Ej: Licenciatura en Ciencias de la Computación"
              class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label
              class="text-[11px] font-bold text-on-surface-variant dark:text-slate-300"
            >
              Institución Educativa *
            </label>
            <input
              v-model="edu.institucion"
              type="text"
              placeholder="Ej: Universidad Nacional Autónoma"
              class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label
              class="text-[11px] font-bold text-on-surface-variant dark:text-slate-300"
            >
              Año de Inicio
            </label>
            <input
              v-model="edu.anioInicio"
              type="number"
              placeholder="Ej: 2018"
              min="1950"
              max="2030"
              class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
            />
          </div>

          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <label
                class="text-[11px] font-bold text-on-surface-variant dark:text-slate-300"
              >
                Año de Graduación
              </label>
              <label
                class="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  v-model="edu.enCurso"
                  class="rounded border-slate-300 text-primary focus:ring-primary"
                />
                En curso
              </label>
            </div>
            <input
              v-if="!edu.enCurso"
              v-model="edu.anioGraduacion"
              type="number"
              placeholder="Ej: 2022"
              min="1950"
              max="2030"
              class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
            />
            <span
              v-else
              class="w-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-inverse-primary font-bold px-3 py-2 text-xs rounded-xl border border-primary/20 dark:border-primary/40 text-center"
            >
              Estudios en curso
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface EducacionItem {
  id?: string;
  grado: string;
  institucion: string;
  anioInicio: number | string;
  anioGraduacion: number | string;
  enCurso: boolean;
}

const props = defineProps<{
  educacion: EducacionItem[];
}>();

const emit = defineEmits<{
  (e: "update:educacion", value: EducacionItem[]): void;
}>();

function addEducacion() {
  const newList = [
    ...props.educacion,
    {
      id: Math.random().toString(36).substring(2),
      grado: "",
      institucion: "",
      anioInicio: "",
      anioGraduacion: "",
      enCurso: false,
    },
  ];
  emit("update:educacion", newList);
}

function removeEducacion(idx: number) {
  const newList = props.educacion.filter((_, i) => i !== idx);
  emit("update:educacion", newList);
}
</script>
