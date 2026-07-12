import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='px-6 md:px-12 lg:px-24 py-20 mt-32 border-t border-[#2C2723]/10 bg-[#F8F5F1] text-[#2C2723]'>
      <div className='flex flex-col md:flex-row justify-between gap-16'>
        
        {/* Brand / Logo Replacement */}
        <div className='md:w-1/2'>
          <h2 className='font-serif text-5xl md:text-7xl mb-8 leading-none'>
            Snazzy<br />
            <span className='italic font-light text-[#7B746E]'>Fit.</span>
          </h2>
          <p className='font-sans text-xs tracking-widest uppercase text-[#7B746E] max-w-xs leading-loose'>
            Curated essentials for the modern aesthetic. Designed with intent.
          </p>
        </div>

        {/* Links */}
        <div className='flex gap-16 md:gap-32'>
          <div>
            <p className='font-sans text-xs tracking-[0.2em] uppercase mb-8 font-semibold'>Index</p>
            <ul className='flex flex-col gap-4 font-serif text-lg italic text-gray-600'>
              <li><Link to="/" onClick={() => window.scrollTo(0,0)} className='editorial-link'>Home</Link></li>
              <li><Link to="/collection" onClick={() => window.scrollTo(0,0)} className='editorial-link'>Collection</Link></li>
              <li><Link to="/about" onClick={() => window.scrollTo(0,0)} className='editorial-link'>About</Link></li>
              <li><Link to="/journal" onClick={() => window.scrollTo(0,0)} className='editorial-link'>Journal</Link></li>
            </ul>
          </div>
          <div>
            <p className='font-sans text-xs tracking-[0.2em] uppercase mb-8 font-semibold'>Connect</p>
            <ul className='flex flex-col gap-4 font-serif text-lg italic text-gray-600'>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className='editorial-link'>Instagram</a></li>
              <li><a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className='editorial-link'>Pinterest</a></li>
              <li><Link to="/contact" onClick={() => window.scrollTo(0,0)} className='editorial-link'>Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className='mt-32 pt-8 border-t border-[#2C2723]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans tracking-widest uppercase text-[#7B746E]'>
        <p>© 2026 SNAZZYFIT ARCHIVE.</p>
        <p>ALL RIGHTS RESERVED.</p>
      </div>
    </div>
  );
};

export default Footer;
