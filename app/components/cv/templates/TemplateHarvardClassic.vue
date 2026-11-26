<template>
  <div
    class="cv-letter-page cv-template-harvard text-black bg-white mx-auto p-10 flex flex-col justify-between font-serif"
    :style="{
      width: '215.9mm',
      minHeight: '278.5mm',
      fontSize: fontSizePx,
    }"
  >
    <div class="space-y-4">
      <!-- Centered Header -->
      <header class="text-center space-y-1 pb-2">
        <h1 class="text-2xl font-bold tracking-tight uppercase">
          {{ cv.name || "Tu Nombre Completo" }}
        </h1>
        <p class="text-xs italic text-neutral-700">
          {{ cv.title || "Tu Título Profesional" }}
        </p>

        <!-- Contact details line -->
        <div
          class="flex flex-wrap justify-center items-center gap-x-2 text-[11px] text-neutral-800 pt-0.5"
        >
          <span v-if="options.showLocation && cv.location">{{
            cv.location
          }}</span>
          <span
            v-if="
              options.showLocation &&
              cv.location &&
              options.showPhone &&
              cv.phone
            "
            >•</span
          >
          <span v-if="options.showPhone && cv.phone">{{ cv.phone }}</span>
          <span v-if="options.showEmail && cv.email">•</span>
          <span v-if="options.showEmail && cv.email">{{ cv.email }}</span>
          <template v-if="options.showLinks && cv.links && cv.links.length > 0">
            <span
              v-for="(link, idx) in cv.links"
              :key="idx"
              class="flex items-center gap-1"
            >
              <span>•</span>
              <a :href="link.url" target="_blank" class="hover:underline">
                {{ link.label || link.nombre || link.name || link.url }}
              </a>
            </span>
          </template>
        </div>
      </header>

      <!-- Horizontal Divider -->
      <div class="w-full h-px bg-black my-2"></div>

      <!-- Professional Summary -->
      <section v-if="options.showBio && cv.bio" class="space-y-1">
        <h2
          class="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-0.5"
        >
          Resumen Profesional
        </h2>
        <p
          class="text-xs text-neutral-900 leading-relaxed whitespace-pre-line pt-0.5"
        >
          {{ cv.bio }}
        </p>
      </section>

      <!-- Experience -->
      <section
        v-if="
          options.showExperience && cv.experience && cv.experience.length > 0
        "
        class="space-y-2.5"
      >
        <h2
          class="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-0.5"
        >
          Experiencia Laboral
        </h2>
        <div class="space-y-3">
          <div
            v-for="(exp, idx) in cv.experience"
            :key="idx"
            class="space-y-0.5"
          >
            <div class="flex justify-between items-baseline font-bold text-xs">
              <span>{{ exp.empresa || exp.company }}</span>
              <span class="text-[11px] font-normal italic">
                {{ exp.periodo || exp.fecha || exp.dates }}
              </span>
            </div>
            <div class="text-xs italic text-neutral-800">
              {{ exp.puesto || exp.role || exp.title }}
            </div>
            <p
              v-if="exp.descripcion || exp.description"
              class="text-xs text-neutral-800 leading-relaxed whitespace-pre-line pt-0.5"
            >
              {{ exp.descripcion || exp.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- Education -->
      <section
        v-if="options.showEducation && cv.education && cv.education.length > 0"
        class="space-y-2"
      >
        <h2
          class="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-0.5"
        >
          Educación
        </h2>
        <div class="space-y-2">
          <div
            v-for="(edu, idx) in cv.education"
            :key="idx"
            class="space-y-0.5"
          >
            <div class="flex justify-between items-baseline text-xs font-bold">
              <span>{{
                edu.institucion || edu.institution || edu.escuela
              }}</span>
              <span class="text-[11px] font-normal italic">
                {{ edu.periodo || edu.fecha || edu.dates }}
              </span>
            </div>
            <div class="text-xs text-neutral-800">
              {{ edu.titulo || edu.degree || edu.carrera }}
            </div>
          </div>
        </div>
      </section>

      <!-- Skills -->
      <section
        v-if="options.showSkills && cv.skills && cv.skills.length > 0"
        class="space-y-1"
      >
        <h2
          class="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-0.5"
        >
          Habilidades & Competencias
        </h2>
        <p class="text-xs text-neutral-900 leading-relaxed pt-0.5">
          {{ cv.skills.join(" • ") }}
        </p>
      </section>
    </div>

    <!-- Footer -->
    <footer class="pt-4 text-center text-[9px] text-neutral-400 font-sans">
      JobNet Professional Resume
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { CvData, CvOptions } from "~/types/cv";
import { getCvBaseFontSize } from "~/composables/useCvGenerator";

const props = defineProps<{
  cv: CvData;
  options: CvOptions;
  primaryColor?: string;
}>();

const fontSizePx = computed(() => getCvBaseFontSize(props.options.fontSize));
</script>

<style scoped>
.cv-letter-page {
  box-sizing: border-box;
  font-family: Georgia, Cambria, "Times New Roman", Times, serif;
}
</style>
