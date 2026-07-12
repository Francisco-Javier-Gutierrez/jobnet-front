import { defineStore } from "pinia";

export interface Job {
  id: string;
  title: string;
  company: string;
  empresaUuid?: string;
  lat: number;
  lng: number;
  modalidad?: string;
  descripcion?: string;
  habilidadesRequeridas?: string[];
  aptitudes?: string;
  salario?: number;
  salarioMinimo?: number;
  salarioMaximo?: number;
  experienciaAnos?: number;
  sector?: string;
  createdAt?: string;
}

export const useJobsStore = defineStore("jobs", {
  state: () => ({
    jobs: [] as Job[],
    loading: false,
  }),
  actions: {
    async fetchJobs() {
      this.loading = true;
      try {
        const data = await $fetch<any[]>("/api/jobs");
        this.jobs = data;
      } catch (error) {
        this.jobs = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
