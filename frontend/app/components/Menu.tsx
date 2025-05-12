import Image from "next/image";
import Link from "next/link";
import { role } from "../lib/data";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: [
          "admin",
          "Ligne 1 ",
          "Ligne 2 ",
          "Ligne 3 ",
          "Ligne 4 ",
          "Ligne 5 ",
          "Ligne 6 ",
          "Ligne 7 ",
        ],
      },
      {
        icon: "/parent.png",
        label: "USERS",
        href: "/list/teachers",
        visible: ["admin"],
      },
      {
        icon: "/production.png",
        label: " Ligne 1",
        href: "/ligne/1 ",
        visible: ["admin", "Ligne1"],
      },
      {
        icon: "/production.png",
        label: "Ligne 2",
        href: "/ligne/2",
        visible: ["admin", "ligne 2"],
      },
      {
        icon: "/production.png",
        label: "Ligne 3",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "/production.png",
        label: "Ligne 3",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/production.png",
        label: "Ligne 4",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/production.png",
        label: "Ligne 5",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/production.png",
        label: "Ligne 6",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/production.png",
        label: "Ligne 7",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },

      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/messages",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
