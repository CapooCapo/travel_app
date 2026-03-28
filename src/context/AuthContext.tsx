import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { authStorage } from '../storage/auth.storage'; // Trỏ đúng đường dẫn của bạn

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  setHasCustomToken: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded: isClerkLoaded } = useAuth();
  const [hasCustomToken, setHasCustomToken] = useState<boolean>(false);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  // Kiểm tra token nội bộ khi mở app
  useEffect(() => {
    const checkToken = async () => {
      // Giả sử authStorage của bạn có hàm getToken()
      const token = await authStorage.getToken();
      if (token) setHasCustomToken(true);
      setIsStorageLoaded(true);
    };
    checkToken();
  }, []);

  // User được tính là đã đăng nhập nếu Clerk OK HOẶC có token nội bộ
  const isAuthenticated = isSignedIn || hasCustomToken;
  const isLoading = !isClerkLoaded || !isStorageLoaded;

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, setHasCustomToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAppAuth = () => useContext(AuthContext);
