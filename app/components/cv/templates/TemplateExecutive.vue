<template>
  <div
    class="cv-letter-page cv-template-executive text-slate-800 bg-white shadow-lg mx-auto p-9 flex flex-col justify-between font-sans"
    :style="{
      width: '215.9mm',
      minHeight: '279.4mm',
      fontSize: fontSizePx,
    }"
  >
    <div class="space-y-5">
      <!-- Centered Header -->
      <header
        class="text-center space-y-2 border-b-2 pb-4"
        :style="{ borderColor: primaryColor || '#1e3a8a' }"
      >
        <div v-if="options.showPhoto && cv.photoUrl" class="mb-2">
          <img
            :src="cv.photoUrl"
            crossorigin="anonymous"
            alt="Foto"
            class="w-20 h-20 rounded-full mx-auto object-cover border-2 border-slate-200 shadow-sm"
          />
        </div>
        <h1 class="text-2xl font-bold uppercase tracking-widest text-slate-900">
          {{ cv.name || "Tu Nombre Completo" }}
        </h1>
        <p
          class="text-xs font-bold uppercase tracking-wider"
          :style="{ color: primaryColor || '#1e3a8a' }"
        >
          {{ cv.title || "Tu Título Profesional" }}
        </p>

        <!-- Contact Strip -->
        <div
          class="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 pt-1"
        >
          <span
            v-if="options.showEmail && cv.email"
            class="flex items-center gap-1"
          >
            <span>✉</span> {{ cv.email }}
          </span>
          <span
            v-if="options.showPhone && cv.phone"
            class="flex items-center gap-1"
          >
            <span>•</span> <span>📞</span> {{ cv.phone }}
          </span>
          <span
            v-if="options.showLocation && cv.location"
            class="flex items-center gap-1"
          >
            <span>•</span> <span>📍</span> {{ cv.location }}
          </span>
          <template v-if="options.showLinks && cv.links && cv.links.length > 0">
            <span
              v-for="(link, idx) in cv.links"
              :key="idx"
              class="flex items-center gap-1"
            >
              <span>•</span>
              <a
                :href="link.url"
                target="_blank"
                class="hover:underline text-slate-700"
              >
                {{ link.label || link.nombre || link.name || link.url }}
              </a>
            </span>
          </template>
        </div>
      </header>

      <!-- Summary -->
      <section v-if="options.showBio && cv.bio" class="space-y-1.5">
        <h2
          class="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5"
          :style="{ color: primaryColor || '#1e3a8a' }"
        >
          Resumen Ejecutivo
        </h2>
        <p
          class="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-line"
        >
          {{ cv.bio }}
        </p>
      </section>

      <!-- Experience -->
      <section
        v-if="
          options.showExperience && cv.experience && cv.experience.length > 0
        "
        class="space-y-3"
      >
        <h2
          class="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5"
          :style="{ color: primaryColor || '#1e3a8a' }"
        >
          Trayectoria Profesional
        </h2>
        <div class="space-y-3.5">
          <div v-for="(exp, idx) in cv.experience" :key="idx" class="space-y-1">
            <div class="flex justify-between items-baseline">
              <span class="text-xs font-bold text-slate-900">
                {{ exp.puesto || exp.role || exp.title }}
              </span>
              <span class="text-[10px] text-slate-500 font-medium italic">
                {{ exp.periodo || exp.fecha || exp.dates }}
              </span>
            </div>
            <p class="text-[11px] font-semibold text-slate-700">
              {{ exp.empresa || exp.company }}
            </p>
            <p
              v-if="exp.descripcion || exp.description"
              class="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line"
            >
              {{ exp.descripcion || exp.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- Education -->
      <section
        v-if="options.showEducation && cv.education && cv.education.length > 0"
        class="space-y-2.5"
      >
        <h2
          class="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5"
          :style="{ color: primaryColor || '#1e3a8a' }"
        >
          Formación Académica
        </h2>
        <div class="space-y-2">
          <div
            v-for="(edu, idx) in cv.education"
            :key="idx"
            class="space-y-0.5"
          >
            <div class="flex justify-between items-baseline">
              <span class="text-xs font-bold text-slate-900">
                {{ edu.titulo || edu.degree || edu.carrera }}
              </span>
              <span class="text-[10px] text-slate-500 italic">
                {{ edu.periodo || edu.fecha || edu.dates }}
              </span>
            </div>
            <p class="text-[11px] text-slate-600 font-medium">
              {{ edu.institucion || edu.institution || edu.escuela }}
            </p>
          </div>
        </div>
      </section>

      <!-- Skills and Competencies -->
      <section
        v-if="options.showSkills && cv.skills && cv.skills.length > 0"
        class="space-y-1.5"
      >
        <h2
          class="text-xs font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5"
          :style="{ color: primaryColor || '#1e3a8a' }"
        >
          Competencias Clave
        </h2>
        <div class="flex flex-wrap gap-2 pt-1">
          <span
            v-for="(skill, idx) in cv.skills"
            :key="idx"
            class="text-[11px] bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded font-medium border border-slate-200"
          >
            {{ skill }}
          </span>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <footer
      class="pt-4 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400"
    >
      <span>Curriculum Vitae</span>
      <span>Generado con JobNet</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { CvData, CvOptions } from "~/types/cv";

const props = defineProps<{
  cv: CvData;
  options: CvOptions;
  primaryColor?: string;
}>();

const fontSizePx = computed(() => {
  if (props.options.fontSize === "sm") return "11px";
  if (props.options.fontSize === "lg") return "13px";
  return "12px";
});
</script>

<style scoped>
.cv-letter-page {
  box-sizing: border-box;
  page-break-after: always;
}
</style>
