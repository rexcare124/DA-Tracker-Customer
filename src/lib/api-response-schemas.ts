// API Response Schemas for type-safe API responses
// These schemas ensure runtime validation matches TypeScript types

import { z } from "zod";

/**
 * Schema for successful email verification code send response
 */
export const sendEmailVerificationSuccessSchema = z.object({
  message: z.string(),
  expiresAt: z.string().refine(
    (dateString) => !isNaN(new Date(dateString).getTime()),
    { message: "Invalid ISO date string" }
  ),
  timeRemaining: z.number().int().min(0),
});

export type SendEmailVerificationSuccessResponse = z.infer<typeof sendEmailVerificationSuccessSchema>;

/**
 * Schema for email verification error response (409 Conflict - Active Session)
 */
export const sendEmailVerificationActiveSessionErrorSchema = z.object({
  message: z.string(),
  code: z.literal("ACTIVE_SESSION_EXISTS"),
  timeRemaining: z.number().int().min(0),
  expiresAt: z.string().refine(
    (dateString) => !isNaN(new Date(dateString).getTime()),
    { message: "Invalid ISO date string" }
  ),
});

export type SendEmailVerificationActiveSessionErrorResponse = z.infer<typeof sendEmailVerificationActiveSessionErrorSchema>;

/**
 * Schema for email verification error response (429 Too Many Requests)
 */
export const sendEmailVerificationRateLimitErrorSchema = z.object({
  message: z.string(),
  retryAfter: z.number().int().min(0).optional(),
});

export type SendEmailVerificationRateLimitErrorResponse = z.infer<typeof sendEmailVerificationRateLimitErrorSchema>;

/**
 * Schema for email verification error response (400 Bad Request)
 */
export const sendEmailVerificationValidationErrorSchema = z.object({
  message: z.string(),
  errors: z.array(z.object({
    field: z.string(),
    message: z.string(),
  })).optional(),
});

export type SendEmailVerificationValidationErrorResponse = z.infer<typeof sendEmailVerificationValidationErrorSchema>;

/**
 * Schema for get verification session success response (has active session)
 */
export const getVerificationSessionSuccessSchema = z.object({
  hasActiveSession: z.literal(true),
  sessionId: z.string(),
  attempts: z.number().int().min(0),
  timeRemaining: z.number().int().min(0),
  expiresAt: z.string().refine(
    (dateString) => !isNaN(new Date(dateString).getTime()),
    { message: "Invalid ISO date string" }
  ),
  message: z.string(),
});

export type GetVerificationSessionSuccessResponse = z.infer<typeof getVerificationSessionSuccessSchema>;

/**
 * Schema for get verification session response (no active session)
 */
export const getVerificationSessionNoSessionSchema = z.object({
  hasActiveSession: z.literal(false),
  message: z.string(),
});

export type GetVerificationSessionNoSessionResponse = z.infer<typeof getVerificationSessionNoSessionSchema>;

/**
 * Union type for get verification session response
 */
export const getVerificationSessionResponseSchema = z.union([
  getVerificationSessionSuccessSchema,
  getVerificationSessionNoSessionSchema,
]);

export type GetVerificationSessionResponse = z.infer<typeof getVerificationSessionResponseSchema>;

/**
 * Schema for generic error response
 */
export const genericErrorResponseSchema = z.object({
  message: z.string(),
});

export type GenericErrorResponse = z.infer<typeof genericErrorResponseSchema>;

