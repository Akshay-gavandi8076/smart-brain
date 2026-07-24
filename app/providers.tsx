"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { dark } from "@clerk/themes";
import React from "react";
import { useTheme } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { clientEnv } from "@/lib/env/client";

const convex = new ConvexReactClient(clientEnv.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <OtherProviders>{children}</OtherProviders>
      </TooltipProvider>
    </ThemeProvider>
  );
}

// TODO:
// `useAuth` from Clerk and `ConvexProviderWithClerk` have incompatible
// TypeScript definitions with the current dependency versions.
// Remove this cast after upgrading Clerk/Convex to compatible versions.
function OtherProviders({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
      publishableKey={clientEnv.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth as any}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
