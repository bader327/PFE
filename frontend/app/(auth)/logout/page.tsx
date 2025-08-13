"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      try {
        // Call the logout API endpoint
        await fetch("/api/auth/logout", {
          method: "POST",
        });
        
        // Redirect to login page
        router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error);
        // Still redirect to login even if there's an error
        router.push("/login");
      }
    }

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Logging out...</h2>
        <p className="text-gray-600">Please wait while we sign you out.</p>
      </div>
    </div>
  );
}
