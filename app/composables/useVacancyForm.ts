import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute, useRuntimeConfig } from '#imports';
import { useAuth } from '#imports'; // or wherever it comes from
import { useCatalogStore } from '~/stores/catalog';
import { useUploadStore } from '~/stores/upload';
import { useAppFeedback } from '~/composables/useAppFeedback';

export interface VacancyFormState {
  title: string;
  modality: string;
  description: string;
  skills: string[];
  sectors: string[];
  aptitudes: string;
  experienceYears: number | null;
  vacantesDisponibles: number;
  maxPostulantes: number | null;
  salaryMin: number | null;
  salaryMax: number | null;
  lat: number;
  lng: number;
}

export function useVacancyForm(options: { isEdit?: boolean } = {}) {
  const router = useRouter();
  const route = useRoute();
  const config = useRuntimeConfig();
  const { data: session, status } = useAuth();
  const catalogStore = useCatalogStore();
  const { showSuccess, showError, showWarning } = useAppFeedback();

  // Form fields state
  const form = ref<VacancyFormState>({
    title: "",
    modality: "Remoto",
    description: "",
    skills: [],
    sectors: [],
    aptitudes: "",
    experienceYears: null,
    vacantesDisponibles: 1,
    maxPostulantes: null,
    salaryMin: null,
    salaryMax: null,
    lat: 19.2826,
    lng: -99.6557,
  });

  const showVacancyPdfModal = ref(false);
  const vacancyPdfPreviewUrl = ref("");
  const selectedVacancyFile = ref<File | null>(null);
  const vacancyFileInput = ref<HTMLInputElement | null>(null);

  const submitting = ref(false);
  const successMessage = ref("");
  const errorMessage = ref("");
  const companyName = ref("Empresa Corporativa");

  const skillSearchQuery = ref("");
  const sectorSearchQuery = ref("");

  const hasDraft = ref(false);
  let isRestoring = false;

  const openVacancyPdfPreview = () => {
    if (!selectedVacancyFile.value) return;
    vacancyPdfPreviewUrl.value = URL.createObjectURL(selectedVacancyFile.value);
    showVacancyPdfModal.value = true;
  };

  const triggerVacancyFileSelect = () => {
    vacancyFileInput.value?.click();
  };

  const handleVacancyFileSelect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      const isPdf =
        file.type === "application/pdf" ||
        file.type === "application/x-pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        target.value = "";
        showWarning(
          "Formato No Permitido",
          "Por favor selecciona un archivo en formato PDF.",
          4000,
        );
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        target.value = "";
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        const msg = `El archivo PDF "${file.name}" (${sizeMb} MB) supera el límite máximo permitido de 10MB.`;
        showError("Límite de Tamaño Excedido", msg, null);
        return;
      }
      selectedVacancyFile.value = file;
      showSuccess(
        "Documento Adjuntado",
        "El archivo PDF de especificaciones fue seleccionado correctamente.",
        2500,
      );
    }
  };

  const clearVacancyFile = () => {
    selectedVacancyFile.value = null;
    if (vacancyFileInput.value) vacancyFileInput.value.value = "";
  };

  const saveDraft = () => {
    if (process.client && !isRestoring && !options.isEdit) {
      const f = form.value;
      if (
        f.title ||
        f.description ||
        f.skills.length > 0 ||
        f.sectors.length > 0 ||
        f.aptitudes ||
        f.experienceYears ||
        f.salaryMin ||
        f.salaryMax
      ) {
        localStorage.setItem(
          "jobnet_draft_vacancy",
          JSON.stringify(f),
        );
      }
    }
  };

  const loadDraft = () => {
    if (process.client && !options.isEdit) {
      const saved = localStorage.getItem("jobnet_draft_vacancy");
      if (saved) {
        try {
          const draft = JSON.parse(saved);
          if (
            draft.title ||
            draft.description ||
            draft.skills?.length > 0 ||
            draft.sectors?.length > 0 ||
            draft.aptitudes
          ) {
            isRestoring = true;
            Object.assign(form.value, draft);
            hasDraft.value = true;
            isRestoring = false;
          }
        } catch (e) {
          console.error("Error loading vacancy draft:", e);
        }
      }
    }
  };

  const discardDraft = () => {
    if (process.client && !options.isEdit) {
      localStorage.removeItem("jobnet_draft_vacancy");
      hasDraft.value = false;
      isRestoring = true;
      form.value = {
        title: "",
        modality: "Remoto",
        description: "",
        skills: [],
        sectors: [],
        aptitudes: "",
        experienceYears: null,
        vacantesDisponibles: 1,
        maxPostulantes: null,
        salaryMin: null,
        salaryMax: null,
        lat: 19.2826,
        lng: -99.6557,
      };
      isRestoring = false;
    }
  };

  if (!options.isEdit) {
    watch(
      () => form.value,
      () => {
        saveDraft();
      },
      { deep: true },
    );
  }

  const filteredCatalogSkills = computed(() => {
    const query = skillSearchQuery.value.toLowerCase().trim();
    return catalogStore.skills.filter((skill) => {
      const matchesQuery = skill.name.toLowerCase().includes(query);
      const notSelectedYet = !form.value.skills.some(
        (s) => s.toLowerCase() === skill.name.toLowerCase(),
      );
      return matchesQuery && notSelectedYet;
    });
  });

  const filteredCatalogSectors = computed(() => {
    const query = sectorSearchQuery.value.toLowerCase().trim();
    return catalogStore.sectors.filter((sector) => {
      const matchesQuery = sector.name.toLowerCase().includes(query);
      const notSelectedYet = !form.value.sectors.some(
        (s) => s.toLowerCase() === sector.name.toLowerCase(),
      );
      return matchesQuery && notSelectedYet;
    });
  });

  const fetchCompanyName = async () => {
    if (status.value !== "authenticated" || !session.value?.user?.id) {
      router.push("/login");
      return;
    }

    try {
      const profile = await $fetch<any>(
        `${config.public.apiUrl}/profile/${session.value.user.id}`,
      );
      if (profile) {
        companyName.value = profile.nombre || "Empresa Corporativa";
      }
    } catch (e) {
      console.error("Error fetching company name for vacancy posting:", e);
    }
  };

  onMounted(async () => {
    await fetchCompanyName();
    await catalogStore.fetchCatalog();
    
    if (options.isEdit && route.params.id) {
      try {
        const job = await $fetch<any>(`${config.public.apiUrl}/jobs/${route.params.id}`);
        if (job) {
          form.value.title = job.title || "";
          form.value.modality = job.modalidad || "Remoto";
          form.value.description = job.descripcion || "";
          form.value.skills = job.habilidadesRequeridas || [];
          form.value.sectors = job.sectores || [];
          form.value.aptitudes = job.aptitudes || "";
          form.value.experienceYears = job.experienciaAnos || null;
          form.value.vacantesDisponibles = job.vacantesDisponibles || 1;
          form.value.maxPostulantes = job.maxPostulantes || null;
          form.value.salaryMin = job.salarioMinimo || null;
          form.value.salaryMax = job.salarioMaximo || null;
          form.value.lat = job.lat || 19.2826;
          form.value.lng = job.lng || -99.6557;
        }
      } catch (e) {
        console.error("Error loading job:", e);
        showError("Error", "No se pudo cargar la vacante", 3000);
      }
    } else {
      loadDraft();
    }
  });

  const addSkill = (skillName: string) => {
    if (!form.value.skills.some((s) => s.toLowerCase() === skillName.toLowerCase())) {
      form.value.skills.push(skillName);
    }
    skillSearchQuery.value = "";
  };

  const removeSkill = (skillName: string) => {
    form.value.skills = form.value.skills.filter((s) => s !== skillName);
  };

  const addSector = (sectorName: string) => {
    if (
      !form.value.sectors.some((s) => s.toLowerCase() === sectorName.toLowerCase())
    ) {
      form.value.sectors.push(sectorName);
    }
    sectorSearchQuery.value = "";
  };

  const removeSector = (sectorName: string) => {
    form.value.sectors = form.value.sectors.filter((s) => s !== sectorName);
  };

  const handleQuickAddSector = async () => {
    const queryName = sectorSearchQuery.value.trim();
    if (!queryName) return;
    await catalogStore.suggestSector(queryName);
    addSector(queryName);
    sectorSearchQuery.value = "";
  };

  const handleQuickAddSkill = async () => {
    const queryName = skillSearchQuery.value.trim();
    if (!queryName) return;
    await catalogStore.suggestSkill(queryName);
    addSkill(queryName);
    skillSearchQuery.value = "";
  };

  const handleSubmit = async () => {
    if (!session.value?.user?.id) return;
    if (form.value.skills.length === 0) {
      errorMessage.value = "Debes seleccionar al menos una habilidad requerida.";
      return;
    }
    if (form.value.sectors.length === 0) {
      errorMessage.value = "Debes seleccionar al menos un sector de industria.";
      return;
    }

    submitting.value = true;
    successMessage.value = "";
    errorMessage.value = "";

    try {
      let specPdfUrl = "";
      if (selectedVacancyFile.value) {
        const uploadStore = useUploadStore();
        const companyId = session.value?.user?.id || "anonymous";
        const uploadResult = await uploadStore.uploadFile(
          selectedVacancyFile.value,
          "jobs",
          companyId,
        );
        if (!uploadResult.success) {
          errorMessage.value = "Error al subir el documento PDF de especificaciones a S3.";
          submitting.value = false;
          return;
        }
        specPdfUrl = uploadResult.url;
      }

      const payload = {
        title: form.value.title,
        company: companyName.value,
        empresaUuid: session.value.user.id,
        lat: form.value.lat,
        lng: form.value.lng,
        modalidad: form.value.modality,
        salarioMinimo: form.value.salaryMin || 0,
        salarioMaximo: form.value.salaryMax || 0,
        salario: form.value.salaryMin || 0, // Fallback standard field
        descripcion: form.value.description,
        habilidadesRequeridas: form.value.skills,
        sectores: form.value.sectors,
        aptitudes: form.value.aptitudes,
        experienciaAnos: form.value.experienceYears || 0,
        vacantesDisponibles: form.value.vacantesDisponibles || 1,
        maxPostulantes: form.value.maxPostulantes || null,
        pdfUrl: specPdfUrl,
      };

      let response;
      if (options.isEdit && route.params.id) {
        response = await $fetch<any>(`${config.public.apiUrl}/jobs/${route.params.id}`, {
          method: "PUT",
          body: payload,
        });
        if (response) {
          successMessage.value = "¡Vacante de empleo actualizada con éxito!";
        }
      } else {
        response = await $fetch<any>(`${config.public.apiUrl}/jobs`, {
          method: "POST",
          body: payload,
        });
        if (response) {
          successMessage.value = "¡Vacante de empleo publicada y registrada con éxito!";
          if (process.client) {
            localStorage.removeItem("jobnet_draft_vacancy");
          }
        }
      }

      if (response) {
        form.value = {
          title: "",
          modality: "Remoto",
          description: "",
          skills: [],
          sectors: [],
          aptitudes: "",
          experienceYears: null,
          vacantesDisponibles: 1,
          maxPostulantes: null,
          salaryMin: null,
          salaryMax: null,
          lat: 19.2826,
          lng: -99.6557,
        };
        selectedVacancyFile.value = null;

        setTimeout(() => {
          router.push("/my-vacancies");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Error creating/updating vacancy:", error);
      errorMessage.value = options.isEdit ? "Ocurrió un error al intentar actualizar la vacante." : "Ocurrió un error al intentar publicar la vacante.";
    } finally {
      submitting.value = false;
    }
  };

  return {
    form,
    submitting,
    successMessage,
    errorMessage,
    hasDraft,
    showVacancyPdfModal,
    vacancyPdfPreviewUrl,
    selectedVacancyFile,
    vacancyFileInput,
    skillSearchQuery,
    sectorSearchQuery,
    filteredCatalogSkills,
    filteredCatalogSectors,
    openVacancyPdfPreview,
    triggerVacancyFileSelect,
    handleVacancyFileSelect,
    clearVacancyFile,
    discardDraft,
    addSkill,
    removeSkill,
    addSector,
    removeSector,
    handleQuickAddSector,
    handleQuickAddSkill,
    handleSubmit
  };
}
