export type UserDTO = {
  id: number;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role: "USER" | "ADMIN" | string;
  travelStyle?: string;
  preferences?: string;
  isVerified: boolean;
  createdAt?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  fullName?: string;
  confirmPassword: string;
};

export type LoginResponse = {
  token: string;
  user: UserDTO;
};
