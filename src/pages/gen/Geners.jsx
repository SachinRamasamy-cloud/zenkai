import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Zap, Heart, Ghost, Smile, Globe, Sword, Monitor } from 'lucide-react';
import { animeApi } from '../../api/common';

// Custom Gradients & Icons for top genres to make them pop
const GENRE_STYLES = {
  1: { color: 'from-red-500 to-orange-600', icon: <Sword /> }, // Action
  2: { color: 'from-blue-500 to-cyan-600', icon: <Globe /> }, // Adventure
  4: { color: 'from-yellow-400 to-orange-500', icon: <Smile /> }, // Comedy
  8: { color: 'from-purple-600 to-indigo-900', icon: <Ghost /> }, // Drama (using Ghost as placeholder or generic)
  10: { color: 'from-emerald-500 to-teal-700', icon: <Zap /> }, // Fantasy
  14: { color: 'from-gray-700 to-black', icon: <Ghost /> }, // Horror
  22: { color: 'from-pink-500 to-rose-600', icon: <Heart /> }, // Romance
  24: { color: 'from-indigo-500 to-blue-700', icon: <Monitor /> }, // Sci-Fi
};

const GenreCard = ({ genre, index }) => {
  const style = GENRE_STYLES[genre.mal_id] || { color: 'from-[#1a1c25] to-[#0f1016]', icon: <Layers /> };
  
  return (
    <Link to={`/genre/${genre.mal_id}/${genre.name}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.03 }}
        className={`group relative h-32 md:h-40 rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all shadow-lg hover:scale-[1.02]`}
      >
        {/* Animated Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-80 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div className="text-white/50 group-hover:text-white transition-colors transform group-hover:-translate-y-1 duration-300">
            {style.icon}
          </div>
          
          <div>
            <h3 className="text-white font-black text-xl md:text-2xl tracking-tight leading-none mb-1 group-hover:translate-x-1 transition-transform duration-300">
              {genre.name}
            </h3>
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider">
              {genre.count} Titles
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await animeApi.getGenres();
        // Sort by popularity and filter out very small categories
        const sorted = res.data
          .filter(g => g.count > 50)
          .sort((a, b) => b.count - a.count);
        setGenres(sorted);
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  return (
    <div className="bg-[#0b0c15] min-h-screen pt-24 pb-20 px-6 md:px-12 lg:px-24 font-sans">
      
      <div className="max-w-4xl mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Explore Genres</h1>
        <p className="text-gray-400 text-lg">Dive into specific categories and find your vibe.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-32 md:h-40 bg-[#1a1c25] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {genres.map((genre, index) => (
            <GenreCard key={genre.mal_id} genre={genre} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Genres;