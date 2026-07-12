import React from 'react'

const OurPolicy = () => {
  return (
    <div className='py-24 px-6 md:px-12 lg:px-24 bg-[#F8F5F1] text-[#2C2723]'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24'>
        
        <div className='flex flex-col gap-4 border-t border-[#2C2723] pt-6'>
          <h3 className='font-sans text-xs tracking-widest uppercase'>Easy Exchange</h3>
          <p className='font-serif italic text-[#7B746E]'>We offer a hassle-free, complimentary exchange policy on all archival pieces.</p>
        </div>

        <div className='flex flex-col gap-4 border-t border-[#2C2723] pt-6'>
          <h3 className='font-sans text-xs tracking-widest uppercase'>7-Day Return</h3>
          <p className='font-serif italic text-[#7B746E]'>Enjoy peace of mind with our complimentary 7-day return policy.</p>
        </div>

        <div className='flex flex-col gap-4 border-t border-[#2C2723] pt-6'>
          <h3 className='font-sans text-xs tracking-widest uppercase'>Client Services</h3>
          <p className='font-serif italic text-[#7B746E]'>Our dedicated client support team is available 24/7 for all inquiries.</p>
        </div>

      </div>
    </div>
  )
}

export default OurPolicy
