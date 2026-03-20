import { DEBUG_VERBOSE } from "../seed";
import { handleEarlyExit, writeDebugLog, writeErrorLog } from "./logs";

const clearOrder = [
  // Audit and logging (most dependent)
  "auditLog",
  // Event tracking relationships (most dependent)
  "personEventShard1",
  "businessEventShard1",
  "governmentEventShard1",
  "NGOEventShard1",
  "eventShard1",
  "eventType",
  // HOA management tables (most dependent, must clear before HomeOwnerAssociation)
  "hOAMeeting",
  "hOAAssessment",
  "hOALegalRecord",
  "hOAAmenity",
  "hOAGoverningDocument",
  "hOAFeeHistory",
  "hOAInvoice",
  "hOAFinancialRecord",
  "hOAManagementCompany",
  "hOABoardMember",
  "subdivision",
  "homeOwnerAssociation",
  "realtor",
  "homeBuilder",
  // New lookup tables
  // Move dependent review tables before statusType to avoid FK violations
  "stateReviewSubjectShard1",
  "countyReviewSubjectShard1",
  "cityReviewSubjectShard1",
  "stateReviewShard1",
  "countyReviewShard1",
  "cityReviewShard1",
  "employmentDataShard1",
  "businessLicenseShard1",
  "personOrgRelationshipShard1",
  "classEnrollmentShard1",
  "teacherCredentialShard1",
  "statusType",
  "priorityType",
  "geographicReference",
  "systemConfiguration",
  "dataClassification",
  "validationRule",
  // Fiscal analysis tables (most dependent)
  "fiscalHealthScore",
  "OPEBDataShard1",
  "pensionDataShard1",
  "fiscalDataShard1",
  "ACFRReport",
  "pensionPlan",
  "fiscalDataType",
  "fundType",
  // Existing tables
  "classEnrollmentShard1",
  "classShard1",
  "teacherCredentialShard1",
  "studentArrestShard1",
  "schoolEmergencyIncidentShard1",
  "studentShard1",
  "teacherShard1",
  "disciplinaryActionShard1",
  "gradeProgressionShard1",
  "educationDataShard1",
  "graduationData",
  "businessSizeData",
  "businessLicenseShard1",
  "housingStatusShard1",
  "homelessCountData",
  "populationHistory",
  "laborForceStatistics",
  "employmentDataShard1",
  "crimeReportIncidentShard1",
  "cityReviewShard1",
  "countyReviewShard1",
  "stateReviewShard1",
  "personOrgRelationshipShard1",
  "cityReviewSubjectShard1",
  "countyReviewSubjectShard1",
  "stateReviewSubjectShard1",
  "organizationLocationShard1",
  "personLocationShard1",
  "locationShard1",
  "punishmentCrime",
  "offenseElement",
  "crimeStatute",
  "punishment",
  "element",
  "crime",
  "statute",
  "classification",
  "nonGovernmentalOrganizationShard1",
  "business",
  "governmentEntity",
  "person",
  "tableShardRegistry",
  "tableRegistry",
  "stateRegion",
  "zipCode",
  "city",
  "county",
  "state",
  "infractionType",
  "licenseType",
  "locationType",
  "reviewType",
  "relationshipType",
  "organizationType",
  "governmentLevel",
  "educationLevel",
  "school",
  "schoolDistrict",
  "teachingCredential",
];

// Extra diagnostics for FK violations during clearing
async function logForeignKeyDiagnostics(tableName: string, prisma: any) {
  try {
    console.log(`\n🔎 FK DIAGNOSTICS for clearing ${tableName}...`);
    const dependentsMap: Record<string, { model: string; field: string }[]> = {
      statusType: [
        { model: "stateReviewShard1", field: "statusId" },
        { model: "countyReviewShard1", field: "statusId" },
        { model: "cityReviewShard1", field: "statusId" },
        { model: "employmentDataShard1", field: "statusId" },
        { model: "businessLicenseShard1", field: "statusId" },
        { model: "personOrgRelationshipShard1", field: "statusId" },
        { model: "classEnrollmentShard1", field: "statusId" },
        { model: "teacherCredentialShard1", field: "statusId" },
      ],
    };

    const dependents = dependentsMap[tableName] || [];
    if (dependents.length === 0) {
      console.log("   (No known dependent tables configured for diagnostics)");
      return;
    }

    for (const dep of dependents) {
      const prismaModel = (prisma as any)[dep.model];
      if (!prismaModel || !prismaModel.count) continue;
      try {
        const total = await prismaModel.count();
        let referencing = 0;
        try {
          // Try counting rows where FK is not null (works if field is nullable)
          referencing = await prismaModel.count({ where: { [dep.field]: { not: null } } });
        } catch (_) {
          // Fallback: for non-nullable fields, any row references the FK
          referencing = total;
        }
        console.log(
          `   ${dep.model}: total=${total}, referencing ${tableName} via ${dep.field}=${referencing}`
        );

        // Sample first 5 referencing values for the FK field
        try {
          const samples = await prismaModel.findMany({
            select: { [dep.field]: true },
            take: 5,
          });
          const values = Array.from(new Set(samples.map((s: any) => s[dep.field]))).join(", ");
          console.log(`   ${dep.model}.${dep.field} sample values: [${values}]`);
        } catch (sampleErr) {
          console.log(
            `   ⚠️  Could not fetch sample values for ${dep.model}.${dep.field}: ${
              sampleErr instanceof Error ? sampleErr.message : String(sampleErr)
            }`
          );
        }
      } catch (innerErr) {
        console.log(
          `   ⚠️  Could not count references for ${dep.model}.${dep.field}: ${
            innerErr instanceof Error ? innerErr.message : String(innerErr)
          }`
        );
      }
    }
  } catch (diagErr) {
    console.log(
      `   ⚠️  Diagnostics failed: ${diagErr instanceof Error ? diagErr.message : String(diagErr)}`
    );
  }
}

export async function cleanExistingData(
  prisma: any,
  PrismaClientKnownRequestError: any
): Promise<void> {
  // Clear data in reverse dependency order

  for (const tableName of clearOrder) {
    try {
      const model = (prisma as any)[tableName];
      if (model && model.deleteMany) {
        const result = await model.deleteMany({});
        writeDebugLog(`CLEARED: ${tableName} - ${result.count} records deleted`);
      } else {
        writeDebugLog(`SKIPPED: ${tableName} - model not found or no deleteMany method`);
      }
    } catch (error) {
      writeErrorLog(error, `clearing ${tableName}`);
      // Log Prisma error details if available
      const anyErr: any = error;
      if (anyErr && anyErr.code) {
        console.log(`   Prisma error code: ${anyErr.code}`);
      }
      if (anyErr && anyErr.meta) {
        console.log(`   Prisma error meta: ${JSON.stringify(anyErr.meta)}`);
      }
      if (DEBUG_VERBOSE && error instanceof PrismaClientKnownRequestError) {
        console.log(
          `   Prisma known error (code=${(error as any).code}) meta=${JSON.stringify((error as any).meta)}`
        );
      }
      // Gracefully skip missing tables (e.g., when a model isn't present in this DB)
      if (anyErr && anyErr.code === "P2021") {
        console.log(
          `   ⚠️  Skipping clear for ${tableName} because the underlying table does not exist in this database.`
        );
        continue;
      }
      // Attempt to log dependent table diagnostics before exiting
      await logForeignKeyDiagnostics(tableName, prisma);
      // Fail-fast: stop execution if clearing fails before starting batches
      handleEarlyExit(error, `Clearing table ${tableName}`);
      return;
    }
  }
}
