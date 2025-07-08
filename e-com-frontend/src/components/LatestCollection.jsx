import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 12));
  }, [products]); // Added products as dependency

  return (
    <div className='my-10'>
      <div className='text-center py-8 px-4 sm:px-8'>
        <Title text1={'LATEST'} text2={'COLLECTIONS'} />
        <p className='mt-4 max-w-[800px] mx-auto text-xs sm:text-base text-gray-600'>
          Discover our latest collection of products that are designed to elevate your style and
          comfort. From trendy apparel to must-have accessories, explore the freshest additions
          to our store that cater to every taste and occasion.
        </p>
      </div>

      {/* Rendering Products */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-6 px-5 sm:px-10'>
        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
