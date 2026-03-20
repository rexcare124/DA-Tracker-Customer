import { PrismaClient, Prisma } from "../../generated/client";
import { cleanAndValidateData } from "./validate-data";
import { writeDebugLog, writeErrorLog } from "./logs";
import { 
  SeedingResult, 
  SeedingBatch, 
  SeedingDataMap, 
  SpecialHandlersMap,
  SpecialHandlerFunction 
} from "./types";

/**
 * Process an entire batch of tables within a single transaction for maximum data integrity
 */
export async function processBatchInTransaction(
  prisma: PrismaClient,
  batch: SeedingBatch,
  jsonDataMap: SeedingDataMap,
  specialHandlers: SpecialHandlersMap
): Promise<SeedingResult> {
  const errors: string[] = [];
  let totalSuccessCount = 0;
  let totalErrorCount = 0;

  // Use 60s timeout for large batches (e.g. Fiscal Analysis Dependent Data)
  const TX_TIMEOUT_MS = 60_000;
  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const { file, model, special } of batch.tables) {
        const jsonData = jsonDataMap.get(file);
        if (!jsonData) {
          const errorMsg = `No data found for file ${file}`;
          errors.push(errorMsg);
          totalErrorCount++;
          continue;
        }

        const specialHandler = specialHandlers.get(model);
        
        try {
          // Get the model from Prisma client
          const prismaModel = (tx as any)[model];
          if (!prismaModel) {
            throw new Error(`Model ${model} not found in Prisma client`);
          }

          // Clean and validate all data first
          const cleanedData: any[] = [];
          
          for (const item of jsonData) {
            try {
              let cleanedItem = cleanAndValidateData(item, model);
              
              // Apply special handling if provided
              if (specialHandler) {
                cleanedItem = await specialHandler(item, cleanedItem);
              }
              
              cleanedData.push(cleanedItem);
            } catch (error) {
              const errorMsg = `Error cleaning data for ${model}: ${error instanceof Error ? error.message : String(error)}`;
              errors.push(errorMsg);
              totalErrorCount++;
            }
          }

          // Perform batch insert for this table
          if (cleanedData.length > 0) {
            try {
              const result = await prismaModel.createMany({
                data: cleanedData,
                skipDuplicates: true
              });
              totalSuccessCount += result.count;
              writeDebugLog(`TRANSACTION BATCH INSERT: ${model} - ${result.count} records inserted`);
            } catch (error) {
              // If batch insert fails, mark all records as failed and continue with next table
              const errorMsg = `Batch insert failed for ${model}: ${error instanceof Error ? error.message : String(error)}`;
              errors.push(errorMsg);
              totalErrorCount += cleanedData.length;
              writeDebugLog(`BATCH INSERT FAILED for ${model} in transaction: ${errorMsg}`);
            }
          }
        } catch (error) {
          const errorMsg = `Error processing ${model} in transaction: ${error instanceof Error ? error.message : String(error)}`;
          errors.push(errorMsg);
          totalErrorCount += jsonData.length;
        }
      }
    }, { timeout: TX_TIMEOUT_MS });
  } catch (error) {
    const errorMsg = `Transaction failed for batch ${batch.name}: ${error instanceof Error ? error.message : String(error)}`;
    errors.push(errorMsg);
    writeErrorLog(error, `transaction for batch ${batch.name}`);
  }

  return { successCount: totalSuccessCount, errorCount: totalErrorCount, errors };
}
