import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getMe } from '../../api/auth';
import { animeApi } from '../../api/common'; // We use this to fetch details

// Simple Card Component
const ListCard = ({ anime }) => (
  <Link to={`/anime/${anime.mal_id}`} className="block">
    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1c25] group border border-white/5 hover:border-blue-500/50 transition-all">
      <img 
        src={anime.images.jpg.large_image_url} 
        alt={anime.title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
      <div className="absolute bottom-0 p-4">
        <h3 className="text-white font-bold text-sm line-clamp-2">{anime.title}</h3>
      </div>
    </div>
  </Link>
);

const UserList = () => {
  const { listType } = useParams(); // 'watchlist', 'favorites', or 'bookmarks'
  const navigate = useNavigate();
  
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // Show loading progress

  useEffect(() => {
    const fetchList = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        // 1. Get User Data first to get the IDs
        const user = await getMe(token);
        const ids = user[listType] || []; // e.g. ["123", "456"]

        if (ids.length === 0) {
          setLoading(false);
          return;
        }

        // 2. Fetch details for each ID
        // Note: Jikan has rate limits. For production, you'd batch this or store details in DB.
        // Here we fetch sequentially to be safe, or Promise.all with delay.
        
        const fetchedAnime = [];
        let completed = 0;

        // Simple loop with small delay to be nice to API
        for (const id of ids) {
          try {
            const res = await animeApi.getAnimeDetails(id);
            fetchedAnime.push(res.data);
          } catch (err) {
            console.error(`Failed to load anime ${id}`);
          }
          completed++;
          setProgress(Math.round((completed / ids.length) * 100));
          
          // Small delay (300ms) to avoid "Too Many Requests"
          await new Promise(r => setTimeout(r, 300));
        }

        setAnimeData(fetchedAnime);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [listType, navigate]);

  const titles = {
    watchlist: 'My Watchlist',
    favorites: 'My Favorites',
    bookmarks: 'Bookmarks & History'
  };

  return (
    <div className="min-h-screen bg-[#0b0c15] pt-24 pb-20 px-6 md:px-12 lg:px-24 font-sans text-white">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/profile" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-black capitalize">{titles[listType] || listType}</h1>
      </div>

      {/* Loading State with Progress */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
          <h2 className="text-xl font-bold">Loading Library... {progress}%</h2>
          <p className="text-gray-500 text-sm mt-2">Fetching your anime details from the archives.</p>
        </div>
      ) : (
        <>
          {animeData.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {animeData.map((anime, idx) => (
                <motion.div
                  key={anime.mal_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ListCard anime={anime} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#1a1c25]/50 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold text-gray-300">This list is empty</h3>
              <p className="text-gray-500 mt-2">Go explore and add some anime!</p>
              <Link to="/discover" className="inline-block mt-6 px-6 py-2 bg-blue-600 rounded-full font-bold text-sm">
                Discover Anime
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;