export async function login(email: string, password: string): Promise<boolean> {
  console.log({ email }, { password });
  // TODO: call backend with email and password

  if (email === "asd") {
    return false;
  }
  return true;
}
