"use server";

import { validateLogin } from "@/lib/validation/login";
import { validateSignup } from "@/lib/validation/signup";
import {
  login,
  logout,
  ServiceUnavailableError,
  signup,
} from "@/services/auth/authService";
import { LoginFormState, Session, SignupFormState } from "@/types/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const errors = validateLogin(email, password);
  if (Object.keys(errors).length > 0) {
    return { errors, values: { email } };
  }

  let result: Session | null;
  try {
    result = await login(email, password);
  } catch (error) {
    console.log(error);
    if (error instanceof ServiceUnavailableError) {
      return {
        message: "Service unavailable, try again later.",
        values: { email, password },
      };
    }
    return {
      message: "Something went wrong. Please try again.",
      values: { email, password },
    };
  }

  console.log(result);
  if (!result) {
    return { message: "Wrong email or password", values: { email, password } };
  }

  // Store the session ID in a cookie the browser sends back on every request
  const cookieStore = await cookies();
  cookieStore.set("session", result.id, {
    httpOnly: true, // JavaScript in the browser cannot read it
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax",
    path: "/",
    expires: new Date(result.expiresAt),
  });

  console.log(result);
  redirect("/");
}

export async function signupAction(
  _prevState: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
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
    if (error instanceof ServiceUnavailableError) {
      return {
        message: "Service unavailable, try again later.",
        values: { email, password },
      };
    }
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

export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (sessionId) {
    try {
      await logout(sessionId);
    } catch (error) {
      console.log(error);
    }
  }

  // Remove the cookie from the browser either way
  cookieStore.delete("session");
  redirect("/login");
}
