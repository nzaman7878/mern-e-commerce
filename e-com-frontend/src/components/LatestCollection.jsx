import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 6)); // Just 6 for a curated editorial look
  }, [products]);

  return (
    <div id="collection" className='my-32 px-6 md:px-12 lg:px-24'>
      <div className='flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8'>
        <div className='max-w-2xl'>
          <h2 className='font-serif text-4xl md:text-6xl text-[#2A2A2A] mb-6'>
            Curated <br /><span className='italic font-light text-gray-500'>Selections</span>
          </h2>
          <p className='text-sm text-gray-500 leading-relaxed font-sans max-w-md'>
            Discover our latest collection of products designed to elevate your lifestyle. A blend of minimalist aesthetics and brutalist utility.
          </p>
        </div>
        <div>
           <button className='text-xs uppercase tracking-widest editorial-link whitespace-nowrap'>View Complete Archive</button>
        </div>
      </div>

      {/* Asymmetrical / Editorial Grid */}
      <div className='grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16'>
        {latestProducts.map((item, index) => {
          // Create an asymmetrical layout based on index
          let spanClass = 'md:col-span-4'; // default
          let marginClass = '';

          if (index === 0) {
            spanClass = 'md:col-span-7';
          } else if (index === 1) {
            spanClass = 'md:col-span-4';
            marginClass = 'md:mt-32';
          } else if (index === 2) {
            spanClass = 'md:col-span-5';
            marginClass = 'md:mt-16';
          } else if (index === 3) {
            spanClass = 'md:col-span-7';
            marginClass = 'md:-mt-16';
          } else if (index === 4) {
            spanClass = 'md:col-span-8';
          } else if (index === 5) {
            spanClass = 'md:col-span-4';
            marginClass = 'md:mt-24';
          }

          return (
            <div key={index} className={`${spanClass} ${marginClass}`}>
              <ProductItem
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
                index={index}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LatestCollection;
