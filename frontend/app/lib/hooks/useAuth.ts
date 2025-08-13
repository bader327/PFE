"use client";

import { Role } from "@prisma/client";
import { useEffect, useState } from "react";

interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: Role;
  ligneIds: string[];
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/user");
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
            
            // Store role in localStorage for components that need it
            if (typeof window !== "undefined" && data.user.role) {
              window.localStorage.setItem("coficab.role", data.user.role);
            }
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user data");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, isLoading, isSignedIn: !!user, error };
}
