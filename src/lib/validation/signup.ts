export function validateSignup(
  email: string,
  password: string,
  confirmPassword?: string,
) {
  const errors: Record<string, string[]> = {};

  if (!email.trim()) errors.email = ["This field is required"];
  else if (!email.includes("@")) errors.email = ["Enter a valid email"];

  if (!password) errors.password = ["This field is required"];
  else if (password.length < 8)
    errors.password = ["Password must be at least 8 characters"];

  // undefined = caller doesn't have a confirm field (skip the check)
  if (confirmPassword !== undefined && confirmPassword !== password)
    errors.confirmPassword = ["Passwords do not match"];

  return errors;
}
