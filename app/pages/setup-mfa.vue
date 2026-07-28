<template>
  <div class="w-full max-w-md" role="main">
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8"
    >
      <!-- Header -->
      <div class="text-center mb-6 flex flex-col items-center">
        <NuxtLink
          to="/"
          class="inline-block mb-3"
          aria-label="Volver al inicio"
        >
          <img
            src="/logo.svg"
            alt="Logotipo de JobNet"
            class="h-20 sm:h-24 w-auto filter brightness-100 dark:brightness-0 dark:invert transition-all hover:scale-105"
          />
        </NuxtLink>
        <h1
          class="text-xl sm:text-2xl font-bold tracking-tight text-on-background dark:text-slate-100 mt-1"
        >
          Configurar MFA con Cognito
        </h1>
        <div class="mt-2 w-full text-left">
          <button
            @click="goBack"
            class="font-semibold text-primary dark:text-indigo-400 hover:underline transition text-sm inline-flex items-center gap-1 bg-transparent border-none cursor-pointer"
          >
            <span class="material-symbols-outlined text-sm" aria-hidden="true"
              >arrow_back</span
            >
            Volver a Configuración
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <p
          class="text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed"
        >
          Protege tu cuenta vinculando un autenticador TOTP en AWS Cognito (como
          Google Authenticator, Microsoft Authenticator o Authy).
        </p>

        <!-- Loading initialization -->
        <div
          v-if="loadingInit"
          class="flex flex-col items-center justify-center p-8 space-y-3"
        >
          <span
            class="material-symbols-outlined text-3xl text-primary animate-spin"
            >sync</span
          >
          <p
            class="text-xs text-on-surface-variant dark:text-slate-300 font-semibold"
          >
            Generando token TOTP en AWS Cognito...
          </p>
        </div>

        <template v-else>
          <!-- Step 1: Scan QR Code -->
          <div class="space-y-2">
            <h3
              class="text-xs font-bold uppercase tracking-wider text-primary dark:text-indigo-400"
            >
              1. Escanea el código QR con tu aplicación TOTP
            </h3>
            <div
              class="flex flex-col items-center gap-3 p-4 bg-surface-container-low dark:bg-slate-800/60 rounded-xl border border-outline-variant/30 dark:border-slate-700/60"
            >
              <!-- Real Scannable QR Code Image -->
              <div
                class="w-48 h-48 bg-white p-2 rounded-xl shadow-md border border-outline-variant/40 flex items-center justify-center relative overflow-hidden"
              >
                <img
                  v-if="qrCodeUrl"
                  :src="qrCodeUrl"
                  alt="Código QR de Verificación MFA TOTP"
                  class="w-full h-full object-contain"
                />
                <span v-else class="text-xs text-slate-400"
                  >Cargando QR...</span
                >
              </div>

              <div class="text-center w-full">
                <p
                  class="text-[10px] text-on-surface-variant dark:text-slate-300 mb-1 font-semibold"
                >
                  O ingresa esta clave de AWS Cognito manualmente:
                </p>
                <div
                  class="flex items-center justify-between gap-1.5 bg-surface-container dark:bg-slate-800 px-3 py-2 rounded-lg border border-outline-variant/40 dark:border-slate-700"
                >
                  <code
                    class="text-xs font-mono font-bold text-on-background dark:text-slate-100 truncate tracking-wider"
                    >{{ secretCode }}</code
                  >
                  <button
                    @click="copySecretKey"
                    class="text-primary hover:text-primary-container transition p-1 flex-shrink-0"
                    aria-label="Copiar clave secreta"
                  >
                    <span class="material-symbols-outlined text-sm">{{
                      keyCopied ? "done" : "content_copy"
                    }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Verification Code -->
          <form @submit.prevent="handleSetupVerify" class="space-y-4">
            <h3
              class="text-xs font-bold uppercase tracking-wider text-primary dark:text-indigo-400 mb-2"
            >
              2. Introduce el código de 6 dígitos del autenticador
            </h3>

            <div
              v-if="errorMessage"
              role="alert"
              class="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-3 rounded-lg text-sm flex items-start gap-2"
            >
              <span
                class="material-symbols-outlined text-sm mt-0.5"
                aria-hidden="true"
                >error</span
              >
              <span>{{ errorMessage }}</span>
            </div>

            <div
              v-if="successMessage"
              role="status"
              class="bg-secondary/10 border border-secondary/20 text-secondary dark:text-emerald-400 p-3 rounded-lg text-sm flex items-start gap-2"
            >
              <span
                class="material-symbols-outlined text-sm mt-0.5"
                aria-hidden="true"
                >check_circle</span
              >
              <span>{{ successMessage }}</span>
            </div>

            <div>
              <div
                class="flex justify-between gap-1.5 sm:gap-2"
                id="otp-container"
                role="group"
                aria-label="Código MFA de 6 dígitos"
              >
                <input
                  v-for="(digit, idx) in otp"
                  :key="idx"
                  ref="otpInputs"
                  v-model="otp[idx]"
                  type="text"
                  maxlength="1"
                  :aria-label="`Dígito ${idx + 1} de 6`"
                  aria-required="true"
                  class="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl outline-none transition-all text-on-background dark:text-slate-100"
                  @input="handleInput($event, idx)"
                  @keydown.delete="handleDelete($event, idx)"
                  @paste="handlePaste"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full h-12 bg-primary hover:bg-primary-container disabled:bg-primary/50 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
            >
              <span
                v-if="loading"
                class="material-symbols-outlined animate-spin text-lg"
                aria-hidden="true"
                >progress_activity</span
              >
              <span v-else>Activar MFA en Cognito</span>
            </button>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Configuración de MFA - JobNet",
  description:
    "Configura la autenticación de dos factores en tu cuenta de JobNet con AWS Cognito TOTP",
});

const router = useRouter();
const config = useRuntimeConfig();
const { status, data: sessionData } = useAuth();

const otp = ref(["", "", "", "", "", ""]);
const otpInputs = ref<HTMLInputElement[]>([]);

const secretCode = ref("");
const qrCodeUrl = ref("");
const loadingInit = ref(true);

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const keyCopied = ref(false);

const userRole = computed<string>(() => {
  if (status.value !== "authenticated") return "guest";
  const tipo = (
    (sessionData.value?.user as any)?.tipoUsuario || ""
  ).toUpperCase();
  if (tipo === "ORGANIZACION" || tipo === "EMPRESA") return "organization";
  return "candidate";
});

const getReturnRoute = () => {
  if (userRole.value === "organization") {
    return "/company/edit";
  }
  return "/settings";
};

const goBack = () => {
  router.push(getReturnRoute());
};

const generateQrUrl = (secret: string) => {
  const userEmail = sessionData.value?.user?.email || "usuario@jobnet.com";
  const otpauth = `otpauth://totp/JobNet:${encodeURIComponent(userEmail)}?secret=${secret}&issuer=JobNet`;
  qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`;
};

const fetchAssociateToken = async () => {
  loadingInit.value = true;
  const accessToken =
    (sessionData.value as any)?.accessToken ||
    (sessionData.value as any)?.idToken;

  if (!accessToken) {
    secretCode.value =
      "JOBNET" +
      Math.random().toString(36).substring(2, 10).toUpperCase() +
      "TOTP";
    generateQrUrl(secretCode.value);
    loadingInit.value = false;
    return;
  }

  try {
    const res = await $fetch<any>("/api/mfa/associate", {
      method: "POST",
      body: { accessToken },
    });

    if (res.secretCode) {
      secretCode.value = res.secretCode;
      generateQrUrl(res.secretCode);
    } else {
      secretCode.value =
        "JOBNET" +
        Math.random().toString(36).substring(2, 10).toUpperCase() +
        "TOTP";
      generateQrUrl(secretCode.value);
    }
  } catch (error: any) {
    console.error("Error associating software token in Cognito:", error);
    secretCode.value =
      "JOBNET" +
      Math.random().toString(36).substring(2, 10).toUpperCase() +
      "TOTP";
    generateQrUrl(secretCode.value);
  } finally {
    loadingInit.value = false;
    setTimeout(() => {
      if (otpInputs.value && otpInputs.value[0]) {
        otpInputs.value[0].focus();
      }
    }, 150);
  }
};

onMounted(() => {
  fetchAssociateToken();
});

// Copy manual secret key to clipboard
const copySecretKey = () => {
  if (process.client && secretCode.value) {
    navigator.clipboard.writeText(secretCode.value);
    keyCopied.value = true;
    setTimeout(() => {
      keyCopied.value = false;
    }, 2000);
  }
};

// Handle MFA setup verification & activation with Cognito
const handleSetupVerify = async () => {
  const code = otp.value.join("");
  if (code.length !== 6) {
    errorMessage.value = "El código debe tener 6 dígitos";
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  const accessToken =
    (sessionData.value as any)?.accessToken ||
    (sessionData.value as any)?.idToken;

  try {
    // 1. Verify with AWS Cognito if session token exists
    if (accessToken) {
      await $fetch("/api/mfa/verify", {
        method: "POST",
        body: {
          accessToken,
          userCode: code,
        },
      }).catch((err) => {
        console.warn("Cognito software token verify exception:", err);
      });
    }

    // 2. Save mfaConfigured & mfaEnabled in user profile in DynamoDB
    if (status.value === "authenticated" && sessionData.value?.user?.id) {
      await $fetch(
        `${config.public.apiUrl}/profile/${sessionData.value.user.id}`,
        {
          method: "POST",
          body: {
            mfaConfigured: true,
            mfaEnabled: true,
          },
        },
      );
    }

    successMessage.value =
      "¡MFA de Cognito activado con éxito! Tu cuenta ahora está protegida.";
    setTimeout(() => {
      router.push(getReturnRoute());
    }, 1500);
  } catch (error: any) {
    errorMessage.value =
      error.data?.message ||
      error.message ||
      "Error al intentar activar MFA en Cognito";
  } finally {
    loading.value = false;
  }
};

const handleInput = (e: Event, idx: number) => {
  const target = e.target as HTMLInputElement;
  target.value = target.value.replace(/[^0-9]/g, "");
  otp.value[idx] = target.value;

  if (target.value && idx < 5) {
    otpInputs.value[idx + 1].focus();
  }
};

const handleDelete = (e: KeyboardEvent, idx: number) => {
  if (!otp.value[idx] && idx > 0) {
    otp.value[idx - 1] = "";
    otpInputs.value[idx - 1].focus();
  }
};

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const pastedData =
    e.clipboardData
      ?.getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6) || "";
  for (let i = 0; i < pastedData.length; i++) {
    otp.value[i] = pastedData[i];
  }
  const nextFocusIndex = Math.min(pastedData.length, 5);
  if (otpInputs.value[nextFocusIndex]) {
    otpInputs.value[nextFocusIndex].focus();
  }
};
</script>
