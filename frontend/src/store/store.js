import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './slices/movieSlice';
import searchReducer from './slices/searchSlice';

const store = configureStore({
  reducer: {
    movies: movieReducer,
    search:searchReducer
  },
});

export default store;