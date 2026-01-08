import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Clock, User, Menu, X, LogIn, LogOut, Compass } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Auth State
    const [user, setUser] = useState(null);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setShowUserDropdown(false);
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    // 1. ADDED "DISCOVER" FOR SEARCH NAVIGATION
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Movies', href: '/movies' },
        { name: 'Series', href: '/series' },
        { name: 'Genres', href: '/genres' },
        { name: 'Discover', href: '/discover' }, // Search Page
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-[#0b0c15]/90 backdrop-blur-md shadow-lg py-4'
                    : 'bg-gradient-to-b from-black/80 to-transparent py-6'
                    }`}
            >
                <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex items-center justify-between">

                    {/* LOGO */}
                    <Link to="/" className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative w-12 h-12 flex items-center justify-center rounded-xl transform group-hover:rotate-6 transition-transform duration-300">

                            {/* FIX: Use direct path starting with / */}
                            <img
                                src="/zenkai.png"
                                alt="Zenkai Logo"
                                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            />

                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">
                            ZENKAI
                        </span>
                    </Link>
                    {/* DESKTOP LINKS */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* RIGHT ACTIONS */}
                    <div className="hidden lg:flex items-center gap-6">
                        <Link to="/discover" className="text-gray-300 hover:text-white transition-colors" title="Search">
                            <Search size={22} />
                        </Link>

                        {user ? (
                            // LOGGED IN STATE
                            <div className="flex items-center gap-4">

                                {/* 2. FIXED WATCHLIST & HISTORY LINKS */}
                                <Link to="/profile/watchlist" className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white bg-white/5 px-3 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10">
                                    <Heart size={16} className="text-pink-500 fill-pink-500/20" />
                                    <span className="uppercase tracking-wide">Watchlist</span>
                                </Link>

                                <Link to="/profile/bookmarks" className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white bg-white/5 px-3 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10">
                                    <Clock size={16} className="text-blue-400" />
                                    <span className="uppercase tracking-wide">History</span>
                                </Link>

                                {/* USER DROPDOWN */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                                        className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full hover:bg-blue-600/30 transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg uppercase">
                                            {user.username.charAt(0)}
                                        </div>
                                        <span className="text-sm font-semibold text-blue-100 max-w-[100px] truncate">
                                            {user.username}
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {showUserDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-48 bg-[#1a1c25] border border-white/10 rounded-xl shadow-xl overflow-hidden py-1"
                                            >
                                                <div className="px-4 py-3 border-b border-white/5">
                                                    <p className="text-xs text-gray-500">Signed in as</p>
                                                    <p className="text-sm font-bold text-white truncate">{user.email}</p>
                                                </div>

                                                {/* Dropdown Links */}
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setShowUserDropdown(false)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                                                >
                                                    <User size={16} /> Profile
                                                </Link>

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2"
                                                >
                                                    <LogOut size={16} /> Sign Out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            // GUEST STATE
                            <Link
                                to="/login"
                                className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
                            >
                                <LogIn size={18} /> Login
                            </Link>
                        )}
                    </div>

                    {/* MOBILE MENU TOGGLE */}
                    <button
                        className="lg:hidden text-white p-2"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={28} />
                    </button>
                </div>
            </nav>

            {/* MOBILE FULLSCREEN MENU */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed inset-0 z-[60] bg-[#0b0c15] flex flex-col p-6 lg:hidden"
                    >
                        <div className="flex justify-end mb-8">
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 bg-white/10 rounded-full text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-6 text-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-2xl font-bold text-gray-300 hover:text-white"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-12 space-y-4">
                            {user ? (
                                <>
                                    <div className="text-center mb-4">
                                        <p className="text-gray-400 text-sm">Logged in as</p>
                                        <p className="text-xl font-bold text-white">{user.username}</p>
                                    </div>

                                    <Link
                                        to="/profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full py-4 bg-white/5 rounded-xl text-white font-bold flex justify-center gap-2 border border-white/10"
                                    >
                                        <User size={20} className="text-blue-500" /> My Profile
                                    </Link>

                                    <Link
                                        to="/profile/watchlist"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full py-4 bg-white/5 rounded-xl text-white font-bold flex justify-center gap-2 border border-white/10"
                                    >
                                        <Heart size={20} className="text-pink-500" /> Watchlist
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-4 text-red-400 font-bold border border-red-500/20 rounded-xl"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full py-4 bg-blue-600 rounded-xl text-white font-bold text-lg shadow-lg text-center"
                                >
                                    Login Now
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;