import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'

import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="About SnazzyFit" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>SnazzyFit was born out of a passion for innovation and a desire to revolutionize the way people shop for fashion online. We believe that everyone deserves access to high-quality, stylish clothing that makes them feel confident and comfortable.</p>
          
          <p>Since our inception, we've worked tirelessly to curate a diverse selection of trendy and timeless pieces from both established and emerging brands. Our commitment to quality, affordability, and customer satisfaction has made us a trusted destination for fashion enthusiasts worldwide.</p>
          
          <b className='text-gray-700'>Our Mission</b>
          <p>Our mission at SnazzyFit is to empower customers with choice, convenience, and confidence in their fashion decisions. We strive to provide an exceptional shopping experience through our carefully curated collections, competitive prices, and outstanding customer service.</p>
        </div>
      </div>
      
      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 md:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Our team of experts ensures that every product meets our highest standards of quality and craftsmanship. We partner only with trusted suppliers and conduct thorough quality checks before items reach our customers.</p>
        </div>
        
        <div className='border px-10 md:px-16 py-8 md:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier. Enjoy features like quick checkout, multiple payment options, and fast, reliable delivery right to your doorstep.</p>
        </div>
        
        <div className='border px-10 md:px-16 py-8 md:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Our team of dedicated professionals is here to assist you every step of the way. From product inquiries to post-purchase support, we're committed to ensuring your complete satisfaction with every interaction.</p>
        </div>
      </div>
      
      <NewsletterBox />
    </div>
  )
}

export default About
