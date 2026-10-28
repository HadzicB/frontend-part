import { logoutAction } from "@/actions/auth/authActions";
import Link from "next/link";
import Button from "./Button";

// Add a page to the nav by adding a line here
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/user", label: "User" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="flex items-center gap-4 sm:gap-8">
        <Link href="/" className="font-bold tracking-tight">
          JobFinder
        </Link>
        <nav className="flex items-center gap-3 text-sm text-zinc-600 sm:gap-5 dark:text-zinc-400">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-black dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <form action={logoutAction}>
        <Button type="submit">Log out</Button>
      </form>
    </header>
  );
}
