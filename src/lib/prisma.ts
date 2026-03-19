// Re-export the shared Prisma client from the database package
import { PrismaClient } from "@prisma/client";

// Export as default for backward compatibility
const prisma = new PrismaClient();
export default prisma;
