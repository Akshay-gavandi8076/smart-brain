"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LogIn,
  MoonIcon,
  SunIcon,
  Menu,
  X,
  FilesIcon,
  ClipboardPenIcon,
} from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";

export default function MobileHeader() {
  const { setTheme, resolvedTheme } = useTheme();
  const { isSignedIn } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const isDarkMode = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-white p-4 dark:bg-black sm:hidden">
        <Link href="/">
          <Image
            src="/logo.png"
            width={25}
            height={25}
            className="rounded"
            alt="an image of a brain"
          />
        </Link>
        <motion.button
          onClick={toggleMenu}
          className="rounded-full bg-white p-2 text-gray-700 shadow-lg dark:bg-black dark:text-white dark:shadow-zinc-700"
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-x-0 top-14 z-40 bg-white shadow-md dark:bg-black sm:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-start space-y-4 p-4">
              {isSignedIn && (
                <>
                  <Link
                    href="/dashboard/documents"
                    className="flex items-center text-sm font-semibold hover:text-accent-foreground"
                    onClick={toggleMenu}
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <FilesIcon className="mr-2 h-4 w-4" />
                      Documents
                    </motion.span>
                  </Link>
                  <Link
                    href="/dashboard/notes"
                    className="flex items-center text-sm font-semibold hover:text-accent-foreground"
                    onClick={toggleMenu}
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <ClipboardPenIcon className="mr-2 h-4 w-4" />
                      Notes
                    </motion.span>
                  </Link>
                </>
              )}
              <hr className="my-2 w-full border-t" />

              <motion.div
                onClick={toggleTheme}
                className="flex cursor-pointer items-center text-sm font-semibold hover:text-accent-foreground"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isDarkMode ? (
                  <>
                    <SunIcon className="mr-2 h-4 w-4" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <MoonIcon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                  </>
                )}
              </motion.div>
              <hr className="my-2 w-full border-t" />

              <SignedOut>
                <SignInButton
                  forceRedirectUrl="/dashboard"
                  signUpForceRedirectUrl="/dashboard"
                  mode="modal"
                >
                  <Button
                    className="flex items-center justify-center gap-2 font-semibold hover:text-accent-foreground"
                    variant="outline"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign In
                    </motion.span>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
