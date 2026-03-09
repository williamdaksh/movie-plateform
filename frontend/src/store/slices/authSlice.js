import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

// Signup
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/signup', userData);
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
      const res = await api.post('/auth/login', userData);
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
    await api.post('/auth/logout', {});
  }
);

// Page refresh par cookie se user verify karo
export const verifyUser = createAsyncThunk(
  'auth/verify',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch {
      return rejectWithValue(null);
    }
  }
);

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
      .addCase(signupUser.pending,    (state) => { state.loading = true; state.error = null; })
      .addCase(signupUser.fulfilled,  (state, action) => {
        state.loading = false;
        const { token, ...userWithoutToken } = action.payload;
        state.user = userWithoutToken;
        localStorage.setItem('cv_user', JSON.stringify(userWithoutToken));
      })
      .addCase(signupUser.rejected,   (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(loginUser.pending,     (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled,   (state, action) => {
        state.loading = false;
        const { token, ...userWithoutToken } = action.payload;
        state.user = userWithoutToken;
        localStorage.setItem('cv_user', JSON.stringify(userWithoutToken));
      })
      .addCase(loginUser.rejected,    (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(logoutUser.fulfilled,  (state) => {
        state.user = null;
        localStorage.removeItem('cv_user');
      })

      .addCase(verifyUser.fulfilled,  (state, action) => {
        const { token, ...userWithoutToken } = action.payload;
        state.user = userWithoutToken;
        localStorage.setItem('cv_user', JSON.stringify(userWithoutToken));
      })
      .addCase(verifyUser.rejected,   (state) => {
        state.user = null;
        localStorage.removeItem('cv_user');
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;