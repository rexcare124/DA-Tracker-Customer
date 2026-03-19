/**
 * Secure Logger Utility
 * 
 * This utility provides secure logging that never exposes sensitive data
 * such as environment variables, user credentials, or internal system details.
 */

interface LogContext {
  operation?: string;
  userId?: string;
  method?: string;
  endpoint?: string;
  status?: number;
  duration?: number;
}

class SecureLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log information without exposing sensitive data
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const logData = this.sanitizeContext(context);
      console.log(`[INFO] ${message}`, logData);
    }
  }

  /**
   * Log warnings without exposing sensitive data
   */
  warn(message: string, context?: LogContext): void {
    const logData = this.sanitizeContext(context);
    console.warn(`[WARN] ${message}`, logData);
  }

  /**
   * Log errors without exposing sensitive data
   */
  error(message: string, context?: LogContext): void {
    const logData = this.sanitizeContext(context);
    console.error(`[ERROR] ${message}`, logData);
  }

  /**
   * Log debug information (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const logData = this.sanitizeContext(context);
      console.log(`[DEBUG] ${message}`, logData);
    }
  }

  /**
   * Log performance metrics
   */
  performance(operation: string, duration: number, context?: LogContext): void {
    if (this.isDevelopment) {
      const logData = this.sanitizeContext({ ...context, operation, duration });
      console.log(`[PERF] ${operation}: ${duration}ms`, logData);
    }
  }

  /**
   * Log security events
   */
  security(event: string, context?: LogContext): void {
    const logData = this.sanitizeContext(context);
    console.warn(`[SECURITY] ${event}`, logData);
  }

  /**
   * Sanitize context to remove any potentially sensitive data
   */
  private sanitizeContext(context?: LogContext): Partial<LogContext> {
    if (!context) return {};

    const sanitized: Partial<LogContext> = {};

    // Only include safe fields
    if (context.operation) sanitized.operation = context.operation;
    if (context.method) sanitized.method = context.method;
    if (context.endpoint) sanitized.endpoint = context.endpoint;
    if (context.status) sanitized.status = context.status;
    if (context.duration) sanitized.duration = context.duration;

    // Sanitize userId - only show first 4 characters for debugging
    if (context.userId) {
      sanitized.userId = context.userId.length > 4 
        ? `${context.userId.substring(0, 4)}...` 
        : '***';
    }

    return sanitized;
  }

  /**
   * Check if a string contains potentially sensitive data
   */
  private containsSensitiveData(str: string): boolean {
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /key/i,
      /token/i,
      /auth/i,
      /credential/i,
      /private/i,
      /api[_-]?key/i,
      /client[_-]?secret/i,
      /firebase[_-]?private[_-]?key/i,
      /nextauth[_-]?secret/i,
      /sendgrid[_-]?api[_-]?key/i,
      /database[_-]?url/i
    ];

    return sensitivePatterns.some(pattern => pattern.test(str));
  }

  /**
   * Sanitize a string to remove sensitive data
   */
  sanitizeString(str: string): string {
    if (this.containsSensitiveData(str)) {
      return '[REDACTED]';
    }
    return str;
  }
}

// Export singleton instance
export const secureLogger = new SecureLogger();

// Export types for use in other files
export type { LogContext };
