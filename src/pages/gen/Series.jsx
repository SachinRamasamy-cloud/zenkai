import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Plus, Loader2, Tv } from 'lucide-react';
import { animeApi } from '../../api/common';

// --- SERIES CARD COMPONENT ---
const SeriesCard = ({ anime, index }) => (
  <Link to={`/anime/${anime.mal_id}`} className="block">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1c25] cursor-pointer"
    >
      {/* Image */}
      <img
        src={anime.images.jpg.large_image_url}
        alt={anime.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

      {/* Content Overlay */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        
        {/* Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300 pointer-events-none">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/40">
            <Play size={20} fill="white" className="text-white ml-1" />
          </div>
        </div>

        {/* Text Info */}
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-green-400 text-xs font-bold">
              {anime.score ? `${Math.round(anime.score * 10)}% Match` : 'New'}
            </span>
            <span className="text-gray-300 text-xs border border-white/20 px-1 rounded">
              {anime.episodes ? `${anime.episodes} Eps` : 'TV'}
            </span>
          </div>
          <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">
            {anime.title_english || anime.title}
          </h3>
        </div>
      </div>
    </motion.div>
  </Link>
);

// --- MAIN SERIES PAGE ---
const Series = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Initial Load
  useEffect(() => {
    fetchSeries(1);
  }, []);

  const fetchSeries = async (pageNum) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await animeApi.getSeries(pageNum);
      
      const newSeries = res.data;
      const pagination = res.pagination;

      setHasNextPage(pagination.has_next_page);

      if (pageNum === 1) {
        setSeriesList(newSeries);
      } else {
        setSeriesList(prev => [...prev, ...newSeries]);
      }
    } catch (error) {
      console.error("Error fetching series:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSeries(nextPage);
  };

  return (
    <div className="bg-[#0b0c15] min-h-screen pt-24 pb-20 px-6 md:px-12 lg:px-24 font-sans">
      
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-3">
            <Tv className="text-blue-500" /> Top Series
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Binge-worthy shows rated by fans.</p>
        </div>
        <div className="hidden md:block h-1 w-24 bg-blue-600 rounded-full mb-2" />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {loading ? (
          // Skeletons
          [...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-[#1a1c25] rounded-xl animate-pulse" />
          ))
        ) : (
          seriesList.map((anime, index) => (
            <SeriesCard key={`${anime.mal_id}-${index}`} anime={anime} index={index % 24} />
          ))
        )}
      </div>

      {/* Pagination Button */}
      {!loading && hasNextPage && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="group relative px-8 py-4 bg-[#1a1c25] hover:bg-blue-600 text-white font-bold rounded-full transition-all duration-300 flex items-center gap-3 border border-white/10 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            )}
            <span>{loadingMore ? 'Loading Content...' : 'Load More Series'}</span>
          </button>
        </div>
      )}

      {/* End Message */}
      {!loading && !hasNextPage && (
        <p className="text-center text-gray-500 mt-12 font-medium">No more series available.</p>
      )}

    </div>
  );
};

export default Series;