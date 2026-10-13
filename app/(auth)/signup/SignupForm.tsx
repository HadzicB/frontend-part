"use client";
import { signupAction } from "@/actions/auth/authActions";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { validateSignup } from "@/lib/validation/signup";
import { ActionState } from "@/types/auth";
import Link from "next/link";
import { SubmitEvent, useActionState, useState } from "react";

export default function SignupForm() {
  const initialState: ActionState = {};

  const [state, formAction, pending] = useActionState(
    signupAction,
    initialState,
  );

  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>(
    {},
  );

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const errors = validateSignup(
      String(formData.get("email") ?? ""),
      String(formData.get("password") ?? ""),
    );
    setClientErrors(errors);

    if (Object.keys(errors).length > 0) {
      e.preventDefault();
    }
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full max-w-sm flex-col gap-2"
    >
      <p role="alert" className="min-h-5 text-sm text-red-600">
        {state.message}
      </p>
      <TextInput
        label="Email"
        name="email"
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
      <Button type="submit" loading={pending} loadingText="Creating account...">
        Sign up
      </Button>
      <p className="text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
