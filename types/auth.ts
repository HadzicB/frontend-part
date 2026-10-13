export type SignupResult = {
  success: boolean;
  errors?: Record<string, string[]>; // field errors sent by the backend (400/409)
};

export type ActionState = {
  message?: string; // overall message, e.g. "Wrong email or password"
  errors?: Record<string, string[]>; // per-field, e.g. { email: ["Invalid email"] }
  values?: { email?: string; password?: string }; // submitted values to refill the form
};
