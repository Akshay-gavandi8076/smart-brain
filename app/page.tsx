"use client";

/**
 * This page MUST be a client component because:
 * - It uses Clerk's `useUser`
 * - It uses animated UI (TypewriterEffect)
 */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Header from "./header";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";

/**
 * IMPORTANT:
 * TypewriterEffect is animated and time-based.
 * Rendering it on the server causes HTML mismatch.
 *
 * Solution:
 * Disable SSR using dynamic import.
 * This guarantees it only renders on the client.
 */
const TypewriterEffect = dynamic(
  () =>
    import("@/components/ui/typewriter-effect").then(
      (mod) => mod.TypewriterEffect,
    ),
  { ssr: false },
);

export default function LandingPage() {
  /**
   * Clerk auth state is NOT reliable during server render.
   * On the server, isSignedIn is unknown.
   * On the client, it updates after hydration.
   *
   * This causes a hydration mismatch if rendered immediately.
   */
  const { isSignedIn } = useUser();

  /**
   * `mounted` ensures that:
   * - Server render outputs nothing
   * - First client render outputs nothing
   * - UI renders ONLY after hydration completes
   *
   * This is the most reliable fix for auth-based hydration issues.
   */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * CRITICAL:
   * Prevents mismatched HTML between server and client.
   */
  if (!mounted) {
    return null;
  }

  /**
   * Static data is safe and deterministic
   */
  const words = [
    { text: "Smart" },
    {
      text: "Brain",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <>
      {/* Header must also be hydration-safe */}
      <Header />

      <div className="relative flex h-full w-full items-center justify-center bg-white bg-dot-black/[0.2] dark:bg-black dark:bg-dot-white/[0.2]">
        {/* Background mask */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

        <div className="flex max-w-fit flex-col items-center justify-center gap-4">
          {/* Logo is static → safe for SSR */}
          <Image
            src="/logo.png"
            width={150}
            height={150}
            className="rounded"
            alt="an image of a brain"
            priority
          />

          {/* Client-only animated component */}
          <TypewriterEffect words={words} />

          <p className="relative max-w-prose bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text px-6 text-center text-xl font-bold leading-relaxed text-transparent md:px-12">
            Unlock the power of seamless organization and lightning-fast
            retrieval with Smart Brain. Whether you&apos;re jotting down notes,
            uploading files, or searching for information instantly, our
            intelligent platform is designed to enhance your productivity like
            never before.
          </p>

          {/* 
            Auth-dependent UI:
            Safe now because rendering only happens AFTER hydration
          */}
          {isSignedIn ? (
            <Link
              href="/dashboard/jobs"
              className={buttonVariants({
                size: "lg",
                variant: "newButton",
                className: "mt-5",
              })}
            >
              Get started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          ) : (
            <SignInButton
              mode="modal"
              forceRedirectUrl="/dashboard/jobs"
              signUpForceRedirectUrl="/dashboard/jobs"
            >
              <Button variant="newButton" size="lg">
                Get started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </>
  );
}
