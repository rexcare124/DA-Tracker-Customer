import { randomUUID } from 'crypto';
import prisma from './prisma';
import { 
  SESSION_CONFIG, 
  VERIFICATION_TYPES 
} from './emailVerificationConfig';

export interface VerificationSession {
  sessionId: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date;
}

/**
 * Creates a new verification session for an email address
 * This prevents multiple active verification sessions for the same email
 */
export async function createVerificationSession(email: string): Promise<string> {
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_CONFIG.SESSION_DURATION_MS);

  // Deactivate any existing active sessions for this email
  await prisma.emailVerification.updateMany({
    where: {
      email: email.toLowerCase(),
      type: VERIFICATION_TYPES.SOCIAL_EMAIL_VERIFICATION,
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });

  return sessionId;
}

/**
 * Checks if there's an active verification session for an email
 */
export async function hasActiveVerificationSession(email: string): Promise<boolean> {
  const activeSession = await prisma.emailVerification.findFirst({
    where: {
      email: email.toLowerCase(),
      type: VERIFICATION_TYPES.SOCIAL_EMAIL_VERIFICATION,
      isActive: true,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  return !!activeSession;
}

/**
 * Gets the active verification session for an email
 */
export async function getActiveVerificationSession(email: string) {
  return await prisma.emailVerification.findFirst({
    where: {
      email: email.toLowerCase(),
      type: VERIFICATION_TYPES.SOCIAL_EMAIL_VERIFICATION,
      isActive: true,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
}

/**
 * Deactivates a verification session
 */
export async function deactivateVerificationSession(sessionId: string): Promise<void> {
  await prisma.emailVerification.updateMany({
    where: {
      sessionId,
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });
}

/**
 * Increments the attempt count for a verification session
 */
export async function incrementVerificationAttempts(sessionId: string): Promise<void> {
  await prisma.emailVerification.updateMany({
    where: {
      sessionId,
      isActive: true,
    },
    data: {
      attempts: {
        increment: 1,
      },
      lastAttemptAt: new Date(),
    },
  });
}

/**
 * Cleans up expired verification sessions
 */
export async function cleanupExpiredSessions(): Promise<void> {
  await prisma.emailVerification.updateMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });
}

/**
 * Checks if a verification session has exceeded the maximum attempts
 */
export async function hasExceededMaxAttempts(sessionId: string, maxAttempts: number = SESSION_CONFIG.MAX_ATTEMPTS_PER_SESSION): Promise<boolean> {
  const session = await prisma.emailVerification.findFirst({
    where: {
      sessionId,
      isActive: true,
    },
  });

  return session ? session.attempts >= maxAttempts : false;
} 