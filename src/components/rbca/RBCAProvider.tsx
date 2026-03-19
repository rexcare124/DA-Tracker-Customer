// RBCA Context Provider - Global state management for RBCA operations
'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { RBCARegistration, RBCAStatus } from '@/lib/firebase/index';

// RBCA Context State
interface RBCAState {
  registrations: RBCARegistration[];
  currentRegistration: RBCARegistration | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: RBCAStatus;
    searchTerm?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

// RBCA Actions
type RBCAAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_REGISTRATIONS'; payload: RBCARegistration[] }
  | { type: 'SET_CURRENT_REGISTRATION'; payload: RBCARegistration | null }
  | { type: 'ADD_REGISTRATION'; payload: RBCARegistration }
  | { type: 'UPDATE_REGISTRATION'; payload: RBCARegistration }
  | { type: 'REMOVE_REGISTRATION'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<RBCAState['filters']> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: RBCAState = {
  registrations: [],
  currentRegistration: null,
  loading: false,
  error: null,
  filters: {},
};

// Reducer function
function rbcaReducer(state: RBCAState, action: RBCAAction): RBCAState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_REGISTRATIONS':
      return { ...state, registrations: action.payload, loading: false, error: null };
    
    case 'SET_CURRENT_REGISTRATION':
      return { ...state, currentRegistration: action.payload };
    
    case 'ADD_REGISTRATION':
      return {
        ...state,
        registrations: [action.payload, ...state.registrations],
        error: null,
      };
    
    case 'UPDATE_REGISTRATION':
      return {
        ...state,
        registrations: state.registrations.map(reg =>
          reg.id === action.payload.id ? action.payload : reg
        ),
        currentRegistration: state.currentRegistration?.id === action.payload.id
          ? action.payload
          : state.currentRegistration,
        error: null,
      };
    
    case 'REMOVE_REGISTRATION':
      return {
        ...state,
        registrations: state.registrations.filter(reg => reg.id !== action.payload),
        currentRegistration: state.currentRegistration?.id === action.payload
          ? null
          : state.currentRegistration,
        error: null,
      };
    
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    
    case 'CLEAR_FILTERS':
      return { ...state, filters: {} };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// Context interface
interface RBCAContextValue {
  state: RBCAState;
  actions: {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setRegistrations: (registrations: RBCARegistration[]) => void;
    setCurrentRegistration: (registration: RBCARegistration | null) => void;
    addRegistration: (registration: RBCARegistration) => void;
    updateRegistration: (registration: RBCARegistration) => void;
    removeRegistration: (id: string) => void;
    setFilters: (filters: Partial<RBCAState['filters']>) => void;
    clearFilters: () => void;
    resetState: () => void;
  };
}

// Create context
const RBCAContext = createContext<RBCAContextValue | undefined>(undefined);

// Provider component
interface RBCAProviderProps {
  children: React.ReactNode;
}

export function RBCAProvider({ children }: RBCAProviderProps) {
  const [state, dispatch] = useReducer(rbcaReducer, initialState);

  const actions = {
    setLoading: useCallback((loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    }, []),

    setError: useCallback((error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    }, []),

    setRegistrations: useCallback((registrations: RBCARegistration[]) => {
      dispatch({ type: 'SET_REGISTRATIONS', payload: registrations });
    }, []),

    setCurrentRegistration: useCallback((registration: RBCARegistration | null) => {
      dispatch({ type: 'SET_CURRENT_REGISTRATION', payload: registration });
    }, []),

    addRegistration: useCallback((registration: RBCARegistration) => {
      dispatch({ type: 'ADD_REGISTRATION', payload: registration });
    }, []),

    updateRegistration: useCallback((registration: RBCARegistration) => {
      dispatch({ type: 'UPDATE_REGISTRATION', payload: registration });
    }, []),

    removeRegistration: useCallback((id: string) => {
      dispatch({ type: 'REMOVE_REGISTRATION', payload: id });
    }, []),

    setFilters: useCallback((filters: Partial<RBCAState['filters']>) => {
      dispatch({ type: 'SET_FILTERS', payload: filters });
    }, []),

    clearFilters: useCallback(() => {
      dispatch({ type: 'CLEAR_FILTERS' });
    }, []),

    resetState: useCallback(() => {
      dispatch({ type: 'RESET_STATE' });
    }, []),
  };

  const contextValue: RBCAContextValue = {
    state,
    actions,
  };

  return (
    <RBCAContext.Provider value={contextValue}>
      {children}
    </RBCAContext.Provider>
  );
}

// Custom hook to use RBCA context
export function useRBCAContext() {
  const context = useContext(RBCAContext);
  if (context === undefined) {
    throw new Error('useRBCAContext must be used within an RBCAProvider');
  }
  return context;
}

// Alias for backward compatibility
export const useRBCA = useRBCAContext;

// Export types
export type { RBCAState, RBCAAction, RBCAContextValue, RBCAProviderProps };
