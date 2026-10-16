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
        class="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm select-none"
        @keydown.esc="closeModal"
        tabindex="-1"
      >
        <!-- Modal Card Container -->
        <div
          class="bg-surface border border-outline-variant/60 rounded-2xl w-full max-w-7xl h-[94vh] max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          @click.stop
        >
          <!-- Modal Header (Fixed) -->
          <div
            class="px-5 sm:px-6 py-3.5 border-b border-outline-variant/40 flex items-center justify-between bg-surface-container-low shrink-0"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0"
              >
                <span class="material-symbols-outlined text-2xl"
                  >picture_as_pdf</span
                >
              </div>
              <div>
                <h2
                  class="text-sm sm:text-base font-bold text-on-background flex items-center gap-2"
                >
                  Creador de CV Profesional
                  <span
                    class="px-2 py-0.5 text-[10px] font-extrabold bg-primary/15 text-primary rounded-full uppercase tracking-wider hidden sm:inline-block"
                  >
                    Tamaño Carta (8.5" × 11")
                  </span>
                </h2>
                <p class="text-xs text-on-surface-variant line-clamp-1">
                  Personaliza tu plantilla, autocompleta secciones vacías y
                  exporta un CV de alto impacto.
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="closeModal"
              class="p-2 rounded-xl text-on-surface-variant hover:text-on-background hover:bg-surface-container transition-colors cursor-pointer"
              title="Cerrar modal"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <!-- Mobile Tab Switcher (Visible on small screens) -->
          <div
            class="lg:hidden flex border-b border-outline-variant/40 bg-surface-container-low shrink-0 px-4 pt-2 gap-2"
          >
            <button
              type="button"
              @click="activeMobileTab = 'controls'"
              class="flex-1 pb-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              :class="
                activeMobileTab === 'controls'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant'
              "
            >
              <span class="material-symbols-outlined text-base">tune</span>
              Personalizar
            </button>
            <button
              type="button"
              @click="activeMobileTab = 'preview'"
              class="flex-1 pb-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              :class="
                activeMobileTab === 'preview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant'
              "
            >
              <span class="material-symbols-outlined text-base"
                >visibility</span
              >
              Vista Previa (Carta)
            </button>
          </div>

          <!-- Modal Body (Two-pane layout with independent scrolling) -->
          <div class="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
            <!-- Controls Panel (Left - Scrollable) -->
            <div
              class="w-full lg:w-[410px] xl:w-[450px] p-5 border-b lg:border-b-0 lg:border-r border-outline-variant/40 overflow-y-auto overscroll-contain space-y-6 shrink-0 bg-surface h-full"
              :class="{ 'hidden lg:block': activeMobileTab !== 'controls' }"
            >
              <!-- Sub-Tabs Navigation for Panel -->
              <div
                class="flex border-b border-outline-variant/60 -mx-5 -mt-5 mb-5 px-5 pt-3 bg-surface-container-low/70 gap-1 overflow-x-auto shrink-0"
              >
                <button
                  v-for="tab in BUILDER_TABS"
                  :key="tab.id"
                  type="button"
                  @click="activeBuilderTab = tab.id"
                  :class="[
                    activeBuilderTab === tab.id
                      ? 'border-primary text-primary font-bold bg-surface'
                      : 'border-transparent text-on-surface-variant hover:text-on-background',
                  ]"
                  class="pb-2.5 px-3 text-xs border-b-2 rounded-t-lg flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span class="material-symbols-outlined text-base">{{
                    tab.icon
                  }}</span>
                  <span>{{ tab.label }}</span>
                </button>
              </div>

              <!-- ======================================================== -->
              <!-- TAB 1: DISEÑO Y SECCIONES                                 -->
              <!-- ======================================================== -->
              <div v-show="activeBuilderTab === 'design'" class="space-y-6">
                <!-- 0. Modo Anónimo Switch Card (RF-123) -->
                <div
                  class="p-3.5 rounded-xl border transition-all duration-200"
                  :class="
                    options.anonymousMode
                      ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/20'
                      : 'bg-surface-container-low border-outline-variant/40'
                  "
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div
                        class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                        :class="
                          options.anonymousMode
                            ? 'bg-primary text-white'
                            : 'bg-surface-container text-on-surface-variant'
                        "
                      >
                        <span class="material-symbols-outlined text-lg">
                          {{
                            options.anonymousMode
                              ? "visibility_off"
                              : "visibility"
                          }}
                        </span>
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <span class="text-xs font-bold text-on-background"
                            >Modo Anónimo</span
                          >
                          <span
                            v-if="options.anonymousMode"
                            class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-primary/20 text-primary"
                          >
                            RF-123 Activo
                          </span>
                        </div>
                        <p class="text-[11px] text-on-surface-variant truncate">
                          Postulaciones imparciales sin sesgos
                        </p>
                      </div>
                    </div>
                    <label
                      class="relative inline-flex items-center cursor-pointer shrink-0"
                      title="Alternar Modo Anónimo"
                    >
                      <input
                        type="checkbox"
                        v-model="options.anonymousMode"
                        class="sr-only peer"
                      />
                      <div
                        class="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"
                      ></div>
                    </label>
                  </div>

                  <!-- Info note when active -->
                  <div
                    v-if="options.anonymousMode"
                    class="mt-2.5 pt-2.5 border-t border-primary/20 text-[10px] text-on-surface-variant flex items-start gap-1.5 animate-in fade-in duration-200"
                  >
                    <span
                      class="material-symbols-outlined text-sm shrink-0 text-primary"
                      >info</span
                    >
                    <span class="leading-tight">
                      Foto de perfil, nombre real, teléfono, email y enlaces
                      externos quedan enmascarados bajo un ID alfanumérico único.
                    </span>
                  </div>
                </div>

                <!-- 1. Templates Selection -->
                <div class="space-y-2.5">
                  <label
                    class="text-xs font-bold uppercase tracking-wider text-on-surface-variant block"
                  >
                    1. Plantilla (6 Estilos Estándar Carta)
                  </label>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      v-for="tmpl in TEMPLATE_OPTIONS"
                      :key="tmpl.id"
                      type="button"
                      @click="options.templateId = tmpl.id"
                      class="p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer"
                      :class="
                        options.templateId === tmpl.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                          : 'border-outline-variant/60 hover:border-outline hover:bg-surface-container-low'
                      "
                    >
                      <div class="flex items-center justify-between">
                        <span
                          class="material-symbols-outlined text-lg"
                          :class="
                            options.templateId === tmpl.id
                              ? 'text-primary'
                              : 'text-on-surface-variant'
                          "
                        >
                          {{ tmpl.icon }}
                        </span>
                        <span
                          v-if="options.templateId === tmpl.id"
                          class="material-symbols-outlined text-primary text-base"
                          >check_circle</span
                        >
                      </div>
                      <div>
                        <span
                          class="font-bold text-xs text-on-background block"
                          >{{ tmpl.name }}</span
                        >
                        <span
                          class="text-[10px] text-on-surface-variant line-clamp-2 leading-tight mt-0.5"
                        >
                          {{ tmpl.desc }}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- 2. Color Palettes Selection (6 Curated Palettes) -->
                <div class="space-y-2.5">
                  <label
                    class="text-xs font-bold uppercase tracking-wider text-on-surface-variant block"
                  >
                    2. Paleta Cromática
                  </label>
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      v-for="theme in CV_COLOR_THEMES"
                      :key="theme.id"
                      type="button"
                      @click="selectColorTheme(theme)"
                      class="p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer"
                      :class="
                        options.colorTheme === theme.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-outline-variant/60 hover:bg-surface-container-low'
                      "
                    >
                      <span
                        class="w-5 h-5 rounded-full shrink-0 shadow-xs border border-black/10 flex items-center justify-center text-white"
                        :style="{ backgroundColor: theme.primary }"
                      >
                        <span
                          v-if="options.colorTheme === theme.id"
                          class="material-symbols-outlined text-[10px]"
                          >check</span
                        >
                      </span>
                      <span
                        class="text-[11px] font-semibold text-on-background truncate"
                        >{{ theme.name }}</span
                      >
                    </button>
                  </div>
                </div>

                <!-- 3. Section Visibility Panel -->
                <div class="space-y-2.5">
                  <div class="flex items-center justify-between">
                    <label
                      class="text-xs font-bold uppercase tracking-wider text-on-surface-variant block"
                    >
                      3. Secciones Visibles
                    </label>
                    <button
                      type="button"
                      @click="toggleAllSections"
                      class="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                    >
                      {{ allSectionsActive ? "Desactivar Todo" : "Activar Todo" }}
                    </button>
                  </div>

                  <div
                    class="p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl space-y-2.5 text-xs"
                  >
                    <!-- Personal Details -->
                    <label
                      class="flex items-center justify-between cursor-pointer"
                      :class="{
                        'opacity-50 cursor-not-allowed': options.anonymousMode,
                      }"
                    >
                      <span class="text-on-background font-medium flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm">badge</span>
                        Foto de Perfil
                      </span>
                      <input
                        v-model="options.showPhoto"
                        :disabled="options.anonymousMode"
                        type="checkbox"
                        class="accent-primary rounded w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                      />
                    </label>

                    <label class="flex items-center justify-between cursor-pointer">
                      <span class="text-on-background font-medium flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm">subject</span>
                        Biografía / Resumen
                      </span>
                      <input
                        v-model="options.showBio"
                        type="checkbox"
                        class="accent-primary rounded w-4 h-4 cursor-pointer"
                      />
                    </label>

                    <!-- Contact details grouping -->
                    <div class="pt-1 border-t border-outline-variant/40">
                      <label
                        class="flex items-center justify-between cursor-pointer"
                        :class="{
                          'opacity-50 cursor-not-allowed': options.anonymousMode,
                        }"
                      >
                        <span class="text-on-background font-medium flex items-center gap-1.5">
                          <span class="material-symbols-outlined text-sm">call</span>
                          Información de Contacto
                        </span>
                        <input
                          v-model="contactToggle"
                          :disabled="options.anonymousMode"
                          type="checkbox"
                          class="accent-primary rounded w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                        />
                      </label>
                      <div
                        v-if="contactToggle && !options.anonymousMode"
                        class="pl-4 pt-1.5 space-y-1.5 border-l-2 border-primary/20 ml-1.5 mt-1"
                      >
                        <label class="flex items-center justify-between cursor-pointer">
                          <span class="text-on-surface-variant text-[11px]">Teléfono</span>
                          <input
                            v-model="options.showPhone"
                            type="checkbox"
                            class="accent-primary rounded w-3.5 h-3.5 cursor-pointer"
                          />
                        </label>
                        <label class="flex items-center justify-between cursor-pointer">
                          <span class="text-on-surface-variant text-[11px]">Correo Electrónico</span>
                          <input
                            v-model="options.showEmail"
                            type="checkbox"
                            class="accent-primary rounded w-3.5 h-3.5 cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>

                    <label class="flex items-center justify-between cursor-pointer">
                      <span class="text-on-background font-medium flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm">pin_drop</span>
                        Ubicación
                      </span>
                      <input
                        v-model="options.showLocation"
                        type="checkbox"
                        class="accent-primary rounded w-4 h-4 cursor-pointer"
                      />
                    </label>

                    <label
                      class="flex items-center justify-between cursor-pointer"
                      :class="{
                        'opacity-50 cursor-not-allowed': options.anonymousMode,
                      }"
                    >
                      <span class="text-on-background font-medium flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm">link</span>
                        Enlaces y Portafolio
                      </span>
                      <input
                        v-model="options.showLinks"
                        :disabled="options.anonymousMode"
                        type="checkbox"
                        class="accent-primary rounded w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                      />
                    </label>

                    <label class="flex items-center justify-between cursor-pointer">
                      <span class="text-on-background font-medium flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm">psychology</span>
                        Habilidades y Aptitudes
                      </span>
                      <input
                        v-model="options.showSkills"
                        type="checkbox"
                        class="accent-primary rounded w-4 h-4 cursor-pointer"
                      />
                    </label>

                    <label class="flex items-center justify-between cursor-pointer">
                      <span class="text-on-background font-medium flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm">translate</span>
                        Idiomas
                      </span>
                      <input
                        v-model="options.showLanguages"
                        type="checkbox"
                        class="accent-primary rounded w-4 h-4 cursor-pointer"
                      />
                    </label>

                    <label class="flex items-center justify-between cursor-pointer">
                      <span class="text-on-background font-medium flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm">work</span>
                        Experiencia Laboral
                      </span>
                      <input
                        v-model="options.showExperience"
                        type="checkbox"
                        class="accent-primary rounded w-4 h-4 cursor-pointer"
                      />
                    </label>

                    <label class="flex items-center justify-between cursor-pointer">
                      <span class="text-on-background font-medium flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm">school</span>
                        Educación y Formación
                      </span>
                      <input
                        v-model="options.showEducation"
                        type="checkbox"
                        class="accent-primary rounded w-4 h-4 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                <!-- 4. Typography Scale -->
                <div class="space-y-2">
                  <label
                    class="text-xs font-bold uppercase tracking-wider text-on-surface-variant block"
                  >
                    4. Densidad de Texto
                  </label>
                  <div class="grid grid-cols-3 gap-2">
                    <button
                      v-for="size in FONT_SIZES"
                      :key="size.id"
                      type="button"
                      @click="options.fontSize = size.id"
                      class="py-1.5 px-3 rounded-lg border text-xs font-bold text-center transition cursor-pointer"
                      :class="
                        options.fontSize === size.id
                          ? 'border-primary bg-primary text-white'
                          : 'border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-low'
                      "
                    >
                      {{ size.label }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- ======================================================== -->
              <!-- TAB 2: RELLENAR Y EDITAR CONTENIDO                       -->
              <!-- ======================================================== -->
              <div v-show="activeBuilderTab === 'content'" class="space-y-5">
                <!-- Smart Auto-Fill Card (Rellenador para CVs Vacíos) -->
                <div
                  class="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/25 space-y-3"
                >
                  <div class="flex items-start gap-2.5">
                    <span
                      class="material-symbols-outlined text-primary text-xl mt-0.5"
                      >auto_awesome</span
                    >
                    <div>
                      <h3 class="text-xs font-bold text-on-background">
                        Rellenador Inteligente de CV
                      </h3>
                      <p class="text-[11px] text-on-surface-variant leading-relaxed">
                        ¿Poco contenido o CV vacío? Rellena las secciones que te
                        hagan falta con textos profesionales sugeridos sin perder
                        tus datos actuales.
                      </p>
                    </div>
                  </div>

                  <div class="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      type="button"
                      @click="handleAutoFillMissing"
                      class="flex-1 py-2 px-3 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95"
                    >
                      <span class="material-symbols-outlined text-sm">bolt</span>
                      <span>Rellenar Secciones Vacías</span>
                    </button>

                    <button
                      type="button"
                      @click="handleResetToOriginal"
                      class="py-2 px-3 bg-surface border border-outline-variant hover:bg-surface-container text-on-surface-variant text-xs font-medium rounded-lg transition cursor-pointer"
                      title="Restablecer a los datos originales de mi perfil"
                    >
                      <span>Restablecer</span>
                    </button>
                  </div>
                </div>

                <!-- Starter Kits por Carrera / Rol -->
                <div class="space-y-2">
                  <label
                    class="text-xs font-bold uppercase tracking-wider text-on-surface-variant block"
                  >
                    Cargar Plantilla de Inicio por Especialidad
                  </label>
                  <p class="text-[11px] text-on-surface-variant">
                    Selecciona una carrera o perfil para rellenar tu CV con una
                    estructura modelo completa de la industria:
                  </p>

                  <div class="grid grid-cols-1 gap-2">
                    <button
                      v-for="pack in CV_STARTER_PACKS"
                      :key="pack.id"
                      type="button"
                      @click="handleApplyStarterPack(pack.id)"
                      class="p-2.5 rounded-xl border border-outline-variant/60 hover:border-primary/60 hover:bg-primary/5 text-left transition flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div class="flex items-center gap-2.5 min-w-0">
                        <span
                          class="material-symbols-outlined text-lg text-primary group-hover:scale-110 transition-transform shrink-0"
                        >
                          {{ pack.icon }}
                        </span>
                        <div class="min-w-0">
                          <div class="flex items-center gap-1.5">
                            <span class="text-xs font-bold text-on-background truncate">{{
                              pack.name
                            }}</span>
                            <span
                              class="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-surface-container text-primary border border-primary/20"
                            >
                              {{ pack.badge }}
                            </span>
                          </div>
                          <p class="text-[10px] text-on-surface-variant truncate">
                            {{ pack.roleTitle }}
                          </p>
                        </div>
                      </div>
                      <span
                        class="material-symbols-outlined text-base text-on-surface-variant group-hover:text-primary transition"
                        >add_circle</span
                      >
                    </button>
                  </div>
                </div>

                <!-- Quick Inline Text Editors -->
                <div class="space-y-4 pt-2 border-t border-outline-variant/40">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Edición Rápida de Secciones
                  </h4>

                  <!-- Título Profesional -->
                  <div>
                    <label class="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Título Profesional / Titular
                    </label>
                    <input
                      v-model="editableCv.title"
                      type="text"
                      placeholder="Ej. Desarrollador Web / Asistente Ejecutivo"
                      class="w-full bg-surface-container-low border border-outline-variant/60 focus:border-primary rounded-lg px-3 py-1.5 text-xs text-on-background outline-none transition"
                    />
                  </div>

                  <!-- Resumen Profesional -->
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="text-[11px] font-semibold text-on-surface-variant">
                        Resumen Profesional / Biografía
                      </label>
                      <span class="text-[10px] text-on-surface-variant">
                        {{ wordCount(editableCv.bio) }} palabras
                      </span>
                    </div>
                    <textarea
                      v-model="editableCv.bio"
                      rows="4"
                      placeholder="Breve resumen de quién eres, tus fortalezas principales y tus logros destacados..."
                      class="w-full bg-surface-container-low border border-outline-variant/60 focus:border-primary rounded-lg p-2.5 text-xs text-on-background outline-none transition resize-y"
                    ></textarea>

                    <!-- Plantillas de biografía en 1 clic -->
                    <div class="flex flex-wrap gap-1 mt-1.5">
                      <span class="text-[10px] text-on-surface-variant self-center mr-1">Sugerir:</span>
                      <button
                        type="button"
                        @click="applyBioSnippet('junior')"
                        class="px-2 py-0.5 rounded bg-surface-container hover:bg-primary/10 text-[10px] font-medium text-on-surface-variant hover:text-primary transition cursor-pointer"
                      >
                        Principiante
                      </button>
                      <button
                        type="button"
                        @click="applyBioSnippet('results')"
                        class="px-2 py-0.5 rounded bg-surface-container hover:bg-primary/10 text-[10px] font-medium text-on-surface-variant hover:text-primary transition cursor-pointer"
                      >
                        Resultados
                      </button>
                      <button
                        type="button"
                        @click="applyBioSnippet('tech')"
                        class="px-2 py-0.5 rounded bg-surface-container hover:bg-primary/10 text-[10px] font-medium text-on-surface-variant hover:text-primary transition cursor-pointer"
                      >
                        Técnico
                      </button>
                    </div>
                  </div>

                  <!-- Habilidades con Chips interactivos -->
                  <div>
                    <label class="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Habilidades ({{ editableCv.skills.length }})
                    </label>

                    <div class="flex gap-1.5 mb-2">
                      <input
                        v-model="newSkillInput"
                        @keydown.enter.prevent="handleAddSkill(newSkillInput)"
                        type="text"
                        placeholder="Nueva habilidad (ej. Trabajo en Equipo)"
                        class="flex-1 bg-surface-container-low border border-outline-variant/60 focus:border-primary rounded-lg px-2.5 py-1.5 text-xs text-on-background outline-none"
                      />
                      <button
                        type="button"
                        @click="handleAddSkill(newSkillInput)"
                        class="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <!-- Selected skills chips -->
                    <div class="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 bg-surface-container-low/50 border border-outline-variant/40 rounded-lg">
                      <span
                        v-for="(skill, idx) in editableCv.skills"
                        :key="idx"
                        class="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/15 text-primary rounded-md text-[11px] font-medium"
                      >
                        {{ skill }}
                        <button
                          type="button"
                          @click="handleRemoveSkill(idx)"
                          class="hover:text-rose-500 font-bold ml-0.5 cursor-pointer"
                          title="Eliminar"
                        >
                          ×
                        </button>
                      </span>
                      <span v-if="editableCv.skills.length === 0" class="text-[11px] text-on-surface-variant/70 italic">
                        No hay habilidades agregadas. Agrega algunas abajo.
                      </span>
                    </div>

                    <!-- Suggested Popular Skills to Add with 1-click -->
                    <div class="mt-2">
                      <span class="text-[10px] text-on-surface-variant block mb-1">
                        Sugerencias populares (haz clic para agregar):
                      </span>
                      <div class="flex flex-wrap gap-1">
                        <button
                          v-for="sug in POPULAR_SKILL_SUGGESTIONS"
                          :key="sug"
                          type="button"
                          @click="handleAddSkill(sug)"
                          class="px-2 py-0.5 bg-surface-container-low hover:bg-primary/10 border border-outline-variant/40 text-[10px] text-on-surface-variant hover:text-primary rounded-full transition cursor-pointer flex items-center gap-0.5"
                        >
                          <span>+</span>
                          <span>{{ sug }}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Experiencias Resumen -->
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="text-[11px] font-semibold text-on-surface-variant">
                        Experiencias / Proyectos ({{ editableCv.experience.length }})
                      </label>
                      <button
                        type="button"
                        @click="handleAddSampleExperience"
                        class="text-[10px] text-primary hover:underline font-bold cursor-pointer"
                      >
                        + Agregar Ejemplo
                      </button>
                    </div>

                    <div class="space-y-2">
                      <div
                        v-for="(exp, expIdx) in editableCv.experience"
                        :key="expIdx"
                        class="p-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-low text-xs relative group"
                      >
                        <button
                          type="button"
                          @click="editableCv.experience.splice(expIdx, 1)"
                          class="absolute top-1.5 right-1.5 text-on-surface-variant hover:text-rose-500 p-0.5"
                          title="Eliminar experiencia"
                        >
                          <span class="material-symbols-outlined text-sm">delete</span>
                        </button>
                        <p class="font-bold text-on-background pr-5">
                          {{ exp.puesto || exp.role || "Puesto Profesional" }}
                        </p>
                        <p class="text-[11px] text-primary font-medium">
                          {{ exp.empresa || exp.company || "Empresa" }} ·
                          {{ exp.periodo || exp.period || "2023 - 2024" }}
                        </p>
                        <p class="text-[11px] text-on-surface-variant mt-1 line-clamp-2">
                          {{ exp.descripcion || "Responsabilidades y logros clave..." }}
                        </p>
                      </div>

                      <div
                        v-if="editableCv.experience.length === 0"
                        class="text-center py-3 border border-dashed border-outline-variant/60 rounded-lg text-[11px] text-on-surface-variant"
                      >
                        <span>Sin experiencias registradas.</span>
                        <button
                          type="button"
                          @click="handleAddSampleExperience"
                          class="text-primary font-bold ml-1 hover:underline cursor-pointer"
                        >
                          Agregar experiencia modelo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ======================================================== -->
              <!-- TAB 3: CALIDAD Y FUERZA ATS                              -->
              <!-- ======================================================== -->
              <div v-show="activeBuilderTab === 'ats'" class="space-y-5">
                <!-- Live Score Card -->
                <div class="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-xs font-bold text-on-background block">
                        Fuerza del CV (Filtros ATS)
                      </span>
                      <span class="text-[11px] text-on-surface-variant">
                        Optimización para sistemas de reclutamiento automático
                      </span>
                    </div>

                    <div
                      class="px-2.5 py-1 rounded-full border text-xs font-extrabold flex items-center gap-1"
                      :class="atsEvaluation.badgeColor"
                    >
                      <span class="material-symbols-outlined text-sm">verified</span>
                      <span>{{ atsEvaluation.score }}% · {{ atsEvaluation.status }}</span>
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      class="h-full transition-all duration-500 rounded-full"
                      :class="[
                        atsEvaluation.score >= 80
                          ? 'bg-emerald-500'
                          : atsEvaluation.score >= 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500',
                      ]"
                      :style="{ width: `${atsEvaluation.score}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Checklist de Calidad ATS -->
                <div class="space-y-2">
                  <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
                    Checklist de Verificación ATS
                  </label>
                  <div class="space-y-2">
                    <div
                      v-for="(item, idx) in atsEvaluation.checklist"
                      :key="idx"
                      class="p-2.5 rounded-xl border flex items-start gap-2.5 text-xs transition"
                      :class="
                        item.passed
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-on-background'
                          : 'bg-surface-container-low border-outline-variant/60 text-on-surface-variant'
                      "
                    >
                      <span
                        class="material-symbols-outlined text-base mt-0.5 shrink-0"
                        :class="item.passed ? 'text-emerald-500' : 'text-slate-400'"
                      >
                        {{ item.passed ? "check_circle" : "radio_button_unchecked" }}
                      </span>
                      <div class="min-w-0">
                        <p class="font-bold text-[11px]" :class="{ 'line-through text-on-surface-variant/60': false }">
                          {{ item.label }}
                        </p>
                        <p class="text-[10px] text-on-surface-variant mt-0.5 leading-tight">
                          {{ item.tip }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Banco de Verbos de Acción de Alto Impacto -->
                <div class="space-y-2.5 pt-2 border-t border-outline-variant/40">
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-primary text-base">format_quote</span>
                    <label class="text-xs font-bold uppercase tracking-wider text-on-surface-variant block">
                      Verbos de Acción para Viñetas (Método STAR)
                    </label>
                  </div>
                  <p class="text-[11px] text-on-surface-variant">
                    Comienza tus responsabilidades con verbos orientados a logros concretos:
                  </p>

                  <div class="space-y-2">
                    <div
                      v-for="(grp, gIdx) in ACTION_VERBS"
                      :key="gIdx"
                      class="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40"
                    >
                      <span class="text-[10px] font-bold text-primary uppercase tracking-wide block mb-1">
                        {{ grp.category }}
                      </span>
                      <div class="flex flex-wrap gap-1">
                        <span
                          v-for="v in grp.verbs"
                          :key="v"
                          class="px-1.5 py-0.5 bg-surface text-on-surface-variant text-[10px] rounded border border-outline-variant/40 font-medium"
                        >
                          {{ v }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Live Preview Canvas (Right - Scrollable in both X & Y) -->
            <div
              class="flex-1 bg-slate-200/80 dark:bg-slate-950/80 p-4 sm:p-6 overflow-y-auto overflow-x-auto overscroll-contain flex flex-col items-center justify-start min-h-0 h-full relative"
              :class="{ 'hidden lg:flex': activeMobileTab !== 'preview' }"
            >
              <!-- Zoom & Dimensions Control Bar -->
              <div
                class="mb-4 sticky top-0 z-20 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-xl border border-outline-variant/60 shadow-md flex items-center justify-between gap-4 text-xs shrink-0 max-w-md w-full"
              >
                <div
                  class="flex items-center gap-2 text-on-surface-variant font-medium"
                >
                  <span class="material-symbols-outlined text-base"
                    >aspect_ratio</span
                  >
                  <span class="hidden sm:inline"
                    >Carta: <strong>215.9 × 279.4 mm</strong></span
                  >
                  <span class="sm:hidden"><strong>Carta</strong></span>
                </div>

                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    @click="
                      zoom = Math.max(0.4, Number((zoom - 0.1).toFixed(2)))
                    "
                    class="p-1 rounded hover:bg-surface-container text-on-surface-variant cursor-pointer"
                    title="Alejar"
                  >
                    <span class="material-symbols-outlined text-sm"
                      >zoom_out</span
                    >
                  </button>
                  <span
                    class="font-bold text-on-background px-1 min-w-[3rem] text-center"
                  >
                    {{ Math.round(zoom * 100) }}%
                  </span>
                  <button
                    type="button"
                    @click="
                      zoom = Math.min(1.3, Number((zoom + 0.1).toFixed(2)))
                    "
                    class="p-1 rounded hover:bg-surface-container text-on-surface-variant cursor-pointer"
                    title="Acercar"
                  >
                    <span class="material-symbols-outlined text-sm"
                      >zoom_in</span
                    >
                  </button>
                  <button
                    type="button"
                    @click="zoom = 0.75"
                    class="ml-1 text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant hover:text-on-background cursor-pointer"
                  >
                    Ajustar
                  </button>
                </div>
              </div>

              <!-- Printable Container with dynamic Zoom -->
              <div
                class="transition-transform origin-top duration-150 pb-12"
                :style="{ transform: `scale(${zoom})` }"
              >
                <div
                  ref="cvPrintRef"
                  id="cv-printable-area"
                  class="rounded-xs shadow-2xl bg-white overflow-hidden text-slate-900"
                >
                  <!-- Dynamic Template Component bound to editableCv -->
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

          <!-- Modal Footer Action Buttons (Fixed) -->
          <div
            class="px-5 sm:px-6 py-3.5 border-t border-outline-variant/40 bg-surface-container-low flex flex-wrap items-center justify-between gap-3 shrink-0"
          >
            <div
              class="text-xs text-on-surface-variant flex items-center gap-2"
            >
              <span
                v-if="statusMessage"
                class="flex items-center gap-2 text-primary font-medium"
              >
                <span class="material-symbols-outlined animate-spin text-sm"
                  >progress_activity</span
                >
                {{ statusMessage }}
              </span>
              <span v-else class="hidden sm:inline">
                Documento en estándar Carta (8.5" × 11") listo para exportar a
                300 DPI.
              </span>
            </div>

            <div
              class="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end"
            >
              <button
                type="button"
                @click="closeModal"
                class="px-3.5 py-2 border border-outline-variant text-on-background font-bold text-xs rounded-xl hover:bg-surface-container transition cursor-pointer"
              >
                Cerrar
              </button>

              <!-- Download Button -->
              <button
                type="button"
                @click="handleDownload"
                :disabled="isGenerating || isSavingToProfile"
                class="px-3.5 py-2 bg-surface border border-primary/40 hover:bg-primary/5 text-primary font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <span class="material-symbols-outlined text-sm">download</span>
                <span>Descargar PDF</span>
              </button>

              <!-- Save to Profile Button -->
              <button
                type="button"
                @click="handleSaveToProfile"
                :disabled="isGenerating || isSavingToProfile"
                class="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <span class="material-symbols-outlined text-sm"
                  >cloud_upload</span
                >
                <span>Guardar en Perfil</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { CandidateProfile } from "~/types/candidate";
import type { CvData, CvOptions, CvTemplateId, CvColorTheme } from "~/types/cv";
import { useCvGenerator, CV_COLOR_THEMES } from "~/composables/useCvGenerator";
import { useAppFeedback } from "~/composables/useAppFeedback";
import {
  CV_STARTER_PACKS,
  smartAutoFillGaps,
  ACTION_VERBS,
  calculateCvAtsScore,
} from "~/utils/cvStarterPacks";

// Import 6 Letter templates
import TemplateMinimalTech from "./templates/TemplateMinimalTech.vue";
import TemplateExecutive from "./templates/TemplateExecutive.vue";
import TemplateCreative from "./templates/TemplateCreative.vue";
import TemplateHarvardClassic from "./templates/TemplateHarvardClassic.vue";
import TemplateCompactOnePage from "./templates/TemplateCompactOnePage.vue";
import TemplateModernSplit from "./templates/TemplateModernSplit.vue";

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
  statusMessage,
  normalizeProfileToCvData,
  downloadPdf,
  uploadCvToProfile,
} = useCvGenerator();

const { showSuccess, showInfo } = useAppFeedback();
const { data: session } = useAuth();
const cvPrintRef = ref<HTMLElement | null>(null);
const zoom = ref(0.75);
const activeMobileTab = ref<"controls" | "preview">("controls");
const activeBuilderTab = ref<"design" | "content" | "ats">("design");

const BUILDER_TABS = [
  { id: "design" as const, label: "Diseño & Secciones", icon: "palette" },
  { id: "content" as const, label: "Rellenar & Datos", icon: "auto_fix_high" },
  { id: "ats" as const, label: "Fuerza ATS", icon: "award_star" },
];

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

const POPULAR_SKILL_SUGGESTIONS = [
  "Trabajo en Equipo",
  "Comunicación Asertiva",
  "Resolución de Problemas",
  "JavaScript / TypeScript",
  "Microsoft Excel Avanzado",
  "Atención al Cliente",
  "Gestión de Proyectos",
  "Liderazgo",
  "Scrum / Ágil",
  "Inglés B2",
  "Facturación CFDI",
  "Ventas Consultivas",
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

const selectColorTheme = (theme: CvColorTheme) => {
  options.colorTheme = theme.id;
  selectedColorTheme.value = theme;
};

const contactToggle = computed({
  get: () => options.showPhone || options.showEmail,
  set: (val: boolean) => {
    options.showPhone = val;
    options.showEmail = val;
  },
});

const savedPreferences = ref({
  showPhoto: true,
  showPhone: true,
  showEmail: true,
  showLinks: true,
});

// Build initial normalized data
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

// Dynamic in-memory editable CV data for real-time live preview & enrichment
const editableCv = ref<CvData>(getInitialNormalizedData());
const newSkillInput = ref("");

// Re-initialize editableCv whenever modal opens
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      editableCv.value = getInitialNormalizedData();
    }
  },
);

// Manage anonymous mode toggling and preference preservation
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

// Toggle all sections helper
const allSectionsActive = computed(() => {
  return (
    options.showBio &&
    options.showLocation &&
    options.showSkills &&
    options.showLanguages &&
    options.showEducation &&
    options.showExperience
  );
});

const toggleAllSections = () => {
  const target = !allSectionsActive.value;
  options.showBio = target;
  options.showLocation = target;
  options.showSkills = target;
  options.showLanguages = target;
  options.showEducation = target;
  options.showExperience = target;
  if (!options.anonymousMode) {
    options.showPhoto = target;
    options.showPhone = target;
    options.showEmail = target;
    options.showLinks = target;
  }
};

// Live ATS Score Evaluation
const atsEvaluation = computed(() => {
  return calculateCvAtsScore(editableCv.value, {
    anonymousMode: options.anonymousMode,
  });
});

// Word count helper
const wordCount = (text?: string): number => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

// Handlers for Smart Auto-Fill & Starter Packs
const handleAutoFillMissing = () => {
  const result = smartAutoFillGaps(editableCv.value, "junior-starter");
  editableCv.value = result.enrichedData;
  showSuccess(
    "Secciones Rellenadas",
    result.filledFields.length > 0
      ? `Se autocompletaron: ${result.filledFields.join(", ")}.`
      : "Tu CV ya cuenta con todas las secciones completas.",
    3500,
  );
};

const handleApplyStarterPack = (packId: string) => {
  const pack = CV_STARTER_PACKS.find((p) => p.id === packId);
  if (!pack) return;

  editableCv.value.title = pack.data.title;
  editableCv.value.bio = pack.data.bio;
  editableCv.value.skills = [...pack.data.skills];
  editableCv.value.languages = [...pack.data.languages];
  editableCv.value.experience = [...pack.data.experience];
  editableCv.value.education = [...pack.data.education];

  showSuccess(
    "Plantilla de Inicio Aplicada",
    `Se cargó la plantilla para ${pack.name}. Puedes editar cualquier sección en vivo.`,
    3500,
  );
};

const handleResetToOriginal = () => {
  editableCv.value = getInitialNormalizedData();
  showInfo(
    "Datos Restablecidos",
    "Se han recuperado los datos originales de tu perfil de JobNet.",
  );
};

const applyBioSnippet = (type: "junior" | "results" | "tech") => {
  if (type === "junior") {
    editableCv.value.bio =
      "Profesional recién egresado con sólida formación académica y alta capacidad de aprendizaje. Busco una posición donde aplicar mis conocimientos, colaborar en equipo y aportar soluciones con entusiasmo y disciplina.";
  } else if (type === "results") {
    editableCv.value.bio =
      "Profesional orientado a resultados con historial de superación de objetivos operativos y comerciales. Especialista en optimización de tiempos, liderazgo colaborativo y satisfacción del cliente.";
  } else if (type === "tech") {
    editableCv.value.bio =
      "Desarrollador con experiencia en construcción de software escalable, integración de APIs y buenas prácticas ágiles. Comprometido con la calidad del código, rendimiento y entrega continua.";
  }
};

const handleAddSkill = (skill: string) => {
  const clean = skill.trim();
  if (!clean) return;
  if (!editableCv.value.skills.some((s) => s.toLowerCase() === clean.toLowerCase())) {
    editableCv.value.skills.push(clean);
  }
  newSkillInput.value = "";
};

const handleRemoveSkill = (index: number) => {
  editableCv.value.skills.splice(index, 1);
};

const handleAddSampleExperience = () => {
  editableCv.value.experience.push({
    puesto: "Colaborador(a) / Proyecto Especial",
    empresa: "Empresa / Organización Modelo",
    periodo: "2023 - 2024",
    descripcion:
      "Coordiné actividades clave del área cumpliendo objetivos mensuales y optimizando procesos internos mediante trabajo en equipo y comunicación efectiva.",
  });
};

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
    default:
      return TemplateMinimalTech;
  }
});

const closeModal = () => {
  emit("update:modelValue", false);
};

// Background Scroll Lock management
watch(
  () => props.modelValue,
  (isOpen) => {
    if (typeof window !== "undefined") {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (typeof window !== "undefined") {
    document.body.style.overflow = "";
  }
});

const handleDownload = async () => {
  if (!cvPrintRef.value) return;
  await downloadPdf(
    cvPrintRef.value,
    editableCv.value.name,
    options.anonymousMode,
  );
};

const handleSaveToProfile = async () => {
  if (!cvPrintRef.value) return;
  const userId = session.value?.user?.id || props.profile.id || "user";
  const result = await uploadCvToProfile(
    cvPrintRef.value,
    userId,
    editableCv.value.name,
    options.anonymousMode,
  );
  if (result.success && result.url) {
    // Sincronizar campos enriquecidos (título, biografía, habilidades) al perfil
    try {
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiUrl}/profile/${userId}`, {
        method: "POST",
        headers: {
          "x-user-id": userId,
          "x-user-role": "CANDIDATO",
        },
        body: {
          tituloProfesional: editableCv.value.title,
          biografia: editableCv.value.bio,
          habilidades: editableCv.value.skills,
          idiomas: editableCv.value.languages,
          curriculumVitae: result.url,
          cvUrl: result.url,
          cvName: `CV_${editableCv.value.name.replace(/\s+/g, "_")}.pdf`,
        },
      });
    } catch (e) {
      console.warn("Could not sync profile text fields:", e);
    }

    emit("cv-updated", result.url);
    closeModal();
  }
};
</script>
