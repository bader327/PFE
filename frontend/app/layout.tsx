import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="flex justify-end items-center p-4 gap-4 h-16">
          <Link href="/api/auth/signin" className="text-blue-600 hover:text-blue-800">
            Sign In
          </Link>
        </header>

        {children}
      </body>
    </html>
  );
}
