import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Mail, ArrowRight, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0b0c15] border-t border-white/5 pt-20 pb-10 font-sans">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* 1. BRAND COLUMN (Span 4) */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 cursor-pointer group mb-6">
              <div className="relative w-10 h-10 flex items-center justify-center rounded-xl transform group-hover:rotate-6 transition-transform duration-300">
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
            <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
              Your ultimate gateway to the anime universe. Discover hidden gems, track your watchlist, and join a community of passionate fans.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={Twitter} href="#" />
              <SocialLink icon={Github} href="#" />
              <SocialLink icon={Instagram} href="#" />
            </div>
          </div>

          {/* 2. EXPLORE COLUMN (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6">Explore</h4>
            <ul className="space-y-4">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/movies" label="Top Movies" />
              <FooterLink to="/series" label="Anime Series" />
              <FooterLink to="/discover" label="Search Anime" />
            </ul>
          </div>

          {/* 3. GENRES COLUMN (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6">Categories</h4>
            <ul className="space-y-4">
              <FooterLink to="/genres" label="All Genres" />
              <FooterLink to="/genre/1/Action" label="Action" />
              <FooterLink to="/genre/22/Romance" label="Romance" />
              <FooterLink to="/genre/10/Fantasy" label="Fantasy" />
            </ul>
          </div>

          {/* 4. ACCOUNT COLUMN (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6">Account</h4>
            <ul className="space-y-4">
              <FooterLink to="/profile" label="My Profile" />
              <FooterLink to="/profile/watchlist" label="Watchlist" />
              <FooterLink to="/profile/favorites" label="Favorites" />
              <FooterLink to="/login" label="Login / Sign Up" />
            </ul>
          </div>

          {/* 5. NEWSLETTER (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6">Stay Updated</h4>
            <p className="text-gray-500 text-sm mb-4">Get the latest anime news right in your inbox.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 Zenkai Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <span>Powered by</span>
            <a href="https://jikan.moe/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Jikan API</a>
            <span>& Made with</span>
            <Heart size={12} className="text-red-500 fill-current" />
          </div>
        </div>

      </div>
    </footer>
  );
};

// Helper Components
const FooterLink = ({ to, label }) => (
  <li>
    <Link to={to} className="text-gray-400 hover:text-blue-400 transition-colors text-sm font-medium">
      {label}
    </Link>
  </li>
);

const SocialLink = ({ icon: Icon, href }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
  >
    <Icon size={18} />
  </a>
);

export default Footer;