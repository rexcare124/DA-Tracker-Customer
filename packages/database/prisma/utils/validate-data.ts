import { convertObjectKeys } from "./convert-to-camel-case";
import { MODEL_FIELD_MAPPINGS } from "./model-field-mapping";

// Helper function to clean and validate data for a specific model
export function cleanAndValidateData(data: any, modelName: string): any {
  // Get the field mapping for this model
  const modelConfig = MODEL_FIELD_MAPPINGS[modelName];

  if (!modelConfig) {
    // If no mapping exists, convert snake_case to camelCase and return
    return convertObjectKeys(data);
  }

  const cleaned: any = {};

  // Apply field mappings first (before camelCase conversion)
  for (const [key, value] of Object.entries(data)) {
    const mappedKey = modelConfig.fieldMappings?.[key] || key;
    cleaned[mappedKey] = value;
  }

  // Then convert any remaining snake_case keys to camelCase
  const convertedData = convertObjectKeys(cleaned);

  // Filter to only allowed fields
  const allowedData: any = {};
  for (const field of modelConfig.allowedFields) {
    if (convertedData[field] !== undefined) {
      allowedData[field] = convertedData[field];
    }
  }

  // Handle special relationship connections for specific models
  // Note: For createMany operations, we use direct field values, not relation syntax
  if (
    modelName === "statute" &&
    (data.state_id !== undefined || convertedData.stateId !== undefined)
  ) {
    const stateId = data.state_id || convertedData.stateId;
    if (stateId) {
      // For createMany, use direct field value instead of relation syntax
      allowedData.stateId = stateId;
      // Remove id from allowedData since we're using auto-generated IDs
      delete allowedData.id;
    }
  }

  // Handle special field conversions for specific models
  if (
    modelName === "crimeStatute" &&
    (data.statute_id !== undefined || convertedData.statuteId !== undefined)
  ) {
    const statuteId = data.statute_id || convertedData.statuteId;
    if (statuteId) {
      // Convert statute_id to statuteCode string
      allowedData.statuteCode = `PC ${statuteId}`;
    }
  }

  // Handle special field conversions for educationLevel model
  if (modelName === "educationLevel") {
    if (data.level_id !== undefined || convertedData.levelId !== undefined) {
      const levelId = data.level_id || convertedData.levelId;
      if (levelId) {
        allowedData.id = levelId;
      }
    }
  }

  // Handle special field conversions for educationDataShard1 model
  if (modelName === "educationDataShard1") {
    // Remove city_id field since it doesn't exist in the schema
    if (data.city_id !== undefined || convertedData.cityId !== undefined) {
      delete allowedData.cityId;
    }

    // Convert education_level string to educationLevelId integer
    if (data.education_level !== undefined || convertedData.educationLevel !== undefined) {
      const educationLevel = data.education_level || convertedData.educationLevel;
      if (educationLevel) {
        // Map education level strings to IDs (matching the actual seed data)
        const levelMap: Record<string, number> = {
          "High School": 3,
          "Bachelor's Degree": 5,
          "Master's Degree": 6,
          Doctorate: 7,
          "Associate's Degree": 4,
          "Elementary School": 1,
          "Middle School": 2,
        };
        allowedData.educationLevelId = levelMap[educationLevel] || 1;
        // Remove the original education_level field
        delete allowedData.educationLevel;
      }
    }
  }

  // Temporary handling for geographicReference hierarchy: seed without parentId
  // to avoid self-referencing FK violations from seed JSON that uses external IDs.
  if (modelName === "geographicReference") {
    if (allowedData.parentId !== undefined) {
      delete allowedData.parentId;
    }
  }

  // Add required defaults for missing fields
  if (modelConfig.requiredDefaults) {
    for (const [field, defaultValue] of Object.entries(modelConfig.requiredDefaults)) {
      if (allowedData[field] === undefined) {
        allowedData[field] = defaultValue;
      }
    }
  }

  // Handle special cases for primary keys
  if (modelName === "nonGovernmentalOrganizationShard1") {
    if (
      !allowedData.employerIdentificationNumber ||
      allowedData.employerIdentificationNumber === "Unknown"
    ) {
      allowedData.employerIdentificationNumber = `Unknown-NGO-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    }
  } else {
    // Preserve explicit ID fields from seed data for proper foreign key relationships
    // Map explicit ID fields to the correct Prisma field names based on model type
    const explicitIdFields: { [key: string]: any } = {};

    // Map model-specific ID fields to the generic 'id' field that Prisma uses
    if (
      modelName === "state" &&
      (data.state_id !== undefined || convertedData.stateId !== undefined)
    ) {
      explicitIdFields.id = data.state_id || convertedData.stateId;
    } else if (
      modelName === "county" &&
      (data.county_id !== undefined || convertedData.countyId !== undefined)
    ) {
      explicitIdFields.id = data.county_id || convertedData.countyId;
    } else if (
      modelName === "city" &&
      (data.city_id !== undefined || convertedData.cityId !== undefined)
    ) {
      explicitIdFields.id = data.city_id || convertedData.cityId;
    } else if (
      modelName === "zipCode" &&
      (data.zip_code_id !== undefined || convertedData.zipCodeId !== undefined)
    ) {
      explicitIdFields.id = data.zip_code_id || convertedData.zipCodeId;
    } else if (
      modelName === "tableRegistry" &&
      (data.table_registry_id !== undefined || convertedData.tableRegistryId !== undefined)
    ) {
      explicitIdFields.id = data.table_registry_id || convertedData.tableRegistryId;
    } else if (
      modelName === "classification" &&
      (data.classification_id !== undefined || convertedData.classificationId !== undefined)
    ) {
      explicitIdFields.id = data.classification_id || convertedData.classificationId;
    } else if (
      modelName === "statute" &&
      (data.statute_id !== undefined || convertedData.statuteId !== undefined)
    ) {
      // Skip adding explicit ID for statute model since we use relation syntax
      // explicitIdFields.id = data.statute_id || convertedData.statuteId;
    } else if (
      modelName === "crime" &&
      (data.crime_id !== undefined || convertedData.crimeId !== undefined)
    ) {
      explicitIdFields.id = data.crime_id || convertedData.crimeId;
    } else if (
      modelName === "element" &&
      (data.element_id !== undefined || convertedData.elementId !== undefined)
    ) {
      explicitIdFields.id = data.element_id || convertedData.elementId;
    } else if (
      modelName === "punishment" &&
      (data.punishment_id !== undefined || convertedData.punishmentId !== undefined)
    ) {
      explicitIdFields.id = data.punishment_id || convertedData.punishmentId;
    } else if (
      modelName === "educationLevel" &&
      (data.level_id !== undefined || convertedData.levelId !== undefined)
    ) {
      explicitIdFields.id = data.level_id || convertedData.levelId;
    } else if (
      modelName === "classShard1" &&
      (data.class_id !== undefined || convertedData.classId !== undefined)
    ) {
      explicitIdFields.id = data.class_id || convertedData.classId;
    } else if (data.id !== undefined || convertedData.id !== undefined) {
      // Generic id field
      explicitIdFields.id = data.id || convertedData.id;
    }

    // Preserve foreign key ID fields (these keep their camelCase names)
    if (data.state_id !== undefined || convertedData.stateId !== undefined) {
      const stateId = data.state_id || convertedData.stateId;
      if (modelName !== "state" && modelName !== "statute") {
        // Don't add stateId to state model itself or statute model (uses relation syntax)
        explicitIdFields.stateId = stateId;
      }
    }
    if (data.county_id !== undefined || convertedData.countyId !== undefined) {
      const countyId = data.county_id || convertedData.countyId;
      if (modelName !== "county") {
        // Don't add countyId to county model itself
        explicitIdFields.countyId = countyId;
      }
    }
    if (data.city_id !== undefined || convertedData.cityId !== undefined) {
      const cityId = data.city_id || convertedData.cityId;
      if (
        modelName !== "city" &&
        modelName !== "locationShard1" &&
        modelName !== "employmentDataShard1" &&
        modelName !== "housingStatusShard1" &&
        modelName !== "businessLicenseShard1" &&
        modelName !== "educationDataShard1"
      ) {
        explicitIdFields.cityId = cityId;
      }
    }

    // Add preserved explicit ID fields to allowedData
    Object.assign(allowedData, explicitIdFields);

    // Only remove the generic id field if no explicit ID exists and it's not in our preserved fields
    const hasExplicitId = Object.keys(explicitIdFields).length > 0;
    if (!hasExplicitId && allowedData.id !== undefined && !explicitIdFields.id) {
      delete allowedData.id;
    }
  }

  return allowedData;
}
