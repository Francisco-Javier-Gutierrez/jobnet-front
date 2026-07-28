<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
  >
    <div
      class="bg-surface dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200"
    >
      <div
        class="flex items-center justify-between border-b border-outline-variant/30 pb-4"
      >
        <div class="flex items-center gap-2">
          <div
            class="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center"
          >
            <span class="material-symbols-outlined">flag</span>
          </div>
          <div>
            <h3 class="text-base font-bold text-on-background">
              Reportar vacante
            </h3>
            <p class="text-[11px] text-on-surface-variant dark:text-slate-400">
              Notificar a los moderadores de contenido
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="$emit('update:show', false)"
          class="text-on-surface-variant dark:text-slate-400 hover:text-on-background transition p-1"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div
        v-if="reportSuccess"
        class="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs font-semibold flex items-center gap-2"
      >
        <span class="material-symbols-outlined">check_circle</span>
        ¡Reporte enviado exitosamente a moderación!
      </div>

      <form v-else @submit.prevent="submitReport" class="space-y-4 text-left">
        <div class="space-y-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            >Motivo del reporte</label
          >
          <select
            v-model="reportReason"
            class="w-full bg-surface-container-low border border-outline-variant/60 focus:border-primary rounded-xl px-3.5 py-2.5 text-xs text-on-background outline-none transition"
          >
            <option value="Vacante falsa">
              Vacante falsa / Posible fraude
            </option>
            <option value="Información engañosa">
              Información engañosa o salario irreal
            </option>
            <option value="Contenido inapropiado">
              Contenido inapropiado u ofensivo
            </option>
            <option value="Otro">Otro motivo</option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            >Detalles adicionales</label
          >
          <textarea
            v-model="reportComments"
            rows="3"
            required
            placeholder="Describe brevemente por qué consideras que esta vacante infringe los términos..."
            class="w-full bg-surface-container-low border border-outline-variant/60 focus:border-primary rounded-xl p-3 text-xs text-on-background outline-none transition resize-none"
          ></textarea>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button
            type="button"
            @click="$emit('update:show', false)"
            class="flex-1 bg-surface border border-outline-variant text-on-surface-variant dark:text-slate-300 font-bold text-xs py-3 rounded-xl hover:bg-surface-container transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isReporting || !reportComments.trim()"
            class="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-1 shadow-md shadow-rose-600/20"
          >
            <span v-if="isReporting" class="animate-spin text-xs">⏳</span>
            <span>{{ isReporting ? "Enviando..." : "Enviar Reporte" }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  show: boolean;
  jobId: string;
  jobTitle: string;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
}>();

const reportReason = ref("Vacante falsa");
const reportComments = ref("");
const isReporting = ref(false);
const reportSuccess = ref(false);

async function submitReport() {
  if (!reportComments.value.trim()) return;
  isReporting.value = true;
  try {
    const config = useRuntimeConfig();
    const apiBase =
      config.public.apiBase ||
      "https://olhoy8ebq7.execute-api.us-east-1.amazonaws.com";

    await fetch(`${apiBase}/moderator/incidents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: props.jobId,
        jobTitle: props.jobTitle,
        reason: `${reportReason.value}: ${reportComments.value.trim()}`,
        severity: "media",
      }),
    });

    reportSuccess.value = true;
    setTimeout(() => {
      emit("update:show", false);
      reportSuccess.value = false;
      reportComments.value = "";
    }, 1500);
  } catch (e) {
    console.error("Error creating report:", e);
  } finally {
    isReporting.value = false;
  }
}
</script>
