import { httpPost } from '@shared/infrastructure/api/http';

type LoginPayload = { email: string; password: string };
type RegisterPayload = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  phone?: string;
};

type ChangePasswordPayload = {
  newPassword: string;
  confirmPassword: string;
};

export async function apiLogin(payload: LoginPayload) {
  const data: any = await httpPost('/auth/login', payload);
  return data?.data;
}

export async function apiRegister(payload: RegisterPayload) {
  const data: any = await httpPost('/auth/register', payload);
  return data?.data;
}

export async function apiForgotPassword(email: string) {
  const data: any = await httpPost('/auth/forgot-password', { email });
  return data;
}

export async function apiLogout(refreshToken: string) {
  const data: any = await httpPost('/auth/logout', { refreshToken });
  return data;
}

export async function apiChangePassword(payload: ChangePasswordPayload) {
  const data: any = await httpPost('/users-profile/update-password', payload);
  return data;
}


