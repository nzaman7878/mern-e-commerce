import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const ProductItem = ({ id, name, price, originalPrice, discountInfo, image }) => {
  const { currency } = useContext(ShopContext);

  const handleClick = () => {
    // Scroll to top when navigating to new product
    window.scrollTo(0, 0);
  };

  return (
    <Link 
      to={`/product/${id}`} 
      onClick={handleClick}
      className='group block cursor-pointer tactile-card glass-panel rounded-2xl overflow-hidden relative'
    >
      {discountInfo && (
        <div className='absolute top-4 right-4 z-10 bg-[#C96A3C] text-white px-3 py-1 text-[10px] tracking-widest uppercase font-bold rounded-sm shadow-sm'>
          {discountInfo.type === 'percentage' ? `${discountInfo.value}% OFF` : `SAVE ${currency}${discountInfo.value}`}
        </div>
      )}
      <div className='overflow-hidden bg-[#FDFBF8] aspect-[3/4] relative'>
        <img 
          className='w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:scale-110 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700 ease-out' 
          src={image[0]} 
          alt={name} 
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
