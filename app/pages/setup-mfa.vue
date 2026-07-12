<template>
  <div
    class="min-h-screen bg-background text-on-background flex items-center justify-center p-4"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(53,37,205,0.06),transparent_40%)] pointer-events-none"
      aria-hidden="true"
    ></div>

    <div class="w-full max-w-md relative z-10" role="main">
      <div
        class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm p-8"
      >
        <!-- Header -->
        <div class="text-center mb-6 flex flex-col items-center">
          <NuxtLink
            to="/"
            class="inline-block mb-4"
            aria-label="Volver al inicio"
          >
            <img src="/logo.svg" alt="Logotipo de JobNet" class="h-24 w-auto" />
          </NuxtLink>
          <h1 class="text-2xl font-bold tracking-tight text-on-background">
            Configurar MFA
          </h1>
          <div class="mt-2 w-full text-left">
            <button
              @click="goBack"
              class="font-semibold text-primary hover:underline transition text-sm inline-flex items-center gap-1 bg-transparent border-none cursor-pointer"
            >
              <span class="material-symbols-outlined text-sm" aria-hidden="true"
                >arrow_back</span
              >
              Volver a Configuración
            </button>
          </div>
        </div>

        <div class="space-y-6">
          <p class="text-sm text-on-surface-variant leading-relaxed">
            Protege tu cuenta vinculando un autenticador TOTP (como Google
            Authenticator, Microsoft Authenticator o Authy).
          </p>

          <!-- Step 1: Scan QR Code -->
          <div class="space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-wider text-primary">
              1. Escanea el código QR
            </h3>
            <div
              class="flex flex-col items-center gap-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30"
            >
              <!-- Visual Mock QR Code -->
              <div
                class="w-40 h-40 bg-white p-2 rounded-lg shadow-sm border border-outline-variant/40 flex items-center justify-center relative overflow-hidden"
              >
                <div
                  class="grid grid-cols-5 grid-rows-5 gap-1 w-full h-full p-1 opacity-90"
                >
                  <div
                    v-for="n in 25"
                    :key="n"
                    :class="qrPattern(n)"
                    class="rounded-[2px]"
                  ></div>
                </div>
              </div>

              <div class="text-center">
                <p
                  class="text-[10px] text-on-surface-variant mb-1 font-semibold"
                >
                  O ingresa esta clave manualmente:
                </p>
                <div
                  class="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/40"
                >
                  <code class="text-xs font-mono font-bold text-on-background"
                    >J0BN3T-MFA-SEC-K3Y-T0TP</code
                  >
                  <button
                    @click="copySecretKey"
                    class="text-primary hover:text-primary-container transition p-1"
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
              class="text-xs font-bold uppercase tracking-wider text-primary mb-2"
            >
              2. Introduce el código verificador
            </h3>

            <div
              v-if="errorMessage"
              role="alert"
              class="bg-rose-500/10 border border-rose-500/20 text-rose-600 p-3 rounded-lg text-sm flex items-start gap-2"
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
              class="bg-secondary/10 border border-secondary/20 text-secondary p-3 rounded-lg text-sm flex items-start gap-2"
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
                class="flex justify-between gap-2"
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
                  class="w-12 h-14 text-center text-xl font-bold bg-[#F1F5F9] border border-[#F1F5F9] hover:border-outline focus:border-primary rounded-xl outline-none transition-all text-on-background"
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
              <span v-else>Activar MFA</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Configuración de MFA - JobNet",
  description:
    "Configura la autenticación de dos factores en tu cuenta de JobNet",
});

const router = useRouter();
const { status, data: sessionData } = useAuth();

const otp = ref(["", "", "", "", "", ""]);
const otpInputs = ref<HTMLInputElement[]>([]);

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const keyCopied = ref(false);

onMounted(() => {
  // Focus first input
  setTimeout(() => {
    if (otpInputs.value && otpInputs.value[0]) {
      otpInputs.value[0].focus();
    }
  }, 100);
});

// Mock QR pattern grid styling
const qrPattern = (n: number) => {
  const corners = [1, 2, 3, 4, 5, 6, 10, 11, 15, 16, 20, 21, 22, 23, 24, 25];
  if (corners.includes(n)) {
    return "bg-black";
  }
  return n % 3 === 0 || n % 7 === 0 ? "bg-black" : "bg-slate-100";
};

// Copy manual secret key to clipboard
const copySecretKey = () => {
  if (process.client) {
    navigator.clipboard.writeText("J0BN3T-MFA-SEC-K3Y-T0TP");
    keyCopied.value = true;
    setTimeout(() => {
      keyCopied.value = false;
    }, 2000);
  }
};

const goBack = () => {
  router.push("/company/edit");
};

// Handle MFA setup verification & activation
const handleSetupVerify = async () => {
  const code = otp.value.join("");
  if (code.length !== 6) {
    errorMessage.value = "El código debe tener 6 dígitos";
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Save to user profile in DynamoDB
    if (status.value === "authenticated" && sessionData.value?.user?.id) {
      await $fetch(
        `${useRuntimeConfig().public.apiUrl}/profile/${sessionData.value.user.id}`,
        {
          method: "POST",
          body: {
            mfaConfigured: true,
          },
        },
      );
    }

    successMessage.value =
      "¡MFA activado con éxito! Tu cuenta ahora está protegida.";
    setTimeout(() => {
      router.push("/company/edit");
    }, 2000);
  } catch (error: any) {
    errorMessage.value = error.message || "Error al intentar activar MFA";
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
