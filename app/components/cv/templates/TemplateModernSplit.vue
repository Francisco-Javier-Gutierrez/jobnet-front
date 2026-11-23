<template>
  <div
    class="cv-letter-page cv-template-modern-split text-slate-800 bg-white mx-auto flex flex-row font-sans"
    :style="{
      width: '215.9mm',
      minHeight: '279mm',
      fontSize: fontSizePx,
    }"
  >
    <!-- Left Column (35%) -->
    <div
      class="w-[75mm] bg-slate-50 p-6 flex flex-col justify-between border-r border-slate-200 shrink-0"
    >
      <div class="space-y-5">
        <!-- Photo -->
        <div v-if="options.showPhoto && cv.photoUrl" class="text-center">
          <img
            :src="cv.photoUrl"
            crossorigin="anonymous"
            alt="Foto"
            class="w-24 h-24 rounded-2xl mx-auto object-cover border-4 border-white shadow-md"
          />
        </div>

        <!-- Contact details -->
        <div class="space-y-2.5">
          <h3
            class="text-[11px] font-bold uppercase tracking-wider pb-1 border-b"
            :style="{
              color: primaryColor || '#059669',
              borderColor: primaryColor ? primaryColor + '40' : '#e2e8f0',
            }"
          >
            Datos Personales
          </h3>
          <div class="space-y-2 text-[11px] text-slate-700">
            <div
              v-if="options.showEmail && cv.email"
              class="break-all flex items-start gap-2"
            >
              <span class="text-slate-400">✉</span>
              <span>{{ cv.email }}</span>
            </div>
            <div
              v-if="options.showPhone && cv.phone"
              class="flex items-center gap-2"
            >
              <span class="text-slate-400">📞</span>
              <span>{{ cv.phone }}</span>
            </div>
            <div
              v-if="options.showLocation && cv.location"
              class="flex items-center gap-2"
            >
              <span class="text-slate-400">📍</span>
              <span>{{ cv.location }}</span>
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div
          v-if="options.showSkills && cv.skills && cv.skills.length > 0"
          class="space-y-2"
        >
          <h3
            class="text-[11px] font-bold uppercase tracking-wider pb-1 border-b"
            :style="{
              color: primaryColor || '#059669',
              borderColor: primaryColor ? primaryColor + '40' : '#e2e8f0',
            }"
          >
            Habilidades
          </h3>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="(skill, idx) in cv.skills"
              :key="idx"
              class="px-2 py-0.5 bg-white text-slate-800 rounded text-[10px] font-semibold border border-slate-200 shadow-2xs"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Education -->
        <div
          v-if="
            options.showEducation && cv.education && cv.education.length > 0
          "
          class="space-y-2"
        >
          <h3
            class="text-[11px] font-bold uppercase tracking-wider pb-1 border-b"
            :style="{
              color: primaryColor || '#059669',
              borderColor: primaryColor ? primaryColor + '40' : '#e2e8f0',
            }"
          >
            Educación
          </h3>
          <div class="space-y-2 text-[11px]">
            <div
              v-for="(edu, idx) in cv.education"
              :key="idx"
              class="space-y-0.5"
            >
              <p class="font-bold text-slate-900 leading-tight">
                {{ edu.titulo || edu.degree || edu.carrera }}
              </p>
              <p class="text-slate-600 font-medium">
                {{ edu.institucion || edu.institution || edu.escuela }}
              </p>
              <p class="text-[10px] text-slate-400">
                {{ edu.periodo || edu.fecha || edu.dates }}
              </p>
            </div>
          </div>
        </div>

        <!-- Links -->
        <div
          v-if="options.showLinks && cv.links && cv.links.length > 0"
          class="space-y-2"
        >
          <h3
            class="text-[11px] font-bold uppercase tracking-wider pb-1 border-b"
            :style="{
              color: primaryColor || '#059669',
              borderColor: primaryColor ? primaryColor + '40' : '#e2e8f0',
            }"
          >
            Portafolio & Web
          </h3>
          <div class="space-y-1 text-[11px]">
            <div v-for="(link, idx) in cv.links" :key="idx" class="truncate">
              <a
                :href="link.url"
                target="_blank"
                class="hover:underline text-slate-700 font-medium"
              >
                🔗 {{ link.label || link.nombre || link.name || link.url }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="text-[9px] text-slate-400 text-center pt-3">JobNet Carta</div>
    </div>

    <!-- Right Column (65%) -->
    <div class="flex-1 p-7 flex flex-col justify-between space-y-6">
      <div class="space-y-5">
        <!-- Main Header -->
        <header class="space-y-1">
          <h1
            class="text-2xl font-extrabold tracking-tight"
            :style="{ color: primaryColor || '#059669' }"
          >
            {{ cv.name || "Tu Nombre Completo" }}
          </h1>
          <p class="text-xs font-bold text-slate-600 uppercase tracking-wider">
            {{ cv.title || "Tu Especialidad Profesional" }}
          </p>
        </header>

        <!-- Summary -->
        <section v-if="options.showBio && cv.bio" class="space-y-1.5">
          <h2
            class="text-xs font-bold uppercase tracking-wider pb-1 border-b border-slate-200"
            :style="{ color: primaryColor || '#059669' }"
          >
            Perfil Profesional
          </h2>
          <p
            class="text-xs text-slate-700 leading-relaxed whitespace-pre-line text-justify"
          >
            {{ cv.bio }}
          </p>
        </section>

        <!-- Work Experience -->
        <section
          v-if="
            options.showExperience && cv.experience && cv.experience.length > 0
          "
          class="space-y-3"
        >
          <h2
            class="text-xs font-bold uppercase tracking-wider pb-1 border-b border-slate-200"
            :style="{ color: primaryColor || '#059669' }"
          >
            Experiencia Laboral
          </h2>
          <div class="space-y-3.5">
            <div
              v-for="(exp, idx) in cv.experience"
              :key="idx"
              class="space-y-1"
            >
              <div class="flex justify-between items-baseline">
                <span class="text-xs font-bold text-slate-900">
                  {{ exp.puesto || exp.role || exp.title }}
                </span>
                <span class="text-[10px] text-slate-400 font-medium">
                  {{ exp.periodo || exp.fecha || exp.dates }}
                </span>
              </div>
              <p
                class="text-[11px] font-semibold"
                :style="{ color: primaryColor || '#059669' }"
              >
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
      </div>

      <footer class="text-[9px] text-slate-400 text-right">
        Curriculum Vitae Profesional
      </footer>
    </div>
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
}
</style>
