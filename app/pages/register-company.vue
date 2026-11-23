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
          Registro de organización
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

      <!-- Role Selector Tabs (Dark Mode Adapted) -->
      <div
        class="flex bg-[#F1F5F9] dark:bg-slate-800/80 p-1 rounded-xl mb-6 border border-outline-variant/30 dark:border-slate-700/60"
        role="tablist"
        aria-label="Tipo de registro"
      >
        <NuxtLink
          to="/register"
          role="tab"
          aria-selected="false"
          aria-label="Registrarse como Candidato"
          class="flex-1 py-2 text-sm font-semibold rounded-lg text-on-surface-variant dark:text-slate-300 hover:text-primary text-center transition"
        >
          Candidato
        </NuxtLink>
        <button
          type="button"
          role="tab"
          aria-selected="true"
          aria-label="Registrarse como organización"
          class="flex-1 py-2 text-sm font-semibold rounded-lg transition bg-primary text-white shadow-sm"
        >
          Organización
        </button>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div
          v-if="errorMessage"
          id="register-company-error"
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
          id="register-company-success"
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
          <label
            class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300 mb-2"
            for="razon_social"
          >
            Razón Social (Denominación oficial)
          </label>
          <input
            id="razon_social"
            v-model="razonSocial"
            type="text"
            required
            aria-required="true"
            placeholder="Ej. Tecnologías Digitales Avanzadas S.A. de C.V."
            :aria-invalid="!!errorMessage"
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
          />
        </div>

        <div>
          <label
            class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300 mb-2"
            for="nombre_comercial"
          >
            Nombre Comercial
          </label>
          <input
            id="nombre_comercial"
            v-model="nombreComercial"
            type="text"
            required
            aria-required="true"
            placeholder="Ej. TechSolutions México"
            :aria-invalid="!!errorMessage"
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
          />
        </div>

        <div>
          <label
            class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300 mb-2"
            for="rfc"
          >
            RFC (Identificador fiscal)
          </label>
          <input
            id="rfc"
            v-model="rfc"
            type="text"
            required
            maxlength="13"
            aria-required="true"
            placeholder="Ej. TDA980512AB3 (Moral) o PEGA8801019H2 (Física)"
            :aria-invalid="!!errorMessage || (rfc.length > 0 && !isRfcValid)"
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors uppercase font-mono"
            @input="rfc = rfc.toUpperCase().trim()"
          />
          <div class="mt-1.5 text-xs">
            <div
              v-if="isRfcValid"
              class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium"
            >
              <span class="material-symbols-outlined text-sm"
                >check_circle</span
              >
              <span>
                Sintaxis fiscal válida ({{
                  rfcType === "MORAL"
                    ? "Persona Moral • 12 caracteres"
                    : "Persona Física • 13 caracteres"
                }})
              </span>
            </div>
            <div
              v-else-if="rfc.length > 0"
              class="flex items-center gap-1.5 text-rose-500 font-medium"
            >
              <span class="material-symbols-outlined text-sm">cancel</span>
              <span
                >Formato de RFC inválido. Requiere 12 car. (Moral) o 13 car.
                (Física) con homoclave SAT.</span
              >
            </div>
            <p
              v-else
              class="text-on-surface-variant dark:text-slate-400 text-[11px]"
            >
              Formato SAT: 12 caracteres (Moral) o 13 caracteres (Física con
              act. empresarial).
            </p>
          </div>
        </div>

        <div>
          <label
            class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300 mb-2"
            for="phone"
          >
            Teléfono de Contacto
          </label>
          <input
            id="phone"
            v-model="phone"
            type="tel"
            required
            aria-required="true"
            placeholder="Ej. +52 55 1234 5678"
            :aria-invalid="!!errorMessage"
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
          />
        </div>

        <div>
          <label
            class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300 mb-2"
            for="corporate_email"
          >
            Correo Electrónico de la Organización
          </label>
          <input
            id="corporate_email"
            v-model="email"
            type="email"
            required
            aria-required="true"
            placeholder="contacto@tuempresa.com"
            :aria-invalid="!!errorMessage || isBlockedDomain"
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
          />

          <!-- Real-time Domain Verification / RN-3 Block Status Indicator -->
          <div v-if="email && email.includes('@')" class="mt-2 text-xs">
            <!-- RN-3 Fraud Domain Blocked Alert -->
            <div
              v-if="isBlockedDomain"
              class="flex items-start gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-700 dark:text-rose-300 font-medium"
            >
              <span
                class="material-symbols-outlined text-[18px] text-rose-600 flex-shrink-0"
                >block</span
              >
              <span
                >Dominio bloqueado por fraude (RN-3): El dominio
                <strong>@{{ emailDomain }}</strong> está restringido por
                antecedentes fraudulentos o suplantación. No es posible
                registrarse con este correo.</span
              >
            </div>
            <!-- Corporate Domain Auto-Verification -->
            <div
              v-else-if="isCorporateDomain"
              class="flex items-start gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-300 font-medium"
            >
              <span
                class="material-symbols-outlined text-[18px] text-emerald-600 flex-shrink-0"
                >verified</span
              >
              <span
                >Dominio corporativo privado detectado (<strong
                  >@{{ emailDomain }}</strong
                >). El registro empresarial será aprobado automáticamente con
                estatus <strong>"Verificada"</strong>.</span
              >
            </div>
            <!-- Public Domain Non-Verified Notice -->
            <div
              v-else-if="isPublicDomain"
              class="flex items-start gap-2 p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 rounded-xl text-amber-700 dark:text-amber-300 font-medium"
            >
              <span
                class="material-symbols-outlined text-[18px] text-amber-600 flex-shrink-0"
                >info</span
              >
              <span
                >Proveedor de correo público detectado (<strong
                  >@{{ emailDomain }}</strong
                >). La cuenta se registrará inicialmente con estatus
                <strong>"No verificada"</strong> hasta completar su trámite
                probatorio fiscal.</span
              >
            </div>
          </div>
        </div>

        <div>
          <label
            class="block text-xs font-semibold tracking-wider text-on-surface-variant dark:text-slate-300 mb-2"
            for="password"
          >
            Contraseña
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            aria-required="true"
            placeholder="••••••••"
            :aria-invalid="!!errorMessage"
            class="w-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-[#F1F5F9] dark:border-slate-700 hover:border-outline focus:border-primary rounded-xl px-4 py-3 text-sm text-on-background dark:text-slate-100 outline-none transition-colors"
          />
        </div>

        <!-- Password Requirements Box (Dark Mode Adapted) -->
        <div
          class="select-none pointer-events-none rounded-xl border border-outline-variant/60 dark:border-slate-800 bg-[#F1F5F9] dark:bg-slate-800/80 p-3 text-on-surface-variant dark:text-slate-300"
          aria-live="polite"
        >
          <p
            class="mb-2 text-sm font-semibold text-on-surface dark:text-slate-100"
          >
            Requisitos de contraseña
          </p>
          <div class="flex flex-col gap-1">
            <label
              v-for="rule in passwordRuleItems"
              :key="rule.key"
              class="flex items-center gap-2 text-xs"
              :class="
                rule.valid
                  ? 'text-secondary dark:text-emerald-400 font-medium'
                  : 'text-on-surface-variant dark:text-slate-400'
              "
            >
              <input
                type="checkbox"
                disabled
                :checked="rule.valid"
                class="h-4 w-4 rounded border-outline-variant/60 dark:border-slate-700 bg-white dark:bg-slate-800 text-secondary accent-secondary"
                aria-hidden="true"
              />
              <span>{{ rule.label }}</span>
            </label>
          </div>
        </div>

        <div class="flex items-start gap-3 pt-2">
          <input
            id="terms"
            v-model="acceptTerms"
            type="checkbox"
            required
            aria-required="true"
            class="w-4 h-4 text-primary bg-[#F1F5F9] dark:bg-slate-800 border-outline-variant/60 rounded focus:ring-primary mt-1"
          />
          <label
            for="terms"
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-normal"
          >
            Acepto los
            <button
              type="button"
              @click.prevent="showTermsModal = true"
              class="text-primary hover:underline cursor-pointer"
              aria-label="Ver los Términos y Condiciones"
            >
              Términos y Condiciones
            </button>
            y el
            <button
              type="button"
              @click.prevent="showTermsModal = true"
              class="text-primary hover:underline cursor-pointer"
              aria-label="Ver el Aviso de Privacidad"
            >
              Aviso de Privacidad
            </button>
          </label>
        </div>

        <button
          type="submit"
          :disabled="loading || isBlockedDomain || !isRfcValid"
          :aria-busy="loading"
          class="w-full h-12 bg-primary hover:bg-primary-container disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-medium rounded-xl flex items-center justify-center gap-2 transition shadow-sm hover:shadow"
        >
          <span
            v-if="loading"
            class="w-5 h-5 border-2 border-current/20 border-t-current rounded-full animate-spin"
            aria-hidden="true"
          ></span>
          <span v-else>Registrar organización</span>
        </button>
      </form>
    </div>
  </div>

  <!-- Terms Modal -->
  <AppModal
    v-model="showTermsModal"
    title="Términos y Condiciones de Uso"
    icon="gavel"
    max-width="3xl"
    @close="showTermsModal = false"
  >
    <AppTermsContent />
  </AppModal>
</template>

<script setup lang="ts">
import {
  extractEmailDomain,
  isCorporateEmailDomain,
  isPublicEmailDomain,
  isBlockedFraudDomain,
  isValidRfc,
  getRfcType,
} from "~/utils/domainVerifier";

definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Registro de organización - JobNet",
  description: "Crea una cuenta de organización en JobNet",
});

const razonSocial = ref("");
const nombreComercial = ref("");
const rfc = ref("");
const phone = ref("");
const email = ref("");
const password = ref("");

const emailDomain = computed(() => extractEmailDomain(email.value));
const isBlockedDomain = computed(() => isBlockedFraudDomain(email.value));
const isCorporateDomain = computed(() => isCorporateEmailDomain(email.value));
const isPublicDomain = computed(() => isPublicEmailDomain(email.value));

const isRfcValid = computed(() => isValidRfc(rfc.value));
const rfcType = computed(() => getRfcType(rfc.value));

const passwordRules = computed(() => ({
  length: password.value.length >= 8,
  uppercase: /[A-Z]/.test(password.value),
  lowercase: /[a-z]/.test(password.value),
  number: /\d/.test(password.value),
  special: /[@$!%*?&._-]/.test(password.value),
}));
const passwordRuleItems = computed(() => [
  {
    key: "length",
    label: "Al menos 8 caracteres",
    valid: passwordRules.value.length,
  },
  {
    key: "uppercase",
    label: "Una letra mayúscula",
    valid: passwordRules.value.uppercase,
  },
  {
    key: "lowercase",
    label: "Una letra minúscula",
    valid: passwordRules.value.lowercase,
  },
  { key: "number", label: "Un número", valid: passwordRules.value.number },
  {
    key: "special",
    label: "Un carácter especial (@$!%*?&._-)",
    valid: passwordRules.value.special,
  },
]);
const acceptTerms = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const router = useRouter();

const handleRegister = async () => {
  if (!acceptTerms.value) {
    errorMessage.value = "Debes aceptar los términos y condiciones";
    return;
  }

  if (isBlockedDomain.value) {
    errorMessage.value =
      "El dominio del correo ingresado se encuentra bloqueado por antecedentes de fraude (RN-3).";
    return;
  }

  if (!isRfcValid.value) {
    errorMessage.value =
      "El RFC ingresado no cumple con la sintaxis fiscal formal (12 caracteres para personas morales o 13 para personas físicas con homoclave SAT).";
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const res = await $fetch<any>("/api/auth/register", {
      method: "POST",
      body: {
        email: email.value.trim(),
        password: password.value,
        role: "company",
        razonSocial: razonSocial.value.trim(),
        nombreComercial: nombreComercial.value.trim(),
        companyName: nombreComercial.value.trim() || razonSocial.value.trim(),
        rfc: rfc.value.trim().toUpperCase(),
        taxId: rfc.value.trim().toUpperCase(),
        phone: phone.value.trim(),
      },
    });

    if (res.success) {
      if (res.isAutoVerified || isCorporateDomain.value) {
        successMessage.value =
          "Registro empresarial aprobado con estatus 'Verificada'. Hemos despachado un código criptográfico de confirmación a tu correo para validar la autenticidad de la cuenta.";
      } else {
        successMessage.value =
          "Registro institucional exitoso con estatus 'No verificada'. Hemos despachado un código criptográfico de confirmación a tu correo para validar la autenticidad de la cuenta.";
      }
      setTimeout(() => {
        router.push({
          path: "/verify-otp",
          query: {
            email: email.value.trim(),
            autoVerified:
              res.isAutoVerified || isCorporateDomain.value ? "true" : "false",
          },
        });
      }, 1500);
    }
  } catch (error: any) {
    errorMessage.value =
      error.data?.message || error.message || "Error en el registro";
  } finally {
    loading.value = false;
  }
};

const showTermsModal = ref(false);
</script>
