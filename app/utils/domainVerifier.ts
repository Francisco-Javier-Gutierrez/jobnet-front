/**
 * Listado de proveedores de correo de dominio público conocidos y gratuitos.
 * Utilizado para la Verificación Automatizada de Organizaciones.
 */
export const PUBLIC_EMAIL_DOMAINS = new Set([
  // Google
  "gmail.com",
  "googlemail.com",

  // Microsoft
  "hotmail.com",
  "hotmail.es",
  "hotmail.fr",
  "hotmail.co.uk",
  "outlook.com",
  "outlook.es",
  "live.com",
  "live.com.mx",
  "msn.com",

  // Yahoo
  "yahoo.com",
  "yahoo.es",
  "yahoo.com.mx",
  "yahoo.co.uk",
  "ymail.com",

  // Apple
  "icloud.com",
  "me.com",
  "mac.com",

  // AOL
  "aol.com",

  // Privacidad / Webmail populares
  "proton.me",
  "protonmail.com",
  "zoho.com",
  "mail.com",
  "gmx.com",
  "gmx.es",
  "gmx.net",
  "yandex.com",
  "yandex.ru",
  "tutanota.com",
  "tutamail.com",
  "fastmail.com",
  "inbox.com",
]);

/**
 * Extrae y normaliza el dominio de un correo electrónico.
 */
export function extractEmailDomain(email: string): string {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return "";
  }
  const parts = email.split("@");
  return parts[parts.length - 1].toLowerCase().trim();
}

/**
 * Determina si el dominio o correo proporcionado corresponde a un proveedor de correo público.
 */
export function isPublicEmailDomain(domainOrEmail: string): boolean {
  if (!domainOrEmail || typeof domainOrEmail !== "string") {
    return true;
  }
  const domain = domainOrEmail.includes("@")
    ? extractEmailDomain(domainOrEmail)
    : domainOrEmail.toLowerCase().trim();

  if (!domain) {
    return true;
  }

  return PUBLIC_EMAIL_DOMAINS.has(domain);
}

/**
 * Determina si un correo o dominio pertenece a un dominio privado y corporativo.
 * Requisitos:
 * 1. NO estar en la lista de proveedores de correo de dominio público.
 * 2. Poseer una estructura válida de dominio de Internet (ej: techsolutions.mx, empresa.com).
 */
export function isCorporateEmailDomain(domainOrEmail: string): boolean {
  if (!domainOrEmail || typeof domainOrEmail !== "string") {
    return false;
  }

  const domain = domainOrEmail.includes("@")
    ? extractEmailDomain(domainOrEmail)
    : domainOrEmail.toLowerCase().trim();

  if (!domain) {
    return false;
  }

  if (isPublicEmailDomain(domain)) {
    return false;
  }

  // Estructura de dominio válida: etiquetas alfanuméricas separadas por punto con TLD de 2+ letras
  const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;
  return domainRegex.test(domain);
}

/**
 * Listado base de dominios bloqueados por antecedentes de fraude, estafas o suplantación (RN-3).
 */
export const BLOCKED_FRAUD_DOMAINS = new Set([
  "fraudcorp.com",
  "estafaslaborales.com",
  "fake-hiring.net",
  "scam-recruiters.org",
  "phishing-jobs.xyz",
  "malicious-domain.com",
]);

/**
 * Determina si un correo o dominio pertenece a la lista de dominios bloqueados por fraude (RN-3).
 */
export function isBlockedFraudDomain(domainOrEmail: string): boolean {
  if (!domainOrEmail || typeof domainOrEmail !== "string") {
    return false;
  }
  const domain = domainOrEmail.includes("@")
    ? extractEmailDomain(domainOrEmail)
    : domainOrEmail.toLowerCase().trim();

  if (!domain) return false;
  return BLOCKED_FRAUD_DOMAINS.has(domain);
}

/**
 * Valida la sintaxis fiscal formal de un RFC mexicano (RNF / SAT).
 * - Persona Moral (Empresas): 12 caracteres (3 letras, 6 dígitos fecha AAMMDD, 3 caracteres homoclave alfanuméricos).
 * - Persona Física (Actividad Empresarial): 13 caracteres (4 letras, 6 dígitos fecha AAMMDD, 3 caracteres homoclave alfanuméricos).
 */
export function isValidRfc(rfc: string): boolean {
  if (!rfc || typeof rfc !== "string") {
    return false;
  }
  const clean = rfc.trim().toUpperCase();
  const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
  return rfcRegex.test(clean);
}

export function getRfcType(rfc: string): "MORAL" | "FISICA" | "INVALIDO" {
  if (!isValidRfc(rfc)) return "INVALIDO";
  return rfc.trim().length === 12 ? "MORAL" : "FISICA";
}
