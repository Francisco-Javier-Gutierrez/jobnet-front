<template>
  <section v-if="documents.length > 0">
    <h2
      class="font-headline-md text-headline-md text-on-background dark:text-slate-100 mb-md flex items-center gap-sm px-1"
    >
      <span class="material-symbols-outlined">description</span>
      Documentos
    </h2>
    <div
      class="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
    >
      <div
        v-for="doc in documents"
        :key="doc.name"
        class="snap-start shrink-0 w-64 bg-surface-container-low border border-surface-container hover:border-primary-container p-md rounded-lg flex items-start gap-md transition-all group shadow-sm hover:shadow-md"
      >
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
          :class="
            doc.type === 'pdf'
              ? 'bg-error-container text-on-error-container'
              : 'bg-surface-container-high text-primary'
          "
        >
          <span class="material-symbols-outlined">{{
            doc.type === "pdf" ? "picture_as_pdf" : "image"
          }}</span>
        </div>
        <div class="flex-grow min-w-0">
          <h3
            class="font-label-md text-label-md text-on-surface truncate w-36 group-hover:text-primary transition-colors"
          >
            {{ doc.name }}
          </h3>
          <p
            class="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-300 mb-2"
          >
            {{ doc.meta }}
          </p>
          <div class="flex gap-3">
            <button
              @click="$emit('open', doc.url, doc.name)"
              class="text-primary hover:underline font-label-sm text-label-sm flex items-center gap-0.5 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]"
                >visibility</span
              >
              Ver
            </button>
            <a
              :href="doc.url"
              download
              target="_blank"
              class="text-secondary hover:underline font-label-sm text-label-sm flex items-center gap-0.5"
            >
              <span class="material-symbols-outlined text-[16px]"
                >download</span
              >
              Descargar
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  documents: Array<{ name: string; meta: string; type: string; url: string }>;
}>();
defineEmits<{
  (e: "open", url: string, title: string): void;
}>();
</script>
