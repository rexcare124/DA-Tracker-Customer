/**
 * Secure Environment Variable Access Utility
 *
 * This utility provides secure access to environment variables with validation
 * and sanitization to prevent accidental exposure in logs or error messages.
 */

interface EnvConfig {
  // NextAuth Configuration
  NEXTAUTH_SECRET?: string;
  NEXTAUTH_URL?: string;

  // Firebase Admin SDK
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_CLIENT_EMAIL?: string;
  FIREBASE_PRIVATE_KEY?: string;

  // Database Configuration
  DATABASE_URL?: string;

  // Email Service Configuration
  SENDGRID_SENDER_EMAIL?: string;
  SENDGRID_API_KEY?: string;

  // Stripe Configuration
  STRIPE_SECRET_KEY?: string;
  STRIPE_PUBLISHABLE_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;

  // Server Configuration
  PORT?: string;
  NODE_ENV?: string;
}

class SecureEnv {
  private config: EnvConfig = {};
  private initialized = false;

  /**
   * Initialize and validate environment variables
   */
  init(): void {
    if (this.initialized) return;

    this.config = {
      // NextAuth Configuration
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,

      // Firebase Admin SDK
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,

      // Database Configuration
      DATABASE_URL: process.env.DATABASE_URL,

      // Email Service Configuration
      SENDGRID_SENDER_EMAIL: process.env.SENDGRID_SENDER_EMAIL,
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,

      // Stripe Configuration
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

      // Server Configuration
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV,
    };

    this.validateRequired();
    this.initialized = true;
  }

  /**
   * Get environment variable value safely
   */
  get(key: keyof EnvConfig): string | undefined {
    if (!this.initialized) {
      this.init();
    }
    const value = this.config[key];
    return typeof value === "string" ? value : undefined;
  }

  /**
   * Get environment variable value with fallback
   */
  getWithFallback(key: keyof EnvConfig, fallback: string): string {
    return this.get(key) || fallback;
  }

  /**
   * Check if environment variable exists
   */
  has(key: keyof EnvConfig): boolean {
    return !!this.get(key);
  }

  /**
   * Get sanitized environment variable for logging (never exposes actual values)
   */
  getSanitized(key: keyof EnvConfig): string {
    const value = this.get(key);
    if (!value) return "[NOT_SET]";

    // For sensitive variables, only show first 4 characters
    if (this.isSensitive(key)) {
      return value.length > 4 ? `${value.substring(0, 4)}...` : "[REDACTED]";
    }

    return value;
  }

  /**
   * Check if an environment variable is sensitive
   */
  private isSensitive(key: keyof EnvConfig): boolean {
    const sensitiveKeys: (keyof EnvConfig)[] = [
      "NEXTAUTH_SECRET",
      "FIREBASE_PRIVATE_KEY",
      "DATABASE_URL",
      "SENDGRID_API_KEY",
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
    ];

    return sensitiveKeys.includes(key);
  }

  /**
   * Validate required environment variables
   */
  private validateRequired(): void {
    const required: (keyof EnvConfig)[] = [
      "NEXTAUTH_SECRET",
      "FIREBASE_PROJECT_ID",
      "FIREBASE_CLIENT_EMAIL",
      "FIREBASE_PRIVATE_KEY",
    ];

    const missing = required.filter((key) => !this.config[key]);

    if (missing.length > 0) {
      const sanitizedMissing = missing.map((key) => this.getSanitized(key));
      throw new Error(
        `Missing required environment variables: ${sanitizedMissing.join(", ")}`,
      );
    }
  }

  /**
   * Get all environment variables for configuration (sanitized)
   */
  getAllSanitized(): Record<string, string> {
    const sanitized: Record<string, string> = {};

    Object.keys(this.config).forEach((key) => {
      sanitized[key] = this.getSanitized(key as keyof EnvConfig);
    });

    return sanitized;
  }

  /**
   * Validate environment variable format
   */
  validateFormat(
    key: keyof EnvConfig,
    validator: (value: string) => boolean,
  ): boolean {
    const value = this.get(key);
    if (!value) return false;

    return validator(value);
  }

  /**
   * Get environment variable with type conversion
   */
  getNumber(key: keyof EnvConfig, fallback?: number): number {
    const value = this.get(key);
    if (!value) return fallback || 0;

    const num = parseInt(value, 10);
    return isNaN(num) ? fallback || 0 : num;
  }

  /**
   * Get environment variable as boolean
   */
  getBoolean(key: keyof EnvConfig, fallback?: boolean): boolean {
    const value = this.get(key);
    if (!value) return fallback || false;

    return value.toLowerCase() === "true";
  }
}

// Export singleton instance
export const secureEnv = new SecureEnv();

// Export types
export type { EnvConfig };
