import { PrismaClient } from "../../generated/client";
import { getFiscalLookupMaps } from "./get-fiscal-lookup-maps";
import { writeDebugLog, writeDebugObject } from "./logs";
import { 
  SpecialHandlerFunction,
  FiscalDataItem,
  PensionDataItem,
  EventDataItem,
  EmploymentDataItem,
  TeacherCredentialItem,
  ClassEnrollmentItem,
  BusinessLicenseItem,
  ReviewDataItem,
  PersonOrgRelationshipItem
} from "./types";

/**
 * Special handling for fiscal data models that require complex foreign key resolution
 */
export async function createFiscalDataHandler(prisma: PrismaClient): Promise<SpecialHandlerFunction<FiscalDataItem>> {
  return async (item: any, cleanedItem: FiscalDataItem): Promise<FiscalDataItem> => {
    const lookups = await getFiscalLookupMaps(prisma);
    
    // Ensure current ACFR report IDs for runtime remap
    const acfrRows = await (prisma as any).aCFRReport.findMany({
      select: { id: true },
      orderBy: { id: "asc" },
    });
    const acfrIdSet = new Set<number>(acfrRows.map((r: any) => r.id));
    const minAcfrId = acfrRows.length > 0 ? acfrRows[0].id : undefined;
    
    if ((cleanedItem as any).fiscalDataTypeName && lookups.fiscalDataTypeByName) {
      const key = (cleanedItem as any).fiscalDataTypeName as string;
      const id = lookups.fiscalDataTypeByName[key];
      if (id) {
        (cleanedItem as any).fiscalDataTypeId = id;
        delete (cleanedItem as any).fiscalDataTypeName;
      }
    }
    
    if ((cleanedItem as any).fundTypeName && lookups.fundTypeByName) {
      const key = (cleanedItem as any).fundTypeName as string;
      const id = lookups.fundTypeByName[key];
      if (id) {
        (cleanedItem as any).fundTypeId = id;
        delete (cleanedItem as any).fundTypeName;
      }
    }
    
    // Final safety: if provided numeric IDs don't exist in current DB, remap to a valid existing ID
    const typeIds = lookups.fiscalDataTypeByName
      ? Object.values(lookups.fiscalDataTypeByName)
      : [];
    const fundIds = lookups.fundTypeByName ? Object.values(lookups.fundTypeByName) : [];
    
    if (typeIds.length > 0 && typeof (cleanedItem as any).fiscalDataTypeId === "number") {
      const provided = (cleanedItem as any).fiscalDataTypeId as number;
      if (!typeIds.includes(provided)) {
        (cleanedItem as any).fiscalDataTypeId = Math.min(...typeIds);
      }
    }
    
    if (fundIds.length > 0 && typeof (cleanedItem as any).fundTypeId === "number") {
      const provided = (cleanedItem as any).fundTypeId as number;
      if (!fundIds.includes(provided)) {
        (cleanedItem as any).fundTypeId = Math.min(...fundIds);
      }
    }
    
    // If acfrReportId is not valid in current DB, remap to a safe existing ID
    if (typeof (cleanedItem as any).acfrReportId === "number" && minAcfrId !== undefined) {
      if (!acfrIdSet.has((cleanedItem as any).acfrReportId)) {
        (cleanedItem as any).acfrReportId = minAcfrId;
      }
    }
    
    return cleanedItem;
  };
}

/**
 * Special handling for pension and OPEB data models
 */
export async function createPensionDataHandler(prisma: PrismaClient): Promise<SpecialHandlerFunction<PensionDataItem>> {
  return async (item: any, cleanedItem: PensionDataItem): Promise<PensionDataItem> => {
    // Ensure current ACFR report IDs for runtime remap
    const acfrRows = await (prisma as any).aCFRReport.findMany({
      select: { id: true },
      orderBy: { id: "asc" },
    });
    const acfrIdSet = new Set<number>(acfrRows.map((r: any) => r.id));
    const minAcfrId = acfrRows.length > 0 ? acfrRows[0].id : undefined;
    
    if (typeof (cleanedItem as any).acfrReportId === "number" && minAcfrId !== undefined) {
      if (!acfrIdSet.has((cleanedItem as any).acfrReportId)) {
        (cleanedItem as any).acfrReportId = minAcfrId;
      }
    }
    
    // Additionally for pensionDataShard1, ensure pensionPlanId exists
    const planRows = await (prisma as any).pensionPlan.findMany({
      select: { id: true },
      orderBy: { id: "asc" },
    });
    const planIdSet = new Set<number>(planRows.map((r: any) => r.id));
    const minPlanId = planRows.length > 0 ? planRows[0].id : undefined;
    
    if (
      typeof (cleanedItem as any).pensionPlanId === "number" &&
      minPlanId !== undefined
    ) {
      if (!planIdSet.has((cleanedItem as any).pensionPlanId)) {
        (cleanedItem as any).pensionPlanId = minPlanId;
      }
    }
    
    return cleanedItem;
  };
}

/**
 * Special handling for event data models
 */
export async function createEventDataHandler(prisma: PrismaClient): Promise<SpecialHandlerFunction<EventDataItem>> {
  let eventTypeIdMap: Record<number, number> | null = null;
  let eventStatusIdMap: Record<number, number> | null = null;
  
  const ensureEventLookups = async () => {
    if (!eventTypeIdMap) {
      const rows = await (prisma as any).eventType.findMany({
        select: { id: true },
        orderBy: { id: "asc" },
      });
      eventTypeIdMap = {};
      for (let i = 0; i < rows.length; i++) eventTypeIdMap[i + 1] = rows[i].id;
    }
    if (!eventStatusIdMap) {
      const rows = await (prisma as any).statusType.findMany({
        where: { category: "event" },
        select: { id: true },
        orderBy: { id: "asc" },
      });
      eventStatusIdMap = {};
      for (let i = 0; i < rows.length; i++) eventStatusIdMap[i + 1] = rows[i].id;
    }
  };
  
  return async (item: any, cleanedItem: EventDataItem): Promise<EventDataItem> => {
    await ensureEventLookups();
    
    if (eventTypeIdMap && typeof (cleanedItem as any).eventTypeId === "number") {
      const mapped = eventTypeIdMap[(cleanedItem as any).eventTypeId];
      if (mapped) (cleanedItem as any).eventTypeId = mapped;
    }
    if (eventStatusIdMap && typeof (cleanedItem as any).eventStatusId === "number") {
      const mapped = eventStatusIdMap[(cleanedItem as any).eventStatusId];
      if (mapped) (cleanedItem as any).eventStatusId = mapped;
    }
    
    return cleanedItem;
  };
}

/**
 * Special handling for person-org relationship data
 */
export async function createPersonOrgRelationshipHandler(prisma: PrismaClient): Promise<SpecialHandlerFunction<PersonOrgRelationshipItem>> {
  return async (item: any, cleanedItem: PersonOrgRelationshipItem): Promise<PersonOrgRelationshipItem> => {
    const employedStatus = await (prisma as any).statusType.findFirst({
      where: { statusName: "Employed", category: "employment" },
    });
    if (employedStatus && employedStatus.id) {
      cleanedItem.statusId = employedStatus.id;
    }
    writeDebugObject("PERSON_ORG_REL statusId", {
      cleanedItemStatusId: cleanedItem.statusId,
    });
    
    return cleanedItem;
  };
}

/**
 * Special handling for employment data
 */
export async function createEmploymentDataHandler(prisma: PrismaClient): Promise<SpecialHandlerFunction<EmploymentDataItem>> {
  return async (item: any, cleanedItem: EmploymentDataItem): Promise<EmploymentDataItem> => {
    // Map employment status string/category to StatusType(category='employment')
    const raw = (item as any).employment_status || (item as any).status;
    if (raw && !cleanedItem.statusId) {
      const statusName = String(raw).replace(/\b\w/g, (c) => c.toUpperCase());
      const row = await (prisma as any).statusType.findFirst({
        where: { statusName, category: "employment" },
      });
      if (row?.id) cleanedItem.statusId = row.id;
    }
    
    return cleanedItem;
  };
}

/**
 * Special handling for teacher credential data
 */
export async function createTeacherCredentialHandler(prisma: PrismaClient): Promise<SpecialHandlerFunction<TeacherCredentialItem>> {
  return async (item: any, cleanedItem: TeacherCredentialItem): Promise<TeacherCredentialItem> => {
    const raw = (item as any).status || (item as any).credential_status;
    if (raw && !cleanedItem.statusId) {
      const statusName = String(raw).replace(/\b\w/g, (c) => c.toUpperCase());
      const row = await (prisma as any).statusType.findFirst({
        where: { statusName, category: "education" },
      });
      if (row?.id) cleanedItem.statusId = row.id;
    }
    
    return cleanedItem;
  };
}

/**
 * Special handling for class enrollment data
 */
export async function createClassEnrollmentHandler(prisma: PrismaClient): Promise<SpecialHandlerFunction<ClassEnrollmentItem>> {
  return async (item: any, cleanedItem: ClassEnrollmentItem): Promise<ClassEnrollmentItem> => {
    // Map status text to an education status if provided
    const raw = (item as any).status || (item as any).completion_status;
    if (raw && !cleanedItem.statusId) {
      // Normalize common values to education category
      const normalized = String(raw).toLowerCase();
      let statusName = "Enrolled";
      if (normalized.includes("progress")) statusName = "Enrolled";
      if (normalized.includes("graduate")) statusName = "Graduated";
      if (normalized.includes("drop")) statusName = "Dropped Out";
      const row = await (prisma as any).statusType.findFirst({
        where: { statusName, category: "education" },
      });
      if (row?.id) cleanedItem.statusId = row.id;
    }
    
    return cleanedItem;
  };
}

/**
 * Special handling for business license data
 */
export async function createBusinessLicenseHandler(prisma: PrismaClient): Promise<SpecialHandlerFunction<BusinessLicenseItem>> {
  return async (item: any, cleanedItem: BusinessLicenseItem): Promise<BusinessLicenseItem> => {
    // Map license status using StatusType(category='license')
    const raw = (item as any).status || (item as any).license_status;
    if (raw && !cleanedItem.statusId) {
      const statusName = String(raw).replace(/\b\w/g, (c) => c.toUpperCase());
      const row = await (prisma as any).statusType.findFirst({
        where: { statusName, category: "license" },
      });
      if (row?.id) cleanedItem.statusId = row.id;
    }
    
    return cleanedItem;
  };
}

/**
 * Special handling for review data models
 */
export async function createReviewDataHandler(prisma: PrismaClient): Promise<SpecialHandlerFunction<ReviewDataItem>> {
  return async (item: any, cleanedItem: ReviewDataItem): Promise<ReviewDataItem> => {
    // Map status string to StatusType in category 'review'
    if ((item as any).status && !cleanedItem.statusId) {
      const statusNameRaw = String((item as any).status).replace(/_/g, " ");
      const statusName = statusNameRaw.replace(/\b\w/g, (c) => c.toUpperCase()); // e.g., under_review -> Under Review
      const statusRow = await (prisma as any).statusType.findFirst({
        where: { statusName, category: "review" },
      });
      if (statusRow && statusRow.id) {
        cleanedItem.statusId = statusRow.id;
      }
    }
    
    // Remove raw status string if present to avoid Prisma validation error
    if ("status" in cleanedItem) {
      delete (cleanedItem as any).status;
    }
    
    if (!cleanedItem.isVerified) cleanedItem.isVerified = false;
    writeDebugObject("REVIEW cleaned item", cleanedItem);
    
    return cleanedItem;
  };
}

/**
 * Get the appropriate special handler for a model
 */
export function getSpecialHandler(modelName: string, prisma: PrismaClient): Promise<SpecialHandlerFunction> | null {
  switch (modelName) {
    case "fiscalDataShard1":
      return createFiscalDataHandler(prisma);
    case "pensionDataShard1":
    case "OPEBDataShard1":
      return createPensionDataHandler(prisma);
    case "eventShard1":
      return createEventDataHandler(prisma);
    case "personOrgRelationshipShard1":
      return createPersonOrgRelationshipHandler(prisma);
    case "employmentDataShard1":
      return createEmploymentDataHandler(prisma);
    case "teacherCredentialShard1":
      return createTeacherCredentialHandler(prisma);
    case "classEnrollmentShard1":
      return createClassEnrollmentHandler(prisma);
    case "businessLicenseShard1":
      return createBusinessLicenseHandler(prisma);
    case "stateReviewShard1":
    case "countyReviewShard1":
    case "cityReviewShard1":
      return createReviewDataHandler(prisma);
    default:
      return null;
  }
}
