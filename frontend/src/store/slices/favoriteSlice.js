import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/favorites');
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/add',
  async (movieData, { rejectWithValue }) => {
    try {
      const res = await api.post('/favorites', movieData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/remove',
  async (movieId, { rejectWithValue }) => {
    try {
      await api.delete(`/favorites/${movieId}`);
      return movieId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const checkFavorite = createAsyncThunk(
  'favorites/check',
  async (movieId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/favorites/check/${movieId}`);
      return res.data.isFavorite;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: {
    favorites: [],
    isFavorite: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites.push(action.payload);
        state.isFavorite = true;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(f => f.movieId !== action.payload);
        state.isFavorite = false;
      })
      .addCase(checkFavorite.fulfilled, (state, action) => {
        state.isFavorite = action.payload;
      });
  },
});

export default favoriteSlice.reducer;