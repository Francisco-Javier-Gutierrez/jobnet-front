<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
      <div class="flex items-start gap-4">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-white flex items-center justify-center flex-shrink-0 text-2xl font-bold shadow-md shadow-primary/20">
          {{ job.company ? job.company.charAt(0).toUpperCase() : "J" }}
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <h1 class="text-2xl md:text-3xl font-extrabold text-on-background tracking-tight">
              {{ job.title }}
            </h1>
            <span v-if="job.estado === 'EVALUACION'" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20">
              Bajo Evaluación
            </span>
          </div>

          <p class="text-sm text-primary font-bold hover:underline cursor-pointer flex items-center gap-1.5 mb-3">
            {{ job.company }}
            <span class="material-symbols-outlined text-sm text-secondary fill-1" title="Organización verificada">verified</span>
          </p>

          <div class="flex flex-wrap gap-2">
            <span v-if="job.modalidad" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <span class="material-symbols-outlined text-sm">laptop</span>
              {{ job.modalidad }}
            </span>
            <span v-if="formatSalaryDisplay(job)" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <span class="material-symbols-outlined text-sm">payments</span>
              {{ formatSalaryDisplay(job) }}
            </span>
            <span v-if="job.sector" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-secondary/10 text-secondary border border-secondary/20">
              <span class="material-symbols-outlined text-sm">domain</span>
              {{ job.sector }}
            </span>
            <span v-if="(job.vacantesDisponibles || 1) > 1" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20" title="Múltiples plazas abiertas para esta vacante">
              <span class="material-symbols-outlined text-sm text-amber-500">local_fire_department</span>
              {{ job.vacantesDisponibles }} plazas abiertas
            </span>
            <span v-else class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20" title="Plaza única a contratar para esta vacante">
              <span class="material-symbols-outlined text-sm">badge</span>
              1 plaza disponible
            </span>
            <span v-if="job.maxPostulantes" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20" title="Tope máximo de postulantes configurado por la empresa">
              <span class="material-symbols-outlined text-sm">group</span>
              Máx {{ job.maxPostulantes }} postulantes
            </span>
          </div>
        </div>
      </div>

      <button @click="$emit('easyApply')" :disabled="hasApplied || isApplying" class="px-6 py-3 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 flex-shrink-0 disabled:opacity-80">
        <span v-if="isApplying" class="animate-spin text-sm">⏳</span>
        <span v-else-if="hasApplied" class="material-symbols-outlined text-base">check_circle</span>
        <span v-else class="material-symbols-outlined text-base">send</span>
        <span>{{ hasApplied ? "Solicitud Enviada" : "Presentar Solicitud" }}</span>
      </button>
    </div>

    <hr class="border-outline-variant/30" />

    <!-- Job Description Section -->
    <div class="space-y-4 text-left">
      <h2 class="text-base font-bold text-on-background flex items-center gap-2">
        <span class="material-symbols-outlined text-primary text-xl">description</span>
        Descripción del Puesto
      </h2>
      <p class="text-xs sm:text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed whitespace-pre-line bg-surface-container-low/30 p-5 rounded-2xl border border-outline-variant/40">
        {{ job.descripcion || "No se ha proporcionado una descripción detallada para esta vacante." }}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div v-if="job.experienciaAnos !== undefined && job.experienciaAnos !== null" class="flex items-center gap-3 bg-primary/5 border border-primary/15 p-4 rounded-2xl">
          <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <span class="material-symbols-outlined text-xl">workspace_premium</span>
          </div>
          <div>
            <span class="text-[10px] text-on-surface-variant dark:text-slate-400 uppercase font-bold tracking-wider block">Experiencia Requerida</span>
            <span class="text-xs font-bold text-on-background">
              {{ job.experienciaAnos > 0 ? `${job.experienciaAnos} ${job.experienciaAnos === 1 ? "año" : "años"} de experiencia previa` : "Sin experiencia previa requerida" }}
            </span>
          </div>
        </div>

        <div v-if="job.aptitudes" class="flex items-start gap-3 bg-secondary/5 border border-secondary/15 p-4 rounded-2xl">
          <div class="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
            <span class="material-symbols-outlined text-xl">psychology_alt</span>
          </div>
          <div>
            <span class="text-[10px] text-on-surface-variant dark:text-slate-400 uppercase font-bold tracking-wider block">Aptitudes & Cualidades</span>
            <p class="text-xs font-semibold text-on-background leading-relaxed whitespace-pre-line">
              {{ job.aptitudes }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Skills & Sectors Section -->
    <div v-if="(job.habilidadesRequeridas && job.habilidadesRequeridas.length > 0) || (job.sectores && job.sectores.length > 0)" class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
      <div v-if="job.habilidadesRequeridas && job.habilidadesRequeridas.length > 0" class="space-y-3">
        <h3 class="text-xs font-bold text-on-background uppercase tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-primary text-base">psychology</span>
          Habilidades Requeridas
        </h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="skill in job.habilidadesRequeridas" :key="skill" class="bg-primary/10 text-primary px-3 py-1 rounded-xl text-xs font-bold border border-primary/20">
            {{ skill }}
          </span>
        </div>
      </div>

      <div v-if="job.sectores && job.sectores.length > 0" class="space-y-3">
        <h3 class="text-xs font-bold text-on-background uppercase tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-secondary text-base">business_center</span>
          Sectores Relacionados
        </h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="sec in job.sectores" :key="sec" class="bg-secondary/10 text-secondary px-3 py-1 rounded-xl text-xs font-bold border border-secondary/20">
            {{ sec }}
          </span>
        </div>
      </div>
    </div>

    <!-- PDF Document Section -->
    <div v-if="job.pdfUrl" class="space-y-3 text-left">
      <h3 class="text-xs font-bold text-on-background uppercase tracking-wider flex items-center gap-1.5">
        <span class="material-symbols-outlined text-rose-600 text-base">picture_as_pdf</span>
        Documentación Oficial
      </h3>
      <div class="flex items-center justify-between p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-rose-600 text-3xl">picture_as_pdf</span>
          <div>
            <p class="text-xs font-bold text-on-background">Descriptor_de_Puesto.pdf</p>
            <p class="text-[10px] text-on-surface-variant dark:text-slate-300">Documento oficial adjunto por la empresa</p>
          </div>
        </div>
        <a :href="job.pdfUrl" target="_blank" download class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">download</span>
          Descargar
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  job: any;
  hasApplied: boolean;
  isApplying: boolean;
  formatSalaryDisplay: (jobInfo: any) => string | null;
}>();

defineEmits(["easyApply"]);
</script>
