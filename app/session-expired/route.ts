import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Pages can't delete cookies, route handlers can. A page whose session the
// backend rejected (fake, expired, logged out) sends the user here.
// Without deleting the cookie, proxy.ts would bounce them back from /login.
export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}
