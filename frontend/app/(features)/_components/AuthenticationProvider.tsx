"use client";

import React, { useEffect, useState } from "react";
import MySidebar from "@/components/MySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useRouter, usePathname } from "next/navigation";

const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<any>(null);

  useEffect(() => {
    try {
      const userFromStorage = localStorage.getItem("user");
      if (!userFromStorage) {
        router.replace("/sign-in");
        return;
      }

      const parsedUser = JSON.parse(userFromStorage);
      const token = parsedUser?.token || parsedUser?.user?.token;
      const role = parsedUser?.user?.role || parsedUser?.role;

      if (!parsedUser || !token) {
        router.replace("/sign-in");
        return;
      }

      setUserRole(role);
      setLoading(false);

      // Redirect if the user is not in their respective role's dashboard area
      if (role === "admin" && !pathname.includes("/admin")) {
        router.replace("/admin/dashboard");
      } else if (role === "resident" && !pathname.includes("/resident")) {
        router.replace("/resident/dashboard");
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      router.replace("/sign-in");
    }
  }, [pathname, router]);

  if (loading) {
    return null; // Wait until authentication check is complete
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <MySidebar role={userRole} />
        <div className="flex-1 w-full overflow-y-auto">{children}</div>
      </div>
    </SidebarProvider>
  );
};

export default AuthenticationProvider;