import { httpGet, httpPost } from '@shared/infrastructure/api/http';

export type UserProfile = {
  profile_id: string;
  user_id: string;
  user_type: 'DEMO' | 'PREMIUM' | 'FREE' | string;
  profile_image: string | null;
  total_points: number;
  earned_points: number;
  spent_points: number;
  sale_points: number;
  demo_points: number;
  real_points: number;
  created_at: string;
  updated_at: string;
};

type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
  timestamp: string;
};

export type CreateProfileRequest = {
  user_type: string;
  total_points: number;
  earned_points: number;
  spent_points: number;
  sale_points: number;
  demo_points: number;
  real_points: number;
};

export async function apiFetchUserProfile() {
  const resp = await httpGet<ApiResponse<UserProfile>>('/users-profile/profile');
  return resp.data;
}

export async function apiCreateProfile(profileData: CreateProfileRequest) {
  const resp = await httpPost<ApiResponse<UserProfile>>('/users-profile/create-profile', profileData);
  return resp.data;
}


