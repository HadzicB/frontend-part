"use client";
import { loginAction } from "@/actions/auth/authActions";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { ActionState } from "@/types/auth";
import { useActionState } from "react";

export default function LoginForm() {
  const initialState: ActionState = {};

  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <TextInput label="Email" name="email" />
      <TextInput label="Password" name="password" type="password" />
      <Button type="submit">Log in</Button>
    </form>
  );
}
