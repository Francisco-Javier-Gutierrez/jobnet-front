import { ref, computed } from "vue";
import { useRuntimeConfig, navigateTo } from "#imports";
import { useAuth } from "#imports";
import { useAppFeedback } from "#imports";

export function useJobApplication(jobId: string, jobRef: any) {
  const config = useRuntimeConfig();
  const { data: session, status } = useAuth();
  const { showInfo, showError, showWarning } = useAppFeedback();

  const profileCvUrl = ref("");
  const profileCvName = ref("");
  const showMissingCvModal = ref(false);
  const candidateProfile = ref<any>(null);
  const coverLetterInput = ref("");
  const selectedProfileLinks = ref<string[]>([]);
  const selectedProfileDocs = ref<string[]>([]);

  const isApplying = ref(false);
  const hasApplied = ref(false);

  const candidateProfileLinks = computed(() => {
    if (!candidateProfile.value) return [];
    const links: { label: string; url: string }[] = [];
    const p = candidateProfile.value;
    if (p.linkedin) links.push({ label: "LinkedIn", url: p.linkedin });
    if (p.github) links.push({ label: "GitHub", url: p.github });
    if (p.portfolioUrl || p.sitioWeb || p.website) {
      links.push({
        label: "Portafolio / Web",
        url: p.portfolioUrl || p.sitioWeb || p.website,
      });
    }
    if (Array.isArray(p.links)) {
      p.links.forEach((l: any) => {
        if (typeof l === "string") links.push({ label: "Enlace", url: l });
        else if (l.url) links.push({ label: l.nombre || "Enlace", url: l.url });
      });
    }
    return links;
  });

  const candidateProfileDocs = computed(() => {
    if (!candidateProfile.value) return [];
    const docs: { name: string; url: string }[] = [];
    const p = candidateProfile.value;
    if (Array.isArray(p.documentosAdicionales)) {
      p.documentosAdicionales.forEach((d: any) => {
        if (d.url)
          docs.push({ name: d.nombre || d.name || "Documento", url: d.url });
      });
    }
    if (Array.isArray(p.certificados)) {
      p.certificados.forEach((c: any) => {
        if (c.url || c.pdfUrl)
          docs.push({
            name: c.titulo || c.name || "Certificado",
            url: c.url || c.pdfUrl,
          });
      });
    }
    return docs;
  });

  const fetchCandidateProfile = async () => {
    if (status.value !== "authenticated" || !session.value?.user?.id) return;
    try {
      const headers: Record<string, string> = {};
      if ((session.value as any)?.idToken) {
        headers.Authorization = `Bearer ${(session.value as any).idToken}`;
      } else if ((session.value as any)?.accessToken) {
        headers.Authorization = `Bearer ${(session.value as any).accessToken}`;
      }
      const profile = await $fetch<any>(
        `${config.public.apiUrl}/profile/${session.value.user.id}`,
        { headers },
      );
      candidateProfile.value = profile;
      const foundCv =
        profile?.cvUrl ||
        profile?.documentosProfesionales?.cvUrl ||
        profile?.cvPath ||
        profile?.curriculumUrl ||
        "";

      if (profile && foundCv) {
        profileCvUrl.value = foundCv;
        profileCvName.value =
          profile.cvFileName ||
          profile.documentosProfesionales?.cvFileName ||
          "Mi_Curriculum_Vitae.pdf";
      } else {
        profileCvUrl.value = "";
        profileCvName.value = "";
      }
    } catch (e) {
      console.error("Error fetching candidate profile for easy apply:", e);
    }
  };

  const handleEasyApplyClick = () => {
    if (status.value !== "authenticated") {
      navigateTo(
        "/login?redirect=" + encodeURIComponent(window.location.pathname),
      );
      return;
    }
    if (!profileCvUrl.value) {
      showMissingCvModal.value = true;
      return;
    }
    submitEasyApplication();
  };

  const submitEasyApplication = async () => {
    if (!profileCvUrl.value) {
      showMissingCvModal.value = true;
      return;
    }
    isApplying.value = true;

    try {
      const headers: Record<string, string> = {};
      if ((session.value as any)?.idToken) {
        headers.Authorization = `Bearer ${(session.value as any).idToken}`;
      } else if ((session.value as any)?.accessToken) {
        headers.Authorization = `Bearer ${(session.value as any).accessToken}`;
      }

      const candidateId = session.value?.user?.id;
      const candidateName = session.value?.user?.name || "Candidato";

      let finalMessage = coverLetterInput.value.trim()
        ? coverLetterInput.value.trim()
        : `Hola, mi nombre es ${candidateName}. Me complace presentar mi candidatura a la vacante de ${jobRef.value?.title || "Empleo"} en ${jobRef.value?.company || "su organización"}. Adjunto mi Currículum Vitae cargado en mi perfil.`;

      if (selectedProfileLinks.value.length > 0) {
        finalMessage +=
          `\n\n🔗 Enlaces profesionales adjuntos:\n` +
          selectedProfileLinks.value.map((l) => `• ${l}`).join("\n");
      }
      if (selectedProfileDocs.value.length > 0) {
        finalMessage +=
          `\n\n📄 Documentos/Certificados adicionales adjuntos:\n` +
          selectedProfileDocs.value.map((d) => `• ${d}`).join("\n");
      }

      await $fetch(`${config.public.apiUrl}/jobs/${jobId}/apply`, {
        method: "POST",
        headers,
        body: {
          candidateId,
          coverLetter: finalMessage,
          cvUrl: profileCvUrl.value,
          cvFileName: profileCvName.value,
        },
      });

      hasApplied.value = true;
      if (process.client) {
        localStorage.setItem(`job-applied-${jobId}`, "true");
      }

      navigateTo(`/messages?jobId=${jobId}&candidateId=${candidateId}`);
    } catch (e: any) {
      console.error("Error submitting application:", e);
      showInfo(
        "Notificación",
        "Hubo un inconveniente al registrar la postulación. Intenta nuevamente.",
      );
    } finally {
      isApplying.value = false;
    }
  };

  const checkAppliedStatus = () => {
    if (process.client) {
      hasApplied.value =
        localStorage.getItem(`job-applied-${jobId}`) === "true";
    }
  };

  return {
    profileCvUrl,
    profileCvName,
    showMissingCvModal,
    candidateProfile,
    coverLetterInput,
    selectedProfileLinks,
    selectedProfileDocs,
    candidateProfileLinks,
    candidateProfileDocs,
    isApplying,
    hasApplied,
    fetchCandidateProfile,
    handleEasyApplyClick,
    submitEasyApplication,
    checkAppliedStatus,
    session,
    status,
  };
}
