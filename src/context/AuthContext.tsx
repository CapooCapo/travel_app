import React, { createContext, useEffect, ReactNode, useCallback } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo';
import { apiRequest, setClerkTokenGetter } from '../api/apiClient';

/**
 * Clerk Token Cache implementation using Expo SecureStore
 */
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

interface AuthContextType {
  user: any; // User object from Clerk
  isSignedIn: boolean;
  isLoaded: boolean;
  isBackendSynced: boolean; // Tracks if backend /api/auth/sync is complete
  getToken: (options?: { template?: string }) => Promise<string | null>;
  signOut: () => Promise<void>;
  syncUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

/**
 * Inner component to utilize Clerk hooks
 */
const AuthProviderInner = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, isLoaded, getToken, signOut } = useAuth();
  const { user } = useUser();
  const [isBackendSynced, setIsBackendSynced] = React.useState(false);

  // Initialize global API interceptor with Clerk token getter
  useEffect(() => {
    if (isLoaded) {
      setClerkTokenGetter(getToken);
    }
  }, [isLoaded, getToken]);

  /**
   * Sync Flow: Automatically sync user profile to Spring Boot backend
   */
  const syncUser = useCallback(async () => {
    if (isSignedIn && user) {
      try {
        console.log('[AuthContext] Syncing user to backend...', user.primaryEmailAddress?.emailAddress);
        await apiRequest.syncUser();
        console.log('[AuthContext] User sync successful.');
        setIsBackendSynced(true);
      } catch (error: any) {
        console.error('[AuthContext] User sync failed:', error);
        
        // Handle 401 or 500 errors by logging out
        const status = error.response?.status;
        if (status === 401 || status === 500) {
          const apiMessage = error.response?.data?.message || "Backend synchronization failed. Please try again.";
          Alert.alert("Sync Error", apiMessage);
          await signOut();
        }
        
        setIsBackendSynced(false);
      }
    }
  }, [isSignedIn, user, signOut]);

  useEffect(() => {
    if (isSignedIn && user && !isBackendSynced) {
      syncUser();
    }
  }, [isSignedIn, user, syncUser, isBackendSynced]);

  // Reset sync status on sign out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setIsBackendSynced(false);
    }
  }, [isLoaded, isSignedIn]);

  return (
    <AuthContext.Provider value={{ user, isSignedIn, isLoaded, isBackendSynced, getToken, signOut, syncUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </ClerkProvider>
  );
};