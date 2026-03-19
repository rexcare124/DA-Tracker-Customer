// RBCA Firebase Service Layer - Production-ready service for RBCA registration operations
import { ref, push, set, get, update, query, orderByChild, equalTo, type DatabaseReference } from 'firebase/database';
import { database } from './config';
import { getAdminDatabase, verifyUserToken, isUserAdmin } from './admin';
import type {
  RBCARegistration,
  CreateRBCARegistration,
  UpdateRBCARegistration,
  RBCAStatus,
  FIREBASE_PATHS,
} from './index';
import { 
  FIREBASE_PATHS as PATHS,
  RBCA_VALIDATION,
  isValidRBCAStatus,
  isValidOwnershipPercentage,
  isValidYearsInBusiness,
} from './index';

// Service response types
interface ServiceResponse<T> {
  success: true;
  data: T;
}

interface ServiceError {
  success: false;
  error: string;
  code?: string;
}

type ServiceResult<T> = ServiceResponse<T> | ServiceError;

// Validation error details
interface ValidationError {
  field: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * RBCA Firebase Service - Handles all RBCA registration operations with Firebase Realtime Database
 * Provides type-safe, validated operations with comprehensive error handling
 */
export class RBCAFirebaseService {
  private readonly registrationsPath = PATHS.RBCA_REGISTRATIONS;

  /**
   * Create a new RBCA registration (Client-side)
   */
  async createRegistration(
    registrationData: CreateRBCARegistration,
    userToken: string
  ): Promise<ServiceResult<RBCARegistration>> {
    try {
      // Validate input data
      const validation = this.validateRegistrationData(registrationData);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.map(e => e.message).join(', ')}`,
          code: 'VALIDATION_ERROR',
        };
      }

      // Verify user authentication
      const tokenResult = await verifyUserToken(userToken);
      if (!tokenResult.success) {
        return {
          success: false,
          error: 'Authentication failed',
          code: 'AUTH_ERROR',
        };
      }

      // Ensure user can only create registrations for themselves
      if (registrationData.userId !== tokenResult.uid) {
        return {
          success: false,
          error: 'Cannot create registration for another user',
          code: 'AUTHORIZATION_ERROR',
        };
      }

      // Create registration with Firebase push (auto-generated key)
      const registrationsRef = ref(database, this.registrationsPath);
      const newRegistrationRef = push(registrationsRef);
      
      if (!newRegistrationRef.key) {
        return {
          success: false,
          error: 'Failed to generate registration ID',
          code: 'DATABASE_ERROR',
        };
      }

      const now = new Date().toISOString();
      const registration: RBCARegistration = {
        id: newRegistrationRef.key,
        ...registrationData,
        status: 'pending',
        submittedAt: now,
        updatedAt: now,
      };

      await set(newRegistrationRef, registration);

      return {
        success: true,
        data: registration,
      };
    } catch (error) {
      console.error('Failed to create RBCA registration:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  /**
   * Get a specific RBCA registration by ID (Client-side)
   */
  async getRegistration(
    registrationId: string,
    userToken: string
  ): Promise<ServiceResult<RBCARegistration>> {
    try {
      if (!registrationId || typeof registrationId !== 'string') {
        return {
          success: false,
          error: 'Invalid registration ID',
          code: 'VALIDATION_ERROR',
        };
      }

      // Verify user authentication
      const tokenResult = await verifyUserToken(userToken);
      if (!tokenResult.success) {
        return {
          success: false,
          error: 'Authentication failed',
          code: 'AUTH_ERROR',
        };
      }

      const registrationRef = ref(database, `${this.registrationsPath}/${registrationId}`);
      const snapshot = await get(registrationRef);

      if (!snapshot.exists()) {
        return {
          success: false,
          error: 'Registration not found',
          code: 'NOT_FOUND',
        };
      }

      const registration = snapshot.val() as RBCARegistration;

      // Check if user can access this registration (own registration or admin)
      const isAdmin = await isUserAdmin(tokenResult.uid);
      if (registration.userId !== tokenResult.uid && !isAdmin) {
        return {
          success: false,
          error: 'Access denied',
          code: 'AUTHORIZATION_ERROR',
        };
      }

      return {
        success: true,
        data: registration,
      };
    } catch (error) {
      console.error('Failed to get RBCA registration:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  /**
   * Get all registrations for a specific user (Client-side)
   */
  async getUserRegistrations(
    userId: string,
    userToken: string
  ): Promise<ServiceResult<RBCARegistration[]>> {
    try {
      // Verify user authentication
      const tokenResult = await verifyUserToken(userToken);
      if (!tokenResult.success) {
        return {
          success: false,
          error: 'Authentication failed',
          code: 'AUTH_ERROR',
        };
      }

      // Check if user can access these registrations (own registrations or admin)
      const isAdmin = await isUserAdmin(tokenResult.uid);
      if (userId !== tokenResult.uid && !isAdmin) {
        return {
          success: false,
          error: 'Access denied',
          code: 'AUTHORIZATION_ERROR',
        };
      }

      const registrationsRef = ref(database, this.registrationsPath);
      const userQuery = query(registrationsRef, orderByChild('userId'), equalTo(userId));
      const snapshot = await get(userQuery);

      if (!snapshot.exists()) {
        return {
          success: true,
          data: [],
        };
      }

      const registrations: RBCARegistration[] = [];
      snapshot.forEach((childSnapshot) => {
        const registration = childSnapshot.val() as RBCARegistration;
        registrations.push(registration);
      });

      // Sort by submission date (newest first)
      registrations.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

      return {
        success: true,
        data: registrations,
      };
    } catch (error) {
      console.error('Failed to get user registrations:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  /**
   * Update registration status (Admin-only, server-side)
   */
  async updateRegistrationStatus(
    registrationId: string,
    updateData: UpdateRBCARegistration,
    adminToken: string
  ): Promise<ServiceResult<RBCARegistration>> {
    try {
      // Verify admin authentication
      const tokenResult = await verifyUserToken(adminToken);
      if (!tokenResult.success) {
        return {
          success: false,
          error: 'Authentication failed',
          code: 'AUTH_ERROR',
        };
      }

      const isAdmin = await isUserAdmin(tokenResult.uid);
      if (!isAdmin) {
        return {
          success: false,
          error: 'Admin access required',
          code: 'AUTHORIZATION_ERROR',
        };
      }

      // Validate status if provided
      if (updateData.status && !isValidRBCAStatus(updateData.status)) {
        return {
          success: false,
          error: 'Invalid status value',
          code: 'VALIDATION_ERROR',
        };
      }

      // Get current registration
      const adminDb = getAdminDatabase();
      const registrationRef = adminDb.ref(`${this.registrationsPath}/${registrationId}`);
      const snapshot = await registrationRef.once('value');

      if (!snapshot.exists()) {
        return {
          success: false,
          error: 'Registration not found',
          code: 'NOT_FOUND',
        };
      }

      const currentRegistration = snapshot.val() as RBCARegistration;

      // Prepare update data (cast to any to bypass readonly restrictions for database updates)
      const updates: any = {
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      // Add review information if status is being changed
      if (updateData.status && updateData.status !== currentRegistration.status) {
        updates.reviewedBy = tokenResult.uid;
        updates.reviewedAt = new Date().toISOString();
      }

      // Apply updates
      await registrationRef.update(updates);

      // Get updated registration
      const updatedSnapshot = await registrationRef.once('value');
      const updatedRegistration = updatedSnapshot.val() as RBCARegistration;

      return {
        success: true,
        data: updatedRegistration,
      };
    } catch (error) {
      console.error('Failed to update registration status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  /**
   * Get all registrations with optional status filter (Admin-only)
   */
  async getAllRegistrations(
    adminToken: string,
    statusFilter?: RBCAStatus
  ): Promise<ServiceResult<RBCARegistration[]>> {
    try {
      // Verify admin authentication
      const tokenResult = await verifyUserToken(adminToken);
      if (!tokenResult.success) {
        return {
          success: false,
          error: 'Authentication failed',
          code: 'AUTH_ERROR',
        };
      }

      const isAdmin = await isUserAdmin(tokenResult.uid);
      if (!isAdmin) {
        return {
          success: false,
          error: 'Admin access required',
          code: 'AUTHORIZATION_ERROR',
        };
      }

      const adminDb = getAdminDatabase();
      const registrationsRef = adminDb.ref(this.registrationsPath);
      let snapshot;

      // Apply status filter if provided
      if (statusFilter) {
        if (!isValidRBCAStatus(statusFilter)) {
          return {
            success: false,
            error: 'Invalid status filter',
            code: 'VALIDATION_ERROR',
          };
        }
        const queryRef = registrationsRef.orderByChild('status').equalTo(statusFilter);
        snapshot = await queryRef.once('value');
      } else {
        snapshot = await registrationsRef.once('value');
      }

      if (!snapshot.exists()) {
        return {
          success: true,
          data: [],
        };
      }

      const registrations: RBCARegistration[] = [];
      snapshot.forEach((childSnapshot) => {
        const registration = childSnapshot.val() as RBCARegistration;
        registrations.push(registration);
      });

      // Sort by submission date (newest first)
      registrations.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

      return {
        success: true,
        data: registrations,
      };
    } catch (error) {
      console.error('Failed to get all registrations:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  /**
   * Delete a registration (Admin-only)
   */
  async deleteRegistration(
    registrationId: string,
    adminToken: string
  ): Promise<ServiceResult<void>> {
    try {
      // Verify admin authentication
      const tokenResult = await verifyUserToken(adminToken);
      if (!tokenResult.success) {
        return {
          success: false,
          error: 'Authentication failed',
          code: 'AUTH_ERROR',
        };
      }

      const isAdmin = await isUserAdmin(tokenResult.uid);
      if (!isAdmin) {
        return {
          success: false,
          error: 'Admin access required',
          code: 'AUTHORIZATION_ERROR',
        };
      }

      const adminDb = getAdminDatabase();
      const registrationRef = adminDb.ref(`${this.registrationsPath}/${registrationId}`);
      const snapshot = await registrationRef.once('value');

      if (!snapshot.exists()) {
        return {
          success: false,
          error: 'Registration not found',
          code: 'NOT_FOUND',
        };
      }

      await registrationRef.remove();

      return {
        success: true,
        data: undefined,
      };
    } catch (error) {
      console.error('Failed to delete registration:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  /**
   * Validate registration data
   */
  private validateRegistrationData(data: CreateRBCARegistration): ValidationResult {
    const errors: ValidationError[] = [];

    // Check required fields
    for (const field of RBCA_VALIDATION.REQUIRED_FIELDS) {
      if (!data[field as keyof CreateRBCARegistration]) {
        errors.push({
          field,
          message: `${field} is required`,
        });
      }
    }

    // Validate email format
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push({
        field: 'email',
        message: 'Invalid email format',
      });
    }

    // Validate ownership percentage
    if (data.ownershipPercentage !== undefined && !isValidOwnershipPercentage(data.ownershipPercentage)) {
      errors.push({
        field: 'ownershipPercentage',
        message: `Ownership percentage must be between ${RBCA_VALIDATION.MIN_OWNERSHIP_PERCENTAGE} and ${RBCA_VALIDATION.MAX_OWNERSHIP_PERCENTAGE}`,
      });
    }

    // Validate years in business
    if (data.yearsInBusiness !== undefined && !isValidYearsInBusiness(data.yearsInBusiness)) {
      errors.push({
        field: 'yearsInBusiness',
        message: `Years in business must be between ${RBCA_VALIDATION.MIN_YEARS_IN_BUSINESS} and ${RBCA_VALIDATION.MAX_YEARS_IN_BUSINESS}`,
      });
    }

    // Validate certification types array
    if (data.certificationTypes && (!Array.isArray(data.certificationTypes) || data.certificationTypes.length === 0)) {
      errors.push({
        field: 'certificationTypes',
        message: 'At least one certification type is required',
      });
    }

    // Validate phone number format (basic validation)
    if (data.businessPhone && !/^\+?[\d\s\-\(\)]{10,}$/.test(data.businessPhone)) {
      errors.push({
        field: 'businessPhone',
        message: 'Invalid phone number format',
      });
    }

    // Validate ZIP code format (US format)
    if (data.businessZip && !/^\d{5}(-\d{4})?$/.test(data.businessZip)) {
      errors.push({
        field: 'businessZip',
        message: 'Invalid ZIP code format (use XXXXX or XXXXX-XXXX)',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const rbcaFirebaseService = new RBCAFirebaseService();

// Export types for external use
export type {
  ServiceResult,
  ServiceResponse,
  ServiceError,
  ValidationError,
  ValidationResult,
};
