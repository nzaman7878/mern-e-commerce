import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div className='bg-[#F9F9F7] text-[#2A2A2A] min-h-screen pt-32 pb-24'>
      
      {/* Header Section */}
      <div className='text-center px-6 md:px-24 mb-24'>
        <h1 className='font-serif text-5xl lg:text-7xl leading-none'>
          Reach <span className='italic font-light text-gray-400'>Out.</span>
        </h1>
      </div>
      
      {/* Editorial Split Section */}
      <div className='flex flex-col md:flex-row px-6 md:px-12 lg:px-24 gap-12 lg:gap-24 mb-32 items-center'>
        <div className='w-full md:w-1/2'>
          <img 
            className='w-full h-auto object-cover aspect-[4/5] grayscale hover:grayscale-0 transition-all duration-[2s] ease-out' 
            src={assets.contact_img} 
            alt="Contact SnazzyFit" 
          />
        </div>
        <div className='w-full md:w-1/2 flex flex-col justify-center gap-12 text-gray-600 font-serif text-lg leading-loose'>
          
          <div>
            <h3 className='font-sans text-xs tracking-widest uppercase text-[#2A2A2A] mb-4'>The Studio</h3>
            <p>
              78432 Gauhati Station <br /> 
              Chandmaari 408, India
            </p>
          </div>

          <div>
            <h3 className='font-sans text-xs tracking-widest uppercase text-[#2A2A2A] mb-4'>Direct Line</h3>
            <p>
              Tel: (+91) 576-372-839 <br />
              Email: admin@snazzyfit.com
            </p>
          </div>

          <div>
            <h3 className='font-sans text-xs tracking-widest uppercase text-[#2A2A2A] mb-4'>Careers</h3>
            <p className='mb-8'>
              Join our passionate team and help us revolutionize the fashion industry. 
              Discover exciting career opportunities and grow with us.
            </p>
            <button className='bg-transparent border border-[#2A2A2A] text-[#2A2A2A] px-12 py-4 font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#2A2A2A] hover:text-[#F9F9F7] transition-colors'>
              Explore Roles
            </button>
          </div>

        </div>
      </div>
      
      <NewsletterBox />
    </div>
  )
}

export default Contact
