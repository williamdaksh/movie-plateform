import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdb from '../../api/tmdb';

// Trending Movies (infinite scroll ke liye)
export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrending',
  async (page = 1) => {
    const response = await tmdb.get('/trending/all/day', { params: { page } });
    return { results: response.data.results, page };
  }
);

// Movie Detail
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

// Top Rated Movies
export const fetchTopRatedMovies = createAsyncThunk(
  'movies/fetchTopRated',
  async () => {
    const res = await tmdb.get('/movie/top_rated', { params: { page: 1 } });
    return res.data.results.slice(0, 12);
  }
);

// Top Rated Series
export const fetchTopRatedSeries = createAsyncThunk(
  'movies/fetchTopRatedSeries',
  async () => {
    const res = await tmdb.get('/tv/top_rated', { params: { page: 1 } });
    return res.data.results.slice(0, 12);
  }
);

// Latest / Now Playing Movies
export const fetchLatestMovies = createAsyncThunk(
  'movies/fetchLatest',
  async () => {
    const res = await tmdb.get('/movie/now_playing', { params: { page: 1 } });
    return res.data.results.slice(0, 12);
  }
);

// Popular Movies (Most Viewed)
export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopular',
  async () => {
    const res = await tmdb.get('/movie/popular', { params: { page: 1 } });
    return res.data.results.slice(0, 12);
  }
);

// Popular Series
export const fetchPopularSeries = createAsyncThunk(
  'movies/fetchPopularSeries',
  async () => {
    const res = await tmdb.get('/tv/popular', { params: { page: 1 } });
    return res.data.results.slice(0, 12);
  }
);

// Upcoming Movies
export const fetchUpcoming = createAsyncThunk(
  'movies/fetchUpcoming',
  async () => {
    const res = await tmdb.get('/movie/upcoming', { params: { page: 1 } });
    return res.data.results.slice(0, 12);
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

    // New sections
    topRatedMovies: [],
    topRatedSeries: [],
    latestMovies: [],
    popularMovies: [],
    popularSeries: [],
    upcoming: [],
    sectionsLoading: false,
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
      // Trending
      .addCase(fetchTrendingMovies.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.loading = false;
        const { results, page } = action.payload;
        state.trending = page === 1 ? results : [...state.trending, ...results];
        state.page = page;
        state.hasMore = results.length > 0;
      })
      .addCase(fetchTrendingMovies.rejected, (state) => { state.loading = false; state.error = 'Movies load nahi hui!'; })

      // Detail
      .addCase(fetchMovieDetail.pending, (state) => { state.detailLoading = true; })
      .addCase(fetchMovieDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload.detail;
        state.videos = action.payload.videos;
        state.cast = action.payload.cast;
      })
      .addCase(fetchMovieDetail.rejected, (state) => { state.detailLoading = false; })

      // Sections
      .addCase(fetchTopRatedMovies.fulfilled, (state, action) => { state.topRatedMovies = action.payload; })
      .addCase(fetchTopRatedSeries.fulfilled, (state, action) => { state.topRatedSeries = action.payload; })
      .addCase(fetchLatestMovies.fulfilled, (state, action) => { state.latestMovies = action.payload; })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => { state.popularMovies = action.payload; })
      .addCase(fetchPopularSeries.fulfilled, (state, action) => { state.popularSeries = action.payload; })
      .addCase(fetchUpcoming.fulfilled, (state, action) => { state.upcoming = action.payload; });
  },
});

export const { clearDetail } = movieSlice.actions;
export default movieSlice.reducer;