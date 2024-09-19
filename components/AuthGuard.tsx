"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn && user !== undefined) {
      router.push("/");
    }
  }, [isSignedIn, user, router]);

  if (!isSignedIn) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
