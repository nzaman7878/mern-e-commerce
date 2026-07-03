import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const ProductItem = ({ id, name, price, image }) => {
  const { currency } = useContext(ShopContext);

  const handleClick = () => {
    // Scroll to top when navigating to new product
    window.scrollTo(0, 0);
  };

  return (
    <Link 
      to={`/product/${id}`} 
      onClick={handleClick}
      className='group block cursor-pointer'
    >
      <div className='overflow-hidden bg-[#F9F9F7] aspect-[3/4]'>
        <img 
          className='w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[2s] ease-out' 
          src={image[0]} 
          alt={name} 
        />
      </div>
      <div className='mt-6 flex flex-col items-center text-center'>
        <p className='font-sans text-xs tracking-[0.2em] uppercase text-gray-500 mb-2'>{name}</p>
        <p className='font-serif text-lg text-[#2A2A2A]'>{currency}{price}</p>
      </div>
    </Link>
  )
}

export default ProductItem
