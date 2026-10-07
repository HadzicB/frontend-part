export type ActionState = {
  message?: string; // overall message, e.g. "Wrong email or password"
  errors?: Record<string, string[]>; // per-field, e.g. { email: ["Invalid email"] }
};
