// Utility to extract client IP address from Next.js request
export function getClientIP(request: Request): string {
  // Check for forwarded headers (common with proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  
  // Check for real IP header
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback to a default identifier
  // In production, you might want to use a more sophisticated approach
  return 'unknown';
}

// Alternative: Use a combination of headers for better identification
export function getClientIdentifier(request: Request): string {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  // Create a simple hash-like identifier
  return `${ip}-${userAgent.slice(0, 20)}`;
} 