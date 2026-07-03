import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  const fetchProductData = useCallback(() => {
    if (products.length > 0) {
      const foundProduct = products.find(item => item._id === productId);
      if (foundProduct) {
        setProductData(foundProduct);
      } else {
        setProductData(null);
      }
    }
  }, [productId, products]);

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0);
  }, [fetchProductData]);

  if (productData === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F9F9F7]">
        <p className="font-serif italic text-2xl text-gray-400">Item not found in archive.</p>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F9F9F7]">
        <div className="animate-spin rounded-full h-8 w-8 border-t border-[#2A2A2A]"></div>
      </div>
    );
  }

  return (
    <div className='bg-[#F9F9F7] text-[#2A2A2A] transition-opacity ease-in duration-500 opacity-100 min-h-screen pt-32 pb-24'>
      
      <div className='flex flex-col md:flex-row gap-12 lg:gap-24 px-6 md:px-12 lg:px-24'>
        
        {/* Editorial Vertical Image Stack */}
        <div className='w-full md:w-3/5 flex flex-col gap-8'>
          {productData.image.map((item, index) => (
            <div key={index} className='w-full bg-gray-100 overflow-hidden'>
              <img 
                src={item} 
                className='w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-[2s] ease-out' 
                alt={`Product view ${index + 1}`} 
              />
            </div>
          ))}
        </div>

        {/* Sticky Product Info */}
        <div className='w-full md:w-2/5'>
          <div className='md:sticky md:top-32'>
            <div className='mb-12'>
              <p className='font-sans text-xs tracking-[0.2em] uppercase text-gray-500 mb-4'>Archive / {productData.category}</p>
              <h1 className='font-serif text-5xl lg:text-7xl leading-none mb-6'>{productData.name}</h1>
              <p className='font-serif text-3xl italic text-gray-500'>
                {currency}{productData.price.toLocaleString()}
              </p>
            </div>
            
            <p className='font-sans text-sm leading-loose text-gray-600 mb-12'>
              {productData.description}
            </p>
            
            <div className='mb-12'>
              <p className='font-sans text-xs tracking-widest uppercase mb-4'>Select Size</p>
              <div className='flex gap-4 flex-wrap'>
                {productData.sizes.map((item, index) => (
                  <button 
                    onClick={() => setSelectedSize(item)} 
                    className={`font-sans text-sm w-12 h-12 border ${item === selectedSize ? 'border-[#2A2A2A] bg-[#2A2A2A] text-[#F9F9F7]' : 'border-gray-300 hover:border-[#2A2A2A]'} transition-colors`} 
                    key={index}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            
            <button  
              onClick={() => addToCart(productData._id, selectedSize)}
              className='w-full bg-[#2A2A2A] text-[#F9F9F7] py-5 font-sans text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={!selectedSize}
            >
              {selectedSize ? 'Add to Archive' : 'Select Size'}
            </button>
            
            <div className='mt-16 pt-8 border-t border-[#2A2A2A]/10 text-xs font-sans tracking-widest uppercase text-gray-500 flex flex-col gap-4'>
              <p>100% Original Documented Piece.</p>
              <p>Cash on delivery available.</p>
              <p>7-Day Return Policy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Review Section */}
      <div className='mt-32 px-6 md:px-12 lg:px-24 max-w-4xl'>
        <div className='flex gap-12 border-b border-[#2A2A2A]/10 pb-4 mb-8'>
          <button 
            className={`font-sans text-xs tracking-widest uppercase ${activeTab === 'description' ? 'text-[#2A2A2A] font-bold' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => setActiveTab('description')}
          >
            Details
          </button>
          <button 
            className={`font-sans text-xs tracking-widest uppercase ${activeTab === 'reviews' ? 'text-[#2A2A2A] font-bold' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reflections (122)
          </button>
        </div>
        
        <div className='font-serif text-lg leading-loose text-gray-600'>
          {activeTab === 'description' ? (
            <div className='space-y-6'>
              <p>
                An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. 
                It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, 
                and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity 
                due to their convenience, accessibility, and the global reach they offer.
              </p>
              <p>
                E-commerce websites typically display products or services along with detailed descriptions, images, prices, 
                and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.
              </p>
            </div>
          ) : (
            <div>
              <p className='italic text-gray-400'>Reflections are currently being curated.</p>
            </div>
          )}
        </div>
      </div>

      <div className='mt-32'>
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>

    </div>
  );
}

export default Product;