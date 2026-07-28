export default defineNuxtRouteMiddleware((to) => {
  const { status, data } = useAuth();
  const rawRole = (data.value?.user as any)?.tipoUsuario;
  const userRole = (rawRole || "").toUpperCase();

  const path = to.path.toLowerCase();

  // 1. Admin Routes (/admin/*) -> Strictly ADMIN
  if (path.startsWith("/admin")) {
    if (status.value !== "authenticated" || userRole !== "ADMIN") {
      throw createError({
        statusCode: 404,
        statusMessage: "Página no encontrada",
        fatal: true,
      });
    }
  }

  // 2. Moderator Routes (/mod/*) -> Strictly MODERATOR
  if (path.startsWith("/mod")) {
    if (status.value !== "authenticated" || userRole !== "MODERATOR") {
      throw createError({
        statusCode: 404,
        statusMessage: "Página no encontrada",
        fatal: true,
      });
    }
  }

  // 3. Organization Routes (/dashboard, /my-vacancies, /applicants, /company/edit, /create-vacancy) -> ORGANIZACION or ADMIN
  const orgRoutes = [
    "/dashboard",
    "/my-vacancies",
    "/applicants",
    "/company/edit",
    "/create-vacancy",
  ];

  if (orgRoutes.some((r) => path === r || path.startsWith(`${r}/`))) {
    if (
      status.value !== "authenticated" ||
      (userRole !== "ORGANIZACION" &&
        userRole !== "EMPRESA" &&
        userRole !== "ADMIN")
    ) {
      throw createError({
        statusCode: 404,
        statusMessage: "Página no encontrada",
        fatal: true,
      });
    }
  }
});
