import { useOAuth, useSignIn, useSignUp, useAuth } from '@clerk/clerk-expo';
import { useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { IAuthService } from './interfaces/IAuthService';
import { apiClient } from '../api/apiClient';

/**
 * Ensures the browser session is properly handled for OAuth
 */
WebBrowser.maybeCompleteAuthSession();

/**
 * Custom Hook: AuthService implementation for Clerk
 * This hook wraps Clerk's underlying hooks and exposes a clean IAuthService-like API.
 */
export const useAuthService = (): IAuthService => {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { signIn, setActive: setSignInActive, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: isSignUpLoaded } = useSignUp();
  const { signOut } = useAuth();

  /**
   * Google OAuth Flow
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        console.log('[AuthService] Google OAuth Success');
      }
    } catch (error) {
      console.error('[AuthService] Google OAuth Error:', error);
      throw error;
    }
  }, [startOAuthFlow]);

  /**
   * Email/Password Sign In
   */
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!isSignInLoaded) return;
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setSignInActive({ session: result.createdSessionId });
      } else {
        console.warn('[AuthService] Sign-in incomplete status:', result.status);
      }
    } catch (error) {
      console.error('[AuthService] Email Sign-in Error:', error);
      throw error;
    }
  }, [isSignInLoaded, signIn, setSignInActive]);

  /**
   * Email/Password Sign Up (Simplified for brevity)
   */
  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    if (!isSignUpLoaded) return;
    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
      });

      if (result.status === 'complete') {
        await setSignUpActive({ session: result.createdSessionId });
      } else {
        // Here we would normally handle email verification (OTP)
        console.warn('[AuthService] Sign-up incomplete status:', result.status);
      }
    } catch (error) {
      console.error('[AuthService] Email Sign-up Error:', error);
      throw error;
    }
  }, [isSignUpLoaded, signUp, setSignUpActive]);

  /**
   * Sync User data to Spring Boot (Internal utility called by effect)
   */
  const syncUserWithBackend = useCallback(async (payload: any) => {
    try {
      await apiClient.post('/api/auth/sync', payload);
    } catch (error) {
      console.error('[AuthService] Backend Sync Error:', error);
      throw error;
    }
  }, []);

  /**
   * Forgot Password flow with Clerk
   */
  const forgotPassword = useCallback(async (email: string) => {
    if (!isSignInLoaded) return;
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
    } catch (error) {
      console.error('[AuthService] ForgotPassword Error:', error);
      throw error;
    }
  }, [isSignInLoaded, signIn]);

  /**
   * Verify Reset Password OTP
   */
  const verifyOtp = useCallback(async (email: string, code: string) => {
    if (!isSignInLoaded) return;
    try {
      await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
      });
    } catch (error) {
      console.error('[AuthService] VerifyOtp Error:', error);
      throw error;
    }
  }, [isSignInLoaded, signIn]);

  /**
   * Reset Password with Clerk
   */
  const resetPassword = useCallback(async (email: string, code: string, password: string) => {
    if (!isSignInLoaded) return;
    try {
      const result = await signIn.resetPassword({
        password,
      });

      if (result.status === 'complete') {
        await setSignInActive({ session: result.createdSessionId });
      } else {
        console.warn('[AuthService] ResetPassword incomplete status:', result.status);
      }
    } catch (error) {
      console.error('[AuthService] ResetPassword Error:', error);
      throw error;
    }
  }, [isSignInLoaded, signIn, setSignInActive]);

  return {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    syncUserWithBackend,
    forgotPassword,
    verifyOtp,
    resetPassword,
  };
};
