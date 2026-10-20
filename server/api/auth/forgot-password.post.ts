import {
  getCognitoConfig,
  calculateSecretHash,
  callCognito,
} from "../../utils/cognito";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email } = body;

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email es obligatorio",
    });
  }

  const { clientId, clientSecret } = getCognitoConfig();

  const forgotParams: Record<string, any> = {
    ClientId: clientId,
    Username: email,
  };

  if (clientSecret) {
    forgotParams.SecretHash = calculateSecretHash(
      email,
      clientId,
      clientSecret,
    );
  }

  try {
    await callCognito("ForgotPassword", forgotParams);
    return {
      success: true,
      message: "Código de restablecimiento enviado",
    };
  } catch (error: any) {
    // Standard de la industria: si el usuario se registró únicamente con Google OAuth,
    // orientarlo a que su acceso es a través de Google y no tiene contraseña tradicional.
    try {
      const config = useRuntimeConfig();
      const profiles: any[] = await $fetch(
        `${config.public.apiUrl}/profiles`,
      ).catch(() => []);
      const matching = profiles.filter(
        (p) => p.email && p.email.toLowerCase() === email.toLowerCase(),
      );
      const isOnlyGoogle =
        matching.length > 0 &&
        matching.every((p) => p.origenRegistro === "GOOGLE_OAUTH") &&
        !matching.some(
          (p) => p.origenRegistro === "LINKED_GOOGLE" || p.linkedGoogleSub,
        );

      if (isOnlyGoogle) {
        throw createError({
          statusCode: 400,
          statusMessage:
            "Esta cuenta fue creada mediante Google Sign-In y no utiliza una contraseña independiente. Por favor, inicia sesión directamente con el botón de Google.",
          data: { code: "FederatedUserAccount", isFederated: true },
        });
      }
    } catch (err: any) {
      if (err.statusCode) throw err;
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage ||
        "Error al solicitar el restablecimiento de contraseña",
      data: error.data || {},
    });
  }
});
