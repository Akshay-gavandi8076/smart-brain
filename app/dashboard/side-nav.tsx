"use client";

import { cn } from "@/lib/utils";
import {
  ClipboardPenIcon,
  Cog,
  FilesIcon,
  Home,
  MoonIcon,
  Search,
  SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();

  const isDarkMode = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <nav>
      <ul className="space-y-6">
        <li>
          <Link
            className={cn(
              "flex items-center gap-2 text-xl font-light hover:text-blue-300",
              {
                "text-blue-500": pathname.endsWith("/search"),
              },
            )}
            href="/"
          >
            <Home /> Home
          </Link>
        </li>
        <li>
          <Link
            className={cn(
              "flex items-center gap-2 text-xl font-light hover:text-blue-300",
              {
                "text-blue-500": pathname.endsWith("/search"),
              },
            )}
            href="/dashboard/search"
          >
            <Search /> Search
          </Link>
        </li>
        <li>
          <Link
            className={cn(
              "flex items-center gap-2 text-xl font-light hover:text-blue-300",
              {
                "text-blue-500": pathname.endsWith("/documents"),
              },
            )}
            href="/dashboard/documents"
          >
            <FilesIcon /> Documents
          </Link>
        </li>
        <li>
          <Link
            className={cn(
              "flex items-center gap-2 text-xl font-light hover:text-blue-300",
              {
                "text-blue-500": pathname.endsWith("/notes"),
              },
            )}
            href="/dashboard/notes"
          >
            <ClipboardPenIcon /> Notes
          </Link>
        </li>
        <li>
          <Link
            className={cn(
              "flex items-center gap-2 text-xl font-light hover:text-blue-300",
              {
                "text-blue-500": pathname.endsWith("/settings"),
              },
            )}
            href="/dashboard/settings"
          >
            <Cog /> Setting
          </Link>
        </li>
        <li>
          <div
            onClick={toggleTheme}
            className="flex cursor-pointer items-center gap-2 rounded-md text-xl hover:text-blue-300"
          >
            {isDarkMode ? (
              <>
                <SunIcon /> Light
              </>
            ) : (
              <>
                <MoonIcon /> Dark
              </>
            )}
          </div>
        </li>
      </ul>
    </nav>
  );
}
