// Proper type definitions for NextAuth adapter
import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "next-auth/adapters";

// Type for user creation data
export interface CreateUserData {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
}

// Type for user creation data
export interface CreateUserData {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
}

// Type for user update data
export interface UpdateUserData {
  id: string;
  email?: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
}

// Type for account linking data
export interface LinkAccountData {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}

// Type for session data
export interface SessionData {
  sessionToken: string;
  userId: string;
  expires: Date;
}

// Type for verification token data
export interface VerificationTokenData {
  identifier: string;
  token: string;
  expires: Date;
}

// Type for account unlinking data
export interface UnlinkAccountData {
  provider: string;
  providerAccountId: string;
}

// Type for session update data
export interface UpdateSessionData {
  sessionToken: string;
  userId?: string;
  expires?: Date;
}

// Type for verification token usage data
export interface UseVerificationTokenData {
  identifier: string;
  token: string;
}

// Validation functions for type safety
export function validateCreateUserData(data: unknown): CreateUserData {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid user data: must be an object');
  }
  
  const userData = data as Record<string, unknown>;
  
  if (typeof userData.id !== 'string') {
    throw new Error('Invalid user data: id must be a string');
  }
  
  if (typeof userData.email !== 'string') {
    throw new Error('Invalid user data: email must be a string');
  }
  
  if (userData.name !== null && userData.name !== undefined && typeof userData.name !== 'string') {
    throw new Error('Invalid user data: name must be a string or null');
  }
  
  if (userData.image !== null && userData.image !== undefined && typeof userData.image !== 'string') {
    throw new Error('Invalid user data: image must be a string or null');
  }
  
  if (userData.emailVerified !== null && userData.emailVerified !== undefined && !(userData.emailVerified instanceof Date)) {
    throw new Error('Invalid user data: emailVerified must be a Date or null');
  }
  
  return {
    id: userData.id,
    email: userData.email,
    name: userData.name as string | null,
    image: userData.image as string | null,
    emailVerified: userData.emailVerified as Date | null,
  };
}

export function validateUpdateUserData(data: unknown): UpdateUserData {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid update data: must be an object');
  }
  
  const updateData = data as Record<string, unknown>;
  
  if (typeof updateData.id !== 'string') {
    throw new Error('Invalid update data: id must be a string');
  }
  
  if (updateData.email !== undefined && typeof updateData.email !== 'string') {
    throw new Error('Invalid update data: email must be a string');
  }
  
  if (updateData.name !== null && updateData.name !== undefined && typeof updateData.name !== 'string') {
    throw new Error('Invalid update data: name must be a string or null');
  }
  
  if (updateData.image !== null && updateData.image !== undefined && typeof updateData.image !== 'string') {
    throw new Error('Invalid update data: image must be a string or null');
  }
  
  if (updateData.emailVerified !== null && updateData.emailVerified !== undefined && !(updateData.emailVerified instanceof Date)) {
    throw new Error('Invalid update data: emailVerified must be a Date or null');
  }
  
  return {
    id: updateData.id,
    email: updateData.email as string | undefined,
    name: updateData.name as string | null | undefined,
    image: updateData.image as string | null | undefined,
    emailVerified: updateData.emailVerified as Date | null | undefined,
  };
}

export function validateLinkAccountData(data: unknown): LinkAccountData {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid account data: must be an object');
  }
  
  const accountData = data as Record<string, unknown>;
  
  if (typeof accountData.userId !== 'string') {
    throw new Error('Invalid account data: userId must be a string');
  }
  
  if (typeof accountData.type !== 'string') {
    throw new Error('Invalid account data: type must be a string');
  }
  
  if (typeof accountData.provider !== 'string') {
    throw new Error('Invalid account data: provider must be a string');
  }
  
  if (typeof accountData.providerAccountId !== 'string') {
    throw new Error('Invalid account data: providerAccountId must be a string');
  }
  
  return {
    userId: accountData.userId,
    type: accountData.type,
    provider: accountData.provider,
    providerAccountId: accountData.providerAccountId,
    refresh_token: accountData.refresh_token as string | null | undefined,
    access_token: accountData.access_token as string | null | undefined,
    expires_at: accountData.expires_at as number | null | undefined,
    token_type: accountData.token_type as string | null | undefined,
    scope: accountData.scope as string | null | undefined,
    id_token: accountData.id_token as string | null | undefined,
    session_state: accountData.session_state as string | null | undefined,
  };
}

export function validateSessionData(data: unknown): SessionData {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid session data: must be an object');
  }
  
  const sessionData = data as Record<string, unknown>;
  
  if (typeof sessionData.sessionToken !== 'string') {
    throw new Error('Invalid session data: sessionToken must be a string');
  }
  
  if (typeof sessionData.userId !== 'string') {
    throw new Error('Invalid session data: userId must be a string');
  }
  
  if (!(sessionData.expires instanceof Date)) {
    throw new Error('Invalid session data: expires must be a Date');
  }
  
  return {
    sessionToken: sessionData.sessionToken,
    userId: sessionData.userId,
    expires: sessionData.expires,
  };
}

export function validateVerificationTokenData(data: unknown): VerificationTokenData {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid verification token data: must be an object');
  }
  
  const tokenData = data as Record<string, unknown>;
  
  if (typeof tokenData.identifier !== 'string') {
    throw new Error('Invalid verification token data: identifier must be a string');
  }
  
  if (typeof tokenData.token !== 'string') {
    throw new Error('Invalid verification token data: token must be a string');
  }
  
  if (!(tokenData.expires instanceof Date)) {
    throw new Error('Invalid verification token data: expires must be a Date');
  }
  
  return {
    identifier: tokenData.identifier,
    token: tokenData.token,
    expires: tokenData.expires,
  };
} 