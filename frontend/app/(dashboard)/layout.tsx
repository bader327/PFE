import Image from "next/image";
import Link from "next/link";
import Menu from "../components/Menu";
import Navbar from "../components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[16%] p-6 bg-white shadow-md">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-3 mb-6"
        >
          <Image src="/coficab.png" alt="Coficab Logo" width={70} height={70} />
          <span className="hidden lg:block text-xl font-extrabold text-[#003366]">
            FPS App
          </span>
        </Link>
        <Menu />
      </div>

      {/* RIGHT */}
      <div className="w-[84%] bg-[#F7F8FA] overflow-auto flex flex-col">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
