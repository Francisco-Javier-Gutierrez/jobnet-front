<template>
  <div class="max-w-4xl mx-auto px-4 py-8 w-full bg-background min-h-screen">
    <!-- Breadcrumb -->
    <div class="mb-6">
      <NuxtLink
        to="/feed"
        class="inline-flex items-center gap-1 text-primary hover:text-primary-container text-xs font-bold transition"
      >
        <span class="material-symbols-outlined text-sm">arrow_back</span>
        Volver al feed
      </NuxtLink>
    </div>

    <!-- Skeleton Loading Detail Page -->
    <div
      v-if="loading"
      class="space-y-6 animate-pulse"
      role="status"
      aria-label="Cargando detalles de la vacante"
    >
      <!-- Header Skeleton -->
      <div
        class="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-6 space-y-4"
      >
        <div class="flex items-center gap-3">
          <div class="w-14 h-14 rounded-2xl bg-outline/10 animate-pulse"></div>
          <div class="space-y-2 flex-grow">
            <div class="h-6 w-1/2 bg-outline/20 rounded animate-pulse"></div>
            <div class="h-4 w-1/4 bg-outline/10 rounded animate-pulse"></div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-6 w-16 bg-outline/20 rounded-full animate-pulse"></div>
          <div class="h-6 w-20 bg-outline/20 rounded-full animate-pulse"></div>
          <div class="h-6 w-24 bg-outline/20 rounded-full animate-pulse"></div>
        </div>
      </div>

      <!-- Description Skeleton -->
      <div
        class="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-6 space-y-4"
      >
        <div class="h-5 w-32 bg-outline/20 rounded animate-pulse"></div>
        <div class="space-y-2">
          <div class="h-4 w-full bg-outline/10 rounded animate-pulse"></div>
          <div class="h-4 w-5/6 bg-outline/10 rounded animate-pulse"></div>
          <div class="h-4 w-4/5 bg-outline/10 rounded animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Vacancy Not Found State -->
    <div
      v-else-if="!job"
      class="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm px-6"
    >
      <div
        class="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mb-4"
      >
        <span class="material-symbols-outlined text-[32px]">work_off</span>
      </div>
      <h2 class="text-lg font-bold text-on-background mb-2">
        Vacante no encontrada
      </h2>
      <p class="text-on-surface-variant text-xs max-w-sm mb-6">
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

    <!-- Vacancy Real Details -->
    <div v-else class="space-y-6">
      <!-- Alert if under evaluation (RF-23) -->
      <div
        v-if="job.estado === 'EVALUACION'"
        class="bg-amber-500/10 border border-amber-500/20 text-amber-800 p-4 rounded-2xl flex items-start gap-3 text-xs leading-relaxed shadow-sm text-left"
      >
        <span class="material-symbols-outlined text-amber-600 mt-0.5"
          >warning</span
        >
        <div>
          <p class="font-bold text-slate-900 mb-0.5">Vacante bajo evaluación</p>
          <p class="text-on-surface-variant">
            Esta oferta de empleo ha sido pausada temporalmente por moderadores
            para validar reportes de fraude o información inexacta. No se
            permiten nuevas postulaciones en este momento.
          </p>
        </div>
      </div>

      <!-- 1. Header Card -->
      <div
        class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm relative overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary"
        ></div>
        <div
          class="flex flex-col md:flex-row md:items-start md:justify-between gap-6"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xl font-bold shadow-inner"
            >
              {{ job.company ? job.company.charAt(0).toUpperCase() : "J" }}
            </div>
            <div>
              <h1
                class="text-xl md:text-2xl font-extrabold text-on-background mb-1"
              >
                {{ job.title }}
              </h1>
              <p
                class="text-sm text-primary font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                {{ job.company }}
                <span
                  class="material-symbols-outlined text-xs text-secondary fill-1"
                  title="Organización validada"
                  >verified</span
                >
              </p>
            </div>
          </div>
          <!-- Action Buttons / Apply Trigger -->
          <div
            class="flex flex-col sm:flex-row items-stretch md:items-center gap-2 flex-shrink-0"
          >
            <!-- Disable postulations if job is under evaluation -->
            <button
              v-if="job.estado === 'EVALUACION'"
              disabled
              class="bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-not-allowed"
            >
              <span class="material-symbols-outlined text-base">warning</span>
              Bajo Evaluación
            </button>
            <button
              v-else-if="hasApplied"
              disabled
              class="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span class="material-symbols-outlined text-base">task_alt</span>
              Postulado con éxito
            </button>
            <button
              v-else
              @click="scrollToApply"
              class="bg-primary hover:bg-primary-container text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-md shadow-primary/10 flex items-center justify-center gap-1 active:scale-95 duration-100 flex-grow md:flex-grow-0"
            >
              <span class="material-symbols-outlined text-base">send</span>
              Postularme ahora
            </button>
            <button
              @click="showReportModal = true"
              class="bg-surface border border-outline-variant hover:border-rose-600 text-on-surface-variant hover:text-rose-600 font-bold text-xs px-4 py-3 rounded-xl transition flex items-center justify-center gap-1 active:scale-95 duration-100"
              title="Reportar vacante sospechosa"
            >
              <span class="material-symbols-outlined text-base">flag</span>
              Reportar
            </button>
          </div>
        </div>

        <div
          class="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-outline-variant/20"
        >
          <span
            class="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-secondary/10 text-secondary border border-secondary/20 uppercase tracking-wide"
          >
            Activo
          </span>
          <span
            class="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary"
            v-if="job.modalidad"
          >
            {{ job.modalidad }}
          </span>
          <span
            class="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-tertiary-container/30 text-on-surface-variant font-mono"
            v-if="job.salario"
          >
            ${{ formatSalary(job.salario) }} MXN
          </span>
          <span
            class="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 font-mono"
            v-if="job.experienciaAnos"
          >
            {{ job.experienciaAnos }} años exp.
          </span>
        </div>
      </div>

      <!-- 2. Vacancy Information Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Main Info Columns (2 Columns) -->
        <div class="md:col-span-2 space-y-6">
          <!-- Description Card -->
          <div
            class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <h2
              class="text-base font-bold text-on-background flex items-center gap-1.5"
            >
              <span class="material-symbols-outlined text-primary text-lg"
                >description</span
              >
              Descripción del puesto
            </h2>
            <p
              class="text-xs text-on-surface-variant leading-relaxed whitespace-pre-line"
            >
              {{
                job.descripcion ||
                "No se ha proporcionado una descripción detallada para esta vacante corporativa."
              }}
            </p>
          </div>

          <!-- Spec PDF Document Card -->
          <div
            v-if="job.pdfUrl"
            class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <h2
              class="text-base font-bold text-on-background flex items-center gap-1.5"
            >
              <span class="material-symbols-outlined text-primary text-lg"
                >picture_as_pdf</span
              >
              Documentación adicional
            </h2>
            <div
              class="flex items-center justify-between p-4 bg-surface-container-low border border-outline-variant/40 rounded-xl"
            >
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-rose-600 text-3xl"
                  >picture_as_pdf</span
                >
                <div class="text-left">
                  <p class="text-xs font-bold text-on-background">
                    Descriptor de Puesto.pdf
                  </p>
                  <p class="text-[10px] text-on-surface-variant/80">
                    Documento oficial de la vacante
                  </p>
                </div>
              </div>
              <a
                :href="job.pdfUrl"
                target="_blank"
                download
                class="flex items-center gap-1 px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                <span class="material-symbols-outlined text-sm">download</span>
                Descargar
              </a>
            </div>
          </div>

          <!-- Skills Card -->
          <div
            v-if="
              job.habilidadesRequeridas && job.habilidadesRequeridas.length > 0
            "
            class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <h2
              class="text-base font-bold text-on-background flex items-center gap-1.5"
            >
              <span class="material-symbols-outlined text-primary text-lg"
                >psychology</span
              >
              Habilidades y conocimientos requeridos
            </h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in job.habilidadesRequeridas"
                :key="skill"
                class="bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/10"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Sectores Card -->
          <div
            v-if="job.sectores && job.sectores.length > 0"
            class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <h2
              class="text-base font-bold text-on-background flex items-center gap-1.5"
            >
              <span class="material-symbols-outlined text-secondary text-lg"
                >business_center</span
              >
              Sectores de la industria
            </h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="sector in job.sectores"
                :key="sector"
                class="bg-secondary/5 text-secondary px-3 py-1 rounded-full text-xs font-bold border border-secondary/10"
              >
                {{ sector }}
              </span>
            </div>
          </div>
        </div>

        <!-- Sidebar Widgets (1 Column) -->
        <div class="space-y-6">
          <!-- Location Map Widget -->
          <div
            class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div>
              <h3
                class="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-sm text-secondary"
                  >location_on</span
                >
                Ubicación
              </h3>
              <p class="text-xs font-bold text-on-background mb-2">
                {{ job.sector || "Ubicación Georeferenciada" }}
              </p>
              <p class="text-[10px] text-on-surface-variant/80 font-mono mb-4">
                Lat: {{ job.lat }}, Lng: {{ job.lng }}
              </p>
            </div>
            <NuxtLink
              :to="`/map?lat=${job.lat}&lng=${job.lng}`"
              class="w-full bg-surface border border-outline-variant hover:border-primary hover:bg-primary/5 text-primary font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1"
            >
              <span class="material-symbols-outlined text-sm">map</span>
              Ver en mapa general
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 3. Persisted Application Form -->
      <div
        id="apply-section"
        class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm space-y-4"
      >
        <h2
          class="text-base font-bold text-on-background flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-primary text-lg"
            >assignment_ind</span
          >
          Postulación e Interés Profesional
        </h2>

        <div
          v-if="job.estado === 'EVALUACION'"
          class="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-xs leading-relaxed space-y-2 text-left"
        >
          <p class="font-bold flex items-center gap-1">
            <span class="material-symbols-outlined text-base">warning</span>
            Postulaciones pausadas temporalmente
          </p>
          <p>
            Esta vacante se encuentra bajo revisión por el equipo de moderación.
            No se permiten nuevas postulaciones hasta que se resuelva su
            estatus.
          </p>
        </div>

        <div
          v-else-if="hasApplied"
          class="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs leading-relaxed space-y-2"
        >
          <p class="font-bold flex items-center gap-1">
            <span class="material-symbols-outlined text-base"
              >check_circle</span
            >
            ¡Ya te has postulado a esta vacante!
          </p>
          <p>
            Tu CV y perfil profesional han sido enviados al equipo de
            reclutamiento de <strong>{{ job.company }}</strong
            >. Te mantendremos informado de cualquier avance mediante
            notificaciones.
          </p>
        </div>

        <form v-else @submit.prevent="submitApplication" class="space-y-4">
          <p class="text-xs text-on-surface-variant">
            Sube tu currículum vitae en formato PDF para enviar tu postulación
            de forma automática.
          </p>

          <!-- Upload CV Input Area -->
          <div
            class="border-2 border-dashed border-outline-variant hover:border-primary rounded-2xl p-6 text-center cursor-pointer transition relative"
          >
            <input
              type="file"
              accept=".pdf"
              @change="handleFileChange"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="cv-upload-input"
            />
            <div class="space-y-2">
              <span class="material-symbols-outlined text-[40px] text-outline"
                >cloud_upload</span
              >
              <p class="text-xs font-bold text-on-background">
                {{
                  selectedFile
                    ? selectedFile.name
                    : "Arrastra o haz clic para subir tu CV (PDF)"
                }}
              </p>
              <p class="text-[10px] text-on-surface-variant/80">
                Límite de tamaño: 5MB
              </p>
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button
              type="submit"
              :disabled="!selectedFile || isApplying"
              class="bg-primary hover:bg-primary-container text-white disabled:bg-primary/40 disabled:text-white/60 font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1 shadow-md shadow-primary/10"
            >
              <span
                v-if="isApplying"
                class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
              ></span>
              {{ isApplying ? "Enviando CV..." : "Enviar Postulación" }}
            </button>
          </div>
        </form>
      </div>

      <!-- 4. Comuni-red Pattern Threaded Comments Section -->
      <div
        class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm space-y-6"
      >
        <h2
          class="text-base font-bold text-on-background flex items-center gap-1.5 border-b border-outline-variant/30 pb-4"
        >
          <span class="material-symbols-outlined text-primary text-lg"
            >forum</span
          >
          Comentarios y Preguntas ({{ totalComments }})
        </h2>

        <!-- Comment Input -->
        <form @submit.prevent="submitComment" class="flex flex-col gap-3">
          <textarea
            v-model="newCommentText"
            placeholder="Pregunta o comenta algo sobre este puesto..."
            rows="3"
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl p-4 text-xs text-on-background outline-none transition placeholder-on-surface-variant/50 resize-none font-sans"
            aria-label="Agregar un comentario público"
          ></textarea>
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="!newCommentText.trim() || isCreatingComment"
              class="bg-primary hover:bg-primary-container text-white disabled:bg-primary/40 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
            >
              Comentar
            </button>
          </div>
        </form>

        <!-- Comments Tree Render -->
        <div
          v-if="commentTree.length === 0"
          class="text-center py-8 text-on-surface-variant/60 text-xs"
        >
          <span class="material-symbols-outlined text-[32px] text-outline mb-2"
            >comments_disabled</span
          >
          <p>No hay preguntas todavía. Sé el primero en comentar.</p>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="node in commentTree"
            :key="node.id"
            class="p-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl space-y-3 relative group"
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
                  <span class="text-[10px] text-on-surface-variant/80">{{
                    formatDate(node.createdAt)
                  }}</span>
                </div>
              </div>

              <!-- Delete Action for comment author -->
              <button
                v-if="canDeleteComment(node)"
                @click="deleteComment(node.id)"
                class="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition"
                title="Eliminar pregunta"
              >
                <span class="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>

            <!-- Content -->
            <p class="text-xs text-on-surface-variant leading-relaxed">
              {{ node.content }}
            </p>

            <!-- Actions Bar -->
            <div class="flex items-center gap-3 pt-2">
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
              class="mt-3 flex gap-2"
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
                class="bg-secondary text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-[#005236] transition shadow-sm"
              >
                Responder
              </button>
            </form>

            <!-- Nested Replies (Replies tree render) -->
            <div
              v-if="node.children && node.children.length > 0"
              class="ml-6 md:ml-8 mt-4 border-l-2 border-outline-variant/30 pl-4 space-y-4"
            >
              <div
                v-for="reply in node.children"
                :key="reply.id"
                class="p-3 bg-surface-container-low/40 border border-outline-variant/20 rounded-xl space-y-2 relative"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-[10px] shadow-sm"
                    >
                      {{ reply.user.username.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <h5 class="text-[11px] font-bold text-on-background">
                        {{ reply.user.username }}
                      </h5>
                      <span class="text-[9px] text-on-surface-variant/80">{{
                        formatDate(reply.createdAt)
                      }}</span>
                    </div>
                  </div>

                  <!-- Delete Action for reply author -->
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
                <p class="text-xs text-on-surface-variant leading-relaxed">
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
  <div
    v-if="showReportModal"
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
          <span class="material-symbols-outlined text-rose-600">flag</span>
          Reportar vacante sospechosa
        </h3>
        <button
          @click="showReportModal = false"
          class="text-on-surface-variant hover:bg-surface-container rounded-lg p-1 transition flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <div
        v-if="reportSuccess"
        class="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-xs font-semibold"
      >
        <span class="material-symbols-outlined text-lg">check_circle</span>
        Reporte enviado exitosamente. Moderadores revisarán este contenido.
      </div>

      <form v-else @submit.prevent="submitReport" class="space-y-4 text-left">
        <p class="text-xs text-on-surface-variant leading-relaxed">
          Tu reporte será analizado de forma anónima por nuestro equipo de
          moderación. Por favor selecciona el motivo principal de la denuncia.
        </p>

        <div class="space-y-2 flex flex-col">
          <label class="text-xs font-bold text-on-surface-variant"
            >Motivo del reporte</label
          >
          <select
            v-model="reportReason"
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2.5 text-xs text-on-background outline-none transition appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23777587%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1.5em_1.5em] pr-8"
          >
            <option value="Vacante falsa">Vacante falsa / Estafa</option>
            <option value="Información engañosa">
              Información engañosa o imprecisa
            </option>
            <option value="Contenido inapropiado">
              Contenido inapropiado / Discriminatorio
            </option>
            <option value="Otro">Otro motivo</option>
          </select>
        </div>

        <div class="space-y-2 flex flex-col">
          <label
            class="text-xs font-bold text-on-surface-variant"
            for="report-comments"
            >Comentarios adicionales</label
          >
          <textarea
            v-model="reportComments"
            id="report-comments"
            placeholder="Explica detalladamente por qué consideras que esta vacante infringe las políticas..."
            rows="4"
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl p-3 text-xs text-on-background outline-none transition resize-none"
            required
          ></textarea>
        </div>

        <div
          class="flex justify-end gap-2 pt-2 border-t border-outline-variant/30"
        >
          <button
            type="button"
            @click="showReportModal = false"
            class="bg-surface border border-outline-variant hover:bg-surface-container text-on-surface-variant font-semibold text-xs px-4 py-2.5 rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="!reportComments.trim() || isReporting"
            class="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <span
              v-if="isReporting"
              class="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"
            ></span>
            Enviar Denuncia
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useJobsStore } from "~/stores/jobs";
import { useUploadStore } from "~/stores/upload";

const config = useRuntimeConfig();

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
    alert("Hubo un error al enviar el reporte. Por favor, intenta de nuevo.");
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

// CV Form selection
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (file.type !== "application/pdf") {
      alert("Por favor selecciona un archivo en formato PDF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("El tamaño del archivo no debe exceder los 5MB.");
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
    alert("Hubo un error al subir tu CV a S3: " + uploadResult.error);
    isApplying.value = false;
    return;
  }

  const s3Url = uploadResult.url;

  // 2. Submit application record to API Gateway
  try {
    const config = useRuntimeConfig();
    const headers: Record<string, string> = {};
    if (session.value?.accessToken) {
      headers.Authorization = `Bearer ${session.value.accessToken}`;
    }

    const candidateId = session.value?.user?.id || "mock-candidate-id";

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
  } catch (e: any) {
    console.error("Error submitting application record:", e);
    alert(
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
      // Initialize with mock questions
      commentsList.value = [
        {
          id: "mock-c1",
          parentCommentId: null,
          content: "¿Esta vacante incluye opciones de apoyo para reubicación?",
          createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
          user: {
            username: "Sofía Dev",
            email: "sofia@gmail.com",
          },
        },
        {
          id: "mock-c2",
          parentCommentId: "mock-c1",
          content:
            "Hola Sofía, sí, ofrecemos apoyo de reubicación y hospedaje el primer mes.",
          createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
          user: {
            username: "Tech Solutions Team",
            email: "team@techsolutions.com",
          },
        },
      ];
      saveCommentsToLocalStorage();
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

  // If jobs not loaded in store, fetch them
  if (jobsStore.jobs.length === 0) {
    loading.value = true;
    await jobsStore.fetchJobs();
  }
  loading.value = false;
});
</script>
