<template>
  <div
    class="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_40%)] pointer-events-none"
    ></div>

    <div class="w-full max-w-md relative z-10">
      <div
        class="bg-slate-950 border border-slate-800 rounded-2xl shadow-xl p-8"
      >
        <div class="text-center mb-8 flex flex-col items-center">
          <NuxtLink to="/" class="inline-block mb-4">
            <img
              src="/logo.svg"
              alt="JobNet"
              class="h-12 w-auto filter brightness-0 invert"
            />
          </NuxtLink>
          <div
            class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 mb-4"
          >
            <span class="material-symbols-outlined text-2xl">lock_person</span>
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-white">
            Autenticación de Dos Factores
          </h1>
          <p class="text-sm text-slate-400 mt-2">
            Ingresa el token de seguridad generado por tu aplicación
            autenticadora
          </p>
        </div>

        <form @submit.prevent="handleVerify" class="space-y-6">
          <div
            v-if="errorMessage"
            class="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-start gap-2"
          >
            <span class="material-symbols-outlined text-sm mt-0.5">error</span>
            <span>{{ errorMessage }}</span>
          </div>

          <div
            v-if="successMessage"
            class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-sm flex items-start gap-2"
          >
            <span class="material-symbols-outlined text-sm mt-0.5"
              >check_circle</span
            >
            <span>{{ successMessage }}</span>
          </div>

          <!-- OTP Input Area -->
          <div class="flex justify-between gap-2" id="otp-container">
            <input
              v-for="(digit, idx) in otp"
              :key="idx"
              ref="otpInputs"
              v-model="otp[idx]"
              type="text"
              maxlength="1"
              class="w-12 h-14 text-center text-xl font-bold bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl outline-none transition-all"
              @input="handleInput($event, idx)"
              @keydown.delete="handleDelete($event, idx)"
              @paste="handlePaste"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full h-12 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30"
          >
            <span
              v-if="loading"
              class="material-symbols-outlined animate-spin text-lg"
              >progress_activity</span
            >
            <span v-else class="flex items-center gap-1">
              Verificar Identidad
              <span class="material-symbols-outlined text-lg"
                >arrow_forward</span
              >
            </span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <a
            href="#"
            class="text-xs text-slate-400 hover:text-indigo-400 hover:underline transition"
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
