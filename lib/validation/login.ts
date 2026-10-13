export function validateLogin(email: string, password: string) {
  const errors: Record<string, string[]> = {};

  if (!email.trim()) errors.email = ["This field is required"];
  if (!password) errors.password = ["This field is required"];

  return errors;
}
