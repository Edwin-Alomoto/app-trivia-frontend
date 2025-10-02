import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@app/store';
import { apiFetchUserProfile, apiCreateProfile, UserProfile, CreateProfileRequest } from '../services/profileApi';

type ProfileState = {
  data: UserProfile | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: ProfileState = {
  data: null,
  isLoading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  void,
  { state: RootState; rejectValue: string }
>(
  'profile/fetchUserProfile',
  async (_arg, { rejectWithValue }) => {
    try {
      const data = await apiFetchUserProfile();
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Error al obtener perfil');
    }
  }
);

export const createProfile = createAsyncThunk<
  UserProfile,
  CreateProfileRequest,
  { state: RootState; rejectValue: string }
>(
  'profile/createProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await apiCreateProfile(profileData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Error al crear perfil');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Error al obtener perfil';
      })
      .addCase(createProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Error al crear perfil';
      });
  },
});

export default profileSlice.reducer;

export const selectUserProfile = (state: RootState) => state.profile.data;
export const selectUserProfileLoading = (state: RootState) => state.profile.isLoading;
export const selectUserProfileError = (state: RootState) => state.profile.error;


