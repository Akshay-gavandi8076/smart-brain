"use client";

import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import Header from "./header";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function LandingPage() {
  const { isSignedIn } = useUser();

  const words = [
    {
      text: "Smart",
    },
    {
      text: "Brain",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <>
      <Header />

      <div className="relative flex h-full w-full items-center justify-center bg-white bg-dot-black/[0.2] dark:bg-black dark:bg-dot-white/[0.2]">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
        <div className="flex max-w-fit flex-col items-center justify-center gap-4">
          <Image
            src="/logo.png"
            width={150}
            height={150}
            className="rounded"
            alt="an image of a brain"
          />
          <TypewriterEffect words={words} />
          <p className="relative max-w-prose bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-xl font-bold text-transparent">
            Unlock the power of seamless organization and lightning-fast
            retrieval with Smart Brain. Whether you&apos;re jotting down notes,
            uploading files, or searching for information instantly, our
            intelligent platform is designed to enhance your productivity like
            never before.
          </p>
          {isSignedIn ? (
            <Link
              className={buttonVariants({
                size: "lg",
                className: "mt-5",
                variant: "newButton",
              })}
              href="/dashboard/documents"
            >
              Get started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          ) : (
            <SignInButton
              forceRedirectUrl="/dashboard/documents"
              signUpForceRedirectUrl="/dashboard/documents"
              mode="modal"
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
