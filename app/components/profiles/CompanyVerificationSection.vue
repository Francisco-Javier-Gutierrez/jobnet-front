<template>
  <div class="space-y-6">
    <!-- Main Verification Status Card -->
    <div
      class="p-6 md:p-8 rounded-2xl border transition-all duration-300 shadow-sm"
      :class="statusCardClasses"
    >
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-start gap-4">
          <div
            class="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
            :class="badgeIconBoxClasses"
          >
            <span class="material-symbols-outlined text-4xl">
              {{ statusIcon }}
            </span>
          </div>
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2.5">
              <span
                class="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-xs"
                :class="statusPillClasses"
              >
                {{ statusLabel }}
              </span>
              <span class="text-xs text-on-surface-variant dark:text-slate-400">
                Identificador: {{ company.rfc || "Validación Institucional" }}
              </span>
            </div>
            <h2 class="text-xl md:text-2xl font-bold text-on-surface">
              {{ statusHeading }}
            </h2>
            <p class="text-xs md:text-sm text-on-surface-variant dark:text-slate-300 max-w-2xl leading-relaxed">
              {{ statusDescription }}
            </p>
          </div>
        </div>

        <div
          v-if="isVerified"
          class="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-outline-variant/30 pt-4 md:pt-0 md:pl-6 gap-2 flex-shrink-0"
        >
          <div class="text-left md:text-right">
            <span class="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
              Garantía de Confianza
            </span>
            <span class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 md:justify-end">
              <span class="material-symbols-outlined text-[16px]">verified_user</span>
              Acreditación Oficial
            </span>
          </div>
          <div class="text-left md:text-right">
            <span class="text-[10px] text-slate-400 block">Sello emitido por</span>
            <span class="text-xs font-bold text-on-surface">JobNet Plataforma</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Validation Method Applied -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 p-6 rounded-2xl shadow-sm border border-outline-variant/50 space-y-4"
    >
      <h3
        class="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/30 pb-3"
      >
        <span class="material-symbols-outlined text-primary text-xl">fact_check</span>
        Métodos de Validación Institucional
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Método 1: Validación por Dominio Corporativo Privado (RN-3) -->
        <div
          class="p-4 rounded-xl border transition flex flex-col justify-between gap-3"
          :class="[
            isDomainVerified
              ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/60'
              : 'bg-surface-container-low/50 dark:bg-slate-800/40 border-outline-variant/40',
          ]"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span
                  class="material-symbols-outlined text-lg"
                  :class="isDomainVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'"
                >
                  alternate_email
                </span>
                <h4 class="font-bold text-xs uppercase tracking-wider text-on-surface">
                  Dominio Corporativo Privado (RN-3)
                </h4>
              </div>
              <span
                class="text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
                :class="
                  isDomainVerified
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                "
              >
                <span class="material-symbols-outlined text-[13px]">
                  {{ isDomainVerified ? "check" : "schedule" }}
                </span>
                {{ isDomainVerified ? "Acreditado" : "Pendiente" }}
              </span>
            </div>
            <p class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed">
              Verificación criptográfica del dominio de correo empresarial registrado (excluyendo proveedores genéricos o de riesgo), asegurando que los comunicados provienen de la institución legítima.
            </p>
          </div>
          <div class="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 pt-2 border-t border-outline-variant/20 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm text-primary">link</span>
            <span>Dominio: {{ companyDomainDisplay }}</span>
          </div>
        </div>

        <!-- Método 2: Validación Fiscal Documental SAT -->
        <div
          class="p-4 rounded-xl border transition flex flex-col justify-between gap-3"
          :class="[
            isFiscalVerified
              ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200/80 dark:border-indigo-800/60'
              : 'bg-surface-container-low/50 dark:bg-slate-800/40 border-outline-variant/40',
          ]"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span
                  class="material-symbols-outlined text-lg"
                  :class="isFiscalVerified ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'"
                >
                  account_balance
                </span>
                <h4 class="font-bold text-xs uppercase tracking-wider text-on-surface">
                  Cotejo Fiscal Documental (SAT)
                </h4>
              </div>
              <span
                class="text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
                :class="
                  isFiscalVerified
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                "
              >
                <span class="material-symbols-outlined text-[13px]">
                  {{ isFiscalVerified ? "check" : "schedule" }}
                </span>
                {{ isFiscalVerified ? "Acreditado" : "Pendiente" }}
              </span>
            </div>
            <p class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed">
              Validación de la personalidad jurídica mediante cotejo de sintaxis y registro formal de RFC ante las autoridades tributarias, respaldado por la Constancia de Situación Fiscal.
            </p>
          </div>
          <div class="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 pt-2 border-t border-outline-variant/20 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm text-indigo-600">badge</span>
            <span>RFC Registrado: {{ company.rfc || "En trámite" }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Trust Guarantees for Candidates (4 Pillars) -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 p-6 rounded-2xl shadow-sm border border-outline-variant/50 space-y-4"
    >
      <h3
        class="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/30 pb-3"
      >
        <span class="material-symbols-outlined text-emerald-600 text-xl">shield</span>
        Garantías de Confianza para Candidatos
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 rounded-xl bg-surface-container-low/40 dark:bg-slate-800/40 border border-outline-variant/40 space-y-2">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">gavel</span>
          </div>
          <h4 class="font-bold text-xs text-on-surface">Autenticidad Jurídica</h4>
          <p class="text-[11px] text-on-surface-variant dark:text-slate-300 leading-normal">
            Persona moral acreditada legalmente, mitigando riesgos de suplantación corporativa.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-surface-container-low/40 dark:bg-slate-800/40 border border-outline-variant/40 space-y-2">
          <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">policy</span>
          </div>
          <h4 class="font-bold text-xs text-on-surface">Ofertas Legítimas</h4>
          <p class="text-[11px] text-on-surface-variant dark:text-slate-300 leading-normal">
            Supervisión activa contra cobros indebidos a postulantes, vacantes fantasma o discrepancias salariales.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-surface-container-low/40 dark:bg-slate-800/40 border border-outline-variant/40 space-y-2">
          <div class="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">forum</span>
          </div>
          <h4 class="font-bold text-xs text-on-surface">Canal Directo Seguro</h4>
          <p class="text-[11px] text-on-surface-variant dark:text-slate-300 leading-normal">
            Interacción con reclutadores autorizados bajo protocolo de mensajería formal y auditable.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-surface-container-low/40 dark:bg-slate-800/40 border border-outline-variant/40 space-y-2">
          <div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">lock</span>
          </div>
          <h4 class="font-bold text-xs text-on-surface">Privacidad del CV</h4>
          <p class="text-[11px] text-on-surface-variant dark:text-slate-300 leading-normal">
            Tus datos curriculares se protegen bajo estrictas directivas de confidencialidad institucional.
          </p>
        </div>
      </div>
    </div>

    <!-- Verification Supporting Documents (If Any) -->
    <div
      v-if="verificationDocs && verificationDocs.length > 0"
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 p-6 rounded-2xl shadow-sm border border-outline-variant/50 space-y-4"
    >
      <h3
        class="text-base font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/30 pb-3"
      >
        <span class="material-symbols-outlined text-indigo-600 text-xl">description</span>
        Documentación Probatoria de Verificación
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="doc in verificationDocs"
          :key="doc.id || doc.url || doc.nombre"
          class="bg-surface-container-low/40 dark:bg-slate-800/40 border border-outline-variant/50 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between gap-3 shadow-sm"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center flex-shrink-0"
            >
              <span class="material-symbols-outlined text-xl">verified</span>
            </div>
            <div class="min-w-0">
              <span
                class="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800"
              >
                {{ doc.tipo || "Constancia Fiscal" }}
              </span>
              <p class="text-xs font-bold text-on-background truncate mt-1">
                {{ doc.nombre || "Documento.pdf" }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              @click="$emit('previewDoc', doc)"
              class="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-sm active:scale-95"
            >
              <span class="material-symbols-outlined text-sm">visibility</span>
              Ver
            </button>
            <a
              v-if="doc.url"
              :href="doc.url"
              download
              target="_blank"
              class="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-sm active:scale-95"
            >
              <span class="material-symbols-outlined text-sm">download</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CompanyProfile } from "~/types";

const props = defineProps<{
  company: CompanyProfile;
}>();

defineEmits<{
  (e: "previewDoc", doc: any): void;
}>();

const normalizedStatus = computed(() => {
  const status = (
    props.company.estatusVerificacion ||
    (props.company.organizacionVerificada || props.company.verified
      ? "VERIFICADA"
      : "PENDIENTE")
  ).toUpperCase();

  if (props.company.suspensionStatus === "SUSPENDIDA" || props.company.estatus === "SUSPENDIDA") {
    return "SUSPENDIDA";
  }
  if (status.includes("VERIFICAD")) return "VERIFICADA";
  if (status.includes("REVISION") || status.includes("REVISIÓN")) return "EN_REVISION";
  return "PENDIENTE";
});

const isVerified = computed(() => normalizedStatus.value === "VERIFICADA");
const isRevision = computed(() => normalizedStatus.value === "EN_REVISION");

const isDomainVerified = computed(() => {
  if (isVerified.value) return true;
  return Boolean(
    props.company.metodoVerificacion === "DOMINIO_CORPORATIVO" ||
      props.company.dominioVerificado,
  );
});

const isFiscalVerified = computed(() => {
  if (isVerified.value) return true;
  return Boolean(
    props.company.metodoVerificacion === "VALIDACION_SAT" ||
      (props.company.rfc && props.company.rfc.length >= 12),
  );
});

const statusLabel = computed(() => {
  if (isVerified.value) return "Organización Verificada";
  if (isRevision.value) return "Verificación en Trámite";
  return "Sin Verificación Oficial";
});

const statusHeading = computed(() => {
  if (isVerified.value) return "Distintivo Oficial de Verificación Institucional";
  if (isRevision.value) return "Trámite de Verificación en Revisión Activa";
  return "Estatus de Registro No Verificado";
});

const statusDescription = computed(() => {
  if (isVerified.value) {
    return "Esta organización ha acreditado formalmente su existencia jurídica, identidad fiscal y propiedad de dominio corporativo ante JobNet. Las vacantes emitidas cuentan con el respaldo de confianza de la plataforma.";
  }
  if (isRevision.value) {
    return "El expediente institucional de esta empresa se encuentra en fase de validación probatoria por parte de nuestro equipo de moderación.";
  }
  return "Esta organización aún no ha completado el procedimiento probatorio de verificación fiscal o de dominio. Se recomienda a los candidatos ejercer las precauciones habituales.";
});

const statusIcon = computed(() => {
  if (isVerified.value) return "verified";
  if (isRevision.value) return "pending";
  return "shield";
});

const statusCardClasses = computed(() => {
  if (isVerified.value) {
    return "bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/30 dark:border-emerald-500/20";
  }
  if (isRevision.value) {
    return "bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/30 dark:border-amber-500/20";
  }
  return "bg-surface-container-low dark:bg-slate-800/40 border-outline-variant/40";
});

const badgeIconBoxClasses = computed(() => {
  if (isVerified.value) {
    return "bg-emerald-600 text-white shadow-emerald-500/20";
  }
  if (isRevision.value) {
    return "bg-amber-500 text-white shadow-amber-500/20";
  }
  return "bg-slate-400 text-white shadow-slate-400/20";
});

const statusPillClasses = computed(() => {
  if (isVerified.value) {
    return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
  }
  if (isRevision.value) {
    return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
  }
  return "bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
});

const companyDomainDisplay = computed(() => {
  if (props.company.website) {
    return props.company.website
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "");
  }
  if (props.company.email && props.company.email.includes("@")) {
    return props.company.email.split("@")[1];
  }
  return "dominio-corporativo.com";
});

const verificationDocs = computed(() => {
  if (
    Array.isArray(props.company.documentosVerificacion) &&
    props.company.documentosVerificacion.length > 0
  ) {
    return props.company.documentosVerificacion;
  }
  if (Array.isArray(props.company.documents) && props.company.documents.length > 0) {
    return props.company.documents;
  }
  return [];
});
</script>
