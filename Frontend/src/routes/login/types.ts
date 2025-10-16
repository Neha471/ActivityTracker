export interface LoginFormData {
  email: string;
  password: string;
  error?: string;
  missing?: boolean;
  missingPassword?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
