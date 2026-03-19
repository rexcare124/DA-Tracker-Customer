// RBCA Firebase React Hooks - Type-safe hooks for RBCA operations
import { useState, useEffect, useCallback } from 'react';
// Note: Replace with actual auth hook import path when available
// import { useAuth } from '../auth/useAuth';

// Temporary auth hook interface - replace with actual implementation
interface AuthUser {
  uid: string;
  email?: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  getIdToken: () => Promise<string | null>;
}

// Placeholder auth hook - replace with actual implementation
function useAuth(): UseAuthReturn {
  // This should be replaced with your actual auth implementation
  throw new Error('useAuth hook not implemented. Please implement authentication hook.');
}
import { rbcaFirebaseService } from './rbca-service';
import type {
  RBCARegistration,
  CreateRBCARegistration,
  UpdateRBCARegistration,
  RBCAStatus,
} from './index';
import type { ServiceResult } from './rbca-service';

// Hook state types
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface MutationState {
  loading: boolean;
  error: string | null;
}

/**
 * Hook to create a new RBCA registration
 */
export function useCreateRBCARegistration() {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
  });
  const { user, getIdToken } = useAuth();

  const createRegistration = useCallback(
    async (registrationData: CreateRBCARegistration): Promise<RBCARegistration | null> => {
      if (!user) {
        setState({ loading: false, error: 'User not authenticated' });
        return null;
      }

      setState({ loading: true, error: null });

      try {
        const token = await getIdToken();
        if (!token) {
          throw new Error('Failed to get authentication token');
        }

        const result = await rbcaFirebaseService.createRegistration(registrationData, token);

        if (result.success) {
          setState({ loading: false, error: null });
          return result.data;
        } else {
          setState({ loading: false, error: result.error });
          return null;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setState({ loading: false, error: errorMessage });
        return null;
      }
    },
    [user, getIdToken]
  );

  return {
    createRegistration,
    loading: state.loading,
    error: state.error,
  };
}

/**
 * Hook to get a specific RBCA registration
 */
export function useRBCARegistration(registrationId: string | null) {
  const [state, setState] = useState<AsyncState<RBCARegistration>>({
    data: null,
    loading: false,
    error: null,
  });
  const { user, getIdToken } = useAuth();

  const fetchRegistration = useCallback(async () => {
    if (!registrationId || !user) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      const result = await rbcaFirebaseService.getRegistration(registrationId, token);

      if (result.success) {
        setState({ data: result.data, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: result.error });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState({ data: null, loading: false, error: errorMessage });
    }
  }, [registrationId, user, getIdToken]);

  useEffect(() => {
    fetchRegistration();
  }, [fetchRegistration]);

  return {
    registration: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchRegistration,
  };
}

/**
 * Hook to get all registrations for the current user
 */
export function useUserRBCARegistrations() {
  const [state, setState] = useState<AsyncState<RBCARegistration[]>>({
    data: null,
    loading: false,
    error: null,
  });
  const { user, getIdToken } = useAuth();

  const fetchRegistrations = useCallback(async () => {
    if (!user) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      const result = await rbcaFirebaseService.getUserRegistrations(user.uid, token);

      if (result.success) {
        setState({ data: result.data, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: result.error });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState({ data: null, loading: false, error: errorMessage });
    }
  }, [user, getIdToken]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  return {
    registrations: state.data || [],
    loading: state.loading,
    error: state.error,
    refetch: fetchRegistrations,
  };
}

/**
 * Hook to update registration status (Admin only)
 */
export function useUpdateRBCARegistrationStatus() {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
  });
  const { user, getIdToken } = useAuth();

  const updateStatus = useCallback(
    async (
      registrationId: string,
      updateData: UpdateRBCARegistration
    ): Promise<RBCARegistration | null> => {
      if (!user) {
        setState({ loading: false, error: 'User not authenticated' });
        return null;
      }

      setState({ loading: true, error: null });

      try {
        const token = await getIdToken();
        if (!token) {
          throw new Error('Failed to get authentication token');
        }

        const result = await rbcaFirebaseService.updateRegistrationStatus(
          registrationId,
          updateData,
          token
        );

        if (result.success) {
          setState({ loading: false, error: null });
          return result.data;
        } else {
          setState({ loading: false, error: result.error });
          return null;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setState({ loading: false, error: errorMessage });
        return null;
      }
    },
    [user, getIdToken]
  );

  return {
    updateStatus,
    loading: state.loading,
    error: state.error,
  };
}

/**
 * Hook to get all registrations with optional status filter (Admin only)
 */
export function useAllRBCARegistrations(statusFilter?: RBCAStatus) {
  const [state, setState] = useState<AsyncState<RBCARegistration[]>>({
    data: null,
    loading: false,
    error: null,
  });
  const { user, getIdToken } = useAuth();

  const fetchAllRegistrations = useCallback(async () => {
    if (!user) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      const result = await rbcaFirebaseService.getAllRegistrations(token, statusFilter);

      if (result.success) {
        setState({ data: result.data, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: result.error });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState({ data: null, loading: false, error: errorMessage });
    }
  }, [user, getIdToken, statusFilter]);

  useEffect(() => {
    fetchAllRegistrations();
  }, [fetchAllRegistrations]);

  return {
    registrations: state.data || [],
    loading: state.loading,
    error: state.error,
    refetch: fetchAllRegistrations,
  };
}

/**
 * Hook to delete a registration (Admin only)
 */
export function useDeleteRBCARegistration() {
  const [state, setState] = useState<MutationState>({
    loading: false,
    error: null,
  });
  const { user, getIdToken } = useAuth();

  const deleteRegistration = useCallback(
    async (registrationId: string): Promise<boolean> => {
      if (!user) {
        setState({ loading: false, error: 'User not authenticated' });
        return false;
      }

      setState({ loading: true, error: null });

      try {
        const token = await getIdToken();
        if (!token) {
          throw new Error('Failed to get authentication token');
        }

        const result = await rbcaFirebaseService.deleteRegistration(registrationId, token);

        if (result.success) {
          setState({ loading: false, error: null });
          return true;
        } else {
          setState({ loading: false, error: result.error });
          return false;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setState({ loading: false, error: errorMessage });
        return false;
      }
    },
    [user, getIdToken]
  );

  return {
    deleteRegistration,
    loading: state.loading,
    error: state.error,
  };
}

// Export types for external use
export type {
  AsyncState,
  MutationState,
};
