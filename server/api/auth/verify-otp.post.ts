import {
  getCognitoConfig,
  calculateSecretHash,
  callCognito,
} from "../../utils/cognito";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, code } = body;

  if (!email || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email y código son obligatorios",
    });
  }

  const { clientId, clientSecret } = getCognitoConfig();

  const confirmSignUpParams: Record<string, any> = {
    ClientId: clientId,
    Username: email,
    ConfirmationCode: code,
  };

  if (clientSecret) {
    confirmSignUpParams.SecretHash = calculateSecretHash(
      email,
      clientId,
      clientSecret,
    );
  }

  try {
    await callCognito("ConfirmSignUp", confirmSignUpParams);
    return {
      success: true,
      message: "Cuenta verificada con éxito",
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Error al verificar el código",
      data: error.data || {},
    });
  }
});
