import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom Hook chuyên biệt để truy cập trạng thái Authentication
 * Tuân thủ Separation of Concerns (SoC) trong Clean Architecture
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
