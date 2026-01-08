import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { loginUser, registerUser } from '../../api/auth';

const Login = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true); // Toggle Login/Signup
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // Store error messages

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const { username, email, password } = formData;

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

    return (
        <div className="min-h-screen bg-[#0b0c15] flex items-center justify-center relative overflow-hidden font-sans text-white">

            {/* 1. CINEMATIC BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images4.alphacoders.com/936/936378.jpg"
                    alt="Background"
                    className="w-full h-full object-cover opacity-40 blur-sm scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-[#0b0c15]/80 to-blue-900/20" />
            </div>

            {/* 2. AUTH CARD */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-[420px] bg-[#1a1c25]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50"
            >

                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-4 group">
                        <div className="w-16 h-16 mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                            <img
                                src="/zenkai.png"
                                alt="Zenkai Logo"
                                className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                            />
                        </div>
                    </Link>
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

                    <AnimatePresence mode="popLayout">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative"
                            >
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={onChange}
                                    placeholder="Username"
                                    className="w-full bg-[#0b0c15]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    required
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            placeholder="Email Address"
                            className="w-full bg-[#0b0c15]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={onChange}
                            placeholder="Password"
                            className="w-full bg-[#0b0c15]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {isLogin && (
                        <div className="flex justify-end">
                            <button type="button" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#151720] px-3 text-gray-500 font-bold tracking-wider">Or continue with</span>
                    </div>
                </div>

                {/* Social Buttons (Visual Only) */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-sm font-bold text-white">
                        <Chrome size={18} /> Google
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-sm font-bold text-white">
                        <Github size={18} /> GitHub
                    </button>
                </div>

                {/* Footer Switcher */}
                <p className="mt-8 text-center text-sm text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError(''); // Clear errors when switching modes
                            setFormData({ username: '', email: '', password: '' }); // Reset form
                        }}
                        className="ml-2 text-blue-400 hover:text-white font-bold transition-colors"
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>

            </motion.div>
        </div>
    );
};

export default Login;