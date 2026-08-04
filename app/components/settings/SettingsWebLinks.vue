<template>
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
  >
    <div class="flex items-center justify-between">
      <h2
        class="text-base font-bold text-on-background flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-primary">link</span>
        Enlaces Web, Portafolios y Repositorios
      </h2>
      <span
        class="text-xs text-on-surface-variant font-medium bg-surface-container-low px-2.5 py-1 rounded-full border border-outline-variant/40"
      >
        {{ linkList.length }} {{ linkList.length === 1 ? "enlace" : "enlaces" }}
      </span>
    </div>
    <p
      class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
    >
      Agrega las direcciones URL de tu sitio web personal, portafolio de
      proyectos, perfil de GitHub, LinkedIn u otros sitios relevantes para que
      los reclutadores los consulten.
    </p>

    <!-- Form to Add New Web Link -->
    <div
      class="bg-surface-container-low/40 dark:bg-slate-950 p-4 rounded-xl border border-outline-variant/40 space-y-3"
    >
      <h3
        class="text-xs font-bold text-on-background flex items-center gap-1.5"
      >
        <span class="material-symbols-outlined text-sm text-primary"
          >add_link</span
        >
        Agregar Nuevo Enlace
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            class="text-[11px] font-bold text-on-surface-variant dark:text-slate-400 block mb-1"
          >
            Etiqueta / Nombre del Sitio
          </label>
          <input
            v-model="newLinkLabel"
            type="text"
            placeholder="Ej: Portafolio Personal, GitHub, LinkedIn..."
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
          />
        </div>

        <div>
          <label
            class="text-[11px] font-bold text-on-surface-variant dark:text-slate-400 block mb-1"
          >
            Dirección URL
          </label>
          <input
            v-model="newLinkUrl"
            type="url"
            placeholder="https://mi-portafolio.dev"
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
          />
        </div>
      </div>

      <p v-if="linkError" class="text-xs text-rose-600 font-semibold">
        {{ linkError }}
      </p>

      <div class="flex justify-end pt-1">
        <button
          type="button"
          @click="addLink"
          :disabled="!newLinkLabel.trim() || !newLinkUrl.trim()"
          class="bg-primary hover:bg-primary-container text-white disabled:bg-primary/40 text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
        >
          <span class="material-symbols-outlined text-sm">add</span>
          <span>Agregar Enlace</span>
        </button>
      </div>
    </div>

    <!-- Added Links List -->
    <div v-if="linkList.length > 0" class="space-y-2 pt-1">
      <h3
        class="text-xs font-bold text-on-background uppercase tracking-wider flex items-center justify-between"
      >
        <span>Enlaces Registrados ({{ linkList.length }})</span>
        <span class="text-[10px] text-on-surface-variant font-normal"
          >Pulsa "Guardar Cambios" al finalizar</span
        >
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="(link, index) in linkList"
          :key="link.url || index"
          class="flex items-center justify-between p-3 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/50 rounded-xl shadow-sm hover:border-primary/40 transition"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-bold"
            >
              <span class="material-symbols-outlined text-lg">
                {{ getIconForLink(link.label, link.url) }}
              </span>
            </div>
            <div class="min-w-0">
              <p class="text-xs font-bold text-on-background truncate">
                {{ link.label || "Enlace Web" }}
              </p>
              <a
                :href="link.url"
                target="_blank"
                rel="noopener"
                class="text-[10px] text-primary hover:underline font-medium block truncate"
              >
                {{ link.url }} ↗
              </a>
            </div>
          </div>

          <button
            type="button"
            @click="removeLink(index)"
            class="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition ml-2 flex-shrink-0"
            title="Eliminar enlace"
          >
            <span class="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

export interface WebLinkItem {
  label: string;
  url: string;
}

const props = withDefaults(
  defineProps<{
    links?: any;
  }>(),
  {
    links: () => [],
  },
);

const emit = defineEmits<{
  (e: "update:links", value: WebLinkItem[]): void;
}>();

const newLinkLabel = ref("");
const newLinkUrl = ref("");
const linkError = ref("");

const linkList = computed<WebLinkItem[]>(() => {
  const raw = props.links;
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    return Object.entries(raw).map(([label, url]) => ({
      label,
      url: typeof url === "string" ? url : (url as any)?.url || "",
    }));
  }
  return [];
});

function getIconForLink(label: string, url: string): string {
  const text = `${label} ${url}`.toLowerCase();
  if (text.includes("github")) return "code";
  if (text.includes("linkedin")) return "badge";
  if (text.includes("portfolio") || text.includes("portafolio"))
    return "language";
  if (text.includes("twitter") || text.includes("x.com")) return "tag";
  return "link";
}

function addLink() {
  linkError.value = "";
  if (!newLinkLabel.value.trim() || !newLinkUrl.value.trim()) return;

  let url = newLinkUrl.value.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  const updated = [
    ...linkList.value,
    {
      label: newLinkLabel.value.trim(),
      url,
    },
  ];

  emit("update:links", updated);
  newLinkLabel.value = "";
  newLinkUrl.value = "";
}

function removeLink(index: number) {
  const updated = [...linkList.value];
  updated.splice(index, 1);
  emit("update:links", updated);
}
</script>
