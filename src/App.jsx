import React, { useState, useEffect } from 'react'; // 1. Added useState, useEffect
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'; // 2. Added useLocation
import { AnimatePresence } from 'framer-motion'; // 3. Added AnimatePresence

// Import Pages
import Navbar from './components/Navbar';
import NotFound from './components/NotFound';
import Home from './Home';
import AnimeDetails from './detial/AnimeDetails';
import Movies from './pages/Movies/MovieCard';
import Genres from './pages/gen/Geners';
import Series from './pages/gen/Series';
import Preloader from './components/Preloader';
import Discover from './pages/search/Discover';
import GenreView from './pages/gen/GenreView';
import Login from './pages/auth/Login';
import Profile from './pages/auth/Profile';
import UserList from './pages/auth/UserList';
import Footer from './components/Footer';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="bg-[#0b0c15] min-h-screen font-sans text-white overflow-x-hidden">
      
      {/* Preloader */}
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {/* Main App Routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/series" element={<Series />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* 4. Fixed the double slash typo here: //profile -> /profile */}
          <Route path="/profile/:listType" element={<UserList />} />
          
          <Route path="/genre/:id/:name" element={<GenreView />} />
        </Route>
      </Routes>

    </div>
  );
};

export default App;