export interface RegisterFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
  error?: string;
  missing?: boolean;
  missingPassword?: boolean;
}

export interface RegisterResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
