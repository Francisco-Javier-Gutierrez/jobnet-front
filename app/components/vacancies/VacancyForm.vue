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

    <form
      @submit.prevent="state.handleSubmit"
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-6 shadow-sm"
    >
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
            <span class="text-[10px] text-outline font-normal">(Opcional)</span>
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
          <div
            v-if="state.selectedVacancyFile"
            class="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-xl text-xs font-bold max-w-md flex-wrap"
          >
            <span
              class="material-symbols-outlined text-sm text-rose-600 flex-shrink-0"
              >picture_as_pdf</span
            >
            <span class="truncate max-w-[160px] sm:max-w-[200px]">{{
              state.selectedVacancyFile.name
            }}</span>
            <button
              type="button"
              @click="state.openVacancyPdfPreview"
              class="px-2.5 py-1 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-primary-container transition cursor-pointer flex items-center gap-1 shadow-xs"
              title="Vista previa del documento PDF"
            >
              <span class="material-symbols-outlined text-xs">visibility</span>
              <span>Ver Previa</span>
            </button>
            <button
              type="button"
              @click="state.clearVacancyFile"
              class="text-on-surface-variant dark:text-slate-300 hover:text-rose-600 flex items-center transition cursor-pointer p-0.5"
              title="Eliminar archivo"
            >
              <span class="material-symbols-outlined text-xs">close</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Ubicación Geográfica (AppLocationMap Centrado) -->
      <AppLocationMap
        v-model:lat="state.form.lat"
        v-model:lng="state.form.lng"
        label="Ubicación Geográfica de la Vacante"
        height="280px"
      />

      <!-- Rango Salarial (Opcional) -->
      <div
        class="bg-surface-container-low/30 border border-outline-variant/60 rounded-xl p-4 flex flex-col gap-4"
      >
        <h3
          class="text-xs font-bold text-on-background uppercase tracking-wider"
        >
          Rango Salarial Mensual (Opcional)
        </h3>
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
      </div>

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
                (s: any) =>
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
              equipo de moderación para su aprobación. Se asociará temporalmente
              a tu perfil; por favor, valida la ortografía antes de crearla.
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
              No se encontraron habilidades adicionales. Escribe para crear una
              nueva.
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
                (s: any) =>
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
              equipo de moderación para su aprobación. Se asociará temporalmente
              a tu perfil; por favor, valida la ortografía antes de crearlo.
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

      <!-- Submit button -->
      <button
        type="submit"
        :disabled="state.submitting || state.form.skills.length === 0"
        class="bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-semibold text-sm h-12 rounded-xl transition shadow-md shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 duration-100 mt-2"
      >
        <span class="material-symbols-outlined text-lg">{{
          state.submitting ? "sync" : "post_add"
        }}</span>
        {{
          state.submitting
            ? "Guardando..."
            : isEdit
              ? "Guardar Cambios"
              : "Publicar Vacante"
        }}
      </button>
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
import AppLocationMap from "~/components/common/AppLocationMap.vue";
import AppPdfPreviewModal from "~/components/common/AppPdfPreviewModal.vue";
import { useVacancyForm } from "~/composables/useVacancyForm";
import { reactive } from "vue";

const props = defineProps<{
  isEdit?: boolean;
}>();

const state = reactive(useVacancyForm({ isEdit: props.isEdit }));
</script>
