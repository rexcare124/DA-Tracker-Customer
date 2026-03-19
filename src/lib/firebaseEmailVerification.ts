import { randomUUID } from 'crypto';
import { getAdminDatabase } from '@/lib/firebase/admin';
import { 
  SESSION_CONFIG, 
  VERIFICATION_TYPES 
} from './emailVerificationConfig';

export interface VerificationSession {
  sessionId: string;
  email: string;
  code: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
  attempts: number;
  lastAttemptAt?: string;
  resendCount?: number; // Track number of resends for this session
}

export interface SharedVerificationObject {
  sessions: {
    [sessionId: string]: VerificationSession;
  };
}

export interface VerificationResult {
  success: boolean;
  sessionId?: string;
  error?: string;
  remainingAttempts?: number;
}

/**
 * Creates a new verification session for an email address in Firebase
 * Uses shared email_verifications object to minimize Firebase writes
 */
export async function createVerificationSession(email: string): Promise<string> {
  try {
    // Input validation
    if (!isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    const database = getAdminDatabase();
    if (!database) {
      throw new Error('Firebase database not available');
    }

    const sessionId = randomUUID();
    const now = new Date();
    const expiresAt = new Date(Date.now() + SESSION_CONFIG.SESSION_DURATION_MS);
    
    // DEBUG: Log session creation
    console.log(`🔍 [DEBUG] CREATE_VERIFICATION_SESSION`, {
      timestamp: now.toISOString(),
      email: email.toLowerCase(),
      sessionId,
      expiresAt: expiresAt.toISOString(),
      durationMs: SESSION_CONFIG.SESSION_DURATION_MS,
    });

    // Use shared verification object for email verification sessions
    const sharedVerificationsRef = database.ref('email_verifications/sessions');
    
    // Check existing active sessions for this email - only deactivate if expired or < 30 seconds remaining
    console.log(`📖 [FIREBASE READ] Reading existing sessions from email_verifications/sessions`);
    const existingSessionsSnapshot = await sharedVerificationsRef.once('value');
    const existingSessions = existingSessionsSnapshot.val() || {};
    console.log(`📖 [FIREBASE READ] Found ${Object.keys(existingSessions).length} existing sessions`);
    
    // Type-safe updates object for Firebase
    // Firebase updates support nested paths like "sessionId/isActive" or direct values
    const updates: Record<string, Omit<VerificationSession, 'code'> | boolean> = {};
    const THIRTY_SECONDS_MS = 30 * 1000;
    
    // Find and deactivate existing sessions ONLY if expired or have < 30 seconds remaining
    // This preserves valid sessions when user signs in after browser closes
    Object.entries(existingSessions).forEach(([key, session]: [string, unknown]) => {
      if (isValidVerificationSession(session) && 
          session.email === email.toLowerCase() && 
          session.isActive) {
        const sessionExpiresAt = new Date(session.expiresAt);
        const timeRemaining = sessionExpiresAt.getTime() - now.getTime();
        
        // Only deactivate if expired or has less than 30 seconds remaining
        if (timeRemaining < THIRTY_SECONDS_MS) {
          console.log(`✏️ [SESSION] Deactivating session ${key} - expired or < 30 seconds remaining (${Math.ceil(timeRemaining / 1000)}s)`);
          updates[`${key}/isActive`] = false;
        } else {
          console.log(`ℹ️ [SESSION] Preserving session ${key} - still has ${Math.ceil(timeRemaining / 1000)}s remaining`);
        }
      }
    });

    // Create new session with complete type safety
    const newSessionData: Omit<VerificationSession, 'code'> = {
      sessionId,
      email: email.toLowerCase(),
      type: VERIFICATION_TYPES.SOCIAL_EMAIL_VERIFICATION,
      isActive: true,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      attempts: 0,
      resendCount: 0
    };

    updates[sessionId] = newSessionData;

    // Apply all updates atomically to shared object
    console.log(`✏️ [FIREBASE WRITE] Updating email_verifications/sessions with ${Object.keys(updates).length} changes`);
    console.log(`✏️ [FIREBASE WRITE] Operations: ${Object.keys(updates).map(key => key.includes('/') ? 'deactivate session' : 'create session').join(', ')}`);
    await sharedVerificationsRef.update(updates);
    console.log(`✏️ [FIREBASE WRITE] Successfully updated email verification sessions`);

    return sessionId;
  } catch (error) {
    console.error('[ERROR] Failed to create verification session:', error);
    throw error;
  }
}

/**
 * Gets an active verification session by email from shared object
 */
export async function getActiveVerificationSession(email: string): Promise<VerificationSession | null> {
  try {
    // Input validation
    if (!isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    const database = getAdminDatabase();
    if (!database) {
      throw new Error('Firebase database not available');
    }

    const sharedVerificationsRef = database.ref('email_verifications/sessions');
    console.log(`📖 [FIREBASE READ] Reading all sessions from email_verifications/sessions`);
    const snapshot = await sharedVerificationsRef.once('value');
    const sessions = snapshot.val() || {};
    console.log(`📖 [FIREBASE READ] Found ${Object.keys(sessions).length} total sessions`);
    
    // Find active session for this email that hasn't expired with type safety
    const now = new Date();
    for (const [sessionId, session] of Object.entries(sessions)) {
      if (isValidVerificationSession(session) &&
          session.email === email.toLowerCase() &&
          session.isActive && 
          session.type === VERIFICATION_TYPES.SOCIAL_EMAIL_VERIFICATION &&
          new Date(session.expiresAt) > now) {
        return { ...session, sessionId };
      }
    }

    return null;
  } catch (error) {
    console.error('[ERROR] Failed to get active verification session:', error);
    throw error;
  }
}

/**
 * Checks if there's an active verification session for an email
 */
export async function hasActiveVerificationSession(email: string): Promise<boolean> {
  const session = await getActiveVerificationSession(email);
  return session !== null;
}

/**
 * Increments verification attempts for a session in shared object
 */
export async function incrementVerificationAttempts(sessionId: string): Promise<void> {
  try {
    // Input validation
    if (!isValidSessionId(sessionId)) {
      throw new Error('Invalid session ID format');
    }

    const database = getAdminDatabase();
    if (!database) {
      throw new Error('Firebase database not available');
    }

    const sessionRef = database.ref(`email_verifications/sessions/${sessionId}`);
    console.log(`📖 [FIREBASE READ] Reading session ${sessionId} from email_verifications/sessions`);
    const snapshot = await sessionRef.once('value');
    const session = snapshot.val();
    console.log(`📖 [FIREBASE READ] Session ${sessionId} ${session ? 'found' : 'not found'}`);
    
    if (session && isValidVerificationSession(session)) {
      await sessionRef.update({
        attempts: (session.attempts || 0) + 1,
        lastAttemptAt: new Date().toISOString()
      });
    } else {
      throw new Error('Session not found or invalid');
    }
  } catch (error) {
    console.error('[ERROR] Failed to increment verification attempts:', error);
    throw error;
  }
}

/**
 * Increments resend count for a session in shared object
 */
export async function incrementResendCount(sessionId: string): Promise<void> {
  try {
    // Input validation
    if (!isValidSessionId(sessionId)) {
      throw new Error('Invalid session ID format');
    }

    const database = getAdminDatabase();
    if (!database) {
      throw new Error('Firebase database not available');
    }

    const sessionRef = database.ref(`email_verifications/sessions/${sessionId}`);
    console.log(`📖 [FIREBASE READ] Reading session ${sessionId} for resend count increment`);
    const snapshot = await sessionRef.once('value');
    const session = snapshot.val();
    
    if (session && isValidVerificationSession(session)) {
      const currentResendCount = session.resendCount || 0;
      await sessionRef.update({
        resendCount: currentResendCount + 1
      });
      console.log(`✏️ [FIREBASE WRITE] Incremented resend count for session ${sessionId} to ${currentResendCount + 1}`);
    } else {
      throw new Error('Session not found or invalid');
    }
  } catch (error) {
    console.error('[ERROR] Failed to increment resend count:', error);
    throw error;
  }
}

/**
 * Deactivates a verification session in shared object
 * Used for error cases (expired, max attempts exceeded) that may need cleanup later
 */
export async function deactivateVerificationSession(sessionId: string): Promise<void> {
  try {
    // Input validation
    if (!isValidSessionId(sessionId)) {
      throw new Error('Invalid session ID format');
    }

    const database = getAdminDatabase();
    if (!database) {
      throw new Error('Firebase database not available');
    }

    console.log(`✏️ [FIREBASE WRITE] Deactivating session ${sessionId} in email_verifications/sessions`);
    await database.ref(`email_verifications/sessions/${sessionId}`).update({
      isActive: false
    });
    console.log(`✏️ [FIREBASE WRITE] Successfully deactivated session ${sessionId}`);
  } catch (error) {
    console.error('[ERROR] Failed to deactivate verification session:', error);
    throw error;
  }
}

/**
 * Immediately deletes a verification session from Firebase after successful verification.
 * 
 * Benefits:
 * - Immediate cost savings (reduces Firebase storage)
 * - Data minimization (GDPR/privacy compliance)
 * - Security (removes sensitive hashed codes immediately)
 * - Best practice for temporary security data
 * 
 * @param sessionId - The session ID to delete
 */
export async function deleteVerificationSession(sessionId: string): Promise<void> {
  try {
    // Input validation
    if (!isValidSessionId(sessionId)) {
      throw new Error('Invalid session ID format');
    }

    const database = getAdminDatabase();
    if (!database) {
      throw new Error('Firebase database not available');
    }

    console.log(`🗑️ [FIREBASE DELETE] Deleting session ${sessionId} from email_verifications/sessions (successful verification)`);
    await database.ref(`email_verifications/sessions/${sessionId}`).remove();
    console.log(`🗑️ [FIREBASE DELETE] Successfully deleted session ${sessionId}`);
  } catch (error) {
    console.error('[ERROR] Failed to delete verification session:', error);
    throw error;
  }
}

/**
 * Checks if a session has exceeded maximum attempts in shared object
 */
export async function hasExceededMaxAttempts(sessionId: string): Promise<boolean> {
  try {
    // Input validation
    if (!isValidSessionId(sessionId)) {
      throw new Error('Invalid session ID format');
    }

    const database = getAdminDatabase();
    if (!database) {
      throw new Error('Firebase database not available');
    }

    console.log(`📖 [FIREBASE READ] Reading session ${sessionId} for code verification`);
    const snapshot = await database.ref(`email_verifications/sessions/${sessionId}`).once('value');
    const session = snapshot.val();
    console.log(`📖 [FIREBASE READ] Session ${sessionId} ${session ? 'found' : 'not found'} for verification`);
    
    if (!session || !isValidVerificationSession(session)) {
      return false;
    }
    
    return (session.attempts || 0) >= SESSION_CONFIG.MAX_ATTEMPTS_PER_SESSION;
  } catch (error) {
    console.error('[ERROR] Failed to check max attempts:', error);
    return false; // Fail safe - don't block user if check fails
  }
}

/**
 * Stores a hashed verification code in Firebase shared object
 */
export async function storeVerificationCode(sessionId: string, hashedCode: string): Promise<void> {
  try {
    // Input validation
    if (!isValidSessionId(sessionId)) {
      throw new Error('Invalid session ID format');
    }
    if (!hashedCode || typeof hashedCode !== 'string' || hashedCode.length < 10) {
      throw new Error('Invalid hashed code');
    }

    const database = getAdminDatabase();
    if (!database) {
      throw new Error('Firebase database not available');
    }

    console.log(`✏️ [FIREBASE WRITE] Storing verification code for session ${sessionId}`);
    await database.ref(`email_verifications/sessions/${sessionId}`).update({
      code: hashedCode
    });
    console.log(`✏️ [FIREBASE WRITE] Successfully stored verification code for session ${sessionId}`);
  } catch (error) {
    console.error('[ERROR] Failed to store verification code:', error);
    throw error;
  }
}

/**
 * Cleanup expired verification sessions from shared object
 */
export async function cleanupExpiredSessions(): Promise<void> {
  try {
    const database = getAdminDatabase();
    const sharedVerificationsRef = database.ref('email_verifications/sessions');
    
    const snapshot = await sharedVerificationsRef.once('value');
    const sessions = snapshot.val() || {};
    
    const now = new Date();
    const updates: { [key: string]: null } = {};
    
    Object.entries(sessions).forEach(([sessionId, session]: [string, any]) => {
      if (session && session.expiresAt && new Date(session.expiresAt) <= now) {
        updates[sessionId] = null; // Delete expired session
      }
    });
    
    if (Object.keys(updates).length > 0) {
      console.log(`🗑️ [FIREBASE DELETE] Deleting ${Object.keys(updates).length} expired sessions from email_verifications/sessions`);
      console.log(`🗑️ [FIREBASE DELETE] Sessions to delete: ${Object.keys(updates).join(', ')}`);
      await sharedVerificationsRef.update(updates);
      console.log(`🧹 [CLEANUP] Deleted ${Object.keys(updates).length} expired email verification sessions from Firebase`);
      console.log(`🧹 [CLEANUP] This cleanup process ONLY affects email_verifications/sessions - NOT rbca_users data`);
    }
  } catch (error) {
    console.error('[ERROR] Failed to cleanup expired sessions:', error);
    throw error;
  }
}

/**
 * Cleanup inactive verification sessions (isActive: false) from shared object
 * Safe to delete completed/failed verification attempts
 */
export async function cleanupInactiveSessions(): Promise<void> {
  try {
    const database = getAdminDatabase();
    const sharedVerificationsRef = database.ref('email_verifications/sessions');
    
    const snapshot = await sharedVerificationsRef.once('value');
    const sessions = snapshot.val() || {};
    
    const updates: { [key: string]: null } = {};
    
    Object.entries(sessions).forEach(([sessionId, session]: [string, any]) => {
      if (isValidVerificationSession(session) && !session.isActive) {
        updates[sessionId] = null; // Delete inactive session
      }
    });
    
    if (Object.keys(updates).length > 0) {
      console.log(`🗑️ [FIREBASE DELETE] Deleting ${Object.keys(updates).length} inactive sessions from email_verifications/sessions`);
      console.log(`🗑️ [FIREBASE DELETE] Sessions to delete: ${Object.keys(updates).join(', ')}`);
      await sharedVerificationsRef.update(updates);
      console.log(`🧹 [CLEANUP] Deleted ${Object.keys(updates).length} inactive email verification sessions from Firebase`);
      console.log(`🧹 [CLEANUP] This cleanup process ONLY affects email_verifications/sessions - NOT rbca_users data`);
    }
  } catch (error) {
    console.error('[ERROR] Failed to cleanup inactive sessions:', error);
    throw error;
  }
}

/**
 * Comprehensive cleanup: removes both expired and inactive sessions
 */
export async function cleanupAllCompletedSessions(): Promise<void> {
  try {
    const database = getAdminDatabase();
    const sharedVerificationsRef = database.ref('email_verifications/sessions');
    
    const snapshot = await sharedVerificationsRef.once('value');
    const sessions = snapshot.val() || {};
    
    const now = new Date();
    const updates: { [key: string]: null } = {};
    
    Object.entries(sessions).forEach(([sessionId, session]: [string, any]) => {
      if (isValidVerificationSession(session)) {
        // Delete if expired OR inactive
        const isExpired = session.expiresAt && new Date(session.expiresAt) <= now;
        const isInactive = !session.isActive;
        
        if (isExpired || isInactive) {
          updates[sessionId] = null;
        }
      }
    });
    
    if (Object.keys(updates).length > 0) {
      console.log(`🗑️ [FIREBASE DELETE] Deleting ${Object.keys(updates).length} completed sessions from email_verifications/sessions`);
      console.log(`🗑️ [FIREBASE DELETE] Sessions to delete: ${Object.keys(updates).join(', ')}`);
      await sharedVerificationsRef.update(updates);
      console.log(`🧹 [CLEANUP] Deleted ${Object.keys(updates).length} completed email verification sessions from Firebase`);
      console.log(`🧹 [CLEANUP] This cleanup process ONLY affects email_verifications/sessions - NOT rbca_users data`);
    }
  } catch (error) {
    console.error('[ERROR] Failed to cleanup completed sessions:', error);
    throw error;
  }
}

/**
 * Validates verification session data with type safety
 */
export function isValidVerificationSession(data: any): data is VerificationSession {
  return (
    data &&
    typeof data.sessionId === 'string' &&
    typeof data.email === 'string' &&
    typeof data.code === 'string' &&
    typeof data.type === 'string' &&
    typeof data.isActive === 'boolean' &&
    typeof data.createdAt === 'string' &&
    typeof data.expiresAt === 'string' &&
    typeof data.attempts === 'number' &&
    (data.lastAttemptAt === undefined || typeof data.lastAttemptAt === 'string') &&
    (data.resendCount === undefined || typeof data.resendCount === 'number')
  );
}

/**
 * Securely validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
}

/**
 * Securely validates session ID format
 */
export function isValidSessionId(sessionId: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(sessionId);
}
