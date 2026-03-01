import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/common';
import { motion } from 'framer-motion';
import { Play, Info, Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const PosterSection = ({ endpoint = "/seasons/now", label = "New Season Release" }) => {
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosterAnime = async () => {
      try {
        const res = await apiClient.get(endpoint, { limit: 25 });
        if (res.data && res.data.length > 0) {
          // Pick a random anime from the results to keep it fresh
          const randomIndex = Math.floor(Math.random() * res.data.length);
          setAnime(res.data[randomIndex]);
        }
      } catch (error) {
        console.error("Error fetching poster anime:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosterAnime();
  }, [endpoint]);

  if (loading || !anime) {
    return (
      <div className="px-6 md:px-16 lg:px-24 w-full">
        <div className="h-[300px] md:h-[400px] w-full bg-white/5 animate-pulse rounded-3xl border border-white/10" />
      </div>
    );
  }

  return (
    <section className="px-6 md:px-16 lg:px-24 w-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-[350px] md:h-[450px] overflow-hidden rounded-[2rem] group border border-white/10 shadow-2xl"
      >
        {/* Background Image with Parallax-like hover */}
        <img 
          src={anime.images.jpg.large_image_url} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c15] via-[#0b0c15]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-transparent to-transparent" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-3xl">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20">
              {label}
            </span>
            <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
              <Star size={14} fill="currentColor" /> {anime.score || 'N/A'}
            </div>
          </motion.div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 line-clamp-2 uppercase tracking-tighter leading-none">
            {anime.title_english || anime.title}
          </h2>
          
          <p className="text-gray-400 text-sm md:text-lg line-clamp-2 mb-8 font-medium max-w-2xl">
            {anime.synopsis?.length > 150 
              ? `${anime.synopsis.slice(0, 150)}...` 
              : anime.synopsis}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to={`/anime/${anime.mal_id}`} className="px-8 py-4 bg-white text-black rounded-2xl font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
              <Play size={20} fill="currentColor" />
              <span className="uppercase tracking-tighter">Watch Now</span>
            </Link>
            <Link to={`/anime/${anime.mal_id}`} className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-white/20 transition-all">
              <Info size={20} />
              <span className="uppercase tracking-tighter">Details</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default PosterSection;