import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdb from '../../api/tmdb';

export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrending',
  async (page = 1) => {
    const response = await tmdb.get('/trending/movie/day', {
      params: { page },
    });
    return { results: response.data.results, page };
  }
);

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
    page: 1,
    hasMore: true,
    loading: false,
    error: null,
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
        const { results, page } = action.payload;

        if (page === 1) {
          state.trending = results; // pehli baar replace karo
        } else {
          state.trending = [...state.trending, ...results]; // baad mein add karo
        }

        state.page = page;
        state.hasMore = results.length > 0; // aur data hai ya nahi
      })
      .addCase(fetchTrendingMovies.rejected, (state) => {
        state.loading = false;
        state.error = 'Movies load nahi hui!';
      })
      .addCase(fetchMovieDetail.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchMovieDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload.detail;
        state.videos = action.payload.videos;
        state.cast = action.payload.cast;
      })
      .addCase(fetchMovieDetail.rejected, (state) => {
        state.detailLoading = false;
      });
  },
});

export const { clearDetail } = movieSlice.actions;
export default movieSlice.reducer;