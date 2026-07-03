import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('collection')) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  if (!showSearch || !visible) return null;

  return (
    <div className='fixed top-0 left-0 w-full z-50 bg-[#F9F9F7]/95 backdrop-blur-md py-12 px-6 md:px-24 shadow-sm border-b border-[#2A2A2A]/10 animate-fade-in'>
      
      <div className='max-w-4xl mx-auto relative flex items-center'>
        
        {/* Massive Input */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full bg-transparent border-b-2 border-[#2A2A2A] py-4 text-3xl md:text-5xl font-serif italic text-[#2A2A2A] outline-none placeholder:text-gray-300'
          type='text'
          placeholder='Search the archive...'
          autoFocus
        />
        
        {/* Close Button */}
        <button 
          onClick={() => setShowSearch(false)}
          className='absolute right-0 text-xs tracking-[0.2em] font-sans uppercase font-medium hover:opacity-70 transition-opacity'
        >
          Close
        </button>
      </div>

    </div>
  );
};

export default SearchBar;
