"use client";
import { getRedirectForRole, normalizeRole, Role } from "@/lib/roleUtils";
import { SignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const [selectedRole, setSelectedRole] = useState<Role | "">("");

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && user) {
      // If we have a selected role during sign-up, store it
      const role = normalizeRole(selectedRole || (user.unsafeMetadata as any)?.userType);
      if (role && role !== "UNKNOWN") {
        user.update({ unsafeMetadata: { ...user.unsafeMetadata, userType: role } }).then(() => {
          try { window.localStorage.setItem("coficab.role", role); } catch {}
          router.replace(getRedirectForRole(role));
        });
      }
    }
  }, [isSignedIn, isLoaded, user, selectedRole, router]);

  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center p-6">
      <div className="w-full max-w-md">
        <label className="block text-sm font-medium mb-1">Select your role</label>
        <select
          className="w-full border rounded p-2"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as Role)}
        >
          <option value="">Choose a role</option>
          <option value="SUPERADMIN">SUPERADMIN</option>
          <option value="QUALITICIEN">QUALITICIEN</option>
          <option value="CHEF_ATELIER">CHEF_ATELIER</option>
        </select>
      </div>
      <div>
        <SignUp routing="hash" />
      </div>
    </div>
  );
}
