import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdb from '../../api/tmdb';

export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrending',
  async () => {
    const response = await tmdb.get('/trending/movie/day');
    return response.data.results;
  }         
);

// Naya — Movie detail fetch karo
export const fetchMovieDetail = createAsyncThunk(
  'movies/fetchDetail',
  async ({ id, type }) => {
    const [detail, videos, credits] = await Promise.all([
      tmdb.get(`/${type}/${id}`),
      tmdb.get(`/${type}/${id}/videos`),
      tmdb.get(`/${type}/${id}/credits`),
    ]);

    return {
      detail: detail.data,
      videos: videos.data.results,
      cast: credits.data.cast.slice(0, 10),
    };
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    trending: [],
    loading: false,
    error: null,
    // Naya
    detail: null,
    videos: [],
    cast: [],
    detailLoading: false,
  },
  reducers: {
    clearDetail: (state) => {
      state.detail = null;
      state.videos = [];
      state.cast = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload;
      })
      .addCase(fetchTrendingMovies.rejected, (state) => {
        state.loading = false;
        state.error = 'Movies load nahi hui!';
      })
      // Detail cases
      .addCase(fetchMovieDetail.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchMovieDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload.detail;
        state.videos = action.payload.videos;
        state.cast = action.payload.cast;
      })
      .addCase(fetchMovieDetail.rejected, (state, action) => {
            state.detailLoading = false;
            state.error = action.error.message;
             console.log('Detail fetch failed:', action.error); // ← add karo
});
  },
});

export const { clearDetail } = movieSlice.actions;
export default movieSlice.reducer;