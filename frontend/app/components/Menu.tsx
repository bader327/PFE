"use client";
import Image from "next/image";
import Link from "next/link";
import { role } from "../lib/data";

// Exemple de nombre de réclamations non lues (à remplacer par appel réel)
const reclamationsCount = 3;

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin"],
      },
      {
        icon: "/parent.png",
        label: "Users",
        href: "/list/users",
        visible: ["admin"],
      },
      ...[1, 2, 3, 4, 5, 6, 7].map((num) => ({
        icon: "/production.png",
        label: `Ligne ${num}`,
        href: `/ligne/${num}`,
        visible: ["admin"],
      })),
      {
        icon: "/message.png",
        label: "Réclamations Clients",
        href: "/list/reclamations",
        visible: ["admin"],
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
        visible: ["admin"],
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>
          {section.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
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
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
