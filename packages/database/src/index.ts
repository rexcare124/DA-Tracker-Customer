import { withAccelerate } from '@prisma/extension-accelerate';

// Global Prisma client instance for connection pooling
const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

// Create Prisma client with connection pooling and acceleration
const createPrismaClient = () => {
  // Lazy-load the generated Prisma client to avoid build-time filesystem globbing
  // when Next traces/evaluates server dependencies.
  const { PrismaClient } = require("../generated/client") as {
    PrismaClient: new (...args: any[]) => any;
  };
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  // Add Accelerate extension if DATABASE_URL supports it
  if (process.env.DATABASE_URL?.includes('accelerate')) {
    return client.$extends(withAccelerate());
  }

  return client;
};

// Lazy Prisma initialization:
// `next build` (server tracing) can touch this module and Prisma's engine resolution may
// attempt to scan protected Windows locations. Delay client construction until runtime.
let prismaInstance: any | undefined = globalForPrisma.prisma;

const getPrisma = () => {
  if (!prismaInstance) {
    prismaInstance = globalForPrisma.prisma ?? createPrismaClient();
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance;
    }
  }
  return prismaInstance;
};

export const prisma = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getPrisma();
      const value = (client as any)[prop];
      // Keep method `this` bound to the Prisma client instance.
      if (typeof value === 'function') return value.bind(client);
      return value;
    },
  }
) as any;

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
