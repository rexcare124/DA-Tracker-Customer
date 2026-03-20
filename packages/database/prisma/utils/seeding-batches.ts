import { SeedingBatch } from "./types";

// Define seeding batches with proper dependency ordering
export const seedingBatches: SeedingBatch[] = [
  // Batch 1: Foundation tables (no dependencies)
  {
    name: "Foundation Tables",
    tables: [
      { file: "government_levels.json", model: "governmentLevel" },
      { file: "organization_types.json", model: "organizationType" },
      { file: "relationship_types.json", model: "relationshipType" },
      { file: "review_types.json", model: "reviewType" },
      { file: "location_types.json", model: "locationType" },
      { file: "license_type.json", model: "licenseType" },
      { file: "infraction_type.json", model: "infractionType" },
      { file: "teaching_credential.json", model: "teachingCredential" },
      { file: "event_types.json", model: "eventType" },
      // New lookup tables for database improvements
      { file: "status_types.json", model: "statusType" },
      { file: "priority_types.json", model: "priorityType" },
      { file: "geographic_references.json", model: "geographicReference" },
      { file: "system_configurations.json", model: "systemConfiguration" },
      { file: "data_classifications.json", model: "dataClassification" },
      { file: "validation_rules.json", model: "validationRule" },
    ],
  },
  // Batch 2: Geographic hierarchy
  {
    name: "Geographic Tables",
    tables: [
      { file: "states.json", model: "state" },
      { file: "counties.json", model: "county" },
      { file: "cities.json", model: "city" },
      { file: "zip_codes.json", model: "zipCode" },
      { file: "state_regions.json", model: "stateRegion" },
      { file: "table_registry.json", model: "tableRegistry" },
      { file: "table_shard_registry.json", model: "tableShardRegistry" },
      { file: "school_district.json", model: "schoolDistrict" },
      { file: "school.json", model: "school" },
    ],
  },
  // Batch 3: Core entities
  {
    name: "Core Entity Tables",
    tables: [
      { file: "persons.json", model: "person" },
      { file: "location_shard_1.json", model: "locationShard1" },
      { file: "government_entities.json", model: "governmentEntity" },
      { file: "business_entities.json", model: "business" },
      { file: "ngo_entities.json", model: "nonGovernmentalOrganizationShard1" },
    ],
  },
  // Batch 4: HOA foundation tables (depends on LocationShard1)
  {
    name: "HOA Foundation Tables",
    tables: [
      { file: "home_builder.json", model: "homeBuilder" },
      { file: "home_owner_association.json", model: "homeOwnerAssociation" },
      { file: "realtor.json", model: "realtor" },
    ],
  },
  // Batch 5: HOA management tables (depends on HomeOwnerAssociation)
  {
    name: "HOA Management Tables",
    tables: [
      { file: "hoa_board_members.json", model: "hOABoardMember" },
      { file: "hoa_financial_records.json", model: "hOAFinancialRecord" },
      { file: "hoa_fee_history.json", model: "hOAFeeHistory" },
      { file: "hoa_governing_documents.json", model: "hOAGoverningDocument" },
      { file: "hoa_amenities.json", model: "hOAAmenity" },
      { file: "hoa_legal_records.json", model: "hOALegalRecord" },
      { file: "hoa_assessments.json", model: "hOAAssessment" },
      { file: "hoa_meetings.json", model: "hOAMeeting" },
    ],
  },
  // Batch 5.5: HOA management company (depends on HomeOwnerAssociation and Business)
  {
    name: "HOA Management Company Tables",
    tables: [
      { file: "hoa_management_company.json", model: "hOAManagementCompany" },
    ],
  },
  // Batch 5.6: HOA invoices (depends on HomeOwnerAssociation, HOABoardMember, and HOAManagementCompany)
  {
    name: "HOA Invoice Tables",
    tables: [
      { file: "hoa_invoices.json", model: "hOAInvoice" },
    ],
  },
  // Batch 6: HOA subdivision (depends on HomeOwnerAssociation and HomeBuilder)
  {
    name: "HOA Subdivision Tables",
    tables: [
      { file: "subdivision.json", model: "subdivision" },
    ],
  },
  // Batch 7: Legal framework (depends on states for classification)
  {
    name: "Legal Framework Tables",
    tables: [
      { file: "classification.json", model: "classification" },
      { file: "statute.json", model: "statute" },
      { file: "crime.json", model: "crime" },
      { file: "element.json", model: "element" },
      { file: "punishment.json", model: "punishment" },
      { file: "crime_statute.json", model: "crimeStatute" },
      { file: "offense_element.json", model: "offenseElement" },
      { file: "punishment_crime.json", model: "punishmentCrime" },
    ],
  },
  // Batch 8: Relationship tables
  {
    name: "Relationship Tables",
    tables: [
      { file: "person_location_shard_1.json", model: "personLocationShard1" },
      { file: "organization_location_shard_1.json", model: "organizationLocationShard1" },
      { file: "person_org_relationship_shard_1.json", model: "personOrgRelationshipShard1" },
    ],
  },
  // Batch 9: Review and incident data
  {
    name: "Review and Incident Tables",
    tables: [
      { file: "state_review_shard_1.json", model: "stateReviewShard1" },
      { file: "county_review_shard_1.json", model: "countyReviewShard1" },
      { file: "city_review_shard_1.json", model: "cityReviewShard1" },
      { file: "state_review_subject_shard_1.json", model: "stateReviewSubjectShard1" },
      { file: "county_review_subject_shard_1.json", model: "countyReviewSubjectShard1" },
      { file: "city_review_subject_shard_1.json", model: "cityReviewSubjectShard1" },
      { file: "crime_report_incident_shard_1.json", model: "crimeReportIncidentShard1" },
    ],
  },
  // Batch 10: Employment and demographics
  {
    name: "Employment and Demographics Tables",
    tables: [
      { file: "employment_data_shard_1.json", model: "employmentDataShard1" },
      { file: "labor_force_statistics.json", model: "laborForceStatistics" },
      { file: "population_history.json", model: "populationHistory" },
      { file: "homeless_count_data.json", model: "homelessCountData" },
      { file: "housing_status_shard_1.json", model: "housingStatusShard1" },
    ],
  },
  // Batch 11: Business data
  {
    name: "Business Data Tables",
    tables: [
      { file: "business_license_shard_1.json", model: "businessLicenseShard1" },
      { file: "business_size_data.json", model: "businessSizeData" },
    ],
  },
  // Batch 12: Education infrastructure
  {
    name: "Education Infrastructure Tables",
    tables: [
      { file: "education_level.json", model: "educationLevel" },
      { file: "graduation_data.json", model: "graduationData" },
      { file: "education_data_shard_1.json", model: "educationDataShard1" },
    ],
  },
  // Batch 13: Student and class data
  {
    name: "Student and Class Tables",
    tables: [
      { file: "grade_progression_shard_1.json", model: "gradeProgressionShard1" },
      { file: "disciplinary_action_shard_1.json", model: "disciplinaryActionShard1" },
      { file: "teacher_credential_shard_1.json", model: "teacherCredentialShard1" },
      { file: "class_shard_1.json", model: "classShard1" },
      { file: "class_enrollment_shard_1.json", model: "classEnrollmentShard1" },
      { file: "student_shard_1.json", model: "studentShard1" },
      { file: "teacher_shard_1.json", model: "teacherShard1" },
      { file: "school_emergency_incident_shard_1.json", model: "schoolEmergencyIncidentShard1" },
      { file: "student_arrest_shard_1.json", model: "studentArrestShard1" },
    ],
  },
  // Batch 14: Event tracking system
  {
    name: "Event Tracking Tables",
    tables: [
      { file: "events_shard_1.json", model: "eventShard1" },
      { file: "person_events_shard_1.json", model: "personEventShard1" },
      { file: "business_events_shard_1.json", model: "businessEventShard1" },
      { file: "government_events_shard_1.json", model: "governmentEventShard1" },
      { file: "ngo_events_shard_1.json", model: "NGOEventShard1" },
    ],
  },
  // Batch 15: Fiscal analysis foundation tables
  {
    name: "Fiscal Analysis Foundation Tables",
    tables: [
      { file: "fiscal_data_types.json", model: "fiscalDataType" },
      { file: "fund_types.json", model: "fundType" },
    ],
  },
  // Batch 16: Fiscal analysis core tables (ACFR reports and pension plans)
  {
    name: "Fiscal Analysis Core Tables",
    tables: [
      { file: "acfr_reports.json", model: "ACFRReport" },
      { file: "pension_plans.json", model: "pensionPlan" },
    ],
  },
  // Batch 17: Fiscal analysis dependent data tables
  {
    name: "Fiscal Analysis Dependent Data Tables",
    tables: [
      { file: "fiscal_data_shard_1.json", model: "fiscalDataShard1" },
      { file: "pension_data_shard_1.json", model: "pensionDataShard1" },
      { file: "opeb_data_shard_1.json", model: "OPEBDataShard1" },
      { file: "fiscal_health_scores.json", model: "fiscalHealthScore" },
    ],
  },
];
