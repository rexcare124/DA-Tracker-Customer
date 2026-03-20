-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "api";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- CreateEnum
CREATE TYPE "api"."geographic_reference_type" AS ENUM ('state', 'county', 'city', 'zip');

-- CreateEnum
CREATE TYPE "api"."system_data_type" AS ENUM ('string', 'number', 'boolean', 'json');

-- CreateEnum
CREATE TYPE "api"."system_configuration_category" AS ENUM ('system', 'security', 'performance', 'ui');

-- CreateEnum
CREATE TYPE "api"."audit_operation" AS ENUM ('INSERT', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "api"."validation_rule_type" AS ENUM ('format', 'range', 'required', 'unique', 'foreign_key');

-- CreateEnum
CREATE TYPE "api"."fiscal_data_type_category" AS ENUM ('revenue', 'expenditure', 'asset', 'liability', 'fund_balance');

-- CreateEnum
CREATE TYPE "api"."fund_type_category" AS ENUM ('general', 'special', 'enterprise', 'internal_service', 'trust');

-- CreateEnum
CREATE TYPE "api"."acfr_report_type" AS ENUM ('audited', 'unaudited', 'draft');

-- CreateEnum
CREATE TYPE "api"."acfr_report_auditor_opinion" AS ENUM ('unqualified', 'qualified', 'adverse', 'disclaimer');

-- CreateEnum
CREATE TYPE "api"."pesion_plan_type" AS ENUM ('defined_benefit', 'defined_contribution', 'hybrid');

-- CreateEnum
CREATE TYPE "api"."event_type_category" AS ENUM ('legal', 'administrative', 'financial', 'operational');

-- CreateEnum
CREATE TYPE "api"."event_type_severity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "api"."person_event_shard_1_relationship_type" AS ENUM ('subject', 'witness', 'participant', 'affected');

-- CreateEnum
CREATE TYPE "api"."business_event_shard_1_relationship_type" AS ENUM ('subject', 'licensee', 'violator', 'beneficiary');

-- CreateEnum
CREATE TYPE "api"."government_event_shard_1_relationship_type" AS ENUM ('jurisdiction', 'investigator', 'regulator', 'responder');

-- CreateEnum
CREATE TYPE "api"."ngo_event_shard_1_relationship_type" AS ENUM ('subject', 'service_provider', 'advocate', 'beneficiary');

-- CreateEnum
CREATE TYPE "api"."residence_type" AS ENUM ('owned', 'rented', 'military_housing', 'other');

-- CreateEnum
CREATE TYPE "api"."time_at_residence" AS ENUM ('less_than_6_months', 'six_to_12_months', 'one_to_two_years', 'two_to_five_years', 'more_than_five_years');

-- CreateEnum
CREATE TYPE "api"."length_of_visit" AS ENUM ('less_than_one_day', 'one_to_three_days', 'four_to_seven_days', 'one_to_two_weeks', 'more_than_two_weeks');

-- CreateEnum
CREATE TYPE "api"."agency_level" AS ENUM ('federal', 'state', 'county', 'city', 'local');

-- CreateEnum
CREATE TYPE "api"."delivery_method" AS ENUM ('email', 'phone', 'in_person', 'mail', 'online');

-- CreateEnum
CREATE TYPE "api"."request_status" AS ENUM ('pending', 'completed', 'cancelled', 'in_progress');

-- CreateEnum
CREATE TYPE "api"."contact_method" AS ENUM ('phone', 'email', 'in_person', 'mail', 'other');

-- CreateTable
CREATE TABLE "api"."state" (
    "state_id" SERIAL NOT NULL,
    "state_name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "population" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "state_pkey" PRIMARY KEY ("state_id")
);

-- CreateTable
CREATE TABLE "api"."county" (
    "county_id" SERIAL NOT NULL,
    "county_name" TEXT NOT NULL,
    "population" INTEGER,
    "state_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "county_pkey" PRIMARY KEY ("county_id")
);

-- CreateTable
CREATE TABLE "api"."city" (
    "city_id" SERIAL NOT NULL,
    "city_name" TEXT NOT NULL,
    "population" INTEGER,
    "county_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "city_pkey" PRIMARY KEY ("city_id")
);

-- CreateTable
CREATE TABLE "api"."zip_code" (
    "zip_code_id" SERIAL NOT NULL,
    "zip_code" TEXT NOT NULL,
    "city_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zip_code_pkey" PRIMARY KEY ("zip_code_id")
);

-- CreateTable
CREATE TABLE "api"."location_shard_1" (
    "id" SERIAL NOT NULL,
    "street_address_1" TEXT NOT NULL,
    "street_address_2" TEXT,
    "location_type_id" INTEGER NOT NULL,
    "zip_code_id" INTEGER NOT NULL,
    "state_region_id" INTEGER NOT NULL,
    "coordinates" geometry(Point,4326),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "location_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."location_type" (
    "id" SERIAL NOT NULL,
    "location_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "location_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."person" (
    "id" SERIAL NOT NULL,
    "prefix" TEXT,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "suffix" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "gender" TEXT,
    "juvenile" BOOLEAN NOT NULL DEFAULT false,
    "deceased" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."government_entity" (
    "id" SERIAL NOT NULL,
    "entity_name" TEXT NOT NULL,
    "government_level_id" INTEGER NOT NULL,
    "state_id" INTEGER,
    "county_id" INTEGER,
    "city_id" INTEGER,
    "location_id" INTEGER,
    "entity_type" TEXT,
    "description" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "has_reviews" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "government_entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."business" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "chief_executive" INTEGER,
    "business_license_number" TEXT,
    "business_license_status" INTEGER,
    "business_license_expiration_date" TIMESTAMP(3),
    "business_type" INTEGER,
    "service_category" INTEGER,
    "employee_count_range" INTEGER,
    "annual_revenue_range" INTEGER,
    "minority_owned_business" BOOLEAN NOT NULL DEFAULT false,
    "women_owned_business" BOOLEAN NOT NULL DEFAULT false,
    "veteran_owned_business" BOOLEAN NOT NULL DEFAULT false,
    "website" TEXT,
    "location_id" INTEGER,
    "state_id" INTEGER,
    "county_id" INTEGER,
    "city_id" INTEGER,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."non_governmental_organization_shard_1" (
    "employer_identification_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "principal_officer" INTEGER,
    "ngo_type" TEXT,
    "guidestar_profile_page_url" TEXT,
    "location_id" INTEGER,
    "ngo_website_url" TEXT,
    "state_id" INTEGER,
    "county_id" INTEGER,
    "city_id" INTEGER,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "non_governmental_organization_shard_1_pkey" PRIMARY KEY ("employer_identification_number")
);

-- CreateTable
CREATE TABLE "api"."state_review_shard_1" (
    "id" SERIAL NOT NULL,
    "government_entity_id" INTEGER NOT NULL,
    "state_id" INTEGER NOT NULL,
    "review_type_id" INTEGER NOT NULL,
    "review_text" TEXT NOT NULL,
    "rating" INTEGER,
    "reviewer_name" TEXT,
    "reviewer_email" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "status_id" INTEGER NOT NULL,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "state_review_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."county_review_shard_1" (
    "id" SERIAL NOT NULL,
    "government_entity_id" INTEGER NOT NULL,
    "county_id" INTEGER NOT NULL,
    "review_type_id" INTEGER NOT NULL,
    "review_text" TEXT NOT NULL,
    "rating" INTEGER,
    "reviewer_name" TEXT,
    "reviewer_email" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "status_id" INTEGER NOT NULL,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "county_review_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."city_review_shard_1" (
    "id" SERIAL NOT NULL,
    "government_entity_id" INTEGER NOT NULL,
    "city_id" INTEGER NOT NULL,
    "review_type_id" INTEGER NOT NULL,
    "review_text" TEXT NOT NULL,
    "rating" INTEGER,
    "reviewer_name" TEXT,
    "reviewer_email" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "status_id" INTEGER NOT NULL,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "city_review_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."table_registry" (
    "id" SERIAL NOT NULL,
    "table_name" TEXT NOT NULL,
    "shard_key_column" TEXT NOT NULL,
    "max_records_per_shard" INTEGER,
    "current_active_shards" INTEGER NOT NULL DEFAULT 1,
    "auto_scaling_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "table_registry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."table_shard_registry" (
    "id" SERIAL NOT NULL,
    "table_registry_id" INTEGER NOT NULL,
    "shard_number" INTEGER NOT NULL,
    "state_region_id" INTEGER NOT NULL,
    "current_record_count" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "database_server" TEXT,
    "last_maintenance" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "table_shard_registry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."state_region" (
    "id" SERIAL NOT NULL,
    "region_name" TEXT NOT NULL,
    "region_code" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "state_region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."government_level" (
    "id" SERIAL NOT NULL,
    "level_name" TEXT NOT NULL,
    "hierarchy_order" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "government_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."organization_type" (
    "id" SERIAL NOT NULL,
    "type_name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."relationship_type" (
    "id" SERIAL NOT NULL,
    "relationship_name" TEXT NOT NULL,
    "description" TEXT,
    "is_employment" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "relationship_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."review_type" (
    "id" SERIAL NOT NULL,
    "type_name" TEXT NOT NULL,
    "description" TEXT,
    "requires_response" BOOLEAN NOT NULL DEFAULT false,
    "priority_level" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."statute" (
    "statute_id" SERIAL NOT NULL,
    "statute_number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL,
    "repealed_date" TIMESTAMP(3),
    "state_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statute_pkey" PRIMARY KEY ("statute_id")
);

-- CreateTable
CREATE TABLE "api"."punishment" (
    "punishment_id" SERIAL NOT NULL,
    "punishment_type" TEXT NOT NULL,
    "min_penalty" TEXT,
    "max_penalty" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "punishment_pkey" PRIMARY KEY ("punishment_id")
);

-- CreateTable
CREATE TABLE "api"."punishment_crime" (
    "punishment_crime_id" SERIAL NOT NULL,
    "punishment_id" INTEGER NOT NULL,
    "crime_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "punishment_crime_pkey" PRIMARY KEY ("punishment_crime_id")
);

-- CreateTable
CREATE TABLE "api"."crime" (
    "crime_id" SERIAL NOT NULL,
    "crime_name" TEXT NOT NULL,
    "description" TEXT,
    "classification_id" INTEGER NOT NULL,
    "severity_level" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crime_pkey" PRIMARY KEY ("crime_id")
);

-- CreateTable
CREATE TABLE "api"."classification" (
    "classification_id" SERIAL NOT NULL,
    "classification_name" TEXT NOT NULL,
    "classification_type" TEXT,
    "description" TEXT,
    "state_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classification_pkey" PRIMARY KEY ("classification_id")
);

-- CreateTable
CREATE TABLE "api"."crime_statute" (
    "id" SERIAL NOT NULL,
    "crime_id" INTEGER NOT NULL,
    "statute_code" TEXT NOT NULL,
    "description" TEXT,
    "penalty" TEXT,
    "state_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crime_statute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."crime_report_incident_shard_1" (
    "id" SERIAL NOT NULL,
    "crime_id" INTEGER NOT NULL,
    "incident_date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "reported_by" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crime_report_incident_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."population_history" (
    "history_id" SERIAL NOT NULL,
    "city_id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "population_count" INTEGER NOT NULL,

    CONSTRAINT "population_history_pkey" PRIMARY KEY ("history_id")
);

-- CreateTable
CREATE TABLE "api"."education_level" (
    "level_id" SERIAL NOT NULL,
    "level_name" TEXT NOT NULL,
    "level_category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "education_level_pkey" PRIMARY KEY ("level_id")
);

-- CreateTable
CREATE TABLE "api"."education_data_shard_1" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "education_level_id" INTEGER NOT NULL,
    "institution_name" TEXT,
    "graduation_date" TIMESTAMP(3),
    "gpa" DOUBLE PRECISION,
    "major" TEXT,
    "degree" TEXT,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "education_data_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."class_shard_1" (
    "id" SERIAL NOT NULL,
    "class_name" TEXT NOT NULL,
    "subject" TEXT,
    "education_level_id" INTEGER NOT NULL,
    "teacher_id" INTEGER,
    "capacity" INTEGER,
    "schedule" TEXT,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."class_enrollment_shard_1" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "enrollment_date" TIMESTAMP(3) NOT NULL,
    "grade" TEXT,
    "status_id" INTEGER NOT NULL,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_enrollment_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."teacher_credential_shard_1" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "credential_type" TEXT NOT NULL,
    "subject" TEXT,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "expiration_date" TIMESTAMP(3),
    "issuing_authority" TEXT,
    "status_id" INTEGER NOT NULL,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_credential_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."grade_progression_shard_1" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "from_grade" TEXT NOT NULL,
    "to_grade" TEXT NOT NULL,
    "school_year" TEXT NOT NULL,
    "promoted" BOOLEAN NOT NULL DEFAULT true,
    "reason" TEXT,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grade_progression_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."disciplinary_action_shard_1" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "action_type" TEXT NOT NULL,
    "reason" TEXT,
    "action_date" TIMESTAMP(3) NOT NULL,
    "duration" TEXT,
    "description" TEXT,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disciplinary_action_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."employment_data_shard_1" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "employer_id" INTEGER,
    "job_title" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "salary" DOUBLE PRECISION,
    "employment_type" TEXT,
    "status_id" INTEGER NOT NULL,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employment_data_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."business_license_shard_1" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "license_number" TEXT NOT NULL,
    "license_type" TEXT NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "expiration_date" TIMESTAMP(3),
    "status_id" INTEGER NOT NULL,
    "issuing_authority" TEXT,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_license_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."housing_status_shard_1" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "housing_type" TEXT NOT NULL,
    "ownership_status" TEXT,
    "monthly_rent" DOUBLE PRECISION,
    "monthly_mortgage" DOUBLE PRECISION,
    "move_in_date" TIMESTAMP(3),
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "housing_status_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."person_location_shard_1" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "location_id" INTEGER NOT NULL,
    "relationship_type" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "person_location_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."organization_location_shard_1" (
    "id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "location_id" INTEGER NOT NULL,
    "relationship_type" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_location_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."person_org_relationship_shard_1" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "relationship_type_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "title" TEXT,
    "salary" DOUBLE PRECISION,
    "status_id" INTEGER NOT NULL,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "person_org_relationship_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."infraction_type" (
    "id" SERIAL NOT NULL,
    "type_name" TEXT NOT NULL,
    "description" TEXT,
    "severity" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "infraction_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."license_type" (
    "id" SERIAL NOT NULL,
    "type_name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "license_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."element" (
    "id" SERIAL NOT NULL,
    "element_name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "element_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."offense_element" (
    "id" SERIAL NOT NULL,
    "crime_id" INTEGER NOT NULL,
    "element_id" INTEGER NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offense_element_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."labor_force_statistics" (
    "id" SERIAL NOT NULL,
    "state_id" INTEGER,
    "county_id" INTEGER,
    "city_id" INTEGER,
    "year" INTEGER NOT NULL,
    "month" INTEGER,
    "labor_force" INTEGER,
    "employed" INTEGER,
    "unemployed" INTEGER,
    "unemployment_rate" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "labor_force_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."homeless_count_data" (
    "id" SERIAL NOT NULL,
    "state_id" INTEGER,
    "county_id" INTEGER,
    "city_id" INTEGER,
    "year" INTEGER NOT NULL,
    "total_count" INTEGER NOT NULL,
    "sheltered_count" INTEGER,
    "unsheltered_count" INTEGER,
    "families_count" INTEGER,
    "individuals_count" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homeless_count_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."graduation_data" (
    "id" SERIAL NOT NULL,
    "state_id" INTEGER,
    "county_id" INTEGER,
    "city_id" INTEGER,
    "school_year" TEXT NOT NULL,
    "graduation_rate" DOUBLE PRECISION,
    "total_students" INTEGER,
    "graduated_students" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "graduation_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."business_size_data" (
    "id" SERIAL NOT NULL,
    "state_id" INTEGER,
    "county_id" INTEGER,
    "city_id" INTEGER,
    "year" INTEGER NOT NULL,
    "size_category" TEXT NOT NULL,
    "business_count" INTEGER NOT NULL,
    "employee_count" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_size_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."state_review_subject_shard_1" (
    "id" SERIAL NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "review_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "state_review_subject_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."county_review_subject_shard_1" (
    "id" SERIAL NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "review_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "county_review_subject_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."city_review_subject_shard_1" (
    "id" SERIAL NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "review_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "city_review_subject_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."teaching_credential" (
    "id" SERIAL NOT NULL,
    "credential_name" TEXT NOT NULL,
    "credential_type" TEXT NOT NULL,
    "issuing_authority" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teaching_credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."school_district" (
    "id" SERIAL NOT NULL,
    "district_id" INTEGER NOT NULL,
    "district_name" TEXT NOT NULL,
    "city_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_district_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."school" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER NOT NULL,
    "school_name" TEXT NOT NULL,
    "district_id" INTEGER NOT NULL,
    "school_type" TEXT NOT NULL,
    "city_id" INTEGER NOT NULL,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."student_shard_1" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "person_id" INTEGER NOT NULL,
    "school_id" INTEGER NOT NULL,
    "current_grade_level" TEXT NOT NULL,
    "enrollment_date" TIMESTAMP(3) NOT NULL,
    "graduation_date" TIMESTAMP(3),
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."school_emergency_incident_shard_1" (
    "id" SERIAL NOT NULL,
    "incident_id" INTEGER NOT NULL,
    "school_id" INTEGER NOT NULL,
    "incident_date" TIMESTAMP(3) NOT NULL,
    "incident_type" TEXT NOT NULL,
    "response_time_minutes" INTEGER NOT NULL,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_emergency_incident_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."student_arrest_shard_1" (
    "id" SERIAL NOT NULL,
    "arrest_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "person_id" INTEGER NOT NULL,
    "crime_id" INTEGER NOT NULL,
    "statute_id" INTEGER NOT NULL,
    "classification_id" INTEGER NOT NULL,
    "arrest_date" TIMESTAMP(3) NOT NULL,
    "grade_level" TEXT NOT NULL,
    "school_id" INTEGER NOT NULL,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_arrest_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."teacher_shard_1" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "person_id" INTEGER NOT NULL,
    "school_id" INTEGER NOT NULL,
    "hire_date" TIMESTAMP(3) NOT NULL,
    "years_experience" INTEGER NOT NULL,
    "employment_status" TEXT NOT NULL,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."status_type" (
    "id" SERIAL NOT NULL,
    "status_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."priority_type" (
    "id" SERIAL NOT NULL,
    "priority_name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "priority_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."geographic_reference" (
    "id" SERIAL NOT NULL,
    "reference_type" "api"."geographic_reference_type" NOT NULL,
    "reference_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "parent_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geographic_reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."system_configuration" (
    "id" SERIAL NOT NULL,
    "config_key" TEXT NOT NULL,
    "config_value" TEXT NOT NULL,
    "data_type" "api"."system_data_type" NOT NULL,
    "category" "api"."system_configuration_category" NOT NULL,
    "description" TEXT,
    "is_encrypted" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."data_classification" (
    "id" SERIAL NOT NULL,
    "classification_name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "description" TEXT,
    "retention_period" INTEGER,
    "encryption_required" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_classification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."audit_log" (
    "id" SERIAL NOT NULL,
    "table_name" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "operation" "api"."audit_operation" NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "user_id" TEXT,
    "session_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "classification_id" INTEGER,
    "state_region_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."validation_rule" (
    "id" SERIAL NOT NULL,
    "rule_name" TEXT NOT NULL,
    "table_name" TEXT NOT NULL,
    "column_name" TEXT NOT NULL,
    "rule_type" "api"."validation_rule_type" NOT NULL,
    "rule_value" TEXT NOT NULL,
    "error_message" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "validation_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."fiscal_data_type" (
    "id" SERIAL NOT NULL,
    "type_name" TEXT NOT NULL,
    "category" "api"."fiscal_data_type_category" NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fiscal_data_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."fund_type" (
    "id" SERIAL NOT NULL,
    "fund_name" TEXT NOT NULL,
    "fund_code" TEXT,
    "category" "api"."fund_type_category" NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fund_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."acfr_report" (
    "id" SERIAL NOT NULL,
    "government_entity_id" INTEGER NOT NULL,
    "fiscal_year" INTEGER NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL,
    "report_type" "api"."acfr_report_type" NOT NULL,
    "auditor_name" TEXT,
    "auditor_opinion" "api"."acfr_report_auditor_opinion",
    "report_url" TEXT,
    "is_exempt" BOOLEAN NOT NULL DEFAULT false,
    "exemption_reason" TEXT,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acfr_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."fiscal_data_shard_1" (
    "id" SERIAL NOT NULL,
    "acfr_report_id" INTEGER NOT NULL,
    "fiscal_data_type_id" INTEGER NOT NULL,
    "fund_type_id" INTEGER,
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT,
    "notes" TEXT,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fiscal_data_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."pension_plan" (
    "id" SERIAL NOT NULL,
    "government_entity_id" INTEGER NOT NULL,
    "plan_name" TEXT NOT NULL,
    "plan_type" "api"."pesion_plan_type" NOT NULL,
    "plan_code" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pension_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."pension_data_shard_1" (
    "id" SERIAL NOT NULL,
    "pension_plan_id" INTEGER NOT NULL,
    "acfr_report_id" INTEGER NOT NULL,
    "total_pension_liability" DECIMAL(15,2) NOT NULL,
    "fiduciary_net_position" DECIMAL(15,2) NOT NULL,
    "net_pension_liability" DECIMAL(15,2) NOT NULL,
    "actuarially_required_contribution" DECIMAL(15,2) NOT NULL,
    "actual_contribution" DECIMAL(15,2) NOT NULL,
    "normal_cost" DECIMAL(15,2),
    "unfunded_actuarial_accrued_liability" DECIMAL(15,2),
    "funded_ratio" DECIMAL(5,4),
    "discount_rate" DECIMAL(5,4),
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pension_data_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."opeb_data_shard_1" (
    "id" SERIAL NOT NULL,
    "government_entity_id" INTEGER NOT NULL,
    "acfr_report_id" INTEGER NOT NULL,
    "total_opeb_liability" DECIMAL(15,2) NOT NULL,
    "opeb_fiduciary_net_position" DECIMAL(15,2) NOT NULL,
    "net_opeb_liability" DECIMAL(15,2) NOT NULL,
    "opeb_funding_ratio" DECIMAL(5,4),
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opeb_data_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."fiscal_health_score" (
    "id" SERIAL NOT NULL,
    "government_entity_id" INTEGER NOT NULL,
    "fiscal_year" INTEGER NOT NULL,
    "general_fund_reserve_score" DECIMAL(5,4),
    "debt_burden_score" DECIMAL(5,4),
    "liquidity_position_score" DECIMAL(5,4),
    "revenue_trend_score" DECIMAL(5,4),
    "pension_costs_score" DECIMAL(5,4),
    "pension_funding_score" DECIMAL(5,4),
    "pension_obligations_score" DECIMAL(5,4),
    "opeb_obligation_score" DECIMAL(5,4),
    "opeb_funding_score" DECIMAL(5,4),
    "net_worth_score" DECIMAL(5,4),
    "overall_score" DECIMAL(5,4),
    "score_date" TIMESTAMP(3) NOT NULL,
    "calculation_method" TEXT NOT NULL,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fiscal_health_score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."event_type" (
    "id" SERIAL NOT NULL,
    "type_name" TEXT NOT NULL,
    "description" TEXT,
    "category" "api"."event_type_category",
    "severity" "api"."event_type_severity",
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."event_shard_1" (
    "id" SERIAL NOT NULL,
    "event_name" TEXT NOT NULL,
    "event_type_id" INTEGER NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "event_document_url" TEXT,
    "event_webpage_url" TEXT,
    "event_ai_summary" TEXT,
    "event_description" TEXT,
    "event_status_id" INTEGER NOT NULL,
    "priority_id" INTEGER,
    "source" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."person_event_shard_1" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "relationship_type" "api"."person_event_shard_1_relationship_type" NOT NULL,
    "role" TEXT,
    "notes" TEXT,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "person_event_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."business_event_shard_1" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "relationship_type" "api"."business_event_shard_1_relationship_type" NOT NULL,
    "role" TEXT,
    "notes" TEXT,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_event_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."government_event_shard_1" (
    "id" SERIAL NOT NULL,
    "government_entity_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "relationship_type" "api"."government_event_shard_1_relationship_type" NOT NULL,
    "role" TEXT,
    "notes" TEXT,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "government_event_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."ngo_event_shard_1" (
    "id" SERIAL NOT NULL,
    "ngo_id" TEXT NOT NULL,
    "event_id" INTEGER NOT NULL,
    "relationship_type" "api"."ngo_event_shard_1_relationship_type" NOT NULL,
    "role" TEXT,
    "notes" TEXT,
    "state_region_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ngo_event_shard_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."home_owner_association" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date_established" TIMESTAMP(3),
    "location_id" INTEGER,
    "website" TEXT,
    "administration_software" TEXT,
    "management_structure" TEXT,
    "age_restrictions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_owner_association_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."hoa_board_members" (
    "id" SERIAL NOT NULL,
    "hoa_id" INTEGER NOT NULL,
    "prefix" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "position" TEXT,
    "term_start" TIMESTAMP(3),
    "term_end" TIMESTAMP(3),
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "is_current" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hoa_board_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."hoa_financial_records" (
    "id" SERIAL NOT NULL,
    "hoa_id" INTEGER NOT NULL,
    "record_type" TEXT NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "document_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hoa_financial_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."hoa_invoices" (
    "id" SERIAL NOT NULL,
    "hoa_id" INTEGER NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "invoice_date" TIMESTAMP(3) NOT NULL,
    "invoice_amount" DECIMAL(10,2) NOT NULL,
    "unpaid_invoice_amount" DECIMAL(10,2),
    "cost_paid" DECIMAL(10,2),
    "due_date" TIMESTAMP(3),
    "paid_date" TIMESTAMP(3),
    "vendor_name" TEXT,
    "vendor_business_id" INTEGER,
    "service_type" TEXT,
    "service_description" TEXT,
    "authorizing_board_member_id" INTEGER,
    "authorizing_management_company_id" INTEGER,
    "financial_record_id" INTEGER,
    "description" TEXT,
    "invoice_document_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hoa_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."hoa_fee_history" (
    "id" SERIAL NOT NULL,
    "hoa_id" INTEGER NOT NULL,
    "fee_type" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hoa_fee_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."hoa_governing_documents" (
    "id" SERIAL NOT NULL,
    "hoa_id" INTEGER NOT NULL,
    "document_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" TEXT,
    "effective_date" TIMESTAMP(3),
    "document_url" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hoa_governing_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."hoa_amenities" (
    "id" SERIAL NOT NULL,
    "hoa_id" INTEGER NOT NULL,
    "amenity_name" TEXT NOT NULL,
    "description" TEXT,
    "maintenance_responsibility" TEXT,
    "access_restrictions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hoa_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."hoa_legal_records" (
    "id" SERIAL NOT NULL,
    "hoa_id" INTEGER NOT NULL,
    "record_type" TEXT NOT NULL,
    "case_number" TEXT,
    "jurisdiction" TEXT,
    "description" TEXT,
    "status" TEXT,
    "date_filed" TIMESTAMP(3),
    "resolution_date" TIMESTAMP(3),
    "legal_document_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hoa_legal_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."hoa_assessments" (
    "id" SERIAL NOT NULL,
    "hoa_id" INTEGER NOT NULL,
    "assessment_type" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "purpose" TEXT,
    "due_date" TIMESTAMP(3),
    "assessment_document_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hoa_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."hoa_meetings" (
    "id" SERIAL NOT NULL,
    "hoa_id" INTEGER NOT NULL,
    "meeting_date_time" TIMESTAMP(3) NOT NULL,
    "meeting_type" TEXT NOT NULL,
    "meeting_document_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hoa_meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."hoa_management_company" (
    "id" SERIAL NOT NULL,
    "hoa_id" INTEGER NOT NULL,
    "management_company_id" INTEGER NOT NULL,
    "contract_start_date" TIMESTAMP(3) NOT NULL,
    "contract_end_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "contract_amount" DECIMAL(10,2),
    "contract_type" TEXT,
    "contract_document_url" TEXT,
    "termination_reason" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hoa_management_company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."subdivision" (
    "id" SERIAL NOT NULL,
    "hoa_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date_created" TIMESTAMP(3),
    "home_builder_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subdivision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."home_builder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "date_formed" TIMESTAMP(3),
    "location_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_builder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."realtor" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "realty_agency" TEXT,
    "specialization" TEXT,
    "location_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "realtor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."smrcs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" TEXT,
    "draft_step" INTEGER,
    "video_url" TEXT,
    "currentResidence" BOOLEAN NOT NULL,
    "notResident" BOOLEAN NOT NULL,
    "residenceType" "api"."residence_type",
    "timeAtResidence" "api"."time_at_residence",
    "lengthOfVisit" "api"."length_of_visit",
    "visitDays" INTEGER,
    "endDate" TIMESTAMP(3),
    "visitBeganAt" TIMESTAMP(3),
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "agency_level" "api"."agency_level" NOT NULL,
    "agency_name" TEXT NOT NULL,
    "service_received_date" TIMESTAMP(3) NOT NULL,
    "delivery_method" "api"."delivery_method" NOT NULL,
    "request_status" "api"."request_status" NOT NULL,
    "representative_name" TEXT,
    "agency_website" TEXT,
    "date_last_email_received" TIMESTAMP(3),
    "representative_email" TEXT,
    "representative_phone" TEXT,
    "date_last_phone_contact" TIMESTAMP(3),
    "location_street_address_one" TEXT,
    "location_street_address_two" TEXT,
    "location_city" TEXT,
    "location_state" TEXT,
    "location_zip_code" TEXT,
    "short_description" TEXT NOT NULL,
    "recommendation" INTEGER NOT NULL,
    "recommendation_comments" TEXT[],
    "recommendation_comment_explanation" TEXT,
    "recommendation_comment" TEXT,
    "contacted_by_government" BOOLEAN NOT NULL,
    "contacted_by_government_method" "api"."contact_method",
    "contacted_by_government_phone" TEXT,
    "contacted_by_government_phone_time" TEXT,
    "contacted_by_government_email" TEXT,
    "non_business_rating" JSONB,
    "non_business_experience_feedback" TEXT,
    "business_owner" BOOLEAN NOT NULL,
    "business_recommendation" INTEGER,
    "business_recommendation_comments" TEXT[],
    "business_recommendation_comment_explanation" TEXT,
    "business_recommendation_comment" TEXT,
    "business_rating" JSONB,
    "business_experience_feedback" TEXT,
    "has_recorded_video" BOOLEAN NOT NULL DEFAULT false,
    "ip_address" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "smrcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."data_types" (
    "id" UUID NOT NULL,
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "marker" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "data_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_role_permissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role_id" UUID NOT NULL,
    "permission" TEXT NOT NULL,

    CONSTRAINT "admin_role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "display_name" TEXT,
    "role_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "county_state_id_idx" ON "api"."county"("state_id");

-- CreateIndex
CREATE INDEX "county_county_name_idx" ON "api"."county"("county_name");

-- CreateIndex
CREATE INDEX "city_county_id_idx" ON "api"."city"("county_id");

-- CreateIndex
CREATE INDEX "city_city_name_idx" ON "api"."city"("city_name");

-- CreateIndex
CREATE INDEX "zip_code_city_id_idx" ON "api"."zip_code"("city_id");

-- CreateIndex
CREATE INDEX "zip_code_zip_code_idx" ON "api"."zip_code"("zip_code");

-- CreateIndex
CREATE INDEX "location_shard_1_latitude_longitude_idx" ON "api"."location_shard_1"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "location_shard_1_zip_code_id_idx" ON "api"."location_shard_1"("zip_code_id");

-- CreateIndex
CREATE INDEX "location_shard_1_state_region_id_idx" ON "api"."location_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "location_shard_1_location_type_id_idx" ON "api"."location_shard_1"("location_type_id");

-- CreateIndex
CREATE INDEX "location_shard_1_street_address_1_idx" ON "api"."location_shard_1"("street_address_1");

-- CreateIndex
CREATE INDEX "location_shard_1_state_region_id_latitude_longitude_idx" ON "api"."location_shard_1"("state_region_id", "latitude", "longitude");

-- CreateIndex
CREATE INDEX "person_first_name_last_name_idx" ON "api"."person"("first_name", "last_name");

-- CreateIndex
CREATE INDEX "person_date_of_birth_idx" ON "api"."person"("date_of_birth");

-- CreateIndex
CREATE INDEX "person_juvenile_idx" ON "api"."person"("juvenile");

-- CreateIndex
CREATE INDEX "person_last_name_first_name_juvenile_idx" ON "api"."person"("last_name", "first_name", "juvenile");

-- CreateIndex
CREATE INDEX "person_date_of_birth_juvenile_idx" ON "api"."person"("date_of_birth", "juvenile");

-- CreateIndex
CREATE INDEX "government_entity_government_level_id_idx" ON "api"."government_entity"("government_level_id");

-- CreateIndex
CREATE INDEX "government_entity_state_id_idx" ON "api"."government_entity"("state_id");

-- CreateIndex
CREATE INDEX "government_entity_county_id_idx" ON "api"."government_entity"("county_id");

-- CreateIndex
CREATE INDEX "government_entity_city_id_idx" ON "api"."government_entity"("city_id");

-- CreateIndex
CREATE INDEX "government_entity_entity_type_idx" ON "api"."government_entity"("entity_type");

-- CreateIndex
CREATE INDEX "government_entity_has_reviews_idx" ON "api"."government_entity"("has_reviews");

-- CreateIndex
CREATE INDEX "government_entity_is_active_idx" ON "api"."government_entity"("is_active");

-- CreateIndex
CREATE INDEX "government_entity_entity_name_idx" ON "api"."government_entity"("entity_name");

-- CreateIndex
CREATE INDEX "government_entity_latitude_longitude_idx" ON "api"."government_entity"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "government_entity_state_id_entity_type_idx" ON "api"."government_entity"("state_id", "entity_type");

-- CreateIndex
CREATE INDEX "government_entity_is_active_has_reviews_idx" ON "api"."government_entity"("is_active", "has_reviews");

-- CreateIndex
CREATE INDEX "government_entity_is_active_has_reviews_state_id_idx" ON "api"."government_entity"("is_active", "has_reviews", "state_id");

-- CreateIndex
CREATE INDEX "government_entity_entity_type_is_active_government_level_id_idx" ON "api"."government_entity"("entity_type", "is_active", "government_level_id");

-- CreateIndex
CREATE INDEX "business_state_region_id_idx" ON "api"."business"("state_region_id");

-- CreateIndex
CREATE INDEX "business_business_type_idx" ON "api"."business"("business_type");

-- CreateIndex
CREATE INDEX "business_service_category_idx" ON "api"."business"("service_category");

-- CreateIndex
CREATE INDEX "business_minority_owned_business_idx" ON "api"."business"("minority_owned_business");

-- CreateIndex
CREATE INDEX "business_women_owned_business_idx" ON "api"."business"("women_owned_business");

-- CreateIndex
CREATE INDEX "business_veteran_owned_business_idx" ON "api"."business"("veteran_owned_business");

-- CreateIndex
CREATE INDEX "business_state_region_id_business_type_idx" ON "api"."business"("state_region_id", "business_type");

-- CreateIndex
CREATE INDEX "business_minority_owned_business_women_owned_business_idx" ON "api"."business"("minority_owned_business", "women_owned_business");

-- CreateIndex
CREATE INDEX "business_name_idx" ON "api"."business"("name");

-- CreateIndex
CREATE INDEX "business_business_license_number_idx" ON "api"."business"("business_license_number");

-- CreateIndex
CREATE INDEX "business_chief_executive_idx" ON "api"."business"("chief_executive");

-- CreateIndex
CREATE INDEX "business_business_license_status_business_license_expiratio_idx" ON "api"."business"("business_license_status", "business_license_expiration_date");

-- CreateIndex
CREATE INDEX "non_governmental_organization_shard_1_state_region_id_idx" ON "api"."non_governmental_organization_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "non_governmental_organization_shard_1_ngo_type_idx" ON "api"."non_governmental_organization_shard_1"("ngo_type");

-- CreateIndex
CREATE INDEX "non_governmental_organization_shard_1_name_idx" ON "api"."non_governmental_organization_shard_1"("name");

-- CreateIndex
CREATE INDEX "non_governmental_organization_shard_1_principal_officer_idx" ON "api"."non_governmental_organization_shard_1"("principal_officer");

-- CreateIndex
CREATE INDEX "state_review_shard_1_government_entity_id_idx" ON "api"."state_review_shard_1"("government_entity_id");

-- CreateIndex
CREATE INDEX "state_review_shard_1_state_id_idx" ON "api"."state_review_shard_1"("state_id");

-- CreateIndex
CREATE INDEX "state_review_shard_1_review_type_id_idx" ON "api"."state_review_shard_1"("review_type_id");

-- CreateIndex
CREATE INDEX "state_review_shard_1_status_id_idx" ON "api"."state_review_shard_1"("status_id");

-- CreateIndex
CREATE INDEX "state_review_shard_1_state_region_id_idx" ON "api"."state_review_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "state_review_shard_1_rating_idx" ON "api"."state_review_shard_1"("rating");

-- CreateIndex
CREATE INDEX "state_review_shard_1_is_verified_idx" ON "api"."state_review_shard_1"("is_verified");

-- CreateIndex
CREATE INDEX "state_review_shard_1_created_at_idx" ON "api"."state_review_shard_1"("created_at");

-- CreateIndex
CREATE INDEX "county_review_shard_1_government_entity_id_idx" ON "api"."county_review_shard_1"("government_entity_id");

-- CreateIndex
CREATE INDEX "county_review_shard_1_county_id_idx" ON "api"."county_review_shard_1"("county_id");

-- CreateIndex
CREATE INDEX "county_review_shard_1_review_type_id_idx" ON "api"."county_review_shard_1"("review_type_id");

-- CreateIndex
CREATE INDEX "county_review_shard_1_status_id_idx" ON "api"."county_review_shard_1"("status_id");

-- CreateIndex
CREATE INDEX "county_review_shard_1_state_region_id_idx" ON "api"."county_review_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "county_review_shard_1_rating_idx" ON "api"."county_review_shard_1"("rating");

-- CreateIndex
CREATE INDEX "county_review_shard_1_is_verified_idx" ON "api"."county_review_shard_1"("is_verified");

-- CreateIndex
CREATE INDEX "county_review_shard_1_created_at_idx" ON "api"."county_review_shard_1"("created_at");

-- CreateIndex
CREATE INDEX "city_review_shard_1_government_entity_id_idx" ON "api"."city_review_shard_1"("government_entity_id");

-- CreateIndex
CREATE INDEX "city_review_shard_1_city_id_idx" ON "api"."city_review_shard_1"("city_id");

-- CreateIndex
CREATE INDEX "city_review_shard_1_review_type_id_idx" ON "api"."city_review_shard_1"("review_type_id");

-- CreateIndex
CREATE INDEX "city_review_shard_1_status_id_idx" ON "api"."city_review_shard_1"("status_id");

-- CreateIndex
CREATE INDEX "city_review_shard_1_state_region_id_idx" ON "api"."city_review_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "city_review_shard_1_rating_idx" ON "api"."city_review_shard_1"("rating");

-- CreateIndex
CREATE INDEX "city_review_shard_1_is_verified_idx" ON "api"."city_review_shard_1"("is_verified");

-- CreateIndex
CREATE INDEX "city_review_shard_1_created_at_idx" ON "api"."city_review_shard_1"("created_at");

-- CreateIndex
CREATE INDEX "table_shard_registry_table_registry_id_idx" ON "api"."table_shard_registry"("table_registry_id");

-- CreateIndex
CREATE INDEX "table_shard_registry_state_region_id_idx" ON "api"."table_shard_registry"("state_region_id");

-- CreateIndex
CREATE INDEX "table_shard_registry_shard_number_idx" ON "api"."table_shard_registry"("shard_number");

-- CreateIndex
CREATE INDEX "table_shard_registry_status_idx" ON "api"."table_shard_registry"("status");

-- CreateIndex
CREATE INDEX "state_region_region_name_idx" ON "api"."state_region"("region_name");

-- CreateIndex
CREATE INDEX "state_region_region_code_idx" ON "api"."state_region"("region_code");

-- CreateIndex
CREATE INDEX "state_region_is_active_idx" ON "api"."state_region"("is_active");

-- CreateIndex
CREATE INDEX "government_level_level_name_idx" ON "api"."government_level"("level_name");

-- CreateIndex
CREATE INDEX "government_level_hierarchy_order_idx" ON "api"."government_level"("hierarchy_order");

-- CreateIndex
CREATE INDEX "relationship_type_relationship_name_idx" ON "api"."relationship_type"("relationship_name");

-- CreateIndex
CREATE INDEX "relationship_type_is_employment_idx" ON "api"."relationship_type"("is_employment");

-- CreateIndex
CREATE INDEX "relationship_type_is_active_idx" ON "api"."relationship_type"("is_active");

-- CreateIndex
CREATE INDEX "review_type_type_name_idx" ON "api"."review_type"("type_name");

-- CreateIndex
CREATE INDEX "review_type_requires_response_idx" ON "api"."review_type"("requires_response");

-- CreateIndex
CREATE INDEX "review_type_priority_level_idx" ON "api"."review_type"("priority_level");

-- CreateIndex
CREATE INDEX "review_type_is_active_idx" ON "api"."review_type"("is_active");

-- CreateIndex
CREATE INDEX "statute_statute_number_idx" ON "api"."statute"("statute_number");

-- CreateIndex
CREATE INDEX "statute_state_id_idx" ON "api"."statute"("state_id");

-- CreateIndex
CREATE INDEX "statute_effective_date_idx" ON "api"."statute"("effective_date");

-- CreateIndex
CREATE INDEX "statute_repealed_date_idx" ON "api"."statute"("repealed_date");

-- CreateIndex
CREATE INDEX "punishment_crime_punishment_id_idx" ON "api"."punishment_crime"("punishment_id");

-- CreateIndex
CREATE INDEX "punishment_crime_crime_id_idx" ON "api"."punishment_crime"("crime_id");

-- CreateIndex
CREATE INDEX "crime_classification_id_idx" ON "api"."crime"("classification_id");

-- CreateIndex
CREATE INDEX "crime_crime_name_idx" ON "api"."crime"("crime_name");

-- CreateIndex
CREATE INDEX "crime_severity_level_idx" ON "api"."crime"("severity_level");

-- CreateIndex
CREATE INDEX "classification_state_id_idx" ON "api"."classification"("state_id");

-- CreateIndex
CREATE INDEX "classification_classification_name_idx" ON "api"."classification"("classification_name");

-- CreateIndex
CREATE INDEX "classification_classification_type_idx" ON "api"."classification"("classification_type");

-- CreateIndex
CREATE INDEX "crime_statute_crime_id_idx" ON "api"."crime_statute"("crime_id");

-- CreateIndex
CREATE INDEX "crime_statute_state_id_idx" ON "api"."crime_statute"("state_id");

-- CreateIndex
CREATE INDEX "crime_statute_statute_code_idx" ON "api"."crime_statute"("statute_code");

-- CreateIndex
CREATE INDEX "crime_report_incident_shard_1_crime_id_idx" ON "api"."crime_report_incident_shard_1"("crime_id");

-- CreateIndex
CREATE INDEX "crime_report_incident_shard_1_state_region_id_idx" ON "api"."crime_report_incident_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "crime_report_incident_shard_1_incident_date_idx" ON "api"."crime_report_incident_shard_1"("incident_date");

-- CreateIndex
CREATE INDEX "crime_report_incident_shard_1_status_idx" ON "api"."crime_report_incident_shard_1"("status");

-- CreateIndex
CREATE INDEX "population_history_city_id_idx" ON "api"."population_history"("city_id");

-- CreateIndex
CREATE INDEX "population_history_year_idx" ON "api"."population_history"("year");

-- CreateIndex
CREATE INDEX "population_history_city_id_year_idx" ON "api"."population_history"("city_id", "year");

-- CreateIndex
CREATE INDEX "education_level_level_name_idx" ON "api"."education_level"("level_name");

-- CreateIndex
CREATE INDEX "education_level_level_category_idx" ON "api"."education_level"("level_category");

-- CreateIndex
CREATE INDEX "education_data_shard_1_person_id_idx" ON "api"."education_data_shard_1"("person_id");

-- CreateIndex
CREATE INDEX "education_data_shard_1_education_level_id_idx" ON "api"."education_data_shard_1"("education_level_id");

-- CreateIndex
CREATE INDEX "education_data_shard_1_state_region_id_idx" ON "api"."education_data_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "education_data_shard_1_graduation_date_idx" ON "api"."education_data_shard_1"("graduation_date");

-- CreateIndex
CREATE INDEX "class_shard_1_education_level_id_idx" ON "api"."class_shard_1"("education_level_id");

-- CreateIndex
CREATE INDEX "class_shard_1_state_region_id_idx" ON "api"."class_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "class_shard_1_teacher_id_idx" ON "api"."class_shard_1"("teacher_id");

-- CreateIndex
CREATE INDEX "class_shard_1_class_name_idx" ON "api"."class_shard_1"("class_name");

-- CreateIndex
CREATE INDEX "class_shard_1_subject_idx" ON "api"."class_shard_1"("subject");

-- CreateIndex
CREATE INDEX "class_enrollment_shard_1_class_id_idx" ON "api"."class_enrollment_shard_1"("class_id");

-- CreateIndex
CREATE INDEX "class_enrollment_shard_1_student_id_idx" ON "api"."class_enrollment_shard_1"("student_id");

-- CreateIndex
CREATE INDEX "class_enrollment_shard_1_status_id_idx" ON "api"."class_enrollment_shard_1"("status_id");

-- CreateIndex
CREATE INDEX "class_enrollment_shard_1_state_region_id_idx" ON "api"."class_enrollment_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "class_enrollment_shard_1_enrollment_date_idx" ON "api"."class_enrollment_shard_1"("enrollment_date");

-- CreateIndex
CREATE INDEX "class_enrollment_shard_1_grade_idx" ON "api"."class_enrollment_shard_1"("grade");

-- CreateIndex
CREATE INDEX "teacher_credential_shard_1_teacher_id_idx" ON "api"."teacher_credential_shard_1"("teacher_id");

-- CreateIndex
CREATE INDEX "teacher_credential_shard_1_status_id_idx" ON "api"."teacher_credential_shard_1"("status_id");

-- CreateIndex
CREATE INDEX "teacher_credential_shard_1_state_region_id_idx" ON "api"."teacher_credential_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "teacher_credential_shard_1_credential_type_idx" ON "api"."teacher_credential_shard_1"("credential_type");

-- CreateIndex
CREATE INDEX "teacher_credential_shard_1_subject_idx" ON "api"."teacher_credential_shard_1"("subject");

-- CreateIndex
CREATE INDEX "teacher_credential_shard_1_issue_date_idx" ON "api"."teacher_credential_shard_1"("issue_date");

-- CreateIndex
CREATE INDEX "teacher_credential_shard_1_expiration_date_idx" ON "api"."teacher_credential_shard_1"("expiration_date");

-- CreateIndex
CREATE INDEX "grade_progression_shard_1_student_id_idx" ON "api"."grade_progression_shard_1"("student_id");

-- CreateIndex
CREATE INDEX "grade_progression_shard_1_state_region_id_idx" ON "api"."grade_progression_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "grade_progression_shard_1_school_year_idx" ON "api"."grade_progression_shard_1"("school_year");

-- CreateIndex
CREATE INDEX "grade_progression_shard_1_promoted_idx" ON "api"."grade_progression_shard_1"("promoted");

-- CreateIndex
CREATE INDEX "disciplinary_action_shard_1_student_id_idx" ON "api"."disciplinary_action_shard_1"("student_id");

-- CreateIndex
CREATE INDEX "disciplinary_action_shard_1_state_region_id_idx" ON "api"."disciplinary_action_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "disciplinary_action_shard_1_action_type_idx" ON "api"."disciplinary_action_shard_1"("action_type");

-- CreateIndex
CREATE INDEX "disciplinary_action_shard_1_action_date_idx" ON "api"."disciplinary_action_shard_1"("action_date");

-- CreateIndex
CREATE INDEX "employment_data_shard_1_person_id_idx" ON "api"."employment_data_shard_1"("person_id");

-- CreateIndex
CREATE INDEX "employment_data_shard_1_employer_id_idx" ON "api"."employment_data_shard_1"("employer_id");

-- CreateIndex
CREATE INDEX "employment_data_shard_1_status_id_idx" ON "api"."employment_data_shard_1"("status_id");

-- CreateIndex
CREATE INDEX "employment_data_shard_1_state_region_id_idx" ON "api"."employment_data_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "employment_data_shard_1_start_date_idx" ON "api"."employment_data_shard_1"("start_date");

-- CreateIndex
CREATE INDEX "employment_data_shard_1_end_date_idx" ON "api"."employment_data_shard_1"("end_date");

-- CreateIndex
CREATE INDEX "employment_data_shard_1_employment_type_idx" ON "api"."employment_data_shard_1"("employment_type");

-- CreateIndex
CREATE INDEX "business_license_shard_1_business_id_idx" ON "api"."business_license_shard_1"("business_id");

-- CreateIndex
CREATE INDEX "business_license_shard_1_status_id_idx" ON "api"."business_license_shard_1"("status_id");

-- CreateIndex
CREATE INDEX "business_license_shard_1_state_region_id_idx" ON "api"."business_license_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "business_license_shard_1_license_number_idx" ON "api"."business_license_shard_1"("license_number");

-- CreateIndex
CREATE INDEX "business_license_shard_1_license_type_idx" ON "api"."business_license_shard_1"("license_type");

-- CreateIndex
CREATE INDEX "business_license_shard_1_issue_date_idx" ON "api"."business_license_shard_1"("issue_date");

-- CreateIndex
CREATE INDEX "business_license_shard_1_expiration_date_idx" ON "api"."business_license_shard_1"("expiration_date");

-- CreateIndex
CREATE INDEX "housing_status_shard_1_person_id_idx" ON "api"."housing_status_shard_1"("person_id");

-- CreateIndex
CREATE INDEX "housing_status_shard_1_state_region_id_idx" ON "api"."housing_status_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "housing_status_shard_1_housing_type_idx" ON "api"."housing_status_shard_1"("housing_type");

-- CreateIndex
CREATE INDEX "housing_status_shard_1_ownership_status_idx" ON "api"."housing_status_shard_1"("ownership_status");

-- CreateIndex
CREATE INDEX "housing_status_shard_1_move_in_date_idx" ON "api"."housing_status_shard_1"("move_in_date");

-- CreateIndex
CREATE INDEX "person_location_shard_1_person_id_idx" ON "api"."person_location_shard_1"("person_id");

-- CreateIndex
CREATE INDEX "person_location_shard_1_location_id_idx" ON "api"."person_location_shard_1"("location_id");

-- CreateIndex
CREATE INDEX "person_location_shard_1_state_region_id_idx" ON "api"."person_location_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "person_location_shard_1_relationship_type_idx" ON "api"."person_location_shard_1"("relationship_type");

-- CreateIndex
CREATE INDEX "person_location_shard_1_is_primary_idx" ON "api"."person_location_shard_1"("is_primary");

-- CreateIndex
CREATE INDEX "organization_location_shard_1_organization_id_idx" ON "api"."organization_location_shard_1"("organization_id");

-- CreateIndex
CREATE INDEX "organization_location_shard_1_location_id_idx" ON "api"."organization_location_shard_1"("location_id");

-- CreateIndex
CREATE INDEX "organization_location_shard_1_state_region_id_idx" ON "api"."organization_location_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "organization_location_shard_1_relationship_type_idx" ON "api"."organization_location_shard_1"("relationship_type");

-- CreateIndex
CREATE INDEX "organization_location_shard_1_is_primary_idx" ON "api"."organization_location_shard_1"("is_primary");

-- CreateIndex
CREATE INDEX "person_org_relationship_shard_1_person_id_idx" ON "api"."person_org_relationship_shard_1"("person_id");

-- CreateIndex
CREATE INDEX "person_org_relationship_shard_1_organization_id_idx" ON "api"."person_org_relationship_shard_1"("organization_id");

-- CreateIndex
CREATE INDEX "person_org_relationship_shard_1_relationship_type_id_idx" ON "api"."person_org_relationship_shard_1"("relationship_type_id");

-- CreateIndex
CREATE INDEX "person_org_relationship_shard_1_status_id_idx" ON "api"."person_org_relationship_shard_1"("status_id");

-- CreateIndex
CREATE INDEX "person_org_relationship_shard_1_state_region_id_idx" ON "api"."person_org_relationship_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "person_org_relationship_shard_1_start_date_idx" ON "api"."person_org_relationship_shard_1"("start_date");

-- CreateIndex
CREATE INDEX "person_org_relationship_shard_1_end_date_idx" ON "api"."person_org_relationship_shard_1"("end_date");

-- CreateIndex
CREATE INDEX "element_element_name_idx" ON "api"."element"("element_name");

-- CreateIndex
CREATE INDEX "element_category_idx" ON "api"."element"("category");

-- CreateIndex
CREATE INDEX "element_is_active_idx" ON "api"."element"("is_active");

-- CreateIndex
CREATE INDEX "offense_element_crime_id_idx" ON "api"."offense_element"("crime_id");

-- CreateIndex
CREATE INDEX "offense_element_element_id_idx" ON "api"."offense_element"("element_id");

-- CreateIndex
CREATE INDEX "offense_element_is_required_idx" ON "api"."offense_element"("is_required");

-- CreateIndex
CREATE INDEX "labor_force_statistics_state_id_idx" ON "api"."labor_force_statistics"("state_id");

-- CreateIndex
CREATE INDEX "labor_force_statistics_county_id_idx" ON "api"."labor_force_statistics"("county_id");

-- CreateIndex
CREATE INDEX "labor_force_statistics_city_id_idx" ON "api"."labor_force_statistics"("city_id");

-- CreateIndex
CREATE INDEX "labor_force_statistics_year_idx" ON "api"."labor_force_statistics"("year");

-- CreateIndex
CREATE INDEX "labor_force_statistics_month_idx" ON "api"."labor_force_statistics"("month");

-- CreateIndex
CREATE INDEX "labor_force_statistics_state_id_year_idx" ON "api"."labor_force_statistics"("state_id", "year");

-- CreateIndex
CREATE INDEX "labor_force_statistics_county_id_year_idx" ON "api"."labor_force_statistics"("county_id", "year");

-- CreateIndex
CREATE INDEX "homeless_count_data_state_id_idx" ON "api"."homeless_count_data"("state_id");

-- CreateIndex
CREATE INDEX "homeless_count_data_county_id_idx" ON "api"."homeless_count_data"("county_id");

-- CreateIndex
CREATE INDEX "homeless_count_data_city_id_idx" ON "api"."homeless_count_data"("city_id");

-- CreateIndex
CREATE INDEX "homeless_count_data_year_idx" ON "api"."homeless_count_data"("year");

-- CreateIndex
CREATE INDEX "homeless_count_data_state_id_year_idx" ON "api"."homeless_count_data"("state_id", "year");

-- CreateIndex
CREATE INDEX "homeless_count_data_county_id_year_idx" ON "api"."homeless_count_data"("county_id", "year");

-- CreateIndex
CREATE INDEX "graduation_data_state_id_idx" ON "api"."graduation_data"("state_id");

-- CreateIndex
CREATE INDEX "graduation_data_county_id_idx" ON "api"."graduation_data"("county_id");

-- CreateIndex
CREATE INDEX "graduation_data_city_id_idx" ON "api"."graduation_data"("city_id");

-- CreateIndex
CREATE INDEX "graduation_data_school_year_idx" ON "api"."graduation_data"("school_year");

-- CreateIndex
CREATE INDEX "graduation_data_state_id_school_year_idx" ON "api"."graduation_data"("state_id", "school_year");

-- CreateIndex
CREATE INDEX "graduation_data_county_id_school_year_idx" ON "api"."graduation_data"("county_id", "school_year");

-- CreateIndex
CREATE INDEX "business_size_data_state_id_idx" ON "api"."business_size_data"("state_id");

-- CreateIndex
CREATE INDEX "business_size_data_county_id_idx" ON "api"."business_size_data"("county_id");

-- CreateIndex
CREATE INDEX "business_size_data_city_id_idx" ON "api"."business_size_data"("city_id");

-- CreateIndex
CREATE INDEX "business_size_data_year_idx" ON "api"."business_size_data"("year");

-- CreateIndex
CREATE INDEX "business_size_data_size_category_idx" ON "api"."business_size_data"("size_category");

-- CreateIndex
CREATE INDEX "business_size_data_state_id_year_idx" ON "api"."business_size_data"("state_id", "year");

-- CreateIndex
CREATE INDEX "business_size_data_county_id_year_idx" ON "api"."business_size_data"("county_id", "year");

-- CreateIndex
CREATE INDEX "state_review_subject_shard_1_subject_id_idx" ON "api"."state_review_subject_shard_1"("subject_id");

-- CreateIndex
CREATE INDEX "state_review_subject_shard_1_review_id_idx" ON "api"."state_review_subject_shard_1"("review_id");

-- CreateIndex
CREATE UNIQUE INDEX "state_review_subject_shard_1_subject_id_review_id_key" ON "api"."state_review_subject_shard_1"("subject_id", "review_id");

-- CreateIndex
CREATE INDEX "county_review_subject_shard_1_subject_id_idx" ON "api"."county_review_subject_shard_1"("subject_id");

-- CreateIndex
CREATE INDEX "county_review_subject_shard_1_review_id_idx" ON "api"."county_review_subject_shard_1"("review_id");

-- CreateIndex
CREATE UNIQUE INDEX "county_review_subject_shard_1_subject_id_review_id_key" ON "api"."county_review_subject_shard_1"("subject_id", "review_id");

-- CreateIndex
CREATE INDEX "city_review_subject_shard_1_subject_id_idx" ON "api"."city_review_subject_shard_1"("subject_id");

-- CreateIndex
CREATE INDEX "city_review_subject_shard_1_review_id_idx" ON "api"."city_review_subject_shard_1"("review_id");

-- CreateIndex
CREATE UNIQUE INDEX "city_review_subject_shard_1_subject_id_review_id_key" ON "api"."city_review_subject_shard_1"("subject_id", "review_id");

-- CreateIndex
CREATE INDEX "teaching_credential_credential_name_idx" ON "api"."teaching_credential"("credential_name");

-- CreateIndex
CREATE INDEX "teaching_credential_credential_type_idx" ON "api"."teaching_credential"("credential_type");

-- CreateIndex
CREATE INDEX "teaching_credential_issuing_authority_idx" ON "api"."teaching_credential"("issuing_authority");

-- CreateIndex
CREATE INDEX "school_district_district_id_idx" ON "api"."school_district"("district_id");

-- CreateIndex
CREATE INDEX "school_district_district_name_idx" ON "api"."school_district"("district_name");

-- CreateIndex
CREATE INDEX "school_district_city_id_idx" ON "api"."school_district"("city_id");

-- CreateIndex
CREATE INDEX "school_school_id_idx" ON "api"."school"("school_id");

-- CreateIndex
CREATE INDEX "school_school_name_idx" ON "api"."school"("school_name");

-- CreateIndex
CREATE INDEX "school_district_id_idx" ON "api"."school"("district_id");

-- CreateIndex
CREATE INDEX "school_school_type_idx" ON "api"."school"("school_type");

-- CreateIndex
CREATE INDEX "school_city_id_idx" ON "api"."school"("city_id");

-- CreateIndex
CREATE INDEX "school_state_region_id_idx" ON "api"."school"("state_region_id");

-- CreateIndex
CREATE INDEX "student_shard_1_student_id_idx" ON "api"."student_shard_1"("student_id");

-- CreateIndex
CREATE INDEX "student_shard_1_person_id_idx" ON "api"."student_shard_1"("person_id");

-- CreateIndex
CREATE INDEX "student_shard_1_school_id_idx" ON "api"."student_shard_1"("school_id");

-- CreateIndex
CREATE INDEX "student_shard_1_state_region_id_idx" ON "api"."student_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "student_shard_1_current_grade_level_idx" ON "api"."student_shard_1"("current_grade_level");

-- CreateIndex
CREATE INDEX "student_shard_1_enrollment_date_idx" ON "api"."student_shard_1"("enrollment_date");

-- CreateIndex
CREATE INDEX "student_shard_1_graduation_date_idx" ON "api"."student_shard_1"("graduation_date");

-- CreateIndex
CREATE INDEX "school_emergency_incident_shard_1_incident_id_idx" ON "api"."school_emergency_incident_shard_1"("incident_id");

-- CreateIndex
CREATE INDEX "school_emergency_incident_shard_1_school_id_idx" ON "api"."school_emergency_incident_shard_1"("school_id");

-- CreateIndex
CREATE INDEX "school_emergency_incident_shard_1_state_region_id_idx" ON "api"."school_emergency_incident_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "school_emergency_incident_shard_1_incident_date_idx" ON "api"."school_emergency_incident_shard_1"("incident_date");

-- CreateIndex
CREATE INDEX "school_emergency_incident_shard_1_incident_type_idx" ON "api"."school_emergency_incident_shard_1"("incident_type");

-- CreateIndex
CREATE INDEX "student_arrest_shard_1_arrest_id_idx" ON "api"."student_arrest_shard_1"("arrest_id");

-- CreateIndex
CREATE INDEX "student_arrest_shard_1_student_id_idx" ON "api"."student_arrest_shard_1"("student_id");

-- CreateIndex
CREATE INDEX "student_arrest_shard_1_person_id_idx" ON "api"."student_arrest_shard_1"("person_id");

-- CreateIndex
CREATE INDEX "student_arrest_shard_1_crime_id_idx" ON "api"."student_arrest_shard_1"("crime_id");

-- CreateIndex
CREATE INDEX "student_arrest_shard_1_statute_id_idx" ON "api"."student_arrest_shard_1"("statute_id");

-- CreateIndex
CREATE INDEX "student_arrest_shard_1_classification_id_idx" ON "api"."student_arrest_shard_1"("classification_id");

-- CreateIndex
CREATE INDEX "student_arrest_shard_1_state_region_id_idx" ON "api"."student_arrest_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "student_arrest_shard_1_arrest_date_idx" ON "api"."student_arrest_shard_1"("arrest_date");

-- CreateIndex
CREATE INDEX "student_arrest_shard_1_grade_level_idx" ON "api"."student_arrest_shard_1"("grade_level");

-- CreateIndex
CREATE INDEX "student_arrest_shard_1_school_id_idx" ON "api"."student_arrest_shard_1"("school_id");

-- CreateIndex
CREATE INDEX "teacher_shard_1_teacher_id_idx" ON "api"."teacher_shard_1"("teacher_id");

-- CreateIndex
CREATE INDEX "teacher_shard_1_person_id_idx" ON "api"."teacher_shard_1"("person_id");

-- CreateIndex
CREATE INDEX "teacher_shard_1_school_id_idx" ON "api"."teacher_shard_1"("school_id");

-- CreateIndex
CREATE INDEX "teacher_shard_1_state_region_id_idx" ON "api"."teacher_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "teacher_shard_1_hire_date_idx" ON "api"."teacher_shard_1"("hire_date");

-- CreateIndex
CREATE INDEX "teacher_shard_1_years_experience_idx" ON "api"."teacher_shard_1"("years_experience");

-- CreateIndex
CREATE INDEX "teacher_shard_1_employment_status_idx" ON "api"."teacher_shard_1"("employment_status");

-- CreateIndex
CREATE INDEX "status_type_category_idx" ON "api"."status_type"("category");

-- CreateIndex
CREATE INDEX "status_type_status_name_idx" ON "api"."status_type"("status_name");

-- CreateIndex
CREATE INDEX "status_type_is_active_idx" ON "api"."status_type"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "status_type_status_name_category_key" ON "api"."status_type"("status_name", "category");

-- CreateIndex
CREATE INDEX "priority_type_level_idx" ON "api"."priority_type"("level");

-- CreateIndex
CREATE INDEX "priority_type_priority_name_idx" ON "api"."priority_type"("priority_name");

-- CreateIndex
CREATE INDEX "priority_type_is_active_idx" ON "api"."priority_type"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "priority_type_priority_name_key" ON "api"."priority_type"("priority_name");

-- CreateIndex
CREATE INDEX "geographic_reference_reference_type_idx" ON "api"."geographic_reference"("reference_type");

-- CreateIndex
CREATE INDEX "geographic_reference_parent_id_idx" ON "api"."geographic_reference"("parent_id");

-- CreateIndex
CREATE INDEX "geographic_reference_name_idx" ON "api"."geographic_reference"("name");

-- CreateIndex
CREATE INDEX "geographic_reference_code_idx" ON "api"."geographic_reference"("code");

-- CreateIndex
CREATE INDEX "geographic_reference_is_active_idx" ON "api"."geographic_reference"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "geographic_reference_reference_type_reference_id_key" ON "api"."geographic_reference"("reference_type", "reference_id");

-- CreateIndex
CREATE INDEX "system_configuration_category_idx" ON "api"."system_configuration"("category");

-- CreateIndex
CREATE INDEX "system_configuration_data_type_idx" ON "api"."system_configuration"("data_type");

-- CreateIndex
CREATE INDEX "system_configuration_is_encrypted_idx" ON "api"."system_configuration"("is_encrypted");

-- CreateIndex
CREATE INDEX "system_configuration_is_active_idx" ON "api"."system_configuration"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "system_configuration_config_key_key" ON "api"."system_configuration"("config_key");

-- CreateIndex
CREATE INDEX "data_classification_level_idx" ON "api"."data_classification"("level");

-- CreateIndex
CREATE INDEX "data_classification_classification_name_idx" ON "api"."data_classification"("classification_name");

-- CreateIndex
CREATE INDEX "data_classification_is_active_idx" ON "api"."data_classification"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "data_classification_classification_name_key" ON "api"."data_classification"("classification_name");

-- CreateIndex
CREATE INDEX "audit_log_table_name_record_id_idx" ON "api"."audit_log"("table_name", "record_id");

-- CreateIndex
CREATE INDEX "audit_log_operation_idx" ON "api"."audit_log"("operation");

-- CreateIndex
CREATE INDEX "audit_log_user_id_idx" ON "api"."audit_log"("user_id");

-- CreateIndex
CREATE INDEX "audit_log_created_at_idx" ON "api"."audit_log"("created_at");

-- CreateIndex
CREATE INDEX "audit_log_state_region_id_idx" ON "api"."audit_log"("state_region_id");

-- CreateIndex
CREATE INDEX "audit_log_session_id_idx" ON "api"."audit_log"("session_id");

-- CreateIndex
CREATE INDEX "audit_log_ip_address_idx" ON "api"."audit_log"("ip_address");

-- CreateIndex
CREATE INDEX "audit_log_old_values_idx" ON "api"."audit_log" USING GIN ("old_values");

-- CreateIndex
CREATE INDEX "audit_log_new_values_idx" ON "api"."audit_log" USING GIN ("new_values");

-- CreateIndex
CREATE INDEX "validation_rule_table_name_idx" ON "api"."validation_rule"("table_name");

-- CreateIndex
CREATE INDEX "validation_rule_rule_type_idx" ON "api"."validation_rule"("rule_type");

-- CreateIndex
CREATE INDEX "validation_rule_is_active_idx" ON "api"."validation_rule"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "validation_rule_table_name_column_name_rule_name_key" ON "api"."validation_rule"("table_name", "column_name", "rule_name");

-- CreateIndex
CREATE INDEX "fiscal_data_type_type_name_idx" ON "api"."fiscal_data_type"("type_name");

-- CreateIndex
CREATE INDEX "fiscal_data_type_category_idx" ON "api"."fiscal_data_type"("category");

-- CreateIndex
CREATE INDEX "fiscal_data_type_is_active_idx" ON "api"."fiscal_data_type"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "fiscal_data_type_type_name_key" ON "api"."fiscal_data_type"("type_name");

-- CreateIndex
CREATE INDEX "fund_type_fund_name_idx" ON "api"."fund_type"("fund_name");

-- CreateIndex
CREATE INDEX "fund_type_fund_code_idx" ON "api"."fund_type"("fund_code");

-- CreateIndex
CREATE INDEX "fund_type_category_idx" ON "api"."fund_type"("category");

-- CreateIndex
CREATE INDEX "fund_type_is_active_idx" ON "api"."fund_type"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "fund_type_fund_name_key" ON "api"."fund_type"("fund_name");

-- CreateIndex
CREATE INDEX "acfr_report_government_entity_id_idx" ON "api"."acfr_report"("government_entity_id");

-- CreateIndex
CREATE INDEX "acfr_report_fiscal_year_idx" ON "api"."acfr_report"("fiscal_year");

-- CreateIndex
CREATE INDEX "acfr_report_report_type_idx" ON "api"."acfr_report"("report_type");

-- CreateIndex
CREATE INDEX "acfr_report_state_region_id_idx" ON "api"."acfr_report"("state_region_id");

-- CreateIndex
CREATE INDEX "acfr_report_is_exempt_idx" ON "api"."acfr_report"("is_exempt");

-- CreateIndex
CREATE INDEX "acfr_report_report_date_idx" ON "api"."acfr_report"("report_date");

-- CreateIndex
CREATE UNIQUE INDEX "acfr_report_government_entity_id_fiscal_year_key" ON "api"."acfr_report"("government_entity_id", "fiscal_year");

-- CreateIndex
CREATE INDEX "fiscal_data_shard_1_acfr_report_id_idx" ON "api"."fiscal_data_shard_1"("acfr_report_id");

-- CreateIndex
CREATE INDEX "fiscal_data_shard_1_fiscal_data_type_id_idx" ON "api"."fiscal_data_shard_1"("fiscal_data_type_id");

-- CreateIndex
CREATE INDEX "fiscal_data_shard_1_fund_type_id_idx" ON "api"."fiscal_data_shard_1"("fund_type_id");

-- CreateIndex
CREATE INDEX "fiscal_data_shard_1_state_region_id_idx" ON "api"."fiscal_data_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "fiscal_data_shard_1_amount_idx" ON "api"."fiscal_data_shard_1"("amount");

-- CreateIndex
CREATE INDEX "fiscal_data_shard_1_acfr_report_id_fiscal_data_type_id_idx" ON "api"."fiscal_data_shard_1"("acfr_report_id", "fiscal_data_type_id");

-- CreateIndex
CREATE INDEX "fiscal_data_shard_1_acfr_report_id_fiscal_data_type_id_fund_idx" ON "api"."fiscal_data_shard_1"("acfr_report_id", "fiscal_data_type_id", "fund_type_id");

-- CreateIndex
CREATE INDEX "pension_plan_government_entity_id_idx" ON "api"."pension_plan"("government_entity_id");

-- CreateIndex
CREATE INDEX "pension_plan_plan_name_idx" ON "api"."pension_plan"("plan_name");

-- CreateIndex
CREATE INDEX "pension_plan_plan_type_idx" ON "api"."pension_plan"("plan_type");

-- CreateIndex
CREATE INDEX "pension_plan_state_region_id_idx" ON "api"."pension_plan"("state_region_id");

-- CreateIndex
CREATE INDEX "pension_plan_is_active_idx" ON "api"."pension_plan"("is_active");

-- CreateIndex
CREATE INDEX "pension_data_shard_1_pension_plan_id_idx" ON "api"."pension_data_shard_1"("pension_plan_id");

-- CreateIndex
CREATE INDEX "pension_data_shard_1_acfr_report_id_idx" ON "api"."pension_data_shard_1"("acfr_report_id");

-- CreateIndex
CREATE INDEX "pension_data_shard_1_state_region_id_idx" ON "api"."pension_data_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "pension_data_shard_1_funded_ratio_idx" ON "api"."pension_data_shard_1"("funded_ratio");

-- CreateIndex
CREATE INDEX "pension_data_shard_1_discount_rate_idx" ON "api"."pension_data_shard_1"("discount_rate");

-- CreateIndex
CREATE UNIQUE INDEX "pension_data_shard_1_pension_plan_id_acfr_report_id_key" ON "api"."pension_data_shard_1"("pension_plan_id", "acfr_report_id");

-- CreateIndex
CREATE INDEX "opeb_data_shard_1_government_entity_id_idx" ON "api"."opeb_data_shard_1"("government_entity_id");

-- CreateIndex
CREATE INDEX "opeb_data_shard_1_acfr_report_id_idx" ON "api"."opeb_data_shard_1"("acfr_report_id");

-- CreateIndex
CREATE INDEX "opeb_data_shard_1_state_region_id_idx" ON "api"."opeb_data_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "opeb_data_shard_1_opeb_funding_ratio_idx" ON "api"."opeb_data_shard_1"("opeb_funding_ratio");

-- CreateIndex
CREATE UNIQUE INDEX "opeb_data_shard_1_government_entity_id_acfr_report_id_key" ON "api"."opeb_data_shard_1"("government_entity_id", "acfr_report_id");

-- CreateIndex
CREATE INDEX "fiscal_health_score_government_entity_id_idx" ON "api"."fiscal_health_score"("government_entity_id");

-- CreateIndex
CREATE INDEX "fiscal_health_score_fiscal_year_idx" ON "api"."fiscal_health_score"("fiscal_year");

-- CreateIndex
CREATE INDEX "fiscal_health_score_overall_score_idx" ON "api"."fiscal_health_score"("overall_score");

-- CreateIndex
CREATE INDEX "fiscal_health_score_state_region_id_idx" ON "api"."fiscal_health_score"("state_region_id");

-- CreateIndex
CREATE INDEX "fiscal_health_score_score_date_idx" ON "api"."fiscal_health_score"("score_date");

-- CreateIndex
CREATE INDEX "fiscal_health_score_calculation_method_idx" ON "api"."fiscal_health_score"("calculation_method");

-- CreateIndex
CREATE UNIQUE INDEX "fiscal_health_score_government_entity_id_fiscal_year_calcul_key" ON "api"."fiscal_health_score"("government_entity_id", "fiscal_year", "calculation_method");

-- CreateIndex
CREATE INDEX "event_type_type_name_idx" ON "api"."event_type"("type_name");

-- CreateIndex
CREATE INDEX "event_type_category_idx" ON "api"."event_type"("category");

-- CreateIndex
CREATE INDEX "event_type_severity_idx" ON "api"."event_type"("severity");

-- CreateIndex
CREATE INDEX "event_type_is_active_idx" ON "api"."event_type"("is_active");

-- CreateIndex
CREATE INDEX "event_shard_1_event_type_id_idx" ON "api"."event_shard_1"("event_type_id");

-- CreateIndex
CREATE INDEX "event_shard_1_event_date_idx" ON "api"."event_shard_1"("event_date");

-- CreateIndex
CREATE INDEX "event_shard_1_event_status_id_idx" ON "api"."event_shard_1"("event_status_id");

-- CreateIndex
CREATE INDEX "event_shard_1_state_region_id_idx" ON "api"."event_shard_1"("state_region_id");

-- CreateIndex
CREATE INDEX "event_shard_1_priority_id_idx" ON "api"."event_shard_1"("priority_id");

-- CreateIndex
CREATE INDEX "event_shard_1_verified_idx" ON "api"."event_shard_1"("verified");

-- CreateIndex
CREATE INDEX "event_shard_1_event_date_event_status_id_idx" ON "api"."event_shard_1"("event_date", "event_status_id");

-- CreateIndex
CREATE INDEX "event_shard_1_state_region_id_event_status_id_idx" ON "api"."event_shard_1"("state_region_id", "event_status_id");

-- CreateIndex
CREATE INDEX "event_shard_1_event_name_idx" ON "api"."event_shard_1"("event_name");

-- CreateIndex
CREATE INDEX "event_shard_1_source_idx" ON "api"."event_shard_1"("source");

-- CreateIndex
CREATE INDEX "event_shard_1_event_date_event_type_id_event_status_id_idx" ON "api"."event_shard_1"("event_date", "event_type_id", "event_status_id");

-- CreateIndex
CREATE INDEX "event_shard_1_state_region_id_event_date_verified_idx" ON "api"."event_shard_1"("state_region_id", "event_date", "verified");

-- CreateIndex
CREATE INDEX "person_event_shard_1_person_id_idx" ON "api"."person_event_shard_1"("person_id");

-- CreateIndex
CREATE INDEX "person_event_shard_1_event_id_idx" ON "api"."person_event_shard_1"("event_id");

-- CreateIndex
CREATE INDEX "person_event_shard_1_relationship_type_idx" ON "api"."person_event_shard_1"("relationship_type");

-- CreateIndex
CREATE INDEX "person_event_shard_1_state_region_id_idx" ON "api"."person_event_shard_1"("state_region_id");

-- CreateIndex
CREATE UNIQUE INDEX "person_event_shard_1_person_id_event_id_relationship_type_key" ON "api"."person_event_shard_1"("person_id", "event_id", "relationship_type");

-- CreateIndex
CREATE INDEX "business_event_shard_1_business_id_idx" ON "api"."business_event_shard_1"("business_id");

-- CreateIndex
CREATE INDEX "business_event_shard_1_event_id_idx" ON "api"."business_event_shard_1"("event_id");

-- CreateIndex
CREATE INDEX "business_event_shard_1_relationship_type_idx" ON "api"."business_event_shard_1"("relationship_type");

-- CreateIndex
CREATE INDEX "business_event_shard_1_state_region_id_idx" ON "api"."business_event_shard_1"("state_region_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_event_shard_1_business_id_event_id_relationship_ty_key" ON "api"."business_event_shard_1"("business_id", "event_id", "relationship_type");

-- CreateIndex
CREATE INDEX "government_event_shard_1_government_entity_id_idx" ON "api"."government_event_shard_1"("government_entity_id");

-- CreateIndex
CREATE INDEX "government_event_shard_1_event_id_idx" ON "api"."government_event_shard_1"("event_id");

-- CreateIndex
CREATE INDEX "government_event_shard_1_relationship_type_idx" ON "api"."government_event_shard_1"("relationship_type");

-- CreateIndex
CREATE INDEX "government_event_shard_1_state_region_id_idx" ON "api"."government_event_shard_1"("state_region_id");

-- CreateIndex
CREATE UNIQUE INDEX "government_event_shard_1_government_entity_id_event_id_rela_key" ON "api"."government_event_shard_1"("government_entity_id", "event_id", "relationship_type");

-- CreateIndex
CREATE INDEX "ngo_event_shard_1_ngo_id_idx" ON "api"."ngo_event_shard_1"("ngo_id");

-- CreateIndex
CREATE INDEX "ngo_event_shard_1_event_id_idx" ON "api"."ngo_event_shard_1"("event_id");

-- CreateIndex
CREATE INDEX "ngo_event_shard_1_relationship_type_idx" ON "api"."ngo_event_shard_1"("relationship_type");

-- CreateIndex
CREATE INDEX "ngo_event_shard_1_state_region_id_idx" ON "api"."ngo_event_shard_1"("state_region_id");

-- CreateIndex
CREATE UNIQUE INDEX "ngo_event_shard_1_ngo_id_event_id_relationship_type_key" ON "api"."ngo_event_shard_1"("ngo_id", "event_id", "relationship_type");

-- CreateIndex
CREATE INDEX "home_owner_association_location_id_idx" ON "api"."home_owner_association"("location_id");

-- CreateIndex
CREATE INDEX "home_owner_association_name_idx" ON "api"."home_owner_association"("name");

-- CreateIndex
CREATE INDEX "home_owner_association_date_established_idx" ON "api"."home_owner_association"("date_established");

-- CreateIndex
CREATE INDEX "hoa_board_members_hoa_id_idx" ON "api"."hoa_board_members"("hoa_id");

-- CreateIndex
CREATE INDEX "hoa_board_members_is_current_idx" ON "api"."hoa_board_members"("is_current");

-- CreateIndex
CREATE INDEX "hoa_board_members_position_idx" ON "api"."hoa_board_members"("position");

-- CreateIndex
CREATE INDEX "hoa_board_members_term_start_idx" ON "api"."hoa_board_members"("term_start");

-- CreateIndex
CREATE INDEX "hoa_board_members_term_end_idx" ON "api"."hoa_board_members"("term_end");

-- CreateIndex
CREATE INDEX "hoa_financial_records_hoa_id_idx" ON "api"."hoa_financial_records"("hoa_id");

-- CreateIndex
CREATE INDEX "hoa_financial_records_record_type_idx" ON "api"."hoa_financial_records"("record_type");

-- CreateIndex
CREATE INDEX "hoa_financial_records_effective_date_idx" ON "api"."hoa_financial_records"("effective_date");

-- CreateIndex
CREATE INDEX "hoa_financial_records_hoa_id_record_type_idx" ON "api"."hoa_financial_records"("hoa_id", "record_type");

-- CreateIndex
CREATE INDEX "hoa_financial_records_hoa_id_effective_date_idx" ON "api"."hoa_financial_records"("hoa_id", "effective_date");

-- CreateIndex
CREATE INDEX "hoa_invoices_hoa_id_idx" ON "api"."hoa_invoices"("hoa_id");

-- CreateIndex
CREATE INDEX "hoa_invoices_invoice_number_idx" ON "api"."hoa_invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "hoa_invoices_invoice_date_idx" ON "api"."hoa_invoices"("invoice_date");

-- CreateIndex
CREATE INDEX "hoa_invoices_due_date_idx" ON "api"."hoa_invoices"("due_date");

-- CreateIndex
CREATE INDEX "hoa_invoices_paid_date_idx" ON "api"."hoa_invoices"("paid_date");

-- CreateIndex
CREATE INDEX "hoa_invoices_vendor_name_idx" ON "api"."hoa_invoices"("vendor_name");

-- CreateIndex
CREATE INDEX "hoa_invoices_vendor_business_id_idx" ON "api"."hoa_invoices"("vendor_business_id");

-- CreateIndex
CREATE INDEX "hoa_invoices_financial_record_id_idx" ON "api"."hoa_invoices"("financial_record_id");

-- CreateIndex
CREATE INDEX "hoa_invoices_authorizing_board_member_id_idx" ON "api"."hoa_invoices"("authorizing_board_member_id");

-- CreateIndex
CREATE INDEX "hoa_invoices_authorizing_management_company_id_idx" ON "api"."hoa_invoices"("authorizing_management_company_id");

-- CreateIndex
CREATE INDEX "hoa_invoices_hoa_id_invoice_date_idx" ON "api"."hoa_invoices"("hoa_id", "invoice_date");

-- CreateIndex
CREATE INDEX "hoa_invoices_hoa_id_due_date_idx" ON "api"."hoa_invoices"("hoa_id", "due_date");

-- CreateIndex
CREATE INDEX "hoa_invoices_vendor_business_id_invoice_date_idx" ON "api"."hoa_invoices"("vendor_business_id", "invoice_date");

-- CreateIndex
CREATE UNIQUE INDEX "hoa_invoices_hoa_id_invoice_number_key" ON "api"."hoa_invoices"("hoa_id", "invoice_number");

-- CreateIndex
CREATE INDEX "hoa_fee_history_hoa_id_idx" ON "api"."hoa_fee_history"("hoa_id");

-- CreateIndex
CREATE INDEX "hoa_fee_history_fee_type_idx" ON "api"."hoa_fee_history"("fee_type");

-- CreateIndex
CREATE INDEX "hoa_fee_history_effective_date_idx" ON "api"."hoa_fee_history"("effective_date");

-- CreateIndex
CREATE INDEX "hoa_fee_history_amount_idx" ON "api"."hoa_fee_history"("amount");

-- CreateIndex
CREATE INDEX "hoa_governing_documents_hoa_id_idx" ON "api"."hoa_governing_documents"("hoa_id");

-- CreateIndex
CREATE INDEX "hoa_governing_documents_document_type_idx" ON "api"."hoa_governing_documents"("document_type");

-- CreateIndex
CREATE INDEX "hoa_governing_documents_effective_date_idx" ON "api"."hoa_governing_documents"("effective_date");

-- CreateIndex
CREATE INDEX "hoa_governing_documents_title_idx" ON "api"."hoa_governing_documents"("title");

-- CreateIndex
CREATE INDEX "hoa_amenities_hoa_id_idx" ON "api"."hoa_amenities"("hoa_id");

-- CreateIndex
CREATE INDEX "hoa_amenities_amenity_name_idx" ON "api"."hoa_amenities"("amenity_name");

-- CreateIndex
CREATE INDEX "hoa_legal_records_hoa_id_idx" ON "api"."hoa_legal_records"("hoa_id");

-- CreateIndex
CREATE INDEX "hoa_legal_records_record_type_idx" ON "api"."hoa_legal_records"("record_type");

-- CreateIndex
CREATE INDEX "hoa_legal_records_status_idx" ON "api"."hoa_legal_records"("status");

-- CreateIndex
CREATE INDEX "hoa_legal_records_date_filed_idx" ON "api"."hoa_legal_records"("date_filed");

-- CreateIndex
CREATE INDEX "hoa_legal_records_case_number_idx" ON "api"."hoa_legal_records"("case_number");

-- CreateIndex
CREATE INDEX "hoa_assessments_hoa_id_idx" ON "api"."hoa_assessments"("hoa_id");

-- CreateIndex
CREATE INDEX "hoa_assessments_assessment_type_idx" ON "api"."hoa_assessments"("assessment_type");

-- CreateIndex
CREATE INDEX "hoa_assessments_due_date_idx" ON "api"."hoa_assessments"("due_date");

-- CreateIndex
CREATE INDEX "hoa_assessments_amount_idx" ON "api"."hoa_assessments"("amount");

-- CreateIndex
CREATE INDEX "hoa_meetings_hoa_id_idx" ON "api"."hoa_meetings"("hoa_id");

-- CreateIndex
CREATE INDEX "hoa_meetings_meeting_type_idx" ON "api"."hoa_meetings"("meeting_type");

-- CreateIndex
CREATE INDEX "hoa_meetings_meeting_date_time_idx" ON "api"."hoa_meetings"("meeting_date_time");

-- CreateIndex
CREATE INDEX "hoa_management_company_hoa_id_idx" ON "api"."hoa_management_company"("hoa_id");

-- CreateIndex
CREATE INDEX "hoa_management_company_management_company_id_idx" ON "api"."hoa_management_company"("management_company_id");

-- CreateIndex
CREATE INDEX "hoa_management_company_is_active_idx" ON "api"."hoa_management_company"("is_active");

-- CreateIndex
CREATE INDEX "hoa_management_company_contract_start_date_idx" ON "api"."hoa_management_company"("contract_start_date");

-- CreateIndex
CREATE INDEX "hoa_management_company_contract_end_date_idx" ON "api"."hoa_management_company"("contract_end_date");

-- CreateIndex
CREATE INDEX "hoa_management_company_hoa_id_is_active_idx" ON "api"."hoa_management_company"("hoa_id", "is_active");

-- CreateIndex
CREATE INDEX "hoa_management_company_management_company_id_is_active_idx" ON "api"."hoa_management_company"("management_company_id", "is_active");

-- CreateIndex
CREATE INDEX "subdivision_hoa_id_idx" ON "api"."subdivision"("hoa_id");

-- CreateIndex
CREATE INDEX "subdivision_home_builder_id_idx" ON "api"."subdivision"("home_builder_id");

-- CreateIndex
CREATE INDEX "subdivision_name_idx" ON "api"."subdivision"("name");

-- CreateIndex
CREATE INDEX "subdivision_date_created_idx" ON "api"."subdivision"("date_created");

-- CreateIndex
CREATE INDEX "home_builder_location_id_idx" ON "api"."home_builder"("location_id");

-- CreateIndex
CREATE INDEX "home_builder_name_idx" ON "api"."home_builder"("name");

-- CreateIndex
CREATE INDEX "home_builder_date_formed_idx" ON "api"."home_builder"("date_formed");

-- CreateIndex
CREATE INDEX "realtor_user_id_idx" ON "api"."realtor"("user_id");

-- CreateIndex
CREATE INDEX "realtor_location_id_idx" ON "api"."realtor"("location_id");

-- CreateIndex
CREATE INDEX "realtor_realty_agency_idx" ON "api"."realtor"("realty_agency");

-- CreateIndex
CREATE INDEX "realtor_specialization_idx" ON "api"."realtor"("specialization");

-- CreateIndex
CREATE INDEX "smrcs_user_id_idx" ON "api"."smrcs"("user_id");

-- CreateIndex
CREATE INDEX "smrcs_state_city_idx" ON "api"."smrcs"("state", "city");

-- CreateIndex
CREATE INDEX "smrcs_agency_level_idx" ON "api"."smrcs"("agency_level");

-- CreateIndex
CREATE INDEX "smrcs_request_status_idx" ON "api"."smrcs"("request_status");

-- CreateIndex
CREATE INDEX "smrcs_service_received_date_idx" ON "api"."smrcs"("service_received_date");

-- CreateIndex
CREATE INDEX "smrcs_is_deleted_idx" ON "api"."smrcs"("is_deleted");

-- CreateIndex
CREATE INDEX "smrcs_created_at_idx" ON "api"."smrcs"("created_at");

-- CreateIndex
CREATE INDEX "data_types_identifier_idx" ON "api"."data_types"("identifier");

-- CreateIndex
CREATE INDEX "data_types_name_idx" ON "api"."data_types"("name");

-- CreateIndex
CREATE INDEX "data_types_marker_idx" ON "api"."data_types"("marker");

-- CreateIndex
CREATE UNIQUE INDEX "admin_roles_slug_key" ON "admin_roles"("slug");

-- CreateIndex
CREATE INDEX "admin_roles_slug_idx" ON "admin_roles"("slug");

-- CreateIndex
CREATE INDEX "admin_role_permissions_role_id_idx" ON "admin_role_permissions"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_role_permissions_role_id_permission_key" ON "admin_role_permissions"("role_id", "permission");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE INDEX "admins_role_id_idx" ON "admins"("role_id");

-- CreateIndex
CREATE INDEX "admins_email_idx" ON "admins"("email");

-- AddForeignKey
ALTER TABLE "api"."county" ADD CONSTRAINT "county_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "api"."state"("state_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."city" ADD CONSTRAINT "city_county_id_fkey" FOREIGN KEY ("county_id") REFERENCES "api"."county"("county_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."zip_code" ADD CONSTRAINT "zip_code_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "api"."city"("city_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."location_shard_1" ADD CONSTRAINT "location_shard_1_location_type_id_fkey" FOREIGN KEY ("location_type_id") REFERENCES "api"."location_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."location_shard_1" ADD CONSTRAINT "location_shard_1_zip_code_id_fkey" FOREIGN KEY ("zip_code_id") REFERENCES "api"."zip_code"("zip_code_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."location_shard_1" ADD CONSTRAINT "location_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."government_entity" ADD CONSTRAINT "government_entity_government_level_id_fkey" FOREIGN KEY ("government_level_id") REFERENCES "api"."government_level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."government_entity" ADD CONSTRAINT "government_entity_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "api"."state"("state_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."government_entity" ADD CONSTRAINT "government_entity_county_id_fkey" FOREIGN KEY ("county_id") REFERENCES "api"."county"("county_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."government_entity" ADD CONSTRAINT "government_entity_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "api"."city"("city_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."government_entity" ADD CONSTRAINT "government_entity_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "api"."location_shard_1"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."business" ADD CONSTRAINT "business_chief_executive_fkey" FOREIGN KEY ("chief_executive") REFERENCES "api"."person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."business" ADD CONSTRAINT "business_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "api"."location_shard_1"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."business" ADD CONSTRAINT "business_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "api"."state"("state_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."business" ADD CONSTRAINT "business_county_id_fkey" FOREIGN KEY ("county_id") REFERENCES "api"."county"("county_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."business" ADD CONSTRAINT "business_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "api"."city"("city_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."business" ADD CONSTRAINT "business_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."non_governmental_organization_shard_1" ADD CONSTRAINT "non_governmental_organization_shard_1_principal_officer_fkey" FOREIGN KEY ("principal_officer") REFERENCES "api"."person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."non_governmental_organization_shard_1" ADD CONSTRAINT "non_governmental_organization_shard_1_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "api"."location_shard_1"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."non_governmental_organization_shard_1" ADD CONSTRAINT "non_governmental_organization_shard_1_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "api"."state"("state_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."non_governmental_organization_shard_1" ADD CONSTRAINT "non_governmental_organization_shard_1_county_id_fkey" FOREIGN KEY ("county_id") REFERENCES "api"."county"("county_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."non_governmental_organization_shard_1" ADD CONSTRAINT "non_governmental_organization_shard_1_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "api"."city"("city_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."non_governmental_organization_shard_1" ADD CONSTRAINT "non_governmental_organization_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."state_review_shard_1" ADD CONSTRAINT "state_review_shard_1_government_entity_id_fkey" FOREIGN KEY ("government_entity_id") REFERENCES "api"."government_entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."state_review_shard_1" ADD CONSTRAINT "state_review_shard_1_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "api"."state"("state_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."state_review_shard_1" ADD CONSTRAINT "state_review_shard_1_review_type_id_fkey" FOREIGN KEY ("review_type_id") REFERENCES "api"."review_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."state_review_shard_1" ADD CONSTRAINT "state_review_shard_1_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "api"."status_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."state_review_shard_1" ADD CONSTRAINT "state_review_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."county_review_shard_1" ADD CONSTRAINT "county_review_shard_1_government_entity_id_fkey" FOREIGN KEY ("government_entity_id") REFERENCES "api"."government_entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."county_review_shard_1" ADD CONSTRAINT "county_review_shard_1_county_id_fkey" FOREIGN KEY ("county_id") REFERENCES "api"."county"("county_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."county_review_shard_1" ADD CONSTRAINT "county_review_shard_1_review_type_id_fkey" FOREIGN KEY ("review_type_id") REFERENCES "api"."review_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."county_review_shard_1" ADD CONSTRAINT "county_review_shard_1_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "api"."status_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."county_review_shard_1" ADD CONSTRAINT "county_review_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."city_review_shard_1" ADD CONSTRAINT "city_review_shard_1_government_entity_id_fkey" FOREIGN KEY ("government_entity_id") REFERENCES "api"."government_entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."city_review_shard_1" ADD CONSTRAINT "city_review_shard_1_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "api"."city"("city_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."city_review_shard_1" ADD CONSTRAINT "city_review_shard_1_review_type_id_fkey" FOREIGN KEY ("review_type_id") REFERENCES "api"."review_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."city_review_shard_1" ADD CONSTRAINT "city_review_shard_1_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "api"."status_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."city_review_shard_1" ADD CONSTRAINT "city_review_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."table_shard_registry" ADD CONSTRAINT "table_shard_registry_table_registry_id_fkey" FOREIGN KEY ("table_registry_id") REFERENCES "api"."table_registry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."table_shard_registry" ADD CONSTRAINT "table_shard_registry_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."statute" ADD CONSTRAINT "statute_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "api"."state"("state_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."punishment_crime" ADD CONSTRAINT "punishment_crime_punishment_id_fkey" FOREIGN KEY ("punishment_id") REFERENCES "api"."punishment"("punishment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."punishment_crime" ADD CONSTRAINT "punishment_crime_crime_id_fkey" FOREIGN KEY ("crime_id") REFERENCES "api"."crime"("crime_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."crime" ADD CONSTRAINT "crime_classification_id_fkey" FOREIGN KEY ("classification_id") REFERENCES "api"."classification"("classification_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."classification" ADD CONSTRAINT "classification_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "api"."state"("state_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."crime_statute" ADD CONSTRAINT "crime_statute_crime_id_fkey" FOREIGN KEY ("crime_id") REFERENCES "api"."crime"("crime_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."crime_statute" ADD CONSTRAINT "crime_statute_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "api"."state"("state_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."crime_report_incident_shard_1" ADD CONSTRAINT "crime_report_incident_shard_1_crime_id_fkey" FOREIGN KEY ("crime_id") REFERENCES "api"."crime"("crime_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."crime_report_incident_shard_1" ADD CONSTRAINT "crime_report_incident_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."population_history" ADD CONSTRAINT "population_history_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "api"."city"("city_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."education_data_shard_1" ADD CONSTRAINT "education_data_shard_1_education_level_id_fkey" FOREIGN KEY ("education_level_id") REFERENCES "api"."education_level"("level_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."education_data_shard_1" ADD CONSTRAINT "education_data_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."class_shard_1" ADD CONSTRAINT "class_shard_1_education_level_id_fkey" FOREIGN KEY ("education_level_id") REFERENCES "api"."education_level"("level_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."class_shard_1" ADD CONSTRAINT "class_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."class_enrollment_shard_1" ADD CONSTRAINT "class_enrollment_shard_1_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "api"."class_shard_1"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."class_enrollment_shard_1" ADD CONSTRAINT "class_enrollment_shard_1_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "api"."status_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."class_enrollment_shard_1" ADD CONSTRAINT "class_enrollment_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."teacher_credential_shard_1" ADD CONSTRAINT "teacher_credential_shard_1_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "api"."status_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."teacher_credential_shard_1" ADD CONSTRAINT "teacher_credential_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."grade_progression_shard_1" ADD CONSTRAINT "grade_progression_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."disciplinary_action_shard_1" ADD CONSTRAINT "disciplinary_action_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."employment_data_shard_1" ADD CONSTRAINT "employment_data_shard_1_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "api"."status_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."employment_data_shard_1" ADD CONSTRAINT "employment_data_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."business_license_shard_1" ADD CONSTRAINT "business_license_shard_1_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "api"."status_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."business_license_shard_1" ADD CONSTRAINT "business_license_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."housing_status_shard_1" ADD CONSTRAINT "housing_status_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."person_location_shard_1" ADD CONSTRAINT "person_location_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."organization_location_shard_1" ADD CONSTRAINT "organization_location_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."person_org_relationship_shard_1" ADD CONSTRAINT "person_org_relationship_shard_1_relationship_type_id_fkey" FOREIGN KEY ("relationship_type_id") REFERENCES "api"."relationship_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."person_org_relationship_shard_1" ADD CONSTRAINT "person_org_relationship_shard_1_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "api"."status_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."person_org_relationship_shard_1" ADD CONSTRAINT "person_org_relationship_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."offense_element" ADD CONSTRAINT "offense_element_element_id_fkey" FOREIGN KEY ("element_id") REFERENCES "api"."element"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."geographic_reference" ADD CONSTRAINT "geographic_reference_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "api"."geographic_reference"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."audit_log" ADD CONSTRAINT "audit_log_classification_id_fkey" FOREIGN KEY ("classification_id") REFERENCES "api"."data_classification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."audit_log" ADD CONSTRAINT "audit_log_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."acfr_report" ADD CONSTRAINT "acfr_report_government_entity_id_fkey" FOREIGN KEY ("government_entity_id") REFERENCES "api"."government_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."acfr_report" ADD CONSTRAINT "acfr_report_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."fiscal_data_shard_1" ADD CONSTRAINT "fiscal_data_shard_1_acfr_report_id_fkey" FOREIGN KEY ("acfr_report_id") REFERENCES "api"."acfr_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."fiscal_data_shard_1" ADD CONSTRAINT "fiscal_data_shard_1_fiscal_data_type_id_fkey" FOREIGN KEY ("fiscal_data_type_id") REFERENCES "api"."fiscal_data_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."fiscal_data_shard_1" ADD CONSTRAINT "fiscal_data_shard_1_fund_type_id_fkey" FOREIGN KEY ("fund_type_id") REFERENCES "api"."fund_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."fiscal_data_shard_1" ADD CONSTRAINT "fiscal_data_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."pension_plan" ADD CONSTRAINT "pension_plan_government_entity_id_fkey" FOREIGN KEY ("government_entity_id") REFERENCES "api"."government_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."pension_plan" ADD CONSTRAINT "pension_plan_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."pension_data_shard_1" ADD CONSTRAINT "pension_data_shard_1_pension_plan_id_fkey" FOREIGN KEY ("pension_plan_id") REFERENCES "api"."pension_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."pension_data_shard_1" ADD CONSTRAINT "pension_data_shard_1_acfr_report_id_fkey" FOREIGN KEY ("acfr_report_id") REFERENCES "api"."acfr_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."pension_data_shard_1" ADD CONSTRAINT "pension_data_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."opeb_data_shard_1" ADD CONSTRAINT "opeb_data_shard_1_government_entity_id_fkey" FOREIGN KEY ("government_entity_id") REFERENCES "api"."government_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."opeb_data_shard_1" ADD CONSTRAINT "opeb_data_shard_1_acfr_report_id_fkey" FOREIGN KEY ("acfr_report_id") REFERENCES "api"."acfr_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."opeb_data_shard_1" ADD CONSTRAINT "opeb_data_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."fiscal_health_score" ADD CONSTRAINT "fiscal_health_score_government_entity_id_fkey" FOREIGN KEY ("government_entity_id") REFERENCES "api"."government_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."fiscal_health_score" ADD CONSTRAINT "fiscal_health_score_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."event_shard_1" ADD CONSTRAINT "event_shard_1_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "api"."event_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."event_shard_1" ADD CONSTRAINT "event_shard_1_event_status_id_fkey" FOREIGN KEY ("event_status_id") REFERENCES "api"."status_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."event_shard_1" ADD CONSTRAINT "event_shard_1_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "api"."priority_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."event_shard_1" ADD CONSTRAINT "event_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."person_event_shard_1" ADD CONSTRAINT "person_event_shard_1_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "api"."person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."person_event_shard_1" ADD CONSTRAINT "person_event_shard_1_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "api"."event_shard_1"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."person_event_shard_1" ADD CONSTRAINT "person_event_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."business_event_shard_1" ADD CONSTRAINT "business_event_shard_1_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "api"."business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."business_event_shard_1" ADD CONSTRAINT "business_event_shard_1_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "api"."event_shard_1"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."business_event_shard_1" ADD CONSTRAINT "business_event_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."government_event_shard_1" ADD CONSTRAINT "government_event_shard_1_government_entity_id_fkey" FOREIGN KEY ("government_entity_id") REFERENCES "api"."government_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."government_event_shard_1" ADD CONSTRAINT "government_event_shard_1_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "api"."event_shard_1"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."government_event_shard_1" ADD CONSTRAINT "government_event_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."ngo_event_shard_1" ADD CONSTRAINT "ngo_event_shard_1_ngo_id_fkey" FOREIGN KEY ("ngo_id") REFERENCES "api"."non_governmental_organization_shard_1"("employer_identification_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."ngo_event_shard_1" ADD CONSTRAINT "ngo_event_shard_1_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "api"."event_shard_1"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."ngo_event_shard_1" ADD CONSTRAINT "ngo_event_shard_1_state_region_id_fkey" FOREIGN KEY ("state_region_id") REFERENCES "api"."state_region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."home_owner_association" ADD CONSTRAINT "home_owner_association_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "api"."location_shard_1"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."hoa_board_members" ADD CONSTRAINT "hoa_board_members_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "api"."home_owner_association"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."hoa_financial_records" ADD CONSTRAINT "hoa_financial_records_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "api"."home_owner_association"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."hoa_invoices" ADD CONSTRAINT "hoa_invoices_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "api"."home_owner_association"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."hoa_invoices" ADD CONSTRAINT "hoa_invoices_vendor_business_id_fkey" FOREIGN KEY ("vendor_business_id") REFERENCES "api"."business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."hoa_invoices" ADD CONSTRAINT "hoa_invoices_financial_record_id_fkey" FOREIGN KEY ("financial_record_id") REFERENCES "api"."hoa_financial_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."hoa_invoices" ADD CONSTRAINT "hoa_invoices_authorizing_board_member_id_fkey" FOREIGN KEY ("authorizing_board_member_id") REFERENCES "api"."hoa_board_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."hoa_invoices" ADD CONSTRAINT "hoa_invoices_authorizing_management_company_id_fkey" FOREIGN KEY ("authorizing_management_company_id") REFERENCES "api"."hoa_management_company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."hoa_fee_history" ADD CONSTRAINT "hoa_fee_history_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "api"."home_owner_association"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."hoa_governing_documents" ADD CONSTRAINT "hoa_governing_documents_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "api"."home_owner_association"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."hoa_amenities" ADD CONSTRAINT "hoa_amenities_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "api"."home_owner_association"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."hoa_legal_records" ADD CONSTRAINT "hoa_legal_records_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "api"."home_owner_association"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."hoa_assessments" ADD CONSTRAINT "hoa_assessments_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "api"."home_owner_association"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."hoa_meetings" ADD CONSTRAINT "hoa_meetings_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "api"."home_owner_association"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."hoa_management_company" ADD CONSTRAINT "hoa_management_company_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "api"."home_owner_association"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."hoa_management_company" ADD CONSTRAINT "hoa_management_company_management_company_id_fkey" FOREIGN KEY ("management_company_id") REFERENCES "api"."business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."subdivision" ADD CONSTRAINT "subdivision_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "api"."home_owner_association"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."subdivision" ADD CONSTRAINT "subdivision_home_builder_id_fkey" FOREIGN KEY ("home_builder_id") REFERENCES "api"."home_builder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."home_builder" ADD CONSTRAINT "home_builder_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "api"."location_shard_1"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."realtor" ADD CONSTRAINT "realtor_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "api"."location_shard_1"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."admin_role_permissions" ADD CONSTRAINT "admin_role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "admin_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."admins" ADD CONSTRAINT "admins_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "admin_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

