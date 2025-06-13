"use client";
import Image from "next/image";
import { useState } from "react";
import CompactCalendar from "./CompactCalendar";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
              <p className="text-sm font-medium text-gray-800">John Doe</p>
              <p className="text-xs text-gray-500">Administrateur</p>
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
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profil
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Paramètres
              </a>
              <hr className="my-1" />
              <a
                href="#"
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Déconnexion
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
