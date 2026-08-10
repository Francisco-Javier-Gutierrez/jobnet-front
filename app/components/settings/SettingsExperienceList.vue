<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
  >
    <div class="flex items-center justify-between">
      <h2
        class="text-base font-bold text-on-background flex items-center gap-2"
      >
        <span
          class="material-symbols-outlined text-indigo-600 dark:text-indigo-400"
          >work</span
        >
        Experiencia Laboral
      </h2>
      <button
        type="button"
        @click="addExperiencia"
        class="bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 transition flex items-center gap-1 active:scale-95"
      >
        <span class="material-symbols-outlined text-sm">add</span>
        Agregar Empleo
      </button>
    </div>

    <p class="text-xs text-on-surface-variant dark:text-slate-400">
      Registra tus empleos anteriores o actuales para completar tu trayectoria
      profesional.
    </p>

    <div
      v-if="experiencia.length === 0"
      class="text-xs text-on-surface-variant dark:text-slate-400 italic py-3 text-center bg-surface-container-low/30 rounded-xl border border-dashed border-outline-variant/50"
    >
      No has agregado experiencia laboral. Haz clic en "Agregar Empleo" para
      registrar tus puestos.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(exp, idx) in experiencia"
        :key="exp.id || idx"
        class="bg-surface-container-low/40 dark:bg-slate-800/40 border border-outline-variant/50 dark:border-slate-800 rounded-xl p-4 space-y-3 relative group"
      >
        <div
          class="flex items-center justify-between border-b border-outline-variant/40 pb-2"
        >
          <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            Experiencia #{{ idx + 1 }}
          </span>
          <button
            type="button"
            @click="removeExperiencia(idx)"
            class="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1 transition"
            title="Eliminar este empleo"
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
              Puesto / Cargo *
            </label>
            <input
              v-model="exp.puesto"
              type="text"
              placeholder="Ej: Desarrollador Frontend Senior"
              class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label
              class="text-[11px] font-bold text-on-surface-variant dark:text-slate-300"
            >
              Organización / Organización *
            </label>
            <input
              v-model="exp.organización"
              type="text"
              placeholder="Ej: Tech Solutions Inc."
              class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label
              class="text-[11px] font-bold text-on-surface-variant dark:text-slate-300"
            >
              Fecha de Inicio
            </label>
            <input
              v-model="exp.fechaInicio"
              type="month"
              class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
            />
          </div>

          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <label
                class="text-[11px] font-bold text-on-surface-variant dark:text-slate-300"
              >
                Fecha de Fin
              </label>
              <label
                class="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  v-model="exp.actualmente"
                  class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Actualmente laboro aquí
              </label>
            </div>
            <input
              v-if="!exp.actualmente"
              v-model="exp.fechaFin"
              type="month"
              class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
            />
            <span
              v-else
              class="w-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-2 text-xs rounded-xl border border-emerald-200 dark:border-emerald-800 text-center"
            >
              Empleo actual
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label
            class="text-[11px] font-bold text-on-surface-variant dark:text-slate-300"
          >
            Descripción de Funciones y Logros
          </label>
          <textarea
            v-model="exp.descripcion"
            rows="2"
            placeholder="Describe tus responsabilidades, proyectos clave y tecnologías utilizadas..."
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition resize-none"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ExperienciaItem {
  id?: string;
  puesto: string;
  organización: string;
  fechaInicio: string;
  fechaFin: string;
  actualmente: boolean;
  descripcion: string;
}

const props = defineProps<{
  experiencia: ExperienciaItem[];
}>();

const emit = defineEmits<{
  (e: "update:experiencia", value: ExperienciaItem[]): void;
}>();

function addExperiencia() {
  const newList = [
    ...props.experiencia,
    {
      id: Math.random().toString(36).substring(2),
      puesto: "",
      organización: "",
      fechaInicio: "",
      fechaFin: "",
      actualmente: false,
      descripcion: "",
    },
  ];
  emit("update:experiencia", newList);
}

function removeExperiencia(idx: number) {
  const newList = props.experiencia.filter((_, i) => i !== idx);
  emit("update:experiencia", newList);
}
</script>
