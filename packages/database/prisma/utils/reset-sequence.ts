// Helper function to reset sequence for a table
export async function resetSequence(prisma: any, tableName: string, modelName: string) {
  try {
    const model = (prisma as any)[modelName];
    if (!model) {
      console.log(`Model ${modelName} not found, skipping sequence reset`);
      return;
    }

    const maxId = await model.findMany({
      select: { id: true },
      orderBy: { id: "desc" },
      take: 1,
    });

    if (maxId.length > 0) {
      const nextId = maxId[0].id + 1;
      await prisma.$executeRawUnsafe(
        `ALTER SEQUENCE "api"."${tableName}_id_seq" RESTART WITH ${nextId}`
      );
    }
  } catch (error) {
    console.log(`Warning: Could not reset sequence for ${modelName}:`, error);
  }
}
