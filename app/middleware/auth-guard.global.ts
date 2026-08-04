export default defineNuxtRouteMiddleware((to) => {
  const { status, data } = useAuth();
  const rawRole = (data.value?.user as any)?.tipoUsuario;
  const userRole = (rawRole || "").toUpperCase();

  const path = to.path.toLowerCase();

  // 1a. User & Organization Support Route (/support) -> Allowed for all authenticated users
  if (path === "/support" || path.startsWith("/support/")) {
    if (status.value !== "authenticated") {
      return navigateTo("/login");
    }
    return;
  }

  // 1b. Moderator Support Routes (/mod/support) -> Allowed ONLY for MODERATOR
  if (path.startsWith("/mod/support")) {
    if (
      status.value !== "authenticated" ||
      (userRole !== "MODERATOR" && userRole !== "MODERADOR")
    ) {
      throw createError({
        statusCode: 404,
        statusMessage: "Página no encontrada",
        fatal: true,
      });
    }
  }

  // 1b. General Admin & Moderator Routes (/admin/* and /mod/*) -> Allowed for ADMIN, MODERATOR, MODERADOR
  if (path.startsWith("/admin") || path.startsWith("/mod")) {
    if (
      status.value !== "authenticated" ||
      (userRole !== "ADMIN" &&
        userRole !== "MODERATOR" &&
        userRole !== "MODERADOR")
    ) {
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
      (userRole !== "ORGANIZACION" && userRole !== "EMPRESA")
    ) {
      throw createError({
        statusCode: 404,
        statusMessage: "Página no encontrada",
        fatal: true,
      });
    }
  }

  // 4. Candidate Edit Routes (/settings) -> POSTULANTE, CANDIDATO, ADMIN, MODERADOR, or no role (default user)
  const candidateRoutes = ["/settings"];

  if (candidateRoutes.some((r) => path === r || path.startsWith(`${r}/`))) {
    if (
      status.value !== "authenticated" ||
      (userRole !== "POSTULANTE" &&
        userRole !== "CANDIDATO" &&
        userRole !== "ADMIN" &&
        userRole !== "MODERATOR" &&
        userRole !== "MODERADOR" &&
        userRole !== "")
    ) {
      throw createError({
        statusCode: 404,
        statusMessage: "Página no encontrada",
        fatal: true,
      });
    }
  }
});
