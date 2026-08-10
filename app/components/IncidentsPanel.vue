<template>
  <!-- Incident list card -->
  <div
    class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm"
  >
    <div
      class="p-6 border-b border-outline-variant/60 flex flex-col md:flex-row md:items-center justify-between bg-surface-container-low/20 gap-4"
    >
      <div class="flex items-center gap-4">
        <h2 class="text-sm font-bold text-on-background">Denuncias en cola</h2>
        <span
          class="bg-primary/10 text-primary text-xs px-2.5 py-0.5 rounded-full font-bold"
          >{{ displayedIncidents.length }} Pendiente{{
            displayedIncidents.length !== 1 ? "s" : ""
          }}</span
        >
      </div>
      <div
        class="flex flex-wrap gap-1 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/50"
      >
        <button
          @click="activeTab = 'ALL'"
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-md transition',
            activeTab === 'ALL'
              ? 'bg-primary text-white'
              : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-low',
          ]"
        >
          Todas
        </button>
        <button
          @click="activeTab = 'VACANTE'"
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-md transition',
            activeTab === 'VACANTE'
              ? 'bg-primary text-white'
              : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-low',
          ]"
        >
          Vacantes
        </button>
        <button
          @click="activeTab = 'POST'"
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-md transition',
            activeTab === 'POST'
              ? 'bg-primary text-white'
              : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-low',
          ]"
        >
          Publicaciones
        </button>
        <button
          @click="activeTab = 'ORGANIZACION'"
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-md transition',
            activeTab === 'ORGANIZACION'
              ? 'bg-primary text-white'
              : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-low',
          ]"
        >
          Organizaciones
        </button>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="p-8 space-y-6">
      <div
        v-for="n in 2"
        :key="n"
        class="animate-pulse flex flex-col sm:flex-row justify-between gap-4"
      >
        <div class="flex-grow space-y-2">
          <div class="h-3 bg-outline-variant/30 rounded w-16"></div>
          <div class="h-4 bg-outline-variant/30 rounded w-1/3"></div>
          <div class="h-3 bg-outline-variant/30 rounded w-1/4"></div>
          <div class="h-3 bg-outline-variant/30 rounded w-2/3"></div>
        </div>
        <div class="h-10 bg-outline-variant/30 rounded w-32 self-center"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="displayedIncidents.length === 0"
      class="p-12 text-center flex flex-col items-center justify-center text-on-surface-variant dark:text-slate-300"
    >
      <span class="material-symbols-outlined text-[48px] text-primary/40 mb-3"
        >gavel</span
      >
      <p class="text-sm font-semibold text-on-surface">
        Sin incidencias activas
      </p>
      <p class="text-xs text-on-surface-variant dark:text-slate-300 mt-1">
        No hay reportes de vacantes u organizaciones pendientes de revisión.
      </p>
    </div>

    <!-- Incidents list -->
    <div v-else class="divide-y divide-outline-variant/30">
      <div
        v-for="inc in displayedIncidents"
        :key="inc.id"
        class="p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-2">
            <span
              class="text-[9px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded"
            >
              #{{ inc.id.substring(0, 8) }}
            </span>
            <span
              class="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-rose-500/10 text-rose-600 border border-rose-500/20"
            >
              {{ inc.severity }}
            </span>
            <span
              class="text-[10px] bg-outline-variant/40 text-on-surface-variant dark:text-slate-300 px-2 py-0.5 rounded font-bold uppercase"
              >{{ inc.infraccion }}</span
            >
            <span
              class="text-xs text-on-surface-variant dark:text-slate-300"
              v-if="inc.fechaCreacion"
            >
              {{ new Date(inc.fechaCreacion).toLocaleDateString() }}
            </span>
          </div>
          <h3 class="text-sm font-bold text-on-background mb-1">
            {{
              inc.targetType === "POST"
                ? "Publicación"
                : inc.targetType === "VACANTE"
                  ? "Vacante"
                  : inc.targetType === "ORGANIZACION"
                    ? "Organización"
                    : "Contenido"
            }}: {{ inc.targetTitle || inc.jobTitle }}
          </h3>
          <p class="text-xs text-primary font-semibold mb-2">
            Reportado por: {{ inc.reporter }}
          </p>
          <p
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed mb-3"
          >
            {{ inc.reason }}
          </p>
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-if="inc.jobId"
              :to="`/jobs/${inc.jobId}`"
              class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-container transition hover:underline"
            >
              <span class="material-symbols-outlined text-sm">work</span>
              Revisar Vacante
            </NuxtLink>
            <NuxtLink
              v-if="inc.postId"
              :to="`/posts/${inc.postId}`"
              class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-container transition hover:underline"
            >
              <span class="material-symbols-outlined text-sm">article</span>
              Revisar Publicación
            </NuxtLink>
            <NuxtLink
              v-if="inc.companyId && inc.targetType === 'ORGANIZACION'"
              :to="`/company/${inc.companyId}`"
              class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-container transition hover:underline"
            >
              <span class="material-symbols-outlined text-sm">domain</span>
              Revisar Organización
            </NuxtLink>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0 self-center">
          <!-- For reports in EVALUACION (under appeal) -->
          <template v-if="inc.estatus === 'EVALUACION'">
            <span
              class="text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-1 rounded border border-amber-200 dark:border-amber-800 uppercase tracking-wide"
              >En Apelación</span
            >
            <NuxtLink
              to="/mod/appeals"
              class="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-sm">forum</span>
              Atender Apelación
            </NuxtLink>
          </template>

          <!-- For raw reports PENDIENTE -->
          <template v-else>
            <button
              @click="resolve(inc.id, 'approve')"
              class="bg-surface border border-outline-variant/60 hover:bg-surface-container text-on-surface font-semibold text-xs px-3.5 py-2 rounded-xl transition shadow-sm"
            >
              Ignorar
            </button>
            <button
              v-if="inc.targetType !== 'POST'"
              @click="resolve(inc.id, 'evaluate')"
              class="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-sm"
                >pause_circle</span
              >
              Pausar (Evaluar)
            </button>
            <button
              v-else
              @click="resolve(inc.id, 'reject')"
              class="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-sm">delete</span>
              Eliminar
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const { data: session } = useAuth();

const userRole = computed(() => {
  const user = session.value?.user as any;
  return (user?.tipoUsuario || user?.role || "").toUpperCase();
});

const incidents = ref<any[]>([]);
const loading = ref(true);
const activeTab = ref("ALL");

const displayedIncidents = computed(() => {
  let list = incidents.value;

  if (activeTab.value !== "ALL") {
    list = list.filter(
      (inc) =>
        inc.targetType === activeTab.value ||
        (activeTab.value === "ORGANIZACION" && inc.targetType === "EMPRESA"),
    );
  }

  return list;
});

const fetchIncidents = async () => {
  loading.value = true;
  try {
    const data = await $fetch<any>(
      `${config.public.apiUrl}/moderator/incidents`,
    );
    incidents.value =
      data?.value || data?.Items || (Array.isArray(data) ? data : []);
  } catch (e) {
    console.error("Error loading incidents:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchIncidents();
});

const resolve = async (id: string, action: string) => {
  const mappedAction =
    action === "reject"
      ? "block"
      : action === "evaluate"
        ? "evaluate"
        : "approve";
  try {
    await $fetch(`${config.public.apiUrl}/moderator/incidents/${id}/resolve`, {
      method: "POST",
      body: {
        action: mappedAction,
      },
    });

    if (action === "evaluate") {
      const idx = incidents.value.findIndex((i) => i.id === id);
      if (idx !== -1) {
        incidents.value[idx].estatus = "EVALUACION";
      }
    } else {
      incidents.value = incidents.value.filter((i) => i.id !== id);
    }
  } catch (e) {
    console.error("Error resolving incident:", e);
  }
};
</script>
