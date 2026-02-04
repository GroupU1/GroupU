"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../backend/convex/_generated/api";

function AuthenticatedRedirect() {
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (currentUser === undefined) return;
    if (currentUser) {
      router.replace("/home");
    } else {
      router.replace("/new-account");
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div>
      <AuthLoading>
        <div className="min-h-screen w-full flex items-center justify-center p-6">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </AuthLoading>

      <Unauthenticated>
        <div className="min-h-screen w-full flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Welcome to GroupU</h1>
              <p className="text-sm text-muted-foreground">
                Sign in or create an account to continue.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <SignInButton mode="modal">
                <Button>Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="secondary">Sign Up</Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <AuthenticatedRedirect />
      </Authenticated>
    </div>
  );
}
