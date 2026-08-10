<template>
  <section class="px-margin-mobile mb-10 space-y-6">
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 p-6 rounded-2xl shadow-sm border border-outline-variant/50 space-y-6"
    >
      <div>
        <h2
          class="font-headline-sm text-headline-sm text-on-surface mb-3 flex items-center gap-2 border-b border-outline-variant/30 pb-2"
        >
          <span class="material-symbols-outlined text-primary">domain</span>
          Acerca de nosotros
        </h2>
        <p
          class="font-body-md text-body-md text-on-surface-variant dark:text-slate-300 leading-relaxed"
        >
          {{ company.about }}
        </p>
      </div>

      <!-- Misión y Visión Grid -->
      <div
        v-if="company.mision || company.vision"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div
          v-if="company.mision"
          class="bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-xl space-y-2"
        >
          <h3
            class="font-bold text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider"
          >
            <span class="material-symbols-outlined text-base text-indigo-600"
              >flag</span
            >
            Misión Corporativa
          </h3>
          <p
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
          >
            {{ company.mision }}
          </p>
        </div>

        <div
          v-if="company.vision"
          class="bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 p-4 rounded-xl space-y-2"
        >
          <h3
            class="font-bold text-xs text-purple-700 dark:text-purple-300 flex items-center gap-1.5 uppercase tracking-wider"
          >
            <span class="material-symbols-outlined text-base text-purple-600"
              >visibility</span
            >
            Visión Corporativa
          </h3>
          <p
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
          >
            {{ company.vision }}
          </p>
        </div>
      </div>

      <!-- Beneficios y Cultura Laboral -->
      <div
        v-if="company.beneficios"
        class="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-xl space-y-2"
      >
        <h3
          class="font-bold text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider"
        >
          <span class="material-symbols-outlined text-base text-emerald-600"
            >card_giftcard</span
          >
          Beneficios y Cultura Laboral
        </h3>
        <p
          class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed whitespace-pre-line"
        >
          {{ company.beneficios }}
        </p>
      </div>

      <!-- Presencia de Marca / Redes Oficiales -->
      <div
        v-if="webLinks && webLinks.length > 0"
        class="pt-4 border-t border-outline-variant/30"
      >
        <h3
          class="font-bold text-sm text-on-surface mb-3 flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-primary text-base"
            >public</span
          >
          Presencia de Marca y Redes Oficiales
        </h3>
        <div class="flex flex-wrap gap-3">
          <a
            v-for="link in webLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 rounded-lg transition-colors text-xs font-semibold text-on-surface"
          >
            <span class="material-symbols-outlined text-primary text-base">{{
              link.icon
            }}</span>
            {{ link.name }}
          </a>
        </div>
      </div>
    </div>

    <!-- Documentos Corporativos Relevantes (ISO, NOMs, Certificados) -->
    <div
      v-if="company.documents && company.documents.length > 0"
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 p-6 rounded-2xl shadow-sm border border-outline-variant/50 space-y-4"
    >
      <h2
        class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 border-b border-outline-variant/30 pb-2"
      >
        <span class="material-symbols-outlined text-rose-600 dark:text-rose-400"
          >verified</span
        >
        Documentos Corporativos Relevantes
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="doc in company.documents"
          :key="doc.id || doc.url"
          class="bg-surface-container-low/40 dark:bg-slate-800/40 border border-outline-variant/50 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between gap-3 shadow-sm"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center flex-shrink-0"
            >
              <span class="material-symbols-outlined text-xl"
                >workspace_premium</span
              >
            </div>
            <div class="min-w-0">
              <span
                class="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800"
              >
                {{ doc.tipo || "Certificación" }}
              </span>
              <p class="text-xs font-bold text-on-background truncate mt-1">
                {{ doc.nombre || "Documento.pdf" }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="$emit('previewDoc', doc)"
              class="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-sm active:scale-95"
            >
              <span class="material-symbols-outlined text-sm">visibility</span>
              Ver
            </button>
            <a
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
  </section>
</template>

<script setup lang="ts">
defineProps<{
  company: any;
  webLinks?: Array<{ name: string; url: string; icon: string }>;
}>();

defineEmits(["previewDoc"]);
</script>
