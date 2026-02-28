import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Heart, Star, Clock, Calendar,
    Globe, Share2, ArrowLeft, BookOpen, Bookmark, Loader2,
    ChevronLeft, ChevronRight, Layers
} from 'lucide-react';
import { getMe, toggleList } from '../api/auth';

const MangaDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const sliderRef = useRef(null);

    const [manga, setManga] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const slide = (direction) => {
        if (sliderRef.current) {
            const { current } = sliderRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            setLoading(true);
            try {
                const [detailsRes, charRes] = await Promise.all([
                    fetch(`https://api.jikan.moe/v4/manga/${id}/full`).then(res => res.json()),
                    fetch(`https://api.jikan.moe/v4/manga/${id}/characters`).then(res => res.json())
                ]);

                setManga(detailsRes.data);
                setCharacters(charRes.data?.slice(0, 15) || []);

                const token = localStorage.getItem('token');
                if (token) {
                    const userData = await getMe(token);
                    setUser(userData);
                    const currentId = String(id);
                    setIsInWatchlist(userData.watchlist.includes(currentId));
                    setIsFavorite(userData.favorites.includes(currentId));
                    setIsBookmarked(userData.bookmarks.includes(currentId));
                }
            } catch (error) {
                console.error("Error fetching manga details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleToggle = async (listType) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        setActionLoading(listType);
        try {
            await toggleList(token, listType, id);
            if (listType === 'watchlist') setIsInWatchlist(!isInWatchlist);
            if (listType === 'favorites') setIsFavorite(!isFavorite);
            if (listType === 'bookmarks') setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.error("Failed to toggle:", error);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0c15] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!manga) return <div className="text-white text-center mt-20">Manga not found</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0b0c15] min-h-screen text-white font-sans pb-20 pt-20"
        >
            <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden rounded-3xl mx-auto max-w-[95%] border border-white/5">
                <Link to="/manga" className="absolute top-6 left-6 z-50 p-3 bg-black/50 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/10">
                    <ArrowLeft size={24} />
                </Link>

                <div className="absolute inset-0">
                    <img src={manga.images.jpg.large_image_url} alt="BG" className="w-full h-full object-cover opacity-40 blur-md scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-[#0b0c15]/60 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 lg:px-16 pb-12 flex flex-col md:flex-row items-end gap-8">
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="hidden md:block w-[220px] lg:w-[260px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 shrink-0">
                        <img src={manga.images.jpg.large_image_url} alt="Poster" className="w-full h-full object-cover" />
                    </motion.div>

                    <div className="flex-1 max-w-4xl">
                        <div className="flex flex-wrap gap-3 mb-4">
                            {manga.genres?.slice(0, 3).map(g => (
                                <span key={g.mal_id} className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold uppercase">
                                    {g.name}
                                </span>
                            ))}
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full flex items-center gap-1 text-xs font-bold">
                                <Star size={14} fill="currentColor" /> {manga.score || 'N/A'}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-2xl uppercase tracking-tighter">
                            {manga.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm font-bold mb-8 uppercase tracking-widest">
                            <span className="flex items-center gap-2"><BookOpen size={18} className="text-blue-500" /> {manga.type}</span>
                            <span className="flex items-center gap-2"><Layers size={18} className="text-blue-500" /> {manga.chapters || '?'} Chapters</span>
                            <span className="px-2 py-0.5 bg-white/10 rounded border border-white/10 text-white">{manga.status}</span>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => handleToggle('watchlist')} className={`px-8 py-3.5 font-black rounded-xl flex items-center gap-2 transition-all ${isInWatchlist ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}>
                                {actionLoading === 'watchlist' ? <Loader2 className="animate-spin" size={20}/> : <Clock size={20} />}
                                {isInWatchlist ? 'Reading' : 'Add to List'}
                            </button>
                            <button onClick={() => handleToggle('favorites')} className={`p-3.5 rounded-xl border transition-all ${isFavorite ? 'bg-pink-600/20 border-pink-500 text-pink-500' : 'bg-white/10 border-white/10 text-white'}`}>
                                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                            </button>
                            <button onClick={() => handleToggle('bookmarks')} className={`p-3.5 rounded-xl border transition-all ${isBookmarked ? 'bg-yellow-600/20 border-yellow-500 text-yellow-500' : 'bg-white/10 border-white/10 text-white'}`}>
                                <Bookmark size={24} fill={isBookmarked ? "currentColor" : "none"} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
                            <span className="w-2 h-8 bg-blue-600 rounded-full" /> Synopsis
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed font-medium">
                            {manga.synopsis || "No synopsis available for this title."}
                        </p>
                    </section>

                    <section className="relative group/section">
                        <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter">
                            <span className="w-2 h-8 bg-blue-600 rounded-full" /> Key Characters
                        </h3>
                        <div className="relative">
                            <button onClick={() => slide('left')} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-blue-600">
                                <ChevronLeft size={24} />
                            </button>
                            <div ref={sliderRef} className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x scroll-smooth">
                                {characters.map(char => (
                                    <div key={char.character.mal_id} className="flex-shrink-0 w-36 group snap-start">
                                        <div className="aspect-[3/4] mb-3 rounded-2xl overflow-hidden border border-white/5 group-hover:border-blue-500 transition-all shadow-lg">
                                            <img src={char.character.images.jpg.image_url} alt={char.character.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white text-sm font-bold truncate group-hover:text-blue-400 transition-colors">{char.character.name}</p>
                                            <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">{char.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => slide('right')} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-blue-600">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <div className="bg-[#1a1c25] border border-white/5 p-8 rounded-3xl shadow-2xl">
                        <h3 className="text-xl font-black text-white mb-8 flex items-center gap-2 uppercase tracking-tighter">
                            <Globe size={20} className="text-blue-500" /> Manga Information
                        </h3>
                        <div className="space-y-6">
                            <InfoRow label="Japanese" value={manga.title_japanese} />
                            <InfoRow label="Authors" value={manga.authors?.map(a => a.name).join(', ')} />
                            <InfoRow label="Published" value={manga.published?.string} />
                            <InfoRow label="Volumes" value={manga.volumes || 'Unknown'} />
                            <InfoRow label="Serialization" value={manga.serializations?.[0]?.name} />
                            <InfoRow label="Rank" value={`#${manga.rank}`} />
                            <InfoRow label="Popularity" value={`#${manga.popularity}`} />
                        </div>
                        <div className="mt-10 pt-8 border-t border-white/5">
                            <button className="w-full py-4 bg-white/5 hover:bg-blue-600 text-gray-300 hover:text-white rounded-2xl flex items-center justify-center gap-2 transition-all font-black uppercase text-xs tracking-widest border border-white/5">
                                <Share2 size={18} /> Share Title
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </motion.div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-start border-b border-white/5 pb-4 last:border-0 last:pb-0">
        <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">{label}</span>
        <span className="text-gray-200 font-bold text-sm text-right max-w-[65%]">{value || 'N/A'}</span>
    </div>
);

export default MangaDetails;