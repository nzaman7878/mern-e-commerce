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
      className='text-gray-700 cursor-pointer block'
    >
      <div className='overflow-hidden'>
        <img 
          className='hover:scale-110 transition ease-in-out' 
          src={image[0]} 
          alt={name} 
        />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem
