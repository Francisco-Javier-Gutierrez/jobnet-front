<template>
  <div
    class="cv-letter-page cv-template-tech text-slate-800 bg-white shadow-lg mx-auto flex flex-row font-sans"
    :style="{
      width: '215.9mm',
      minHeight: '279.4mm',
      fontSize: fontSizePx,
    }"
  >
    <!-- Left Sidebar -->
    <aside
      class="w-[72mm] p-6 flex flex-col justify-between text-white shrink-0"
      :style="{ backgroundColor: primaryColor || '#0f172a' }"
    >
      <div class="space-y-6">
        <!-- Photo -->
        <div v-if="options.showPhoto && cv.photoUrl" class="text-center">
          <img
            :src="cv.photoUrl"
            alt="Foto de Perfil"
            class="w-24 h-24 rounded-full mx-auto object-cover border-2 border-white/40 shadow-sm"
          />
        </div>

        <!-- Contact Info -->
        <div class="space-y-3 text-xs text-slate-200">
          <h3
            class="text-[11px] font-bold tracking-wider uppercase text-white/90 border-b border-white/20 pb-1"
          >
            Contacto
          </h3>
          <div
            v-if="options.showEmail && cv.email"
            class="flex items-center gap-2 break-all"
          >
            <span class="text-white/70 text-xs">✉</span>
            <span>{{ cv.email }}</span>
          </div>
          <div
            v-if="options.showPhone && cv.phone"
            class="flex items-center gap-2"
          >
            <span class="text-white/70 text-xs">📞</span>
            <span>{{ cv.phone }}</span>
          </div>
          <div
            v-if="options.showLocation && cv.location"
            class="flex items-center gap-2"
          >
            <span class="text-white/70 text-xs">📍</span>
            <span>{{ cv.location }}</span>
          </div>
        </div>

        <!-- Links / Portfolio -->
        <div
          v-if="options.showLinks && cv.links && cv.links.length > 0"
          class="space-y-2 text-xs text-slate-200"
        >
          <h3
            class="text-[11px] font-bold tracking-wider uppercase text-white/90 border-b border-white/20 pb-1"
          >
            Enlaces
          </h3>
          <div
            v-for="(link, idx) in cv.links"
            :key="idx"
            class="truncate flex items-center gap-1.5"
          >
            <span class="text-white/60">🔗</span>
            <a
              :href="link.url"
              target="_blank"
              class="hover:underline text-white/90"
            >
              {{ link.label || link.nombre || link.name || link.url }}
            </a>
          </div>
        </div>

        <!-- Skills -->
        <div
          v-if="options.showSkills && cv.skills && cv.skills.length > 0"
          class="space-y-2"
        >
          <h3
            class="text-[11px] font-bold tracking-wider uppercase text-white/90 border-b border-white/20 pb-1"
          >
            Habilidades
          </h3>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="(skill, idx) in cv.skills"
              :key="idx"
              class="px-2 py-0.5 bg-white/15 text-white rounded text-[10px] font-medium"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Languages -->
        <div
          v-if="
            options.showLanguages && cv.languages && cv.languages.length > 0
          "
          class="space-y-2 text-xs text-slate-200"
        >
          <h3
            class="text-[11px] font-bold tracking-wider uppercase text-white/90 border-b border-white/20 pb-1"
          >
            Idiomas
          </h3>
          <div
            v-for="(lang, idx) in cv.languages"
            :key="idx"
            class="text-[11px]"
          >
            {{ lang }}
          </div>
        </div>
      </div>

      <div class="pt-4 text-[9px] text-white/40 text-center tracking-wider">
        Generado en JobNet
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 p-7 flex flex-col justify-between">
      <div class="space-y-5">
        <!-- Header -->
        <header class="border-b border-slate-200 pb-4">
          <h1
            class="text-2xl font-extrabold tracking-tight"
            :style="{ color: primaryColor || '#0f172a' }"
          >
            {{ cv.name || "Tu Nombre Completo" }}
          </h1>
          <p class="text-sm font-semibold text-slate-600 tracking-wide mt-0.5">
            {{ cv.title || "Tu Título Profesional" }}
          </p>
        </header>

        <!-- Profile Bio -->
        <section v-if="options.showBio && cv.bio" class="space-y-1.5">
          <h2
            class="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5"
          >
            <span
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: primaryColor || '#0f172a' }"
            ></span>
            Perfil Profesional
          </h2>
          <p class="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
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
            class="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1"
          >
            <span
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: primaryColor || '#0f172a' }"
            ></span>
            Experiencia Laboral
          </h2>
          <div class="space-y-3">
            <div
              v-for="(exp, idx) in cv.experience"
              :key="idx"
              class="space-y-1"
            >
              <div class="flex justify-between items-baseline">
                <span class="text-xs font-bold text-slate-900">
                  {{ exp.puesto || exp.role || exp.title }}
                </span>
                <span class="text-[10px] text-slate-500 font-medium">
                  {{ exp.periodo || exp.fecha || exp.dates }}
                </span>
              </div>
              <p
                class="text-[11px] font-semibold"
                :style="{ color: primaryColor || '#2563eb' }"
              >
                {{ exp.empresa || exp.company }}
              </p>
              <p
                v-if="exp.descripcion || exp.description"
                class="text-[11px] text-slate-600 leading-snug whitespace-pre-line"
              >
                {{ exp.descripcion || exp.description }}
              </p>
            </div>
          </div>
        </section>

        <!-- Education -->
        <section
          v-if="
            options.showEducation && cv.education && cv.education.length > 0
          "
          class="space-y-3"
        >
          <h2
            class="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1"
          >
            <span
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: primaryColor || '#0f172a' }"
            ></span>
            Educación y Formación
          </h2>
          <div class="space-y-2.5">
            <div
              v-for="(edu, idx) in cv.education"
              :key="idx"
              class="space-y-0.5"
            >
              <div class="flex justify-between items-baseline">
                <span class="text-xs font-bold text-slate-900">
                  {{ edu.titulo || edu.degree || edu.carrera }}
                </span>
                <span class="text-[10px] text-slate-500 font-medium">
                  {{ edu.periodo || edu.fecha || edu.dates }}
                </span>
              </div>
              <p class="text-[11px] font-semibold text-slate-600">
                {{ edu.institucion || edu.institution || edu.escuela }}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
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
