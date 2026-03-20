// Cached maximum IDs for simple FK sanity checks during seeding
const maxIdCache: Record<string, number> = {};
export async function getMaxId(prisma: any, modelName: string): Promise<number> {
  if (maxIdCache[modelName] !== undefined) return maxIdCache[modelName];
  const model = (prisma as any)[modelName];
  if (!model) return 0;
  const last = await model.findFirst({ select: { id: true }, orderBy: { id: "desc" } });
  const max = last?.id ?? 0;
  maxIdCache[modelName] = max;
  return max;
}
