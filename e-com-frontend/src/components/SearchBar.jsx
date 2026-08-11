import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch, backendUrl, currency } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes('collection')) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/product/search-suggestions?query=${search}`);
        if (response.data.success) {
          setSuggestions(response.data.suggestions);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, backendUrl]);

  if (!showSearch || !visible) return null;

  return (
    <div className='fixed top-0 left-0 w-full z-50 bg-[#F8F5F1]/95 backdrop-blur-md py-12 px-6 md:px-24 shadow-sm border-b border-[#2C2723]/10 animate-fade-in'>
      
      <div className='max-w-4xl mx-auto relative flex items-center'>
        
        {/* Massive Input */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full bg-transparent border-b-2 border-[#2C2723] py-4 text-3xl md:text-5xl font-serif italic text-[#2C2723] outline-none placeholder:text-gray-300'
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

      {/* Search Suggestions */}
      {search.trim() && (
        <div className='max-w-4xl mx-auto mt-6 bg-white border border-[#2C2723]/10 shadow-lg rounded-xl overflow-hidden max-h-[60vh] overflow-y-auto'>
          {loading ? (
            <div className='p-6 text-center text-sm font-sans text-gray-500'>Loading...</div>
          ) : suggestions.length > 0 ? (
            <div className='flex flex-col'>
              {suggestions.map((item) => (
                <div 
                  key={item._id} 
                  onClick={() => {
                    navigate(`/product/${item._id}`);
                    setShowSearch(false);
                    setSearch('');
                  }}
                  className='flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b border-[#2C2723]/5 last:border-0 transition-colors'
                >
                  <img src={item.image[0]} alt={item.name} className='w-12 h-16 object-cover rounded-md' />
                  <div className='flex flex-col'>
                    <p className='font-serif text-lg text-[#2C2723]'>{item.name}</p>
                    <div className='flex items-center gap-2'>
                       {item.originalPrice && item.originalPrice > item.price && (
                         <p className='font-sans text-[10px] tracking-widest text-gray-400 line-through'>{currency}{item.originalPrice}</p>
                       )}
                       <p className='font-sans text-xs tracking-widest text-[#7B746E]'>{currency}{item.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='p-6 text-center text-sm font-sans text-gray-500'>No pieces found matching "{search}"</div>
          )}
        </div>
      )}

    </div>
  );
};

export default SearchBar;
