<template>
  <div class="max-w-5xl mx-auto px-4 py-8 w-full bg-background min-h-screen">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-on-background mb-2">
        Bandeja de Incidencias (Moderador)
      </h1>
      <p class="text-on-surface-variant text-sm">
        Audita y revisa los reportes de publicaciones de empleo e incidencias
        generadas en JobNet.
      </p>
    </div>

    <!-- Incident list card -->
    <div
      class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm"
    >
      <div
        class="p-6 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/20"
      >
        <h2 class="text-sm font-bold text-on-background">Denuncias en cola</h2>
        <span
          class="bg-primary/10 text-primary text-xs px-2.5 py-0.5 rounded-full font-bold"
          >3 Pendientes</span
        >
      </div>

      <div class="divide-y divide-outline-variant/30">
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
              <span class="text-xs text-on-surface-variant">{{
                inc.time
              }}</span>
            </div>
            <h3 class="text-sm font-bold text-on-background mb-1">
              Publicación: {{ inc.jobTitle }}
            </h3>
            <p class="text-xs text-primary font-semibold mb-2">
              Reportado por: {{ inc.reporter }}
            </p>
            <p class="text-xs text-on-surface-variant leading-relaxed">
              {{ inc.reason }}
            </p>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0 self-center">
            <button
              @click="resolve(inc.id, 'approve')"
              class="bg-secondary hover:bg-[#005236] text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition active:scale-95 duration-100 shadow-sm"
            >
              Aprobar
            </button>
            <button
              @click="resolve(inc.id, 'reject')"
              class="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition active:scale-95 duration-100 shadow-sm"
            >
              Bloquear
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

useSeoMeta({
  title: "Bandeja de Incidencias - JobNet",
  description:
    "Bandeja de incidencias y reportes para moderadores en la plataforma JobNet",
});

const incidents = ref([
  {
    id: 1,
    jobTitle: "Junior Dev $100k USD/Hr (Falso)",
    reporter: "alejandro.silva@example.com",
    reason:
      "Estafa de salario excesivamente inflado. Piden depósito para iniciar proceso de contratación.",
    severity: "alta",
    time: "Hace 4 horas",
  },
  {
    id: 2,
    jobTitle: "SEO Writer remoto",
    reporter: "user182@gmail.com",
    reason: "Spam repetitivo del mismo enlace externo.",
    severity: "media",
    time: "Hace 1 día",
  },
]);

const resolve = (id: number, action: string) => {
  incidents.value = incidents.value.filter((i) => i.id !== id);
};
</script>
