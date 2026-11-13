<template>
  <section v-if="documents.length > 0">
    <h2
      class="font-headline-md text-headline-md text-on-background dark:text-slate-100 mb-md flex items-center gap-sm px-1"
    >
      <span class="material-symbols-outlined text-secondary"
        >workspace_premium</span
      >
      Documentos y Certificaciones
    </h2>
    <div
      class="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
    >
      <div
        v-for="doc in documents"
        :key="doc.name"
        class="snap-start shrink-0 w-72 bg-surface-container-low border border-surface-container hover:border-primary-container p-md rounded-xl flex items-start gap-md transition-all group shadow-xs hover:shadow-md"
      >
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
          :class="[
            doc.type === 'pdf'
              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
              : doc.type === 'link' || doc.esEnlaceExterno
                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                : 'bg-surface-container-high text-primary',
          ]"
        >
          <span class="material-symbols-outlined">{{
            doc.type === "pdf"
              ? "picture_as_pdf"
              : doc.type === "link" || doc.esEnlaceExterno
                ? "verified"
                : "description"
          }}</span>
        </div>
        <div class="flex-grow min-w-0">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span
              v-if="doc.esEnlaceExterno || doc.type === 'link'"
              class="text-[9px] font-bold text-blue-700 dark:text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded"
            >
              Verificable
            </span>
            <span
              v-else
              class="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5"
            >
              <span class="material-symbols-outlined text-[10px]">shield</span>
              Acceso seguro
            </span>
          </div>
          <h3
            class="font-label-md text-label-md text-on-surface truncate group-hover:text-primary transition-colors mt-0.5"
            :title="doc.name"
          >
            {{ doc.name }}
          </h3>
          <p
            class="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-300 mb-2 truncate text-xs"
          >
            {{ doc.meta }}
          </p>
          <div class="flex gap-3">
            <template v-if="doc.esEnlaceExterno || doc.type === 'link'">
              <a
                :href="doc.url"
                target="_blank"
                rel="noopener noreferrer"
                @click="handleExternalOpen(doc)"
                class="text-blue-600 dark:text-blue-400 hover:underline font-label-sm text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span class="material-symbols-outlined text-[15px]"
                  >open_in_new</span
                >
                <span>Verificar</span>
              </a>
            </template>
            <template v-else>
              <button
                type="button"
                @click="$emit('open', doc.url, doc.name)"
                class="text-primary hover:underline font-label-sm text-xs font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <span class="material-symbols-outlined text-[15px]"
                  >visibility</span
                >
                <span>Ver</span>
              </button>
              <a
                :href="doc.url"
                download
                target="_blank"
                rel="noopener noreferrer"
                @click="handleDownload(doc)"
                class="text-secondary hover:underline font-label-sm text-xs font-bold flex items-center gap-0.5"
              >
                <span class="material-symbols-outlined text-[15px]"
                  >download</span
                >
                <span>Descargar</span>
              </a>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCvInteraction } from "~/composables/useCvInteraction";

const props = defineProps<{
  documents: Array<{
    name: string;
    meta: string;
    type: string;
    url: string;
    esEnlaceExterno?: boolean;
  }>;
  candidateId?: string;
  isOwner?: boolean;
}>();

defineEmits<{
  (e: "open", url: string, title: string): void;
}>();

const isCvDoc = (doc: any) => {
  const name = (doc.name || "").toLowerCase();
  const meta = (doc.meta || "").toLowerCase();
  return (
    name.includes("cv") ||
    name.includes("curriculum") ||
    meta.includes("cv") ||
    meta.includes("curriculum")
  );
};

const handleDownload = (doc: any) => {
  if (!props.isOwner && props.candidateId && isCvDoc(doc)) {
    const { notifyCvInteraction } = useCvInteraction();
    notifyCvInteraction(props.candidateId, { action: "DOWNLOAD" });
  }
};

const handleExternalOpen = (doc: any) => {
  if (!props.isOwner && props.candidateId && isCvDoc(doc)) {
    const { notifyCvInteraction } = useCvInteraction();
    notifyCvInteraction(props.candidateId, { action: "OPEN" });
  }
};
</script>
