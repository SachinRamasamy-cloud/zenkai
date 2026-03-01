import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Eye, EyeOff, AlertCircle, Star, Play } from 'lucide-react';
import { loginUser, registerUser } from '../../api/auth';
import { animeApi } from '../../api/common';

const Login = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [isLogin, setIsLogin] = useState(true); // Toggle Login/Signup
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // Store error messages
    const [logoError, setLogoError] = useState(false);
    const [animeList, setAnimeList] = useState([]);
    const [featuredIndex, setFeaturedIndex] = useState(0);

    // Mouse parallax effect state
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 30;
        const y = (clientY / innerHeight - 0.5) * 30;
        setMousePosition({ x, y });
    };

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await animeApi.getTopAnime();
                if (res.data) {
                    setAnimeList(res.data.slice(0, 12));
                }
            } catch (err) {
                console.error("Failed to fetch showcase images:", err);
            }
        };
        fetchImages();
    }, []);

    // Auto-rotate featured anime every 5 seconds
    useEffect(() => {
        if (animeList.length === 0) return;
        const interval = setInterval(() => {
            setFeaturedIndex((prev) => (prev + 1) % animeList.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [animeList]);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const { username, email, password } = formData;

    // Password Strength Logic
    const getStrength = (pass) => {
        if (!pass) return 0;
        let s = 0;
        if (pass.length >= 6) s++;
        if (/[A-Z]/.test(pass)) s++;
        if (/[0-9]/.test(pass)) s++;
        if (/[^A-Za-z0-9]/.test(pass)) s++;
        return Math.max(s, 1); // Minimum 1 if text exists
    };

    const strength = getStrength(password);

    const onChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setError(''); // Clear error when typing
    };

    // --- HANDLE SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let data;
            if (isLogin) {
                // LOGIN logic
                data = await loginUser({ email, password });
            } else {
                // REGISTER logic
                data = await registerUser({ username, email, password });
            }

            // Success!
            // 1. Store the token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            // 2. Redirect to Home
            navigate('/');

        } catch (err) {
            setError(err.message); // Show backend error message
        } finally {
            setLoading(false);
        }
    };

    const featuredAnime = animeList[featuredIndex];

    return (
        <div className={`h-screen w-full bg-[#0b0c15] flex overflow-hidden font-sans text-white select-none transition-all duration-700 ${!isLogin ? 'flex-row-reverse' : 'flex-row'}`}>
            
            {/* 1. ENHANCED SHOWCASE SECTION */}
            <div className="hidden lg:flex w-1/2 h-full relative overflow-hidden bg-gradient-to-br from-[#08090f] via-[#0b0c15] to-[#0a0d1a] border-x border-white/5">
                {/* Animated background gradient */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-pink-600/10 blur-3xl" />
                </div>

                {/* Featured Anime Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
                    <div className="w-full max-w-xs">
                        {/* Main Featured Poster */}
                        <motion.div 
                            key={featuredIndex}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="relative mb-6 group"
                        >
                            {featuredAnime ? (
                                <>
                                    <div className="aspect-[2/3] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl shadow-blue-500/20 bg-white/5 relative">
                                        <img 
                                            src={featuredAnime.images?.jpg?.large_image_url} 
                                            alt={featuredAnime.title} 
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <button className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600/80 hover:bg-blue-600 rounded-xl backdrop-blur-sm transition-all">
                                                <Play size={16} fill="white" /> Watch Now
                                            </button>
                                        </div>
                                    </div>
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-2xl -z-10" />
                                </>
                            ) : (
                                <div className="aspect-[2/3] rounded-3xl bg-white/5 animate-pulse" />
                            )}
                        </motion.div>

                        {/* Anime Details */}
                        <AnimatePresence mode="wait">
                            {featuredAnime && (
                                <motion.div
                                    key={featuredIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-center"
                                >
                                    <h3 className="text-xl font-bold mb-2 line-clamp-2 text-white">
                                        {featuredAnime.title}
                                    </h3>
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i}
                                                    size={14} 
                                                    className={i < Math.floor(featuredAnime.score / 2) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-400">{featuredAnime.score?.toFixed(1)}/10</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Horizontal Scroll Thumbnails - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#08090f] via-[#08090f]/80 to-transparent z-20 flex items-end overflow-x-auto gap-3 p-4">
                    {animeList.map((anime, idx) => (
                        <motion.button
                            key={idx}
                            onClick={() => setFeaturedIndex(idx)}
                            whileHover={{ scale: 1.05 }}
                            className={`flex-shrink-0 h-20 w-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                idx === featuredIndex 
                                    ? 'border-blue-500 shadow-lg shadow-blue-500/50 scale-105' 
                                    : 'border-white/20 opacity-60 hover:opacity-100'
                            }`}
                        >
                            <img 
                                src={anime.images?.jpg?.image_url} 
                                alt={anime.title}
                                className="w-full h-full object-cover"
                            />
                        </motion.button>
                    ))}
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-20 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl -z-10" />
            </div>

            {/* 2. IMPROVED FORM SECTION */}
            <div 
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="flex-1 h-full flex items-center justify-center p-6 md:p-12 relative overflow-y-auto bg-gradient-to-br from-[#0b0c15] via-[#0a0d1a] to-[#0b0c15]"
            >
                {/* Mobile Background */}
                <div className="lg:hidden absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] to-transparent" />
                </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-[420px] bg-gradient-to-br from-[#1a1c25]/50 to-[#131620]/50 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/60 mx-4 my-auto hover:border-white/20 transition-all duration-300"
            >

                {/* Header */}
                <div className="text-center mb-8">
                    
                    <h2 className="text-3xl font-black text-white mb-1">
                        {isLogin ? 'Welcome Back' : 'Join the Guild'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {isLogin ? 'Enter your credentials to access your account' : 'Start your anime journey with Zenkai'}
                    </p>
                </div>

                {/* ERROR MESSAGE BANNER */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center gap-2 text-red-200 text-sm font-semibold"
                        >
                            <AlertCircle size={16} />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative"
                            >
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                                <input
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={onChange}
                                    placeholder="Username"
                                    className="w-full bg-white/5 border border-white/15 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white/10 focus:shadow-lg focus:shadow-blue-500/20 transition-all"
                                    required
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            placeholder="Email Address"
                            className="w-full bg-white/5 border border-white/15 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white/10 focus:shadow-lg focus:shadow-blue-500/20 transition-all"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={onChange}
                            placeholder="Password"
                            className="w-full bg-white/5 border border-white/15 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white/10 focus:shadow-lg focus:shadow-blue-500/20 transition-all"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Password Strength Meter (Registration Only) */}
                    {!isLogin && password.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2 px-1"
                        >
                            <div className="flex gap-1.5 h-2">
                                {[1, 2, 3, 4].map((level) => (
                                    <div 
                                        key={level}
                                        className={`h-full flex-1 rounded-full transition-all duration-500 ${
                                            level <= strength 
                                                ? strength === 1 ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]' 
                                                : strength === 2 ? 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]'
                                                : strength === 3 ? 'bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.6)]'
                                                : 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]'
                                                : 'bg-white/10'
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                                Strength: <span className={
                                    strength === 1 ? 'text-red-500' :
                                    strength === 2 ? 'text-orange-500' :
                                    strength === 3 ? 'text-yellow-500' :
                                    'text-green-500'
                                }>
                                    {strength === 1 && 'Weak'}
                                    {strength === 2 && 'Fair'}
                                    {strength === 3 && 'Good'}
                                    {strength === 4 && 'Strong'}
                                </span>
                            </p>
                        </motion.div>
                    )}

                    {isLogin && (
                        <div className="flex justify-end">
                            <motion.button 
                                whileHover={{ x: 2 }}
                                type="button" 
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                            >
                                Forgot Password?
                            </motion.button>
                        </div>
                    )}

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} />
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#1a1c25] px-4 text-gray-500 font-bold tracking-widest">Or continue with</span>
                    </div>
                </div>

                {/* Social Buttons (Visual Only) */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/15 rounded-2xl transition-all text-xs font-black uppercase tracking-widest text-white hover:border-white/30"
                    >
                        <Chrome size={16} /> Google
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/15 rounded-2xl transition-all text-xs font-black uppercase tracking-widest text-white hover:border-white/30"
                    >
                        <Github size={16} /> GitHub
                    </motion.button>
                </div>

                {/* Footer Switcher */}
                <p className="mt-8 text-center text-sm text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError(''); // Clear errors when switching modes
                            setFormData({ username: '', email: '', password: '' }); // Reset form
                        }}
                        className="ml-2 text-blue-400 hover:text-blue-300 font-bold transition-colors"
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </motion.button>
                </p>

            </motion.div>
            </div>
        </div>
    );
};

export default Login;