import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Heart, Clock, Bookmark, LogOut, Settings, Shield } from 'lucide-react';
import { getMe } from '../../api/auth';

const StatCard = ({ icon: Icon, label, count, color, to, delay }) => (
  <Link to={to} className="block">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-[#1a1c25] border border-white/5 p-6 rounded-2xl hover:border-white/20 hover:bg-[#20222e] transition-all group cursor-pointer relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 ${color}`}>
        <Icon size={80} />
      </div>
      
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${color.replace('text-', 'bg-')}/20 ${color}`}>
        <Icon size={24} />
      </div>
      
      <h3 className="text-3xl font-black text-white mb-1">{count}</h3>
      <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{label}</p>
    </motion.div>
  </Link>
);

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const userData = await getMe(token);
        setUser(userData);
      } catch (error) {
        console.error(error);
        localStorage.removeItem('token'); // Clear invalid token
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen bg-[#0b0c15] flex items-center justify-center text-white">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-[#0b0c15] pt-24 pb-20 px-6 md:px-12 lg:px-24 font-sans text-white">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
        {/* Avatar */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-1">
            <div className="w-full h-full rounded-full bg-[#0b0c15] flex items-center justify-center text-4xl font-black text-white uppercase">
              {user?.username?.charAt(0)}
            </div>
          </div>
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-[#0b0c15]" />
        </div>

        {/* Info */}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl font-black text-white mb-2">{user?.username}</h1>
          <p className="text-gray-400 mb-6 flex items-center justify-center md:justify-start gap-2">
            <Shield size={16} className="text-blue-500" /> Member since 2024
          </p>
          
          <div className="flex gap-4 justify-center md:justify-start">
            <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
              <Settings size={16} /> Edit Profile
            </button>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-sm font-bold hover:bg-red-500/20 transition-colors flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS GRID (Clickable) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={Heart} 
          label="Favorites" 
          count={user?.favorites?.length || 0} 
          color="text-pink-500" 
          to="/profile/favorites"
          delay={0.1}
        />
        <StatCard 
          icon={Clock} 
          label="Watchlist" 
          count={user?.watchlist?.length || 0} 
          color="text-blue-500" 
          to="/profile/watchlist"
          delay={0.2}
        />
        <StatCard 
          icon={Bookmark} 
          label="Bookmarks" 
          count={user?.bookmarks?.length || 0} 
          color="text-yellow-500" 
          to="/profile/bookmarks"
          delay={0.3}
        />
      </div>

    </div>
  );
};

export default Profile;