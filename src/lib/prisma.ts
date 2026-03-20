// Re-export the shared Prisma client from the database package
export { prisma, connectToDatabase, disconnectFromDatabase, checkDatabaseHealth } from "@pk/database";

// Export as default for backward compatibility
import { prisma } from "@pk/database";
export default prisma;
