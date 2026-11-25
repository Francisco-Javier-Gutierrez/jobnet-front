import {
  getCognitoConfig,
  calculateSecretHash,
  callCognito,
} from "../../utils/cognito";
import {
  isCorporateEmailDomain,
  isBlockedFraudDomain,
  isValidRfc,
} from "../../utils/domainVerifier";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {
    email,
    password,
    role,
    fullname,
    companyName,
    razonSocial,
    nombreComercial,
    taxId,
    rfc,
    phone,
  } = body;

  if (!email || !password || !role) {
    throw createError({
      statusCode: 400,
      statusMessage: "Faltan campos obligatorios",
    });
  }

  // RN-3: Verificación contra dominios bloqueados por fraude
  if (role === "company" && isBlockedFraudDomain(email)) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "El dominio de correo ingresado se encuentra bloqueado permanentemente por antecedentes de fraude o suplantación de identidad (RN-3).",
    });
  }

  const organizationRfc = (rfc || taxId || "").trim().toUpperCase();
  if (role === "company") {
    if (!organizationRfc) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "El RFC o identificador fiscal es obligatorio para organizaciones.",
      });
    }
    if (!isValidRfc(organizationRfc)) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "El RFC ingresado no cumple con la sintaxis fiscal formal (12 caracteres para personas morales o 13 para personas físicas con homoclave SAT).",
      });
    }
  }

  const { clientId, clientSecret } = getCognitoConfig();

  const normalizedCustomRole =
    role === "candidate" || role === "candidato"
      ? "CANDIDATO"
      : role === "company" || role === "empresa" || role === "organizacion"
        ? "ORGANIZACION"
        : role;

  const userAttributes = [
    { Name: "email", Value: email },
    { Name: "custom:role", Value: normalizedCustomRole },
  ];

  const isIndividual =
    role === "candidate" ||
    role === "blank" ||
    role === "unassigned" ||
    role === "moderator" ||
    role === "moderator_pending" ||
    role === "blank_moderator" ||
    role === "admin_pending" ||
    role === "blank_admin";

  const resolvedCompanyName =
    nombreComercial || companyName || razonSocial || "";

  if (isIndividual) {
    userAttributes.push({ Name: "name", Value: fullname || "" });
  } else if (role === "company") {
    userAttributes.push({ Name: "name", Value: resolvedCompanyName });
    if (organizationRfc) {
      userAttributes.push({ Name: "custom:tax_id", Value: organizationRfc });
    }
    if (phone) {
      userAttributes.push({ Name: "phone_number", Value: phone });
    }
  }

  const isCorporate = role === "company" && isCorporateEmailDomain(email);

  const requestedRole =
    body.requestedRole ||
    (role.includes("mod")
      ? "MODERATOR"
      : role.includes("admin")
        ? "ADMIN"
        : "");

  const clientMetadata: Record<string, string> = {
    tipoUsuario: role,
    role: role,
    solicitudRol: requestedRole,
    nombre: fullname || resolvedCompanyName,
  };

  if (role === "company") {
    clientMetadata.razonSocial =
      razonSocial || companyName || resolvedCompanyName;
    clientMetadata.nombreComercial =
      nombreComercial || companyName || resolvedCompanyName;
    clientMetadata.rfc = organizationRfc;
    clientMetadata.taxId = organizationRfc;
    if (phone) {
      clientMetadata.telefono = phone;
    }
    clientMetadata.autoVerified = isCorporate ? "true" : "false";
    clientMetadata.organizacionVerificada = isCorporate ? "true" : "false";
    clientMetadata.estatusVerificacion = isCorporate
      ? "VERIFICADA"
      : "PENDIENTE";
    clientMetadata.metodoVerificacion = isCorporate
      ? "AUTOMATICO_DOMINIO_CORPORATIVO"
      : "MANUAL_PENDIENTE";
  }

  const signUpParams: Record<string, any> = {
    ClientId: clientId,
    Username: email,
    Password: password,
    UserAttributes: userAttributes,
    ClientMetadata: clientMetadata,
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
      isAutoVerified: isCorporate,
      verificationStatus: isCorporate ? "VERIFICADA" : "PENDIENTE",
      message: isCorporate
        ? "Registro aprobado con estatus 'Verificada'. Se ha despachado el código criptográfico de confirmación."
        : "Registro inicial completado con estatus 'No verificada'. Se ha despachado el código criptográfico de confirmación.",
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Error al registrar el usuario",
      data: error.data || {},
    });
  }
});
