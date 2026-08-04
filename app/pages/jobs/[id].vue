<template>
  <div
    class="max-w-4xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <!-- Top Breadcrumb -->
    <div class="mb-6 flex items-center justify-between">
      <NuxtLink
        to="/feed"
        class="inline-flex items-center gap-1.5 text-primary hover:text-primary-container text-xs font-bold transition px-3 py-1.5 bg-primary/10 rounded-xl"
      >
        <span class="material-symbols-outlined text-sm">arrow_back</span>
        Volver a vacantes
      </NuxtLink>

      <button
        v-if="job"
        @click="showReportModal = true"
        class="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 text-xs font-bold transition px-3 py-1.5 bg-rose-500/10 rounded-xl border border-rose-500/20"
      >
        <span class="material-symbols-outlined text-sm">flag</span>
        Reportar vacante
      </button>
    </div>

    <!-- Skeleton Loading Detail Page -->
    <div
      v-if="loading"
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 rounded-3xl border border-outline-variant/60 p-8 space-y-6 animate-pulse shadow-sm"
      role="status"
    >
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-outline/10 animate-pulse"></div>
        <div class="space-y-2 flex-grow">
          <div class="h-6 w-1/2 bg-outline/20 rounded animate-pulse"></div>
          <div class="h-4 w-1/4 bg-outline/10 rounded animate-pulse"></div>
        </div>
      </div>
      <div class="h-4 w-full bg-outline/10 rounded animate-pulse"></div>
      <div class="h-4 w-5/6 bg-outline/10 rounded animate-pulse"></div>
      <div class="h-48 bg-outline/10 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Vacancy Not Found State -->
    <div
      v-else-if="!job"
      class="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-3xl shadow-sm px-6"
    >
      <div
        class="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mb-4"
      >
        <span class="material-symbols-outlined text-[32px]">work_off</span>
      </div>
      <h2 class="text-lg font-bold text-on-background mb-2">
        Vacante no encontrada
      </h2>
      <p
        class="text-on-surface-variant dark:text-slate-300 text-xs max-w-sm mb-6"
      >
        La oferta de empleo que estás buscando no existe, ha sido desactivada o
        el enlace es incorrecto.
      </p>
      <NuxtLink
        to="/feed"
        class="bg-primary text-white hover:bg-primary-container font-semibold text-xs px-5 py-2.5 rounded-xl transition"
      >
        Volver a la Bolsa de Trabajo
      </NuxtLink>
    </div>

    <!-- UNIFIED MASTER DETAIL CARD -->
    <div
      v-else
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-8"
    >
      <!-- Top Decorative Accent Bar -->
      <div
        class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-emerald-500"
      ></div>

      <!-- 1. Header Section -->
      <div
        class="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2"
      >
        <div class="flex items-start gap-4">
          <div
            class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-white flex items-center justify-center flex-shrink-0 text-2xl font-bold shadow-md shadow-primary/20"
          >
            {{ job.company ? job.company.charAt(0).toUpperCase() : "J" }}
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <h1
                class="text-2xl md:text-3xl font-extrabold text-on-background tracking-tight"
              >
                {{ job.title }}
              </h1>
              <span
                v-if="job.estado === 'EVALUACION'"
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20"
              >
                Bajo Evaluación
              </span>
            </div>

            <p
              class="text-sm text-primary font-bold hover:underline cursor-pointer flex items-center gap-1.5 mb-3"
            >
              {{ job.company }}
              <span
                class="material-symbols-outlined text-sm text-secondary fill-1"
                title="Organización verificada"
                >verified</span
              >
            </p>

            <!-- Specs Badges -->
            <div class="flex flex-wrap gap-2">
              <span
                v-if="job.modalidad"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20"
              >
                <span class="material-symbols-outlined text-sm">laptop</span>
                {{ job.modalidad }}
              </span>
              <span
                v-if="formatSalaryDisplay(job)"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
              >
                <span class="material-symbols-outlined text-sm">payments</span>
                {{ formatSalaryDisplay(job) }}
              </span>
              <span
                v-if="job.sector"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-secondary/10 text-secondary border border-secondary/20"
              >
                <span class="material-symbols-outlined text-sm">domain</span>
                {{ job.sector }}
              </span>
              <span
                v-if="(job.vacantesDisponibles || 1) > 1"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                title="Múltiples plazas abiertas para esta vacante"
              >
                <span class="material-symbols-outlined text-sm text-amber-500"
                  >local_fire_department</span
                >
                {{ job.vacantesDisponibles }} plazas abiertas
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20"
                title="Plaza única a contratar para esta vacante"
              >
                <span class="material-symbols-outlined text-sm">badge</span>
                1 plaza disponible
              </span>
              <span
                v-if="job.maxPostulantes"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                title="Tope máximo de postulantes configurado por la empresa"
              >
                <span class="material-symbols-outlined text-sm">group</span>
                Máx {{ job.maxPostulantes }} postulantes
              </span>
            </div>
          </div>
        </div>

        <!-- Apply Button -->
        <button
          @click="handleEasyApplyClick"
          :disabled="hasApplied || isApplying"
          class="px-6 py-3 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 flex-shrink-0 disabled:opacity-80"
        >
          <span v-if="isApplying" class="animate-spin text-sm">⏳</span>
          <span
            v-else-if="hasApplied"
            class="material-symbols-outlined text-base"
            >check_circle</span
          >
          <span v-else class="material-symbols-outlined text-base">send</span>
          <span>{{
            hasApplied ? "Solicitud Enviada" : "Presentar Solicitud"
          }}</span>
        </button>
      </div>

      <hr class="border-outline-variant/30" />

      <!-- 2. Job Description Section -->
      <div class="space-y-4 text-left">
        <h2
          class="text-base font-bold text-on-background flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-primary text-xl"
            >description</span
          >
          Descripción del Puesto
        </h2>
        <p
          class="text-xs sm:text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed whitespace-pre-line bg-surface-container-low/30 p-5 rounded-2xl border border-outline-variant/40"
        >
          {{
            job.descripcion ||
            "No se ha proporcionado una descripción detallada para esta vacante."
          }}
        </p>

        <!-- Experience & Aptitudes Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <!-- Experience Years -->
          <div
            v-if="
              job.experienciaAnos !== undefined && job.experienciaAnos !== null
            "
            class="flex items-center gap-3 bg-primary/5 border border-primary/15 p-4 rounded-2xl"
          >
            <div
              class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0"
            >
              <span class="material-symbols-outlined text-xl"
                >workspace_premium</span
              >
            </div>
            <div>
              <span
                class="text-[10px] text-on-surface-variant dark:text-slate-400 uppercase font-bold tracking-wider block"
                >Experiencia Requerida</span
              >
              <span class="text-xs font-bold text-on-background">
                {{
                  job.experienciaAnos > 0
                    ? `${job.experienciaAnos} ${job.experienciaAnos === 1 ? "año" : "años"} de experiencia previa`
                    : "Sin experiencia previa requerida"
                }}
              </span>
            </div>
          </div>

          <!-- Aptitudes -->
          <div
            v-if="job.aptitudes"
            class="flex items-start gap-3 bg-secondary/5 border border-secondary/15 p-4 rounded-2xl"
          >
            <div
              class="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0"
            >
              <span class="material-symbols-outlined text-xl"
                >psychology_alt</span
              >
            </div>
            <div>
              <span
                class="text-[10px] text-on-surface-variant dark:text-slate-400 uppercase font-bold tracking-wider block"
                >Aptitudes & Cualidades</span
              >
              <p
                class="text-xs font-semibold text-on-background leading-relaxed whitespace-pre-line"
              >
                {{ job.aptitudes }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Skills & Sectors Section -->
      <div
        v-if="
          (job.habilidadesRequeridas && job.habilidadesRequeridas.length > 0) ||
          (job.sectores && job.sectores.length > 0)
        "
        class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left"
      >
        <!-- Required Skills -->
        <div
          v-if="
            job.habilidadesRequeridas && job.habilidadesRequeridas.length > 0
          "
          class="space-y-3"
        >
          <h3
            class="text-xs font-bold text-on-background uppercase tracking-wider flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-primary text-base"
              >psychology</span
            >
            Habilidades Requeridas
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in job.habilidadesRequeridas"
              :key="skill"
              class="bg-primary/10 text-primary px-3 py-1 rounded-xl text-xs font-bold border border-primary/20"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Sectors -->
        <div v-if="job.sectores && job.sectores.length > 0" class="space-y-3">
          <h3
            class="text-xs font-bold text-on-background uppercase tracking-wider flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-secondary text-base"
              >business_center</span
            >
            Sectores Relacionados
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="sec in job.sectores"
              :key="sec"
              class="bg-secondary/10 text-secondary px-3 py-1 rounded-xl text-xs font-bold border border-secondary/20"
            >
              {{ sec }}
            </span>
          </div>
        </div>
      </div>

      <!-- 4. Additional Spec PDF Document (If Present) -->
      <div v-if="job.pdfUrl" class="space-y-3 text-left">
        <h3
          class="text-xs font-bold text-on-background uppercase tracking-wider flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-rose-600 text-base"
            >picture_as_pdf</span
          >
          Documentación Oficial
        </h3>
        <div
          class="flex items-center justify-between p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl"
        >
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-rose-600 text-3xl"
              >picture_as_pdf</span
            >
            <div>
              <p class="text-xs font-bold text-on-background">
                Descriptor_de_Puesto.pdf
              </p>
              <p
                class="text-[10px] text-on-surface-variant dark:text-slate-300"
              >
                Documento oficial adjunto por la empresa
              </p>
            </div>
          </div>
          <a
            :href="job.pdfUrl"
            target="_blank"
            download
            class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-sm">download</span>
            Descargar
          </a>
        </div>
      </div>

      <hr class="border-outline-variant/30" />

      <!-- 5. Location Map Section -->
      <div v-if="job" class="space-y-3 text-left">
        <AppLocationMap
          :lat="job.lat || 19.2826"
          :lng="job.lng || -99.6557"
          :draggable="false"
          label="Ubicación de la Oferta"
          height="280px"
          :show-use-current-location="false"
        />
      </div>

      <hr class="border-outline-variant/30" />

      <!-- 6. Application Form Section -->
      <div id="apply-section" class="space-y-4 text-left">
        <h2
          class="text-base font-bold text-on-background flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-primary text-xl"
            >send</span
          >
          Presentar Solicitud de Empleo
        </h2>

        <!-- Alert if evaluation -->
        <div
          v-if="job.estado === 'EVALUACION'"
          class="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-800 text-xs leading-relaxed space-y-1"
        >
          <p class="font-bold flex items-center gap-1.5">
            <span class="material-symbols-outlined text-base">warning</span>
            Postulaciones pausadas
          </p>
          <p>
            Esta vacante se encuentra en revisión por moderadores. No se
            permiten nuevas postulaciones por el momento.
          </p>
        </div>

        <!-- Already Applied Card -->
        <div
          v-else-if="hasApplied"
          class="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-emerald-800 text-xs leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
        >
          <div class="flex items-center gap-3.5">
            <span class="material-symbols-outlined text-emerald-600 text-4xl"
              >check_circle</span
            >
            <div>
              <p class="font-bold text-sm text-emerald-950">
                ¡Solicitud de empleo transmitida con éxito!
              </p>
              <p class="text-emerald-800">
                Tu perfil profesional y currículum han sido vinculados a esta
                convocatoria de <strong>{{ job.company }}</strong
                >.
              </p>
            </div>
          </div>
          <NuxtLink
            :to="`/messages?jobId=${jobId}&candidateId=${session?.user?.id || ''}`"
            class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md flex-shrink-0"
          >
            <span class="material-symbols-outlined text-sm">forum</span>
            Ir al Chat Privado
          </NuxtLink>
        </div>

        <!-- Interactive Application Mini-Form Card -->
        <div
          v-else
          class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 p-6 rounded-3xl space-y-5 shadow-sm"
        >
          <div
            class="border-b border-outline-variant/30 pb-3 flex items-center justify-between flex-wrap gap-2"
          >
            <div>
              <h3
                class="text-sm font-bold text-on-background flex items-center gap-2"
              >
                <span class="material-symbols-outlined text-primary text-xl"
                  >edit_note</span
                >
                Formulario de Postulación Directa
              </h3>
              <p class="text-xs text-on-surface-variant dark:text-slate-400">
                Personaliza la presentación que recibirá el equipo de
                reclutamiento de {{ job.company }}.
              </p>
            </div>

            <!-- Mandatory Pre-selected CV Badge (Locked) -->
            <div
              v-if="profileCvUrl"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 rounded-xl text-xs font-bold whitespace-nowrap"
              title="Tu CV principal va adjunto de forma obligatoria y segura"
            >
              <span class="material-symbols-outlined text-sm text-emerald-600"
                >lock</span
              >
              <span class="material-symbols-outlined text-sm"
                >picture_as_pdf</span
              >
              <span>CV: {{ profileCvName }}</span>
            </div>
            <div
              v-else
              class="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 rounded-xl text-xs font-bold whitespace-nowrap"
            >
              <span class="material-symbols-outlined text-sm">warning</span>
              <span>Sin CV en Perfil</span>
            </div>
          </div>

          <!-- 1. Custom Presentation Message (Textarea) -->
          <div class="space-y-1.5">
            <label
              class="text-xs font-bold text-on-background flex items-center justify-between"
            >
              <span>Mensaje de Presentación o Carta de Motivos</span>
              <span class="text-[10px] text-on-surface-variant font-normal"
                >Opcional</span
              >
            </label>
            <textarea
              v-model="coverLetterInput"
              rows="3"
              placeholder="Escribe una breve introducción para el reclutador destacando tu motivación y experiencia relevante..."
              class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-2xl p-3.5 text-xs text-on-background outline-none transition placeholder-on-surface-variant/50 resize-none font-sans"
            ></textarea>
          </div>

          <!-- 2. Profile Links Selection (If Available) -->
          <div v-if="candidateProfileLinks.length > 0" class="space-y-2">
            <label
              class="text-xs font-bold text-on-background flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-sm text-primary"
                >link</span
              >
              Adjuntar Enlaces o Portafolios de tu Perfil
            </label>
            <div class="flex flex-wrap gap-2.5">
              <label
                v-for="link in candidateProfileLinks"
                :key="link.url"
                class="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition select-none"
                :class="
                  selectedProfileLinks.includes(link.url)
                    ? 'bg-primary/10 border-primary text-primary font-bold'
                    : 'bg-surface border-outline-variant/50 text-on-surface-variant hover:border-outline'
                "
              >
                <input
                  type="checkbox"
                  :value="link.url"
                  v-model="selectedProfileLinks"
                  class="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span>{{ link.label }}: {{ link.url }}</span>
              </label>
            </div>
          </div>

          <!-- 3. Profile Additional Docs Selection (If Available) -->
          <div v-if="candidateProfileDocs.length > 0" class="space-y-2">
            <label
              class="text-xs font-bold text-on-background flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-sm text-secondary"
                >folder_zip</span
              >
              Adjuntar Documentos y Certificaciones Adicionales
            </label>
            <div class="flex flex-wrap gap-2.5">
              <label
                v-for="doc in candidateProfileDocs"
                :key="doc.url"
                class="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition select-none"
                :class="
                  selectedProfileDocs.includes(doc.url)
                    ? 'bg-secondary/10 border-secondary text-secondary font-bold'
                    : 'bg-surface border-outline-variant/50 text-on-surface-variant hover:border-outline'
                "
              >
                <input
                  type="checkbox"
                  :value="doc.url"
                  v-model="selectedProfileDocs"
                  class="rounded text-secondary focus:ring-secondary h-3.5 w-3.5"
                />
                <span>📄 {{ doc.name }}</span>
              </label>
            </div>
          </div>

          <!-- Submit Button Row -->
          <div
            class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/20"
          >
            <p
              class="text-[11px] text-on-surface-variant dark:text-slate-400 italic"
            >
              🔒 Tu CV principal va preseleccionado y enlazado a tu solicitud.
            </p>

            <button
              type="button"
              @click="handleEasyApplyClick"
              :disabled="isApplying"
              class="w-full sm:w-auto bg-primary hover:bg-primary-container text-white font-bold text-xs px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-primary/20 active:scale-95 disabled:opacity-50 flex-shrink-0"
            >
              <span v-if="isApplying" class="animate-spin text-xs">⏳</span>
              <span v-else class="material-symbols-outlined text-sm">send</span>
              <span>{{
                isApplying
                  ? "Enviando Candidatura..."
                  : "Enviar Solicitud de Empleo"
              }}</span>
            </button>
          </div>
        </div>
      </div>

      <hr class="border-outline-variant/30" />

      <!-- 7. Public Q&A Section -->
      <div class="space-y-6 text-left">
        <h2
          class="text-base font-bold text-on-background flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-primary text-xl"
            >forum</span
          >
          Preguntas y Comentarios ({{ totalComments }})
        </h2>

        <!-- Comment Input -->
        <form @submit.prevent="submitComment" class="flex flex-col gap-3">
          <textarea
            v-model="newCommentText"
            placeholder="Pregunta algo al reclutador sobre esta vacante..."
            rows="3"
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-2xl p-4 text-xs text-on-background outline-none transition placeholder-on-surface-variant/50 resize-none font-sans"
          ></textarea>
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="!newCommentText.trim() || isCreatingComment"
              class="bg-primary hover:bg-primary-container text-white disabled:bg-primary/40 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
            >
              Publicar Pregunta
            </button>
          </div>
        </form>

        <!-- Comments Tree Render -->
        <div
          v-if="commentTree.length === 0"
          class="text-center py-6 text-on-surface-variant dark:text-slate-300/60 text-xs"
        >
          <span class="material-symbols-outlined text-[32px] text-outline mb-1"
            >comments_disabled</span
          >
          <p>No hay preguntas aún. ¡Sé el primero en consultar!</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="node in commentTree"
            :key="node.id"
            class="p-4 bg-surface-container-low/30 border border-outline-variant/40 rounded-2xl space-y-3 relative"
          >
            <!-- Comment Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div
                  class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shadow-inner"
                >
                  {{ node.user.username.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <h4 class="text-xs font-bold text-on-background">
                    {{ node.user.username }}
                  </h4>
                  <span
                    class="text-[10px] text-on-surface-variant dark:text-slate-300/80"
                    >{{ formatDate(node.createdAt) }}</span
                  >
                </div>
              </div>

              <button
                v-if="canDeleteComment(node)"
                @click="deleteComment(node.id)"
                class="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition"
                title="Eliminar pregunta"
              >
                <span class="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>

            <p
              class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
            >
              {{ node.content }}
            </p>

            <div class="flex items-center gap-3 pt-1">
              <button
                @click="toggleReplyForm(node.id)"
                class="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
              >
                <span class="material-symbols-outlined text-sm">reply</span>
                Responder
              </button>
            </div>

            <!-- Inline Reply Form -->
            <form
              v-if="replyingToCommentId === node.id"
              @submit.prevent="submitReply(node.id)"
              class="mt-2 flex gap-2"
            >
              <input
                v-model="replyContentText"
                type="text"
                placeholder="Escribe una respuesta..."
                class="flex-grow bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2 text-xs text-on-background outline-none transition"
              />
              <button
                type="submit"
                :disabled="!replyContentText.trim() || isCreatingComment"
                class="bg-secondary text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm"
              >
                Responder
              </button>
            </form>

            <!-- Nested Replies -->
            <div
              v-if="node.children && node.children.length > 0"
              class="ml-6 md:ml-8 mt-3 border-l-2 border-outline-variant/30 pl-4 space-y-3"
            >
              <div
                v-for="reply in node.children"
                :key="reply.id"
                class="p-3 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/30 rounded-xl space-y-2"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-[10px]"
                    >
                      {{ reply.user.username.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <h5 class="text-[11px] font-bold text-on-background">
                        {{ reply.user.username }}
                      </h5>
                      <span
                        class="text-[9px] text-on-surface-variant dark:text-slate-300"
                        >{{ formatDate(reply.createdAt) }}</span
                      >
                    </div>
                  </div>

                  <button
                    v-if="canDeleteComment(reply)"
                    @click="deleteComment(reply.id)"
                    class="text-rose-600 hover:bg-rose-50 p-1 rounded-md transition"
                    title="Eliminar respuesta"
                  >
                    <span class="material-symbols-outlined text-xs"
                      >delete</span
                    >
                  </button>
                </div>
                <p
                  class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
                >
                  {{ reply.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Reporte -->
  <ReportModal
    :is-open="showReportModal"
    target-type="VACANTE"
    :target-id="job?.id || ''"
    :target-title="job?.title || 'Vacante'"
    @close="showReportModal = false"
  />

  <!-- Modal de Perfil Desactualizado (Falta CV) -->
  <div
    v-if="showMissingCvModal"
    class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
  >
    <div
      class="bg-white border border-outline-variant/60 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-left"
    >
      <div
        class="flex items-center justify-between border-b border-outline-variant/30 pb-4"
      >
        <div class="flex items-center gap-2 text-amber-600">
          <span class="material-symbols-outlined text-2xl">warning</span>
          <h3 class="text-base font-extrabold text-on-background">
            Perfil desactualizado
          </h3>
        </div>
        <button
          @click="showMissingCvModal = false"
          class="text-on-surface-variant dark:text-slate-300 hover:bg-surface-container rounded-lg p-1.5 transition"
        >
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <div class="space-y-3">
        <p
          class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
        >
          Para realizar una
          <strong class="text-on-background"
            >Postulación en 1-Clic (Easy Apply)</strong
          >, es requisito indispensable tener tu
          <strong>Currículum Vitae (PDF)</strong> cargado en tu perfil digital.
        </p>
        <p
          class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-amber-900 font-semibold"
        >
          💡 Al subir tu CV en tu perfil una sola vez, podrás postularte de
          forma instantánea a cualquier vacante sin necesidad de volver a cargar
          archivos.
        </p>
      </div>

      <div class="flex flex-col gap-2.5 pt-2">
        <NuxtLink
          to="/profile"
          class="w-full bg-primary hover:bg-primary-container text-white font-bold text-xs py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-md shadow-primary/20 text-center"
        >
          <span class="material-symbols-outlined text-sm">badge</span>
          <span>Ir a mi Perfil a subir mi CV</span>
        </NuxtLink>

        <button
          type="button"
          @click="showMissingCvModal = false"
          class="w-full bg-surface border border-outline-variant hover:bg-surface-container text-on-surface-variant dark:text-slate-300 font-semibold text-xs py-3 rounded-2xl transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppLocationMap from "~/components/common/AppLocationMap.vue";
import { useJobsStore } from "~/stores/jobs";
import { useUploadStore } from "~/stores/upload";

const config = useRuntimeConfig();

const profileCvUrl = ref("");
const profileCvName = ref("");
const showMissingCvModal = ref(false);
const candidateProfile = ref<any>(null);
const coverLetterInput = ref("");
const selectedProfileLinks = ref<string[]>([]);
const selectedProfileDocs = ref<string[]>([]);

const candidateProfileLinks = computed(() => {
  if (!candidateProfile.value) return [];
  const links: { label: string; url: string }[] = [];
  const p = candidateProfile.value;
  if (p.linkedin) links.push({ label: "LinkedIn", url: p.linkedin });
  if (p.github) links.push({ label: "GitHub", url: p.github });
  if (p.portfolioUrl || p.sitioWeb || p.website) {
    links.push({
      label: "Portafolio / Web",
      url: p.portfolioUrl || p.sitioWeb || p.website,
    });
  }
  if (Array.isArray(p.links)) {
    p.links.forEach((l: any) => {
      if (typeof l === "string") links.push({ label: "Enlace", url: l });
      else if (l.url) links.push({ label: l.nombre || "Enlace", url: l.url });
    });
  }
  return links;
});

const candidateProfileDocs = computed(() => {
  if (!candidateProfile.value) return [];
  const docs: { name: string; url: string }[] = [];
  const p = candidateProfile.value;
  if (Array.isArray(p.documentosAdicionales)) {
    p.documentosAdicionales.forEach((d: any) => {
      if (d.url)
        docs.push({ name: d.nombre || d.name || "Documento", url: d.url });
    });
  }
  if (Array.isArray(p.certificados)) {
    p.certificados.forEach((c: any) => {
      if (c.url || c.pdfUrl)
        docs.push({
          name: c.titulo || c.name || "Certificado",
          url: c.url || c.pdfUrl,
        });
    });
  }
  return docs;
});

const fetchCandidateProfile = async () => {
  if (status.value !== "authenticated" || !session.value?.user?.id) return;
  try {
    const headers: Record<string, string> = {};
    if (session.value?.idToken) {
      headers.Authorization = `Bearer ${session.value.idToken}`;
    } else if (session.value?.accessToken) {
      headers.Authorization = `Bearer ${session.value.accessToken}`;
    }
    const profile = await $fetch<any>(
      `${config.public.apiUrl}/profile/${session.value.user.id}`,
      { headers },
    );
    candidateProfile.value = profile;
    const foundCv =
      profile?.cvUrl ||
      profile?.documentosProfesionales?.cvUrl ||
      profile?.cvPath ||
      profile?.curriculumUrl ||
      "";

    if (profile && foundCv) {
      profileCvUrl.value = foundCv;
      profileCvName.value =
        profile.cvFileName ||
        profile.documentosProfesionales?.cvFileName ||
        "Mi_Curriculum_Vitae.pdf";
    } else {
      profileCvUrl.value = "";
      profileCvName.value = "";
    }
  } catch (e) {
    console.error("Error fetching candidate profile for easy apply:", e);
  }
};

const handleEasyApplyClick = () => {
  if (status.value !== "authenticated") {
    navigateTo("/login?redirect=" + encodeURIComponent(route.fullPath));
    return;
  }
  if (!profileCvUrl.value) {
    showMissingCvModal.value = true;
    return;
  }
  submitEasyApplication();
};

const submitEasyApplication = async () => {
  if (!profileCvUrl.value) {
    showMissingCvModal.value = true;
    return;
  }
  isApplying.value = true;

  try {
    const headers: Record<string, string> = {};
    if (session.value?.idToken) {
      headers.Authorization = `Bearer ${session.value.idToken}`;
    } else if (session.value?.accessToken) {
      headers.Authorization = `Bearer ${session.value.accessToken}`;
    }

    const candidateId = session.value?.user?.id;
    const candidateName = session.value?.user?.name || "Candidato";

    let finalMessage = coverLetterInput.value.trim()
      ? coverLetterInput.value.trim()
      : `Hola, mi nombre es ${candidateName}. Me complace presentar mi candidatura a la vacante de ${job.value?.title || "Empleo"} en ${job.value?.company || "su empresa"}. Adjunto mi Currículum Vitae cargado en mi perfil.`;

    if (selectedProfileLinks.value.length > 0) {
      finalMessage +=
        `\n\n🔗 Enlaces profesionales adjuntos:\n` +
        selectedProfileLinks.value.map((l) => `• ${l}`).join("\n");
    }
    if (selectedProfileDocs.value.length > 0) {
      finalMessage +=
        `\n\n📄 Documentos/Certificados adicionales adjuntos:\n` +
        selectedProfileDocs.value.map((d) => `• ${d}`).join("\n");
    }

    await $fetch(`${config.public.apiUrl}/jobs/${jobId}/apply`, {
      method: "POST",
      headers,
      body: {
        candidateId,
        coverLetter: finalMessage,
        cvUrl: profileCvUrl.value,
        cvFileName: profileCvName.value,
      },
    });

    hasApplied.value = true;
    if (process.client) {
      localStorage.setItem(`job-applied-${jobId}`, "true");
    }

    navigateTo(`/messages?jobId=${jobId}&candidateId=${candidateId}`);
  } catch (e: any) {
    console.error("Error submitting application:", e);
    showInfo(
      "Notificación",
      "Hubo un inconveniente al registrar la postulación. Intenta nuevamente.",
    );
  } finally {
    isApplying.value = false;
  }
};

// Report state variables
const showReportModal = ref(false);
const reportReason = ref("Vacante falsa");
const reportComments = ref("");
const isReporting = ref(false);
const reportSuccess = ref(false);

const submitReport = async () => {
  if (!reportComments.value.trim()) return;
  isReporting.value = true;
  try {
    const severityMap: Record<string, string> = {
      "Vacante falsa": "alta",
      "Información engañosa": "media",
      "Contenido inapropiado": "media",
      Otro: "baja",
    };
    const infraccionMap: Record<string, string> = {
      "Vacante falsa": "fraude",
      "Información engañosa": "fraude",
      "Contenido inapropiado": "contenido",
      Otro: "otro",
    };

    const reporterEmail =
      session.value?.user?.email || "candidato.anonimo@gmail.com";

    await $fetch(`${config.public.apiUrl}/moderator/incidents`, {
      method: "POST",
      body: {
        jobId: jobId,
        jobTitle: job.value?.title || "Vacante",
        reporter: reporterEmail,
        reason: `${reportReason.value}: ${reportComments.value.trim()}`,
        severity: severityMap[reportReason.value] || "media",
        infraccion: infraccionMap[reportReason.value] || "otro",
      },
    });

    reportSuccess.value = true;
    setTimeout(() => {
      showReportModal.value = false;
      reportSuccess.value = false;
      reportComments.value = "";
    }, 2000);
  } catch (e) {
    console.error("Error creating report:", e);
    showError(
      "Error",
      "Hubo un error al enviar el reporte. Por favor, intenta de nuevo.",
    );
  } finally {
    isReporting.value = false;
  }
};

// Comment interfaces mirroring Comuni-red tree architecture
interface CommentData {
  id: string;
  parentCommentId: string | null;
  content: string;
  createdAt: string;
  user: {
    username: string;
    email: string;
  };
}

type CommentNode = CommentData & { children: CommentNode[] };

const route = useRoute();
const router = useRouter();
const jobsStore = useJobsStore();
const { data: session, status } = useAuth();

useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
      crossorigin: "",
    },
  ],
});

const jobId = route.params.id as string;
const loading = ref(true);

// State for applications
const selectedFile = ref<File | null>(null);
const isApplying = ref(false);
const hasApplied = ref(false);

// State for comments
const commentsList = ref<CommentData[]>([]);
const totalComments = ref(0);
const newCommentText = ref("");
const replyContentText = ref("");
const replyingToCommentId = ref<string | null>(null);
const isCreatingComment = ref(false);

// Format salary
const formatSalary = (amount: number): string => {
  return amount.toLocaleString("es-MX");
};

// Date formatter
const formatDate = (isoString: string): string => {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "N/A";
  }
};

// Match route id to existing jobs store
const job = computed(() => {
  return jobsStore.jobs.find((j) => j.id === jobId);
});

// Scroll helper
const scrollToApply = () => {
  const el = document.getElementById("apply-section");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (!file) return;
    const isPdf =
      file.type === "application/pdf" ||
      file.type === "application/x-pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    const { showError, showWarning } = useAppFeedback();

    if (!isPdf) {
      target.value = "";
      showWarning(
        "Formato No Permitido",
        "Por favor selecciona un archivo en formato PDF.",
        4000,
      );
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      target.value = "";
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      showError(
        "Límite de Tamaño Excedido",
        `El archivo PDF "${file.name}" (${sizeMb} MB) supera el límite máximo permitido de 10MB.`,
        null,
      );
      return;
    }
    selectedFile.value = file;
  }
};

// Submit CV Apply
const submitApplication = async () => {
  if (!selectedFile.value) return;
  isApplying.value = true;

  const uploadStore = useUploadStore();
  const candidateId = session.value?.user?.id || "anonymous";

  // 1. Upload CV to S3 via presigned PUT url
  const uploadResult = await uploadStore.uploadFile(
    selectedFile.value,
    "cv",
    candidateId,
  );
  if (!uploadResult.success) {
    showError(
      "Error",
      "Hubo un error al subir tu CV a S3: " + uploadResult.error,
    );
    isApplying.value = false;
    return;
  }

  const s3Url = uploadResult.url;

  // 2. Submit application record to API Gateway
  try {
    const config = useRuntimeConfig();
    const headers: Record<string, string> = {};
    if (session.value?.idToken) {
      headers.Authorization = `Bearer ${session.value.idToken}`;
    } else if (session.value?.accessToken) {
      headers.Authorization = `Bearer ${session.value.accessToken}`;
    }

    const candidateId = session.value?.user?.id;

    await $fetch(`${config.public.apiUrl}/jobs/${jobId}/apply`, {
      method: "POST",
      headers,
      body: {
        candidateId,
        coverLetter: `CV adjunto: ${s3Url}`,
      },
    });

    hasApplied.value = true;
    if (process.client) {
      localStorage.setItem(`job-applied-${jobId}`, "true");
    }

    // Redirect to the chat conversation
    navigateTo(`/messages?jobId=${jobId}&candidateId=${candidateId}`);
  } catch (e: any) {
    console.error("Error submitting application record:", e);
    showInfo(
      "Notificación",
      "Se subió tu CV pero hubo un inconveniente al registrar la postulación. Intenta nuevamente.",
    );
  } finally {
    isApplying.value = false;
    selectedFile.value = null;
  }
};

// Check if user already applied
const checkAppliedStatus = () => {
  if (process.client) {
    hasApplied.value = localStorage.getItem(`job-applied-${jobId}`) === "true";
  }
};

// Check if current user can delete a comment
const canDeleteComment = (c: CommentData): boolean => {
  if (status.value !== "authenticated") return false;
  // User is author
  if (c.user.email === session.value?.user?.email) return true;
  // Or user is admin/moderator
  const role = (session.value?.user as any)?.tipoUsuario?.toUpperCase();
  return role === "ADMIN" || role === "MODERATOR";
};

// ----------------------------------------------------
// Comuni-red Comment Tree Construction Algorithm (O(N))
// ----------------------------------------------------
const commentTree = computed<CommentNode[]>(() => {
  const nodes = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  // 1. Create nodes dictionary
  commentsList.value.forEach((c) => {
    nodes.set(c.id, { ...c, children: [] });
  });

  // 2. Link child nodes to parents
  nodes.forEach((node) => {
    const parentId = node.parentCommentId;
    const parent = parentId ? nodes.get(parentId) : undefined;

    if (parent && parent.id !== node.id) {
      parent.children.push(node);
    } else {
      roots.push(node); // It's a root comment
    }
  });

  // 3. Sort chronologically: roots descending (newest first), replies ascending (oldest first)
  roots.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const sortChildren = (nodeList: CommentNode[]) => {
    nodeList.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    nodeList.forEach((child) => sortChildren(child.children));
  };

  roots.forEach((root) => sortChildren(root.children));
  return roots;
});

// Load Comments from localStorage
const loadComments = () => {
  if (process.client) {
    const saved = localStorage.getItem(`job-comments-${jobId}`);
    if (saved) {
      commentsList.value = JSON.parse(saved);
    } else {
      commentsList.value = [];
    }
    totalComments.value = commentsList.value.length;
  }
};

const saveCommentsToLocalStorage = () => {
  if (process.client) {
    localStorage.setItem(
      `job-comments-${jobId}`,
      JSON.stringify(commentsList.value),
    );
  }
};

// Add comment (Root)
const submitComment = async () => {
  if (!newCommentText.value.trim()) return;
  isCreatingComment.value = true;

  // Simulate latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  const username = session.value?.user?.name || "Candidato Anónimo";
  const email = session.value?.user?.email || "anonymous@jobnet.com";

  const newComment: CommentData = {
    id: `comm-${Date.now()}`,
    parentCommentId: null,
    content: newCommentText.value.trim(),
    createdAt: new Date().toISOString(),
    user: { username, email },
  };

  commentsList.value.push(newComment);
  saveCommentsToLocalStorage();

  newCommentText.value = "";
  totalComments.value = commentsList.value.length;
  isCreatingComment.value = false;
};

// Toggle reply form
const toggleReplyForm = (commentId: string) => {
  if (replyingToCommentId.value === commentId) {
    replyingToCommentId.value = null;
  } else {
    replyingToCommentId.value = commentId;
    replyContentText.value = "";
  }
};

// Submit reply
const submitReply = async (parentCommentId: string) => {
  if (!replyContentText.value.trim()) return;
  isCreatingComment.value = true;

  await new Promise((resolve) => setTimeout(resolve, 300));

  const username = session.value?.user?.name || "Candidato Anónimo";
  const email = session.value?.user?.email || "anonymous@jobnet.com";

  const newReply: CommentData = {
    id: `comm-${Date.now()}`,
    parentCommentId,
    content: replyContentText.value.trim(),
    createdAt: new Date().toISOString(),
    user: { username, email },
  };

  commentsList.value.push(newReply);
  saveCommentsToLocalStorage();

  replyContentText.value = "";
  replyingToCommentId.value = null;
  totalComments.value = commentsList.value.length;
  isCreatingComment.value = false;
};

// Delete Comment (Recursive cleanup BFS algorithm matching Comuni-red)
const deleteComment = (commentId: string) => {
  if (confirm("¿Estás seguro de que deseas eliminar este comentario?")) {
    const idsToRemove = new Set<string>();
    const queue = [commentId];

    // Find children using BFS queue
    while (queue.length > 0) {
      const currentId = queue.shift();
      if (!currentId) continue;
      idsToRemove.add(currentId);

      // Find children where parentCommentId matches currentId
      commentsList.value
        .filter((c) => c.parentCommentId === currentId)
        .forEach((child) => queue.push(child.id));
    }

    // Filter comments out
    commentsList.value = commentsList.value.filter(
      (c) => !idsToRemove.has(c.id),
    );
    saveCommentsToLocalStorage();
    totalComments.value = commentsList.value.length;
  }
};

onMounted(async () => {
  checkAppliedStatus();
  loadComments();
  await fetchCandidateProfile();

  // If jobs not loaded in store, fetch them
  if (jobsStore.jobs.length === 0) {
    loading.value = true;
    await jobsStore.fetchJobs();
  }
  loading.value = false;
});
</script>
