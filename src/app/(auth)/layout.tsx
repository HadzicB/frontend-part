export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mobile first: unprefixed classes are the phone layout (full screen, no card).
  // `sm:` classes apply from 640px up and turn it into a centered card on grey.
  return (
    <div className="flex min-h-dvh items-center justify-center bg-white px-6 py-10 sm:bg-zinc-100 sm:px-4 dark:bg-zinc-900 dark:sm:bg-black">
      <div className="w-full max-w-sm sm:rounded-xl sm:border sm:border-zinc-200 sm:bg-white sm:p-8 sm:shadow-sm dark:sm:border-zinc-800 dark:sm:bg-zinc-900">
        {children}
      </div>
    </div>
  );
}
