<template>
  <div class="w-full max-w-md" role="main">
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8"
    >
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
          Verificar cuenta
        </h1>
        <div class="mt-2 w-full text-left">
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

      <form @submit.prevent="handleVerify" class="space-y-5">
        <div
          v-if="errorMessage"
          id="otp-error"
          role="alert"
          aria-live="assertive"
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
          id="otp-success"
          role="status"
          aria-live="polite"
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
          <p
            class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300 mb-2"
          >
            Ingrese el código de verificación
          </p>
          <div
            class="flex justify-between gap-1.5 sm:gap-2"
            id="otp-container"
            role="group"
            aria-label="Código de verificación de 6 dígitos"
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
                  ? 'otp-error'
                  : successMessage
                    ? 'otp-success'
                    : undefined
              "
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
          :aria-busy="loading"
          class="w-full h-12 bg-primary hover:bg-primary-container disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center justify-center gap-2 transition shadow-sm hover:shadow"
        >
          <span
            v-if="loading"
            class="w-5 h-5 border-2 border-current/20 border-t-current rounded-full animate-spin"
            aria-hidden="true"
          ></span>
          <span v-else>Confirmar</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-on-surface-variant dark:text-slate-300">
          ¿No recibiste el código?
          <button
            @click="handleResend"
            :disabled="resendLoading"
            :aria-busy="resendLoading"
            aria-label="Reenviar el código de verificación por correo"
            class="font-semibold text-primary hover:underline transition ml-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ resendLoading ? "Reenviando..." : "Reenviar" }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Verificación OTP - JobNet",
  description: "Confirma tu registro en JobNet con el código OTP",
});

const route = useRoute();
const router = useRouter();

const email = ref((route.query.email as string) || "");
const otp = ref(["", "", "", "", "", ""]);
const otpInputs = ref<HTMLInputElement[]>([]);

const loading = ref(false);
const resendLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

onMounted(() => {
  if (!email.value) {
    errorMessage.value = "Falta el correo electrónico para verificar";
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
    const res = await $fetch("/api/auth/verify-otp", {
      method: "POST",
      body: {
        email: email.value,
        code,
      },
    });

    if (res.success) {
      successMessage.value =
        "¡Cuenta verificada exitosamente! Redirigiendo al inicio de sesión...";
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  } catch (error: any) {
    errorMessage.value =
      error.data?.message || error.message || "Código incorrecto o expirado";
  } finally {
    loading.value = false;
  }
};

const handleResend = async () => {
  if (!email.value) return;

  resendLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const res = await $fetch("/api/auth/resend-code", {
      method: "POST",
      body: { email: email.value },
    });
    if (res.success) {
      successMessage.value = "Código reenviado con éxito. Revisa tu correo.";
    }
  } catch (error: any) {
    errorMessage.value =
      error.data?.message || error.message || "Error al reenviar el código";
  } finally {
    resendLoading.value = false;
  }
};
</script>
