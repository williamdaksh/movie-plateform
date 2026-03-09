import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/auth';

// Signup
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/signup`, userData, {
        withCredentials: true,
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

// Page refresh par cookie se user verify karo
export const verifyUser = createAsyncThunk(
  'auth/verify',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/me`, {
        withCredentials: true,
      });
      return res.data;
    } catch {
      return rejectWithValue(null);
    }
  }
);

// Sirf user info (token nahi) localStorage mein — UI instant load ke liye
const savedUser = (() => {
  try {
    const data = localStorage.getItem('cv_user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
})();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        const { token, ...userWithoutToken } = action.payload; // token store nahi karo
        state.user = userWithoutToken;
        localStorage.setItem('cv_user', JSON.stringify(userWithoutToken));
      })
      .addCase(signupUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const { token, ...userWithoutToken } = action.payload; // token store nahi karo
        state.user = userWithoutToken;
        localStorage.setItem('cv_user', JSON.stringify(userWithoutToken));
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem('cv_user');
      })

      .addCase(verifyUser.fulfilled, (state, action) => {
        const { token, ...userWithoutToken } = action.payload;
        state.user = userWithoutToken;
        localStorage.setItem('cv_user', JSON.stringify(userWithoutToken));
      })
      .addCase(verifyUser.rejected, (state) => {
        state.user = null;
        localStorage.removeItem('cv_user'); // cookie expire — logout
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;