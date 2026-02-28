import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Star, Loader2, TrendingUp } from 'lucide-react';

const Manga = () => {
    const [mangaList, setMangaList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchManga = async () => {
            try {
                // Fetching top manga from Jikan API
                const response = await fetch('https://api.jikan.moe/v4/top/manga?limit=24');
                const data = await response.json();
                setMangaList(data.data || []);
            } catch (error) {
                console.error("Error fetching manga:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchManga();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0c15] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#0b0c15] pt-28 pb-20 px-6 md:px-12"
        >
            <div className="max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-2 h-10 bg-blue-600 rounded-full" />
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">Manga Explorer</h1>
                        </div>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            Discover the world's most acclaimed manga series, from timeless classics to the latest trending hits.
                        </p>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 text-gray-300">
                            <TrendingUp size={20} className="text-blue-500" />
                            <span className="font-bold text-sm uppercase tracking-wider">Top Rated</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
                    {mangaList.map((manga, index) => (
                        <Link to={`/manga/${manga.mal_id}`} key={manga.mal_id}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 shadow-xl border border-white/5 group-hover:border-blue-500/50 transition-all duration-500">
                                <img 
                                    src={manga.images.jpg.large_image_url} 
                                    alt={manga.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* Overlay Info */}
                                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 bg-blue-600 text-[10px] font-black rounded uppercase">
                                            {manga.type}
                                        </span>
                                        <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-[10px] font-black rounded uppercase">
                                            {manga.status === 'Finished' ? 'End' : 'Air'}
                                        </span>
                                    </div>
                                </div>

                                {/* Score Badge */}
                                <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg flex items-center gap-1.5 text-xs font-black text-yellow-400 border border-white/10 shadow-2xl">
                                    <Star size={12} fill="currentColor" />
                                    {manga.score || 'N/A'}
                                </div>
                            </div>

                            <h3 className="text-white font-bold text-sm md:text-base line-clamp-1 group-hover:text-blue-400 transition-colors">
                                {manga.title}
                            </h3>
                            <p className="text-gray-500 text-xs font-bold mt-1 uppercase tracking-widest">
                                {manga.authors?.[0]?.name.split(',')[0] || 'Unknown Author'}
                            </p>
                        </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Manga;