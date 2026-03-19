// Type-safe fetch wrapper with runtime validation using Zod schemas
// This eliminates the need for "as" type assertions by validating API responses

import { z } from "zod";

/**
 * Custom error class for validation failures
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly validationErrors: z.ZodError,
    public readonly rawResponse: unknown
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly statusText: string,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Options for validated fetch
 */
export interface ValidatedFetchOptions<TSuccess = unknown, TError = unknown> extends RequestInit {
  /**
   * Zod schema to validate successful responses against
   */
  schema: z.ZodSchema<TSuccess>;
  
  /**
   * Whether to throw on non-OK status codes (default: true)
   */
  throwOnError?: boolean;
  
  /**
   * Optional schema for error responses (when status is not OK)
   * If provided, error responses will be validated against this schema
   */
  errorSchema?: z.ZodSchema<TError>;
}

/**
 * Discriminated union for validated fetch results
 * This allows type-safe handling of success vs error responses
 */
export type ValidatedFetchResult<TSuccess, TError = unknown> =
  | {
      success: true;
      data: TSuccess;
      response: Response;
    }
  | {
      success: false;
      data: TError;
      response: Response;
      status: number;
      statusText: string;
      isValidated: boolean; // true if errorSchema validation succeeded
    };

/**
 * Type-safe fetch wrapper that validates responses using Zod schemas
 * Returns a discriminated union for type-safe handling of success vs error responses
 * 
 * @param url - The URL to fetch from
 * @param options - Fetch options including Zod schemas for validation
 * @returns Discriminated union indicating success or error with validated data
 * @throws ValidationError if response doesn't match schema
 * @throws ApiError if response is not OK and throwOnError is true
 * 
 * @example
 * ```typescript
 * const result = await validatedFetch("/api/auth/send-email-verification", {
 *   method: "POST",
 *   body: JSON.stringify({ email }),
 *   schema: sendEmailVerificationSuccessSchema,
 *   errorSchema: sendEmailVerificationActiveSessionErrorSchema,
 *   throwOnError: false,
 * });
 * 
 * if (result.success) {
 *   // result.data is SendEmailVerificationSuccessResponse
 *   console.log(result.data.expiresAt);
 * } else {
 *   // result.data is SendEmailVerificationActiveSessionErrorResponse (if errorSchema matched)
 *   // or unknown (if errorSchema didn't match)
 *   if (result.isValidated) {
 *     console.log(result.data.expiresAt); // Type-safe access
 *   }
 * }
 * ```
 */
export async function validatedFetch<TSuccess, TError = unknown>(
  url: string,
  options: ValidatedFetchOptions<TSuccess, TError>
): Promise<ValidatedFetchResult<TSuccess, TError>> {
  const { schema, throwOnError = true, errorSchema, ...fetchOptions } = options;

  try {
    const response = await fetch(url, fetchOptions);

    // Parse JSON response
    let jsonData: unknown;
    try {
      jsonData = await response.json();
    } catch (error) {
      throw new ApiError(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : "Unknown error"}`,
        response.status,
        response.statusText
      );
    }

    // Handle error responses
    if (!response.ok) {
      if (throwOnError) {
        // Validate error response if schema provided
        if (errorSchema) {
          const errorResult = errorSchema.safeParse(jsonData);
          if (errorResult.success) {
            throw new ApiError(
              (errorResult.data as { message?: string }).message || "API error occurred",
              response.status,
              response.statusText,
              errorResult.data
            );
          }
        }
        
        // Fallback to generic error
        const message = (jsonData as { message?: string })?.message || response.statusText;
        throw new ApiError(message, response.status, response.statusText, jsonData);
      } else {
        // Return error data without throwing (caller handles it)
        // Validate if errorSchema is provided
        if (errorSchema) {
          const errorResult = errorSchema.safeParse(jsonData);
          if (errorResult.success) {
            return {
              success: false,
              data: errorResult.data,
              response,
              status: response.status,
              statusText: response.statusText,
              isValidated: true,
            };
          }
        }
        // Return unvalidated error data
        return {
          success: false,
          data: jsonData as TError,
          response,
          status: response.status,
          statusText: response.statusText,
          isValidated: false,
        };
      }
    }

    // Validate successful response
    const validationResult = schema.safeParse(jsonData);
    
    if (!validationResult.success) {
      throw new ValidationError(
        `Response validation failed: ${validationResult.error.message}`,
        validationResult.error,
        jsonData
      );
    }

    return {
      success: true,
      data: validationResult.data,
      response,
    };
  } catch (error) {
    // Re-throw ValidationError and ApiError as-is
    if (error instanceof ValidationError || error instanceof ApiError) {
      throw error;
    }
    
    // Wrap other errors
    throw new ApiError(
      `Fetch failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      0,
      "Network Error",
      error
    );
  }
}

/**
 * Helper function for non-throwing validated fetch
 * Useful when you want to handle errors manually
 * Never throws - always returns a result or error object
 */
export async function validatedFetchSafe<TSuccess, TError = unknown>(
  url: string,
  options: ValidatedFetchOptions<TSuccess, TError>
): Promise<ValidatedFetchResult<TSuccess, TError> | { error: ValidationError | ApiError }> {
  try {
    return await validatedFetch<TSuccess, TError>(url, { ...options, throwOnError: false });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof ApiError) {
      return { error };
    }
    return {
      error: new ApiError(
        `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`,
        0,
        "Unknown Error",
        error
      ),
    };
  }
}

