import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { motion, useInView } from 'framer-motion';
import { Star, ChevronRight, ChevronLeft, Play, Plus } from 'lucide-react';
import { apiClient } from '../../api/common';

// --- 1. CSS FOR HIDING SCROLLBAR (Injected) ---
const scrollbarHideStyles = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// --- 2. PREMIUM CARD COMPONENT (Now Clickable) ---
const AnimeCard = ({ anime, index }) => {
  return (
    <Link to={`/anime/${anime.mal_id}`} className="block">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group relative flex-shrink-0 w-[160px] md:w-[220px] h-[260px] md:h-[340px] rounded-xl overflow-hidden cursor-pointer snap-start bg-[#1a1c25]"
      >
        {/* Base Image */}
        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Rank/Type Badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
          {anime.type || 'TV'}
        </div>

        {/* Default Gradient (Bottom readability) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-transparent to-transparent opacity-80" />

        {/* --- HOVER INTERFACE --- */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
          
          {/* Top: Score */}
          <div className="transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 self-end">
             <div className="flex items-center gap-1 text-green-400 text-xs font-bold bg-black/50 px-2 py-1 rounded-full border border-white/10">
                {anime.score ? `${Math.round(anime.score * 10)}% Match` : 'New'}
             </div>
          </div>

          {/* Center: Action Buttons */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
            
            {/* Play Button */}
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full text-black shadow-lg shadow-white/20">
              <Play size={24} fill="currentColor" className="ml-1" />
            </div>
            
            {/* Add List Button (Stop propagation prevents navigation when clicking this specific button) */}
            <button 
              onClick={(e) => { e.preventDefault(); /* Add logic here later */ }}
              className="flex items-center justify-center w-12 h-12 bg-white/10 border-2 border-white/30 rounded-full hover:bg-white/20 text-white backdrop-blur-md transition-colors"
            >
              <Plus size={24} />
            </button>
          </div>

          {/* Bottom: Info */}
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-bold text-sm md:text-base leading-tight line-clamp-2 mb-2">
              {anime.title_english || anime.title}
            </h3>
            
            <div className="flex gap-2 text-[10px] text-gray-400 font-medium">
               {anime.genres?.slice(0, 3).map((g, i) => (
                 <span key={g.name}>
                   {g.name}{i < 2 && <span className="text-gray-600 ml-2">•</span>}
                 </span>
               ))}
            </div>
          </div>

        </div>
      </motion.div>
    </Link>
  );
};

// --- 3. SKELETON LOADER ---
const CardSkeleton = () => (
  <div className="flex-shrink-0 w-[160px] md:w-[220px] h-[260px] md:h-[340px] bg-gray-800/50 rounded-xl animate-pulse relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
  </div>
);

// --- 4. MAIN CONTENT ROW ---
const ContentRow = ({ title, endpoint, params }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false); 
  
  const sliderRef = useRef(null);
  const rowRef = useRef(null);
  const isInView = useInView(rowRef, { once: true, margin: "200px" });

  useEffect(() => {
    if (isInView) {
      const fetchData = async () => {
        try {
          const res = await apiClient.get(endpoint, params);
          setData(res.data);
        } catch (error) {
          console.error(`Error loading ${title}`, error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isInView, endpoint, params, title]);

  // Scroll Handler
  const slide = (direction) => {
    if (sliderRef.current) {
      const { current } = sliderRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth + 200 : current.offsetWidth - 200;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section ref={rowRef} className="py-6 md:py-8 w-full group/section" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      
      {/* Inject Styles */}
      <style>{scrollbarHideStyles}</style>

      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide hover:text-blue-400 transition-colors cursor-pointer">
          {title}
        </h2>
        <button className="text-xs md:text-sm font-semibold text-gray-400 hover:text-white flex items-center gap-1 transition-colors group/btn">
          See All 
          <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform text-blue-500" />
        </button>
      </div>

      {/* Slider Container */}
      <div className="relative group/slider">
        
        {/* LEFT ARROW */}
        <div className={`hidden md:flex absolute top-0 bottom-0 left-0 z-40 w-16 bg-gradient-to-r from-[#0b0c15] to-transparent items-center justify-start pl-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button 
            onClick={() => slide('left')}
            className="p-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white hover:text-black hover:scale-110 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* SCROLLABLE AREA */}
        <div 
          ref={sliderRef}
          className="flex gap-3 md:gap-5 overflow-x-auto px-6 md:px-16 lg:px-24 pb-4 no-scrollbar snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
        >
          {loading ? (
            [...Array(6)].map((_, i) => <CardSkeleton key={i} />)
          ) : (
            data.map((item, index) => (
              <AnimeCard key={item.mal_id} anime={item} index={index} />
            ))
          )}
        </div>
        
        {/* RIGHT ARROW */}
        <div className={`hidden md:flex absolute top-0 bottom-0 right-0 z-40 w-16 bg-gradient-to-l from-[#0b0c15] to-transparent items-center justify-end pr-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button 
            onClick={() => slide('right')}
            className="p-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white hover:text-black hover:scale-110 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default ContentRow;