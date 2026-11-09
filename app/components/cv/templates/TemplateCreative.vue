<template>
  <div
    class="cv-letter-page cv-template-creative text-slate-800 bg-white shadow-lg mx-auto p-8 flex flex-col justify-between font-sans"
    :style="{
      width: '215.9mm',
      minHeight: '279.4mm',
      fontSize: fontSizePx,
    }"
  >
    <div class="space-y-6">
      <!-- Modern Accent Header Card -->
      <header
        class="rounded-2xl p-6 text-white flex items-center justify-between shadow-md"
        :style="{
          background: `linear-gradient(135deg, ${primaryColor || '#6366f1'} 0%, #1e1b4b 100%)`,
        }"
      >
        <div class="space-y-1 max-w-[70%]">
          <h1 class="text-2xl font-extrabold tracking-tight">
            {{ cv.name || "Tu Nombre Completo" }}
          </h1>
          <p class="text-xs font-semibold text-white/90 tracking-wide">
            {{ cv.title || "Tu Especialidad Profesional" }}
          </p>
          <div
            class="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/80 pt-2"
          >
            <span
              v-if="options.showEmail && cv.email"
              class="flex items-center gap-1"
            >
              ✉ {{ cv.email }}
            </span>
            <span
              v-if="options.showPhone && cv.phone"
              class="flex items-center gap-1"
            >
              📞 {{ cv.phone }}
            </span>
            <span
              v-if="options.showLocation && cv.location"
              class="flex items-center gap-1"
            >
              📍 {{ cv.location }}
            </span>
          </div>
        </div>

        <div v-if="options.showPhoto && cv.photoUrl" class="shrink-0">
          <img
            :src="cv.photoUrl"
            crossorigin="anonymous"
            alt="Avatar"
            class="w-20 h-20 rounded-2xl object-cover border-2 border-white/40 shadow-inner"
          />
        </div>
      </header>

      <!-- Two Columns Split -->
      <div class="grid grid-cols-12 gap-6">
        <!-- Main Column (Left - 7 cols) -->
        <div class="col-span-7 space-y-5">
          <!-- Bio -->
          <section v-if="options.showBio && cv.bio" class="space-y-1.5">
            <h2
              class="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              :style="{ color: primaryColor || '#6366f1' }"
            >
              <span class="w-1.5 h-3 rounded-full bg-current"></span>
              Sobre Mí
            </h2>
            <p
              class="text-xs text-slate-600 leading-relaxed whitespace-pre-line"
            >
              {{ cv.bio }}
            </p>
          </section>

          <!-- Experience -->
          <section
            v-if="
              options.showExperience &&
              cv.experience &&
              cv.experience.length > 0
            "
            class="space-y-3"
          >
            <h2
              class="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              :style="{ color: primaryColor || '#6366f1' }"
            >
              <span class="w-1.5 h-3 rounded-full bg-current"></span>
              Experiencia Laboral
            </h2>
            <div class="space-y-3">
              <div
                v-for="(exp, idx) in cv.experience"
                :key="idx"
                class="border-l-2 pl-3 space-y-1"
                :style="{ borderColor: primaryColor || '#6366f1' }"
              >
                <div class="flex justify-between items-baseline">
                  <span class="text-xs font-bold text-slate-900">
                    {{ exp.puesto || exp.role || exp.title }}
                  </span>
                  <span class="text-[10px] text-slate-400 font-medium">
                    {{ exp.periodo || exp.fecha || exp.dates }}
                  </span>
                </div>
                <p class="text-[11px] font-semibold text-slate-700">
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
        </div>

        <!-- Side Column (Right - 5 cols) -->
        <div class="col-span-5 space-y-5">
          <!-- Skills -->
          <section
            v-if="options.showSkills && cv.skills && cv.skills.length > 0"
            class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100"
          >
            <h2
              class="text-xs font-bold uppercase tracking-wider text-slate-800"
            >
              Habilidades
            </h2>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="(skill, idx) in cv.skills"
                :key="idx"
                class="px-2.5 py-1 text-[10px] font-semibold rounded-lg shadow-sm"
                :style="{
                  backgroundColor: '#ffffff',
                  color: primaryColor || '#6366f1',
                  border: `1px solid ${primaryColor ? primaryColor + '30' : '#e0e7ff'}`,
                }"
              >
                {{ skill }}
              </span>
            </div>
          </section>

          <!-- Education -->
          <section
            v-if="
              options.showEducation && cv.education && cv.education.length > 0
            "
            class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100"
          >
            <h2
              class="text-xs font-bold uppercase tracking-wider text-slate-800"
            >
              Educación
            </h2>
            <div class="space-y-2.5">
              <div
                v-for="(edu, idx) in cv.education"
                :key="idx"
                class="space-y-0.5"
              >
                <span class="text-xs font-bold text-slate-900 block">
                  {{ edu.titulo || edu.degree || edu.carrera }}
                </span>
                <span class="text-[11px] text-slate-600 font-medium block">
                  {{ edu.institucion || edu.institution || edu.escuela }}
                </span>
                <span class="text-[10px] text-slate-400 block">
                  {{ edu.periodo || edu.fecha || edu.dates }}
                </span>
              </div>
            </div>
          </section>

          <!-- Links -->
          <section
            v-if="options.showLinks && cv.links && cv.links.length > 0"
            class="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100"
          >
            <h2
              class="text-xs font-bold uppercase tracking-wider text-slate-800"
            >
              Portafolio & Redes
            </h2>
            <div class="space-y-1.5 text-[11px]">
              <div
                v-for="(link, idx) in cv.links"
                :key="idx"
                class="flex items-center gap-1.5 truncate text-slate-700"
              >
                <span class="text-slate-400">🔗</span>
                <a
                  :href="link.url"
                  target="_blank"
                  class="hover:underline truncate font-medium"
                >
                  {{ link.label || link.nombre || link.name || link.url }}
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="pt-4 text-center text-[9px] text-slate-400">
      Diseñado en JobNet
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
