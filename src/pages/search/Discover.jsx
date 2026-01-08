import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Loader2, X, ArrowRight } from 'lucide-react'; // Added ArrowRight
import { animeApi } from '../../api/common';

// --- SEARCH RESULT CARD ---
const SearchCard = ({ anime, index }) => (
  <Link to={`/anime/${anime.mal_id}`} className="block">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1c25] cursor-pointer border border-white/5 hover:border-blue-500/50 transition-colors"
    >
      <img
        src={anime.images.jpg.large_image_url}
        alt={anime.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      
      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <span className="text-blue-400 text-xs font-bold block mb-1">
            {anime.type || 'TV'} • {anime.year || 'N/A'}
          </span>
          <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">
            {anime.title_english || anime.title}
          </h3>
        </div>
      </div>
    </motion.div>
  </Link>
);

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery, 1);
    }
  }, []);

  const handleSearch = async (searchQuery, pageNum = 1) => {
    if (!searchQuery.trim()) return;
    
    setSearchParams({ q: searchQuery });

    try {
      if (pageNum === 1) {
        setLoading(true);
        setSearched(true);
      } else {
        setLoadingMore(true);
      }

      const res = await animeApi.searchAnime(searchQuery, pageNum);
      
      const newResults = res.data;
      setHasNextPage(res.pagination.has_next_page);

      if (pageNum === 1) {
        setResults(newResults);
      } else {
        setResults(prev => [...prev, ...newResults]);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    handleSearch(query, 1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    handleSearch(query, nextPage);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
    setSearchParams({});
  };

  return (
    <div className="bg-[#0b0c15] min-h-screen pt-24 pb-20 px-6 md:px-12 lg:px-24 font-sans">
      
      {/* --- SEARCH HEADER --- */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-6">Find Your Next Adventure</h1>
        
        <form onSubmit={onFormSubmit} className="relative w-full">
          {/* Left Decorative Icon */}
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={24} />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime..."
            // UPDATED PADDING: pr-36 ensures text doesn't go under the buttons on the right
            className="w-full bg-[#1a1c25] border border-white/10 rounded-2xl py-4 md:py-5 pl-14 pr-36 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-base md:text-lg shadow-2xl shadow-black/50"
          />
          
          {/* Right Action Buttons Container */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            
            {/* Clear Button */}
            {query && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full"
              >
                <X size={18} />
              </button>
            )}

            {/* NEW SEARCH BUTTON - Ensures Mobile Functionality */}
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold text-sm md:text-base transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95"
            >
              <span className="hidden md:inline">Search</span>
              <ArrowRight size={20} className="md:hidden" /> {/* Arrow icon for mobile to save space */}
            </button>
          </div>

        </form>
      </div>

      {/* --- RESULTS AREA --- */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-[#1a1c25] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {results.map((anime, index) => (
                <SearchCard key={`${anime.mal_id}-${index}`} anime={anime} index={index} />
              ))}
            </div>
          ) : (
            searched && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#1a1c25] rounded-full mb-4">
                  <Search size={32} className="text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                <p className="text-gray-500">We couldn't find any anime matching "{query}"</p>
              </div>
            )
          )}

          {/* Load More Button */}
          {results.length > 0 && hasNextPage && (
            <div className="mt-16 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-4 bg-[#1a1c25] hover:bg-blue-600 text-white font-bold rounded-full transition-all flex items-center gap-3 border border-white/10"
              >
                {loadingMore ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                <span>{loadingMore ? 'Searching...' : 'Load More Results'}</span>
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default Discover;