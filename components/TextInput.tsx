type TextInputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  defaultValue?: string;
};

export default function TextInput({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  error,
  defaultValue,
}: TextInputProps) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={!!error}
        className="rounded border border-zinc-300 px-3 py-2 font-normal aria-invalid:border-red-500 dark:border-zinc-700 dark:bg-zinc-900"
      />
      <span className="min-h-4 font-normal text-red-600">{error}</span>
    </label>
  );
}
