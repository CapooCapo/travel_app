import React, { createContext, useEffect, ReactNode, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo';
import { apiClient, setClerkTokenGetter } from '../api/apiClient';

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
  getToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

/**
 * Inner component to utilize Clerk hooks
 */
const AuthProviderInner = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, isLoaded, getToken, signOut } = useAuth();
  const { user } = useUser();

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
        const payload = {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        };

        console.log('[AuthContext] Syncing user to backend...', payload.email);
        await apiClient.post('/api/auth/sync', payload);
        console.log('[AuthContext] User sync successful.');
      } catch (error) {
        console.error('[AuthContext] User sync failed:', error);
      }
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    if (isSignedIn && user) {
      syncUser();
    }
  }, [isSignedIn, user, syncUser]);

  return (
    <AuthContext.Provider value={{ user, isSignedIn, isLoaded, getToken, signOut }}>
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