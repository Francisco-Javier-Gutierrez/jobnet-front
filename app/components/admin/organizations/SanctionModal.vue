<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
  >
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-fade-in my-auto"
    >
      <div
        class="px-6 py-4 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0"
      >
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-amber-500">gavel</span>
          <h3 class="text-md font-bold text-slate-900 dark:text-slate-100">
            Sanciones Administrativas: {{ selectedOrg?.nombre || (selectedOrg as any)?.name }}
          </h3>
        </div>
        <button
          @click="close"
          class="text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="p-6 space-y-6 overflow-y-auto flex-1">
        <div class="relative flex items-center justify-between mb-8">
          <div
            class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 dark:bg-slate-800 z-0"
          ></div>
          <div
            v-for="step in sanctionSteps"
            :key="step.number"
            class="relative z-10 flex flex-col items-center gap-1.5"
          >
            <div
              :class="[
                'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border transition duration-300',
                isStepActive(step.number)
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-400',
              ]"
            >
              {{ step.number }}
            </div>
            <span
              class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400"
              >{{ step.label }}</span
            >
          </div>
        </div>

        <div
          class="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-4"
        >
          <div v-if="getOrgStatusKey(selectedOrg) === 'ACTIVO'">
            <h4
              class="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mb-1.5"
            >
              <span class="material-symbols-outlined text-sm"
                >check_circle</span
              >
              Fase 1 — Cuenta activa
            </h4>
            <p
              class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed"
            >
              La cuenta está activa. Al iniciar el proceso de suspensión, el
              sistema **no bloquea** inmediatamente la cuenta, sino que la
              coloca en estado de
              <strong class="text-slate-800 dark:text-slate-200"
                >Revisión</strong
              >, envía una notificación oficial a la organización y otorga un
              periodo de gracia (4 días por defecto) para apelar.
            </p>
          </div>

          <div v-else-if="getOrgStatusKey(selectedOrg) === 'REVISION'">
            <h4
              class="text-xs font-bold text-amber-600 flex items-center gap-1.5 mb-1.5"
            >
              <span class="material-symbols-outlined text-sm">warning</span>
              Fase 2 — Periodo de apelación activo
            </h4>
            <p
              class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3"
            >
              La organización está en periodo de gracia. Puede enviar
              justificaciones y evidencia a través del canal de soporte.
            </p>
            <NuxtLink
              to="/mod/support"
              @click="close"
              class="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <span class="material-symbols-outlined text-sm">forum</span>
              <span>Ver Canal de Apelación en Chat WS</span>
            </NuxtLink>
          </div>

          <div v-else-if="getOrgStatusKey(selectedOrg) === 'SUSPENDIDA'">
            <h4
              class="text-xs font-bold text-rose-600 flex items-center gap-1.5 mb-1.5"
            >
              <span class="material-symbols-outlined text-sm">cancel</span> Fase
              3 — Cuenta suspendida
            </h4>
            <p
              class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed"
            >
              El dictamen de apelación fue desfavorable (o concluyó el periodo
              de gracia). El inicio de sesión se encuentra bloqueado de forma
              definitiva y todas sus ofertas han sido ocultadas del Job Board.
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div
            v-if="getOrgStatusKey(selectedOrg) === 'ACTIVO'"
            class="space-y-4"
          >
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200">
              Iniciar proceso de suspensión
            </h4>
            <div
              class="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800"
            >
              <div>
                <label
                  class="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1"
                  >Motivo / Descripción de Infracción</label
                >
                <input
                  v-model="internalReason"
                  type="text"
                  placeholder="Ej. Publicación de ofertas engañosas o infracción de términos"
                  class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs outline-none text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label
                  class="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1"
                  >Días de Gracia para Apelar</label
                >
                <input
                  v-model.number="internalGraceDays"
                  type="number"
                  min="1"
                  max="15"
                  class="w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs outline-none text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
            <button
              @click="$emit('applySanction', 'INITIATE')"
              class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-3 rounded-xl transition shadow active:scale-95 duration-100 flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined text-[18px]">warning</span>
              Notificar infracción e iniciar periodo de gracia
            </button>
          </div>

          <div
            v-else-if="getOrgStatusKey(selectedOrg) === 'REVISION'"
            class="space-y-4"
          >
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200">
              Emitir dictamen de apelación
            </h4>
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="$emit('applySanction', 'CANCEL')"
                class="flex-grow bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-xl transition shadow active:scale-95 duration-100 flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined text-[18px]"
                  >task_alt</span
                >
                Aceptar Apelación (Revocar Suspensión)
              </button>
              <button
                @click="$emit('applySanction', 'CONFIRM')"
                class="flex-grow bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-3 rounded-xl transition shadow active:scale-95 duration-100 flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined text-[18px]">block</span>
                Rechazar Apelación y Suspender Definitivamente
              </button>
            </div>
          </div>

          <div
            v-else-if="getOrgStatusKey(selectedOrg) === 'SUSPENDIDA'"
            class="space-y-4"
          >
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200">
              Rehabilitación de Cuenta
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Si la organización ha corregido las infracciones señaladas, el
              administrador puede reactivar su cuenta y desbloquear el acceso.
            </p>
            <button
              @click="$emit('applySanction', 'CANCEL')"
              class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-xl transition shadow active:scale-95 duration-100 flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined text-[18px]"
                >restart_alt</span
              >
              Reactivar Cuenta y Desbloquear Acceso
            </button>
          </div>
        </div>
      </div>

      <div
        class="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end flex-shrink-0"
      >
        <button
          @click="close"
          class="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition shadow-sm"
        >
          Cerrar Ventana
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminOrganization, CompanyProfile } from "~/types";

export interface SanctionStep {
  title: string;
  desc: string;
  icon: string;
  actionText: string;
  btnVariant: string;
  actionType: "INITIATE" | "CANCEL" | "CONFIRM";
}

const props = defineProps<{
  modelValue: boolean;
  selectedOrg: (AdminOrganization | CompanyProfile) | null;
  sanctionSteps: SanctionStep[];
  suspensionReasonInput: string;
  graceDaysInput: number;
  getOrgStatusKey: (org: AdminOrganization | CompanyProfile) => string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "update:suspensionReasonInput", value: string): void;
  (e: "update:graceDaysInput", value: number): void;
  (e: "applySanction", actionType: "INITIATE" | "CANCEL" | "CONFIRM"): void;
}>();

const close = () => emit("update:modelValue", false);

const internalReason = computed({
  get: () => props.suspensionReasonInput,
  set: (val) => emit("update:suspensionReasonInput", val),
});

const internalGraceDays = computed({
  get: () => props.graceDaysInput,
  set: (val) => emit("update:graceDaysInput", val),
});

const isStepActive = (stepNum: number) => {
  if (!props.selectedOrg) return false;
  const statusKey = props.getOrgStatusKey(props.selectedOrg);
  if (statusKey === "ACTIVO") return stepNum === 1;
  else if (statusKey === "REVISION") return stepNum <= 2;
  else if (statusKey === "SUSPENDIDA") return stepNum <= 3;
  return false;
};
</script>
