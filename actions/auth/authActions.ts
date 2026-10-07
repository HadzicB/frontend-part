"use server";

import { login } from "@/services/auth/authService";
import { ActionState } from "@/types/auth";
import { redirect } from "next/navigation";

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await login(email, password);

  if (!result) {
    return { message: "Dont do that" };
  }

  console.log(result);
  redirect("/");
}
