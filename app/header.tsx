"use client";

import React from "react";
import Link from "next/link";
import { LogIn, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Authenticated, AuthLoading } from "convex/react";
import Image from "next/image";

export default function Header() {
  const { setTheme, resolvedTheme } = useTheme();
  const { isSignedIn } = useUser();

  const isDarkMode = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <div className="fixed inset-x-0 top-10 z-50 mx-auto max-w-2xl">
      <div className="relative flex items-center justify-between space-x-6 rounded-full border bg-white px-6 py-2 shadow-md dark:border-white/[0.2] dark:bg-black">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-xl">
            <Image
              src="/logo.png"
              width={25}
              height={25}
              className="rounded"
              alt="an image of a brain"
            />

            <span className="hidden text-lg font-semibold sm:inline">
              Smart <span className="text-blue-500">Brain</span>
            </span>
          </Link>
          {isSignedIn && (
            <div className="flex gap-4">
              <Link
                href="/dashboard/documents"
                className="text-sm font-semibold hover:text-slate-500"
              >
                Documents
              </Link>
              <Link
                href="/dashboard/notes"
                className="text-sm font-semibold hover:text-slate-500"
              >
                Notes
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div
            onClick={toggleTheme}
            className="flex cursor-pointer items-center rounded-md text-sm font-semibold hover:text-slate-500"
          >
            {isDarkMode ? (
              <>
                <SunIcon className="h-4 w-4 font-semibold" />
                <span className="ml-2 hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <MoonIcon className="h-4 w-4 font-semibold" />
                <span className="ml-2 hidden sm:inline">Dark</span>
              </>
            )}
          </div>
          <SignedOut>
            <SignInButton
              forceRedirectUrl="/dashboard"
              signUpForceRedirectUrl="/dashboard"
              mode="modal"
            >
              <Button
                className="flex items-center justify-center gap-2"
                variant="outline"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Authenticated>
              <UserButton showName />
            </Authenticated>
            <AuthLoading>Loading...</AuthLoading>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
