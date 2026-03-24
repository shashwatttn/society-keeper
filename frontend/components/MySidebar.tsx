"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenuItem,
  SidebarFooter,
} from "./ui/sidebar";

import navData from "@/utilities/navData";
import Link from "next/link";

type Role = "admin" | "resident";

const MySidebar = ({ role }: { role: Role }) => {
  const pathname = usePathname();

  const router = useRouter();

  const logoutHandler = () => {
    localStorage.removeItem("user");
    router.replace("/sign-in");
  };

  return (
    <Sidebar className="bg-black border-r border-white/10 text-white w-64">
      <SidebarHeader className="text-2xl font-semibold px-6 py-5 border-b border-white/10">
       Society Keeper | {role}
      </SidebarHeader>

      <SidebarContent className="p-3 space-y-1 list-none">
        {navData[role].features.map((feature) => {
          const isActive = pathname.startsWith(feature.path);

          return (
            <SidebarMenuItem key={feature.id}>
              <Link
                href={feature.path}
                className={`
                  flex items-center w-full px-4 py-3 rounded-2xl text-lg
                  transition-all duration-200

                  ${
                    isActive
                      ? "bg-white/10 text-white font-medium border-l-4 border-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {feature.name}
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-white/10 list-none">
        <SidebarMenuItem>
          <button 
          onClick={logoutHandler}
          className="w-full 
          px-4 py-3 rounded-xl
           bg-red-800 text-white
            hover:bg-red-500 transition">
            Logout
          </button>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MySidebar;
