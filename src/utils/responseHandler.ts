import { Res } from "../dto/format";

/**
 * Unwraps the standardized Res<T> object to get the data payload.
 * Handles both "success" status string and 2xx status codes.
 */
export const unwrapResponse = <T>(res: Res<T>): T => {
  if (!res) throw new Error("API Response is empty");
  
  // Kiểm tra status từ BE (String "success" hoặc Number 200)
  const isSuccess = res.status === "success" || 
                    res.status === "SUCCESS" || 
                    res.status === 200 || 
                    res.status === 201;

  if (isSuccess) {
    return res.data;
  }

  throw new Error(res.message || "Action failed");
};

/**
 * Safe navigation for potentially nested messages in Axios error or plain objects
 */
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  
  // Case 1: Backend error in Res format
  if (error?.message && error?.status) return error.message;

  // Case 2: Axios error response
  if (error?.response?.data?.message) return error.response.data.message;
  
  // Case 3: Standard Error object
  return error?.message || "An unknown error occurred";
};
