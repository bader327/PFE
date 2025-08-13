import { User } from "@clerk/nextjs/server";

export type Role = "SUPERADMIN" | "QUALITICIEN" | "CHEF_ATELIER" | "UNKNOWN";

export function normalizeRole(value: unknown): Role {
  const r = (value ?? "").toString().toUpperCase();
  if (r === "SUPERADMIN" || r === "QUALITICIEN" || r === "CHEF_ATELIER") return r;
  return "UNKNOWN";
}

export function getUserRoleFromUser(user: Pick<User, "publicMetadata" | "unsafeMetadata"> | null | undefined): Role {
  const meta = (user?.publicMetadata as Record<string, unknown>) || (user?.unsafeMetadata as Record<string, unknown>) || {};
  return normalizeRole(meta.userType);
}

export function getRedirectForRole(role: Role): string {
  switch (role) {
    case "SUPERADMIN":
      return "/dashboard";
    case "QUALITICIEN":
      return "/niveauligne";
    case "CHEF_ATELIER":
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
