import { ref, computed } from "vue";
import { useJobsStore } from "~/stores/jobs";
import { useAuth } from "#imports";
import { useRuntimeConfig } from "#imports";
import { useAppFeedback } from "#imports";

export function useJobDetails(jobId: string) {
  const jobsStore = useJobsStore();
  const { data: session } = useAuth();
  const config = useRuntimeConfig();
  const { showError } = useAppFeedback();

  const loading = ref(true);

  const job = computed(() => {
    return jobsStore.jobs.find((j) => j.id === jobId);
  });

  const formatSalaryDisplay = (jobInfo: any) => {
    if (!jobInfo.salarioMin && !jobInfo.salarioMax) return null;
    const min = jobInfo.salarioMin
      ? `$${jobInfo.salarioMin.toLocaleString("es-MX")}`
      : "";
    const max = jobInfo.salarioMax
      ? `$${jobInfo.salarioMax.toLocaleString("es-MX")}`
      : "";
    if (min && max) return `${min} - ${max} MXN`;
    if (min) return `Desde ${min} MXN`;
    return `Hasta ${max} MXN`;
  };

  const showReportModal = ref(false);
  const reportReason = ref("Vacante falsa");
  const reportComments = ref("");
  const isReporting = ref(false);
  const reportSuccess = ref(false);

  const submitReport = async () => {
    if (!reportComments.value.trim()) return;
    isReporting.value = true;
    try {
      const severityMap: Record<string, string> = {
        "Vacante falsa": "alta",
        "Información engañosa": "media",
        "Contenido inapropiado": "media",
        Otro: "baja",
      };
      const infraccionMap: Record<string, string> = {
        "Vacante falsa": "fraude",
        "Información engañosa": "fraude",
        "Contenido inapropiado": "contenido",
        Otro: "otro",
      };

      const reporterEmail =
        session.value?.user?.email || "candidato.anonimo@gmail.com";

      await $fetch(`${config.public.apiUrl}/moderator/incidents`, {
        method: "POST",
        body: {
          jobId: jobId,
          jobTitle: job.value?.title || "Vacante",
          reporter: reporterEmail,
          reason: `${reportReason.value}: ${reportComments.value.trim()}`,
          severity: severityMap[reportReason.value] || "media",
          infraccion: infraccionMap[reportReason.value] || "otro",
        },
      });

      reportSuccess.value = true;
      setTimeout(() => {
        showReportModal.value = false;
        reportSuccess.value = false;
        reportComments.value = "";
      }, 2000);
    } catch (e) {
      console.error("Error creating report:", e);
      showError(
        "Error",
        "Hubo un error al enviar el reporte. Por favor, intenta de nuevo.",
      );
    } finally {
      isReporting.value = false;
    }
  };

  const loadJob = async () => {
    if (jobsStore.jobs.length === 0) {
      loading.value = true;
      await jobsStore.fetchJobs();
    }
    loading.value = false;
  };

  return {
    job,
    loading,
    formatSalaryDisplay,
    showReportModal,
    reportReason,
    reportComments,
    isReporting,
    reportSuccess,
    submitReport,
    loadJob,
  };
}
