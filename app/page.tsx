import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-4 bg-zinc-50 font-sans dark:bg-black">
      Home page
      <Link href="/login" className="underline">
        Login
      </Link>
    </div>
  );
}
