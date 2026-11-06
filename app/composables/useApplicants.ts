import { useRoute, useRouter, useRuntimeConfig } from "#imports";
import { useAuth } from "#imports";
import type { ApplicantCandidate, ApplicantStage } from "~/types";
import { MOCK_VACANCIES, MOCK_APPLICANTS } from "~/utils/mockData";
import { useCvInteraction } from "~/composables/useCvInteraction";

// Global shared state for the applicants dashboard
const selectedJobId = ref("");
const myJobs = ref<Array<{ id: string; title: string }>>([]);
const allJobsList = ref<
  Array<{ id: string; title: string; empresaUuid: string }>
>([]);
const candidates = ref<ApplicantCandidate[]>([]);
const selectedCandidate = ref<ApplicantCandidate | null>(null);
const isLoading = ref(false);
const candidateDetailPanel = ref<HTMLElement | null>(null);

const selectedStageFilter = ref<ApplicantStage>("ALL");
const searchQuery = ref("");

const isMobileDetailModalOpen = ref(false);
const isPdfViewerOpen = ref(false);
const selectedPdfUrl = ref("");
const selectedPdfCandidateName = ref("");
const selectedPdfCandidateId = ref("");

export const useApplicants = () => {
  const route = useRoute();
  const router = useRouter();
  const config = useRuntimeConfig();
  const { data: session, status } = useAuth();

  const countByStatus = (st: string) => {
    return candidates.value.filter((c) => c.status === st).length;
  };

  const jobSelectOptions = computed(() => [
    { value: "", label: "Todas las vacantes publicadas", icon: "work_history" },
    ...myJobs.value.map((j) => ({ value: j.id, label: j.title, icon: "work" })),
  ]);

  const stageTabs = computed(() => [
    { id: "ALL", label: "Todas las etapas", count: candidates.value.length },
    { id: "PENDIENTE", label: "Pendientes", count: countByStatus("PENDIENTE") },
    {
      id: "EN_CONTACTO",
      label: "En Contacto",
      count: countByStatus("EN_CONTACTO"),
    },
    {
      id: "SELECCIONADO",
      label: "Seleccionados",
      count: countByStatus("SELECCIONADO"),
    },
    {
      id: "CONTRATADO",
      label: "Contratados",
      count: countByStatus("CONTRATADO"),
    },
    { id: "RECHAZADO", label: "Rechazados", count: countByStatus("RECHAZADO") },
  ]);

  const filteredCandidates = computed(() => {
    let result = candidates.value;
    if (selectedStageFilter.value !== "ALL") {
      result = result.filter((c) => c.status === selectedStageFilter.value);
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      result = result.filter((c) => {
        const nameMatch = (c.name || "").toLowerCase().includes(q);
        const emailMatch = (c.email || "").toLowerCase().includes(q);
        const skillMatch = (c.skills || []).some((s: string) =>
          s.toLowerCase().includes(q),
        );
        return nameMatch || emailMatch || skillMatch;
      });
    }
    return result;
  });

  watch(
    filteredCandidates,
    (newVal) => {
      if (newVal.length > 0) {
        const exists = newVal.find(
          (c) =>
            c.id === selectedCandidate.value?.id &&
            c.jobId === selectedCandidate.value?.jobId,
        );
        if (!exists) {
          selectedCandidate.value = newVal[0];
        }
      } else {
        selectedCandidate.value = null;
      }
    },
    { immediate: true },
  );

  const fetchMyJobs = async () => {
    if (status.value !== "authenticated") {
      router.push("/login");
      return;
    }
    const companyId = session.value?.user?.id || "";

    try {
      let allJobs = await $fetch<any[]>(`${config.public.apiUrl}/jobs`).catch(
        () => [],
      );
      if (!allJobs || allJobs.length === 0) {
        allJobs = MOCK_VACANCIES;
      }
      allJobsList.value = allJobs.map((j) => ({
        id: j.id,
        title: j.title || j.titulo || "Vacante",
        empresaUuid: j.empresaUuid,
      }));
      const matchedJobs = allJobsList.value.filter(
        (j) => j.empresaUuid === companyId,
      );
      myJobs.value = matchedJobs.length > 0 ? matchedJobs : allJobsList.value;
      if (route.query.jobId) {
        selectedJobId.value = route.query.jobId as string;
      }
      await fetchApplicants();
    } catch (e) {
      console.error("Error fetching company jobs for ATS filtering:", e);
    }
  };

  const fetchApplicants = async () => {
    isLoading.value = true;
    try {
      let jobsToFetch = myJobs.value;
      if (selectedJobId.value) {
        const selectedJob = allJobsList.value.find(
          (j) => j.id === selectedJobId.value,
        );
        jobsToFetch = selectedJob ? [selectedJob] : myJobs.value;
      }
      const aggregatedApplicants: any[] = [];
      for (const job of jobsToFetch) {
        const apps = await $fetch<any[]>(
          `${config.public.apiUrl}/jobs/${job.id}/applicants`,
        ).catch(() => []);
        for (const app of apps) {
          aggregatedApplicants.push({ ...app, jobTitle: job.title });
        }
      }
      let resolvedCandidates = await Promise.all(
        aggregatedApplicants.map(async (app) => {
          const profile = await $fetch<any>(
            `${config.public.apiUrl}/profile/${app.candidateId}`,
          ).catch(() => ({}));
          return {
            id: app.candidateId,
            name:
              profile.nombre ||
              profile.name ||
              profile.nombreComercial ||
              app.candidateName ||
              `Candidato (${app.candidateId.substring(0, 8)})`,
            email: profile.email || app.candidateEmail || app.candidateId,
            titularProfesional: profile.titularProfesional || "Sin titular",
            phone:
              profile.telefono ||
              profile.phone ||
              profile.celular ||
              "No especificado",
            bio:
              profile.bio ||
              profile.descripcion ||
              profile.resumen ||
              profile.biografia ||
              "Sin biografía ingresada.",
            skills:
              profile.habilidades ||
              profile.skills ||
              profile.habilidadesRequeridas ||
              [],
            experience: profile.experiencia || profile.experience || [],
            education: profile.educacion || profile.education || [],
            job: app.jobTitle || "Vacante",
            jobId: app.jobId,
            status: app.status || "PENDIENTE",
            coverLetter: app.coverLetter || "Sin mensaje de presentación.",
            time: new Date(app.appliedAt || Date.now()).toLocaleDateString(),
            cvUrl: profile.cvUrl || profile.pdfUrl || app.cvUrl || null,
          };
        }),
      );

      // Fallback to MOCK_APPLICANTS if no remote applicants exist
      if (resolvedCandidates.length === 0) {
        let mockFiltered = [...MOCK_APPLICANTS];
        if (selectedJobId.value) {
          mockFiltered = mockFiltered.filter(
            (c) => c.jobId === selectedJobId.value,
          );
        }
        resolvedCandidates =
          mockFiltered.length > 0 ? mockFiltered : MOCK_APPLICANTS;
      }

      candidates.value = resolvedCandidates;
      if (resolvedCandidates.length > 0) {
        const stillExists = resolvedCandidates.find(
          (c) =>
            c.id === selectedCandidate.value?.id &&
            c.jobId === selectedCandidate.value?.jobId,
        );
        selectedCandidate.value = stillExists || resolvedCandidates[0];
      } else {
        selectedCandidate.value = null;
      }
    } catch (e) {
      console.error("Error fetching job applicants:", e);
      candidates.value = MOCK_APPLICANTS;
      selectedCandidate.value = MOCK_APPLICANTS[0];
    } finally {
      isLoading.value = false;
    }
  };

  const openCandidateCv = async (
    candidate: ApplicantCandidate,
    action: "VIEW" | "DOWNLOAD" = "VIEW",
  ) => {
    if (!candidate) return;
    selectedPdfUrl.value = candidate.cvUrl || "";
    selectedPdfCandidateName.value = candidate.name || "";
    const candidateId =
      candidate.id || candidate.userId || (candidate as any).candidateId || "";
    selectedPdfCandidateId.value = candidateId;
    isPdfViewerOpen.value = true;

    if (candidateId) {
      const { notifyCvInteraction } = useCvInteraction();
      const job = myJobs.value.find((j) => j.id === candidate.jobId);
      await notifyCvInteraction(candidateId, {
        action,
        vacancyTitle:
          job?.title || candidate.jobTitle || "Vacante seleccionada",
      });
    }
  };

  return {
    selectedJobId,
    myJobs,
    allJobsList,
    candidates,
    selectedCandidate,
    isLoading,
    candidateDetailPanel,
    selectedStageFilter,
    searchQuery,
    isMobileDetailModalOpen,
    isPdfViewerOpen,
    selectedPdfUrl,
    selectedPdfCandidateName,
    selectedPdfCandidateId,
    openCandidateCv,
    countByStatus,
    jobSelectOptions,
    stageTabs,
    filteredCandidates,
    fetchMyJobs,
    fetchApplicants,
  };
};
