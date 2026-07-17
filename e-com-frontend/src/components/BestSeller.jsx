import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { ProductSkeleton } from './Skeleton';

const BestSeller = () => {
  const { backendUrl } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/product/list?bestseller=true&limit=5');
        if (response.data.success) {
          setBestSeller(response.data.products);
        }
      } catch (error) {
        console.error('Failed to fetch bestsellers', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, [backendUrl]);

  return (
    <div className='my-10 px-4 sm:px-8'>
      <div className='text-center text-3xl py-8'>
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className='mt-4 max-w-[800px] mx-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Explore our most popular products loved by our customers. Hand-picked bestsellers that combine quality, comfort, and trending designs—all in one place.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {loading ? (
           [...Array(5)].map((_, idx) => <ProductSkeleton key={idx} />)
        ) : (
           bestSeller.map((item, index) => (
             <ProductItem
               key={index}
               id={item._id}
               image={item.image}
               name={item.name}
               price={item.price}
               originalPrice={item.originalPrice}
               discountInfo={item.discountInfo}
             />
           ))
        )}
      </div>
    </div>
  );
};

export default BestSeller;
