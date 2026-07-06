import {
  getCognitoConfig,
  calculateSecretHash,
  callCognito,
} from "../../utils/cognito";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, role, fullname, companyName, taxId } = body;

  if (!email || !password || !role) {
    throw createError({
      statusCode: 400,
      statusMessage: "Faltan campos obligatorios",
    });
  }

  const { clientId, clientSecret } = getCognitoConfig();

  const userAttributes = [
    { Name: "email", Value: email },
    { Name: "custom:role", Value: role },
  ];

  if (role === "candidate") {
    userAttributes.push({ Name: "name", Value: fullname || "" });
  } else if (role === "company") {
    userAttributes.push({ Name: "name", Value: companyName || "" });
    if (taxId) {
      userAttributes.push({ Name: "custom:tax_id", Value: taxId });
    }
  }

  const signUpParams: Record<string, any> = {
    ClientId: clientId,
    Username: email,
    Password: password,
    UserAttributes: userAttributes,
  };

  if (clientSecret) {
    signUpParams.SecretHash = calculateSecretHash(
      email,
      clientId,
      clientSecret,
    );
  }

  try {
    const result = await callCognito("SignUp", signUpParams);
    return {
      success: true,
      userConfirmed: result.UserConfirmed,
      userSub: result.UserSub,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Error al registrar el usuario",
      data: error.data || {},
    });
  }
});
