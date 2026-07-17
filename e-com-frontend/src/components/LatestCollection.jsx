import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import { ProductSkeleton } from './Skeleton';

const LatestCollection = () => {
  const { backendUrl } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/product/list?limit=6');
        if (response.data.success) {
          setLatestProducts(response.data.products);
        }
      } catch (error) {
        console.error('Failed to fetch latest products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, [backendUrl]);

  return (
    <div id="collection" className='relative my-32 px-6 md:px-12 lg:px-24'>
      {/* Background Aura */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-[#C96A3C] rounded-full blur-[150px] opacity-[0.05] pointer-events-none'></div>

      <div className='flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 relative z-10'>
        <div className='max-w-2xl'>
          <h2 className='font-serif text-4xl md:text-6xl text-[#2C2723] mb-6 drop-shadow-lg'>
            Curated <br /><span className='italic font-light text-[#C96A3C] opacity-90'>Selections</span>
          </h2>
          <p className='text-sm text-[#7B746E] leading-relaxed font-sans max-w-md'>
            Discover our latest collection of products designed to elevate your lifestyle. A seamless blend of spatial computing aesthetics and modern utility.
          </p>
        </div>
        <div>
           <button className='group relative text-xs uppercase tracking-widest text-[#2C2723] whitespace-nowrap overflow-hidden px-6 py-3 glass-panel rounded-full hover:border-[#C96A3C]/40 transition-all'>
             <span className='relative z-10'>View Complete Archive</span>
             <div className='absolute inset-0 bg-gradient-to-r from-[#C96A3C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
           </button>
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
              {loading ? (
                 <ProductSkeleton />
              ) : (
                <ProductItem
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  discountInfo={item.discountInfo}
                  index={index}
                />
              )}
            </div>
          );
        })}
        {loading && latestProducts.length === 0 && (
           [...Array(6)].map((_, index) => (
             <div key={index} className="md:col-span-4">
               <ProductSkeleton />
             </div>
           ))
        )}
      </div>
    </div>
  );
};

export default LatestCollection;
