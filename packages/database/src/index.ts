import { PrismaClient } from '../generated/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Global Prisma client instance for connection pooling
const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

// Create Prisma client with connection pooling and acceleration
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  // Add Accelerate extension if DATABASE_URL supports it
  if (process.env.DATABASE_URL?.includes('accelerate')) {
    return client.$extends(withAccelerate());
  }

  return client;
};

// Use global instance in development to prevent multiple connections
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Export all Prisma types and namespace (Prisma.sql, Prisma.join, etc.) for client and server
export * from '../generated/client';

// Export utility functions
export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    throw error;
  }
};

export const disconnectFromDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Disconnected from database');
  } catch (error) {
    console.error('❌ Failed to disconnect from database:', error);
    throw error;
  }
};

// Health check function
export const checkDatabaseHealth = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString() 
    };
  }
};
