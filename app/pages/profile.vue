<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";

const { data, status } = useAuth();
const router = useRouter();

const handleRedirect = () => {
  if (status.value === "unauthenticated") {
    router.replace("/login");
    return;
  }

  if (status.value === "authenticated") {
    const role = data.value?.user?.tipoUsuario;
    const id = data.value?.user?.id;

    if (role === "CANDIDATO") {
      router.replace(`/candidate/${id}`);
    } else if (role === "EMPRESA") {
      router.replace(`/company/${id}`);
    } else {
      // Admins/Moderators redirect to home for now
      router.replace("/");
    }
  }
};

onMounted(() => {
  handleRedirect();
});

watch([status, data], () => {
  handleRedirect();
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-background">
    <div class="flex flex-col items-center gap-4">
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"
      ></div>
      <p class="text-on-surface-variant font-medium text-sm">
        Cargando tu perfil...
      </p>
    </div>
  </div>
</template>
