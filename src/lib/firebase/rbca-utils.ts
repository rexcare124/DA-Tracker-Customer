// RBCA Firebase Utilities - Helper functions and constants for RBCA operations
import type { RBCARegistration, RBCAStatus, CreateRBCARegistration } from './index';

/**
 * Status display configurations
 */
export const RBCA_STATUS_CONFIG = {
  pending: {
    label: 'Pending Review',
    color: 'yellow',
    description: 'Application submitted and awaiting review',
    icon: '⏳',
  },
  under_review: {
    label: 'Under Review',
    color: 'blue',
    description: 'Application is currently being reviewed',
    icon: '🔍',
  },
  approved: {
    label: 'Approved',
    color: 'green',
    description: 'Application has been approved',
    icon: '✅',
  },
  rejected: {
    label: 'Rejected',
    color: 'red',
    description: 'Application has been rejected',
    icon: '❌',
  },
} as const;

/**
 * Business type options
 */
export const BUSINESS_TYPES = [
  'Sole Proprietorship',
  'Partnership',
  'Limited Liability Company (LLC)',
  'Corporation (C-Corp)',
  'S Corporation (S-Corp)',
  'Non-Profit Organization',
  'Other',
] as const;

/**
 * Annual revenue ranges
 */
export const ANNUAL_REVENUE_RANGES = [
  'Under $100,000',
  '$100,000 - $500,000',
  '$500,000 - $1,000,000',
  '$1,000,000 - $5,000,000',
  '$5,000,000 - $10,000,000',
  'Over $10,000,000',
] as const;

/**
 * Number of employees ranges
 */
export const EMPLOYEE_COUNT_RANGES = [
  '1-5 employees',
  '6-10 employees',
  '11-25 employees',
  '26-50 employees',
  '51-100 employees',
  '101-500 employees',
  'Over 500 employees',
] as const;

/**
 * Certification types
 */
export const CERTIFICATION_TYPES = [
  'Minority Business Enterprise (MBE)',
  'Women Business Enterprise (WBE)',
  'Disadvantaged Business Enterprise (DBE)',
  'Small Disadvantaged Business (SDB)',
  'HUBZone Certified',
  'Veteran-Owned Small Business (VOSB)',
  'Service-Disabled Veteran-Owned Small Business (SDVOSB)',
  'LGBTQ+ Business Enterprise (LGBTBE)',
  '8(a) Business Development Program',
  'Other',
] as const;

/**
 * US States list
 */
export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
] as const;

/**
 * Minority status options
 */
export const MINORITY_STATUS_OPTIONS = [
  'African American',
  'Hispanic American',
  'Native American',
  'Asian American',
  'Pacific Islander',
  'Other',
  'Not Applicable',
] as const;

/**
 * Get status configuration for display
 */
export function getStatusConfig(status: RBCAStatus) {
  return RBCA_STATUS_CONFIG[status];
}

/**
 * Format registration for display
 */
export function formatRegistrationForDisplay(registration: RBCARegistration) {
  const statusConfig = getStatusConfig(registration.status);
  
  return {
    ...registration,
    statusDisplay: statusConfig,
    formattedSubmissionDate: new Date(registration.submittedAt).toLocaleDateString(),
    formattedUpdateDate: new Date(registration.updatedAt).toLocaleDateString(),
    formattedReviewDate: registration.reviewedAt 
      ? new Date(registration.reviewedAt).toLocaleDateString() 
      : null,
  };
}

/**
 * RBCA Statistics interface
 */
export interface RBCAStats {
  total: number;
  pending: number;
  under_review: number;
  approved: number;
  rejected: number;
  womanOwned: number;
  veteranOwned: number;
  minorityOwned: number;
  hubzoneEligible: number;
}

/**
 * Get registration summary statistics
 */
export function getRegistrationStats(registrations: RBCARegistration[]): RBCAStats {
  const stats: RBCAStats = {
    total: registrations.length,
    pending: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
    womanOwned: 0,
    veteranOwned: 0,
    minorityOwned: 0,
    hubzoneEligible: 0,
  };

  registrations.forEach(reg => {
    stats[reg.status]++;
    if (reg.womanOwned) stats.womanOwned++;
    if (reg.veteranOwned) stats.veteranOwned++;
    if (reg.minorityStatus && reg.minorityStatus !== 'Not Applicable') stats.minorityOwned++;
    if (reg.hubzoneEligible) stats.hubzoneEligible++;
  });

  return stats;
}

/**
 * Filter registrations by various criteria
 */
export function filterRegistrations(
  registrations: RBCARegistration[],
  filters: {
    status?: RBCAStatus;
    womanOwned?: boolean;
    veteranOwned?: boolean;
    minorityOwned?: boolean;
    hubzoneEligible?: boolean;
    searchTerm?: string;
  }
) {
  return registrations.filter(reg => {
    // Status filter
    if (filters.status && reg.status !== filters.status) {
      return false;
    }

    // Ownership filters
    if (filters.womanOwned !== undefined && reg.womanOwned !== filters.womanOwned) {
      return false;
    }

    if (filters.veteranOwned !== undefined && reg.veteranOwned !== filters.veteranOwned) {
      return false;
    }

    if (filters.minorityOwned !== undefined) {
      const isMinorityOwned = reg.minorityStatus && reg.minorityStatus !== 'Not Applicable';
      if (isMinorityOwned !== filters.minorityOwned) {
        return false;
      }
    }

    if (filters.hubzoneEligible !== undefined && reg.hubzoneEligible !== filters.hubzoneEligible) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const searchableFields = [
        reg.businessName,
        reg.firstName,
        reg.lastName,
        reg.email,
        reg.businessType,
        reg.businessCity,
        reg.businessState,
      ];

      const matches = searchableFields.some(field => 
        field?.toLowerCase().includes(searchLower)
      );

      if (!matches) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort registrations by various criteria
 */
export function sortRegistrations(
  registrations: RBCARegistration[],
  sortBy: 'submittedAt' | 'updatedAt' | 'businessName' | 'status',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  return [...registrations].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'submittedAt':
      case 'updatedAt':
        comparison = new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime();
        break;
      case 'businessName':
        comparison = a.businessName.localeCompare(b.businessName);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

/**
 * Validate required fields for registration
 */
export function validateRequiredFields(data: Partial<CreateRBCARegistration>): string[] {
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'businessName',
    'businessType',
    'businessAddress',
    'businessCity',
    'businessState',
    'businessZip',
    'businessPhone',
    'businessDescription',
    'ownershipPercentage',
    'yearsInBusiness',
    'annualRevenue',
    'numberOfEmployees',
    'certificationTypes',
  ];

  const missingFields: string[] = [];

  requiredFields.forEach(field => {
    const value = data[field as keyof CreateRBCARegistration];
    if (value === undefined || value === null || value === '' || 
        (Array.isArray(value) && value.length === 0)) {
      missingFields.push(field);
    }
  });

  return missingFields;
}

/**
 * Generate registration summary text
 */
export function generateRegistrationSummary(registration: RBCARegistration): string {
  const certifications = registration.certificationTypes.join(', ');
  const ownershipTypes: string[] = [];
  
  if (registration.womanOwned) ownershipTypes.push('Woman-Owned');
  if (registration.veteranOwned) ownershipTypes.push('Veteran-Owned');
  if (registration.disabilityOwned) ownershipTypes.push('Disability-Owned');
  if (registration.lgbtqOwned) ownershipTypes.push('LGBTQ+-Owned');
  if (registration.hubzoneEligible) ownershipTypes.push('HUBZone Eligible');
  if (registration.minorityStatus && registration.minorityStatus !== 'Not Applicable') {
    ownershipTypes.push(`Minority-Owned (${registration.minorityStatus})`);
  }

  const ownershipText = ownershipTypes.length > 0 ? ownershipTypes.join(', ') : 'None specified';

  return `${registration.businessName} - ${registration.businessType} located in ${registration.businessCity}, ${registration.businessState}. ${registration.ownershipPercentage}% ownership, ${registration.yearsInBusiness} years in business. Certifications: ${certifications}. Ownership types: ${ownershipText}.`;
}

/**
 * Export registration data to CSV format
 */
export function exportRegistrationsToCSV(registrations: RBCARegistration[]): string {
  const headers = [
    'ID',
    'Business Name',
    'Owner Name',
    'Email',
    'Business Type',
    'Address',
    'City',
    'State',
    'ZIP',
    'Phone',
    'Website',
    'Description',
    'Ownership %',
    'Years in Business',
    'Annual Revenue',
    'Employees',
    'Certifications',
    'Minority Status',
    'Woman Owned',
    'Veteran Owned',
    'Disability Owned',
    'LGBTQ Owned',
    'HUBZone Eligible',
    'Status',
    'Submitted At',
    'Updated At',
    'Reviewed By',
    'Reviewed At',
    'Rejection Reason',
  ];

  const csvRows = [headers.join(',')];

  registrations.forEach(reg => {
    const row = [
      reg.id,
      `"${reg.businessName}"`,
      `"${reg.firstName} ${reg.lastName}"`,
      reg.email,
      `"${reg.businessType}"`,
      `"${reg.businessAddress}"`,
      reg.businessCity,
      reg.businessState,
      reg.businessZip,
      reg.businessPhone,
      reg.businessWebsite || '',
      `"${reg.businessDescription.replace(/"/g, '""')}"`,
      reg.ownershipPercentage,
      reg.yearsInBusiness,
      `"${reg.annualRevenue}"`,
      `"${reg.numberOfEmployees}"`,
      `"${reg.certificationTypes.join('; ')}"`,
      reg.minorityStatus || '',
      reg.womanOwned,
      reg.veteranOwned,
      reg.disabilityOwned,
      reg.lgbtqOwned,
      reg.hubzoneEligible,
      reg.status,
      reg.submittedAt,
      reg.updatedAt,
      reg.reviewedBy || '',
      reg.reviewedAt || '',
      reg.rejectionReason ? `"${reg.rejectionReason.replace(/"/g, '""')}"` : '',
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}

// Export all constants and types
export type {
  RBCARegistration,
  RBCAStatus,
  CreateRBCARegistration,
};

export type BusinessType = typeof BUSINESS_TYPES[number];
export type AnnualRevenueRange = typeof ANNUAL_REVENUE_RANGES[number];
export type EmployeeCountRange = typeof EMPLOYEE_COUNT_RANGES[number];
export type CertificationType = typeof CERTIFICATION_TYPES[number];
export type USState = typeof US_STATES[number];
export type MinorityStatus = typeof MINORITY_STATUS_OPTIONS[number];
