import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { SignInButton } from "./auth-actions";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/workspace");
  }

  return (
    <div className="flex flex-1 bg-zinc-50 px-6 py-10 font-sans text-zinc-950">
      <main className="mx-auto flex w-full max-w-3xl flex-col justify-center gap-8">
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-500">8020</p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight">
            Sign in to your workspace
          </h1>
          <p className="max-w-lg text-base leading-7 text-zinc-600">
            Use your 8020 account to access the private workspace.
          </p>
        </div>

        <div>
          <SignInButton />
        </div>
      </main>
    </div>
  );
}
