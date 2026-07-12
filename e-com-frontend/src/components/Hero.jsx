import React from 'react';
import { assets } from '../assets/frontend_assets/assets';

const Hero = () => {
  return (
    <div className='relative w-full h-screen min-h-[800px] flex items-center bg-[#F8F5F1] overflow-hidden'>
      {/* Background Aura Gradients */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='aura-glow bg-[#C96A3C] w-[800px] h-[800px] rounded-full top-[-20%] right-[-10%] opacity-20 mix-blend-screen animate-pulse'></div>
        <div className='aura-glow bg-[#6F8466] w-[600px] h-[600px] rounded-full bottom-[-10%] left-[-10%] opacity-30 mix-blend-screen'></div>
      </div>

      {/* Floating Glass Image layer */}
      <div className='absolute right-0 top-0 w-3/4 md:w-1/2 h-full p-8 md:p-16'>
        <div className='w-full h-full relative glass-panel rounded-3xl overflow-hidden rotate-1 hover:rotate-0 transition-transform duration-700 ease-out'>
          <img
            className='w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 hover:scale-105'
            src={assets.hero_img}
            alt='Premium Collection'
          />
          <div className='absolute inset-0 bg-gradient-to-l from-transparent to-[#F8F5F1] opacity-60'></div>
        </div>
      </div>

      {/* Typography Overlay */}
      <div className='relative z-10 w-full px-6 md:px-12 lg:px-24 flex flex-col justify-center h-full'>
        <div className='max-w-4xl space-y-6 md:space-y-12 mt-20 md:mt-0'>
          
          <div className='flex items-center gap-6 opacity-70'>
            <p className='w-12 h-[1px] bg-[#C96A3C]'></p>
            <p className='font-sans text-xs tracking-[0.3em] uppercase text-[#C96A3C]'>2026 Collection</p>
          </div>

          <h1 className='font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.9] text-[#2C2723] -ml-1 md:-ml-2 drop-shadow-2xl'>
            Redefine <br />
            <span className='italic font-light text-[#C96A3C] opacity-90'>the</span> Standard.
          </h1>

          <div className='pt-8 md:pt-16'>
             <a href="#collection" className='group relative inline-flex items-center justify-center gap-4 px-8 py-4 glass-panel rounded-full overflow-hidden transition-all duration-300 hover:border-[#C96A3C]/50 hover:shadow-[0_0_20px_rgba(201,106,60,0.3)]'>
                <div className='absolute inset-0 bg-gradient-to-r from-[#C96A3C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                <p className='relative font-sans text-xs tracking-widest uppercase text-[#2C2723] font-medium'>Explore Collection</p>
                <div className='relative w-8 h-[1px] bg-[#47362A] group-hover:w-12 transition-all duration-500'></div>
             </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
