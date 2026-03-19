/**
 * URL helpers for Agency Website and other URL fields.
 * Reusable in frontend validation and payload building; use the same logic on the backend.
 */

/**
 * Ensures the URL has a protocol. If the input has no "http://" or "https://",
 * prepends "https://". Does not validate the URL.
 * @param value - Raw input (e.g. "test.com", "www.test.com", "https://test.com")
 * @returns Normalized URL with protocol, or "" if input is empty/whitespace
 */
export function normalizeUrl(value: string | undefined): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Validates that the (optionally protocol-less) URL is valid after normalization.
 * Accepts: test.com, www.test.com, subdomain.test.com, https://test.com, http://test.com
 * Rejects: test, abc, http://, https://, test..com
 * @param value - Raw input (will be normalized before validation)
 * @returns true if the normalized URL is valid
 */
export function isValidUrl(value: string | undefined): boolean {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return false;

  const withProtocol = normalizeUrl(trimmed);
  if (!withProtocol) return false;

  try {
    const url = new URL(withProtocol);
    const protocol = url.protocol.toLowerCase();
    if (protocol !== "http:" && protocol !== "https:") return false;

    const hostname = url.hostname;
    if (!hostname || hostname.length === 0) return false;
    // Require at least one dot (reject "test", "abc")
    if (!hostname.includes(".")) return false;
    // Reject consecutive dots (e.g. "test..com")
    if (hostname.includes("..")) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Form validation helper for Agency Website (and similar URL fields).
 * Use in react-hook-form validate or zod.
 * @param value - Raw field value
 * @param required - Whether the field is required when shown
 * @returns true if valid, or an error message string
 */
export function validateAgencyWebsiteUrl(
  value: string | undefined,
  required: boolean
): true | string {
  const v = value?.trim();
  if (!v) return required ? "Field is required" : true;
  if (!isValidUrl(v)) {
    return "Enter a valid URL (e.g. www.example.com or https://example.com)";
  }
  return true;
}

/*
 * Example usage in a form submission handler:
 *
 * // 1) Validate in react-hook-form (e.g. PrivateFeedbackFields):
 * {...register("agencyWebsite", {
 *   validate: (v) => validateAgencyWebsiteUrl(v, deliveryMethod === DeliveryMethod.ONLINE),
 * })}
 *
 * // 2) Normalize and include in payload before submit (e.g. buildSmrcPayloadFromFormData):
 * agencyWebsite: (() => {
 *   const normalized = normalizeUrl(data.agencyWebsite);
 *   return normalized || undefined;
 * })(),
 *
 * // 3) Backend (e.g. create-smrc.dto.ts): use normalizeUrl in transform and isValidUrl in refine.
 */
