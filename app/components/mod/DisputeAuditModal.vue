<template>
  <div
    v-if="modelValue && incident"
    class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    role="dialog"
    aria-modal="true"
    aria-labelledby="audit-modal-title"
  >
    <div
      class="bg-surface dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-fade-in my-auto"
    >
      <!-- Header: SOBER, compact, no V2 slogans -->
      <div
        class="px-5 py-3.5 bg-surface-container-low/40 dark:bg-slate-800/80 border-b border-outline-variant/50 dark:border-slate-800 flex items-center justify-between flex-shrink-0"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="material-symbols-outlined text-primary text-[20px]"
            >policy</span
          >
          <div class="truncate">
            <h3
              id="audit-modal-title"
              class="text-sm font-bold text-on-surface dark:text-slate-100 flex items-center gap-2 truncate"
            >
              <span
                >Auditoría de Mensajería: Expediente #{{
                  incident.id.substring(0, 8)
                }}</span
              >
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-500/20"
              >
                {{ incident.infraccion }}
              </span>
            </h3>
            <p
              class="text-[11px] text-on-surface-variant dark:text-slate-400 truncate"
            >
              Supervisión de controversia laboral en:
              {{ incident.jobTitle || incident.targetTitle }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          <span
            class="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
          >
            <span class="material-symbols-outlined text-[13px]"
              >visibility</span
            >
            <span>Solo Lectura</span>
          </span>

          <button
            type="button"
            @click="close"
            class="p-1 text-on-surface-variant hover:text-on-surface dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-surface-container-low dark:hover:bg-slate-800 transition"
            aria-label="Cerrar modal"
          >
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      <!-- Parties and Incident Context Summary -->
      <div
        class="px-5 py-2.5 bg-surface-container-lowest dark:bg-slate-900 border-b border-outline-variant/40 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0"
      >
        <div class="flex items-center gap-4 flex-wrap">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px] text-primary"
              >person</span
            >
            <span class="text-on-surface-variant dark:text-slate-400"
              >Candidato:</span
            >
            <span class="font-bold text-on-surface dark:text-slate-200">{{
              incident.candidateName || incident.reporter || "Candidato"
            }}</span>
          </div>

          <span class="text-outline-variant">•</span>

          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px] text-primary"
              >corporate_fare</span
            >
            <span class="text-on-surface-variant dark:text-slate-400"
              >Organización:</span
            >
            <span class="font-bold text-on-surface dark:text-slate-200">{{
              incident.companyName || "Organización"
            }}</span>
          </div>
        </div>

        <div
          class="text-[11px] text-on-surface-variant dark:text-slate-400 italic truncate max-w-md"
        >
          Motivo: {{ incident.reason }}
        </div>
      </div>

      <!-- Main Body: Messages Thread and Evidence Inspection -->
      <div
        class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-surface-container-low/10 dark:bg-slate-950/40"
      >
        <!-- Loading State -->
        <div v-if="loading" class="py-12 text-center text-on-surface-variant">
          <span
            class="material-symbols-outlined text-2xl animate-spin text-primary mb-2"
            >sync</span
          >
          <p class="text-xs">
            Cargando hilo íntegro y evidencias probatorias...
          </p>
        </div>

        <!-- Empty Messages State -->
        <div
          v-else-if="messages.length === 0"
          class="py-12 text-center text-on-surface-variant dark:text-slate-400"
        >
          <span class="material-symbols-outlined text-3xl text-primary/40 mb-2"
            >forum</span
          >
          <p class="text-xs font-semibold">
            No se encontraron mensajes previos en el canal.
          </p>
        </div>

        <!-- Message Bubbles in Chronological Order -->
        <div
          v-else
          v-for="msg in messages"
          :key="msg.id"
          class="flex flex-col gap-1 max-w-[85%]"
          :class="
            msg.senderRole === 'CANDIDATO'
              ? 'ml-auto items-end'
              : 'mr-auto items-start'
          "
        >
          <!-- Sender name and timestamp -->
          <div
            class="flex items-center gap-1.5 text-[10px] text-on-surface-variant dark:text-slate-400 px-1"
          >
            <span
              :class="[
                'font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.2 rounded',
                msg.senderRole === 'CANDIDATO'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
              ]"
            >
              {{ msg.senderRole }}
            </span>
            <span class="font-medium">{{ msg.senderName }}</span>
            <span>•</span>
            <span class="font-mono">{{ formatTime(msg.createdAt) }}</span>
          </div>

          <!-- Message card -->
          <div
            :class="[
              'p-3 rounded-2xl text-xs leading-relaxed shadow-2xs border transition',
              msg.senderRole === 'CANDIDATO'
                ? 'bg-primary/10 text-on-surface dark:text-slate-100 border-primary/20 rounded-tr-xs'
                : 'bg-surface dark:bg-slate-800 text-on-surface dark:text-slate-100 border-outline-variant/60 dark:border-slate-700 rounded-tl-xs',
            ]"
          >
            <p class="whitespace-pre-wrap">{{ msg.text }}</p>

            <!-- Attachment if present -->
            <div
              v-if="msg.attachmentUrl"
              class="mt-2.5 pt-2 border-t border-outline-variant/30 dark:border-slate-700/60 flex items-center justify-between gap-3 bg-surface-container-low/30 dark:bg-slate-900/60 p-2 rounded-xl"
            >
              <div class="flex items-center gap-2 min-w-0">
                <span
                  class="material-symbols-outlined text-[18px] text-rose-500 flex-shrink-0"
                >
                  {{ isImage(msg.attachmentName) ? "image" : "picture_as_pdf" }}
                </span>
                <span class="text-[11px] font-mono font-medium truncate">
                  {{ msg.attachmentName || "archivo_adjunto" }}
                </span>
              </div>

              <button
                type="button"
                @click="openAttachment(msg.attachmentUrl)"
                class="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-primary hover:text-primary-container bg-primary/10 hover:bg-primary/20 rounded-md transition flex-shrink-0 cursor-pointer"
              >
                <span class="material-symbols-outlined text-[13px]"
                  >download</span
                >
                <span>Ver Archivo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Dictamen del Moderador: Fase 2 -->
      <div
        class="p-4 sm:p-5 bg-surface-container-lowest dark:bg-slate-900 border-t border-outline-variant/50 dark:border-slate-800 flex-shrink-0 space-y-3"
      >
        <div class="flex items-center justify-between gap-2">
          <h4
            class="text-xs font-bold text-on-surface dark:text-slate-200 flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-sm text-primary"
              >gavel</span
            >
            <span>Dictamen Oficial del Moderador (Evaluación Probatoria)</span>
          </h4>
          <span
            class="text-[10px] font-medium text-on-surface-variant dark:text-slate-400"
          >
            Fase 2 de Resolución
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            @click="dictum = 'SANCION_ORGANIZACION'"
            :class="[
              'p-2.5 rounded-xl border text-left text-xs transition duration-150 flex flex-col gap-1',
              dictum === 'SANCION_ORGANIZACION'
                ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 shadow-xs'
                : 'border-outline-variant/60 dark:border-slate-800 hover:bg-surface-container-low text-on-surface-variant',
            ]"
          >
            <span class="font-bold flex items-center gap-1 text-[11px]">
              <span class="material-symbols-outlined text-sm">block</span>
              Sancionar Organización
            </span>
            <span class="text-[10px] opacity-80 leading-tight">
              Abre Fase 1 de Suspensión (Notifica e inicia periodo de gracia)
            </span>
          </button>

          <button
            type="button"
            @click="dictum = 'ADVERTENCIA'"
            :class="[
              'p-2.5 rounded-xl border text-left text-xs transition duration-150 flex flex-col gap-1',
              dictum === 'ADVERTENCIA'
                ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 shadow-xs'
                : 'border-outline-variant/60 dark:border-slate-800 hover:bg-surface-container-low text-on-surface-variant',
            ]"
          >
            <span class="font-bold flex items-center gap-1 text-[11px]">
              <span class="material-symbols-outlined text-sm">warning</span>
              Advertencia Formal
            </span>
            <span class="text-[10px] opacity-80 leading-tight">
              Despacha amonestación oficial con apercibimiento de cierre
            </span>
          </button>

          <button
            type="button"
            @click="dictum = 'DESESTIMADA'"
            :class="[
              'p-2.5 rounded-xl border text-left text-xs transition duration-150 flex flex-col gap-1',
              dictum === 'DESESTIMADA'
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 shadow-xs'
                : 'border-outline-variant/60 dark:border-slate-800 hover:bg-surface-container-low text-on-surface-variant',
            ]"
          >
            <span class="font-bold flex items-center gap-1 text-[11px]">
              <span class="material-symbols-outlined text-sm">task_alt</span>
              Desestimar Denuncia
            </span>
            <span class="text-[10px] opacity-80 leading-tight">
              Sin evidencia de infracción; restablece el canal sin sanción
            </span>
          </button>
        </div>

        <!-- Justification Input -->
        <div class="space-y-1.5">
          <label
            class="text-[11px] font-bold text-on-surface-variant dark:text-slate-300 block"
          >
            Justificación y Conclusiones del Dictamen
          </label>
          <textarea
            v-model="notes"
            rows="2"
            placeholder="Detalla los hallazgos en la evidencia de mensajería que sustentan la sanción o resolución..."
            class="w-full bg-surface dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-700 rounded-xl p-2.5 text-xs text-on-surface dark:text-slate-200 focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div
          v-if="error"
          class="text-xs text-rose-600 dark:text-rose-400 font-semibold"
        >
          {{ error }}
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 bg-surface hover:bg-surface-container border border-outline-variant/60 text-on-surface text-xs font-bold rounded-xl transition"
          >
            Cerrar Expediente
          </button>

          <button
            type="button"
            :disabled="submitting || !notes.trim()"
            @click="emit('submit')"
            class="px-4 py-2 bg-primary hover:bg-primary-container disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <span
              v-if="submitting"
              class="material-symbols-outlined text-[16px] animate-spin"
              >sync</span
            >
            <span v-else class="material-symbols-outlined text-[16px]"
              >balance</span
            >
            <span>Emitir Dictamen Oficial</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useS3Upload } from "~/composables/useS3Upload";
import type { Incident } from "~/types";
import type { AuditMessage } from "~/composables/useDisputeAudit";

const { getSecureViewUrl } = useS3Upload();

const props = defineProps<{
  modelValue: boolean;
  incident: Incident | null;
  messages: AuditMessage[];
  loading: boolean;
  submitting: boolean;
  error?: string;
  dictumAction: "SANCION_ORGANIZACION" | "ADVERTENCIA" | "DESESTIMADA";
  dictumNotes: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
  (
    e: "update:dictumAction",
    val: "SANCION_ORGANIZACION" | "ADVERTENCIA" | "DESESTIMADA",
  ): void;
  (e: "update:dictumNotes", val: string): void;
  (e: "submit"): void;
}>();

const close = () => emit("update:modelValue", false);

const dictum = computed({
  get: () => props.dictumAction,
  set: (val) => emit("update:dictumAction", val),
});

const notes = computed({
  get: () => props.dictumNotes,
  set: (val) => emit("update:dictumNotes", val),
});

const formatTime = (isoString?: string) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
};

const isImage = (fileName?: string | null) => {
  if (!fileName) return false;
  return /\.(png|jpe?g|webp|gif)$/i.test(fileName);
};

const openAttachment = async (url: string) => {
  if (!url) return;
  const secureUrl = await getSecureViewUrl(url);
  if (secureUrl) {
    window.open(secureUrl, "_blank", "noopener,noreferrer");
  }
};
</script>
