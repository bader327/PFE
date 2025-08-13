"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState<{name: string, email: string} | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  useEffect(() => {
    async function checkAuthorizationAndLoadUser() {
      try {
        // Check if user is authorized (SUPERADMIN)
        const userResponse = await fetch("/api/auth/user");
        if (!userResponse.ok) {
          throw new Error("You are not authorized to access this page");
        }
        
        const userData = await userResponse.json();
        if (userData.role !== "SUPERADMIN") {
          throw new Error("Only administrators can access this page");
        }
        
        // Fetch user data (consolidated endpoint)
        const userDataResponse = await fetch(`/api/users/${userId}`);
        if (!userDataResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userDetailsResp = await userDataResponse.json();
        const userDetails = userDetailsResp.user || userDetailsResp;
        setUserData({
          name: [userDetails.firstName, userDetails.lastName].filter(Boolean).join(" ") || userDetails.name || "",
          email: userDetails.email
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        // Redirect to dashboard after 3 seconds if unauthorized
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } finally {
        setLoading(false);
      }
    }
    
    if (userId) {
      checkAuthorizationAndLoadUser();
    } else {
      setError("User ID is missing");
      setLoading(false);
    }
  }, [router, userId]);

  const handleResetPassword = async () => {
    setResetting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess("Password has been reset and sent to the user's email");
      
      // Redirect back to admin page after 3 seconds
      setTimeout(() => {
        router.push("/admin");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !resetting) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <p className="text-center">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reset User Password</h1>
        <button
          onClick={() => router.push("/admin")}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Users
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        {userData && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Reset password for user:
            </h2>
            <p className="text-gray-700 mb-2">
              <strong>Name:</strong> {userData.name}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Email:</strong> {userData.email}
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This will generate a new random password and send it to the user's email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push(`/admin/users/edit/${userId}`)}
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            onClick={handleResetPassword}
            type="button"
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={resetting}
          >
            {resetting ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
