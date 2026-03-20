import { PrismaClient } from "../../generated/client";

/**
 * Core seeding interfaces for type safety
 */

export interface SeedingBatch {
  name: string;
  tables: SeedingTable[];
}

export interface SeedingTable {
  file: string;
  model: string;
  special?: boolean;
}

export interface SeedingResult {
  successCount: number;
  errorCount: number;
  errors: string[];
}

export interface UpsertConfig<T = any> {
  where: (item: T) => any;
  create: (item: T) => T;
  update: (item: T) => T;
}

export interface DuplicateCheckFunction<T = any> {
  (item: T): Promise<any | null>;
}

export interface SpecialHandlerFunction<T = any> {
  (item: any, cleanedItem: T): Promise<T>;
}

/**
 * Model-specific interfaces for better type safety
 */

export interface FiscalDataItem {
  acfrReportId?: number;
  fiscalDataTypeId?: number;
  fundTypeId?: number;
  fiscalDataTypeName?: string;
  fundTypeName?: string;
  [key: string]: any;
}

export interface PensionDataItem {
  acfrReportId?: number;
  pensionPlanId?: number;
  [key: string]: any;
}

export interface EventDataItem {
  eventTypeId?: number;
  eventStatusId?: number;
  [key: string]: any;
}

export interface EmploymentDataItem {
  statusId?: number;
  employment_status?: string;
  status?: string;
  [key: string]: any;
}

export interface TeacherCredentialItem {
  statusId?: number;
  status?: string;
  credential_status?: string;
  [key: string]: any;
}

export interface ClassEnrollmentItem {
  statusId?: number;
  status?: string;
  completion_status?: string;
  [key: string]: any;
}

export interface BusinessLicenseItem {
  statusId?: number;
  status?: string;
  license_status?: string;
  [key: string]: any;
}

export interface ReviewDataItem {
  statusId?: number;
  status?: string;
  isVerified?: boolean;
  [key: string]: any;
}

export interface PersonOrgRelationshipItem {
  statusId?: number;
  [key: string]: any;
}

/**
 * Database model interfaces for type-safe access
 */

export interface PrismaModel {
  create: (args: { data: any }) => Promise<any>;
  createMany: (args: { data: any[]; skipDuplicates?: boolean }) => Promise<{ count: number }>;
  findFirst: (args: { where: any }) => Promise<any | null>;
  findMany: (args: { where?: any; select?: any; orderBy?: any }) => Promise<any[]>;
  update: (args: { where: any; data: any }) => Promise<any>;
  upsert: (args: { where: any; create: any; update: any }) => Promise<any>;
  deleteMany: (args: { where?: any }) => Promise<{ count: number }>;
  count: (args?: { where?: any }) => Promise<number>;
}

export interface TypedPrismaClient extends Omit<PrismaClient, 'locationShard1' | 'aCFRReport' | 'pensionPlan' | 'fiscalDataType' | 'fundType' | 'eventType' | 'pensionDataShard1' | 'statusType' | 'eventShard1' | 'personOrgRelationshipShard1' | 'employmentDataShard1' | 'teacherCredentialShard1' | 'classEnrollmentShard1' | 'businessLicenseShard1' | 'stateReviewShard1' | 'countyReviewShard1' | 'cityReviewShard1'> {
  locationShard1: PrismaModel;
  aCFRReport: PrismaModel;
  pensionPlan: PrismaModel;
  fiscalDataType: PrismaModel;
  fundType: PrismaModel;
  eventType: PrismaModel;
  pensionDataShard1: PrismaModel;
  statusType: PrismaModel;
  eventShard1: PrismaModel;
  personOrgRelationshipShard1: PrismaModel;
  employmentDataShard1: PrismaModel;
  teacherCredentialShard1: PrismaModel;
  classEnrollmentShard1: PrismaModel;
  businessLicenseShard1: PrismaModel;
  stateReviewShard1: PrismaModel;
  countyReviewShard1: PrismaModel;
  cityReviewShard1: PrismaModel;
}

/**
 * Utility types for better type inference
 */

export type ModelName = keyof PrismaClient;

export type SeedingDataMap = Map<string, any[]>;

export type SpecialHandlersMap = Map<string, SpecialHandlerFunction>;

/**
 * Error handling interfaces
 */

export interface SeedingError {
  message: string;
  model?: string;
  item?: any;
  originalError?: Error;
}

export interface BatchProcessingError extends SeedingError {
  batchName: string;
  tableName: string;
}

/**
 * Configuration interfaces
 */

export interface SeedingConfig {
  useTransactions: boolean;
  batchSize: number;
  skipDuplicates: boolean;
  debugMode: boolean;
  stopOnError: boolean;
}

export interface ModelFieldMapping {
  fieldMappings?: Record<string, string>;
  allowedFields: string[];
  requiredDefaults?: Record<string, any>;
}

export interface ModelConfig {
  [modelName: string]: ModelFieldMapping;
}

/**
 * Lookup interfaces for foreign key resolution
 */

export interface FiscalLookupMaps {
  fiscalDataTypeByName?: Record<string, number>;
  fundTypeByName?: Record<string, number>;
}

export interface EventLookupMaps {
  eventTypeIdMap?: Record<number, number>;
  eventStatusIdMap?: Record<number, number>;
}

/**
 * Validation interfaces
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DataValidationConfig {
  strictMode: boolean;
  allowPartialData: boolean;
  validateForeignKeys: boolean;
  validateRequiredFields: boolean;
}
