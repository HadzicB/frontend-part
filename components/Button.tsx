type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
};

export default function Button({
  children,
  type = "button",
  disabled = false,
  loading = false,
  loadingText,
}: ButtonProps) {
  return (
    <button
      type={type}
      // loading implies disabled, so the user can't submit twice
      disabled={disabled || loading}
      aria-busy={loading}
      className="rounded bg-black px-4 py-2 text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
    >
      {loading && loadingText ? loadingText : children}
    </button>
  );
}
