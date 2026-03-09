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

export const deleteHistoryItem = createAsyncThunk(
  'history/deleteOne',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const historySlice = createSlice({
  name: 'history',
  initialState: { history: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.fulfilled, (state, action) => {
        // Backend se aaya data — deduplicate by movieId (latest rakho)
        const seen = new Set();
        state.history = action.payload.filter(item => {
          if (seen.has(item.movieId)) return false;
          seen.add(item.movieId);
          return true;
        });
      })
      .addCase(addHistory.fulfilled, (state, action) => {
        const newItem = action.payload;
        // Agar pehle se hai toh hata do, phir top pe add karo (upsert)
        state.history = [
          newItem,
          ...state.history.filter(item => item.movieId !== newItem.movieId)
        ].slice(0, 50);
      })
      .addCase(clearAllHistory.fulfilled, (state) => {
        state.history = [];
      })
      .addCase(deleteHistoryItem.fulfilled, (state, action) => {
        state.history = state.history.filter(item => item._id !== action.payload);
      });
  },
});

export default historySlice.reducer;