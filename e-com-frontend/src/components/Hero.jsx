import React from 'react';
import { assets } from '../assets/frontend_assets/assets';

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400 rounded-lg overflow-hidden'>
      {/* Hero left side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
        <div className='text-[#414141] space-y-4 px-6 sm:px-0'>
          <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
            <p className='font-medium text-sm md:text-base'>OUR BESTSELLERS</p>
          </div>

          <h1 className=' prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>
            Latest Arrivals
          </h1>

          <div className='flex items-center gap-2'>
            <p className='font-semibold text-sm md:text-base cursor-pointer'>
              SHOP NOW
            </p>
            <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
          </div>
        </div>
      </div>

      {/* Hero right side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center'>
        <img
          className='w-full h-auto object-cover'
          src={assets.hero_img}
          alt='Hero'
        />
      </div>
    </div>
  );
};

export default Hero;
