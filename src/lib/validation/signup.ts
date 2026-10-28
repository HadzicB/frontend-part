export function validateSignup(email: string, password: string) {
  const errors: Record<string, string[]> = {};

  if (!email.trim()) errors.email = ["This field is required"];
  else if (!email.includes("@")) errors.email = ["Enter a valid email"];

  if (!password) errors.password = ["This field is required"];
  else if (password.length < 8)
    errors.password = ["Password must be at least 8 characters"];

  return errors;
}
