import { z } from 'zod';

// Security constants for validation
const MAX_STRING_LENGTH = 1000;
const MAX_COORDINATE = 180;
const MIN_COORDINATE = -180;
const MAX_RADIUS_KM = 1000;
const MAX_POPULATION = 100000000;
const MAX_PAGE_SIZE = 100;

// Base validation schemas
export const CoordinateSchema = z.number()
  .min(MIN_COORDINATE, `Coordinate must be at least ${MIN_COORDINATE}`)
  .max(MAX_COORDINATE, `Coordinate must be at most ${MAX_COORDINATE}`);

export const LatitudeSchema = z.number()
  .min(-90, 'Latitude must be between -90 and 90')
  .max(90, 'Latitude must be between -90 and 90');

export const LongitudeSchema = z.number()
  .min(-180, 'Longitude must be between -180 and 180')
  .max(180, 'Longitude must be between -180 and 180');

export const RadiusSchema = z.number()
  .min(0, 'Radius must be positive')
  .max(MAX_RADIUS_KM, `Radius cannot exceed ${MAX_RADIUS_KM} km`);

export const PopulationSchema = z.number()
  .min(0, 'Population must be positive')
  .max(MAX_POPULATION, `Population cannot exceed ${MAX_POPULATION}`);

export const SafeStringSchema = z.string()
  .max(MAX_STRING_LENGTH, `String cannot exceed ${MAX_STRING_LENGTH} characters`)
  .transform(str => str.trim());

// Government entity search validation schema
export const GovernmentEntitySearchSchema = z.object({
  // Basic search parameters
  search: SafeStringSchema.optional(),
  location: SafeStringSchema.optional(),
  
  // Government level filters
  governmentLevels: z.union([
    z.array(z.number().int().positive()),
    z.number().int().positive().transform(n => [n])
  ]).optional(),
  entityType: z.string().max(50).optional(),
  hasBusinessLicenses: z.boolean().optional(),
  hasReviews: z.boolean().optional(),
  isActive: z.boolean().optional(),
  
  // Geospatial filters
  latitude: LatitudeSchema.optional(),
  longitude: LongitudeSchema.optional(),
  radiusKm: RadiusSchema.optional(),
  
  // Bounding box filters
  bounds: z.object({
    minLng: LongitudeSchema,
    minLat: LatitudeSchema,
    maxLng: LongitudeSchema,
    maxLat: LatitudeSchema
  }).refine(
    (bounds) => bounds.minLng < bounds.maxLng && bounds.minLat < bounds.maxLat,
    'Invalid bounding box: min values must be less than max values'
  ).optional(),
  
  // Population and date filters
  populationMin: PopulationSchema.optional(),
  populationMax: PopulationSchema.optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  
  // Pagination
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(MAX_PAGE_SIZE).default(20),
  
  // Sorting
  sortBy: z.enum(['entityName', 'createdAt', 'governmentLevelId']).default('entityName'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
}).refine(
  (data) => {
    if (data.populationMin && data.populationMax) {
      return data.populationMin <= data.populationMax;
    }
    return true;
  },
  'Population minimum cannot be greater than maximum'
).refine(
  (data) => {
    if (data.dateFrom && data.dateTo) {
      return new Date(data.dateFrom) <= new Date(data.dateTo);
    }
    return true;
  },
  'Date from cannot be after date to'
).refine(
  (data) => {
    // Validate geospatial search requirements
    if (data.radiusKm !== undefined) {
      return data.latitude !== undefined && data.longitude !== undefined;
    }
    return true;
  },
  'Latitude and longitude are required when using radius search'
).refine(
  (data) => {
    // Validate that at least one search parameter is provided
    const hasSearchParams = data.search || 
                           data.location || 
                           (data.governmentLevels && data.governmentLevels.length > 0) ||
                           data.entityType ||
                           data.hasBusinessLicenses !== undefined ||
                           data.hasReviews !== undefined ||
                           data.isActive !== undefined ||
                           (data.latitude !== undefined && data.longitude !== undefined) ||
                           (data.populationMin !== undefined || data.populationMax !== undefined) ||
                           data.dateFrom ||
                           data.dateTo;
    return hasSearchParams;
  },
  'At least one search parameter must be provided'
);

// Form validation schemas
export const SearchFormSchema = z.object({
  location: z.string().max(100).optional(),
  governmentLevels: z.array(z.string()).optional(),
  entityType: z.string().max(50).optional(),
  hasBusinessLicenses: z.boolean().optional(),
  hasReviews: z.boolean().optional(),
  populationMin: z.string().regex(/^\d*$/).optional(),
  populationMax: z.string().regex(/^\d*$/).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional()
});

// Coerce values that may arrive as boolean/number from URL or client so Zod sees strings
const coerceBoolParam = z.preprocess(
  (val) => (typeof val === 'boolean' ? (val ? 'true' : 'false') : val),
  z.enum(['true', 'false']).optional()
);
const coerceNumericParam = z.preprocess(
  (val) => (val != null && typeof val !== 'string' ? String(val) : val),
  z.string().regex(/^\d+\.?\d*$/).optional()
);

// URL parameter validation schema (for query strings)
export const URLSearchParamsSchema = z.object({
  searchQuery: z.string().optional(),
  location: z.string().optional(),
  governmentLevels: z.union([z.string(), z.array(z.string())]).optional(),
  entityType: z.string().optional(),
  hasBusinessLicenses: coerceBoolParam,
  hasReviews: coerceBoolParam,
  isActive: coerceBoolParam,
  latitude: z.string().regex(/^-?\d+\.?\d*$/).optional(),
  longitude: z.string().regex(/^-?\d+\.?\d*$/).optional(),
  radiusKm: coerceNumericParam,
  useRadiusSearch: coerceBoolParam,
  bounds: z.string().regex(/^-?\d+\.?\d*,-?\d+\.?\d*,-?\d+\.?\d*,-?\d+\.?\d*$/).optional(),
  populationMin: z.string().regex(/^\d+$/).optional(),
  populationMax: z.string().regex(/^\d+$/).optional(),
  // Accept YYYY-MM-DD (date input) or full ISO datetime; backend parses with new Date()
  dateFrom: z.string().min(1).max(50).optional(),
  dateTo: z.string().min(1).max(50).optional(),
  page: z.string().regex(/^\d+$/).default('1'),
  limit: z.string().regex(/^\d+$/).default('20'),
  sortBy: z.string().default('entityName'),
  sortOrder: z.string().default('asc')
});

// Additional validation schemas for existing API routes
export const otpVerificationSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, 'OTP must be 6 digits')
});

// Personal info schema for RBCA registration
export const personalInfoSchema = z.object({
  // RBCA PersonalInfo fields matching the existing interface
    prefix: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
    suffix: z.string().optional(),
  email: z.string().email().optional(),
  confirmEmail: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  username: z.string().optional(),
  defaultPrivacyLevel: z.string().optional(),
  stateOfResidence: z.string().optional(),
  cityOfResidence: z.string().optional(),
  zipCode: z.string().optional(),
  howDidYouHearAboutUs: z.string().optional(),
  forumUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
    referredByUsername: z.string().optional(),
    flyerPromoCode: z.string().optional(),
  otherHeardAboutText: z.string().optional(),
  agreementAccepted: z.boolean().optional()
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(['user', 'manager', 'admin']).optional(),
  personalInfo: personalInfoSchema.optional(),
  // Additional RBCA fields
  otherInterestText: z.string().optional(),
  otherInformationSourceText: z.string().optional(),
    agreementAccepted: z.boolean().optional(),
  isRegistrationComplete: z.boolean().optional(),
  signInMethod: z.string().optional(),
  // RBCA array fields
  dataInterests: z.array(z.string()).optional(),
  rankedMotivations: z.array(z.string()).optional(),
  rankedGovernments: z.array(z.string()).optional(),
  rankedInformationSources: z.array(z.string()).optional()
});

// Utility functions
export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, '');
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeString(value) as T[keyof T];
  } else {
      sanitized[key as keyof T] = value;
    }
  }
  return sanitized;
} 

// Map and UI validation schemas
export const MapStateSchema = z.object({
  center: z.tuple([LongitudeSchema, LatitudeSchema]), // [lng, lat]
  zoom: z.number().min(0).max(22),
  bounds: z.object({
    minLng: LongitudeSchema,
    minLat: LatitudeSchema,
    maxLng: LongitudeSchema,
    maxLat: LatitudeSchema
  }).refine(
    (bounds) => bounds.minLng < bounds.maxLng && bounds.minLat < bounds.maxLat,
    'Invalid bounding box: min values must be less than max values'
  ).optional()
});

export const LocationSearchSchema = z.object({
  location: z.string().min(1, 'Location is required').transform(str => str.trim()),
  coordinates: z.tuple([LongitudeSchema, LatitudeSchema]),
  radiusKm: RadiusSchema.optional()
});

export const EntitySelectionSchema = z.object({
  entityId: z.number().int().positive(),
  coordinates: z.tuple([LongitudeSchema, LatitudeSchema]).optional()
});

// Type exports
export type GovernmentEntitySearchParams = z.infer<typeof GovernmentEntitySearchSchema>;
export type SearchFormData = z.infer<typeof SearchFormSchema>;
export type URLSearchParams = z.infer<typeof URLSearchParamsSchema>;
export type OtpVerificationData = z.infer<typeof otpVerificationSchema>;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;
export type MapState = z.infer<typeof MapStateSchema>;
export type LocationSearchData = z.infer<typeof LocationSearchSchema>;
export type EntitySelectionData = z.infer<typeof EntitySelectionSchema>;