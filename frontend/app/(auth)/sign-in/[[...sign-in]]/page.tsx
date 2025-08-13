"use client";
import { getRedirectForRole, getUserRoleFromUser } from "@/lib/roleUtils";
import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      const role = getUserRoleFromUser(user);
      try { window.localStorage.setItem("coficab.role", role); } catch {}
      router.replace(getRedirectForRole(role));
    }
  }, [isSignedIn, isLoaded, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <SignIn routing="hash" />
    </div>
  );
}
