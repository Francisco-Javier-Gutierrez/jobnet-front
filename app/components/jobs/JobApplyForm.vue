<template>
  <div id="apply-section" class="space-y-4 text-left">
    <h2 class="text-base font-bold text-on-background flex items-center gap-2">
      <span class="material-symbols-outlined text-primary text-xl">send</span>
      Presentar Solicitud de Empleo
    </h2>

    <div
      v-if="job.estado === 'EVALUACION'"
      class="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-800 text-xs leading-relaxed space-y-1"
    >
      <p class="font-bold flex items-center gap-1.5">
        <span class="material-symbols-outlined text-base">warning</span>
        Postulaciones pausadas
      </p>
      <p>
        Esta vacante se encuentra en revisión por moderadores. No se permiten
        nuevas postulaciones por el momento.
      </p>
    </div>

    <div
      v-else-if="hasApplied"
      class="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-emerald-800 text-xs leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
    >
      <div class="flex items-center gap-3.5">
        <span class="material-symbols-outlined text-emerald-600 text-4xl"
          >check_circle</span
        >
        <div>
          <p class="font-bold text-sm text-emerald-950">
            ¡Solicitud de empleo transmitida con éxito!
          </p>
          <p class="text-emerald-800">
            Tu perfil profesional y currículum han sido vinculados a esta
            convocatoria de <strong>{{ job.company }}</strong
            >.
          </p>
        </div>
      </div>
      <NuxtLink
        :to="`/messages?jobId=${jobId}&candidateId=${session?.user?.id || ''}`"
        class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md flex-shrink-0"
      >
        <span class="material-symbols-outlined text-sm">forum</span>
        Ir al Chat Privado
      </NuxtLink>
    </div>

    <div
      v-else
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 p-6 rounded-3xl space-y-5 shadow-sm"
    >
      <div
        class="border-b border-outline-variant/30 pb-3 flex items-center justify-between flex-wrap gap-2"
      >
        <div>
          <h3
            class="text-sm font-bold text-on-background flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-primary text-xl"
              >edit_note</span
            >
            Formulario de Postulación Directa
          </h3>
          <p class="text-xs text-on-surface-variant dark:text-slate-400">
            Personaliza la presentación que recibirá el equipo de reclutamiento
            de {{ job.company }}.
          </p>
        </div>

        <div
          v-if="profileCvUrl"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 rounded-xl text-xs font-bold whitespace-nowrap"
          title="Tu CV principal va adjunto de forma obligatoria y segura"
        >
          <span class="material-symbols-outlined text-sm text-emerald-600"
            >lock</span
          >
          <span class="material-symbols-outlined text-sm">picture_as_pdf</span>
          <span>CV: {{ profileCvName }}</span>
        </div>
        <div
          v-else
          class="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 rounded-xl text-xs font-bold whitespace-nowrap"
        >
          <span class="material-symbols-outlined text-sm">warning</span>
          <span>Sin CV en Perfil</span>
        </div>
      </div>

      <div class="space-y-1.5">
        <label
          class="text-xs font-bold text-on-background flex items-center justify-between"
        >
          <span>Mensaje de Presentación o Carta de Motivos</span>
          <span class="text-[10px] text-on-surface-variant font-normal"
            >Opcional</span
          >
        </label>
        <textarea
          :value="coverLetterInput"
          @input="
            $emit(
              'update:coverLetterInput',
              ($event.target as HTMLTextAreaElement).value,
            )
          "
          rows="3"
          placeholder="Escribe una breve introducción para el reclutador destacando tu motivación y experiencia relevante..."
          class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-2xl p-3.5 text-xs text-on-background outline-none transition placeholder-on-surface-variant/50 resize-none font-sans"
        ></textarea>
      </div>

      <div v-if="candidateProfileLinks.length > 0" class="space-y-2">
        <label
          class="text-xs font-bold text-on-background flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-sm text-primary"
            >link</span
          >
          Adjuntar Enlaces o Portafolios de tu Perfil
        </label>
        <div class="flex flex-wrap gap-2.5">
          <label
            v-for="link in candidateProfileLinks"
            :key="link.url"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition select-none"
            :class="
              selectedProfileLinks.includes(link.url)
                ? 'bg-primary/10 border-primary text-primary font-bold'
                : 'bg-surface border-outline-variant/50 text-on-surface-variant hover:border-outline'
            "
          >
            <input
              type="checkbox"
              :value="link.url"
              :checked="selectedProfileLinks.includes(link.url)"
              @change="
                (e) =>
                  updateLinksArray(
                    link.url,
                    (e.target as HTMLInputElement).checked,
                  )
              "
              class="rounded text-primary focus:ring-primary h-3.5 w-3.5"
            />
            <span>{{ link.label }}: {{ link.url }}</span>
          </label>
        </div>
      </div>

      <div v-if="candidateProfileDocs.length > 0" class="space-y-2">
        <label
          class="text-xs font-bold text-on-background flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-sm text-secondary"
            >folder_zip</span
          >
          Adjuntar Documentos y Certificaciones Adicionales
        </label>
        <div class="flex flex-wrap gap-2.5">
          <label
            v-for="doc in candidateProfileDocs"
            :key="doc.url"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition select-none"
            :class="
              selectedProfileDocs.includes(doc.url)
                ? 'bg-secondary/10 border-secondary text-secondary font-bold'
                : 'bg-surface border-outline-variant/50 text-on-surface-variant hover:border-outline'
            "
          >
            <input
              type="checkbox"
              :value="doc.url"
              :checked="selectedProfileDocs.includes(doc.url)"
              @change="
                (e) =>
                  updateDocsArray(
                    doc.url,
                    (e.target as HTMLInputElement).checked,
                  )
              "
              class="rounded text-secondary focus:ring-secondary h-3.5 w-3.5"
            />
            <span>📄 {{ doc.name }}</span>
          </label>
        </div>
      </div>

      <div
        class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/20"
      >
        <p
          class="text-[11px] text-on-surface-variant dark:text-slate-400 italic"
        >
          🔒 Tu CV principal va preseleccionado y enlazado a tu solicitud.
        </p>

        <button
          type="button"
          @click="$emit('easyApply')"
          :disabled="isApplying"
          class="w-full sm:w-auto bg-primary hover:bg-primary-container text-white font-bold text-xs px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-primary/20 active:scale-95 disabled:opacity-50 flex-shrink-0"
        >
          <span
            v-if="isApplying"
            class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"
            aria-hidden="true"
          ></span>
          <span v-else class="material-symbols-outlined text-sm">send</span>
          <span>{{
            isApplying
              ? "Enviando Candidatura..."
              : "Enviar Solicitud de Empleo"
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Job } from "~/types";
import type { Session } from "next-auth";

const props = defineProps<{
  job: Job;
  jobId: string;
  hasApplied: boolean;
  isApplying: boolean;
  session: Session | null;
  profileCvUrl: string;
  profileCvName: string;
  coverLetterInput: string;
  candidateProfileLinks: { label: string; url: string }[];
  candidateProfileDocs: { name: string; url: string }[];
  selectedProfileLinks: string[];
  selectedProfileDocs: string[];
}>();

const emit = defineEmits<{
  (e: "easyApply"): void;
  (e: "update:coverLetterInput", value: string): void;
  (e: "update:selectedProfileLinks", value: string[]): void;
  (e: "update:selectedProfileDocs", value: string[]): void;
}>();

const updateLinksArray = (url: string, checked: boolean) => {
  let newLinks = [...props.selectedProfileLinks];
  if (checked) {
    if (!newLinks.includes(url)) newLinks.push(url);
  } else {
    newLinks = newLinks.filter((l) => l !== url);
  }
  emit("update:selectedProfileLinks", newLinks);
};

const updateDocsArray = (url: string, checked: boolean) => {
  let newDocs = [...props.selectedProfileDocs];
  if (checked) {
    if (!newDocs.includes(url)) newDocs.push(url);
  } else {
    newDocs = newDocs.filter((d) => d !== url);
  }
  emit("update:selectedProfileDocs", newDocs);
};
</script>
