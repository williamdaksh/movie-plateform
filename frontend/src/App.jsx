import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from './store/store';
import Navbar from './components/Navbar';
import ToastManager from './components/ToastManager';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FavoritesPage from './pages/FavoritesPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import { verifyUser } from './store/slices/authSlice';

const HIDE_NAVBAR = ['/login', '/signup'];

const AppInit = () => {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(verifyUser()); }, []);
  return null;
};

const Layout = () => {
  const location = useLocation();
  const showNavbar = !HIDE_NAVBAR.includes(location.pathname);
  return (
    <>
      <AppInit />
      {showNavbar && <Navbar />}
      <ToastManager />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/tv/:id"    element={<MovieDetail />} />
        <Route path="/search"    element={<SearchPage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/signup"    element={<SignupPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/history"   element={<HistoryPage />} />
        <Route path="/profile"   element={<ProfilePage />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </Provider>
  );
}

export default App;