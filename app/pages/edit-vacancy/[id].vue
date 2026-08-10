<template>
  <div
    class="max-w-2xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-on-background mb-2">Editar Vacante</h1>
      <p class="text-on-surface-variant dark:text-slate-300 text-sm">
        Modifica los campos informativos de esta vacante previamente publicada.
      </p>
    </div>
    <VacancyForm :is-edit="true" />
  </div>
</template>

<script setup lang="ts">
import VacancyForm from "~/components/vacancies/VacancyForm.vue";

useSeoMeta({
  title: "Editar Oferta de Empleo - JobNet",
  description:
    "Edita una vacante de reclutamiento utilizando geolocalización y el catálogo maestro",
});
</script>
