<template>
  <div>
    <!-- Alert Messages -->
    <div
      v-if="state.successMessage"
      class="mb-4 bg-secondary/10 border border-secondary/20 text-secondary p-4 rounded-xl flex items-center gap-2 text-sm font-semibold"
    >
      <span class="material-symbols-outlined text-lg">check_circle</span>
      {{ state.successMessage }}
    </div>
    <div
      v-if="state.errorMessage"
      class="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 p-4 rounded-xl flex items-center gap-2 text-sm font-semibold"
    >
      <span class="material-symbols-outlined text-lg">error</span>
      {{ state.errorMessage }}
    </div>

    <!-- Draft Restore Notification Banner -->
    <div
      v-if="state.hasDraft"
      class="mb-4 bg-primary/10 border border-primary/20 text-on-surface text-xs p-3 rounded-xl flex items-center justify-between"
    >
      <span class="flex items-center gap-1.5 font-medium">
        <span class="material-symbols-outlined text-base text-primary"
          >info</span
        >
        Se ha restaurado un borrador con cambios sin guardar de esta vacante.
      </span>
      <button
        type="button"
        @click="state.discardDraft"
        class="text-rose-500 hover:text-rose-600 font-bold transition"
      >
        Descartar
      </button>
    </div>

    <!-- Segmented Navigation Tabs -->
    <div
      class="w-full border-b border-outline-variant/60 overflow-x-auto overflow-y-hidden touch-pan-x hide-scrollbar mb-6 bg-surface-container-lowest dark:bg-slate-900 rounded-t-2xl px-6 pt-4"
    >
      <nav class="flex flex-nowrap gap-4 w-max pb-1">
        <button
          v-for="tab in tabItems"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'text-primary border-b-2 border-primary font-bold'
              : 'text-on-surface-variant dark:text-slate-300 hover:text-primary',
          ]"
          class="pb-2.5 px-2 text-xs font-medium transition-colors flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap"
        >
          <span class="material-symbols-outlined text-base">{{
            tab.icon
          }}</span>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <form
      @submit.prevent="state.handleSubmit"
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-b-2xl p-6 flex flex-col gap-6 shadow-sm"
    >
      <!-- SECTION: Datos Generales -->
      <section v-show="activeTab === 'generales'" class="flex flex-col gap-6">
        <!-- Job Title -->
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            for="title"
            >Título del Puesto (Obligatorio)</label
          >
          <input
            v-model="state.form.title"
            id="title"
            type="text"
            required
            placeholder="Ej: Senior Frontend Engineer"
            class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
          />
        </div>

        <!-- Mode & Description -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <AppSelect
              v-model="state.form.modality"
              label="Modalidad de Trabajo (Obligatorio)"
              :options="[
                { value: 'Remoto', label: 'Remoto', icon: 'laptop' },
                {
                  value: 'Híbrido',
                  label: 'Híbrido',
                  icon: 'domain_verification',
                },
                {
                  value: 'Presencial',
                  label: 'Presencial',
                  icon: 'location_city',
                },
              ]"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label
              class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
              for="experience-years"
              >Experiencia Requerida (Opcional)</label
            >
            <input
              v-model.number="state.form.experienceYears"
              id="experience-years"
              type="number"
              min="0"
              placeholder="Años de experiencia (Ej: 3)"
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
            />
          </div>
        </div>

        <!-- Plazas Disponibles & Tope Máximo de Postulaciones (Opcional) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label
              class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
              for="vacantes-disponibles"
              >Plazas Disponibles a Contratar (Obligatorio)</label
            >
            <input
              v-model.number="state.form.vacantesDisponibles"
              id="vacantes-disponibles"
              type="number"
              min="1"
              required
              placeholder="Número de puestos (Ej: 1, 3, 5)"
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label
              class="text-xs font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1"
              for="max-postulantes"
            >
              Límite Máximo de Postulaciones
              <span class="text-[10px] text-outline font-normal"
                >(Opcional)</span
              >
            </label>
            <input
              v-model.number="state.form.maxPostulantes"
              id="max-postulantes"
              type="number"
              min="1"
              placeholder="Sin límite (o Ej: 50 postulantes)"
              class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
            />
          </div>
        </div>

        <!-- Fecha de Cierre o Vigencia -->
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center justify-between">
            <label
              class="text-xs font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1.5"
              for="fecha-cierre"
            >
              <span class="material-symbols-outlined text-sm text-primary">calendar_clock</span>
              Fecha de Cierre / Vigencia Estipulada
            </label>
            <span class="text-[10px] text-on-surface-variant dark:text-slate-400">
              Recordatorio automático 3 días antes de expirar
            </span>
          </div>
          <input
            v-model="state.form.fechaCierre"
            id="fecha-cierre"
            type="date"
            class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
          />
        </div>

        <!-- Description -->
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            for="description"
            >Descripción Detallada de Actividades (Obligatorio)</label
          >
          <textarea
            v-model="state.form.description"
            id="description"
            rows="4"
            required
            placeholder="Describe detalladamente las responsabilidades, tareas diarias y requisitos técnicos del puesto..."
            class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition resize-none"
          ></textarea>
        </div>

        <!-- Documento de Especificación (PDF) -->
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            >Descriptor de Puesto o Especificaciones (PDF - Opcional)</label
          >
          <div class="flex gap-2 items-center">
            <button
              type="button"
              @click="state.triggerVacancyFileSelect"
              class="flex items-center gap-2 px-4 py-2.5 bg-surface border border-outline-variant/60 hover:border-primary text-primary text-xs font-bold rounded-xl transition active:scale-[0.98]"
            >
              <span class="material-symbols-outlined text-sm">upload_file</span>
              Subir Documento PDF
            </button>
            <input
              type="file"
              accept=".pdf"
              :ref="(el) => (state.vacancyFileInput = el)"
              @change="state.handleVacancyFileSelect"
              class="hidden"
            />
            <AppFileAttachment
              v-if="state.selectedVacancyFile"
              :name="state.selectedVacancyFile.name"
              type="pdf"
              :show-preview="true"
              :show-remove="true"
              @preview="state.openVacancyPdfPreview"
              @remove="state.clearVacancyFile"
            />
          </div>
        </div>

        <!-- Rango Salarial & Configuración de Confidencialidad -->
        <div
          class="bg-surface-container-low/30 border border-outline-variant/60 rounded-xl p-4 flex flex-col gap-4"
        >
          <div class="flex items-center justify-between flex-wrap gap-2">
            <h3
              class="text-xs font-bold text-on-background uppercase tracking-wider"
            >
              Rango Salarial Mensual
            </h3>
            <span
              class="text-[10px] font-bold px-2 py-0.5 rounded-full"
              :class="
                state.form.salarioConfidencial
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
              "
            >
              {{
                state.form.salarioConfidencial
                  ? 'Salario Confidencial'
                  : 'Salario Visible'
              }}
            </span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label
                class="text-[10px] font-bold text-on-surface-variant dark:text-slate-300"
                for="salary-min"
                >Monto Mínimo (MXN)</label
              >
              <input
                v-model.number="state.form.salaryMin"
                id="salary-min"
                type="number"
                min="0"
                placeholder="Ej: 30000"
                class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2 text-xs text-on-background outline-none transition"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label
                class="text-[10px] font-bold text-on-surface-variant dark:text-slate-300"
                for="salary-max"
                >Monto Máximo (MXN)</label
              >
              <input
                v-model.number="state.form.salaryMax"
                id="salary-max"
                type="number"
                min="0"
                placeholder="Ej: 50000"
                class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2 text-xs text-on-background outline-none transition"
              />
            </div>
          </div>

          <!-- Configuración de Salario Visible o Confidencial -->
          <div
            class="pt-2 border-t border-outline-variant/30 flex items-start gap-3"
          >
            <input
              id="salary-confidential"
              v-model="state.form.salarioConfidencial"
              type="checkbox"
              class="w-4 h-4 text-primary bg-surface border-outline-variant/60 rounded focus:ring-primary mt-0.5 cursor-pointer"
            />
            <label
              for="salary-confidential"
              class="text-xs cursor-pointer select-none"
            >
              <span class="font-bold text-on-background block"
                >Configurar salario como confidencial</span
              >
              <span
                class="text-[11px] text-on-surface-variant dark:text-slate-400 leading-relaxed block mt-0.5"
              >
                Al activar esta casilla, los postulantes verán "Salario
                confidencial" en lugar de las cifras. Los montos se guardan para
                filtros internos y analítica.
              </span>
            </label>
          </div>
        </div>
      </section>

      <!-- SECTION: Requisitos & Catálogo -->
      <section v-show="activeTab === 'requisitos'" class="flex flex-col gap-6">
        <!-- Aptitudes y Habilidades Opcionales -->
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            for="aptitudes"
            >Aptitudes y Competencias Blandas (Opcional)</label
          >
          <input
            v-model="state.form.aptitudes"
            id="aptitudes"
            type="text"
            placeholder="Ej: Liderazgo, Comunicación asertiva, Trabajo en equipo"
            class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
          />
        </div>

        <!-- Habilidades Requeridas (Catálogo Maestro Dinámico) -->
        <div class="flex flex-col gap-2">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            >Selección de Habilidades Requeridas (Obligatorio)</label
          >

          <!-- Selected Skill Tags -->
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="skill in state.form.skills"
              :key="skill"
              class="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs flex items-center gap-1.5 font-bold"
            >
              {{ skill }}
              <button
                type="button"
                @click="state.removeSkill(skill)"
                class="hover:text-rose-600 transition flex items-center"
              >
                <span class="material-symbols-outlined text-xs">close</span>
              </button>
            </span>
            <span
              v-if="state.form.skills.length === 0"
              class="text-xs text-on-surface-variant dark:text-slate-300 italic"
            >
              Ninguna habilidad seleccionada aún. Selecciona del catálogo abajo.
            </span>
          </div>

          <!-- Catalog autocomplete and suggestion box -->
          <div
            class="space-y-3 bg-surface-container-low/40 p-4 border border-outline-variant/50 rounded-xl"
          >
            <div class="flex gap-2">
              <div class="relative flex-grow">
                <span
                  class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant dark:text-slate-300 text-sm"
                  >search</span
                >
                <input
                  v-model="state.skillSearchQuery"
                  type="text"
                  placeholder="Buscar habilidades en el catálogo..."
                  class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl pl-9 pr-4 py-2 text-xs text-on-background outline-none transition"
                />
              </div>

              <!-- Quick Add Option for non-existing skills -->
              <button
                type="button"
                @click="state.handleQuickAddSkill"
                :disabled="!state.skillSearchQuery.trim()"
                class="bg-surface border border-outline-variant hover:border-primary hover:bg-primary/5 text-primary text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50"
              >
                Sugerir y Agregar
              </button>
            </div>

            <div
              v-if="
                state.skillSearchQuery.trim() &&
                !state.filteredCatalogSkills.some(
                  (s) =>
                    s.name.toLowerCase() ===
                    state.skillSearchQuery.toLowerCase().trim(),
                )
              "
              class="text-[10px] text-amber-600 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg flex items-start gap-1.5 leading-relaxed"
            >
              <span class="material-symbols-outlined text-xs mt-0.5"
                >warning</span
              >
              <span>
                Esta habilidad no se encuentra en el catálogo y será enviada al
                equipo de moderación para su aprobación. Se asociará
                temporalmente a tu perfil; por favor, valida la ortografía antes
                de crearla.
              </span>
            </div>

            <!-- Suggested Master Catalog Skills -->
            <div class="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              <button
                v-for="masterSkill in state.filteredCatalogSkills"
                :key="masterSkill.id"
                type="button"
                @click="state.addSkill(masterSkill.name)"
                class="bg-surface hover:bg-surface-container-high border border-outline-variant/50 hover:border-primary text-on-surface hover:text-primary transition px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-[10px]">add</span>
                {{ masterSkill.name }}
              </button>
              <span
                v-if="state.filteredCatalogSkills.length === 0"
                class="text-[11px] text-on-surface-variant dark:text-slate-300 italic py-1"
              >
                No se encontraron habilidades adicionales. Escribe para crear
                una nueva.
              </span>
            </div>
          </div>
        </div>

        <!-- Sectores de la Vacante (Catálogo Maestro Dinámico) -->
        <div class="flex flex-col gap-2">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            >Sectores de la Industria (Obligatorio)</label
          >

          <!-- Selected Sector Tags -->
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="sector in state.form.sectors"
              :key="sector"
              class="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs flex items-center gap-1.5 font-bold"
            >
              {{ sector }}
              <button
                type="button"
                @click="state.removeSector(sector)"
                class="hover:text-rose-600 transition flex items-center"
              >
                <span class="material-symbols-outlined text-xs">close</span>
              </button>
            </span>
            <span
              v-if="state.form.sectors.length === 0"
              class="text-xs text-on-surface-variant dark:text-slate-300 italic"
            >
              Ningún sector seleccionado aún. Selecciona del catálogo abajo.
            </span>
          </div>

          <!-- Catalog autocomplete and suggestion box -->
          <div
            class="space-y-3 bg-surface-container-low/40 p-4 border border-outline-variant/50 rounded-xl"
          >
            <div class="flex gap-2">
              <div class="relative flex-grow">
                <span
                  class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant dark:text-slate-300 text-sm"
                  >search</span
                >
                <input
                  v-model="state.sectorSearchQuery"
                  type="text"
                  placeholder="Buscar sectores en el catálogo..."
                  class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl pl-9 pr-4 py-2 text-xs text-on-background outline-none transition"
                />
              </div>

              <!-- Quick Add Option for non-existing sectors -->
              <button
                type="button"
                @click="state.handleQuickAddSector"
                :disabled="!state.sectorSearchQuery.trim()"
                class="bg-surface border border-outline-variant hover:border-primary hover:bg-primary/5 text-primary text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50"
              >
                Sugerir y Agregar
              </button>
            </div>

            <div
              v-if="
                state.sectorSearchQuery.trim() &&
                !state.filteredCatalogSectors.some(
                  (s) =>
                    s.name.toLowerCase() ===
                    state.sectorSearchQuery.toLowerCase().trim(),
                )
              "
              class="text-[10px] text-amber-600 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg flex items-start gap-1.5 leading-relaxed"
            >
              <span class="material-symbols-outlined text-xs mt-0.5"
                >warning</span
              >
              <span>
                Este sector no se encuentra en el catálogo y será enviado al
                equipo de moderación para su aprobación. Se asociará
                temporalmente a tu perfil; por favor, valida la ortografía antes
                de crearlo.
              </span>
            </div>

            <!-- Suggested Master Catalog Sectors -->
            <div class="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              <button
                v-for="masterSector in state.filteredCatalogSectors"
                :key="masterSector.id"
                type="button"
                @click="state.addSector(masterSector.name)"
                class="bg-surface hover:bg-surface-container-high border border-outline-variant/50 hover:border-primary text-on-surface hover:text-primary transition px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-[10px]">add</span>
                {{ masterSector.name }}
              </button>
              <span
                v-if="state.filteredCatalogSectors.length === 0"
                class="text-[11px] text-on-surface-variant dark:text-slate-300 italic py-1"
              >
                No se encontraron sectores adicionales. Escribe para crear uno
                nuevo.
              </span>
            </div>
          </div>
        </div>

        <!-- Preguntas Filtro de Precalificación (Hasta 3 Preguntas Obligatorias) -->
        <div class="flex flex-col gap-3 pt-2 border-t border-outline-variant/30">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <label class="text-xs font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm text-primary">quiz</span>
                Preguntas Filtro de Precalificación
              </label>
              <p class="text-[11px] text-on-surface-variant dark:text-slate-400 mt-0.5">
                Configura hasta 3 preguntas de respuesta obligatoria que los candidatos responderán al postularse.
              </p>
            </div>
            <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {{ state.form.preguntasFiltro.length }} / 3 preguntas
            </span>
          </div>

          <!-- Question inputs list -->
          <div v-if="state.form.preguntasFiltro.length > 0" class="flex flex-col gap-3">
            <div
              v-for="(pregunta, index) in state.form.preguntasFiltro"
              :key="index"
              class="flex items-center gap-2 bg-surface-container-low/30 border border-outline-variant/60 rounded-xl p-3"
            >
              <span class="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                {{ index + 1 }}
              </span>
              <input
                v-model="state.form.preguntasFiltro[index]"
                type="text"
                maxlength="250"
                required
                :placeholder="
                  index === 0
                    ? 'Ej: ¿Cuántos años de experiencia comprobable tienes en la posición?'
                    : index === 1
                      ? 'Ej: ¿Cuentas con disponibilidad de horario y cambio de residencia?'
                      : 'Ej: ¿Manejas nivel de inglés conversacional avanzado B2/C1?'
                "
                class="flex-grow bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-lg px-3 py-2 text-xs text-on-background outline-none transition"
              />
              <button
                type="button"
                @click="state.removePreguntaFiltro(index)"
                title="Eliminar pregunta"
                class="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-500/10 rounded-lg transition flex items-center justify-center"
              >
                <span class="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          </div>

          <div
            v-else
            class="text-xs text-on-surface-variant dark:text-slate-400 italic bg-surface-container-low/20 border border-dashed border-outline-variant/60 rounded-xl p-4 text-center"
          >
            No has agregado preguntas filtro. Puedes agregar hasta 3 preguntas para precalificar a los candidatos.
          </div>

          <!-- Add question button -->
          <div v-if="state.form.preguntasFiltro.length < 3">
            <button
              type="button"
              @click="state.addPreguntaFiltro"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-surface border border-outline-variant hover:border-primary hover:bg-primary/5 text-primary text-xs font-bold rounded-xl transition"
            >
              <span class="material-symbols-outlined text-sm">add</span>
              Agregar Pregunta Filtro ({{ 3 - state.form.preguntasFiltro.length }} disponibles)
            </button>
          </div>
        </div>
      </section>

      <!-- SECTION: Ubicación -->
      <section v-show="activeTab === 'ubicacion'" class="flex flex-col gap-6">
        <!-- Municipio del Estado de México y Coordenadas -->
        <div class="bg-surface-container-low/30 border border-outline-variant/60 rounded-xl p-4 flex flex-col gap-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 class="text-xs font-bold text-on-background uppercase tracking-wider flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm text-primary">location_city</span>
                Municipio del Estado de México
              </h3>
              <p class="text-[11px] text-on-surface-variant dark:text-slate-400 mt-0.5">
                Selecciona el municipio correspondiente para centrar automáticamente las coordenadas geográficas.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Municipio Dropdown -->
            <div class="flex flex-col gap-1.5 sm:col-span-1">
              <label class="text-[10px] font-bold text-on-surface-variant dark:text-slate-300" for="municipio-select">
                Municipio (EdoMéx)
              </label>
              <select
                id="municipio-select"
                :value="state.form.municipio"
                @change="state.setMunicipio(($event.target as HTMLSelectElement).value)"
                class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
              >
                <option
                  v-for="muni in state.EDO_MEX_MUNICIPALITIES"
                  :key="muni"
                  :value="muni"
                >
                  {{ muni }}
                </option>
              </select>
            </div>

            <!-- Latitud -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-on-surface-variant dark:text-slate-300" for="lat-input">
                Latitud Geográfica
              </label>
              <input
                id="lat-input"
                v-model.number="state.form.lat"
                type="number"
                step="0.0001"
                class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
              />
            </div>

            <!-- Longitud -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-on-surface-variant dark:text-slate-300" for="lng-input">
                Longitud Geográfica
              </label>
              <input
                id="lng-input"
                v-model.number="state.form.lng"
                type="number"
                step="0.0001"
                class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
              />
            </div>
          </div>
        </div>

        <!-- Ubicación Geográfica (AppLocationMap Centrado) -->
        <ClientOnly>
          <AppLocationMap
            v-model:lat="state.form.lat"
            v-model:lng="state.form.lng"
            label="Ajuste Fino de Ubicación Geográfica en el Mapa"
            height="300px"
          />
          <template #fallback>
            <div class="h-[300px] w-full rounded-2xl bg-surface-container-low/40 dark:bg-slate-900/60 border border-outline-variant/40 animate-pulse flex items-center justify-center">
              <span class="text-xs text-on-surface-variant dark:text-slate-400">Cargando mapa de ubicación...</span>
            </div>
          </template>
        </ClientOnly>
      </section>

      <!-- Submit button -->
      <div class="flex gap-2 mt-2">
        <button
          type="button"
          @click="goToPreview"
          :disabled="!state.form.title.trim()"
          class="bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant font-bold text-sm h-12 px-6 rounded-xl transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="material-symbols-outlined text-lg">visibility</span>
          <span class="hidden sm:inline">Previsualizar</span>
        </button>

        <button
          type="submit"
          :disabled="
            state.submitting ||
            state.form.skills.length === 0 ||
            !state.form.title.trim()
          "
          class="flex-1 bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-semibold text-sm h-12 rounded-xl transition shadow-md shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 duration-100"
        >
          <span
            v-if="state.submitting"
            class="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin"
            aria-hidden="true"
          ></span>
          <span v-else class="material-symbols-outlined text-lg">{{
            isEdit ? "save" : "post_add"
          }}</span>
          <span>{{
            state.submitting
              ? "Guardando..."
              : isEdit
                ? "Guardar Cambios"
                : "Publicar Vacante"
          }}</span>
        </button>
      </div>
    </form>

    <!-- Standardized Vacancy Specification PDF Preview Modal -->
    <AppPdfPreviewModal
      v-model="state.showVacancyPdfModal"
      :url="state.vacancyPdfPreviewUrl"
      :file-name="
        state.selectedVacancyFile?.name || 'Especificacion_Vacante.pdf'
      "
      title="Especificación de Puesto (PDF)"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import { useVacancyForm } from "~/composables/useVacancyForm";
import { usePreviewStore } from "~/stores/preview";

const props = defineProps<{
  isEdit?: boolean;
}>();

const state = reactive(useVacancyForm({ isEdit: props.isEdit }));

const activeTab = ref("generales");

const tabItems = computed(() => {
  return [
    { id: "generales", label: "Datos Generales", icon: "assignment" },
    { id: "requisitos", label: "Requisitos & Filtros", icon: "psychology" },
    { id: "ubicacion", label: "Ubicación EdoMéx", icon: "map" },
  ];
});

const { data: session } = useAuth();
const router = useRouter();
const previewStore = usePreviewStore();

const mockJobPreview = computed(() => {
  const user = session.value?.user as
    (Record<string, any> & { image?: string }) | undefined;
  const authorAvatar =
    user?.fotoPerfil ||
    user?.avatarUrl ||
    user?.avatar ||
    user?.image ||
    undefined;

  return {
    id: "preview-only",
    title: state.form.title.trim() || "Título de Vacante",
    company: session.value?.user?.name || "Empresa JobNet",
    empresaLogoUrl: authorAvatar,
    companyLogo: authorAvatar,
    location:
      state.form.modality === "Remoto"
        ? "Remoto (EdoMéx)"
        : `${state.form.municipio || "Toluca"}, Estado de México`,
    municipio: state.form.municipio || "Toluca",
    modalidad: state.form.modality,
    salarioMinimo: state.form.salaryMin,
    salarioMaximo: state.form.salaryMax,
    salarioConfidencial: state.form.salarioConfidencial,
    isSalaryConfidential: state.form.salarioConfidencial,
    lat: state.form.lat,
    lng: state.form.lng,
    createdAt: new Date().toISOString(),
    descripcion:
      state.form.description.trim() || "Descripción de las actividades...",
    habilidadesRequeridas: state.form.skills,
    sectores: state.form.sectors,
    sector: state.form.sector || (state.form.sectors && state.form.sectors[0]) || "Tecnología",
    aptitudes: state.form.aptitudes,
    experienciaAnos: state.form.experienceYears || 0,
    vacantesDisponibles: state.form.vacantesDisponibles || 1,
    maxPostulantes: state.form.maxPostulantes || null,
    preguntasFiltro: state.form.preguntasFiltro.filter((q) => q.trim().length > 0),
    screeningQuestions: state.form.preguntasFiltro.filter((q) => q.trim().length > 0),
    pdfUrl: state.vacancyPdfPreviewUrl || undefined,
    pdfName: state.selectedVacancyFile?.name || undefined,
  };
});

const goToPreview = () => {
  const draft = {
    selectedVacancyFile: state.selectedVacancyFile,
    vacancyPdfPreviewUrl: state.vacancyPdfPreviewUrl,
  };
  previewStore.setPreviewVacancy(mockJobPreview.value, draft);
  router.push("/preview/vacancy");
};

onMounted(() => {
  if (previewStore.vacancyDraft) {
    state.selectedVacancyFile = previewStore.vacancyDraft.selectedVacancyFile;
    state.vacancyPdfPreviewUrl = previewStore.vacancyDraft.vacancyPdfPreviewUrl;
  }
});
</script>
