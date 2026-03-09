import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

export const fetchHistory = createAsyncThunk(
  'history/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/history');
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
      const res = await api.post('/history', movieData);
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
      await api.delete('/history');
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
      await api.delete(`/history/${id}`);
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
        const seen = new Set();
        state.history = action.payload.filter(item => {
          if (seen.has(item.movieId)) return false;
          seen.add(item.movieId);
          return true;
        });
      })
      .addCase(addHistory.fulfilled, (state, action) => {
        const newItem = action.payload;
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