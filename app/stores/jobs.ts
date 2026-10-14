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
  sectores?: string[];
  pdfUrl?: string;
  createdAt?: string;
}

export const useJobsStore = defineStore("jobs", {
  state: () => ({
    jobs: [] as Job[],
    loading: false,
  }),
  actions: {
    async fetchJobs(params?: {
      q?: string;
      modalidad?: string;
      page?: number;
      limit?: number;
    }) {
      this.loading = true;
      try {
        const query: Record<string, any> = {};
        if (params?.q) query.q = params.q;
        if (params?.modalidad) query.modalidad = params.modalidad;
        if (params?.page) query.page = params.page;
        if (params?.limit) query.limit = params.limit;

        const res = await $fetch<any>("/api/jobs", { query });
        if (res && Array.isArray(res.data)) {
          this.jobs = res.data;
        } else if (Array.isArray(res)) {
          this.jobs = res;
        } else {
          this.jobs = [];
        }
      } catch (error) {
        this.jobs = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
