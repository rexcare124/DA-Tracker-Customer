/**
 * Email Verification Configuration Constants
 * Centralized configuration for email verification system
 */

// Rate Limiting Constants
export const RATE_LIMIT_CONFIG = {
  // Email verification code requests
  EMAIL_VERIFICATION: {
    WINDOW_MS: 60 * 1000, // 1 minute in milliseconds
    MAX_REQUESTS: 3, // 3 requests per minute (increased from 1)
  },
  
  // Email verification attempts
  EMAIL_VERIFICATION_ATTEMPTS: {
    WINDOW_MS: 10 * 60 * 1000, // 10 minutes in milliseconds
    MAX_REQUESTS: 5, // 5 attempts per 10 minutes
  },
  
  // General registration endpoints
  REGISTRATION: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes in milliseconds
    MAX_REQUESTS: 5, // 5 registration attempts per 15 minutes
  },
  
  // General authentication endpoints
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes in milliseconds
    MAX_REQUESTS: 10, // 10 auth attempts per 15 minutes
  },
  
  // General API endpoints
  API: {
    WINDOW_MS: 60 * 1000, // 1 minute in milliseconds
    MAX_REQUESTS: 100, // 100 requests per minute
  },
} as const;

// Session Management Constants
export const SESSION_CONFIG = {
  // Verification session duration
  SESSION_DURATION_MS: 5 * 60 * 1000, // 5 minutes in milliseconds
  
  // Maximum failed attempts per session
  MAX_ATTEMPTS_PER_SESSION: 3,
  
  // Cooldown periods (in seconds)
  COOLDOWN_PERIODS: {
    AFTER_RATE_LIMIT: 60, // 60 seconds after rate limit hit
    AFTER_ACTIVE_SESSION: 60, // 60 seconds after active session exists
    RESEND_COOLDOWN: 60, // 60 seconds for resend functionality
  },
} as const;

// Verification Code Constants
export const VERIFICATION_CODE_CONFIG = {
  // Code generation
  CODE_LENGTH: 6,
  // Exclude "0" (zero), "O" (letter O), "1" (one), and "I" (letter I) to prevent confusion
  CODE_CHARS: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  
  // Code expiration
  EXPIRATION_MS: 5 * 60 * 1000, // 5 minutes in milliseconds
  
  // Hash rounds for bcrypt
  BCRYPT_ROUNDS: 10,
} as const;

// Email Template Constants
export const EMAIL_TEMPLATE_CONFIG = {
  SUBJECT: "Complete Your Registration - Email Verification",
  SENDER_NAME: "PlentifulKnowledge",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  RATE_LIMIT: {
    EMAIL_VERIFICATION: "Too many verification requests. Please wait 60 seconds before requesting another code.",
    EMAIL_VERIFICATION_ATTEMPTS: "Too many verification attempts. Please wait 5 minutes before trying again.",
    GENERAL: "Too many requests. Please try again later.",
  },
  SESSION: {
    ACTIVE_SESSION_EXISTS: "A verification code has already been sent to this email. Please check your inbox or wait 60 seconds before requesting a new code.",
    SESSION_EXPIRED: "Verification code not found or has expired. Please request a new code.",
    MAX_ATTEMPTS_EXCEEDED: "Too many failed attempts. Please request a new verification code.",
  },
  VALIDATION: {
    INVALID_EMAIL: "Invalid email address",
    INVALID_CODE_LENGTH: "Code must be exactly 6 characters",
    EMAIL_MISMATCH: "Email addresses do not match",
    EMAIL_REQUIRED: "Please enter your email address",
    CONFIRM_EMAIL_REQUIRED: "Please confirm your email address",
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Verification Types
export const VERIFICATION_TYPES = {
  SOCIAL_EMAIL_VERIFICATION: 'SOCIAL_EMAIL_VERIFICATION',
} as const; 