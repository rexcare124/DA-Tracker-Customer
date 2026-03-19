/**
 * Format a nullable string for UI display.
 *
 * - Returns `—` when the value is missing, null, or empty after trimming.
 * - Otherwise returns the trimmed string.
 */
export function formatNullableString(value: string | null | undefined): string {
  if (value == null) return "—";
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "—";
}

