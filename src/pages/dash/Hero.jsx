import React, { useEffect, useState, useRef } from 'react';
import { animeApi } from '../../api/common'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Calendar, Clock, Plus, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [featuredList, setFeaturedList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  // Mouse parallax effect state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 25;
    const y = (clientY / innerHeight - 0.5) * 25;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await animeApi.getTopAnime();
        const data = response.data;
        if (data && data.length > 0) {
          setFeaturedList(data.slice(0, 6)); // Top 6 for carousel
        }
      } catch (error) {
        console.error("Failed to fetch hero anime:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  // Carousel Auto-play logic
  useEffect(() => {
    if (featuredList.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredList.length);
    }, 8000); // Switch every 8 seconds
    return () => clearInterval(interval);
  }, [featuredList]);

  if (loading) {
    return (
      <div className="w-full h-[100dvh] bg-[#0b0c15] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-blue-500 font-black tracking-[0.3em] uppercase text-sm animate-pulse">Initializing Zenkai</p>
        </motion.div>
      </div>
    );
  }

  if (featuredList.length === 0) return null;
  const currentAnime = featuredList[currentIndex];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(15px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[100dvh] overflow-hidden bg-[#0b0c15] text-white select-none"
    >
      
      {/* 1. BACKGROUND LAYER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAnime.mal_id}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            x: mousePosition.x * -0.8,
            y: mousePosition.y * -0.8,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <motion.img 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src={currentAnime.images.jpg.large_image_url} 
            alt="Background" 
            className="w-full h-full object-cover opacity-30 md:opacity-25"
          />
          
          {/* Heavy Left Gradient for Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c15] via-[#0b0c15]/95 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-transparent to-transparent z-10" />
        </motion.div>
      </AnimatePresence>

      {/* 2. CONTENT LAYER */}
      <div className="relative z-20 h-full w-full max-w-[1920px] mx-auto px-6 md:px-16 lg:px-24 flex items-center pt-20">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentAnime.mal_id}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col md:flex-row items-center md:items-start gap-10 w-full"
          >
            {/* Small Poster Icon Image */}
            <motion.div 
              variants={itemVariants}
              className="w-40 md:w-56 lg:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 shrink-0 hidden sm:block"
            >
              <img src={currentAnime.images.jpg.large_image_url} alt="" className="w-full h-full object-cover" />
            </motion.div>

            {/* Text Content */}
            <div className="flex-1 max-w-3xl">
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded">
                  Featured #{currentIndex + 1}
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-bold">{currentAnime.score} Rating</span>
                </div>  
                <span className="text-gray-400 text-sm font-bold">• {currentAnime.type}</span>
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 uppercase tracking-tighter line-clamp-2"
              >
                {currentAnime.title_english || currentAnime.title}
              </motion.h1>

              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6 text-gray-300 text-sm font-bold mb-8">
                <span className="flex items-center gap-2"><Calendar size={18} className="text-blue-500" /> {currentAnime.year || '2024'}</span>
                <span className="flex items-center gap-2"><Clock size={18} className="text-blue-500" /> {currentAnime.duration || '24m'}</span>
                <span className="px-2 py-0.5 bg-white/10 rounded text-xs border border-white/10">{currentAnime.rating?.split(' ')[0] || 'PG-13'}</span>
              </motion.div>

              <motion.p 
                variants={itemVariants}
                className="hidden sm:block text-gray-400 text-lg md:text-xl leading-relaxed mb-10 line-clamp-2 max-w-2xl font-medium"
              >
                {currentAnime.synopsis?.length > 160 
                  ? `${currentAnime.synopsis.slice(0, 160)}...` 
                  : currentAnime.synopsis}
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-white text-black rounded-xl font-black flex items-center gap-3 transition-all hover:bg-blue-500 hover:text-white active:scale-95 shadow-xl">
                  <Play size={20} fill="currentColor" />
                  <span className="uppercase tracking-widest text-sm">Watch Now</span>
                </button>
                
                <Link to={`/anime/${currentAnime.mal_id}`} className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl font-black flex items-center gap-3 transition-all hover:bg-white/20 active:scale-95 group">
                  <Info size={20} />
                  <span className="uppercase tracking-widest text-sm text-white">Details</span>
                </Link>

                <button className="p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/20 transition-all">
                  <Plus size={20} />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-12 left-6 md:left-16 lg:left-24 flex gap-3 z-30">
        {featuredList.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-12 bg-blue-500' : 'w-4 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 md:h-64 bg-gradient-to-t from-[#0b0c15] to-transparent z-20 pointer-events-none" />
    </section>
  );
};

export default Hero;