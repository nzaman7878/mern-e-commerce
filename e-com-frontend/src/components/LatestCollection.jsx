import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const LatestCollection = () => {
    const {products} = useContext(ShopContext);
    
  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'></div>
      <Title  text1={'LATEST'} text2={'COLLECTIONS'}/>
      <p className='w-3/4 m-auto text-xs sm:text-base text-gray-600'>
        Discover our latest collection of products that are designed to elevate your style and 
        comfort. From trendy apparel to must-have accessories, explore the freshest additions 
        to our store that cater to every taste and occasion. 
      </p>
    </div>
  )
}

export default LatestCollection
