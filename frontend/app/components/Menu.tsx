"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Exemple de nombre de réclamations non lues (à remplacer par appel réel)
const reclamationsCount = 3;

// NOTE: We add NORMAL_USER to basic items so the sidebar is never empty after auth.
const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
  visible: ["SUPERADMIN", "QUALITICIEN", "CHEF_ATELIER", "NORMAL_USER"],
      },
      {
        icon: "/calendar.png",
        label: "Calendar",
        href: "/calendar",
        visible: ["SUPERADMIN"],
      },
      {
        icon: "/parent.png",
        label: "Users",
        href: "/list/users",
        visible: ["SUPERADMIN"],
      },
      ...[1, 2, 3, 4, 5, 6, 7].map((num) => ({
        icon: "/production.png",
        label: `Ligne ${num}`,
        href: `/ligne/${num}`,
        visible: ["SUPERADMIN", "QUALITICIEN"],
      })),
      {
        icon: "/message.png",
        label: "Réclamations Clients",
        href: "/list/reclamations",
        visible: ["SUPERADMIN"],
        notificationCount: reclamationsCount,
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["SUPERADMIN", "QUALITICIEN", "CHEF_ATELIER", "NORMAL_USER"],
      },
    ],
  },
];

const Menu = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/user", { cache: "no-store" });
        if (!res.ok) throw new Error("user fetch failed");
        const data = await res.json();
        if (!ignore) {
          setRole(data?.user?.role || "NORMAL_USER");
        }
      } catch (e) {
        if (!ignore) setRole("NORMAL_USER");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);
  
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>
          {loading && (
            <div className="text-gray-400 text-xs px-2">Loading menu...</div>
          )}
          {!loading && section.items
            .filter(item => role ? item.visible.includes(role) : true)
            .map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className="flex items-center justify-between lg:justify-start gap-4 text-gray-700 py-2 md:px-2 rounded-md hover:bg-blue-100 transition duration-150"
            >
              <div className="flex items-center gap-4">
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </div>

              {/* Badge de notification */}
              {item.notificationCount && item.notificationCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.notificationCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
