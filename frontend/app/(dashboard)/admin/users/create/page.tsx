"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function CreateUserPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("NORMAL_USER");
  const [lignes, setLignes] = useState<{id: string, name: string}[]>([]);
  const [selectedLignes, setSelectedLignes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function checkAuthorization() {
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
        
        setAuthorized(true);
        
        // Fetch available lignes
        const lignesResponse = await fetch("/api/lignes/list");
        if (lignesResponse.ok) {
          const lignesData = await lignesResponse.json();
          setLignes(lignesData.lignes || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        // Redirect to dashboard after 3 seconds if unauthorized
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }
    }
    
    checkAuthorization();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
  if (!firstName || !lastName || !username || !email || !role) {
        throw new Error("Please fill in all required fields");
      }

    const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
    firstName,
    lastName,
    username,
          email,
      phone: phone || undefined,
          role,
          ligneIds: selectedLignes.length > 0 ? selectedLignes : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      // Navigate back to admin page
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLigneChange = (ligneId: string) => {
    setSelectedLignes(prevSelected => {
      if (prevSelected.includes(ligneId)) {
        return prevSelected.filter(id => id !== ligneId);
      } else {
        return [...prevSelected, ligneId];
      }
    });
  };

  if (!authorized && error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <p className="text-center">Redirecting to dashboard...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New User</h1>
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

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name *</label>
              <input
                id="firstName"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name *</label>
              <input
                id="lastName"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username *</label>
              <input
                id="username"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email *
          </label>
          <input
            id="email"
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
            Phone
          </label>
          <input
            id="phone"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
            Role *
          </label>
          <select
            id="role"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="NORMAL_USER">Normal User</option>
            <option value="CHEF_ATELIER">Chef Atelier</option>
            <option value="QUALITICIEN">Qualiticien</option>
            <option value="SUPERADMIN">Super Admin</option>
          </select>
        </div>

        {(role === "CHEF_ATELIER" || role === "QUALITICIEN") && lignes.length > 0 && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Assign to Lignes
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {lignes.map((ligne) => (
                <div key={ligne.id} className="flex items-center">
                  <input
                    id={`ligne-${ligne.id}`}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={selectedLignes.includes(ligne.id)}
                    onChange={() => handleLigneChange(ligne.id)}
                  />
                  <label htmlFor={`ligne-${ligne.id}`} className="ml-2 text-sm text-gray-700">
                    {ligne.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            A randomly generated password will be sent to the user's email.
          </p>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
