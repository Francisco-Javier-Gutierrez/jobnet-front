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
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage ||
        "Error al solicitar el restablecimiento de contraseña",
      data: error.data || {},
    });
  }
});
