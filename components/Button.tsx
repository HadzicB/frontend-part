type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
};

export default function Button({ children, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      className="rounded bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
    >
      {children}
    </button>
  );
}
