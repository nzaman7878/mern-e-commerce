import React, {  useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [vissible, setVisible] = useState(false)
  const location = useLocation();

  useEffect(()=>{
    if (location.pathname.includes('collection' )) {
        setVisible(true);
    } else {
        setVisible(false);
    }
  },[location])

  return showSearch && vissible ? (
    <div className='border-t border-b bg-gray-50 text-center py-4 relative'>
      <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 mx-3 rounded-full w-full sm:w-1/2'>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='flex-1 outline-none bg-inherit text-sm'
          type='text'
          placeholder='Search...'
        />
        <img className='w-4 ml-2' src={assets.search_icon} alt='search icon' />
      </div>

      <img
        onClick={() => setShowSearch(false)}
        className='absolute right-4 top-5 w-4 cursor-pointer'
        src={assets.cross_icon}
        alt='close'
      />
    </div>
  ) : null;
};

export default SearchBar;
