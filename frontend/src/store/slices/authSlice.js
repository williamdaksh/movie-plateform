import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/auth';

// Signup
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/signup`, userData, {
        withCredentials: true, // cookie save karo
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/login`, userData, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await axios.post(`${BASE_URL}/logout`, {}, {
      withCredentials: true,
    });
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;