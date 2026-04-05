export interface IAuthService {
  /**
   * Đăng nhập bằng Google OAuth thông qua Clerk
   */
  signInWithGoogle(): Promise<void>;

  /**
   * Đăng nhập bằng Email/Password qua Clerk
   */
  signInWithEmail(email: string, password: string): Promise<void>;

  /**
   * Đăng ký tài khoản mới qua Clerk
   */
  signUpWithEmail(email: string, password: string): Promise<void>;

  /**
   * Đăng xuất khỏi hệ thống
   */
  signOut(): Promise<void>;

  /**
   * Đồng bộ dữ liệu người dùng từ Clerk về Backend Spring Boot
   */
  syncUserWithBackend(): Promise<void>;
  /**
   * Yêu cầu mã khôi phục mật khẩu (ForgotPassword)
   */
  forgotPassword(email: string): Promise<void>;

  /**
   * Xác thực mã OTP gửi qua email
   */
  verifyOtp(email: string, code: string): Promise<void>;

  /**
   * Đổi mật khẩu mới sau khi xác thực OTP
   */
  resetPassword(email: string, code: string, password: string): Promise<void>;
}
