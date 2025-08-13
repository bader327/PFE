"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/user");
        
        if (!response.ok) {
          if (response.status === 401) {
            // Not authenticated, redirect to login
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch user data");
        }
        
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          setFirstName(data.user.firstName);
          setLastName(data.user.lastName);
        } else {
          throw new Error("User data is missing");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, [router]);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    
    // Validate password fields
    if (newPassword && newPassword !== confirmPassword) {
      setFormError("New passwords do not match");
      setSaving(false);
      return;
    }
    
    // Only update if something has changed
    if (firstName === user?.firstName && lastName === user?.lastName && !newPassword) {
      setFormError("No changes detected");
      setSaving(false);
      return;
    }
    
    try {
      const updateData: { 
        firstName?: string;
        lastName?: string; 
        currentPassword?: string; 
        newPassword?: string 
      } = {};
      
      if (firstName !== user?.firstName) {
        updateData.firstName = firstName;
      }
      
      if (lastName !== user?.lastName) {
        updateData.lastName = lastName;
      }
      
      if (newPassword) {
        if (!currentPassword) {
          setFormError("Current password is required to set a new password");
          setSaving(false);
          return;
        }
        
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }
      
      const response = await fetch("/api/auth/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }
      
      // Update was successful
      if (user) {
        setUser({
          ...user,
          firstName: data.user.firstName || user.firstName,
          lastName: data.user.lastName || user.lastName
        });
      }
      setSuccess("Profile updated successfully");
      setIsEditing(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "Super Admin";
      case "QUALITICIEN":
        return "Qualiticien";
      case "CHEF_ATELIER":
        return "Chef d'Atelier";
      case "NORMAL_USER":
        return "Utilisateur";
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mon Profil</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Retour au Dashboard
        </button>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 flex items-start">
          <div className="mr-6">
            <div className="bg-gray-200 rounded-full p-2">
              <Image
                src="/avatar.png"
                alt="User Avatar"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleUpdateProfile}>
                {formError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {formError}
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
                    Nom
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-100 text-gray-700 leading-tight"
                    value={user?.email}
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                </div>
                
                <h3 className="text-lg font-medium text-gray-800 mb-3 mt-6">Changer le mot de passe</h3>
                
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-bold mb-2">
                    Mot de passe actuel
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setIsEditing(false);
                      setFirstName(user?.firstName || "");
                      setLastName(user?.lastName || "");
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setFormError("");
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={saving}
                  >
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{user ? `${user.firstName} ${user.lastName}` : ""}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-lg text-sm"
                  >
                    Modifier
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rôle</p>
                    <p className="text-gray-800">{user ? getRoleLabel(user.role) : ""}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Compte créé le</p>
                    <p className="text-gray-800">
                      {user?.createdAt 
                        ? new Date(user.createdAt).toLocaleString() 
                        : "Inconnu"
                      }
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
