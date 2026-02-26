import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../../utils/burger-api';
import { deleteCookie, setCookie } from '../../utils/cookie';

export type TUserState = {
  user: TUser | null;
  loading: boolean;
  error: string | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
};

export const initialState: TUserState = {
  user: null,
  loading: false,
  error: null,
  isAuthChecked: false,
  isAuthenticated: false
};

export const registerUser = createAsyncThunk<
  { user: TUser; accessToken: string; refreshToken: string },
  TRegisterData,
  { rejectValue: string }
>('user/register', async (registerData, { rejectWithValue }) => {
  try {
    const data = await registerUserApi(registerData);
    if (!data.success) {
      return rejectWithValue('Registration failed');
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || 'Network error');
    }
    return rejectWithValue('Network error');
  }
});

export const loginUser = createAsyncThunk<
  { user: TUser; accessToken: string; refreshToken: string },
  TLoginData,
  { rejectValue: string }
>('user/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await loginUserApi({ email, password });
    if (!response.success) {
      return rejectWithValue('Login failed');
    }
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || 'Network error');
    }
    return rejectWithValue('Network error');
  }
});

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      if (!response?.success) {
        return rejectWithValue('Failed to fetch user');
      }
      return response.user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Network error');
      }
      return rejectWithValue('Network error');
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (userData, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(userData);
    if (!response?.success) {
      return rejectWithValue('Failed to update user');
    }
    return response.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || 'Network error');
    }
    return rejectWithValue('Network error');
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Logout failed');
      }
      return rejectWithValue('Logout failed');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
    },
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.error =
          typeof payload === 'string' ? payload : 'Registration failed';
        state.isAuthChecked = true;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.error = typeof payload === 'string' ? payload : 'Login failed';
        state.isAuthChecked = true;
      })

      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.error =
          typeof payload === 'string' ? payload : 'Failed to fetch user';
        state.isAuthChecked = true;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        const payload = action.payload;
        state.error = typeof payload === 'string' ? payload : 'Logout failed';
        state.isAuthChecked = true;
      });
  }
});

export const { clearUser, setAuthChecked } = userSlice.actions;

export default userSlice.reducer;
