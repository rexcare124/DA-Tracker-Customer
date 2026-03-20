import { handleEarlyExit } from "./logs";

// Function to check existing records before seeding (fail-fast on any error)
export async function checkExistingRecords(
  prisma: any,
  model: string
): Promise<{ count: number; ids: number[] }> {
  try {
    const prismaModel = (prisma as any)[model];
    if (!prismaModel) {
      const err = new Error(`Model ${model} not found in Prisma client`);
      handleEarlyExit(err, `checking existing records for ${model}`);
      return { count: 0, ids: [] };
    }

    // Only count to avoid schema-specific field assumptions
    const count: number = await prismaModel.count();
    console.log(`📊 EXISTING RECORDS in ${model}: ${count} records`);
    return { count, ids: [] };
  } catch (error) {
    handleEarlyExit(error, `checking existing records for ${model}`);
    return { count: 0, ids: [] };
  }
}
