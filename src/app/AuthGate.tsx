"use client";

"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Login from "./login/page";
import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";

const publicRoutes = ["/login", "/register"];

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkAuth();
    const handleStorage = () => checkAuth();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

 

  // Allow public routes even if not logged in
  if (!isLoggedIn && !publicRoutes.includes(pathname)) return <Login />;

  return (
    <div className="flex min-h-screen">
      {/* Render dashboard layout only for private routes */}
      {!publicRoutes.includes(pathname) && <Sidebar />}
      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        {!publicRoutes.includes(pathname) && <Header />}
        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}