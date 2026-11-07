<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <AppProtectedModal />
      <AppFeedbackModal />
      <AppCommandPalette />
      <AppGoogleRoleNoticeModal />
    </ClientOnly>
  </div>
</template>
