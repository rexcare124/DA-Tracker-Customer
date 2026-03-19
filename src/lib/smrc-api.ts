/**
 * SMRC server API base URL for client-side fetches.
 * Always use same-origin path so requests are allowed by CSP connect-src 'self'.
 * Next.js App Routes (e.g. validate-agency-level-review) handle some paths; rewrites in next.config
 * proxy remaining /api/smrc/* to the Express server.
 */
export function getSmrcApiBase(): string {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/smrc`;
}
