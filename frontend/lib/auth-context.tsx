/**
 * Authentication Context and Hooks
 * 
 * This module provides:
 * - AuthContext for managing authentication state
 * - useAuth hook for accessing auth state and functions
 * - JWT token storage in localStorage
 * - Login, signup, and logout functionality
 * 
 * Requirements: 2.5 - Frontend SHALL store JWT token in browser storage
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, AuthResponse, UserDTO, ApiError } from './api';

/**
 * Authentication state interface
 */
interface AuthState {
  user: UserDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Authentication context interface
 */
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

/**
 * Create authentication context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Local storage key for JWT token
 */
const TOKEN_STORAGE_KEY = 'auth_token';

/**
 * Local storage key for user data
 */
const USER_STORAGE_KEY = 'auth_user';

/**
 * Authentication Provider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * 
 * Manages authentication state and provides auth functions to child components
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  /**
   * Initialize auth state from localStorage on mount
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (storedToken && storedUser) {
          const user = JSON.parse(storedUser) as UserDTO;
          
          // Set token in API client
          api.setToken(storedToken);

          setAuthState({
            user,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login function
   * 
   * Authenticates user with email and password, stores token and user data
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response: AuthResponse = await api.login(email, password);
      
      // Store token and user in localStorage
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));

      // Set token in API client
      api.setToken(response.token);

      // Update auth state
      setAuthState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // Re-throw error for component to handle
      throw error as ApiError;
    }
  };

  /**
   * Signup function
   * 
   * Registers new user and automatically logs them in
   */
  const signup = async (email: string, password: string, name?: string): Promise<void> => {
    try {
      const response: AuthResponse = await api.signup(email, password, name);
      
      // Store token and user in localStorage
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));

      // Set token in API client
      api.setToken(response.token);

      // Update auth state
      setAuthState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // Re-throw error for component to handle
      throw error as ApiError;
    }
  };

  /**
   * Logout function
   * 
   * Clears authentication state and removes stored data
   */
  const logout = (): void => {
    // Clear localStorage
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);

    // Clear token in API client
    api.setToken(null);

    // Update auth state
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Hook
 * 
 * Custom hook to access authentication context
 * 
 * @throws Error if used outside of AuthProvider
 * @returns Authentication context with state and functions
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *   
 *   if (!isAuthenticated) {
 *     return <LoginForm onSubmit={login} />;
 *   }
 *   
 *   return <div>Welcome, {user?.email}!</div>;
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Export types for use in other components
 */
export type { AuthState, AuthContextType, UserDTO };
