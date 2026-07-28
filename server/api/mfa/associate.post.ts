import { callCognito } from "../../utils/cognito";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { accessToken } = body || {};

  if (!accessToken) {
    throw createError({
      statusCode: 400,
      statusMessage: "AccessToken de sesión requerido",
    });
  }

  try {
    const result = await callCognito("AssociateSoftwareToken", {
      AccessToken: accessToken,
    });

    return {
      success: true,
      secretCode: result.SecretCode,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Error al asociar token MFA en Cognito",
      data: error.data || {},
    });
  }
});
