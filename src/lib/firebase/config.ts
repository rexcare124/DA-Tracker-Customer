// Firebase client-side configuration
// This configuration is safe to expose to the client as it only contains public identifiers
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';
import { getAuth, type Auth } from 'firebase/auth';

// Type-safe Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Validate and create type-safe config
function createFirebaseConfig(): FirebaseConfig {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Type guard to ensure all values are strings
  const entries = Object.entries(config) as Array<[keyof FirebaseConfig, string | undefined]>;
  const invalidEntries = entries.filter(([, value]) => typeof value !== 'string' || value.length === 0);
  
  if (invalidEntries.length > 0) {
    const missingKeys = invalidEntries.map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`);
    throw new Error(
      `Missing or invalid Firebase environment variables: ${missingKeys.join(', ')}. ` +
      'Ensure all NEXT_PUBLIC_FIREBASE_* variables are set in your environment.'
    );
  }

  return config as FirebaseConfig;
}

const firebaseConfig = createFirebaseConfig();

// Initialize Firebase with error handling
let app: FirebaseApp;
let database: Database;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  auth = getAuth(app);
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  throw new Error(
    `Firebase initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
    'Please check your Firebase configuration and network connectivity.'
  );
}

// Type-safe exports
export { database, auth };
export type { Database, Auth, FirebaseApp };

// Export the app instance for additional configurations if needed
export default app;
