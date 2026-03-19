import * as z from "zod";

// Utility function for sanitizing strings
const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

// Base string schema with sanitization
const SafeStringSchema = z.string().transform(sanitizeString);

// Helper function to create safe string schemas with validation
const createSafeStringSchema = (minLength?: number, maxLength?: number) => {
  let schema = z.string();
  if (minLength !== undefined) schema = schema.min(minLength);
  if (maxLength !== undefined) schema = schema.max(maxLength);
  return schema.transform(sanitizeString);
};

// Settings Schema (existing)
export const settingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

// Government Entity Schemas
export const governmentLevelSchema = z.object({
  id: z.number().int().positive(),
  levelName: createSafeStringSchema(1, 100),
  hierarchyOrder: z.number().int().min(1).max(10),
  description: createSafeStringSchema(undefined, 500).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const stateSchema = z.object({
  id: z.number().int().positive(),
  stateName: createSafeStringSchema(1, 100),
  abbreviation: z.string().length(2).transform(sanitizeString),
  population: z.number().int().min(0).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const countySchema = z.object({
  id: z.number().int().positive(),
  countyName: createSafeStringSchema(1, 100),
  population: z.number().int().min(0).optional(),
  stateId: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const citySchema = z.object({
  id: z.number().int().positive(),
  cityName: createSafeStringSchema(1, 100),
  population: z.number().int().min(0).optional(),
  countyId: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const locationSchema = z.object({
  id: z.number().int().positive(),
  streetAddress1: createSafeStringSchema(1, 200),
  streetAddress2: createSafeStringSchema(undefined, 200).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const governmentEntitySchema = z.object({
  id: z.number().int().positive(),
  entityName: createSafeStringSchema(1, 200),
  governmentLevelId: z.number().int().positive(),
  stateId: z.number().int().positive().optional(),
  countyId: z.number().int().positive().optional(),
  cityId: z.number().int().positive().optional(),
  locationId: z.number().int().positive().optional(),
  entityType: createSafeStringSchema(undefined, 50).optional(),
  description: createSafeStringSchema(undefined, 1000).optional(),
  website: z.string().url().optional().or(z.literal("")),
  phone: createSafeStringSchema(undefined, 20).optional(),
  email: z.string().email().optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  hasBusinessLicenses: z.boolean(),
  hasReviews: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  // Related entities
  governmentLevel: governmentLevelSchema.optional(),
  state: stateSchema.optional(),
  county: countySchema.optional(),
  city: citySchema.optional(),
  location: locationSchema.optional(),
});

export const governmentEntityWithRelationsSchema = governmentEntitySchema.extend({
  governmentLevel: governmentLevelSchema,
  state: stateSchema.optional(),
  county: countySchema.optional(),
  city: citySchema.optional(),
  location: locationSchema.optional(),
});

// Search and Filter Schemas
export const searchFiltersSchema = z.object({
  // Basic search
  searchQuery: createSafeStringSchema(undefined, 200).optional(),
  location: createSafeStringSchema(undefined, 200).optional(),
  
  // Government level filters
  governmentLevels: z.array(z.number().int().positive()).optional(),
  entityType: createSafeStringSchema(undefined, 50).optional(),
  
  // Boolean filters
  hasBusinessLicenses: z.boolean().optional(),
  hasReviews: z.boolean().optional(),
  isActive: z.boolean().optional(),
  
  // Geospatial filters
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  radiusKm: z.number().min(0.1).max(1000).optional(),
  useRadiusSearch: z.boolean().optional(),
  
  // Bounding box filters
  bounds: z.object({
    minLng: z.number().min(-180).max(180),
    minLat: z.number().min(-90).max(90),
    maxLng: z.number().min(-180).max(180),
    maxLat: z.number().min(-90).max(90),
  }).optional(),
  
  // Population filters
  populationMin: z.number().int().min(0).optional(),
  populationMax: z.number().int().min(0).optional(),
  
  // Date filters
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  
  // Pagination
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  
  // Sorting
  sortBy: z.enum(['entityName', 'createdAt', 'governmentLevelId']).default('entityName'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
}).refine(
  (data) => {
    // Validate population range
    if (data.populationMin !== undefined && data.populationMax !== undefined && 
        data.populationMin !== null && data.populationMax !== null) {
      return data.populationMin <= data.populationMax;
    }
    return true;
  },
  {
    message: "Minimum population must be less than or equal to maximum population",
    path: ["populationMax"],
  }
).refine(
  (data) => {
    // Validate date range
    if (data.dateFrom && data.dateTo && typeof data.dateFrom === 'string' && typeof data.dateTo === 'string') {
      return new Date(data.dateFrom) <= new Date(data.dateTo);
    }
    return true;
  },
  {
    message: "Start date must be before or equal to end date",
    path: ["dateTo"],
  }
);

export const searchResponseSchema = z.object({
  entities: z.array(governmentEntityWithRelationsSchema),
  pagination: z.object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    total: z.number().int().min(0),
    pages: z.number().int().min(0),
  }),
  filters: searchFiltersSchema,
});

export const governmentEntityStatsSchema = z.object({
  totalEntities: z.number().int().min(0),
  entitiesByLevel: z.array(z.object({
    governmentLevelId: z.number().int().positive(),
    _count: z.object({
      id: z.number().int().min(0),
    }),
    governmentLevel: governmentLevelSchema.optional(),
  })),
  entitiesByState: z.array(z.object({
    stateId: z.number().int().positive(),
    _count: z.object({
      id: z.number().int().min(0),
    }),
    state: stateSchema.optional(),
  })),
});

// Form validation schemas
export const searchFormSchema = z.object({
  searchQuery: createSafeStringSchema(undefined, 200).optional(),
  location: createSafeStringSchema(undefined, 200).optional(),
  governmentLevels: z.array(z.string()).optional(),
  entityType: createSafeStringSchema(undefined, 50).optional(),
  hasBusinessLicenses: z.boolean().optional(),
  hasReviews: z.boolean().optional(),
  populationMin: z.string().optional(),
  populationMax: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const mapStateSchema = z.object({
  center: z.tuple([z.number(), z.number()]), // [lng, lat]
  zoom: z.number().min(0).max(22),
  bounds: z.object({
    minLng: z.number().min(-180).max(180),
    minLat: z.number().min(-90).max(90),
    maxLng: z.number().min(-180).max(180),
    maxLat: z.number().min(-90).max(90),
  }).optional(),
});

// Type exports
export type GovernmentLevel = z.infer<typeof governmentLevelSchema>;
export type State = z.infer<typeof stateSchema>;
export type County = z.infer<typeof countySchema>;
export type City = z.infer<typeof citySchema>;
export type Location = z.infer<typeof locationSchema>;
export type GovernmentEntity = z.infer<typeof governmentEntitySchema>;
export type GovernmentEntityWithRelations = z.infer<typeof governmentEntityWithRelationsSchema>;
export type SearchFilters = z.infer<typeof searchFiltersSchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;
export type GovernmentEntityStats = z.infer<typeof governmentEntityStatsSchema>;
export type SearchFormData = z.infer<typeof searchFormSchema>;
export type MapState = z.infer<typeof mapStateSchema>;
