export interface CompanyVerificationDoc {
  nombre: string;
  url: string;
  tipo: string;
  fecha?: string;
}

export interface CompanyProfile {
  id?: string;
  companyId?: string;
  userId?: string;
  nombre?: string;
  nombreComercial?: string;
  razonSocial?: string;
  name?: string;
  rfc?: string;
  email?: string;
  telefono?: string;
  sitioWeb?: string;
  descripcion?: string;
  biografia?: string;
  logoUrl?: string;
  fotoPerfil?: string;
  bannerUrl?: string;
  ubicacion?: string | { city?: string; pais?: string; estado?: string };
  sector?: string;
  tamanoEmpresa?: string;
  organizacionVerificada?: boolean;
  estatusVerificacion?:
    "PENDIENTE" | "VERIFICADA" | "RECHAZADA" | "EN_REVISION" | string;
  documentosVerificacion?: CompanyVerificationDoc[];
  suspensionStatus?: string;
  estatus?: string;
  estadoCuenta?: string;
  [key: string]: any;
}

export interface AdminOrganization extends CompanyProfile {
  id: string;
  companyId: string;
  nombre: string;
}
