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
        <div class="text-center mb-8 flex flex-col items-center">
          <NuxtLink
            to="/"
            class="inline-block mb-4"
            aria-label="Volver al inicio"
          >
            <img src="/logo.svg" alt="Logotipo de JobNet" class="h-12 w-auto" />
          </NuxtLink>
          <h1 class="text-2xl font-bold tracking-tight text-on-background">
            Autenticación de dos factores
          </h1>
          <div class="mt-3 w-full text-left">
            <NuxtLink
              to="/login"
              class="font-semibold text-primary hover:underline transition text-sm inline-flex items-center gap-1"
              aria-label="Volver a la pantalla de inicio de sesión"
            >
              <span class="material-symbols-outlined text-sm" aria-hidden="true"
                >arrow_back</span
              >
              Volver al inicio de sesión
            </NuxtLink>
          </div>
        </div>

        <form @submit.prevent="handleVerify" class="space-y-6">
          <div
            v-if="errorMessage"
            id="mfa-error"
            role="alert"
            aria-live="assertive"
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
            id="mfa-success"
            role="status"
            aria-live="polite"
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
            <p
              class="block text-xs font-semibold tracking-wider text-on-surface-variant mb-2"
            >
              Ingrese su código MFA
            </p>
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
                :aria-invalid="!!errorMessage"
                :aria-describedby="
                  errorMessage
                    ? 'mfa-error'
                    : successMessage
                      ? 'mfa-success'
                      : undefined
                "
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
            :aria-busy="loading"
            class="w-full h-12 bg-primary hover:bg-primary-container disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center justify-center gap-2 transition shadow-sm hover:shadow"
          >
            <span
              v-if="loading"
              class="material-symbols-outlined animate-spin text-lg"
              aria-hidden="true"
              >progress_activity</span
            >
            <span v-else>Verificar</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <a
            href="#"
            class="text-xs text-on-surface-variant hover:text-primary hover:underline transition"
            aria-label="Contactar con el soporte técnico para resolver problemas con el token MFA"
          >
            ¿Problemas con tu token? Contactar soporte
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Verificación de Dos Factores - JobNet",
  description:
    "Verifica tu identidad con autenticación de dos factores en JobNet",
});

const route = useRoute();
const router = useRouter();

const email = ref((route.query.email as string) || "");
const challenge = ref((route.query.challenge as string) || "");
const session = ref((route.query.session as string) || "");

const otp = ref(["", "", "", "", "", ""]);
const otpInputs = ref<HTMLInputElement[]>([]);

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

onMounted(() => {
  if (!email.value || !challenge.value || !session.value) {
    errorMessage.value = "Información de sesión de MFA incompleta";
  }
  // Focus first input
  setTimeout(() => {
    if (otpInputs.value && otpInputs.value[0]) {
      otpInputs.value[0].focus();
    }
  }, 100);
});

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

const { signIn } = useAuth();

const handleVerify = async () => {
  const code = otp.value.join("");
  if (code.length !== 6) {
    errorMessage.value = "El código debe tener 6 dígitos";
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const result = await signIn("credentials", {
      email: email.value,
      mfaCode: code,
      mfaSession: session.value,
      mfaChallenge: challenge.value,
      redirect: false,
    });

    if (result?.error) {
      try {
        const errorDetails = JSON.parse(result.error);
        errorMessage.value = errorDetails.message || "Código de MFA incorrecto";
      } catch (e) {
        errorMessage.value = result.error;
      }
    } else {
      successMessage.value = "¡Identidad verificada exitosamente!";
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  } catch (error: any) {
    errorMessage.value = error.message || "Error en la verificación de MFA";
  } finally {
    loading.value = false;
  }
};
</script>
