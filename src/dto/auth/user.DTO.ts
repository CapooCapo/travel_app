// ─── Auth DTOs (khớp BE AuthController) ────────────────────────────────────

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

export type ResetPasswordRequest = {
  token: string;
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
  email: string;
  dateOfBirth?: string;    // LocalDate → ISO string
  gender?: string;
  travelStyle?: string;
  avatarUrl?: string;
  interests?: string[];
};

export type UpdateUserRequest = {
  fullName?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  avatarUrl?: string;
  travelStyle?: 'SOLO' | 'FAMILY' | 'GROUP';
};
