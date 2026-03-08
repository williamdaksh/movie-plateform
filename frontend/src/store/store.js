import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './slices/movieSlice';
import searchReducer from './slices/searchSlice';
import authReducer from './slices/authSlice';
import favoriteReducer from './slices/favoriteSlice';
import historyReducer from './slices/historySlice';

const store = configureStore({
  reducer: {
    movies: movieReducer,
    search: searchReducer,
    auth: authReducer,
    favorites: favoriteReducer,
    history: historyReducer,
  },
});

export default store;