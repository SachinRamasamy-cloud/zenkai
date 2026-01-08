import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Heart, Play, Star, Clock, Calendar,
    Globe, Share2, ArrowLeft, Tv, Bookmark, Loader2
} from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { animeApi } from '../api/common';
import { getMe, toggleList } from '../api/auth';
const AnimeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const sliderRef = useRef(null);

    // Data States
    const [anime, setAnime] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);

    // User Interaction States
    const [user, setUser] = useState(null);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    
    // Button Loading States (to prevent double clicks)
    const [actionLoading, setActionLoading] = useState(null); // 'watchlist', 'favorites', 'bookmarks'

    // Slider Logic
    const slide = (direction) => {
        if (sliderRef.current) {
            const { current } = sliderRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Anime Details (Jikan API)
                const [detailsRes, charRes] = await Promise.all([
                    animeApi.getAnimeDetails(id),
                    animeApi.getAnimeCharacters(id)
                ]);

                setAnime(detailsRes.data);
                setCharacters(charRes.data.slice(0, 10));

                // 2. Fetch User Status (Backend)
                const token = localStorage.getItem('token');
                if (token) {
                    const userData = await getMe(token);
                    setUser(userData);
                    
                    // Check if this anime ID exists in user's lists
                    // Note: We convert id to String because URL params are strings, DB IDs might be strings
                    const currentId = String(id);
                    setIsInWatchlist(userData.watchlist.includes(currentId));
                    setIsFavorite(userData.favorites.includes(currentId));
                    setIsBookmarked(userData.bookmarks.includes(currentId));
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // --- TOGGLE HANDLER ---
    const handleToggle = async (listType) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect if not logged in
            return;
        }

        setActionLoading(listType);

        try {
            await toggleList(token, listType, id);

            // Update Local State Optimistically
            if (listType === 'watchlist') setIsInWatchlist(!isInWatchlist);
            if (listType === 'favorites') setIsFavorite(!isFavorite);
            if (listType === 'bookmarks') setIsBookmarked(!isBookmarked);

        } catch (error) {
            console.error("Failed to toggle:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0c15] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!anime) return <div className="text-white text-center mt-20">Anime not found</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#0b0c15] min-h-screen text-white font-sans pb-20 pt-20"
        >

            <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden rounded-3xl mx-auto max-w-[95%] shadow-2xl shadow-blue-900/10 border border-white/5">

                {/* Back Button */}
                <Link to="/" className="absolute top-6 left-6 z-50 p-3 bg-black/50 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all group border border-white/10">
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </Link>

                {/* Background Image with Blur */}
                <div className="absolute inset-0">
                    <img
                        src={anime.images.jpg.large_image_url}
                        alt="Hero BG"
                        className="w-full h-full object-cover opacity-60 blur-sm scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-[#0b0c15]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c15] via-black/50 to-transparent" />
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 lg:px-16 pb-12 flex flex-col md:flex-row items-end gap-8">

                    {/* Poster Card */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="hidden md:block w-[200px] lg:w-[240px] rounded-xl overflow-hidden shadow-2xl shadow-black/80 border-2 border-white/10 shrink-0"
                    >
                        <img src={anime.images.jpg.large_image_url} alt="Poster" className="w-full h-full object-cover" />
                    </motion.div>

                    {/* Text Content */}
                    <div className="flex-1 max-w-4xl">
                        {/* Meta Tags */}
                        <div className="flex flex-wrap gap-3 mb-4 text-sm font-bold tracking-wide">
                            {anime.genres.slice(0, 3).map(g => (
                                <span key={g.mal_id} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-blue-200 shadow-sm">
                                    {g.name}
                                </span>
                            ))}
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full flex items-center gap-1 shadow-sm">
                                <Star size={14} fill="currentColor" /> {anime.score}
                            </span>
                        </div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 text-white drop-shadow-lg"
                        >
                            {anime.title_english || anime.title}
                        </motion.h1>

                        {/* Quick Stats Line */}
                        <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm md:text-base font-medium mb-8">
                            <span className="flex items-center gap-2"><Tv size={18} className="text-blue-400" /> {anime.type}</span>
                            <span className="flex items-center gap-2"><Calendar size={18} className="text-blue-400" /> {anime.year || 'N/A'}</span>
                            <span className="flex items-center gap-2"><Clock size={18} className="text-blue-400" /> {anime.duration || '24 min'}</span>
                            <span className="text-white px-2 py-0.5 bg-gray-700/80 rounded text-xs border border-white/10">{anime.rating?.split(' ')[0] || 'PG-13'}</span>
                        </div>

                        {/* --- ACTION BUTTONS (UPDATED) --- */}
                        <div className="flex flex-wrap gap-4">
                            
                            {/* 1. Watch Trailer */}
                            <a
                                href={anime.trailer?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-3 transition-all shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95"
                            >
                                <Play size={20} fill="currentColor" /> Trailer
                            </a>

                            {/* 2. WATCHLIST BUTTON */}
                            <button
                                onClick={() => handleToggle('watchlist')}
                                disabled={actionLoading === 'watchlist'}
                                className={`px-6 py-3.5 border font-bold rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                                    isInWatchlist
                                        ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                                        : 'bg-white/10 border-white/10 hover:bg-white/20 text-white backdrop-blur-md'
                                }`}
                            >
                                {actionLoading === 'watchlist' ? <Loader2 className="animate-spin" size={20}/> : <Clock size={20} />}
                                {isInWatchlist ? 'In Watchlist' : 'Watchlist'}
                            </button>

                            {/* 3. FAVORITES BUTTON */}
                            <button
                                onClick={() => handleToggle('favorites')}
                                disabled={actionLoading === 'favorites'}
                                className={`px-6 py-3.5 border font-bold rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                                    isFavorite
                                        ? 'bg-pink-600/20 border-pink-500 text-pink-400'
                                        : 'bg-white/10 border-white/10 hover:bg-white/20 text-white backdrop-blur-md'
                                }`}
                            >
                                {actionLoading === 'favorites' ? <Loader2 className="animate-spin" size={20}/> : <Heart size={20} className={isFavorite ? "fill-current" : ""} />}
                                {isFavorite ? 'Liked' : 'Like'}
                            </button>

                            {/* 4. BOOKMARK / COMPLETED BUTTON */}
                            <button
                                onClick={() => handleToggle('bookmarks')}
                                disabled={actionLoading === 'bookmarks'}
                                className={`px-6 py-3.5 border font-bold rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                                    isBookmarked
                                        ? 'bg-yellow-600/20 border-yellow-500 text-yellow-400'
                                        : 'bg-white/10 border-white/10 hover:bg-white/20 text-white backdrop-blur-md'
                                }`}
                            >
                                {actionLoading === 'bookmarks' ? <Loader2 className="animate-spin" size={20}/> : <Bookmark size={20} className={isBookmarked ? "fill-current" : ""} />}
                                {isBookmarked ? 'Saved' : 'Bookmark'}
                            </button>

                        </div>

                    </div>
                </div>
            </div>

            {/* --- 2. MAIN CONTENT GRID --- */}
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* LEFT COLUMN: Synopsis & Characters */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Synopsis */}
                    <section>
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-blue-500 rounded-full" /> Storyline
                        </h3>
                        <p className="text-gray-300 text-lg leading-relaxed">{anime.synopsis}</p>
                    </section>

                    {/* Characters Row */}
                    <section className="relative group/section">
                        <style>{`
                            .no-scrollbar::-webkit-scrollbar { display: none; }
                            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                        `}</style>

                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-blue-500 rounded-full" /> Top Cast
                        </h3>

                        <div className="relative">
                            <button
                                onClick={() => slide('left')}
                                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 border border-white/20 rounded-full items-center justify-center text-white backdrop-blur-md opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-blue-600 hover:border-blue-500 shadow-xl"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <div ref={sliderRef} className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x scroll-smooth">
                                {characters.map(char => (
                                    <div key={char.character.mal_id} className="flex-shrink-0 w-32 group snap-start cursor-pointer">
                                        <div className="w-28 h-28 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-blue-500 transition-all shadow-lg relative">
                                            <img
                                                src={char.character.images.jpg.image_url}
                                                alt={char.character.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white text-sm font-bold truncate px-1 group-hover:text-blue-400 transition-colors">
                                                {char.character.name}
                                            </p>
                                            <p className="text-gray-500 text-[10px] uppercase tracking-wide truncate px-1 font-medium">
                                                {char.role}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => slide('right')}
                                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 border border-white/20 rounded-full items-center justify-center text-white backdrop-blur-md opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-blue-600 hover:border-blue-500 shadow-xl"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN: Info Sidebar */}
                <div className="h-fit space-y-6">
                    <div className="bg-[#1a1c25]/80 backdrop-blur-sm border border-white/5 p-8 rounded-2xl shadow-xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Globe size={20} className="text-blue-500" /> Anime Info
                        </h3>

                        <div className="space-y-5">
                            <InfoRow label="Japanese Title" value={anime.title_japanese} />
                            <InfoRow label="Premiered" value={anime.season ? `${anime.season} ${anime.year}` : 'Unknown'} />
                            <InfoRow label="Studio" value={anime.studios?.[0]?.name} />
                            <InfoRow label="Source" value={anime.source} />
                            <InfoRow label="Episodes" value={anime.episodes || '?'} />
                            <InfoRow label="Status" value={anime.status} />
                            <InfoRow label="Rating" value={anime.rating} />
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl flex items-center justify-center gap-2 transition-all font-bold border border-white/5">
                                <Share2 size={18} /> Share Anime
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

// Helper for Info Sidebar
const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-start border-b border-white/5 pb-3 last:border-0 last:pb-0">
        <span className="text-gray-500 font-medium text-sm">{label}</span>
        <span className="text-gray-200 font-semibold text-sm text-right max-w-[60%]">{value || 'N/A'}</span>
    </div>
);

export default AnimeDetails;