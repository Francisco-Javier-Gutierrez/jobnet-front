<template>
  <div
    class="max-w-5xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-on-background mb-2">
        Aprobación de Habilidades (Moderador)
      </h1>
      <p class="text-on-surface-variant dark:text-slate-300 text-sm">
        Gestiona la cola de sugerencias de nuevas habilidades propuestas por
        candidates y reclutadores.
      </p>
    </div>

    <!-- Skills queue card -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm"
    >
      <div
        class="p-6 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/20"
      >
        <h2 class="text-sm font-bold text-on-background">
          Habilidades Sugeridas
        </h2>
        <span
          class="bg-secondary/10 text-secondary text-xs px-2.5 py-0.5 rounded-full font-bold"
          >{{ suggestions.length }} Pendiente{{
            suggestions.length !== 1 ? "s" : ""
          }}</span
        >
      </div>

      <!-- Loading skeleton -->
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
        v-else-if="suggestions.length === 0"
        class="p-12 text-center flex flex-col items-center justify-center text-on-surface-variant dark:text-slate-300"
      >
        <span class="material-symbols-outlined text-[48px] text-primary/40 mb-3"
          >tag</span
        >
        <p class="text-sm font-semibold text-on-surface">Cola limpia</p>
        <p class="text-xs text-on-surface-variant dark:text-slate-300 mt-1">
          No hay sugerencias de habilidades técnicas sugeridas por los usuarios.
        </p>
      </div>

      <!-- Suggestions Table -->
      <div v-else class="divide-y divide-outline-variant/30">
        <div
          v-for="sug in suggestions"
          :key="sug.id"
          class="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div class="min-w-0">
            <h3 class="text-sm font-bold text-on-background mb-1">
              {{ sug.name }}
            </h3>
            <p class="text-xs text-on-surface-variant dark:text-slate-300">
              Sugerida el: {{ new Date(sug.createdAt).toLocaleDateString() }}
            </p>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <button
              @click="approveSkill(sug)"
              class="bg-secondary hover:bg-[#005236] text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition active:scale-95 duration-100 shadow-sm flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-sm">check</span>
              Aprobar
            </button>
            <button
              @click="resolve(sug.id, false)"
              class="bg-surface border border-outline-variant hover:border-rose-600 text-on-surface-variant dark:text-slate-300 hover:text-rose-600 font-semibold text-xs px-3.5 py-2 rounded-lg transition active:scale-95 duration-100"
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Advertencia por Similitud / Duplicidad -->
    <div
      v-if="showWarningModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white border border-outline-variant/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
      >
        <div
          class="flex items-center justify-between border-b border-outline-variant/30 pb-3"
        >
          <h3
            class="text-base font-bold text-on-background flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-amber-500"
              >warning</span
            >
            Posible habilidad duplicada
          </h3>
          <button
            @click="showWarningModal = false"
            class="text-on-surface-variant dark:text-slate-300 hover:bg-surface-container rounded-lg p-1 transition flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <div class="space-y-2">
          <p
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
          >
            Se ha detectado una coincidencia léxica alta. La habilidad sugerida
            <strong class="text-on-background"
              >"{{ selectedSuggestion?.name }}"</strong
            >
            es muy similar a la habilidad existente
            <strong class="text-primary">"{{ existingSkillName }}"</strong>.
          </p>
          <p
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed font-semibold"
          >
            Selecciona la acción para resolver esta sugerencia:
          </p>
        </div>

        <div class="flex flex-col gap-2 pt-2">
          <button
            @click="resolveUnify(true)"
            class="w-full bg-primary text-white font-bold text-xs py-3 rounded-xl hover:bg-primary-container transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span class="material-symbols-outlined text-sm">call_merge</span>
            Unificar con "{{ existingSkillName }}" (Recomendado)
          </button>
          <button
            @click="resolveUnify(false)"
            class="w-full bg-surface border border-outline-variant hover:bg-surface-container text-on-surface font-semibold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-sm">add</span>
            Aprobar como nueva habilidad independiente
          </button>
          <button
            @click="showWarningModal = false"
            class="w-full bg-surface text-on-surface-variant dark:text-slate-300 hover:underline font-semibold text-xs py-2 rounded-xl transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Aprobación de Habilidades - JobNet",
  description: "Bandeja de moderación para nuevas habilidades técnicas",
});

const config = useRuntimeConfig();
const suggestions = ref<any[]>([]);
const loading = ref(true);

// Modal state
const showWarningModal = ref(false);
const selectedSuggestion = ref<any | null>(null);
const existingSkillName = ref("");

const fetchSuggestions = async () => {
  loading.value = true;
  try {
    const data = await $fetch<any[]>(
      `${config.public.apiUrl}/moderator/skills/suggestions`,
    );
    suggestions.value = data || [];
  } catch (e) {
    console.error("Error loading skill suggestions:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSuggestions();
});

const approveSkill = async (sug: any) => {
  selectedSuggestion.value = sug;
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
      existingSkillName.value = res.existingName;
      showWarningModal.value = true;
    } else {
      suggestions.value = suggestions.value.filter((s) => s.id !== sug.id);
    }
  } catch (e) {
    console.error("Error approving skill:", e);
  }
};

const resolveUnify = async (unify: boolean) => {
  if (!selectedSuggestion.value) return;
  const unifyWith = unify
    ? existingSkillName.value
    : selectedSuggestion.value.name;

  try {
    await $fetch(
      `${config.public.apiUrl}/moderator/skills/suggestions/${selectedSuggestion.value.id}/resolve`,
      {
        method: "POST",
        body: {
          approve: true,
          unifyWith,
        },
      },
    );
    suggestions.value = suggestions.value.filter(
      (s) => s.id !== selectedSuggestion.value.id,
    );
    showWarningModal.value = false;
    selectedSuggestion.value = null;
  } catch (e) {
    console.error("Error resolving unified skill:", e);
  }
};

const resolve = async (id: string, approve: boolean) => {
  try {
    await $fetch(
      `${config.public.apiUrl}/moderator/skills/suggestions/${id}/resolve`,
      {
        method: "POST",
        body: {
          approve,
        },
      },
    );
    suggestions.value = suggestions.value.filter((s) => s.id !== id);
  } catch (e) {
    console.error("Error rejecting skill suggestion:", e);
  }
};
</script>
