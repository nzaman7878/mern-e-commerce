import React from 'react'
import NewsletterBox from '../components/NewsletterBox'
import { assets } from '../assets/frontend_assets/assets'

const Journal = () => {
  return (
    <div className='bg-[#F8F5F1] text-[#2C2723] min-h-screen pt-32 pb-24'>
      
      {/* Header Section */}
      <div className='text-center px-6 md:px-24 mb-24'>
        <h1 className='font-serif text-5xl lg:text-7xl leading-none'>
          The <span className='italic font-light text-[#7B746E]'>Journal.</span>
        </h1>
        <p className='font-sans text-xs tracking-widest uppercase text-[#7B746E] mt-8'>
          Editorial / Fall 2026
        </p>
      </div>

      {/* Main Featured Article */}
      <div className='px-6 md:px-12 lg:px-24 mb-32'>
        <div className='w-full'>
          <img 
            className='w-full h-auto object-cover aspect-[21/9] grayscale hover:grayscale-0 transition-all duration-[2s] ease-out mb-12' 
            src={assets.hero_img} 
            alt="Editorial cover" 
          />
        </div>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='font-serif text-4xl lg:text-5xl mb-8'>A Return to Minimalism</h2>
          <p className='font-serif text-lg leading-loose text-gray-600 mb-12'>
            In an era of excess, we find sanctuary in the essential. The new Fall collection explores the intersection of brutalist architecture and soft, sustainable fabrics. We strip away the unnecessary to reveal the pure form beneath. 
          </p>
          <button className='bg-transparent border border-[#2C2723] text-[#2C2723] px-12 py-4 font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#2C2723] hover:text-[#F8F5F1] transition-colors'>
            Read Full Essay
          </button>
        </div>
      </div>

      {/* Grid of Articles */}
      <div className='px-6 md:px-12 lg:px-24 mb-32'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24'>
          
          <div className='flex flex-col group cursor-pointer'>
            <div className='overflow-hidden mb-8'>
              <img 
                className='w-full h-auto object-cover aspect-[4/5] grayscale group-hover:scale-105 transition-all duration-[2s] ease-out' 
                src={assets.about_img} 
                alt="Studio visit" 
              />
            </div>
            <h3 className='font-sans text-xs tracking-widest uppercase text-[#7B746E] mb-4'>Behind the Seams</h3>
            <h2 className='font-serif text-3xl mb-4'>The Studio Visit</h2>
            <p className='font-serif text-gray-600 leading-relaxed mb-6'>
              An exclusive look into our atelier in the heart of the city, where every piece is conceptualized and prototyped.
            </p>
            <span className='font-sans text-[10px] tracking-widest uppercase border-b border-[#2C2723] pb-1 w-max'>Read More</span>
          </div>

          <div className='flex flex-col group cursor-pointer'>
            <div className='overflow-hidden mb-8'>
              <img 
                className='w-full h-auto object-cover aspect-[4/5] grayscale group-hover:scale-105 transition-all duration-[2s] ease-out' 
                src={assets.contact_img} 
                alt="Sustainable practices" 
              />
            </div>
            <h3 className='font-sans text-xs tracking-widest uppercase text-[#7B746E] mb-4'>Sustainability</h3>
            <h2 className='font-serif text-3xl mb-4'>Sourcing with Intent</h2>
            <p className='font-serif text-gray-600 leading-relaxed mb-6'>
              Our commitment to ethical fashion starts with the raw materials. How we choose our fabrics for longevity.
            </p>
            <span className='font-sans text-[10px] tracking-widest uppercase border-b border-[#2C2723] pb-1 w-max'>Read More</span>
          </div>

        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default Journal
