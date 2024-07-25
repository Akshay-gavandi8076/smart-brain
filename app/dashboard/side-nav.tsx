"use client";

import React from "react";
import {
  LogOut,
  Search,
  Menu,
  X,
  MoonIcon,
  SunIcon,
  Home,
  FilesIcon,
  ClipboardPenIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useClerk } from "@clerk/nextjs";

const sidebarItemsSetOne = [
  { name: "Home", href: "/", icon: Home },
  { name: "Search", href: "/dashboard/search", icon: Search },
  { name: "Documents", href: "/dashboard/documents", icon: FilesIcon },
  { name: "Notes", href: "/dashboard/notes", icon: ClipboardPenIcon },
];

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, toggleSidebar }) => {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const { signOut } = useClerk();
  const isDarkMode = resolvedTheme === "dark";
  const router = useRouter();

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const handleSignOut = () => {
    signOut().then(() => {
      router.push("/");
    });
  };

  return (
    <div className="relative">
      <div
        className={`fixed left-0 top-0 h-full transform shadow-[0_10px_10px_rgba(8,_112,_184,_0.7)] transition-transform duration-300 ease-in-out ${
          isExpanded ? "w-52 translate-x-0" : "w-16"
        }`}
      >
        <nav className="flex h-full flex-col items-start p-2">
          <div className="mt-4 flex w-full items-center justify-between px-2">
            <button onClick={toggleSidebar} className="focus:outline-none">
              {isExpanded ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
          <hr className="my-2 w-full border-t" />
          {sidebarItemsSetOne.map((item, index) => (
            <Link key={index} href={item.href} className="w-full">
              <span
                className={cn(
                  "group flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent" : "bg-transparent",
                )}
              >
                <item.icon className="h-5 w-5" />
                {isExpanded && <span className="ml-2">{item.name}</span>}
              </span>
            </Link>
          ))}

          <div className="mt-auto w-full">
            <div
              onClick={toggleTheme}
              className="flex w-full cursor-pointer items-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
              {isExpanded && (
                <span className="ml-2">{isDarkMode ? "Light" : "Dark"}</span>
              )}
            </div>
            <hr className="my-2 w-full border-t" />
            <div
              onClick={handleSignOut}
              className="mb-2 flex w-full cursor-pointer items-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="h-5 w-5" />
              {isExpanded && <span className="ml-2">Log Out</span>}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
