"use server";

import { validateLogin } from "@/lib/validation/login";
import { validateSignup } from "@/lib/validation/signup";
import { login, signup } from "@/services/auth/authService";
import { ActionState } from "@/types/auth";
import { redirect } from "next/navigation";

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const errors = validateLogin(email, password);
  if (Object.keys(errors).length > 0) {
    return { errors, values: { email } };
  }

  let result: boolean;
  try {
    result = await login(email, password);
  } catch (error) {
    console.log(error);
    return {
      message: "Something went wrong. Please try again.",
      values: { email, password },
    };
  }

  console.log(result);
  if (!result) {
    return { message: "Wrong email or password", values: { email, password } };
  }

  console.log(result);
  redirect("/");
}

export async function signupAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const errors = validateSignup(email, password);
  if (Object.keys(errors).length > 0) {
    return { errors, values: { email } };
  }

  let result;
  try {
    result = await signup(email, password);
  } catch (error) {
    console.log(error);
    return {
      message: "Something went wrong. Please try again.",
      values: { email, password },
    };
  }

  if (!result.success) {
    return { errors: result.errors, values: { email, password } };
  }

  // redirect() throws internally, so it must be outside try/catch
  redirect("/login");
}
