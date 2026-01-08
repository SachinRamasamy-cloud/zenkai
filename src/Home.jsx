import React from 'react';
import Hero from './pages/dash/hero';
import ContentRow from './pages/dash/ContentRow';

const Home = () => {
  return (
    <>
      {/* HERO SECTION */}
      <div className="relative z-0">
        <Hero />
      </div>

      {/* CONTENT STACK */}
      <div className="relative z-10 flex flex-col pb-20 
                      mt-6 gap-8 
                      md:-mt-12 md:gap-12 
                      lg:gap-16">
        
        <ContentRow 
          title="Trending Now" 
          endpoint="/top/anime" 
          params={{ filter: 'airing', limit: 10 }} 
        />

        <ContentRow 
          title="Top Upcoming" 
          endpoint="/top/anime" 
          params={{ filter: 'upcoming', limit: 10 }} 
        />

        <ContentRow
          title="All Time Favorites" 
          endpoint="/top/anime" 
          params={{ filter: 'bypopularity', limit: 10 }} 
        />
        
         <ContentRow
          title="Top Movies" 
          endpoint="/top/anime" 
          params={{ type: 'movie', limit: 10 }} 
        />
      </div>
    </>
  );
};

export default Home;