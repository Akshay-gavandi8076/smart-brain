"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user !== undefined && !isSignedIn) {
      router.push("/"); // redirect if not signed in
    }
  }, [isSignedIn, user, router]);

  if (!isSignedIn) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-md dark:bg-zinc-800">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          <span className="text-lg font-medium text-zinc-700 dark:text-zinc-200">
            Checking authentication...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
