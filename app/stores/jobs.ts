import { defineStore } from 'pinia'

export const useJobsStore = defineStore('jobs', {
  state: () => ({
    jobs: [] as Array<{ id: string; title: string; company: string; lat: number; lng: number }>,
    loading: false
  }),
  actions: {
    async fetchJobs() {
      this.loading = true
      try {
        const data = await $fetch<any[]>('/api/jobs')
        this.jobs = data
      } catch (error) {
        this.jobs = []
      } finally {
        this.loading = false
      }
    }
  }
})
