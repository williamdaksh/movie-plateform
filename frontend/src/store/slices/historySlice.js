import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/history';

export const fetchHistory = createAsyncThunk(
  'history/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(BASE_URL, { withCredentials: true });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addHistory = createAsyncThunk(
  'history/add',
  async (movieData, { rejectWithValue }) => {
    try {
      const res = await axios.post(BASE_URL, movieData, { withCredentials: true });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const clearAllHistory = createAsyncThunk(
  'history/clearAll',
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(BASE_URL, { withCredentials: true });
      return [];
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const historySlice = createSlice({
  name: 'history',
  initialState: {
    history: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(addHistory.fulfilled, (state, action) => {
        // Latest pehle dikhao
        state.history = [action.payload, ...state.history.slice(0, 19)];
      })
      .addCase(clearAllHistory.fulfilled, (state) => {
        state.history = [];
      });
  },
});

export default historySlice.reducer;