<template>
  <div
    class="max-w-xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-on-background mb-2">Crear Nuevo</h1>
      <p class="text-on-surface-variant dark:text-slate-300 text-sm">
        Comparte contenido con la comunidad profesional o registra una vacante
        en JobNet.
      </p>
    </div>

    <!-- Company Selector Options -->
    <div
      v-if="userRole === 'company' && !selectedCreationType"
      class="space-y-4"
    >
      <h2 class="text-sm font-bold text-on-background mb-4">
        ¿Qué deseas crear hoy?
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Option 1: Post -->
        <button
          @click="selectCreationType('post')"
          class="flex flex-col items-center justify-center p-6 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 hover:border-primary rounded-2xl text-center group transition active:scale-[0.98] duration-150 shadow-sm"
        >
          <div
            class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition"
          >
            <span class="material-symbols-outlined text-[28px]">forum</span>
          </div>
          <span class="text-sm font-bold text-on-background mb-1"
            >Publicación de Comunidad</span
          >
          <span
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
          >
            Comparte fotos, archivos PDF, novedades y noticias con la comunidad.
          </span>
        </button>

        <!-- Option 2: Vacancy -->
        <button
          @click="selectCreationType('vacancy')"
          class="flex flex-col items-center justify-center p-6 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 hover:border-primary rounded-2xl text-center group transition active:scale-[0.98] duration-150 shadow-sm"
        >
          <div
            class="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition"
          >
            <span class="material-symbols-outlined text-[28px]"
              >business_center</span
            >
          </div>
          <span class="text-sm font-bold text-on-background mb-1"
            >Oferta de Empleo (Vacante)</span
          >
          <span
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
          >
            Publica una nueva oferta laboral con geolocalización y habilidades
            requeridas.
          </span>
        </button>
      </div>
    </div>

    <!-- Back Button when Company is writing a post -->
    <div
      v-if="userRole === 'company' && selectedCreationType === 'post'"
      class="mb-4"
    >
      <button
        @click="selectedCreationType = null"
        class="flex items-center gap-1 text-xs text-primary font-bold hover:underline"
      >
        <span class="material-symbols-outlined text-sm">arrow_back</span>
        Volver a las opciones
      </button>
    </div>

    <!-- Creator Form Container (Visible for candidates/moderators/admins OR when company selects 'post') -->
    <div
      v-if="userRole !== 'company' || selectedCreationType === 'post'"
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 shadow-sm space-y-6"
    >
      <!-- Title -->
      <div
        class="border-b border-outline-variant/30 pb-3 flex items-center justify-between"
      >
        <h3 class="text-sm font-bold text-on-background">Crear Publicación</h3>
        <span
          class="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full capitalize"
        >
          Muro de Comunidad
        </span>
      </div>

      <!-- Textarea Input -->
      <div class="flex gap-3">
        <div
          class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shadow-inner flex-shrink-0 overflow-hidden"
        >
          <img
            v-if="
              (session?.user as any)?.fotoPerfil ||
              (session?.user as any)?.avatarUrl
            "
            :src="
              (session?.user as any)?.fotoPerfil ||
              (session?.user as any)?.avatarUrl
            "
            :alt="session?.user?.name || 'Avatar'"
            class="w-full h-full object-cover"
          />
          <span v-else>
            {{
              session?.user?.name
                ? session.user.name.charAt(0).toUpperCase()
                : "U"
            }}
          </span>
        </div>

        <textarea
          v-model="newPostContent"
          placeholder="¿Qué quieres compartir con la comunidad hoy?"
          rows="4"
          class="w-full bg-transparent text-sm text-on-background outline-none py-1 placeholder-on-surface-variant/50 resize-none font-sans"
          aria-label="Contenido de la publicación"
        ></textarea>
      </div>

      <!-- Previews -->
      <!-- Image Preview -->
      <div
        v-if="previewImage"
        class="relative rounded-xl overflow-hidden border border-outline-variant/30 max-h-[300px] flex items-center justify-center bg-surface-container-low/50"
      >
        <img
          :src="previewImage"
          alt="Vista previa de imagen"
          class="max-w-full max-h-[300px] object-contain"
        />
        <button
          @click="clearAttachment"
          type="button"
          class="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition flex items-center justify-center"
          title="Quitar imagen"
        >
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <!-- PDF Preview -->
      <AppFileAttachment
        v-if="previewPdf"
        :name="previewPdfName"
        type="pdf"
        :show-preview="true"
        :show-remove="true"
        @preview="showPdfModal = true"
        @remove="clearAttachment"
      />

      <!-- Footer Actions -->
      <div
        class="flex items-center justify-between border-t border-outline-variant/30 pt-4"
      >
        <div class="flex gap-2">
          <!-- Add Image -->
          <button
            @click="triggerImageSelect"
            type="button"
            class="p-2 text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl transition flex items-center gap-1"
            title="Añadir Imagen"
          >
            <span class="material-symbols-outlined text-[20px]">image</span>
            <span class="text-xs font-bold font-sans">Imagen</span>
          </button>
          <input
            type="file"
            accept="image/*"
            ref="imageInput"
            @change="handleImageSelect"
            class="hidden"
          />

          <!-- Add PDF -->
          <button
            @click="triggerPdfSelect"
            type="button"
            class="p-2 text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl transition flex items-center gap-1"
            title="Añadir Documento PDF"
          >
            <span class="material-symbols-outlined text-[20px]"
              >picture_as_pdf</span
            >
            <span class="text-xs font-bold font-sans">PDF</span>
          </button>
          <input
            type="file"
            accept=".pdf"
            ref="pdfInput"
            @change="handlePdfSelect"
            class="hidden"
          />
        </div>

        <div class="flex gap-2">
          <button
            @click="goToPreview"
            type="button"
            :disabled="
              !newPostContent.trim() && !selectedImageFile && !selectedPdfFile
            "
            class="bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant font-bold text-xs px-4 py-2.5 rounded-xl transition font-sans flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="material-symbols-outlined text-sm">visibility</span>
            <span class="hidden sm:inline">Previsualizar</span>
          </button>

          <button
            @click="publishPost"
            type="button"
            :disabled="!newPostContent.trim() || isPublishing"
            class="bg-primary hover:bg-primary-container text-white disabled:bg-primary/40 font-bold text-xs px-6 py-2.5 rounded-xl transition font-sans flex items-center gap-1.5"
          >
            <span
              v-if="isPublishing"
              class="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"
            ></span>
            {{ isPublishing ? "Publicando..." : "Publicar" }}
          </button>
        </div>
      </div>
    </div>

    <AppPdfPreviewModal
      v-model="showPdfModal"
      :url="previewPdf || ''"
      :file-name="previewPdfName"
      :title="'Vista Previa de ' + previewPdfName"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUploadStore } from "~/stores/upload";
import { usePreviewStore } from "~/stores/preview";

useSeoMeta({
  title: "Crear Nuevo - JobNet",
  description:
    "Crea y comparte una publicación en el muro de comunidad o registra una oferta de empleo.",
});

const router = useRouter();
const { data: session, status } = useAuth();

const userRole = computed<string>(() => {
  if (status.value !== "authenticated") return "guest";
  const user = session.value?.user as any;
  const tipo = (user?.tipoUsuario || user?.role || "").toUpperCase();
  if (tipo === "ORGANIZACION" || tipo === "EMPRESA") return "company";
  if (tipo === "ADMIN") return "admin";
  if (tipo === "MODERATOR" || tipo === "MODERADOR") return "moderator";
  return "candidate";
});

// Company specific switcher: 'post' | 'vacancy'
const selectedCreationType = ref<"post" | "vacancy" | null>(null);

const selectCreationType = (type: "post" | "vacancy") => {
  if (type === "vacancy") {
    // Redirect companies to vacancy form directly
    router.push("/create-vacancy");
  } else {
    selectedCreationType.value = "post";
  }
};

const { showError, showWarning } = useAppFeedback();

// State for post creation
const isPublishing = ref(false);
const showPdfModal = ref(false);
const selectedImageFile = ref<File | null>(null);
const selectedPdfFile = ref<File | null>(null);
const newPostContent = ref("");
const previewImage = ref<string | null>(null);
const previewPdf = ref<string | null>(null);
const previewPdfName = ref("");
const imageInput = ref<HTMLInputElement | null>(null);
const pdfInput = ref<HTMLInputElement | null>(null);

const previewStore = usePreviewStore();

const mockPostPreview = computed(() => {
  const authorAvatar =
    (session.value?.user as any)?.fotoPerfil ||
    (session.value?.user as any)?.avatarUrl ||
    (session.value?.user as any)?.avatar ||
    undefined;

  let role = "Candidato";
  const userType = (
    (session.value?.user as any)?.tipoUsuario || ""
  ).toUpperCase();
  if (userType === "EMPRESA" || userType === "ORGANIZACION") {
    role = "Organización";
  }

  return {
    uniqueId: "preview-only",
    author: session.value?.user?.name || "Usuario JobNet",
    authorAvatar,
    fotoPerfil: authorAvatar,
    role,
    createdAt: new Date().toISOString(),
    content: newPostContent.value.trim() || "...",
    media: previewImage.value || undefined,
    pdfUrl: previewPdf.value || undefined,
    pdfName: previewPdfName.value || undefined,
    likesList: [],
    comments: [],
    sharesCount: 0,
    bookmarksCount: 0,
  };
});

const goToPreview = () => {
  const draft = {
    newPostContent: newPostContent.value,
    selectedImageFile: selectedImageFile.value,
    selectedPdfFile: selectedPdfFile.value,
    previewImage: previewImage.value,
    previewPdf: previewPdf.value,
    previewPdfName: previewPdfName.value,
  };
  previewStore.setPreviewPost(mockPostPreview.value, draft);
  router.push("/preview/post");
};

onMounted(() => {
  if (previewStore.postDraft) {
    newPostContent.value = previewStore.postDraft.newPostContent;
    selectedImageFile.value = previewStore.postDraft.selectedImageFile;
    selectedPdfFile.value = previewStore.postDraft.selectedPdfFile;
    previewImage.value = previewStore.postDraft.previewImage;
    previewPdf.value = previewStore.postDraft.previewPdf;
    previewPdfName.value = previewStore.postDraft.previewPdfName;
  }
});

const triggerImageSelect = () => {
  imageInput.value?.click();
};

const handleImageSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      target.value = "";
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      showError(
        "Límite de Tamaño Excedido",
        `La imagen "${file.name}" (${sizeMb} MB) supera el límite máximo permitido de 5MB.`,
        null,
      );
      return;
    }
    selectedImageFile.value = file;
    previewImage.value = URL.createObjectURL(file);

    // Clear PDF
    selectedPdfFile.value = null;
    previewPdf.value = null;
    previewPdfName.value = "";
  }
};

const triggerPdfSelect = () => {
  pdfInput.value?.click();
};

const handlePdfSelect = (e: Event) => {
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
      showError(
        "Límite de Tamaño Excedido",
        `El archivo PDF "${file.name}" (${sizeMb} MB) supera el límite máximo permitido de 10MB.`,
        null,
      );
      return;
    }
    selectedPdfFile.value = file;
    previewPdf.value = URL.createObjectURL(file);
    previewPdfName.value = file.name;

    // Clear Image
    selectedImageFile.value = null;
    previewImage.value = null;
  }
};

const clearAttachment = () => {
  selectedImageFile.value = null;
  selectedPdfFile.value = null;
  previewImage.value = null;
  previewPdf.value = null;
  previewPdfName.value = "";
  if (imageInput.value) imageInput.value.value = "";
  if (pdfInput.value) pdfInput.value.value = "";
};

// Publish Post with AWS Presigned S3 uploads
const publishPost = async () => {
  if (!newPostContent.value.trim()) return;
  isPublishing.value = true;

  let mediaUrl = "";
  let pdfUrl = "";

  const uploadStore = useUploadStore();
  const userId = session.value?.user?.id || "anonymous";

  // 1. Upload image to S3 if selected
  if (selectedImageFile.value) {
    const res = await uploadStore.uploadFile(
      selectedImageFile.value,
      "posts",
      userId,
    );
    if (res.success) {
      mediaUrl = res.url;
    } else {
      showError("Error", "Error al subir la imagen a AWS S3: " + res.error);
      isPublishing.value = false;
      return;
    }
  }

  // 2. Upload PDF to S3 if selected
  if (selectedPdfFile.value) {
    const res = await uploadStore.uploadFile(
      selectedPdfFile.value,
      "posts",
      userId,
    );
    if (res.success) {
      pdfUrl = res.url;
    } else {
      showError(
        "Error",
        "Error al subir el archivo PDF a AWS S3: " + res.error,
      );
      isPublishing.value = false;
      return;
    }
  }

  const author = session.value?.user?.name || "Usuario JobNet";
  const authorAvatar =
    (session.value?.user as any)?.fotoPerfil ||
    (session.value?.user as any)?.avatarUrl ||
    (session.value?.user as any)?.avatar ||
    undefined;

  let role = "Candidato";
  const userType = (
    (session.value?.user as any)?.tipoUsuario || ""
  ).toUpperCase();
  if (userType === "EMPRESA" || userType === "ORGANIZACION") {
    role = "Organización";
  } else {
    role = "Candidato";
  }

  const newPostPayload = {
    author,
    role,
    authorUuid: userId,
    authorAvatar: authorAvatar || undefined,
    fotoPerfil: authorAvatar || undefined,
    content: newPostContent.value.trim(),
    media: mediaUrl || undefined,
    pdfUrl: pdfUrl || undefined,
    pdfName: previewPdfName.value || undefined,
  };

  try {
    await $fetch("/api/posts", {
      method: "POST",
      body: newPostPayload,
    });
  } catch (e: any) {
    console.error("Error creating post on server:", e);
    const serverMsg =
      e?.data?.error ||
      e?.response?._data?.error ||
      "Error al publicar en el servidor de AWS.";
    showError("Publicación rechazada", serverMsg);
    isPublishing.value = false;
    return;
  }

  // Reset fields
  newPostContent.value = "";
  clearAttachment();
  isPublishing.value = false;

  // Navigate to home page to see the new post in the feed
  router.push("/");
};
</script>
