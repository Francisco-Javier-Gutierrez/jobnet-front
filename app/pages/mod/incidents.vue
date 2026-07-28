<template>
  <div
    class="max-w-5xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <div
      class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-on-background mb-1">
          Bandeja de Incidencias (Moderador)
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-sm">
          Audita y revisa los reportes de publicaciones de empleo e incidencias
          generadas en JobNet.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/mod/audit-logs"
          class="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm">policy</span>
          <span>Tabla de Auditoría</span>
        </NuxtLink>
        <NuxtLink
          to="/mod/support"
          class="px-4 py-2 bg-surface border border-outline-variant hover:border-primary text-on-surface-variant dark:text-slate-300 hover:text-primary text-xs font-bold rounded-xl transition flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-sm">forum</span>
          <span>Centro de Disputas</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Incident list card -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm"
    >
      <div
        class="p-6 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/20"
      >
        <h2 class="text-sm font-bold text-on-background">Denuncias en cola</h2>
        <span
          class="bg-primary/10 text-primary text-xs px-2.5 py-0.5 rounded-full font-bold"
          >{{ incidents.length }} Pendiente{{
            incidents.length !== 1 ? "s" : ""
          }}</span
        >
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
          <div
            class="h-10 bg-outline-variant/30 rounded w-32 self-center"
          ></div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="incidents.length === 0"
        class="p-12 text-center flex flex-col items-center justify-center text-on-surface-variant dark:text-slate-300"
      >
        <span class="material-symbols-outlined text-[48px] text-primary/40 mb-3"
          >gavel</span
        >
        <p class="text-sm font-semibold text-on-surface">
          Sin incidencias activas
        </p>
        <p class="text-xs text-on-surface-variant dark:text-slate-300 mt-1">
          No hay reportes de vacantes pendientes de revisión en la plataforma.
        </p>
      </div>

      <!-- Incidents list -->
      <div v-else class="divide-y divide-outline-variant/30">
        <div
          v-for="inc in incidents"
          :key="inc.id"
          class="p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
        >
          <div class="min-w-0">
            <div class="flex items-center gap-2 mb-2">
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
              Publicación: {{ inc.jobTitle }}
            </h3>
            <p class="text-xs text-primary font-semibold mb-2">
              Reportado por: {{ inc.reporter }}
            </p>
            <p
              class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed mb-3"
            >
              {{ inc.reason }}
            </p>
            <div v-if="inc.jobId">
              <NuxtLink
                :to="`/jobs/${inc.jobId}`"
                class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-container transition hover:underline"
              >
                <span class="material-symbols-outlined text-sm"
                  >visibility</span
                >
                Revisar Contenido
              </NuxtLink>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0 self-center">
            <!-- For reports in EVALUACION (under appeal) -->
            <template v-if="inc.estatus === 'EVALUACION'">
              <span
                class="text-xs font-semibold bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200 uppercase tracking-wide mr-2"
                >Evaluando</span
              >
              <button
                @click="resolve(inc.id, 'approve')"
                class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3 py-2 rounded-lg transition active:scale-95 duration-100 shadow-sm"
                title="Aceptar apelación y reactivar vacante"
              >
                Aceptar Apelación
              </button>
              <button
                @click="resolve(inc.id, 'reject')"
                class="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-3 py-2 rounded-lg transition active:scale-95 duration-100 shadow-sm"
                title="Rechazar apelación y eliminar vacante"
              >
                Rechazar Apelación
              </button>
            </template>

            <!-- For raw reports PENDIENTE -->
            <template v-else>
              <button
                @click="resolve(inc.id, 'approve')"
                class="bg-surface border border-outline-variant hover:bg-surface-container text-on-surface font-semibold text-xs px-3.5 py-2 rounded-lg transition active:scale-95 duration-100 shadow-sm"
              >
                Ignorar
              </button>
              <button
                @click="resolve(inc.id, 'evaluate')"
                class="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition active:scale-95 duration-100 shadow-sm"
              >
                Pausar (Evaluar)
              </button>
              <button
                @click="resolve(inc.id, 'reject')"
                class="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition active:scale-95 duration-100 shadow-sm"
              >
                Bloquear
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Bandeja de Incidencias - JobNet",
  description:
    "Bandeja de incidencias y reportes para moderadores en la plataforma JobNet",
});

const config = useRuntimeConfig();
const incidents = ref<any[]>([]);
const loading = ref(true);

const fetchIncidents = async () => {
  loading.value = true;
  try {
    const data = await $fetch<any[]>(
      `${config.public.apiUrl}/moderator/incidents`,
    );
    incidents.value = data || [];
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
