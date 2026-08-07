<template>
  <div class="max-w-2xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-on-background mb-2">Crear Nueva Vacante</h1>
      <p class="text-on-surface-variant dark:text-slate-300 text-sm">Registra una oferta de empleo y define sus coordenadas geográficas y habilidades del catálogo.</p>
    </div>
    <VacancyForm :state="state" />
  </div>
</template>

<script setup lang="ts">
import VacancyForm from '~/components/vacancies/VacancyForm.vue';
import { useVacancyForm } from '~/composables/useVacancyForm';

useSeoMeta({
  title: "Publicar Oferta de Empleo - JobNet",
  description: "Crea una nueva vacante de reclutamiento utilizando geolocalización y el catálogo maestro",
});

const state = useVacancyForm();
</script>
