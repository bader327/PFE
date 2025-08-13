"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CompactCalendar from "./CompactCalendar";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch user data when component mounts
    async function fetchUserData() {
      try {
        const response = await fetch("/api/auth/user");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser({
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              role: data.user.role
            });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleLogout = () => {
    router.push("/logout");
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

  return (
    <nav className="bg-white px-4 py-3 shadow-sm rounded-xl flex items-center justify-between relative">
      {/* Titre Dashboard */}
      <div className="text-lg font-semibold text-gray-800">Dashboard</div>

      {/* Barre de recherche (Desktop uniquement) */}
      <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-full w-[250px]">
        <Image
          src="/search.png"
          alt="Search Icon"
          width={16}
          height={16}
          className="opacity-60"
        />
        <input
          type="text"
          placeholder="Rechercher..."
          className="ml-2 bg-transparent outline-none text-sm w-full text-gray-700"
        />
      </div>
      
      {/* Calendar Events Notifications */}
      <div className="hidden md:block">
        <CompactCalendar />
      </div>

      {/* Utilisateur avec dropdown */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2"
          >
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {loading ? "Loading..." : user ? `${user.firstName} ${user.lastName}` : "Guest"}
              </p>
              <p className="text-xs text-gray-500">
                {loading ? "" : user ? getRoleLabel(user.role) : "Not logged in"}
              </p>
            </div>
            <Image
              src="/avatar.png"
              alt="User"
              width={40}
              height={40}
              className="rounded-full border border-gray-200"
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profil
              </a>
              {user?.role === "SUPERADMIN" && (
                <a
                  href="/admin"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Administration
                </a>
              )}
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
