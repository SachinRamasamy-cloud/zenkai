import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Plus, Star } from 'lucide-react';
import { animeApi } from '../../api/common';

// --- ANIME CARD (Reused) ---
const ResultCard = ({ anime, index }) => (
  <Link to={`/anime/${anime.mal_id}`} className="block">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1c25] cursor-pointer"
    >
      <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <span className="text-blue-400 text-xs font-bold block mb-1">{anime.score ? `★ ${anime.score}` : 'New'}</span>
          <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">{anime.title_english || anime.title}</h3>
        </div>
      </div>
    </motion.div>
  </Link>
);

const GenreView = () => {
  const { id, name } = useParams(); // Get ID and Name from URL
  const [animeList, setAnimeList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  useEffect(() => {
    window.scrollTo(0,0);
    fetchAnime(1);
  }, [id]);

  const fetchAnime = async (pageNum) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await animeApi.getAnimeByGenre(id, pageNum);
      setHasNextPage(res.pagination.has_next_page);
      
      if (pageNum === 1) setAnimeList(res.data);
      else setAnimeList(prev => [...prev, ...res.data]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  return (
    <div className="bg-[#0b0c15] min-h-screen pt-24 pb-20 px-6 md:px-12 lg:px-24 font-sans">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link to="/genres" className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-white capitalize">{name} Anime</h1>
          <p className="text-gray-400 text-sm">Top rated series in this category</p>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => <div key={i} className="aspect-[2/3] bg-[#1a1c25] rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {animeList.map((anime, index) => <ResultCard key={`${anime.mal_id}-${index}`} anime={anime} index={index} />)}
          </div>
          {hasNextPage && (
            <div className="mt-12 flex justify-center">
              <button onClick={() => fetchAnime(page + 1)} disabled={loadingMore} className="px-8 py-4 bg-[#1a1c25] hover:bg-blue-600 text-white font-bold rounded-full transition-all flex items-center gap-3 border border-white/10">
                {loadingMore ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                <span>Load More</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GenreView;