<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm select-none"
        @keydown.esc="closeModal"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        data-modal-active="true"
      >
        <!-- Modal Card Container -->
        <div
          class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-3xl w-full max-w-7xl h-[94vh] max-h-[94vh] flex flex-col shadow-2xl overflow-hidden"
          @click.stop
        >
          <!-- Modal Header -->
          <div
            class="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-outline-variant/50 dark:border-slate-800 flex items-center justify-between bg-surface-container-low/70 dark:bg-slate-950/70 shrink-0"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20"
              >
                <span class="material-symbols-outlined text-xl"
                  >picture_as_pdf</span
                >
              </div>
              <div class="min-w-0 text-left">
                <h2
                  class="font-extrabold text-on-surface dark:text-slate-100 text-sm sm:text-base truncate"
                >
                  Generador de Currículum Vitae (Formato Carta)
                </h2>
                <p
                  class="text-[11px] text-on-surface-variant dark:text-slate-400 truncate"
                >
                  6 diseños profesionales optimizados para filtros ATS · Tamaño
                  215.9 × 279.4 mm
                </p>
              </div>
            </div>

            <!-- Action Controls in Header -->
            <div class="flex items-center gap-2 shrink-0">
              <!-- Download PDF Button -->
              <button
                type="button"
                @click="handleDownload"
                :disabled="isGenerating || isSavingToProfile"
                class="px-3.5 py-2 rounded-xl bg-surface border border-outline-variant/60 hover:border-primary/50 text-on-surface font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                title="Descargar documento PDF directamente"
              >
                <span
                  v-if="isGenerating"
                  class="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"
                ></span>
                <span v-else class="material-symbols-outlined text-base"
                  >download</span
                >
                <span class="hidden sm:inline">Descargar PDF</span>
              </button>

              <!-- Save to Profile Button -->
              <button
                type="button"
                @click="handleSaveToProfile"
                :disabled="isGenerating || isSavingToProfile"
                class="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50 active:scale-95 duration-100"
                title="Guardar como tu CV principal y sincronizar datos con tu perfil"
              >
                <span
                  v-if="isSavingToProfile"
                  class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></span>
                <span v-else class="material-symbols-outlined text-base"
                  >cloud_upload</span
                >
                <span>{{
                  isSavingToProfile ? "Guardando..." : "Guardar en Perfil"
                }}</span>
              </button>

              <!-- Close Modal Button -->
              <button
                type="button"
                @click="closeModal"
                class="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center transition cursor-pointer ml-1"
                title="Cerrar ventana"
              >
                <span class="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          </div>

          <!-- Modal Body: Two Columns (Editor vs Live Carta Preview) -->
          <div
            class="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden"
          >
            <!-- Mobile View Switcher -->
            <div
              class="lg:hidden col-span-1 border-b border-outline-variant/50 p-2 flex items-center gap-2 bg-surface-container-low"
            >
              <button
                type="button"
                @click="activeMobileTab = 'editor'"
                class="flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                :class="
                  activeMobileTab === 'editor'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant'
                "
              >
                <span class="material-symbols-outlined text-sm">edit</span>
                <span>Editar Datos</span>
              </button>
              <button
                type="button"
                @click="activeMobileTab = 'preview'"
                class="flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                :class="
                  activeMobileTab === 'preview'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant'
                "
              >
                <span class="material-symbols-outlined text-sm">preview</span>
                <span>Vista Previa Carta</span>
              </button>
            </div>

            <!-- LEFT COLUMN: Editor & Settings (5 of 12 cols) -->
            <div
              class="lg:col-span-5 border-r border-outline-variant/60 dark:border-slate-800 flex flex-col min-h-0 bg-surface-container-lowest dark:bg-slate-900"
              :class="{ 'hidden lg:flex': activeMobileTab === 'preview' }"
            >
              <!-- Editor Top Tabs -->
              <div
                class="flex items-center border-b border-outline-variant/50 dark:border-slate-800 px-4 pt-2 shrink-0 bg-surface-container-low/40"
              >
                <button
                  type="button"
                  @click="activeTab = 'template'"
                  class="pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 cursor-pointer"
                  :class="
                    activeTab === 'template'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-on-surface-variant hover:text-on-surface'
                  "
                >
                  <span class="material-symbols-outlined text-base"
                    >dashboard_customize</span
                  >
                  <span>Plantilla</span>
                </button>

                <button
                  type="button"
                  @click="activeTab = 'content'"
                  class="pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 cursor-pointer"
                  :class="
                    activeTab === 'content'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-on-surface-variant hover:text-on-surface'
                  "
                >
                  <span class="material-symbols-outlined text-base"
                    >edit_note</span
                  >
                  <span>Contenido del CV</span>
                </button>

                <button
                  type="button"
                  @click="activeTab = 'settings'"
                  class="pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 cursor-pointer"
                  :class="
                    activeTab === 'settings'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-on-surface-variant hover:text-on-surface'
                  "
                >
                  <span class="material-symbols-outlined text-base">tune</span>
                  <span>Estilo & Calidad ATS</span>
                  <span
                    class="px-1.5 py-0.2 rounded-full text-[10px] font-bold"
                    :class="atsEvaluation.badgeColor"
                  >
                    {{ atsEvaluation.score }}%
                  </span>
                </button>
              </div>

              <!-- TAB 0: Plantillas de CV -->
              <div
                v-if="activeTab === 'template'"
                class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs select-text"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-bold text-on-surface text-sm">
                      Elige tu Plantilla Carta
                    </h3>
                    <p class="text-[11px] text-on-surface-variant">
                      6 diseños profesionales optimizados para filtros ATS
                    </p>
                  </div>
                  <span
                    class="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold"
                  >
                    Carta (215.9 × 279.4 mm)
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    v-for="tmpl in TEMPLATE_OPTIONS"
                    :key="tmpl.id"
                    type="button"
                    @click="options.templateId = tmpl.id"
                    class="p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2.5 cursor-pointer relative"
                    :class="
                      options.templateId === tmpl.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                        : 'border-outline-variant/60 hover:border-outline hover:bg-surface-container-low'
                    "
                  >
                    <div class="flex items-center justify-between">
                      <div
                        class="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                        :class="
                          options.templateId === tmpl.id
                            ? 'bg-primary text-white'
                            : 'bg-surface-container text-on-surface-variant'
                        "
                      >
                        <span class="material-symbols-outlined text-lg">{{
                          tmpl.icon
                        }}</span>
                      </div>
                      <span
                        v-if="options.templateId === tmpl.id"
                        class="material-symbols-outlined text-primary text-lg"
                      >
                        check_circle
                      </span>
                    </div>
                    <div>
                      <span class="font-bold text-xs text-on-surface block">
                        {{ tmpl.name }}
                      </span>
                      <span
                        class="text-[11px] text-on-surface-variant line-clamp-2 leading-snug mt-0.5"
                      >
                        {{ tmpl.desc }}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              <!-- TAB 1: Contenido del CV -->
              <div
                v-if="activeTab === 'content'"
                class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs select-text"
              >
                <!-- Notice: Reset to original profile -->
                <div
                  class="flex items-center justify-between text-[11px] text-on-surface-variant"
                >
                  <span>Edita tu información directamente en tiempo real:</span>
                  <button
                    type="button"
                    @click="handleResetToOriginal"
                    class="text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Restablecer perfil
                  </button>
                </div>

                <!-- Section 1: Datos Básicos -->
                <div
                  class="space-y-3 p-3.5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/40"
                >
                  <h3
                    class="font-bold text-on-surface flex items-center gap-1.5"
                  >
                    <span class="material-symbols-outlined text-sm text-primary"
                      >badge</span
                    >
                    <span>Datos Principales</span>
                  </h3>

                  <div class="space-y-1">
                    <label
                      class="text-[11px] font-semibold text-on-surface-variant"
                      >Nombre Completo</label
                    >
                    <input
                      v-model="editableCv.name"
                      :disabled="options.anonymousMode"
                      type="text"
                      placeholder="Nombre completo"
                      class="w-full px-3 py-2 text-xs rounded-xl bg-surface dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none transition disabled:opacity-60"
                    />
                    <p
                      v-if="options.anonymousMode"
                      class="text-[10px] text-primary italic"
                    >
                      🔒 En Modo Anónimo, tu nombre se anonimiza automáticamente
                      como "Candidato #XXXXXX".
                    </p>
                  </div>

                  <div class="space-y-1">
                    <label
                      class="text-[11px] font-semibold text-on-surface-variant"
                      >Título / Rol Profesional *</label
                    >
                    <input
                      v-model="editableCv.title"
                      type="text"
                      placeholder="Ej. Ingeniero de Software / Contador Público"
                      class="w-full px-3 py-2 text-xs rounded-xl bg-surface dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none transition font-medium"
                    />
                  </div>

                  <div class="space-y-1">
                    <label
                      class="text-[11px] font-semibold text-on-surface-variant"
                      >Ubicación</label
                    >
                    <input
                      v-model="editableCv.location"
                      type="text"
                      placeholder="Ej. Toluca, Estado de México"
                      class="w-full px-3 py-2 text-xs rounded-xl bg-surface dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none transition"
                    />
                  </div>
                </div>

                <!-- Section 2: Resumen Profesional -->
                <div
                  class="space-y-2 p-3.5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/40"
                >
                  <div class="flex items-center justify-between">
                    <h3
                      class="font-bold text-on-surface flex items-center gap-1.5"
                    >
                      <span
                        class="material-symbols-outlined text-sm text-primary"
                        >subject</span
                      >
                      <span>Resumen Profesional</span>
                    </h3>
                    <span class="text-[10px] text-on-surface-variant">
                      {{ wordCount(editableCv.bio) }} palabras (Mínimo
                      recomendado: 18)
                    </span>
                  </div>

                  <textarea
                    v-model="editableCv.bio"
                    rows="4"
                    placeholder="Describe en 3 o 4 líneas tus principales fortalezas, años de trayectoria, especialidades y el valor que aportas a las organizaciones..."
                    class="w-full p-3 text-xs rounded-xl bg-surface dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none leading-relaxed transition resize-y"
                  ></textarea>
                </div>

                <!-- Section 3: Experiencias Laborales -->
                <div
                  class="space-y-3 p-3.5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/40"
                >
                  <div class="flex items-center justify-between">
                    <h3
                      class="font-bold text-on-surface flex items-center gap-1.5"
                    >
                      <span
                        class="material-symbols-outlined text-sm text-primary"
                        >work</span
                      >
                      <span
                        >Experiencia Laboral ({{
                          editableCv.experience.length
                        }})</span
                      >
                    </h3>
                    <button
                      type="button"
                      @click="handleAddExperience"
                      class="text-primary hover:underline font-bold text-[11px] flex items-center gap-0.5 cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-sm">add</span>
                      <span>Agregar</span>
                    </button>
                  </div>

                  <!-- STAR Verbs Helper Pills -->
                  <div class="space-y-1">
                    <span
                      class="text-[10px] text-on-surface-variant font-medium"
                      >Verbos STAR de alto impacto:</span
                    >
                    <div class="flex flex-wrap gap-1">
                      <button
                        v-for="verb in quickVerbs"
                        :key="verb"
                        type="button"
                        @click="insertActionVerb(verb)"
                        class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface hover:bg-primary/10 text-on-surface border border-outline-variant/40 transition cursor-pointer"
                        title="Haz clic para agregar a la descripción"
                      >
                        + {{ verb }}
                      </button>
                    </div>
                  </div>

                  <div class="space-y-3 pt-1">
                    <div
                      v-for="(exp, idx) in editableCv.experience"
                      :key="idx"
                      class="p-3 rounded-xl bg-surface border border-outline-variant/60 space-y-2 relative group"
                    >
                      <button
                        type="button"
                        @click="editableCv.experience.splice(idx, 1)"
                        class="absolute top-2 right-2 text-on-surface-variant hover:text-rose-500 p-1 cursor-pointer transition"
                        title="Eliminar experiencia"
                      >
                        <span class="material-symbols-outlined text-sm"
                          >delete</span
                        >
                      </button>

                      <div class="grid grid-cols-2 gap-2 pr-6">
                        <div>
                          <label
                            class="text-[10px] font-semibold text-on-surface-variant"
                            >Puesto / Cargo</label
                          >
                          <input
                            v-model="exp.puesto"
                            type="text"
                            placeholder="Ej. Líder Técnico"
                            class="w-full px-2.5 py-1.5 text-xs rounded-lg bg-surface-container dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none"
                          />
                        </div>
                        <div>
                          <label
                            class="text-[10px] font-semibold text-on-surface-variant"
                            >Empresa</label
                          >
                          <input
                            v-model="exp.empresa"
                            type="text"
                            placeholder="Ej. Grupo Empresarial"
                            class="w-full px-2.5 py-1.5 text-xs rounded-lg bg-surface-container dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none"
                          />
                        </div>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label
                            class="text-[10px] font-semibold text-on-surface-variant"
                            >Periodo</label
                          >
                          <input
                            v-model="exp.periodo"
                            type="text"
                            placeholder="Ej. 2022 - Presente"
                            class="w-full px-2.5 py-1.5 text-xs rounded-lg bg-surface-container dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          class="text-[10px] font-semibold text-on-surface-variant"
                          >Logros y Responsabilidades</label
                        >
                        <textarea
                          v-model="exp.descripcion"
                          rows="3"
                          placeholder="• Lideré la optimización de procesos reduciendo tiempos en un 25%..."
                          class="w-full px-2.5 py-1.5 text-xs rounded-lg bg-surface-container dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none leading-relaxed resize-y"
                        ></textarea>
                      </div>
                    </div>

                    <div
                      v-if="editableCv.experience.length === 0"
                      class="text-center py-4 border border-dashed border-outline-variant/60 rounded-xl text-on-surface-variant"
                    >
                      <span>Sin experiencias agregadas.</span>
                      <button
                        type="button"
                        @click="handleAddExperience"
                        class="block mx-auto mt-1 text-primary font-bold hover:underline"
                      >
                        + Agregar primera experiencia
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Section 4: Educación & Formación -->
                <div
                  class="space-y-3 p-3.5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/40"
                >
                  <div class="flex items-center justify-between">
                    <h3
                      class="font-bold text-on-surface flex items-center gap-1.5"
                    >
                      <span
                        class="material-symbols-outlined text-sm text-primary"
                        >school</span
                      >
                      <span
                        >Educación & Formación ({{
                          editableCv.education.length
                        }})</span
                      >
                    </h3>
                    <button
                      type="button"
                      @click="handleAddEducation"
                      class="text-primary hover:underline font-bold text-[11px] flex items-center gap-0.5 cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-sm">add</span>
                      <span>Agregar</span>
                    </button>
                  </div>

                  <div class="space-y-3">
                    <div
                      v-for="(edu, idx) in editableCv.education"
                      :key="idx"
                      class="p-3 rounded-xl bg-surface border border-outline-variant/60 space-y-2 relative group"
                    >
                      <button
                        type="button"
                        @click="editableCv.education.splice(idx, 1)"
                        class="absolute top-2 right-2 text-on-surface-variant hover:text-rose-500 p-1 cursor-pointer transition"
                        title="Eliminar educación"
                      >
                        <span class="material-symbols-outlined text-sm"
                          >delete</span
                        >
                      </button>

                      <div class="grid grid-cols-2 gap-2 pr-6">
                        <div>
                          <label
                            class="text-[10px] font-semibold text-on-surface-variant"
                            >Título / Grado</label
                          >
                          <input
                            v-model="edu.titulo"
                            type="text"
                            placeholder="Ej. Licenciatura / Ingeniería"
                            class="w-full px-2.5 py-1.5 text-xs rounded-lg bg-surface-container dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none"
                          />
                        </div>
                        <div>
                          <label
                            class="text-[10px] font-semibold text-on-surface-variant"
                            >Institución</label
                          >
                          <input
                            v-model="edu.institucion"
                            type="text"
                            placeholder="Ej. Universidad Autónoma"
                            class="w-full px-2.5 py-1.5 text-xs rounded-lg bg-surface-container dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          class="text-[10px] font-semibold text-on-surface-variant"
                          >Periodo</label
                        >
                        <input
                          v-model="edu.periodo"
                          type="text"
                          placeholder="Ej. 2018 - 2022"
                          class="w-full sm:w-1/2 px-2.5 py-1.5 text-xs rounded-lg bg-surface-container dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none"
                        />
                      </div>
                    </div>

                    <div
                      v-if="editableCv.education.length === 0"
                      class="text-center py-4 border border-dashed border-outline-variant/60 rounded-xl text-on-surface-variant"
                    >
                      <span>Sin registros académicos agregados.</span>
                      <button
                        type="button"
                        @click="handleAddEducation"
                        class="block mx-auto mt-1 text-primary font-bold hover:underline"
                      >
                        + Agregar educación
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Section 5: Habilidades Clave -->
                <div
                  class="space-y-3 p-3.5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/40"
                >
                  <h3
                    class="font-bold text-on-surface flex items-center gap-1.5"
                  >
                    <span class="material-symbols-outlined text-sm text-primary"
                      >psychology</span
                    >
                    <span
                      >Habilidades Clave ({{ editableCv.skills.length }})</span
                    >
                  </h3>

                  <div class="flex items-center gap-2">
                    <input
                      v-model="newSkillInput"
                      @keydown.enter.prevent="handleAddSkill(newSkillInput)"
                      type="text"
                      placeholder="Escribe una habilidad y presiona Enter..."
                      class="flex-1 px-3 py-1.5 text-xs rounded-xl bg-surface dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none"
                    />
                    <button
                      type="button"
                      @click="handleAddSkill(newSkillInput)"
                      class="px-3 py-1.5 rounded-xl bg-primary text-white font-bold text-xs cursor-pointer"
                    >
                      Agregar
                    </button>
                  </div>

                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="(skill, idx) in editableCv.skills"
                      :key="idx"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/60 text-on-surface text-[11px]"
                    >
                      <span>{{ skill }}</span>
                      <button
                        type="button"
                        @click="editableCv.skills.splice(idx, 1)"
                        class="text-on-surface-variant hover:text-rose-500 font-bold ml-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                </div>

                <!-- Section 6: Idiomas -->
                <div
                  class="space-y-3 p-3.5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/40"
                >
                  <h3
                    class="font-bold text-on-surface flex items-center gap-1.5"
                  >
                    <span class="material-symbols-outlined text-sm text-primary"
                      >translate</span
                    >
                    <span>Idiomas</span>
                  </h3>

                  <div class="flex items-center gap-2">
                    <input
                      v-model="newLanguageInput"
                      @keydown.enter.prevent="
                        handleAddLanguage(newLanguageInput)
                      "
                      type="text"
                      placeholder="Ej. Español (Nativo), Inglés (Intermedio B2)..."
                      class="flex-1 px-3 py-1.5 text-xs rounded-xl bg-surface dark:bg-slate-800 border border-outline-variant/60 focus:border-primary outline-none"
                    />
                    <button
                      type="button"
                      @click="handleAddLanguage(newLanguageInput)"
                      class="px-3 py-1.5 rounded-xl bg-primary text-white font-bold text-xs cursor-pointer"
                    >
                      Agregar
                    </button>
                  </div>

                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="(lang, idx) in editableCv.languages || []"
                      :key="idx"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/60 text-on-surface text-[11px]"
                    >
                      <span>{{ lang }}</span>
                      <button
                        type="button"
                        @click="editableCv.languages?.splice(idx, 1)"
                        class="text-on-surface-variant hover:text-rose-500 font-bold ml-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                </div>
              </div>

              <!-- TAB 2: Ajustes de Estilo & Calidad ATS -->
              <div
                v-else
                class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs select-text"
              >
                <!-- Modo Anónimo RF-123 -->
                <div
                  class="p-4 rounded-2xl border transition"
                  :class="
                    options.anonymousMode
                      ? 'bg-indigo-500/10 border-indigo-500/30'
                      : 'bg-surface-container-low/50 border-outline-variant/40'
                  "
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <span
                          class="material-symbols-outlined text-lg text-primary"
                          >visibility_off</span
                        >
                        <h3 class="font-bold text-on-surface">
                          Modo Anónimo Imparcial
                        </h3>
                      </div>
                      <p
                        class="text-[11px] text-on-surface-variant leading-relaxed"
                      >
                        Oculta foto, nombre completo, correo, teléfono y enlaces
                        externos para garantizar una evaluación imparcial sin
                        sesgos demográficos.
                      </p>
                    </div>
                    <input
                      v-model="options.anonymousMode"
                      type="checkbox"
                      class="w-4 h-4 rounded text-primary accent-primary cursor-pointer mt-1"
                    />
                  </div>
                </div>

                <!-- Color Theme Selection -->
                <div
                  class="space-y-2 p-3.5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/40"
                >
                  <h3
                    class="font-bold text-on-surface flex items-center gap-1.5"
                  >
                    <span class="material-symbols-outlined text-sm text-primary"
                      >palette</span
                    >
                    <span>Color de Acento</span>
                  </h3>
                  <div class="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      v-for="theme in CV_COLOR_THEMES"
                      :key="theme.id"
                      type="button"
                      @click="selectColorTheme(theme)"
                      class="w-8 h-8 rounded-full border-2 transition flex items-center justify-center cursor-pointer shadow-xs"
                      :style="{ backgroundColor: theme.primary }"
                      :class="
                        options.colorTheme === theme.id
                          ? 'border-primary ring-2 ring-primary/40 scale-110'
                          : 'border-white dark:border-slate-800'
                      "
                      :title="theme.name"
                    >
                      <span
                        v-if="options.colorTheme === theme.id"
                        class="material-symbols-outlined text-white text-sm"
                      >
                        check
                      </span>
                    </button>
                  </div>
                </div>

                <!-- Font Size Selection -->
                <div
                  class="space-y-2 p-3.5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/40"
                >
                  <h3
                    class="font-bold text-on-surface flex items-center gap-1.5"
                  >
                    <span class="material-symbols-outlined text-sm text-primary"
                      >format_size</span
                    >
                    <span>Tamaño de Tipografía</span>
                  </h3>
                  <div class="flex items-center gap-2">
                    <button
                      v-for="size in FONT_SIZES"
                      :key="size.id"
                      type="button"
                      @click="options.fontSize = size.id"
                      class="flex-1 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer"
                      :class="
                        options.fontSize === size.id
                          ? 'bg-primary text-white border-primary'
                          : 'bg-surface border-outline-variant/50 text-on-surface-variant hover:text-on-surface'
                      "
                    >
                      {{ size.label }}
                    </button>
                  </div>
                </div>

                <!-- Section Visibility Toggles -->
                <div
                  class="space-y-2 p-3.5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/40"
                >
                  <h3
                    class="font-bold text-on-surface flex items-center gap-1.5"
                  >
                    <span class="material-symbols-outlined text-sm text-primary"
                      >visibility</span
                    >
                    <span>Visibilidad de Secciones</span>
                  </h3>
                  <div class="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="options.showBio"
                        type="checkbox"
                        class="accent-primary"
                      />
                      <span>Resumen Profesional</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="options.showExperience"
                        type="checkbox"
                        class="accent-primary"
                      />
                      <span>Experiencia Laboral</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="options.showEducation"
                        type="checkbox"
                        class="accent-primary"
                      />
                      <span>Educación</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="options.showSkills"
                        type="checkbox"
                        class="accent-primary"
                      />
                      <span>Habilidades</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        v-model="options.showLanguages"
                        type="checkbox"
                        class="accent-primary"
                      />
                      <span>Idiomas</span>
                    </label>
                    <label
                      v-if="!options.anonymousMode"
                      class="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        v-model="options.showPhoto"
                        type="checkbox"
                        class="accent-primary"
                      />
                      <span>Foto de Perfil</span>
                    </label>
                  </div>
                </div>

                <!-- Live ATS Score Evaluation Checklist -->
                <div
                  class="space-y-3 p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/40"
                >
                  <div class="flex items-center justify-between">
                    <h3
                      class="font-bold text-on-surface flex items-center gap-1.5"
                    >
                      <span
                        class="material-symbols-outlined text-sm text-emerald-600"
                        >verified</span
                      >
                      <span>Auditoría de Calidad ATS</span>
                    </h3>
                    <span
                      class="px-2.5 py-0.5 rounded-full text-xs font-extrabold border"
                      :class="atsEvaluation.badgeColor"
                    >
                      {{ atsEvaluation.score }}% · {{ atsEvaluation.status }}
                    </span>
                  </div>

                  <div class="space-y-2 pt-1">
                    <div
                      v-for="(item, idx) in atsEvaluation.checklist"
                      :key="idx"
                      class="flex items-start gap-2 text-[11px]"
                    >
                      <span
                        class="material-symbols-outlined text-sm shrink-0 mt-0.5"
                        :class="
                          item.passed ? 'text-emerald-500' : 'text-slate-400'
                        "
                      >
                        {{
                          item.passed
                            ? "check_circle"
                            : "radio_button_unchecked"
                        }}
                      </span>
                      <div>
                        <p
                          class="font-semibold"
                          :class="
                            item.passed
                              ? 'text-on-surface'
                              : 'text-on-surface-variant'
                          "
                        >
                          {{ item.label }}
                        </p>
                        <p
                          v-if="!item.passed"
                          class="text-[10px] text-on-surface-variant italic"
                        >
                          Tip: {{ item.tip }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- RIGHT COLUMN: Live Carta Preview (7 of 12 cols) -->
            <div
              class="lg:col-span-7 bg-slate-200 dark:bg-slate-950 flex flex-col min-h-0 relative overflow-hidden"
              :class="{ 'hidden lg:flex': activeMobileTab === 'editor' }"
            >
              <!-- Preview Bar with Zoom and Carta Indicator -->
              <div
                class="px-4 py-2 border-b border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs flex items-center justify-between text-xs shrink-0"
              >
                <div
                  class="flex items-center gap-2 text-slate-700 dark:text-slate-300"
                >
                  <span class="material-symbols-outlined text-sm text-primary"
                    >description</span
                  >
                  <span class="font-bold">Formato Carta Estándar</span>
                  <span class="text-[10px] text-slate-500"
                    >(215.9 × 279.4 mm)</span
                  >
                </div>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="zoom = Math.max(0.5, zoom - 0.1)"
                    class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center font-bold cursor-pointer"
                    title="Reducir zoom"
                  >
                    -
                  </button>
                  <span class="text-[11px] font-semibold w-12 text-center"
                    >{{ Math.round(zoom * 100) }}%</span
                  >
                  <button
                    type="button"
                    @click="zoom = Math.min(1.2, zoom + 0.1)"
                    class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center font-bold cursor-pointer"
                    title="Aumentar zoom"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    @click="zoom = 0.75"
                    class="px-2 py-1 rounded-lg text-[10px] bg-slate-100 dark:bg-slate-800 font-bold cursor-pointer"
                    title="Restablecer zoom"
                  >
                    75%
                  </button>
                </div>
              </div>

              <!-- Scrollable Document Area -->
              <div
                class="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center"
              >
                <div
                  :style="{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.15s ease-out',
                  }"
                  class="shadow-2xl rounded-sm"
                >
                  <!-- Print Reference Container for html2pdf.js -->
                  <div ref="cvPrintRef">
                    <component
                      :is="activeTemplateComponent"
                      :cv="editableCv"
                      :options="options"
                      :primary-color="selectedColorTheme.primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import type { CandidateProfile } from "~/types/candidate";
import type { CvData, CvOptions, CvColorTheme, CvTemplateId } from "~/types/cv";
import { useCvGenerator, CV_COLOR_THEMES } from "~/composables/useCvGenerator";
import { useAppFeedback } from "~/composables/useAppFeedback";
import { calculateCvAtsScore } from "~/utils/cvStarterPacks";
import TemplateMinimalTech from "./templates/TemplateMinimalTech.vue";
import TemplateExecutive from "./templates/TemplateExecutive.vue";
import TemplateCreative from "./templates/TemplateCreative.vue";
import TemplateHarvardClassic from "./templates/TemplateHarvardClassic.vue";
import TemplateCompactOnePage from "./templates/TemplateCompactOnePage.vue";
import TemplateModernSplit from "./templates/TemplateModernSplit.vue";
import TemplateStandard from "./templates/TemplateStandard.vue";

const props = defineProps<{
  modelValue: boolean;
  profile: CandidateProfile;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "cv-updated", url: string): void;
}>();

const {
  isGenerating,
  isSavingToProfile,
  normalizeProfileToCvData,
  downloadPdf,
  uploadCvToProfile,
} = useCvGenerator();

const { showSuccess, showInfo, showError } = useAppFeedback();
const { data: session } = useAuth();
const config = useRuntimeConfig();

const cvPrintRef = ref<HTMLElement | null>(null);
const zoom = ref(0.75);
const activeMobileTab = ref<"editor" | "preview">("editor");
const activeTab = ref<"template" | "content" | "settings">("template");

const TEMPLATE_OPTIONS: Array<{
  id: CvTemplateId;
  name: string;
  desc: string;
  icon: string;
}> = [
  {
    id: "minimal-tech",
    name: "Minimal Tech",
    desc: "Sidebar oscuro con habilidades técnicas y timeline de proyectos.",
    icon: "code",
  },
  {
    id: "executive",
    name: "Ejecutivo",
    desc: "Diseño sobrio y formal para puestos de liderazgo y gestión.",
    icon: "corporate_fare",
  },
  {
    id: "creative",
    name: "Creativo",
    desc: "Encabezado moderno con degradado y badges dinámicos.",
    icon: "palette",
  },
  {
    id: "harvard-classic",
    name: "Harvard Clásico",
    desc: "Tipografía serif tradicional, 100% optimizado para ATS.",
    icon: "school",
  },
  {
    id: "compact-ats",
    name: "Compacto ATS",
    desc: "Alta densidad para sintetizar todo en una sola hoja Carta.",
    icon: "density_medium",
  },
  {
    id: "modern-split",
    name: "Moderno Dividido",
    desc: "Distribución en 2 columnas equilibradas con cards suaves.",
    icon: "splitscreen",
  },
];

const FONT_SIZES = [
  { id: "sm" as const, label: "Compacto" },
  { id: "base" as const, label: "Estándar" },
  { id: "lg" as const, label: "Amplio" },
];

const selectedColorTheme = ref<CvColorTheme>(CV_COLOR_THEMES[0]);

const options = reactive<CvOptions>({
  templateId: "minimal-tech",
  colorTheme: "indigo-jobnet",
  anonymousMode: false,
  showPhoto: true,
  showBio: true,
  showPhone: true,
  showEmail: true,
  showLocation: true,
  showLinks: true,
  showSkills: true,
  showLanguages: true,
  showEducation: true,
  showExperience: true,
  fontSize: "base",
});

const activeTemplateComponent = computed(() => {
  switch (options.templateId) {
    case "minimal-tech":
      return TemplateMinimalTech;
    case "executive":
      return TemplateExecutive;
    case "creative":
      return TemplateCreative;
    case "harvard-classic":
      return TemplateHarvardClassic;
    case "compact-ats":
      return TemplateCompactOnePage;
    case "modern-split":
      return TemplateModernSplit;
    case "standard":
      return TemplateStandard;
    default:
      return TemplateMinimalTech;
  }
});

const selectColorTheme = (theme: CvColorTheme) => {
  options.colorTheme = theme.id;
  selectedColorTheme.value = theme;
};

// Initial data builder
const getInitialNormalizedData = (): CvData => {
  return normalizeProfileToCvData(
    props.profile,
    {
      name: session.value?.user?.name || undefined,
      email: session.value?.user?.email || undefined,
      id: session.value?.user?.id || props.profile?.id || undefined,
    },
    {
      anonymousMode: options.anonymousMode,
      anonymousId: props.profile?.id || session.value?.user?.id || undefined,
    },
  );
};

const editableCv = ref<CvData>(getInitialNormalizedData());
const newSkillInput = ref("");
const newLanguageInput = ref("");

// Re-sync on modal open
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      editableCv.value = getInitialNormalizedData();
    }
  },
);

// Anonymous Mode toggle handler
const savedPreferences = ref({
  showPhoto: true,
  showPhone: true,
  showEmail: true,
  showLinks: true,
});

watch(
  () => options.anonymousMode,
  (isAnon) => {
    const fresh = getInitialNormalizedData();
    if (isAnon) {
      savedPreferences.value = {
        showPhoto: options.showPhoto,
        showPhone: options.showPhone,
        showEmail: options.showEmail,
        showLinks: options.showLinks,
      };
      options.showPhoto = false;
      options.showPhone = false;
      options.showEmail = false;
      options.showLinks = false;
      editableCv.value.name = fresh.name;
      editableCv.value.email = "";
      editableCv.value.phone = "";
      editableCv.value.photoUrl = "";
      editableCv.value.links = [];
    } else {
      options.showPhoto = savedPreferences.value.showPhoto;
      options.showPhone = savedPreferences.value.showPhone;
      options.showEmail = savedPreferences.value.showEmail;
      options.showLinks = savedPreferences.value.showLinks;
      editableCv.value.name = fresh.name;
      editableCv.value.email = fresh.email;
      editableCv.value.phone = fresh.phone;
      editableCv.value.photoUrl = fresh.photoUrl;
      editableCv.value.links = fresh.links;
    }
  },
);

// Live ATS Score
const atsEvaluation = computed(() => {
  return calculateCvAtsScore(editableCv.value, {
    anonymousMode: options.anonymousMode,
  });
});

const wordCount = (text?: string): number => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

// Handlers for dynamic editing
const quickVerbs = computed(() => {
  return [
    "Lideré",
    "Coordiné",
    "Diseñé",
    "Desarrollé",
    "Optimicé",
    "Implementé",
    "Gestioné",
    "Automatice",
  ];
});

const insertActionVerb = (verb: string) => {
  if (editableCv.value.experience.length > 0) {
    const target = editableCv.value.experience[0];
    target.descripcion = target.descripcion
      ? `${target.descripcion}\n• ${verb} `
      : `• ${verb} `;
    showInfo(
      "Verbo Añadido",
      `Se insertó "${verb}" en tu experiencia principal.`,
    );
  } else {
    handleAddExperience();
    editableCv.value.experience[0].descripcion = `• ${verb} `;
  }
};

const handleAddSkill = (skill: string) => {
  const clean = skill.trim();
  if (!clean) return;
  if (
    !editableCv.value.skills.some(
      (s) => s.toLowerCase() === clean.toLowerCase(),
    )
  ) {
    editableCv.value.skills.push(clean);
  }
  newSkillInput.value = "";
};

const handleAddLanguage = (lang: string) => {
  const clean = lang.trim();
  if (!clean) return;
  if (!editableCv.value.languages) {
    editableCv.value.languages = [];
  }
  if (
    !editableCv.value.languages.some(
      (l) => l.toLowerCase() === clean.toLowerCase(),
    )
  ) {
    editableCv.value.languages.push(clean);
  }
  newLanguageInput.value = "";
};

const handleAddExperience = () => {
  editableCv.value.experience.push({
    puesto: "Nuevo Cargo / Puesto",
    empresa: "Empresa / Organización",
    periodo: "Año Inicio - Presente",
    descripcion: "• Responsabilidades principales y metas cumplidas.",
  });
};

const handleAddEducation = () => {
  editableCv.value.education.push({
    titulo: "Licenciatura / Ingeniería / Especialidad",
    institucion: "Institución Educativa / Universidad",
    periodo: "Año Inicio - Año Fin",
    descripcion: "",
  });
};

const handleResetToOriginal = () => {
  editableCv.value = getInitialNormalizedData();
  showInfo(
    "Datos Restablecidos",
    "Se recuperaron los datos originales de tu perfil de JobNet.",
  );
};

const closeModal = () => {
  emit("update:modelValue", false);
};

// Download PDF in client
const handleDownload = async () => {
  if (!cvPrintRef.value) return;
  try {
    await downloadPdf(
      cvPrintRef.value,
      editableCv.value.name,
      options.anonymousMode,
    );
  } catch (err: any) {
    showError(
      "Error al Descargar",
      err?.message || "Ocurrió un error al generar el PDF.",
    );
  }
};

// Save to Profile (PDF + Full Profile Sync including experience and education!)
const handleSaveToProfile = async () => {
  if (!cvPrintRef.value) return;
  try {
    const userId = session.value?.user?.id || props.profile?.id || "user";
    const result = await uploadCvToProfile(
      cvPrintRef.value,
      userId,
      editableCv.value.name,
      options.anonymousMode,
    );

    if (result.success && result.url) {
      // Sincronizar todos los campos editados al perfil en DynamoDB
      try {
        const idToken = (session.value as any)?.idToken;
        await $fetch(`${config.public.apiUrl}/profile/${userId}`, {
          method: "POST",
          headers: {
            "x-user-id": userId,
            "x-user-role": "CANDIDATO",
            ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
          },
          body: {
            tituloProfesional: editableCv.value.title,
            titularProfesional: editableCv.value.title,
            titular: editableCv.value.title,
            biografia: editableCv.value.bio,
            habilidades: editableCv.value.skills,
            idiomas: editableCv.value.languages,
            experiencia: editableCv.value.experience,
            educacion: editableCv.value.education,
            curriculumVitae: result.url,
            cvUrl: result.url,
            cvName: `CV_${editableCv.value.name.replace(/\s+/g, "_")}.pdf`,
          },
        });
      } catch (e) {
        console.warn("Could not sync profile fields to DynamoDB:", e);
      }

      emit("cv-updated", result.url);
      closeModal();
      showSuccess(
        "¡Perfil y CV Guardados!",
        "Tu nuevo currículum se generó y tus datos se sincronizaron con éxito en tu perfil.",
        4000,
      );
    } else {
      showError(
        "Error al Guardar CV",
        result.error || "No se pudo subir el archivo PDF a tu perfil.",
      );
    }
  } catch (err: any) {
    showError(
      "Error al Guardar CV",
      err?.message || "Ocurrió un error inesperado al procesar el CV.",
    );
  }
};
</script>
