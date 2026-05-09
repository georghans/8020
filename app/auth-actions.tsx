"use client";

import { signIn, signOut } from "next-auth/react";

export function SignInButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("keycloak", { callbackUrl: "/workspace" })}
      className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
    >
      Sign in
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-950 transition hover:bg-zinc-100"
    >
      Sign out
    </button>
  );
}
