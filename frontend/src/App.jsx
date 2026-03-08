import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import MovieDetail from './pages/MovieDetail';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FavoritesPage from './pages/FavoritesPage';
import HistoryPage from './pages/HistoryPage';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/tv/:id" element={<MovieDetail />} />
        <Route path="/favorites" element={<FavoritesPage />} />
<Route path="/history" element={<HistoryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;