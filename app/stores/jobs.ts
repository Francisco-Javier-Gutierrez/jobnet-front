import { defineStore } from "pinia";
import { MOCK_VACANCIES } from "~/utils/mockData";

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
        const { isMockEnabled } = useMockSession();
        if (isMockEnabled.value) {
          let list = [...MOCK_VACANCIES];
          if (params?.q) {
            const q = params.q.toLowerCase();
            list = list.filter(
              (j) =>
                j.title.toLowerCase().includes(q) ||
                j.company.toLowerCase().includes(q),
            );
          }
          if (params?.modalidad) {
            const m = params.modalidad.toLowerCase();
            list = list.filter((j) =>
              (j.modalidad || "").toLowerCase().includes(m),
            );
          }
          this.jobs = list as Job[];
          return;
        }

        const query: Record<string, any> = {};
        if (params?.q) query.q = params.q;
        if (params?.modalidad) query.modalidad = params.modalidad;
        if (params?.page) query.page = params.page;
        if (params?.limit) query.limit = params.limit;

        const config = useRuntimeConfig();
        const baseUrl = config.public.apiUrl || "";
        const targetUrl = baseUrl ? `${baseUrl}/jobs` : "/api/jobs";
        const res = await $fetch<any>(targetUrl, { query });
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
