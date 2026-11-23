import {
  getCognitoConfig,
  calculateSecretHash,
  callCognito,
} from "../../utils/cognito";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, googleSub } = body;

  if (!email || !password || !googleSub) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Faltan datos obligatorios para vincular la cuenta (email, contraseña o identificador de Google).",
    });
  }

  const { clientId, clientSecret } = getCognitoConfig();

  // 1. Validar la contraseña existente mediante InitiateAuth (USER_PASSWORD_AUTH)
  const authParams: Record<string, string> = {
    USERNAME: email,
    PASSWORD: password,
  };

  if (clientSecret) {
    authParams.SECRET_HASH = calculateSecretHash(email, clientId, clientSecret);
  }

  let authResult: any;
  try {
    const res = await callCognito("InitiateAuth", {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientId,
      AuthParameters: authParams,
    });
    authResult = res.AuthenticationResult;
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      statusMessage:
        "La contraseña ingresada es incorrecta. Por favor verifique sus credenciales para autorizar la vinculación.",
      data: { code: "InvalidPasswordForLinking" },
    });
  }

  // 2. Extraer el UUID nativo del usuario a partir del IdToken
  let nativeUserId = "";
  if (authResult?.IdToken) {
    try {
      const payloadBase64 = authResult.IdToken.split(".")[1];
      const payload = JSON.parse(
        Buffer.from(payloadBase64, "base64").toString("ascii"),
      );
      nativeUserId = payload.sub;
    } catch {
      // Ignorar fallback
    }
  }

  const config = useRuntimeConfig();

  // Si no se pudo extraer el UUID del token, buscar el perfil por email
  if (!nativeUserId) {
    const profiles: any[] = await $fetch(
      `${config.public.apiUrl}/profiles`,
    ).catch(() => []);
    const matched = profiles.find(
      (p) =>
        p.email &&
        p.email.toLowerCase() === email.toLowerCase() &&
        p.origenRegistro !== "GOOGLE_OAUTH",
    );
    nativeUserId = matched?.id || matched?.PK?.replace("USER#", "") || "";
  }

  if (!nativeUserId) {
    throw createError({
      statusCode: 404,
      statusMessage: "No se localizó el perfil nativo asociado al correo.",
    });
  }

  // 3. Actualizar el perfil en DynamoDB registrando la vinculación con Google
  const updatedProfile = await $fetch(
    `${config.public.apiUrl}/profile/${nativeUserId}`,
    {
      method: "POST",
      headers: {
        "x-user-id": nativeUserId,
        "x-user-role": "CANDIDATO",
      },
      body: {
        isFederated: true,
        linkedGoogleSub: googleSub,
        origenRegistro: "LINKED_GOOGLE",
        fechaVinculacion: new Date().toISOString(),
      },
    },
  ).catch((err: any) => {
    console.error("Error al actualizar perfil con vinculación de Google:", err);
    return null;
  });

  return {
    success: true,
    message: "Cuenta de Google vinculada exitosamente con tu cuenta de JobNet.",
    nativeUserId,
    profile: updatedProfile,
  };
});
