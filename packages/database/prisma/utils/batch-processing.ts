import { PrismaClient, Prisma } from "../../generated/client";
import { cleanAndValidateData } from "./validate-data";
import { writeDebugLog, writeErrorLog } from "./logs";
import { 
  SeedingResult, 
  UpsertConfig, 
  DuplicateCheckFunction, 
  SpecialHandlerFunction,
  TypedPrismaClient 
} from "./types";

/**
 * Process a batch of data for a specific model using createMany for better performance
 */
export async function processBatchData(
  prisma: PrismaClient,
  modelName: string,
  jsonData: any[],
  specialHandling?: SpecialHandlerFunction,
  useTransaction: boolean = false
): Promise<SeedingResult> {
  const errors: string[] = [];
  let successCount = 0;
  let errorCount = 0;

  try {
    // Get the model from Prisma client
    const prismaModel = (prisma as any)[modelName];
    if (!prismaModel) {
      throw new Error(`Model ${modelName} not found in Prisma client`);
    }

    // Clean and validate all data first
    const cleanedData: any[] = [];
    
    for (const item of jsonData) {
      try {
        let cleanedItem = cleanAndValidateData(item, modelName);
        
        // Apply special handling if provided
        if (specialHandling) {
          cleanedItem = await specialHandling(item, cleanedItem);
        }
        
        cleanedData.push(cleanedItem);
      } catch (error) {
        errorCount++;
        const errorMsg = `Error cleaning data for ${modelName}: ${error instanceof Error ? error.message : String(error)}`;
        errors.push(errorMsg);
        writeErrorLog(error, `cleaning data for ${modelName}`);
      }
    }

    // If we have valid data, perform batch insert
    if (cleanedData.length > 0) {
      try {
        if (useTransaction) {
          // Use transaction for atomic batch insert
          await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const result = await (tx as any)[modelName].createMany({
              data: cleanedData,
              skipDuplicates: true
            });
            successCount = result.count;
          });
        } else {
          // Direct batch insert
          const result = await prismaModel.createMany({
            data: cleanedData,
            skipDuplicates: true
          });
          successCount = result.count;
        }
        writeDebugLog(`BATCH INSERT: ${modelName} - ${successCount} records inserted`);
      } catch (error) {
        // If batch insert fails, fall back to individual inserts for better error reporting
        writeDebugLog(`BATCH INSERT FAILED for ${modelName}, falling back to individual inserts`);
        return await processIndividualInserts(prisma, modelName, cleanedData, specialHandling, useTransaction);
      }
    }

    return { successCount, errorCount, errors };
  } catch (error) {
    const errorMsg = `Error processing batch for ${modelName}: ${error instanceof Error ? error.message : String(error)}`;
    errors.push(errorMsg);
    writeErrorLog(error, `processing batch for ${modelName}`);
    return { successCount, errorCount, errors };
  }
}

/**
 * Fallback to individual inserts when batch insert fails
 */
async function processIndividualInserts(
  prisma: PrismaClient,
  modelName: string,
  cleanedData: any[],
  specialHandling?: SpecialHandlerFunction,
  useTransaction: boolean = false
): Promise<SeedingResult> {
  const errors: string[] = [];
  let successCount = 0;
  let errorCount = 0;

  const prismaModel = (prisma as any)[modelName];

  if (useTransaction) {
    // Use transaction for individual inserts
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        for (const cleanedItem of cleanedData) {
          try {
            await (tx as any)[modelName].create({ data: cleanedItem });
            successCount++;
          } catch (error) {
            errorCount++;
            const errorMsg = `Error inserting individual record in ${modelName}: ${error instanceof Error ? error.message : String(error)}`;
            errors.push(errorMsg);
            writeErrorLog(error, `individual insert for ${modelName}`);
          }
        }
      });
    } catch (error) {
      errorCount = cleanedData.length;
      const errorMsg = `Transaction failed for ${modelName}: ${error instanceof Error ? error.message : String(error)}`;
      errors.push(errorMsg);
      writeErrorLog(error, `transaction for ${modelName}`);
    }
  } else {
    // Direct individual inserts
    for (const cleanedItem of cleanedData) {
      try {
        await prismaModel.create({ data: cleanedItem });
        successCount++;
      } catch (error) {
        errorCount++;
        const errorMsg = `Error inserting individual record in ${modelName}: ${error instanceof Error ? error.message : String(error)}`;
        errors.push(errorMsg);
        writeErrorLog(error, `individual insert for ${modelName}`);
      }
    }
  }

  return { successCount, errorCount, errors };
}

/**
 * Process data with upsert logic for models that need it
 */
export async function processUpsertData(
  prisma: PrismaClient,
  modelName: string,
  jsonData: any[],
  upsertConfig: UpsertConfig,
  useTransaction: boolean = false
): Promise<SeedingResult> {
  const errors: string[] = [];
  let successCount = 0;
  let errorCount = 0;

  const prismaModel = (prisma as any)[modelName];
  if (!prismaModel) {
    throw new Error(`Model ${modelName} not found in Prisma client`);
  }

  if (useTransaction) {
    // Use transaction for upsert operations
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        for (const item of jsonData) {
          try {
            const cleanedItem = cleanAndValidateData(item, modelName);
            
            await (tx as any)[modelName].upsert({
              where: upsertConfig.where(cleanedItem),
              create: upsertConfig.create(cleanedItem),
              update: upsertConfig.update(cleanedItem)
            });
            
            successCount++;
          } catch (error) {
            errorCount++;
            const errorMsg = `Error upserting record in ${modelName}: ${error instanceof Error ? error.message : String(error)}`;
            errors.push(errorMsg);
            writeErrorLog(error, `upsert for ${modelName}`);
          }
        }
      });
    } catch (error) {
      errorCount = jsonData.length;
      const errorMsg = `Transaction failed for ${modelName} upserts: ${error instanceof Error ? error.message : String(error)}`;
      errors.push(errorMsg);
      writeErrorLog(error, `transaction for ${modelName} upserts`);
    }
  } else {
    // Direct upsert operations
    for (const item of jsonData) {
      try {
        const cleanedItem = cleanAndValidateData(item, modelName);
        
        await prismaModel.upsert({
          where: upsertConfig.where(cleanedItem),
          create: upsertConfig.create(cleanedItem),
          update: upsertConfig.update(cleanedItem)
        });
        
        successCount++;
      } catch (error) {
        errorCount++;
        const errorMsg = `Error upserting record in ${modelName}: ${error instanceof Error ? error.message : String(error)}`;
        errors.push(errorMsg);
        writeErrorLog(error, `upsert for ${modelName}`);
      }
    }
  }

  return { successCount, errorCount, errors };
}

/**
 * Process data with special duplicate checking logic
 */
export async function processDuplicateCheckData(
  prisma: PrismaClient,
  modelName: string,
  jsonData: any[],
  duplicateCheck: DuplicateCheckFunction,
  useTransaction: boolean = false
): Promise<SeedingResult> {
  const errors: string[] = [];
  let successCount = 0;
  let errorCount = 0;

  const prismaModel = (prisma as any)[modelName];
  if (!prismaModel) {
    throw new Error(`Model ${modelName} not found in Prisma client`);
  }

  if (useTransaction) {
    // Use transaction for duplicate check operations
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        for (const item of jsonData) {
          try {
            const cleanedItem = cleanAndValidateData(item, modelName);
            
            // Check for existing record
            const existing = await duplicateCheck(cleanedItem);
            
            if (existing) {
              // Update existing record
              await (tx as any)[modelName].update({
                where: { id: existing.id },
                data: cleanedItem
              });
            } else {
              // Create new record
              await (tx as any)[modelName].create({ data: cleanedItem });
            }
            
            successCount++;
          } catch (error) {
            errorCount++;
            const errorMsg = `Error processing record in ${modelName}: ${error instanceof Error ? error.message : String(error)}`;
            errors.push(errorMsg);
            writeErrorLog(error, `duplicate check for ${modelName}`);
          }
        }
      });
    } catch (error) {
      errorCount = jsonData.length;
      const errorMsg = `Transaction failed for ${modelName} duplicate checks: ${error instanceof Error ? error.message : String(error)}`;
      errors.push(errorMsg);
      writeErrorLog(error, `transaction for ${modelName} duplicate checks`);
    }
  } else {
    // Direct duplicate check operations
    for (const item of jsonData) {
      try {
        const cleanedItem = cleanAndValidateData(item, modelName);
        
        // Check for existing record
        const existing = await duplicateCheck(cleanedItem);
        
        if (existing) {
          // Update existing record
          await prismaModel.update({
            where: { id: existing.id },
            data: cleanedItem
          });
        } else {
          // Create new record
          await prismaModel.create({ data: cleanedItem });
        }
        
        successCount++;
      } catch (error) {
        errorCount++;
        const errorMsg = `Error processing record in ${modelName}: ${error instanceof Error ? error.message : String(error)}`;
        errors.push(errorMsg);
        writeErrorLog(error, `duplicate check for ${modelName}`);
      }
    }
  }

  return { successCount, errorCount, errors };
}
