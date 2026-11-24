/**
 * Auth integration point.
 *
 * The layout and middleware are "auth-ready": they only depend on `getSession()`.
 * This starter ships with a demo session so it runs with zero config. To add real auth,
 * implement `getSession()` with Auth.js (NextAuth), Clerk, Supabase Auth, Cognito, etc.,
 * and set AUTH_REQUIRED=true so middleware.ts redirects anonymous users to /login.
 */
export interface Session {
  user: { name: string; email: string; role: "owner" | "admin" | "member" };
}

export const SESSION_COOKIE = "session";

export async function getSession(): Promise<Session | null> {
  return { user: { name: "Demo User", email: "demo@example.com", role: "owner" } };
}
