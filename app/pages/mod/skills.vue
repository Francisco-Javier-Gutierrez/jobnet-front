<template>
  <div
    class="max-w-5xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-on-background mb-2">
        Aprobación de Catálogo (Moderador)
      </h1>
      <p class="text-on-surface-variant dark:text-slate-300 text-sm">
        Gestiona la cola de sugerencias de habilidades técnicas y sectores
        industriales propuestos por los usuarios.
      </p>
    </div>

    <!-- Category Selector / Tab Switcher -->
    <div
      class="flex items-center gap-2 mb-6 bg-surface-container-low/60 dark:bg-slate-900 p-1.5 rounded-2xl border border-outline-variant/40 w-fit"
    >
      <button
        type="button"
        @click="activeCategory = 'ALL'"
        :class="
          activeCategory === 'ALL'
            ? 'bg-primary text-white font-bold shadow-sm'
            : 'text-on-surface-variant hover:text-on-background'
        "
        class="px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
      >
        <span class="material-symbols-outlined text-sm">list_alt</span>
        <span>Todas ({{ allSuggestions.length }})</span>
      </button>

      <button
        type="button"
        @click="activeCategory = 'Habilidad'"
        :class="
          activeCategory === 'Habilidad'
            ? 'bg-primary text-white font-bold shadow-sm'
            : 'text-on-surface-variant hover:text-on-background'
        "
        class="px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
      >
        <span class="material-symbols-outlined text-sm">psychology</span>
        <span>Habilidades ({{ skillSuggestionsCount }})</span>
      </button>

      <button
        type="button"
        @click="activeCategory = 'Sector'"
        :class="
          activeCategory === 'Sector'
            ? 'bg-emerald-600 text-white font-bold shadow-sm'
            : 'text-on-surface-variant hover:text-on-background'
        "
        class="px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
      >
        <span class="material-symbols-outlined text-sm">business_center</span>
        <span>Sectores ({{ sectorSuggestionsCount }})</span>
      </button>
    </div>

    <!-- Suggestions Queue Card -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm"
    >
      <div
        class="p-6 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/20"
      >
        <h2
          class="text-sm font-bold text-on-background flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-primary text-base"
            >pending_actions</span
          >
          <span
            >Sugerencias en Cola —
            {{
              activeCategory === "ALL" ? "Catálogo Completo" : activeCategory
            }}</span
          >
        </h2>
        <span
          class="bg-secondary/10 text-secondary text-xs px-3 py-1 rounded-full font-bold"
        >
          {{ filteredSuggestions.length }} Pendiente{{
            filteredSuggestions.length !== 1 ? "s" : ""
          }}
        </span>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="p-8 space-y-4">
        <div
          v-for="n in 3"
          :key="n"
          class="animate-pulse flex items-center justify-between py-3 border-b border-outline-variant/20"
        >
          <div class="space-y-2 flex-grow">
            <div class="h-4 bg-outline-variant/30 rounded w-1/4"></div>
            <div class="h-3 bg-outline-variant/30 rounded w-1/6"></div>
          </div>
          <div class="h-8 bg-outline-variant/30 rounded w-32"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredSuggestions.length === 0"
        class="p-12 text-center flex flex-col items-center justify-center text-on-surface-variant dark:text-slate-300"
      >
        <span class="material-symbols-outlined text-[48px] text-primary/40 mb-3"
          >check_circle</span
        >
        <p class="text-sm font-semibold text-on-surface">Cola limpia</p>
        <p class="text-xs text-on-surface-variant dark:text-slate-300 mt-1">
          No hay sugerencias pendientes para
          {{
            activeCategory === "ALL"
              ? "ninguna categoría"
              : activeCategory.toLowerCase()
          }}.
        </p>
      </div>

      <!-- Suggestions Table -->
      <div v-else class="divide-y divide-outline-variant/30">
        <div
          v-for="sug in filteredSuggestions"
          :key="sug.id"
          class="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-surface-container-low/10 transition"
        >
          <div class="min-w-0 space-y-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-sm font-bold text-on-background">
                {{ sug.name }}
              </h3>
              <span
                :class="
                  sug.category === 'Sector'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                "
                class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-[12px]">
                  {{
                    sug.category === "Sector" ? "business_center" : "psychology"
                  }}
                </span>
                {{ sug.category }}
              </span>

              <!-- Direct Table Warning Badge for Pre-computed Similarity Match -->
              <span
                v-if="sug.hasDuplicate"
                class="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"
                :title="`Similar a '${sug.existingName}' en catálogo`"
              >
                <span class="material-symbols-outlined text-[12px]"
                  >warning</span
                >
                <span>Posible duplicado: "{{ sug.existingName }}"</span>
              </span>
            </div>
            <p class="text-xs text-on-surface-variant dark:text-slate-400">
              Sugerido el:
              {{
                sug.createdAt
                  ? new Date(sug.createdAt).toLocaleDateString()
                  : "Recientemente"
              }}
            </p>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              @click="approveItem(sug)"
              class="bg-secondary hover:bg-[#005236] text-white font-semibold text-xs px-4 py-2 rounded-xl transition active:scale-95 duration-100 shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <span class="material-symbols-outlined text-sm">check</span>
              Aprobar
            </button>
            <button
              type="button"
              @click="rejectItem(sug.id)"
              class="bg-surface border border-outline-variant hover:border-rose-600 text-on-surface-variant dark:text-slate-300 hover:text-rose-600 font-semibold text-xs px-4 py-2 rounded-xl transition active:scale-95 duration-100 cursor-pointer"
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Advertencia por Similitud / 3 Opciones de Unificación -->
    <AppModal
      v-model="showWarningModal"
      title="Posible duplicado detectado"
      icon="warning"
      icon-bg-class="bg-amber-500/10 text-amber-500"
      max-width="md"
    >
      <div class="space-y-2">
        <p
          class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
        >
          Se ha detectado que la sugerencia
          <strong class="text-on-background"
            >"{{ selectedSuggestion?.name }}"</strong
          >
          es muy similar al
          {{ (selectedSuggestion?.category || "elemento").toLowerCase() }}
          existente en catálogo
          <strong class="text-primary">"{{ existingItemName }}"</strong>.
        </p>
        <p
          class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed font-semibold"
        >
          ¿Qué acción deseas realizar con esta sugerencia?
        </p>
      </div>

      <template #footer>
        <div class="flex flex-col gap-2.5 w-full">
          <!-- Option 1: Keep existing catalog name -->
          <button
            type="button"
            @click="handleResolveChoice('KEEP_EXISTING')"
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span class="material-symbols-outlined text-sm">check_circle</span>
            <span>Quedarme con "{{ existingItemName }}" (Recomendado)</span>
          </button>

          <!-- Option 2: Keep suggested name (replace existing catalog name) -->
          <button
            type="button"
            @click="handleResolveChoice('REPLACE_EXISTING')"
            class="w-full bg-primary hover:bg-primary-container text-white font-bold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span class="material-symbols-outlined text-sm">edit</span>
            <span
              >Quedarme con "{{ selectedSuggestion?.name }}" (Reemplazar
              nombre)</span
            >
          </button>

          <!-- Option 3: Add anyway as new independent catalog item -->
          <button
            type="button"
            @click="handleResolveChoice('ADD_ANYWAY')"
            class="w-full bg-surface border border-outline-variant hover:bg-surface-container text-on-surface font-semibold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span class="material-symbols-outlined text-sm">add</span>
            <span
              >Agregar de todas formas como nuevo
              {{
                (selectedSuggestion?.category || "elemento").toLowerCase()
              }}</span
            >
          </button>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Aprobación de Catálogo (Habilidades y Sectores) - JobNet",
  description:
    "Bandeja de moderación para nuevas habilidades técnicas y sectores industriales sugeridos",
});

const config = useRuntimeConfig();
const allSuggestions = ref<any[]>([]);
const activeCategory = ref<"ALL" | "Habilidad" | "Sector">("ALL");
const loading = ref(true);

// Modal state
const showWarningModal = ref(false);
const selectedSuggestion = ref<any | null>(null);
const existingItemName = ref("");

const skillSuggestionsCount = computed(
  () => allSuggestions.value.filter((s) => s.category === "Habilidad").length,
);

const sectorSuggestionsCount = computed(
  () => allSuggestions.value.filter((s) => s.category === "Sector").length,
);

const filteredSuggestions = computed(() => {
  if (activeCategory.value === "ALL") return allSuggestions.value;
  return allSuggestions.value.filter(
    (s) => s.category === activeCategory.value,
  );
});

const fetchSuggestions = async () => {
  loading.value = true;
  try {
    const data = await $fetch<any[]>(
      `${config.public.apiUrl}/moderator/skills/suggestions`,
    );
    allSuggestions.value = data || [];
  } catch (e) {
    console.error("Error loading catalog suggestions:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSuggestions();
});

const approveItem = async (sug: any) => {
  selectedSuggestion.value = sug;

  // If backend precomputed duplicate match on list fetch
  if (sug.hasDuplicate && sug.existingName) {
    existingItemName.value = sug.existingName;
    showWarningModal.value = true;
    return;
  }

  try {
    const res = await $fetch<any>(
      `${config.public.apiUrl}/moderator/skills/suggestions/${sug.id}/resolve`,
      {
        method: "POST",
        body: {
          approve: true,
        },
      },
    );

    if (res.duplicate) {
      existingItemName.value = res.existingName;
      showWarningModal.value = true;
    } else {
      allSuggestions.value = allSuggestions.value.filter(
        (s) => s.id !== sug.id,
      );
    }
  } catch (e) {
    console.error("Error approving catalog suggestion:", e);
  }
};

const handleResolveChoice = async (
  mode: "KEEP_EXISTING" | "REPLACE_EXISTING" | "ADD_ANYWAY",
) => {
  if (!selectedSuggestion.value) return;

  const payload: any = {
    approve: true,
  };

  if (mode === "KEEP_EXISTING") {
    payload.unifyWith = existingItemName.value;
    payload.unifyMode = "KEEP_EXISTING";
  } else if (mode === "REPLACE_EXISTING") {
    payload.unifyWith = existingItemName.value;
    payload.unifyMode = "REPLACE_EXISTING";
  } else if (mode === "ADD_ANYWAY") {
    payload.addAnyway = true;
  }

  try {
    await $fetch(
      `${config.public.apiUrl}/moderator/skills/suggestions/${selectedSuggestion.value.id}/resolve`,
      {
        method: "POST",
        body: payload,
      },
    );
    allSuggestions.value = allSuggestions.value.filter(
      (s) => s.id !== selectedSuggestion.value.id,
    );
    showWarningModal.value = false;
    selectedSuggestion.value = null;
  } catch (e) {
    console.error("Error resolving catalog item choice:", e);
  }
};

const rejectItem = async (id: string) => {
  try {
    await $fetch(
      `${config.public.apiUrl}/moderator/skills/suggestions/${id}/resolve`,
      {
        method: "POST",
        body: {
          approve: false,
        },
      },
    );
    allSuggestions.value = allSuggestions.value.filter((s) => s.id !== id);
  } catch (e) {
    console.error("Error rejecting suggestion:", e);
  }
};
</script>
