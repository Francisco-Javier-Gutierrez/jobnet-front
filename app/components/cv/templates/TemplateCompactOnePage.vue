<template>
  <div
    class="cv-letter-page cv-template-compact text-slate-900 bg-white shadow-lg mx-auto p-6 flex flex-col justify-between font-sans leading-tight"
    :style="{
      width: '215.9mm',
      minHeight: '279.4mm',
      fontSize: fontSizePx,
    }"
  >
    <div class="space-y-3.5">
      <!-- Header Compact -->
      <header
        class="flex justify-between items-center border-b pb-2.5"
        :style="{ borderColor: primaryColor || '#0284c7' }"
      >
        <div>
          <h1 class="text-xl font-extrabold tracking-tight">
            {{ cv.name || "Tu Nombre Completo" }}
          </h1>
          <p
            class="text-xs font-bold uppercase tracking-wide"
            :style="{ color: primaryColor || '#0284c7' }"
          >
            {{ cv.title || "Tu Título Profesional" }}
          </p>
        </div>

        <!-- Contact Box -->
        <div class="text-right text-[10px] text-slate-600 space-y-0.5">
          <div v-if="options.showEmail && cv.email">✉ {{ cv.email }}</div>
          <div v-if="options.showPhone && cv.phone">📞 {{ cv.phone }}</div>
          <div v-if="options.showLocation && cv.location">
            📍 {{ cv.location }}
          </div>
        </div>
      </header>

      <!-- Bio / Summary -->
      <section v-if="options.showBio && cv.bio" class="space-y-1">
        <h2
          class="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded"
          :style="{ color: primaryColor || '#0284c7' }"
        >
          Perfil
        </h2>
        <p
          class="text-[11px] text-slate-700 leading-snug whitespace-pre-line px-1"
        >
          {{ cv.bio }}
        </p>
      </section>

      <!-- Experience -->
      <section
        v-if="
          options.showExperience && cv.experience && cv.experience.length > 0
        "
        class="space-y-2"
      >
        <h2
          class="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded"
          :style="{ color: primaryColor || '#0284c7' }"
        >
          Experiencia Laboral
        </h2>
        <div class="space-y-2 px-1">
          <div
            v-for="(exp, idx) in cv.experience"
            :key="idx"
            class="space-y-0.5"
          >
            <div class="flex justify-between items-baseline">
              <span class="text-xs font-bold text-slate-900">
                {{ exp.puesto || exp.role || exp.title }} —
                <span class="font-semibold text-slate-600">{{
                  exp.empresa || exp.company
                }}</span>
              </span>
              <span class="text-[10px] text-slate-500 font-medium">
                {{ exp.periodo || exp.fecha || exp.dates }}
              </span>
            </div>
            <p
              v-if="exp.descripcion || exp.description"
              class="text-[10px] text-slate-600 leading-snug whitespace-pre-line"
            >
              {{ exp.descripcion || exp.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- Grid for Education and Skills -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Education -->
        <section
          v-if="
            options.showEducation && cv.education && cv.education.length > 0
          "
          class="space-y-1.5"
        >
          <h2
            class="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded"
            :style="{ color: primaryColor || '#0284c7' }"
          >
            Educación
          </h2>
          <div class="space-y-1.5 px-1">
            <div
              v-for="(edu, idx) in cv.education"
              :key="idx"
              class="space-y-0.5"
            >
              <div class="text-xs font-bold text-slate-900">
                {{ edu.titulo || edu.degree || edu.carrera }}
              </div>
              <div class="flex justify-between text-[10px] text-slate-500">
                <span>{{
                  edu.institucion || edu.institution || edu.escuela
                }}</span>
                <span>{{ edu.periodo || edu.fecha || edu.dates }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Skills -->
        <section
          v-if="options.showSkills && cv.skills && cv.skills.length > 0"
          class="space-y-1.5"
        >
          <h2
            class="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded"
            :style="{ color: primaryColor || '#0284c7' }"
          >
            Habilidades
          </h2>
          <div class="flex flex-wrap gap-1 px-1">
            <span
              v-for="(skill, idx) in cv.skills"
              :key="idx"
              class="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium border border-slate-200"
            >
              {{ skill }}
            </span>
          </div>
        </section>
      </div>

      <!-- Links -->
      <section
        v-if="options.showLinks && cv.links && cv.links.length > 0"
        class="space-y-1"
      >
        <h2
          class="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded"
          :style="{ color: primaryColor || '#0284c7' }"
        >
          Portafolio & Enlaces
        </h2>
        <div
          class="flex flex-wrap gap-x-4 gap-y-1 text-[10px] px-1 text-slate-700"
        >
          <span
            v-for="(link, idx) in cv.links"
            :key="idx"
            class="flex items-center gap-1"
          >
            <span>🔗</span>
            <a
              :href="link.url"
              target="_blank"
              class="hover:underline font-medium"
            >
              {{ link.label || link.nombre || link.name || link.url }}
            </a>
          </span>
        </div>
      </section>
    </div>

    <!-- Minimal Footer -->
    <footer class="pt-2 text-right text-[8px] text-slate-400">
      JobNet Resume Builder • Tamaño Carta
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
  if (props.options.fontSize === "sm") return "10px";
  if (props.options.fontSize === "lg") return "12px";
  return "11px";
});
</script>

<style scoped>
.cv-letter-page {
  box-sizing: border-box;
  page-break-after: always;
}
</style>
