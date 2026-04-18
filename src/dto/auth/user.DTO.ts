// ─── Auth DTOs (khớp BE AuthController) ────────────────────────────────────
export type InterestItem = {
  id: number;
  name: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/** BE LoginResponse chỉ chứa token — không có trường user */
export type LoginResponse = {
  token: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type VerifyOtpRequest = {
  email: string;
  otp: string;
};

export type ResetPasswordRequest = {
  email: string;
  otp: string;
  token?: string;
  newPassword: string;
  confirmPassword: string;
};

export type GoogleLoginRequest = {
  idToken: string;
};

// ─── User DTOs (khớp BE UserResponse) ───────────────────────────────────────

export type UserDTO = {
  id: number;
  fullName: string;
  username?: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  travelStyle?: string;
  avatarUrl?: string;
  interests?: InterestItem[]; 
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  role?: string;
  verified?: boolean;
};

export type UpdateUserRequest = {
  fullName?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  avatarUrl?: string;
  travelStyle?: 'SOLO' | 'FAMILY' | 'GROUP';
};

export type SyncUserRequest = {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
};
