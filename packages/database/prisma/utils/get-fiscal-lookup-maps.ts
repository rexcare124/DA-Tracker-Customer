// Runtime caches for resolving fiscal lookups by unique names
let fiscalLookupCache: {
  fiscalDataTypeByName?: Record<string, number>;
  fundTypeByName?: Record<string, number>;
} = {};

export async function getFiscalLookupMaps(prisma: any) {
  if (!fiscalLookupCache.fiscalDataTypeByName || !fiscalLookupCache.fundTypeByName) {
    const [fiscalTypes, fundTypes] = await Promise.all([
      (prisma as any).fiscalDataType.findMany({ select: { id: true, typeName: true } }),
      (prisma as any).fundType.findMany({ select: { id: true, fundName: true } }),
    ]);
    fiscalLookupCache.fiscalDataTypeByName = {};
    for (const t of fiscalTypes) {
      fiscalLookupCache.fiscalDataTypeByName[t.typeName] = t.id;
    }
    fiscalLookupCache.fundTypeByName = {};
    for (const t of fundTypes) {
      fiscalLookupCache.fundTypeByName[t.fundName] = t.id;
    }
  }
  return fiscalLookupCache;
}
