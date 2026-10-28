"use client";
import { loginAction } from "@/actions/auth/authActions";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { validateLogin } from "@/lib/validation/login";
import { LoginFormState } from "@/types/auth";
import Link from "next/link";
import { SubmitEvent, useActionState, useState } from "react";

export default function LoginForm() {
  const initialState: LoginFormState = {};

  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>(
    {},
  );

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const errors = validateLogin(
      String(formData.get("email") ?? ""),
      String(formData.get("password") ?? ""),
    );
    setClientErrors(errors);

    if (Object.keys(errors).length > 0) {
      e.preventDefault();
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <span className="text-lg font-bold tracking-tight">JobFinder</span>
        <h1 className="mt-4 text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Log in to see your job matches.
        </p>
      </div>
      <form
        action={formAction}
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-col gap-2"
      >
        <p role="alert" className="min-h-5 text-sm text-red-600">
          {state.message}
        </p>
        <TextInput
          label="Email"
          name="email"
          type="email"
          required
          defaultValue={state.values?.email}
          error={clientErrors.email?.[0] ?? state.errors?.email?.[0]}
        />
        <TextInput
          label="Password"
          name="password"
          type="password"
          required
          defaultValue={state.values?.password}
          error={clientErrors.password?.[0] ?? state.errors?.password?.[0]}
        />
        <Button type="submit" loading={pending} loadingText="Logging in...">
          Log in
        </Button>
        <p className="mt-2 text-center text-sm">
          No account yet?{" "}
          <Link href="/signup" className="font-medium underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
