import { configureStore } from '@reduxjs/toolkit';
import authReducer     from './slices/authSlice';
import movieReducer    from './slices/movieSlice';
import searchReducer   from './slices/searchSlice';
import favoriteReducer from './slices/favoriteSlice';
import historyReducer  from './slices/historySlice';
import toastReducer    from './slices/toastSlice';
// themeReducer removed

const store = configureStore({
  reducer: {
    auth:      authReducer,
    movies:    movieReducer,
    search:    searchReducer,
    favorites: favoriteReducer,
    history:   historyReducer,
    toast:     toastReducer,
  },
});

export default store;