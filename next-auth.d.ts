import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tipoUsuario: "CANDIDATO" | "EMPRESA" | "ADMIN" | "MODERADOR";
      nombre: string;
      idToken?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    tipoUsuario: "CANDIDATO" | "EMPRESA" | "ADMIN" | "MODERADOR";
    nombre: string;
    idToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    tipoUsuario: "CANDIDATO" | "EMPRESA" | "ADMIN" | "MODERADOR";
    nombre: string;
    idToken?: string;
  }
}
