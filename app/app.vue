<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <AppProtectedModal />
      <AppFeedbackModal />
      <AppCommandPalette />
    </ClientOnly>
  </div>
</template>
