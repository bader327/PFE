// Our app defines roles in the Prisma schema, importing here for TypeScript support
import { Role } from "@prisma/client";

export function normalizeRole(value: unknown): Role {
  const r = (value ?? "").toString().toUpperCase();
  if (r === "SUPERADMIN" || r === "QUALITICIEN" || r === "CHEF_ATELIER" || r === "NORMAL_USER") {
    return r as Role;
  }
  return "NORMAL_USER" as Role;
}

export function getRedirectForRole(role: Role): string {
  switch (role) {
    case "SUPERADMIN":
      return "/dashboard";
    case "QUALITICIEN":
      return "/niveauligne";
    case "CHEF_ATELIER":
      return "/dashboard";
    case "NORMAL_USER":
      return "/dashboard";
    default:
      return "/";
  }
}

// Permission helpers
export const canAccessAdmin = (role: Role) => role === "SUPERADMIN";
export const canAccessLignes = (role: Role) => role === "SUPERADMIN" || role === "QUALITICIEN";
export const canAccessAllBasic = (_role: Role) => true; // all authenticated users

export const canEditNiveauLigneText = (role: Role) => role === "SUPERADMIN"; // text fields
export const canToggleResolveCheckbox = (role: Role) => role === "SUPERADMIN" || role === "QUALITICIEN"; // special permission

export const canSubmitFPSData = (role: Role) => role === "SUPERADMIN"; // server-side write from niveau ligne
