import { logoutAction } from "@/actions/auth/authActions";
import Button from "@/components/Button";

export default function Home() {
  // TODO: once auth exists, this page is protected (only logged-in users)
  // and the user's name/email comes from the session.
  return (
    <>
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-3 dark:border-zinc-800">
        <span className="font-semibold">My App</span>
        <form action={logoutAction}>
          <Button type="submit">Log out</Button>
        </form>
      </header>
      <main className="flex flex-col flex-1 items-center justify-center gap-2 bg-zinc-50 font-sans dark:bg-black">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-zinc-600 dark:text-zinc-400">You are logged in.</p>
      </main>
    </>
  );
}
