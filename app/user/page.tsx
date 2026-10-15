import { getMe } from "@/services/auth/authService";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserPage() {
  // proxy.ts only checks that the cookie exists; getMe asks the backend
  // whether the session is real and not expired.
  const sessionId = (await cookies()).get("session")?.value;
  const user = sessionId ? await getMe(sessionId) : null;
  if (!user) redirect("/session-expired");

  // TODO: show the real user info (needs a backend endpoint that returns the user).
  return (
    <main className="flex flex-col flex-1 items-center justify-center gap-2 bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-2xl font-semibold">User info</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Protected page. User details will show here.
      </p>
      <Link href="/" className="underline">
        Back to home
      </Link>
    </main>
  );
}
