import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import ResponsiveImage from './ResponsiveImage'

const ProductItem = ({ id, name, price, originalPrice, discountInfo, image }) => {
  const { currency, wishlist, toggleWishlist } = useContext(ShopContext);

  const handleClick = () => {
    // Scroll to top when navigating to new product
    window.scrollTo(0, 0);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    toggleWishlist(id);
  };

  const inWishlist = wishlist?.includes(id);

  return (
    <Link 
      to={`/product/${id}`} 
      onClick={handleClick}
      className='group block cursor-pointer tactile-card glass-panel rounded-2xl overflow-hidden relative'
    >
      <button 
        onClick={handleWishlistClick} 
        className='absolute top-4 left-4 z-20 p-2 rounded-full bg-white/70 hover:bg-white backdrop-blur transition-all text-[#C96A3C] shadow-sm'
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill={inWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>
      {discountInfo && (
        <div className='absolute top-4 right-4 z-10 bg-[#C96A3C] text-white px-3 py-1 text-[10px] tracking-widest uppercase font-bold rounded-sm shadow-sm'>
          {discountInfo.type === 'percentage' ? `${discountInfo.value}% OFF` : `SAVE ${currency}${discountInfo.value}`}
        </div>
      )}
      <div className='overflow-hidden bg-[#FDFBF8] aspect-[3/4] relative'>
        <ResponsiveImage 
          className='w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:scale-110 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700 ease-out' 
          src={image[0]} 
          alt={name} 
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className='absolute inset-0 bg-gradient-to-t from-[#F8F5F1] to-transparent opacity-50 group-hover:opacity-20 transition-opacity duration-500'></div>
      </div>
      <div className='p-6 flex flex-col items-center text-center'>
        <p className='font-sans text-[10px] tracking-widest uppercase text-[#C96A3C] mb-2 font-medium'>{name}</p>
        <div className='flex gap-3 items-center'>
            {originalPrice && originalPrice > price && (
                <p className='font-serif text-sm text-gray-400 line-through'>{currency}{originalPrice}</p>
            )}
            <p className='font-serif text-lg text-[#2C2723] group-hover:text-[#C96A3C] transition-colors duration-300'>{currency}{price}</p>
        </div>
      </div>
    </Link>
  )
}

export default ProductItem
