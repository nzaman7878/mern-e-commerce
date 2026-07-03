import React from 'react';
import { assets } from '../assets/frontend_assets/assets';

const Hero = () => {
  return (
    <div className='relative w-full h-screen min-h-[800px] flex items-center bg-[#F9F9F7] pt-20 overflow-hidden'>
      {/* Background Image/Shape layer */}
      <div className='absolute right-0 top-0 w-3/4 md:w-1/2 h-full'>
        <img
          className='w-full h-full object-cover grayscale opacity-90 transition-transform duration-[20s] hover:scale-105'
          src={assets.hero_img}
          alt='Premium Collection'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-[#F9F9F7] via-transparent to-transparent hidden md:block'></div>
        <div className='absolute inset-0 bg-[#F9F9F7]/30 md:hidden'></div>
      </div>

      {/* Typography Overlay */}
      <div className='relative z-10 w-full px-6 md:px-12 lg:px-24 flex flex-col justify-center h-full'>
        <div className='max-w-4xl space-y-6 md:space-y-12 mt-20 md:mt-0'>
          
          <div className='flex items-center gap-6 opacity-70'>
            <p className='w-12 h-[1px] bg-[#2A2A2A]'></p>
            <p className='font-sans text-xs tracking-[0.3em] uppercase'>2026 Collection</p>
          </div>

          <h1 className='font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.9] text-[#2A2A2A] -ml-1 md:-ml-2'>
            Redefine <br />
            <span className='italic font-light text-gray-500'>the</span> Standard.
          </h1>

          <div className='pt-8 md:pt-16'>
             <a href="#collection" className='group flex items-center gap-4 w-max cursor-pointer'>
                <p className='font-sans text-xs tracking-widest uppercase editorial-link'>Explore Collection</p>
                <div className='w-12 h-[1px] bg-[#2A2A2A] group-hover:w-20 transition-all duration-500'></div>
             </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
