import React from 'react';

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className='mt-32 border-t border-[#2A2A2A]/10 pt-24 pb-24 text-center px-6 md:px-12 lg:px-24 bg-[#F9F9F7]'>
      <h2 className='font-serif text-5xl lg:text-7xl text-[#2A2A2A] leading-none mb-6'>Join the <br/><span className='italic font-light text-gray-400'>Archive.</span></h2>
      <p className='font-sans text-sm text-gray-500 mb-16 max-w-lg mx-auto'>
        Subscribe to receive early access to new collections, exclusive editorial content, and unique offers.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-2xl mx-auto flex flex-col sm:flex-row gap-6'
      >
        <input
          className='w-full bg-transparent border-b border-[#2A2A2A]/30 py-4 text-center sm:text-left text-lg font-serif italic text-[#2A2A2A] outline-none placeholder:text-gray-400 focus:border-[#2A2A2A] transition-colors'
          type='email'
          placeholder='Your email address'
          required
        />
        <button
          type='submit'
          className='bg-[#2A2A2A] text-[#F9F9F7] text-xs font-sans tracking-[0.2em] uppercase px-12 py-5 hover:bg-black transition-colors shrink-0'
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
