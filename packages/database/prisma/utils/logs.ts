import { DEBUG_VERBOSE, STOP_ON_ERROR } from "../seed";

// Debug logging functions (console only, no file output)
export function writeDebugLog(message: string) {
  if (DEBUG_VERBOSE) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }
}

export function writeDebugObject(context: string, payload: unknown) {
  if (!DEBUG_VERBOSE) return;
  try {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${context}: ${JSON.stringify(payload)}`);
  } catch {
    // best-effort only
  }
}

export function writeErrorLog(error: any, context: string) {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : "";
  console.error(`[${timestamp}] ERROR in ${context}: ${errorMessage}`);
  if (errorStack && DEBUG_VERBOSE) {
    console.error(`[${timestamp}] STACK: ${errorStack}`);
  }
}

export function writeSuccessLog(model: string, count: number, batch: string) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] SUCCESS: Seeded ${count} records in ${model} (${batch})`);
}

// Function to handle early exit on error
export function handleEarlyExit(error: any, context: string) {
  if (STOP_ON_ERROR) {
    console.log(`\n🛑 STOPPING EXECUTION DUE TO ERROR in ${context}`);
    console.log(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    console.log(`\n💡 To continue execution despite errors, run with: SEED_STOP_ON_ERROR=0`);
    process.exit(1);
  }
}
