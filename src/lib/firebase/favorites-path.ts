/**
 * Firebase Realtime Database path encoding for favorites.
 * Paths cannot contain ".", "#", "$", "[", or "]".
 * userId is often an email (e.g. user@example.com), so we encode it to a safe key.
 */

/**
 * Encode userId to a Firebase-safe path segment (base64url, no padding).
 * Use this when building ref(database, `favorites/${encoded}`).
 */
export function encodeUserIdForFavoritesPath(userId: string): string {
  const base64 = Buffer.from(userId, "utf8").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
