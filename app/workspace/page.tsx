import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { SignOutButton } from "../auth-actions";

export default async function WorkspacePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-1 bg-zinc-50 px-6 py-10 font-sans text-zinc-950">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div>
            <p className="text-sm font-medium text-zinc-500">8020</p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Workspace
            </h1>
          </div>
          <SignOutButton />
        </header>

        <section className="rounded-md border border-zinc-200 bg-white p-5">
          <h2 className="text-base font-semibold">Signed in</h2>
          <div className="mt-4 space-y-2 text-sm text-zinc-700">
            <p>
              <span className="font-medium text-zinc-950">Name:</span>{" "}
              {session.user?.name ?? "Unknown"}
            </p>
            <p>
              <span className="font-medium text-zinc-950">Email:</span>{" "}
              {session.user?.email ?? "No email returned"}
            </p>
          </div>
        </section>

        <section className="rounded-md border border-zinc-200 bg-white p-5">
          <h2 className="text-base font-semibold">Chat</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Start a protected LiteLLM chat session with the models available to
            this workspace.
          </p>
          <Link
            href="/workspace/chat"
            className="mt-4 inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Open chat
          </Link>
        </section>
      </main>
    </div>
  );
}
