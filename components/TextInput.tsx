type TextInputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
};

export default function TextInput({
  label,
  name,
  type = "text",
  placeholder,
}: TextInputProps) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="rounded border border-zinc-300 px-3 py-2 font-normal dark:border-zinc-700 dark:bg-zinc-900"
      />
    </label>
  );
}
