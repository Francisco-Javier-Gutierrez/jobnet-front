<template>
  <div
    class="cv-letter-page cv-template-standard text-slate-800 bg-white shadow-lg mx-auto p-10 flex flex-col justify-between font-sans"
    :style="{
      width: '215.9mm',
      minHeight: '279.4mm',
      fontSize: fontSizePx,
    }"
  >
    <div class="space-y-4">
      <!-- Header Section -->
      <header
        class="flex items-start justify-between gap-6 pb-2 border-b-2"
        :style="{ borderColor: primaryColor || '#1e3a8a' }"
      >
        <div class="space-y-1.5 flex-1 min-w-0">
          <h1
            class="text-2xl font-extrabold tracking-tight uppercase"
            :style="{ color: primaryColor || '#1e3a8a' }"
          >
            {{ cv.name || "Tu Nombre Completo" }}
          </h1>
          <p class="text-sm font-semibold text-slate-600">
            {{ cv.title || "Tu Título Profesional" }}
          </p>

          <!-- Contact details line -->
          <div
            class="flex flex-wrap items-center gap-x-2 text-[11px] text-slate-700 pt-1"
          >
            <span v-if="options.showLocation && cv.location">
              📍 {{ cv.location }}
            </span>
            <span
              v-if="
                options.showLocation &&
                cv.location &&
                options.showPhone &&
                cv.phone
              "
              >•</span
            >
            <span v-if="options.showPhone && cv.phone">
              📞 {{ cv.phone }}
            </span>
            <span
              v-if="
                (options.showLocation || options.showPhone) &&
                options.showEmail &&
                cv.email
              "
              >•</span
            >
            <span v-if="options.showEmail && cv.email">
              ✉️ {{ cv.email }}
            </span>
            <template
              v-if="options.showLinks && cv.links && cv.links.length > 0"
            >
              <span
                v-for="(link, idx) in cv.links"
                :key="idx"
                class="flex items-center gap-1"
              >
                <span>•</span>
                <a
                  :href="link.url"
                  target="_blank"
                  rel="noopener"
                  class="hover:underline font-medium text-slate-800"
                >
                  🔗 {{ link.label || link.nombre || link.name || link.url }}
                </a>
              </span>
            </template>
          </div>
        </div>

        <!-- Optional Photo with CORS cross-origin safety -->
        <div v-if="options.showPhoto && cv.photoUrl" class="shrink-0">
          <img
            :src="cv.photoUrl"
            crossorigin="anonymous"
            alt="Foto de perfil"
            class="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-sm"
          />
        </div>
      </header>

      <!-- Professional Summary -->
      <section v-if="options.showBio && cv.bio" class="space-y-1">
        <h2
          class="text-xs font-bold uppercase tracking-wider pb-0.5 border-b border-slate-200"
          :style="{ color: primaryColor || '#1e3a8a' }"
        >
          Resumen Profesional
        </h2>
        <p
          class="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-line pt-0.5"
        >
          {{ cv.bio }}
        </p>
      </section>

      <!-- Work Experience -->
      <section
        v-if="
          options.showExperience && cv.experience && cv.experience.length > 0
        "
        class="space-y-2.5"
      >
        <h2
          class="text-xs font-bold uppercase tracking-wider pb-0.5 border-b border-slate-200"
          :style="{ color: primaryColor || '#1e3a8a' }"
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
              <span class="text-slate-900">{{ exp.empresa }}</span>
              <span class="text-[11px] font-medium text-slate-500">
                {{ exp.periodo }}
              </span>
            </div>
            <div class="text-xs font-semibold text-slate-700">
              {{ exp.puesto }}
            </div>
            <p
              v-if="exp.descripcion"
              class="text-xs text-slate-700 leading-relaxed whitespace-pre-line pt-0.5 text-justify"
            >
              {{ exp.descripcion }}
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
          class="text-xs font-bold uppercase tracking-wider pb-0.5 border-b border-slate-200"
          :style="{ color: primaryColor || '#1e3a8a' }"
        >
          Educación & Formación
        </h2>
        <div class="space-y-2.5">
          <div
            v-for="(edu, idx) in cv.education"
            :key="idx"
            class="space-y-0.5"
          >
            <div class="flex justify-between items-baseline text-xs font-bold">
              <span class="text-slate-900">{{ edu.institucion }}</span>
              <span class="text-[11px] font-medium text-slate-500">
                {{ edu.periodo }}
              </span>
            </div>
            <div class="text-xs font-semibold text-slate-700">
              {{ edu.titulo }}
            </div>
            <p
              v-if="edu.descripcion"
              class="text-xs text-slate-600 leading-relaxed pt-0.5"
            >
              {{ edu.descripcion }}
            </p>
          </div>
        </div>
      </section>

      <!-- Skills & Languages Grid -->
      <div
        v-if="
          (options.showSkills && cv.skills && cv.skills.length > 0) ||
          (options.showLanguages && cv.languages && cv.languages.length > 0)
        "
        class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1"
      >
        <!-- Skills -->
        <section
          v-if="options.showSkills && cv.skills && cv.skills.length > 0"
          class="space-y-1.5"
        >
          <h2
            class="text-xs font-bold uppercase tracking-wider pb-0.5 border-b border-slate-200"
            :style="{ color: primaryColor || '#1e3a8a' }"
          >
            Habilidades Clave
          </h2>
          <div class="flex flex-wrap gap-1.5 pt-0.5">
            <span
              v-for="(skill, idx) in cv.skills"
              :key="idx"
              class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200"
            >
              {{ skill }}
            </span>
          </div>
        </section>

        <!-- Languages -->
        <section
          v-if="
            options.showLanguages && cv.languages && cv.languages.length > 0
          "
          class="space-y-1.5"
        >
          <h2
            class="text-xs font-bold uppercase tracking-wider pb-0.5 border-b border-slate-200"
            :style="{ color: primaryColor || '#1e3a8a' }"
          >
            Idiomas
          </h2>
          <div class="flex flex-wrap gap-1.5 pt-0.5">
            <span
              v-for="(lang, idx) in cv.languages"
              :key="idx"
              class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200"
            >
              {{ lang }}
            </span>
          </div>
        </section>
      </div>
    </div>

    <!-- Minimal Professional Footer -->
    <footer
      class="pt-4 text-center text-[10px] text-slate-400 font-sans border-t border-slate-100"
    >
      JobNet · Currículum Vitae Profesional (Estándar Carta)
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
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
