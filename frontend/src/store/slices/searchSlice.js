import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdb from '../../api/tmdb';

export const fetchSearchResults = createAsyncThunk(
  'search/fetchResults',
  async (query) => {
    const response = await tmdb.get('/search/multi', {
      params: { query },
    });
    return response.data.results;
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
    loading: false,
    error: null,
    query: '',
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.results = [];
      state.query = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state) => {
        state.loading = false;
        state.error = 'Search failed!';
      });
  },
});

export const { setQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;