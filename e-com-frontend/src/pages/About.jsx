import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div className='bg-[#F9F9F7] text-[#2A2A2A] min-h-screen pt-32 pb-24'>
      
      {/* Header Section */}
      <div className='text-center px-6 md:px-24 mb-24'>
        <h1 className='font-serif text-5xl lg:text-7xl leading-none'>
          The <span className='italic font-light text-gray-400'>Story.</span>
        </h1>
      </div>
      
      {/* Editorial Split Section */}
      <div className='flex flex-col md:flex-row px-6 md:px-12 lg:px-24 gap-12 lg:gap-24 mb-32 items-center'>
        <div className='w-full md:w-1/2'>
          <img 
            className='w-full h-auto object-cover aspect-[4/5] grayscale hover:grayscale-0 transition-all duration-[2s] ease-out' 
            src={assets.about_img} 
            alt="About SnazzyFit" 
          />
        </div>
        <div className='w-full md:w-1/2 flex flex-col justify-center gap-12 text-gray-600 font-serif text-lg leading-loose'>
          <p>
            SnazzyFit was born out of a passion for innovation and a desire to revolutionize the way people shop for fashion online. We believe that everyone deserves access to high-quality, stylish clothing that makes them feel confident and comfortable.
          </p>
          
          <p>
            Since our inception, we've worked tirelessly to curate a diverse selection of trendy and timeless pieces from both established and emerging brands. Our commitment to quality, affordability, and customer satisfaction has made us a trusted destination for fashion enthusiasts worldwide.
          </p>
          
          <div>
            <h3 className='font-sans text-xs tracking-widest uppercase text-[#2A2A2A] mb-4'>Our Mission</h3>
            <p>
              Our mission at SnazzyFit is to empower customers with choice, convenience, and confidence in their fashion decisions. We strive to provide an exceptional shopping experience through our carefully curated collections, competitive prices, and outstanding customer service.
            </p>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className='px-6 md:px-12 lg:px-24 mb-32'>
        <div className='mb-16 border-b border-[#2A2A2A]/10 pb-8'>
          <h2 className='font-serif text-4xl lg:text-5xl'>Why <span className='italic text-gray-400'>Us.</span></h2>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24'>
          <div className='flex flex-col gap-6'>
            <h3 className='font-sans text-xs tracking-widest uppercase border-b border-[#2A2A2A] pb-2 inline-block w-max'>Quality Assurance</h3>
            <p className='text-gray-600 font-serif leading-relaxed'>Our team of experts ensures that every product meets our highest standards of quality and craftsmanship. We partner only with trusted suppliers and conduct thorough quality checks before items reach our customers.</p>
          </div>
          
          <div className='flex flex-col gap-6'>
            <h3 className='font-sans text-xs tracking-widest uppercase border-b border-[#2A2A2A] pb-2 inline-block w-max'>Convenience</h3>
            <p className='text-gray-600 font-serif leading-relaxed'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier. Enjoy features like quick checkout, multiple payment options, and fast, reliable delivery right to your doorstep.</p>
          </div>
          
          <div className='flex flex-col gap-6'>
            <h3 className='font-sans text-xs tracking-widest uppercase border-b border-[#2A2A2A] pb-2 inline-block w-max'>Exceptional Service</h3>
            <p className='text-gray-600 font-serif leading-relaxed'>Our team of dedicated professionals is here to assist you every step of the way. From product inquiries to post-purchase support, we're committed to ensuring your complete satisfaction with every interaction.</p>
          </div>
        </div>
      </div>
      
      <NewsletterBox />
    </div>
  )
}

export default About
