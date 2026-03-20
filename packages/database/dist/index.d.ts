export declare const prisma: any;
export * from '../generated/client';
export declare const connectToDatabase: () => Promise<void>;
export declare const disconnectFromDatabase: () => Promise<void>;
export declare const checkDatabaseHealth: () => Promise<{
    status: string;
    timestamp: string;
    error?: undefined;
} | {
    status: string;
    error: string;
    timestamp: string;
}>;
