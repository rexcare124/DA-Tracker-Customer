"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseHealth = exports.disconnectFromDatabase = exports.connectToDatabase = exports.prisma = void 0;
const extension_accelerate_1 = require("@prisma/extension-accelerate");
// Global Prisma client instance for connection pooling
const globalForPrisma = globalThis;
// Create Prisma client with connection pooling and acceleration
const createPrismaClient = () => {
    // Lazy-load generated Prisma client to avoid build-time filesystem globbing.
    const generated = require("../generated/client");
    const client = new generated.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
    // Add Accelerate extension if DATABASE_URL supports it
    if (process.env.DATABASE_URL?.includes('accelerate')) {
        return client.$extends((0, extension_accelerate_1.withAccelerate)());
    }
    return client;
};
// Lazy Prisma initialization:
// `next build` server tracing can end up touching this module. Delay client construction
// until runtime by exporting a Proxy instead of instantiating immediately.
let prismaInstance = globalForPrisma.prisma;
const getPrisma = () => {
    if (!prismaInstance) {
        prismaInstance = globalForPrisma.prisma ?? createPrismaClient();
        if (process.env.NODE_ENV !== 'production') {
            globalForPrisma.prisma = prismaInstance;
        }
    }
    return prismaInstance;
};
exports.prisma = new Proxy({}, {
    get(_target, prop) {
        const client = getPrisma();
        const value = client[prop];
        // Bind Prisma methods so `this` is correct.
        if (typeof value === 'function')
            return value.bind(client);
        return value;
    }
});
// Export utility functions
const connectToDatabase = async () => {
    try {
        await exports.prisma.$connect();
        console.log('✅ Connected to database');
    }
    catch (error) {
        console.error('❌ Failed to connect to database:', error);
        throw error;
    }
};
exports.connectToDatabase = connectToDatabase;
const disconnectFromDatabase = async () => {
    try {
        await exports.prisma.$disconnect();
        console.log('✅ Disconnected from database');
    }
    catch (error) {
        console.error('❌ Failed to disconnect from database:', error);
        throw error;
    }
};
exports.disconnectFromDatabase = disconnectFromDatabase;
// Health check function
const checkDatabaseHealth = async () => {
    try {
        await exports.prisma.$queryRaw `SELECT 1`;
        return { status: 'healthy', timestamp: new Date().toISOString() };
    }
    catch (error) {
        return {
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        };
    }
};
exports.checkDatabaseHealth = checkDatabaseHealth;
