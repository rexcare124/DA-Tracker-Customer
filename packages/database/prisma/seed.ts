/**
 * How to run the seed (Monorepo with server/.env)
 *
 * Prerequisites:
 * - Define DATABASE_URL in server/.env (and ensure the database is reachable)
 * - Push schema and generate client using the shared schema file
 *
 * Recommended steps (Windows PowerShell):
 *   cd C:\\Code\\WebApps\\PlentifulKnowledge\\PK-Website\\server
 *   npx prisma generate --schema="../packages/database/prisma/schema.prisma"
 *   npx prisma db push --schema="../packages/database/prisma/schema.prisma"
 *   cd ../packages/database
 *   npx ts-node prisma/seed.ts
 *
 * Optional flags:
 *   SEED_DEBUG=1            # verbose logging
 *   SEED_STOP_ON_ERROR=0    # continue on errors
 *   --debug                 # same as SEED_DEBUG=1
 *   --stop-on-error         # same as SEED_STOP_ON_ERROR=1
 */
// Ensure environment variables (like DATABASE_URL) are loaded before PrismaClient is constructed
import * as fs from "fs";
import * as path from "path";
import { Prisma } from "../generated/client";
// Debug verbosity flag (enable with SEED_DEBUG=1 or --debug)
export const DEBUG_VERBOSE =
  process.env.SEED_DEBUG === "1" || process.argv.includes("--debug") || false; // Disable debug by default

// Early exit flag (disable with SEED_STOP_ON_ERROR=0)
export const STOP_ON_ERROR = process.env.SEED_STOP_ON_ERROR !== "0"; // Enable by default, disable with SEED_STOP_ON_ERROR=0

// Function to update fiscal data references after ACFR reports and pension plans are seeded
async function updateFiscalDataReferences() {
  try {
    console.log(`\n🔄 UPDATING FISCAL DATA REFERENCES...`);

    // Get current ACFR report IDs
    const acfrReports = await (prisma as any).aCFRReport.findMany({
      select: { id: true, governmentEntityId: true, fiscalYear: true },
      orderBy: [{ governmentEntityId: "asc" }, { fiscalYear: "desc" }],
    });

    console.log(`📊 Current ACFR Report IDs: [${acfrReports.map((r: any) => r.id).join(", ")}]`);

    // Get current pension plan IDs
    const pensionPlans = await (prisma as any).pensionPlan.findMany({
      select: { id: true, governmentEntityId: true, planCode: true },
      orderBy: [{ governmentEntityId: "asc" }, { id: "asc" }],
    });

    console.log(`📊 Current Pension Plan IDs: [${pensionPlans.map((p: any) => p.id).join(", ")}]`);

    // Get current fiscal data type and fund type IDs
    const fiscalTypes = await (prisma as any).fiscalDataType.findMany({
      select: { id: true, typeName: true },
      orderBy: { id: "asc" },
    });
    const fundTypes = await (prisma as any).fundType.findMany({
      select: { id: true, fundName: true },
      orderBy: { id: "asc" },
    });
    if (DEBUG_VERBOSE) {
      console.log(
        `📊 Current Fiscal Data Type IDs: [${fiscalTypes.map((t: any) => t.id).join(", ")}]`,
      );
      console.log(`📊 Current Fund Type IDs: [${fundTypes.map((t: any) => t.id).join(", ")}]`);
    }

    // Update fiscal data file
    const fiscalDataPath = path.join(__dirname, "seedData", "fiscal_data_shard_1.json");
    if (fs.existsSync(fiscalDataPath)) {
      const fiscalData = JSON.parse(fs.readFileSync(fiscalDataPath, "utf8"));
      let updated = false;

      // Map ACFR report IDs (assuming first 6 ACFR reports correspond to first 6 fiscal data entries)
      const acfrIdMap: Record<number, number> = {};
      for (let i = 0; i < Math.min(6, acfrReports.length); i++) {
        acfrIdMap[i + 1] = acfrReports[i].id;
      }

      fiscalData.forEach((item: any, index: number) => {
        const expectedId = index + 1;
        const actualId = acfrIdMap[expectedId];
        if (actualId && item.acfrReportId !== actualId) {
          if (DEBUG_VERBOSE) {
            console.log(
              `🔄 Updating fiscal data ${index + 1}: acfrReportId ${
                item.acfrReportId
              } → ${actualId}`,
            );
          }
          item.acfrReportId = actualId;
          updated = true;
        }
      });

      // Map fiscalDataTypeId 1..N to current IDs in ascending order
      const fiscalTypeIdMap: Record<number, number> = {};
      for (let i = 0; i < fiscalTypes.length; i++) {
        fiscalTypeIdMap[i + 1] = fiscalTypes[i].id;
      }
      fiscalData.forEach((item: any) => {
        const expectedType = item.fiscalDataTypeId;
        const mappedTypeId = fiscalTypeIdMap[expectedType];
        if (mappedTypeId && item.fiscalDataTypeId !== mappedTypeId) {
          if (DEBUG_VERBOSE) {
            console.log(
              `🔄 Updating fiscal data typeId ${item.fiscalDataTypeId} → ${mappedTypeId}`,
            );
          }
          item.fiscalDataTypeId = mappedTypeId;
          updated = true;
        }
      });

      // Map fundTypeId 1..N to current IDs in ascending order
      const fundTypeIdMap: Record<number, number> = {};
      for (let i = 0; i < fundTypes.length; i++) {
        fundTypeIdMap[i + 1] = fundTypes[i].id;
      }
      fiscalData.forEach((item: any) => {
        const expectedFund = item.fundTypeId;
        const mappedFundId = fundTypeIdMap[expectedFund];
        if (mappedFundId && item.fundTypeId !== mappedFundId) {
          if (DEBUG_VERBOSE) {
            console.log(`🔄 Updating fund typeId ${item.fundTypeId} → ${mappedFundId}`);
          }
          item.fundTypeId = mappedFundId;
          updated = true;
        }
      });

      if (updated) {
        fs.writeFileSync(fiscalDataPath, JSON.stringify(fiscalData, null, 2));
        console.log(
          `✅ Updated fiscal_data_shard_1.json with correct ACFR/fiscal type/fund type IDs`,
        );
      }
    }

    // Update pension data file
    const pensionDataPath = path.join(__dirname, "seedData", "pension_data_shard_1.json");
    if (fs.existsSync(pensionDataPath)) {
      const pensionData = JSON.parse(fs.readFileSync(pensionDataPath, "utf8"));
      let updated = false;

      // Map pension plan IDs (assuming first 12 pension plans correspond to first 12 pension data entries)
      const pensionIdMap: Record<number, number> = {};
      for (let i = 0; i < Math.min(12, pensionPlans.length); i++) {
        pensionIdMap[i + 1] = pensionPlans[i].id;
      }

      pensionData.forEach((item: any, index: number) => {
        const expectedId = index + 1;
        const actualId = pensionIdMap[expectedId];
        if (actualId && item.pensionPlanId !== actualId) {
          if (DEBUG_VERBOSE) {
            console.log(
              `🔄 Updating pension data ${index + 1}: pensionPlanId ${
                item.pensionPlanId
              } → ${actualId}`,
            );
          }
          item.pensionPlanId = actualId;
          updated = true;
        }
      });

      if (updated) {
        fs.writeFileSync(pensionDataPath, JSON.stringify(pensionData, null, 2));
        console.log(`✅ Updated pension_data_shard_1.json with correct pension plan IDs`);
      }
    }

    // Update OPEB data file
    const opebDataPath = path.join(__dirname, "seedData", "opeb_data_shard_1.json");
    if (fs.existsSync(opebDataPath)) {
      const opebData = JSON.parse(fs.readFileSync(opebDataPath, "utf8"));
      let updated = false;

      // Map ACFR report IDs for OPEB data (assuming first 11 ACFR reports correspond to first 11 OPEB data entries)
      const acfrIdMap: Record<number, number> = {};
      for (let i = 0; i < Math.min(11, acfrReports.length); i++) {
        acfrIdMap[i + 1] = acfrReports[i].id;
      }

      opebData.forEach((item: any, index: number) => {
        const expectedId = index + 1;
        const actualId = acfrIdMap[expectedId];
        if (actualId && item.acfrReportId !== actualId) {
          if (DEBUG_VERBOSE) {
            console.log(
              `🔄 Updating OPEB data ${index + 1}: acfrReportId ${item.acfrReportId} → ${actualId}`,
            );
          }
          item.acfrReportId = actualId;
          updated = true;
        }
      });

      if (updated) {
        fs.writeFileSync(opebDataPath, JSON.stringify(opebData, null, 2));
        console.log(`✅ Updated opeb_data_shard_1.json with correct ACFR report IDs`);
      }
    }
  } catch (error) {
    console.log(
      `❌ Error updating fiscal data references: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

try {
  // Try server/.env first (where DATABASE_URL is defined)
  // Fallback to client/.env, then repository root .env
  const dotenvPathCandidates = [
    // From prisma/ -> up to packages/database/prisma -> ../../../server/.env
    path.join(__dirname, "../../../server/.env"),
    path.join(__dirname, "../../../client/.env"),
    path.join(__dirname, "../../../.env"),
    // Fallbacks within this package (in case env is duplicated locally)
    path.join(__dirname, "../../.env"),
  ];
  for (const p of dotenvPathCandidates) {
    if (fs.existsSync(p)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("dotenv").config({ path: p });
      break;
    }
  }
} catch {}
import { PrismaClient } from "../generated/client";
import {
  writeDebugLog,
  writeDebugObject,
  writeErrorLog,
  writeSuccessLog,
  cleanAndValidateData,
  cleanExistingData,
  seedingBatches,
  checkExistingRecords,
  handleEarlyExit,
  resetSequence,
  getFiscalLookupMaps,
  processBatchData,
  processUpsertData,
  processDuplicateCheckData,
  getSpecialHandler,
  processBatchInTransaction,
} from "./utils";
import { SeedingDataMap, SpecialHandlersMap } from "./utils/types";

const prisma = new PrismaClient();

// Main seeding function
async function main() {
  console.log("🚀 Starting database seeding process...");
  writeDebugLog("SEEDING STARTED: Beginning database seeding process");

  console.log("🧹 Clearing existing data...");
  writeDebugLog("CLEARING: Starting data clearing process");

  await cleanExistingData(prisma, null);

  writeDebugLog("CLEARING COMPLETED: Data clearing process finished");

  console.log(" Starting database seeding in batches with transactions...");
  // Process each batch sequentially with transaction support
  for (let batchIndex = 0; batchIndex < seedingBatches.length; batchIndex++) {
    const batch = seedingBatches[batchIndex];
    console.log(`\n📦 Processing Batch ${batchIndex + 1}: ${batch.name}`);
    console.log(`   Tables: ${batch.tables.map((t) => t.model).join(", ")}`);

    writeDebugLog(`BATCH START: ${batchIndex + 1} - ${batch.name}`);
    writeDebugLog(`BATCH TABLES: ${batch.tables.map((t) => t.model).join(", ")}`);

    let batchHasErrors = false;
    let batchSuccessCount = 0;
    let batchErrorCount = 0;

    // Pre-load all JSON data for this batch
    const jsonDataMap: SeedingDataMap = new Map();
    const specialHandlers: SpecialHandlersMap = new Map();

    for (const { file, model, special } of batch.tables) {
      const jsonFilePath = path.join(__dirname, "seedData", file);

      if (!fs.existsSync(jsonFilePath)) {
        console.log(`   ⚠️  Skipping ${model} - file not found`);
        writeDebugLog(`SKIPPED: ${model} - file ${file} not found`);
        continue;
      }

      try {
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
        jsonDataMap.set(file, jsonData);

        // Get special handler for this model if it exists
        const specialHandler = getSpecialHandler(model, prisma);
        if (specialHandler) {
          specialHandlers.set(model, await specialHandler);
        }
      } catch (error) {
        console.log(
          `   ❌ Error loading ${file}: ${error instanceof Error ? error.message : String(error)}`,
        );
        batchHasErrors = true;
        continue;
      }
    }

    // Process the entire batch in a single transaction for maximum data integrity
    try {
      const result = await processBatchInTransaction(prisma, batch, jsonDataMap, specialHandlers);
      batchSuccessCount = result.successCount;
      batchErrorCount = result.errorCount;

      if (result.errors.length > 0) {
        batchHasErrors = true;
        console.log(`❌ ERRORS in batch ${batchIndex + 1}:`);
        result.errors.forEach((error) => {
          console.log(`   ${error}`);
        });
      }
    } catch (error) {
      batchHasErrors = true;
      batchErrorCount = 1;
      writeErrorLog(error, `processing batch ${batchIndex + 1} (${batch.name})`);
      console.log(`❌ BATCH PROCESSING ERROR in ${batch.name}:`);
      console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Handle special cases that need individual processing (excluding locationShard1 which is handled in batch)
    for (const { file, model, special } of batch.tables) {
      if (special && model !== "locationShard1") {
        console.log(`   🌱 Processing special case: ${model}...`);
        writeDebugLog(`SPECIAL TABLE START: ${model} from file ${file}`);

        const jsonData = jsonDataMap.get(file);
        if (!jsonData) continue;

        let specialSuccessCount = 0;
        let specialErrorCount = 0;

        for (const [itemName, data] of Object.entries(jsonData)) {
          try {
            const cleanedData = cleanAndValidateData(data, model);
            await (prisma as any)[model].create({
              data: cleanedData,
            });
            specialSuccessCount++;
          } catch (error) {
            specialErrorCount++;
            batchHasErrors = true;
            writeDebugLog(`Error seeding ${itemName} in ${model}: ${error}`);
          }
        }

        batchSuccessCount += specialSuccessCount;
        batchErrorCount += specialErrorCount;

        if (specialErrorCount === 0) {
          await resetSequence(prisma, model.toLowerCase(), model);
          console.log(
            `   ✅ Completed seeding ${model} (${specialSuccessCount} success, 0 errors)`,
          );
        } else {
          console.log(
            `   ❌ Completed seeding ${model} (${specialSuccessCount} success, ${specialErrorCount} errors)`,
          );
        }
      }
    }

    // Note: Fiscal data references are now handled by proper batch ordering
    // ACFR reports and pension plans are seeded in separate batches before dependent data

    // Check if this batch had errors
    if (batchHasErrors) {
      console.log(`\n🚨 BATCH ${batchIndex + 1} FAILED with ${batchErrorCount} errors!`);
      console.log(`   Batch Summary: ${batchSuccessCount} success, ${batchErrorCount} errors`);
      console.log(
        `\n🛑 STOPPING SEEDING PROCESS - Fix the errors in Batch ${
          batchIndex + 1
        } before proceeding.`,
      );
      console.log(`   Failed batch: ${batch.name}`);
      console.log(`   Tables with errors: ${batch.tables.map((t) => t.model).join(", ")}`);

      writeErrorLog(
        `Batch ${batchIndex + 1} failed`,
        `Batch ${batch.name} - ${batchErrorCount} errors`,
      );
      writeDebugLog(`SEEDING STOPPED: Batch ${batchIndex + 1} failed with errors`);

      // Stop execution immediately on batch failure if enabled
      if (STOP_ON_ERROR) {
        const batchError = new Error(
          `Batch ${batchIndex + 1} failed with ${batchErrorCount} errors: ${batch.name} failed`,
        );
        handleEarlyExit(batchError, `Batch ${batchIndex + 1} (${batch.name})`);

        // Exit with error code
        process.exit(1);
      } else {
        console.log(`\n⚠️  CONTINUING DESPITE ERRORS in Batch ${batchIndex + 1}...`);
        console.log(`   Batch Summary: ${batchSuccessCount} success, ${batchErrorCount} errors`);
      }
    }

    console.log(`\n✅ BATCH ${batchIndex + 1} COMPLETED SUCCESSFULLY`);
    console.log(`   Batch Summary: ${batchSuccessCount} success, 0 errors`);
    writeDebugLog(
      `BATCH COMPLETED: ${batchIndex + 1} - ${batch.name} - ${batchSuccessCount} records seeded`,
    );

    // Removed inter-batch sleep for performance
  }

  console.log("\n🎉 ALL BATCHES COMPLETED SUCCESSFULLY!");
  console.log("🌱 Database seeding completed successfully!");
  writeDebugLog("SEEDING COMPLETED: All batches processed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Database seeding failed:", e);
    writeErrorLog(e, "main seeding process");
    writeDebugLog("SEEDING FAILED: Main process failed with error");
    process.exit(1);
  })
  .finally(async () => {
    writeDebugLog("SEEDING ENDED: Disconnecting from database");
    await prisma.$disconnect();
  });
