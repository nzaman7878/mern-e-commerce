import React from 'react';

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
    
  };

  return (
    <div className='text-center px-4 sm:px-0'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
      <p className='text-gray-500 mt-3'>
        Join our newsletter to receive exclusive offers, style tips, and updates on the latest arrivals.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 pr-1 py-1 rounded-full shadow-sm'
      >
        <input
          className='w-full py-4 px-3 outline-none text-sm text-gray-700'
          type='email'
          placeholder='Enter your email'
          required
        />
        <button
          type='submit'
          className='bg-black text-white text-xs font-medium px-6 py-4 rounded-full hover:bg-gray-800 transition'
        >
          SUBSCRIBE NOW
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
