import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);

  return (
    <div className='my-10 px-4 sm:px-8'>
      <Title text1={'LATEST'} text2={'COLLECTIONS'} />
      <p className='mt-4 max-w-[800px] mx-auto text-xs sm:text-base text-gray-600 text-center'>
        Discover our latest collection of products that are designed to elevate your style and
        comfort. From trendy apparel to must-have accessories, explore the freshest additions
        to our store that cater to every taste and occasion.
      </p>

      
    </div>
  );
};

export default LatestCollection;
