import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  const fetchProductData = useCallback(() => {
    if (products.length > 0) {
      const foundProduct = products.find(item => item._id === productId);
      if (foundProduct) {
        setProductData(foundProduct);
        setSelectedImage(foundProduct.image[0]);
      } else {
        setProductData(null);
      }
    }
  }, [productId, products]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  if (productData === null) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Product not found</p>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Image Gallery */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img 
                onClick={() => setSelectedImage(item)} 
                src={item} 
                key={index} 
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border ${selectedImage === item ? 'border-orange-500' : 'border-transparent'}`} 
                alt={`Product view ${index + 1}`} 
              />
            ))}
          </div>

          <div className='w-full sm:w-[80%]'>
            <img 
              className='w-full h-auto max-h-[500px] object-contain' 
              src={selectedImage} 
              alt={productData.name} 
            />
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            {[...Array(4)].map((_, i) => (
              <img 
                src={i < 3 ? assets.star_icon : assets.star_dull_icon} 
                className='w-3.5' 
                alt="Rating star" 
                key={i}
              />
            ))}
            <p className='pl-2'>(122)</p>
          </div>
          
          <p className='mt-5 text-3xl font-medium'>
            {currency}{productData.price.toLocaleString()}
          </p>
          
          <p className='mt-5 text-gray-500 md:w-4/5'>
            {productData.description}
          </p>
          
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2 flex-wrap'>
              {productData.sizes.map((item, index) => (
                <button 
                  onClick={() => setSelectedSize(item)} 
                  className={`border py-2 px-4 bg-gray-100 text-sm ${item === selectedSize ? 'border-orange-500 bg-orange-50' : ''}`} 
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 hover:bg-gray-800 transition-colors'
            disabled={!selectedSize}
          >
            {selectedSize ? 'ADD TO CART' : 'SELECT SIZE'}
          </button>
          
          <hr className='mt-8 sm:w-4/5' />
          
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original Product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description & Review Section */}
      <div className='mt-20'>
        <div className='flex border-b'>
          <button 
            className={`px-5 py-3 text-sm ${activeTab === 'description' ? 'font-bold border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`px-5 py-3 text-sm ${activeTab === 'reviews' ? 'font-bold border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews (122)
          </button>
        </div>
        
        <div className='px-6 py-6 text-sm text-gray-500'>
          {activeTab === 'description' ? (
            <>
              <p className='mb-4'>
                An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. 
                It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, 
                and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity 
                due to their convenience, accessibility, and the global reach they offer.
              </p>
              <p>
                E-commerce websites typically display products or services along with detailed descriptions, images, prices, 
                and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.
              </p>
            </>
          ) : (
            <div className='flex flex-col gap-4'>
              <p>Reviews coming soon!</p>
            </div>
          )}
        </div>
      </div>
          {/* Display related product */}

          <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  );
}

export default Product;