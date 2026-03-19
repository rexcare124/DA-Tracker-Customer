// Firebase Admin SDK configuration for server-side operations
// This configuration contains sensitive credentials and should NEVER be exposed to the client
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getDatabase, type Database } from 'firebase-admin/database';
import { getAuth, type Auth, type DecodedIdToken } from 'firebase-admin/auth';
import { getStorage, type Storage } from 'firebase-admin/storage';

// Type definitions for better type safety
interface AdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  databaseURL: string;
  storageBucket?: string;
}

interface TokenVerificationResult {
  success: true;
  uid: string;
  email: string | undefined;
  decodedToken: DecodedIdToken;
}

interface TokenVerificationError {
  success: false;
  error: string;
}

type TokenVerificationResponse = TokenVerificationResult | TokenVerificationError;

// Validate and create type-safe admin configuration
function createAdminConfig(): AdminConfig {
  const config = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  };

  // Type guard to ensure all values are strings
  const entries = Object.entries(config) as Array<[keyof AdminConfig, string | undefined]>;
  const invalidEntries = entries.filter(
    ([key, value]) => (key === 'storageBucket' ? false : typeof value !== 'string' || value.length === 0)
  );

  if (invalidEntries.length > 0) {
    const keyMap: Record<string, string> = {
      projectId: 'FIREBASE_PROJECT_ID',
      clientEmail: 'FIREBASE_CLIENT_EMAIL',
      privateKey: 'FIREBASE_PRIVATE_KEY',
      databaseURL: 'NEXT_PUBLIC_FIREBASE_DATABASE_URL',
      storageBucket: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    };
    const missingKeys = invalidEntries.map(([key]) => keyMap[key]);
    throw new Error(
      `Missing or invalid Firebase Admin environment variables: ${missingKeys.join(', ')}. ` +
      'Ensure all FIREBASE_* variables are set securely in your server environment.'
    );
  }

  // Validate private key format
  if (!config.privateKey!.includes('BEGIN PRIVATE KEY')) {
    throw new Error(
      'FIREBASE_PRIVATE_KEY appears to be invalid. Ensure it includes the full private key with headers.'
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(config.clientEmail!)) {
    throw new Error(
      'FIREBASE_CLIENT_EMAIL appears to be invalid. Ensure it is a valid service account email.'
    );
  }

  return config as AdminConfig;
}

let adminConfigData: AdminConfig | null = null;

function getAdminConfig(): AdminConfig {
  if (!adminConfigData) {
    adminConfigData = createAdminConfig();
  }
  return adminConfigData;
}

// Server-side Firebase Admin configuration (lazy-loaded)
function getAdminFirebaseConfig() {
  const config = getAdminConfig();
  return {
    credential: cert({
      projectId: config.projectId,
      clientEmail: config.clientEmail,
      privateKey: config.privateKey.replace(/\\n/g, '\n'),
    }),
    databaseURL: config.databaseURL,
    ...(config.storageBucket && { storageBucket: config.storageBucket }),
  };
}

// Initialize Firebase Admin (singleton pattern to prevent multiple initializations)
let firebaseAdminApp: App | null = null;
let firebaseAdminDatabase: Database | null = null;
let firebaseAdminAuth: Auth | null = null;

function initializeFirebaseAdmin() {
  if (firebaseAdminApp) {
    return { app: firebaseAdminApp, database: firebaseAdminDatabase!, auth: firebaseAdminAuth! };
  }

  try {
    const existingApps = getApps();
    const existingAdminApp = existingApps.find(app => app?.name === 'admin');
  
    if (existingAdminApp) {
      firebaseAdminApp = existingAdminApp;
    } else {
      firebaseAdminApp = initializeApp(getAdminFirebaseConfig(), 'admin');
    }
    
    // Initialize Firebase Admin services
    firebaseAdminDatabase = getDatabase(firebaseAdminApp);
    firebaseAdminAuth = getAuth(firebaseAdminApp);
    
    return { app: firebaseAdminApp, database: firebaseAdminDatabase, auth: firebaseAdminAuth };
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    throw new Error(
      `Firebase Admin initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
      'Please verify your service account credentials and network connectivity.'
    );
  }
}

// Lazy-loaded exports
export function getAdminDatabase(): Database {
  const { database } = initializeFirebaseAdmin();
  return database;
}

export function getAdminAuth(): Auth {
  const { auth } = initializeFirebaseAdmin();
  return auth;
}

export function getAdminApp(): App {
  const { app } = initializeFirebaseAdmin();
  return app;
}

export function getAdminStorage(): Storage {
  return getStorage(getAdminApp());
}

// Helper function to verify user authentication with strict type safety
export async function verifyUserToken(idToken: string): Promise<TokenVerificationResponse> {
  // Input validation
  if (typeof idToken !== 'string' || idToken.trim().length === 0) {
    return {
      success: false,
      error: 'Invalid token: Token must be a non-empty string',
    };
  }

  try {
    const auth = getAdminAuth();
    const decodedToken = await auth.verifyIdToken(idToken, true); // checkRevoked = true for security
    
    // Additional validation
    if (!decodedToken.uid) {
      return {
        success: false,
        error: 'Invalid token: Missing user ID',
      };
    }

    return {
      success: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
      decodedToken,
    };
  } catch (error) {
    // Log error securely (don't expose token)
    console.error('Token verification failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Token verification failed',
    };
  }
}

// Helper function to check if user is admin with input validation
export async function isUserAdmin(uid: string): Promise<boolean> {
  // Input validation
  if (typeof uid !== 'string' || uid.trim().length === 0) {
    console.error('Admin check failed: Invalid UID provided');
    return false;
  }

  try {
    const database = getAdminDatabase();
    const adminRef = database.ref(`admins/${uid}`);
    const snapshot = await adminRef.once('value');
    const adminValue = snapshot.val();
    
    // Strict boolean check
    return snapshot.exists() && adminValue === true;
  } catch (error) {
    console.error('Admin check failed:', {
      uid,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    return false;
  }
}

// Helper function to safely get user claims
export async function getUserClaims(uid: string): Promise<Record<string, any> | null> {
  if (typeof uid !== 'string' || uid.trim().length === 0) {
    return null;
  }

  try {
    const auth = getAdminAuth();
    const userRecord = await auth.getUser(uid);
    return userRecord.customClaims || {};
  } catch (error) {
    console.error('Failed to get user claims:', {
      uid,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
    return null;
  }
}
