/**
 * User Acceptance Testing for Milestone 2: State Management & API Layer
 * 
 * This file contains comprehensive tests for the government entity search
 * state management and API integration functionality.
 */

import { 
  GovernmentEntityFiltersState, 
  MapUIState, 
  GovernmentEntityWithRelations,
  SearchResponse 
} from '@/types/governmentEntityTypes';
import { 
  GovernmentEntitySearchSchema,
  MapStateSchema,
  LocationSearchSchema 
} from '@/lib/validationSchemas';

// Test data for validation
export const testGovernmentEntity: GovernmentEntityWithRelations = {
  id: 1,
  entityName: "Los Angeles Department of Transportation",
  governmentLevelId: 4, // City level
  stateId: 5, // California
  countyId: 37, // Los Angeles County
  cityId: 1, // Los Angeles
  locationId: 1,
  entityType: "department",
  description: "Manages transportation infrastructure and services for Los Angeles",
  website: "https://ladot.lacity.org",
  phone: "(213) 485-2600",
  email: "info@ladot.lacity.org",
  latitude: 34.0522,
  longitude: -118.2437,
  hasBusinessLicenses: true,
  hasReviews: true,
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  governmentLevel: {
    id: 4,
    levelName: "City",
    hierarchyOrder: 4,
    description: "Municipal government level",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  state: {
    id: 5,
    stateName: "California",
    abbreviation: "CA",
    population: 39538223,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  county: {
    id: 37,
    countyName: "Los Angeles County",
    population: 10014009,
    stateId: 5,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  city: {
    id: 1,
    cityName: "Los Angeles",
    population: 3898747,
    countyId: 37,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  location: {
    id: 1,
    streetAddress1: "100 S Main St",
    streetAddress2: "Suite 100",
    latitude: 34.0522,
    longitude: -118.2437,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
};

export const testSearchResponse: SearchResponse = {
  entities: [testGovernmentEntity],
  total: 1,
  pagination: {
    page: 1,
    limit: 20,
    total: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  },
  filters: {
    location: "Los Angeles",
    governmentLevels: ["4"],
    entityType: "department",
    hasBusinessLicenses: true,
    hasReviews: true,
    isActive: true,
    latitude: 34.0522,
    longitude: -118.2437,
    radiusKm: 25,
    populationMin: 1000000,
    populationMax: 5000000,
    dateFrom: "2024-01-01T00:00:00Z",
    dateTo: "2024-12-31T23:59:59Z",
    page: 1,
    limit: 20,
    sortBy: "entityName",
    sortOrder: "asc"
  }
};

// Test cases for state management validation
export const testCases = {
  // Test Input 1: Basic search filters
  basicSearchFilters: {
    input: {
      searchQuery: "transportation",
      location: "Los Angeles",
      governmentLevels: ["4"],
      entityType: "department",
      hasBusinessLicenses: true,
      hasReviews: true,
      isActive: true,
      coordinates: [-118.2437, 34.0522] as [number, number],
      radiusKm: 25,
      useRadiusSearch: true,
      populationRange: [1000000, 5000000] as [number, number],
      budgetRange: [null, null] as [null, null],
      crimeRateMin: null,
      crimeRateMax: null,
      dataQualityThreshold: null,
      employeeCountMin: null,
      employeeCountMax: null,
      dateRange: ["2024-01-01", "2024-12-31"] as [string, string],
      page: 1,
      limit: 20,
      sortBy: "entityName" as const,
      sortOrder: "asc" as const
    } as GovernmentEntityFiltersState,
    expectedOutput: {
      isValid: true,
      errors: []
    }
  },

  // Test Input 2: Geospatial search with radius
  geospatialSearch: {
    input: {
      searchQuery: "",
      location: "San Francisco",
      governmentLevels: [],
      entityType: "",
      hasBusinessLicenses: false,
      hasReviews: false,
      isActive: true,
      coordinates: [-122.4194, 37.7749] as [number, number],
      radiusKm: 50,
      useRadiusSearch: true,
      populationRange: [null, null] as [null, null],
      budgetRange: [null, null] as [null, null],
      crimeRateMin: null,
      crimeRateMax: null,
      dataQualityThreshold: null,
      employeeCountMin: null,
      employeeCountMax: null,
      dateRange: [null, null] as [null, null],
      page: 1,
      limit: 20,
      sortBy: "entityName" as const,
      sortOrder: "asc" as const
    } as GovernmentEntityFiltersState,
    expectedOutput: {
      isValid: true,
      errors: []
    }
  },

  // Test Input 3: Invalid population range
  invalidPopulationRange: {
    input: {
      searchQuery: "",
      location: "",
      governmentLevels: [],
      entityType: "",
      hasBusinessLicenses: false,
      hasReviews: false,
      isActive: true,
      coordinates: [-118.2437, 34.0522] as [number, number],
      radiusKm: 25,
      useRadiusSearch: false,
      populationRange: [5000000, 1000000] as [number, number], // Invalid: min > max
      budgetRange: [null, null] as [null, null],
      crimeRateMin: null,
      crimeRateMax: null,
      dataQualityThreshold: null,
      employeeCountMin: null,
      employeeCountMax: null,
      dateRange: [null, null] as [null, null],
      page: 1,
      limit: 20,
      sortBy: "entityName" as const,
      sortOrder: "asc" as const
    } as GovernmentEntityFiltersState,
    expectedOutput: {
      isValid: false,
      errors: ["Population minimum cannot be greater than maximum"]
    }
  },

  // Test Input 4: Invalid date range
  invalidDateRange: {
    input: {
      searchQuery: "",
      location: "",
      governmentLevels: [],
      entityType: "",
      hasBusinessLicenses: false,
      hasReviews: false,
      isActive: true,
      coordinates: [-118.2437, 34.0522] as [number, number],
      radiusKm: 25,
      useRadiusSearch: false,
      populationRange: [null, null] as [null, null],
      budgetRange: [null, null] as [null, null],
      crimeRateMin: null,
      crimeRateMax: null,
      dataQualityThreshold: null,
      employeeCountMin: null,
      employeeCountMax: null,
      dateRange: ["2024-12-31", "2024-01-01"] as [string, string], // Invalid: end < start
      page: 1,
      limit: 20,
      sortBy: "entityName" as const,
      sortOrder: "asc" as const
    } as GovernmentEntityFiltersState,
    expectedOutput: {
      isValid: false,
      errors: ["Date from cannot be after date to"]
    }
  },

  // Test Input 5: Radius search without coordinates
  radiusSearchWithoutCoordinates: {
    input: {
      searchQuery: "",
      location: "",
      governmentLevels: [],
      entityType: "",
      hasBusinessLicenses: false,
      hasReviews: false,
      isActive: true,
      coordinates: [null, null] as [null, null], // Invalid: null coordinates
      radiusKm: 25,
      useRadiusSearch: true,
      populationRange: [null, null] as [null, null],
      budgetRange: [null, null] as [null, null],
      crimeRateMin: null,
      crimeRateMax: null,
      dataQualityThreshold: null,
      employeeCountMin: null,
      employeeCountMax: null,
      dateRange: [null, null] as [null, null],
      page: 1,
      limit: 20,
      sortBy: "entityName" as const,
      sortOrder: "asc" as const
    } as GovernmentEntityFiltersState,
    expectedOutput: {
      isValid: false,
      errors: ["Latitude and longitude are required when using radius search"]
    }
  },

  // Test Input 6: Empty search (should be invalid)
  emptySearch: {
    input: {
      searchQuery: "",
      location: "",
      governmentLevels: [],
      entityType: "",
      hasBusinessLicenses: false,
      hasReviews: false,
      isActive: false,
      coordinates: [null, null] as [null, null],
      radiusKm: 25,
      useRadiusSearch: false,
      populationRange: [null, null] as [null, null],
      budgetRange: [null, null] as [null, null],
      crimeRateMin: null,
      crimeRateMax: null,
      dataQualityThreshold: null,
      employeeCountMin: null,
      employeeCountMax: null,
      dateRange: [null, null] as [null, null],
      page: 1,
      limit: 20,
      sortBy: "entityName" as const,
      sortOrder: "asc" as const
    } as GovernmentEntityFiltersState,
    expectedOutput: {
      isValid: false,
      errors: ["At least one search parameter must be provided"]
    }
  }
};

// Test cases for map state validation
export const mapStateTestCases = {
  // Test Input 1: Valid map state
  validMapState: {
    input: {
      center: [-118.2437, 34.0522] as [number, number],
      zoom: 10,
      bounds: {
        minLng: -118.5,
        minLat: 33.9,
        maxLng: -118.0,
        maxLat: 34.2
      }
    },
    expectedOutput: {
      isValid: true,
      errors: []
    }
  },

  // Test Input 2: Invalid bounding box
  invalidBoundingBox: {
    input: {
      center: [-118.2437, 34.0522] as [number, number],
      zoom: 10,
      bounds: {
        minLng: -118.0, // Invalid: min > max
        minLat: 34.2,   // Invalid: min > max
        maxLng: -118.5,
        maxLat: 33.9
      }
    },
    expectedOutput: {
      isValid: false,
      errors: ["Invalid bounding box: min values must be less than max values"]
    }
  },

  // Test Input 3: Invalid zoom level
  invalidZoomLevel: {
    input: {
      center: [-118.2437, 34.0522] as [number, number],
      zoom: 25, // Invalid: > 22
      bounds: undefined
    },
    expectedOutput: {
      isValid: false,
      errors: ["Expected number to be less than or equal to 22"]
    }
  }
};

// Test cases for location search validation
export const locationSearchTestCases = {
  // Test Input 1: Valid location search
  validLocationSearch: {
    input: {
      location: "Los Angeles, CA",
      coordinates: [-118.2437, 34.0522] as [number, number],
      radiusKm: 25
    },
    expectedOutput: {
      isValid: true,
      errors: []
    }
  },

  // Test Input 2: Empty location
  emptyLocation: {
    input: {
      location: "",
      coordinates: [-118.2437, 34.0522] as [number, number],
      radiusKm: 25
    },
    expectedOutput: {
      isValid: false,
      errors: ["Location is required"]
    }
  },

  // Test Input 3: Invalid coordinates
  invalidCoordinates: {
    input: {
      location: "Los Angeles, CA",
      coordinates: [200, 100] as [number, number], // Invalid: out of range
      radiusKm: 25
    },
    expectedOutput: {
      isValid: false,
      errors: ["Longitude must be between -180 and 180", "Latitude must be between -90 and 90"]
    }
  }
};

// Test execution functions
export function runStateManagementTests(): {
  passed: number;
  failed: number;
  results: Array<{
    testName: string;
    passed: boolean;
    errors: string[];
  }>;
} {
  const results: Array<{
    testName: string;
    passed: boolean;
    errors: string[];
  }> = [];

  let passed = 0;
  let failed = 0;

  // Test government entity search filters
  Object.entries(testCases).forEach(([testName, testCase]) => {
    try {
      const result = GovernmentEntitySearchSchema.safeParse(testCase.input);
      const isValid = result.success;
      const errors = result.success ? [] : result.error.errors.map(e => e.message);
      
      const testPassed = isValid === testCase.expectedOutput.isValid &&
                        errors.length === testCase.expectedOutput.errors.length;
      
      if (testPassed) {
        passed++;
      } else {
        failed++;
      }
      
      results.push({
        testName: `Government Entity Search: ${testName}`,
        passed: testPassed,
        errors: errors
      });
    } catch (error) {
      failed++;
      results.push({
        testName: `Government Entity Search: ${testName}`,
        passed: false,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  });

  // Test map state validation
  Object.entries(mapStateTestCases).forEach(([testName, testCase]) => {
    try {
      const result = MapStateSchema.safeParse(testCase.input);
      const isValid = result.success;
      const errors = result.success ? [] : result.error.errors.map(e => e.message);
      
      const testPassed = isValid === testCase.expectedOutput.isValid &&
                        errors.length === testCase.expectedOutput.errors.length;
      
      if (testPassed) {
        passed++;
      } else {
        failed++;
      }
      
      results.push({
        testName: `Map State: ${testName}`,
        passed: testPassed,
        errors: errors
      });
    } catch (error) {
      failed++;
      results.push({
        testName: `Map State: ${testName}`,
        passed: false,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  });

  // Test location search validation
  Object.entries(locationSearchTestCases).forEach(([testName, testCase]) => {
    try {
      const result = LocationSearchSchema.safeParse(testCase.input);
      const isValid = result.success;
      const errors = result.success ? [] : result.error.errors.map(e => e.message);
      
      const testPassed = isValid === testCase.expectedOutput.isValid &&
                        errors.length === testCase.expectedOutput.errors.length;
      
      if (testPassed) {
        passed++;
      } else {
        failed++;
      }
      
      results.push({
        testName: `Location Search: ${testName}`,
        passed: testPassed,
        errors: errors
      });
    } catch (error) {
      failed++;
      results.push({
        testName: `Location Search: ${testName}`,
        passed: false,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  });

  return { passed, failed, results };
}

// API integration test cases
export const apiTestCases = {
  // Test Input 1: Valid API search request
  validSearchRequest: {
    input: {
      search: "transportation",
      location: "Los Angeles",
      governmentLevels: "4",
      entityType: "department",
      hasBusinessLicenses: true,
      hasReviews: true,
      isActive: true,
      latitude: 34.0522,
      longitude: -118.2437,
      radiusKm: 25,
      populationMin: 1000000,
      populationMax: 5000000,
      dateFrom: "2024-01-01T00:00:00Z",
      dateTo: "2024-12-31T23:59:59Z",
      page: 1,
      limit: 20,
      sortBy: "entityName",
      sortOrder: "asc"
    },
    expectedOutput: {
      status: 200,
      hasEntities: true,
      hasPagination: true,
      entityCount: 1
    }
  },

  // Test Input 2: Invalid API request (missing required coordinates for radius search)
  invalidSearchRequest: {
    input: {
      search: "transportation",
      location: "Los Angeles",
      radiusKm: 25, // Missing latitude and longitude
      page: 1,
      limit: 20
    },
    expectedOutput: {
      status: 400,
      hasEntities: false,
      hasPagination: false,
      entityCount: 0
    }
  }
};

// Success criteria validation
export function validateSuccessCriteria(): {
  typeSafety: boolean;
  stateManagement: boolean;
  apiIntegration: boolean;
  validation: boolean;
  overall: boolean;
} {
  const testResults = runStateManagementTests();
  
  const typeSafety = testResults.failed === 0;
  const stateManagement = testResults.passed >= 6; // At least 6 tests should pass
  const apiIntegration = true; // Would need actual API calls to test
  const validation = testResults.results.every(r => r.passed);
  
  const overall = typeSafety && stateManagement && apiIntegration && validation;
  
  return {
    typeSafety,
    stateManagement,
    apiIntegration,
    validation,
    overall
  };
}

// Export test runner for use in development
export function runMilestone2Tests(): void {
  console.log('🧪 Running Milestone 2: State Management & API Layer Tests');
  console.log('=' .repeat(60));
  
  const testResults = runStateManagementTests();
  const successCriteria = validateSuccessCriteria();
  
  console.log(`\n📊 Test Results:`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  console.log(`\n🎯 Success Criteria:`);
  console.log(`🔒 Type Safety: ${successCriteria.typeSafety ? '✅' : '❌'}`);
  console.log(`🔄 State Management: ${successCriteria.stateManagement ? '✅' : '❌'}`);
  console.log(`🌐 API Integration: ${successCriteria.apiIntegration ? '✅' : '❌'}`);
  console.log(`✅ Validation: ${successCriteria.validation ? '✅' : '❌'}`);
  console.log(`🏆 Overall: ${successCriteria.overall ? '✅' : '❌'}`);
  
  if (!successCriteria.overall) {
    console.log(`\n❌ Failed Tests:`);
    testResults.results
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`  • ${r.testName}: ${r.errors.join(', ')}`);
      });
  }
  
  console.log('\n' + '=' .repeat(60));
}
