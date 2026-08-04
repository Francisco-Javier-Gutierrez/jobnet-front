<template>
  <div
    class="max-w-7xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <!-- Header -->
    <div
      class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h1
          class="text-2xl font-bold text-on-background flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-primary text-3xl"
            >dashboard_customize</span
          >
          Tablero ATS
        </h1>
        <p class="text-on-surface-variant dark:text-slate-300 text-sm">
          Analiza individualmente el perfil, carta de presentación y CV de cada
          postulante por vacante y etapa.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="fetchApplicants"
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/60 hover:bg-surface text-xs font-bold transition shadow-sm active:scale-95"
          title="Actualizar postulantes"
        >
          <span
            class="material-symbols-outlined text-sm"
            :class="{ 'animate-spin': isLoading }"
            >refresh</span
          >
          Refrescar Datos
        </button>
      </div>
    </div>

    <!-- Alert Messages -->
    <div
      v-if="successMsg"
      class="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm animate-fadeIn"
    >
      <span class="material-symbols-outlined text-sm">check_circle</span>
      {{ successMsg }}
    </div>

    <!-- Realtime Chat Informative Banner (RF-47) -->
    <div
      class="mb-6 bg-sky-500/10 border border-sky-500/20 p-4 rounded-2xl flex items-start gap-3 text-xs text-sky-900 dark:text-sky-200 shadow-sm"
    >
      <span
        class="material-symbols-outlined text-sky-600 dark:text-sky-400 text-xl flex-shrink-0"
        >info</span
      >
      <div>
        <p class="font-bold text-sky-950 dark:text-sky-100">
          Mensajería Privada en Tiempo Real
        </p>
        <p class="text-sky-800 dark:text-sky-300">
          El canal de chat directo se habilita automáticamente cuando avanzas a
          un aspirante a la etapa de
          <strong>"Entrevista"</strong> o <strong>"Seleccionado"</strong>.
        </p>
      </div>
    </div>

    <!-- Dashboard Quick Stats KPIs -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-2xl p-4 shadow-sm flex items-center gap-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0"
        >
          <span class="material-symbols-outlined text-xl">group</span>
        </div>
        <div>
          <span
            class="text-xs text-on-surface-variant dark:text-slate-400 font-medium block"
            >Total Postulantes</span
          >
          <span class="text-lg font-bold text-on-background">{{
            candidates.length
          }}</span>
        </div>
      </div>

      <div
        class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-2xl p-4 shadow-sm flex items-center gap-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0"
        >
          <span class="material-symbols-outlined text-xl">pending_actions</span>
        </div>
        <div>
          <span
            class="text-xs text-on-surface-variant dark:text-slate-400 font-medium block"
            >En Evaluación</span
          >
          <span class="text-lg font-bold text-on-background">{{
            countByStatus("PENDIENTE")
          }}</span>
        </div>
      </div>

      <div
        class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-2xl p-4 shadow-sm flex items-center gap-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0"
        >
          <span class="material-symbols-outlined text-xl"
            >record_voice_over</span
          >
        </div>
        <div>
          <span
            class="text-xs text-on-surface-variant dark:text-slate-400 font-medium block"
            >En Entrevista</span
          >
          <span class="text-lg font-bold text-on-background">{{
            countByStatus("ENTREVISTA")
          }}</span>
        </div>
      </div>

      <div
        class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-2xl p-4 shadow-sm flex items-center gap-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0"
        >
          <span class="material-symbols-outlined text-xl">verified</span>
        </div>
        <div>
          <span
            class="text-xs text-on-surface-variant dark:text-slate-400 font-medium block"
            >Aceptados / Oferta</span
          >
          <span class="text-lg font-bold text-on-background">{{
            countByStatus("ACEPTADO")
          }}</span>
        </div>
      </div>
    </div>

    <!-- Filters Bar: Vacancy Selector + Stages + Search Bar -->
    <div
      class="bg-surface-container-low dark:bg-slate-900 border border-outline-variant/60 rounded-2xl p-4 mb-6 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4"
    >
      <!-- Vacancy Selector -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <label
          class="text-xs font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1.5 whitespace-nowrap"
        >
          <span class="material-symbols-outlined text-sm text-primary"
            >work</span
          >
          Vacante Publicada:
        </label>
        <div class="w-full sm:w-72">
          <AppSelect
            v-model="selectedJobId"
            @change="fetchApplicants"
            :options="jobSelectOptions"
            placeholder="Selecciona una vacante..."
          />
        </div>
      </div>

      <!-- Stage Filters Tabs (AppTabs) -->
      <div class="flex-grow max-w-full">
        <AppTabs :tabs="stageTabs" v-model="selectedStageFilter" />
      </div>

      <!-- Search Input (AppSearchInput) -->
      <div class="w-full lg:w-64">
        <AppSearchInput
          v-model="searchQuery"
          placeholder="Buscar candidato o habilidad..."
        />
      </div>
    </div>

    <!-- Master-Detail Dashboard Panel View -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- LEFT COLUMN: Postulantes List (4 Cols) -->
      <div
        class="lg:col-span-4 bg-surface-container-low dark:bg-slate-900 border border-outline-variant/60 rounded-2xl p-4 flex flex-col min-h-[620px] max-h-[850px] shadow-sm"
      >
        <div
          class="flex items-center justify-between mb-3 pb-2 border-b border-outline-variant/60"
        >
          <h2
            class="text-xs font-bold uppercase tracking-wider text-on-background flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-sm text-primary"
              >person_search</span
            >
            Postulantes ({{ filteredCandidates.length }})
          </h2>
          <span
            class="text-[10px] text-on-surface-variant dark:text-slate-400 font-semibold"
          >
            Haz clic para ver datos
          </span>
        </div>

        <!-- Candidate Cards Container -->
        <div
          v-if="isLoading"
          class="flex flex-col gap-3 py-12 items-center justify-center text-center"
        >
          <span
            class="material-symbols-outlined text-3xl text-primary animate-spin"
            >sync</span
          >
          <p
            class="text-xs text-on-surface-variant dark:text-slate-400 font-medium"
          >
            Cargando postulantes...
          </p>
        </div>

        <div
          v-else-if="filteredCandidates.length === 0"
          class="flex flex-col items-center justify-center flex-grow py-12 text-center text-on-surface-variant dark:text-slate-400"
        >
          <span
            class="material-symbols-outlined text-4xl mb-2 text-slate-300 dark:text-slate-600"
            >person_off</span
          >
          <p class="text-xs font-bold mb-1">Sin postulantes en esta vista</p>
          <p class="text-[11px] text-slate-400">
            No hay candidatos que coincidan con la vacante o filtro
            seleccionado.
          </p>
        </div>

        <div
          v-else
          class="flex flex-col gap-2.5 flex-grow overflow-y-auto pr-1"
        >
          <button
            type="button"
            v-for="candidate in filteredCandidates"
            :key="`${candidate.id}-${candidate.jobId}`"
            @click="selectCandidate(candidate)"
            class="w-full text-left p-3.5 rounded-xl border transition cursor-pointer relative group select-none block focus:outline-none"
            :class="[
              isSelectedCandidate(candidate)
                ? 'bg-primary/15 border-primary ring-2 ring-primary/50 shadow-md dark:bg-primary/30'
                : 'bg-surface-container-lowest dark:bg-slate-950 border-outline-variant/60 hover:border-primary/60 hover:bg-surface-container-low',
            ]"
          >
            <div class="flex items-start justify-between gap-2 mb-1.5">
              <div class="flex items-center gap-2">
                <div
                  class="w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm transition"
                  :class="
                    isSelectedCandidate(candidate)
                      ? 'bg-primary text-white'
                      : 'bg-primary/10 text-primary dark:bg-primary/20'
                  "
                >
                  {{ candidate.name.substring(0, 2).toUpperCase() }}
                </div>
                <div>
                  <h3 class="text-xs font-bold text-on-background line-clamp-1">
                    {{ candidate.name }}
                  </h3>
                  <span
                    class="text-[10px] text-on-surface-variant dark:text-slate-400 block line-clamp-1"
                  >
                    {{ candidate.email }}
                  </span>
                </div>
              </div>

              <!-- Status Badge -->
              <span
                class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide flex-shrink-0"
                :class="getStatusBadgeClass(candidate.status)"
              >
                {{ getStatusLabel(candidate.status) }}
              </span>
            </div>

            <!-- Job title if viewing all vacancies -->
            <div
              v-if="!selectedJobId"
              class="text-[10px] text-primary font-semibold mb-1.5 flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-[12px]">work</span>
              {{ candidate.job }}
            </div>

            <div
              class="flex items-center justify-between text-[10px] text-on-surface-variant dark:text-slate-400 pt-2 border-t border-outline-variant/30"
            >
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[12px]"
                  >calendar_today</span
                >
                {{ candidate.time }}
              </span>

              <span class="text-primary font-bold flex items-center gap-0.5">
                Ver Detalles
                <span class="material-symbols-outlined text-[12px]"
                  >chevron_right</span
                >
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- RIGHT MAIN PANEL: Candidate Detailed Inspector (8 Cols) -->
      <div
        ref="candidateDetailPanel"
        id="candidate-detail-panel"
        class="lg:col-span-8 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-2xl p-6 min-h-[620px] shadow-sm flex flex-col scroll-mt-6"
      >
        <template v-if="selectedCandidate">
          <!-- Inspector Top Header: Candidate Overview & Actions -->
          <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-outline-variant/60"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white font-extrabold text-xl flex items-center justify-center shadow-md flex-shrink-0"
              >
                {{ selectedCandidate.name.substring(0, 2).toUpperCase() }}
              </div>

              <div>
                <div class="flex items-center gap-2 flex-wrap mb-1">
                  <h2 class="text-lg font-bold text-on-background">
                    {{ selectedCandidate.name }}
                  </h2>
                  <span
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide"
                    :class="getStatusBadgeClass(selectedCandidate.status)"
                  >
                    {{ getStatusLabel(selectedCandidate.status) }}
                  </span>
                </div>

                <p
                  class="text-xs text-primary font-semibold mb-1 flex items-center gap-1.5"
                >
                  <span class="material-symbols-outlined text-sm">work</span>
                  Postulado a: {{ selectedCandidate.job }}
                </p>

                <div
                  class="flex items-center gap-4 text-xs text-on-surface-variant dark:text-slate-300 flex-wrap"
                >
                  <span class="flex items-center gap-1">
                    <span
                      class="material-symbols-outlined text-sm text-slate-400"
                      >mail</span
                    >
                    {{ selectedCandidate.email }}
                  </span>
                  <span
                    v-if="selectedCandidate.phone"
                    class="flex items-center gap-1"
                  >
                    <span
                      class="material-symbols-outlined text-sm text-slate-400"
                      >call</span
                    >
                    {{ selectedCandidate.phone }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span
                      class="material-symbols-outlined text-sm text-slate-400"
                      >schedule</span
                    >
                    {{ selectedCandidate.time }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Inspector Action Buttons -->
            <div
              class="flex items-center gap-2 flex-wrap md:flex-nowrap justify-end"
            >
              <!-- Realtime Chat Button -->
              <nuxt-link
                v-if="
                  [
                    'SELECCIONADO',
                    'ENTREVISTA',
                    'ACEPTADO',
                    'CONTRATADO',
                  ].includes(selectedCandidate.status)
                "
                :to="`/messages?jobId=${selectedCandidate.jobId}&candidateId=${selectedCandidate.id}`"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition shadow-sm"
              >
                <span class="material-symbols-outlined text-sm">forum</span>
                Chat Privado
              </nuxt-link>

              <button
                v-else
                disabled
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-outline-variant/40 text-on-surface-variant/40 text-xs font-bold cursor-not-allowed"
                title="Chat bloqueado: Se desbloquea al avanzar a Entrevista o Seleccionado"
              >
                <span class="material-symbols-outlined text-sm">lock</span>
                Chat Bloqueado
              </button>

              <!-- Move Forward / Interview Button -->
              <button
                v-if="
                  selectedCandidate.status !== 'ACEPTADO' &&
                  selectedCandidate.status !== 'RECHAZADO'
                "
                @click="advanceCandidateStage(selectedCandidate)"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition shadow-sm"
              >
                <span class="material-symbols-outlined text-sm"
                  >trending_up</span
                >
                {{
                  selectedCandidate.status === "PENDIENTE"
                    ? "Agendar Entrevista"
                    : "Aceptar Candidato"
                }}
              </button>

              <!-- Reject Button -->
              <button
                v-if="
                  selectedCandidate.status !== 'RECHAZADO' &&
                  selectedCandidate.status !== 'ACEPTADO'
                "
                @click="triggerReject(selectedCandidate)"
                class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition"
              >
                <span class="material-symbols-outlined text-sm"
                  >person_remove</span
                >
                Descartar
              </button>
            </div>
          </div>

          <!-- Comprehensive Candidate Analysis Sections (All-in-One View) -->
          <div class="space-y-6 flex-grow overflow-y-auto max-h-[680px] pr-1">
            <!-- SECTION 1: Cover Letter (Carta de Presentación) -->
            <div
              class="bg-surface-container-low dark:bg-slate-950 border border-outline-variant/60 rounded-2xl p-5 relative shadow-sm"
            >
              <span
                class="material-symbols-outlined absolute right-5 top-5 text-3xl text-primary/15"
                >format_quote</span
              >
              <h3
                class="text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"
              >
                <span class="material-symbols-outlined text-sm text-primary"
                  >description</span
                >
                Carta de Presentación
              </h3>
              <div
                class="prose dark:prose-invert max-w-none text-xs leading-relaxed text-on-background whitespace-pre-wrap font-sans bg-surface/50 dark:bg-slate-900 p-4 rounded-xl border border-outline-variant/30"
              >
                {{
                  selectedCandidate.coverLetter ||
                  "El postulante no incluyó una carta de presentación escrita al postularse."
                }}
              </div>
            </div>

            <!-- SECTION 2: Safe CV PDF Viewer Card -->
            <div
              class="bg-surface-container-low dark:bg-slate-950 border border-outline-variant/60 rounded-2xl p-5 shadow-sm"
            >
              <div class="flex items-center justify-between mb-3">
                <h3
                  class="text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span class="material-symbols-outlined text-sm text-primary"
                    >picture_as_pdf</span
                  >
                  Curriculum Vitae Adjunto (CV)
                </h3>
              </div>

              <div
                v-if="selectedCandidate.cvUrl"
                class="bg-surface/50 dark:bg-slate-900 border border-outline-variant/40 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0"
                  >
                    <span class="material-symbols-outlined text-2xl"
                      >picture_as_pdf</span
                    >
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-on-background">
                      CV_{{ selectedCandidate.name.replace(/\s+/g, "_") }}.pdf
                    </h4>
                    <p
                      class="text-[10px] text-on-surface-variant dark:text-slate-400"
                    >
                      Documento PDF cargado por el aspirante
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 flex-shrink-0">
                  <button
                    @click="openPdfViewer(selectedCandidate)"
                    class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary-container transition active:scale-95"
                  >
                    <span class="material-symbols-outlined text-sm"
                      >visibility</span
                    >
                    Ver PDF Integrado
                  </button>
                  <a
                    :href="selectedCandidate.cvUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-surface border border-outline-variant text-on-surface-variant dark:text-slate-300 text-xs font-bold hover:bg-surface-container transition"
                  >
                    <span class="material-symbols-outlined text-sm"
                      >open_in_new</span
                    >
                  </a>
                </div>
              </div>

              <div
                v-else
                class="py-6 text-center text-on-surface-variant dark:text-slate-400 bg-surface/50 dark:bg-slate-900 rounded-xl border border-outline-variant/30"
              >
                <span
                  class="material-symbols-outlined text-3xl mb-1 text-slate-400"
                  >picture_as_pdf</span
                >
                <p class="text-xs font-bold">Sin archivo PDF de CV adjunto</p>
                <p class="text-[11px] text-slate-400">
                  El candidato no cargó un documento PDF en su perfil.
                </p>
              </div>
            </div>

            <!-- SECTION 3: Executive Profile & Skills -->
            <div
              class="bg-surface-container-low dark:bg-slate-950 border border-outline-variant/60 rounded-2xl p-5 shadow-sm space-y-4"
            >
              <div>
                <h3
                  class="text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"
                >
                  <span class="material-symbols-outlined text-sm text-primary"
                    >badge</span
                  >
                  Resumen Profesional / Biografía
                </h3>
                <p
                  class="text-xs text-on-background leading-relaxed bg-surface/50 dark:bg-slate-900 p-4 rounded-xl border border-outline-variant/30"
                >
                  {{ selectedCandidate.bio }}
                </p>
              </div>

              <div>
                <h3
                  class="text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"
                >
                  <span class="material-symbols-outlined text-sm text-primary"
                    >psychology</span
                  >
                  Habilidades y Competencias
                </h3>
                <div
                  v-if="
                    selectedCandidate.skills &&
                    selectedCandidate.skills.length > 0
                  "
                  class="flex flex-wrap gap-2"
                >
                  <span
                    v-for="(skill, idx) in selectedCandidate.skills"
                    :key="idx"
                    class="px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold"
                  >
                    {{ skill }}
                  </span>
                </div>
                <p v-else class="text-xs text-slate-400 italic">
                  No se especificaron habilidades en el perfil público.
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <!-- Experience -->
                <div>
                  <h4
                    class="text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"
                  >
                    <span class="material-symbols-outlined text-sm text-primary"
                      >work_history</span
                    >
                    Experiencia Laboral
                  </h4>
                  <div
                    v-if="
                      selectedCandidate.experience &&
                      selectedCandidate.experience.length > 0
                    "
                    class="space-y-2"
                  >
                    <div
                      v-for="(exp, idx) in selectedCandidate.experience"
                      :key="idx"
                      class="border-l-2 border-primary pl-3 py-1 bg-surface/50 dark:bg-slate-900 rounded-r-lg"
                    >
                      <span
                        class="text-xs font-bold block text-on-background"
                        >{{ exp.cargo || exp.title || "Puesto" }}</span
                      >
                      <span class="text-[11px] text-primary block">{{
                        exp.empresa || exp.company || "Empresa"
                      }}</span>
                      <span class="text-[10px] text-slate-400 block">{{
                        exp.periodo || exp.period || ""
                      }}</span>
                    </div>
                  </div>
                  <p v-else class="text-xs text-slate-400 italic">
                    Sin registros de experiencia declarados.
                  </p>
                </div>

                <!-- Education -->
                <div>
                  <h4
                    class="text-xs font-bold text-on-surface-variant dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5"
                  >
                    <span class="material-symbols-outlined text-sm text-primary"
                      >school</span
                    >
                    Educación
                  </h4>
                  <div
                    v-if="
                      selectedCandidate.education &&
                      selectedCandidate.education.length > 0
                    "
                    class="space-y-2"
                  >
                    <div
                      v-for="(edu, idx) in selectedCandidate.education"
                      :key="idx"
                      class="border-l-2 border-emerald-500 pl-3 py-1 bg-surface/50 dark:bg-slate-900 rounded-r-lg"
                    >
                      <span
                        class="text-xs font-bold block text-on-background"
                        >{{ edu.titulo || edu.degree || "Título" }}</span
                      >
                      <span
                        class="text-[11px] text-emerald-600 dark:text-emerald-400 block"
                        >{{
                          edu.institucion || edu.institution || "Institución"
                        }}</span
                      >
                    </div>
                  </div>
                  <p v-else class="text-xs text-slate-400 italic">
                    Sin registros académicos declarados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Empty State when no candidate selected -->
        <div
          v-else
          class="flex flex-col items-center justify-center flex-grow py-24 text-center text-on-surface-variant dark:text-slate-400"
        >
          <div
            class="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4"
          >
            <span class="material-symbols-outlined text-3xl">touch_app</span>
          </div>
          <h3 class="text-sm font-bold text-on-background mb-1">
            Selecciona un Postulante
          </h3>
          <p class="text-xs text-slate-400 max-w-sm">
            Haz clic en cualquiera de los candidatos de la lista lateral para
            inspeccionar su perfil completo, carta de presentación y CV.
          </p>
        </div>
      </div>
    </div>

    <!-- Modals Section -->
    <!-- Mobile Candidate Detail Modal Overlay -->
    <div
      v-if="isMobileDetailModalOpen && selectedCandidate"
      class="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
      @click="isMobileDetailModalOpen = false"
    >
      <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 max-w-2xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        @click.stop
      >
        <!-- Modal Top Bar -->
        <div
          class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-primary text-white font-extrabold flex items-center justify-center"
            >
              {{ selectedCandidate.name.substring(0, 2).toUpperCase() }}
            </div>
            <div>
              <h3 class="text-sm font-bold text-on-background line-clamp-1">
                {{ selectedCandidate.name }}
              </h3>
              <p class="text-[11px] text-primary font-semibold">
                {{ selectedCandidate.job }}
              </p>
            </div>
          </div>

          <button
            @click="isMobileDetailModalOpen = false"
            class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <!-- Modal Body Content -->
        <div class="space-y-4 overflow-y-auto flex-grow py-4 pr-1">
          <!-- Status & Actions -->
          <div
            class="flex items-center justify-between gap-2 flex-wrap bg-surface-container-low dark:bg-slate-950 p-3 rounded-2xl"
          >
            <span
              class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase"
              :class="getStatusBadgeClass(selectedCandidate.status)"
            >
              {{ getStatusLabel(selectedCandidate.status) }}
            </span>

            <div class="flex items-center gap-2">
              <nuxt-link
                v-if="
                  [
                    'SELECCIONADO',
                    'ENTREVISTA',
                    'ACEPTADO',
                    'CONTRATADO',
                  ].includes(selectedCandidate.status)
                "
                :to="`/messages?jobId=${selectedCandidate.jobId}&candidateId=${selectedCandidate.id}`"
                class="px-3 py-1.5 rounded-xl bg-sky-500 text-white text-xs font-bold flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-sm">forum</span>
                Chat
              </nuxt-link>

              <button
                v-if="
                  selectedCandidate.status !== 'ACEPTADO' &&
                  selectedCandidate.status !== 'RECHAZADO'
                "
                @click="advanceCandidateStage(selectedCandidate)"
                class="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-sm"
                  >trending_up</span
                >
                {{
                  selectedCandidate.status === "PENDIENTE"
                    ? "Entrevista"
                    : "Aceptar"
                }}
              </button>

              <button
                v-if="
                  selectedCandidate.status !== 'RECHAZADO' &&
                  selectedCandidate.status !== 'ACEPTADO'
                "
                @click="triggerReject(selectedCandidate)"
                class="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 text-xs font-bold flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </div>

          <!-- Cover Letter -->
          <div
            class="bg-surface-container-low dark:bg-slate-950 p-4 rounded-2xl border border-outline-variant/40"
          >
            <h4
              class="text-xs font-bold mb-2 flex items-center gap-1 text-primary"
            >
              <span class="material-symbols-outlined text-sm">description</span>
              Carta de Presentación
            </h4>
            <p
              class="text-xs leading-relaxed text-on-background whitespace-pre-wrap"
            >
              {{
                selectedCandidate.coverLetter ||
                "No adjuntó carta de presentación."
              }}
            </p>
          </div>

          <!-- CV Preview Trigger -->
          <div
            v-if="selectedCandidate.cvUrl"
            class="bg-surface-container-low dark:bg-slate-950 p-4 rounded-2xl border border-outline-variant/40 flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-rose-500 text-2xl"
                >picture_as_pdf</span
              >
              <span class="text-xs font-bold">Curriculum Vitae (PDF)</span>
            </div>
            <button
              @click="openPdfViewer(selectedCandidate)"
              class="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl"
            >
              Abrir CV PDF
            </button>
          </div>

          <!-- Bio & Profile -->
          <div
            class="bg-surface-container-low dark:bg-slate-950 p-4 rounded-2xl border border-outline-variant/40 space-y-3"
          >
            <h4 class="text-xs font-bold flex items-center gap-1 text-primary">
              <span class="material-symbols-outlined text-sm">badge</span>
              Resumen & Habilidades
            </h4>
            <p class="text-xs text-on-background leading-relaxed">
              {{ selectedCandidate.bio }}
            </p>

            <div
              v-if="
                selectedCandidate.skills && selectedCandidate.skills.length > 0
              "
              class="flex flex-wrap gap-1.5 pt-2"
            >
              <span
                v-for="(skill, i) in selectedCandidate.skills"
                :key="i"
                class="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary text-[11px] font-bold"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Interview Details Modal -->
    <AppModal
      v-model="isInterviewModalOpen"
      title="Agendar Entrevista de Selección"
      subtitle="Indica los detalles de la entrevista para notificar al candidato por correo electrónico."
      icon="calendar_month"
      icon-bg-class="bg-primary/10 text-primary"
      max-width="md"
    >
      <div class="space-y-4">
        <div>
          <label
            class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1"
            >Detalles de la Cita (Ej: Fecha, Hora, Link de Meet/Zoom):</label
          >
          <textarea
            v-model="interviewDetails"
            rows="4"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 outline-none transition"
            placeholder="Ej: Lunes 24 de Julio a las 10:00 AM (GMT-6). Reunión de Teams: https://teams.microsoft.com/l/meetup-join/..."
          ></textarea>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          @click="isInterviewModalOpen = false"
          class="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="button"
          @click="submitInterviewTransition"
          :disabled="!interviewDetails.trim()"
          class="px-4 py-2 bg-primary hover:bg-primary-container text-white disabled:opacity-50 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
        >
          Confirmar y Agendar
        </button>
      </template>
    </AppModal>

    <!-- Rejection Reason Modal -->
    <AppModal
      v-model="isRejectModalOpen"
      title="Descartar Postulante"
      subtitle="Ingresa el motivo del descarte para notificar de forma automática por correo."
      icon="cancel"
      icon-bg-class="bg-rose-500/10 text-rose-600"
      max-width="md"
    >
      <div class="space-y-4">
        <div>
          <label
            class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1"
            >Motivo de Rechazo:</label
          >
          <textarea
            v-model="rejectionReason"
            rows="4"
            class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-rose-500 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 outline-none transition"
            placeholder="Ej: Agradecemos tu participación en el proceso, pero hemos decidido avanzar con perfiles que se alinean más estrechamente con la experiencia requerida."
          ></textarea>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          @click="isRejectModalOpen = false"
          class="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="button"
          @click="submitRejection"
          :disabled="!rejectionReason.trim()"
          class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
        >
          Confirmar Descarte
        </button>
      </template>
    </AppModal>

    <!-- Standardized ATS Applicant Document Viewer -->
    <AppDocumentViewer
      v-model="isPdfViewerOpen"
      :url="selectedPdfUrl"
      :title="`CV de ${selectedPdfCandidateName}`"
    />
  </div>
</template>

<script setup lang="ts">
import AppModal from "~/components/common/AppModal.vue";
useSeoMeta({
  title: "Tablero ATS - JobNet",
  description:
    "Análisis individual de candidatos, cartas de presentación y CVs por vacante en JobNet",
});

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { data: session, status } = useAuth();

const selectedJobId = ref("");
const myJobs = ref<Array<{ id: string; title: string }>>([]);
const allJobsList = ref<
  Array<{ id: string; title: string; empresaUuid: string }>
>([]);
const candidates = ref<any[]>([]);
const selectedCandidate = ref<any>(null);
const isLoading = ref(false);
const successMsg = ref("");
const candidateDetailPanel = ref<HTMLElement | null>(null);
const isMobileDetailModalOpen = ref(false);

// Filter States
const selectedStageFilter = ref("ALL");
const searchQuery = ref("");

// Modal States
const isInterviewModalOpen = ref(false);
const interviewDetails = ref("");
const pendingCandidateItem = ref<any>(null);

const isRejectModalOpen = ref(false);
const rejectionReason = ref("");

// PDF Viewer State
const isPdfViewerOpen = ref(false);
const selectedPdfUrl = ref("");
const selectedPdfCandidateName = ref("");

const jobSelectOptions = computed(() => [
  {
    value: "",
    label: "Todas las vacantes publicadas",
    icon: "work_history",
  },
  ...myJobs.value.map((j) => ({ value: j.id, label: j.title, icon: "work" })),
]);

const stageTabs = computed(() => [
  { id: "ALL", label: "Todas las etapas", count: candidates.value.length },
  {
    id: "PENDIENTE",
    label: "En Evaluación",
    count: countByStatus("PENDIENTE"),
  },
  { id: "ENTREVISTA", label: "Entrevista", count: countByStatus("ENTREVISTA") },
  {
    id: "ACEPTADO",
    label: "Aceptados / Oferta",
    count: countByStatus("ACEPTADO"),
  },
  { id: "RECHAZADO", label: "Descartados", count: countByStatus("RECHAZADO") },
]);

const countByStatus = (st: string) => {
  return candidates.value.filter((c) => c.status === st).length;
};

const getStatusLabel = (st: string) => {
  switch (st) {
    case "PENDIENTE":
      return "En Evaluación";
    case "ENTREVISTA":
      return "Entrevista";
    case "ACEPTADO":
      return "Aceptado";
    case "RECHAZADO":
      return "Descartado";
    default:
      return st;
  }
};

const getStatusBadgeClass = (st: string) => {
  switch (st) {
    case "PENDIENTE":
      return "bg-amber-500/10 text-amber-600 border border-amber-500/20";
    case "ENTREVISTA":
      return "bg-sky-500/10 text-sky-600 border border-sky-500/20";
    case "ACEPTADO":
      return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
    case "RECHAZADO":
      return "bg-rose-500/10 text-rose-600 border border-rose-500/20";
    default:
      return "bg-slate-500/10 text-slate-600 border border-slate-500/20";
  }
};

const filteredCandidates = computed(() => {
  let result = candidates.value;

  // Filter by stage
  if (selectedStageFilter.value !== "ALL") {
    result = result.filter((c) => c.status === selectedStageFilter.value);
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    result = result.filter((c) => {
      const nameMatch = (c.name || "").toLowerCase().includes(q);
      const emailMatch = (c.email || "").toLowerCase().includes(q);
      const skillMatch = (c.skills || []).some((s: string) =>
        s.toLowerCase().includes(q),
      );
      return nameMatch || emailMatch || skillMatch;
    });
  }

  return result;
});

// Auto-sync selected candidate when filtered list changes
watch(
  filteredCandidates,
  (newVal) => {
    if (newVal.length > 0) {
      const exists = newVal.find(
        (c) =>
          c.id === selectedCandidate.value?.id &&
          c.jobId === selectedCandidate.value?.jobId,
      );
      if (!exists) {
        selectedCandidate.value = newVal[0];
      }
    } else {
      selectedCandidate.value = null;
    }
  },
  { immediate: true },
);

const isSelectedCandidate = (c: any) => {
  if (!selectedCandidate.value || !c) return false;
  return (
    selectedCandidate.value.id === c.id &&
    selectedCandidate.value.jobId === c.jobId
  );
};

const selectCandidate = (candidate: any) => {
  console.log("ATS Candidate selected:", candidate);
  selectedCandidate.value = candidate;
  isMobileDetailModalOpen.value = true;

  nextTick(() => {
    if (candidateDetailPanel.value) {
      candidateDetailPanel.value.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
};

const openPdfViewer = (candidate: any) => {
  selectedPdfUrl.value = candidate.cvUrl || "";
  selectedPdfCandidateName.value = candidate.name || "";
  isPdfViewerOpen.value = true;
};

const fetchMyJobs = async () => {
  if (status.value !== "authenticated" || !session.value?.user?.id) {
    router.push("/login");
    return;
  }

  const companyId = session.value.user.id;

  try {
    const allJobs = await $fetch<any[]>(`${config.public.apiUrl}/jobs`).catch(
      () => [],
    );

    allJobsList.value = allJobs.map((j) => ({
      id: j.id,
      title: j.title || j.titulo || "Vacante",
      empresaUuid: j.empresaUuid,
    }));

    const matchedJobs = allJobsList.value.filter(
      (j) => j.empresaUuid === companyId,
    );

    myJobs.value = matchedJobs.length > 0 ? matchedJobs : allJobsList.value;

    if (route.query.jobId) {
      selectedJobId.value = route.query.jobId as string;
    }

    await fetchApplicants();
  } catch (e) {
    console.error("Error fetching company jobs for ATS filtering:", e);
  }
};

const fetchApplicants = async () => {
  isLoading.value = true;

  try {
    let jobsToFetch = myJobs.value;
    if (selectedJobId.value) {
      const selectedJob = allJobsList.value.find(
        (j) => j.id === selectedJobId.value,
      );
      jobsToFetch = selectedJob ? [selectedJob] : myJobs.value;
    }

    const aggregatedApplicants: any[] = [];

    for (const job of jobsToFetch) {
      const apps = await $fetch<any[]>(
        `${config.public.apiUrl}/jobs/${job.id}/applicants`,
      ).catch(() => []);

      for (const app of apps) {
        aggregatedApplicants.push({ ...app, jobTitle: job.title });
      }
    }

    let resolvedCandidates = await Promise.all(
      aggregatedApplicants.map(async (app) => {
        const profile = await $fetch<any>(
          `${config.public.apiUrl}/profile/${app.candidateId}`,
        ).catch(() => ({}));

        return {
          id: app.candidateId,
          name:
            profile.nombre ||
            profile.name ||
            profile.nombreComercial ||
            app.candidateName ||
            `Candidato (${app.candidateId.substring(0, 8)})`,
          email: profile.email || app.candidateEmail || app.candidateId,
          phone:
            profile.telefono ||
            profile.phone ||
            profile.celular ||
            "No especificado",
          bio:
            profile.bio ||
            profile.descripcion ||
            profile.resumen ||
            profile.biografia ||
            "Sin biografía ingresada.",
          skills:
            profile.habilidades ||
            profile.skills ||
            profile.habilidadesRequeridas ||
            [],
          experience: profile.experiencia || profile.experience || [],
          education: profile.educacion || profile.education || [],
          job: app.jobTitle || "Vacante",
          jobId: app.jobId,
          status: app.status || "PENDIENTE",
          coverLetter: app.coverLetter || "Sin mensaje de presentación.",
          time: new Date(app.appliedAt || Date.now()).toLocaleDateString(),
          cvUrl: profile.cvUrl || profile.pdfUrl || app.cvUrl || null,
        };
      }),
    );

    candidates.value = resolvedCandidates;

    if (resolvedCandidates.length > 0) {
      const stillExists = resolvedCandidates.find(
        (c) =>
          c.id === selectedCandidate.value?.id &&
          c.jobId === selectedCandidate.value?.jobId,
      );
      selectedCandidate.value = stillExists || resolvedCandidates[0];
    } else {
      selectedCandidate.value = null;
    }
  } catch (e) {
    console.error("Error fetching job applicants:", e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchMyJobs();
});

const advanceCandidateStage = (candidate: any) => {
  pendingCandidateItem.value = candidate;
  if (candidate.status === "PENDIENTE") {
    interviewDetails.value = "";
    isInterviewModalOpen.value = true;
  } else if (candidate.status === "ENTREVISTA") {
    submitStatusUpdate(candidate, "ACEPTADO");
  }
};

const submitStatusUpdate = async (
  candidate: any,
  backendStatus: string,
  details?: string,
) => {
  try {
    if (!candidate.id.startsWith("cand-demo")) {
      await $fetch(
        `${config.public.apiUrl}/applications/${candidate.jobId}/${candidate.id}/status`,
        {
          method: "PUT",
          body: {
            status: backendStatus,
            detallesEntrevista: details || null,
          },
        },
      );
    }

    candidate.status = backendStatus;
    successMsg.value = `Estado de candidato ${candidate.name} actualizado con éxito a ${getStatusLabel(backendStatus)}.`;
    setTimeout(() => (successMsg.value = ""), 4500);
  } catch (e) {
    console.error("Error updating candidate application status:", e);
  }
};

const submitInterviewTransition = async () => {
  if (!pendingCandidateItem.value) return;

  await submitStatusUpdate(
    pendingCandidateItem.value,
    "ENTREVISTA",
    interviewDetails.value,
  );

  isInterviewModalOpen.value = false;
  pendingCandidateItem.value = null;
};

// Rejection actions
const triggerReject = (candidate: any) => {
  pendingCandidateItem.value = candidate;
  rejectionReason.value = "";
  isRejectModalOpen.value = true;
};

const submitRejection = async () => {
  if (!pendingCandidateItem.value) return;
  const candidate = pendingCandidateItem.value;

  try {
    if (!candidate.id.startsWith("cand-demo")) {
      await $fetch(
        `${config.public.apiUrl}/applications/${candidate.jobId}/${candidate.id}/status`,
        {
          method: "PUT",
          body: {
            status: "RECHAZADO",
            motivoRechazo: rejectionReason.value,
          },
        },
      );
    }

    candidate.status = "RECHAZADO";
    successMsg.value = `Postulante ${candidate.name} descartado con éxito. Se le ha enviado un correo electrónico automático.`;
    setTimeout(() => (successMsg.value = ""), 4500);
  } catch (e) {
    console.error("Error rejecting candidate application:", e);
  } finally {
    isRejectModalOpen.value = false;
    pendingCandidateItem.value = null;
  }
};
</script>
