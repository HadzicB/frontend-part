import { SignupResult } from "@/types/auth";

export async function login(email: string, password: string): Promise<boolean> {
  console.log({ email }, { password });
  const res = await fetch(`${process.env.API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  // 401 = wrong credentials (expected). Anything else is a real failure.
  if (res.status === 401) return false;
  if (!res.ok) throw new Error(`Login failed with status ${res.status}`);
  return true;
}

export async function signup(
  email: string,
  password: string,
): Promise<SignupResult> {
  const res = await fetch(`${process.env.API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) return { success: true };

  // 400 (validation) and 409 (email taken) carry field errors
  if (res.status === 400 || res.status === 409) {
    const data = await res.json();
    return { success: false, errors: data.errors };
  }
  throw new Error(`Signup failed with status ${res.status}`);
}
