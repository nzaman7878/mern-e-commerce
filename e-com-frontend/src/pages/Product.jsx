import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';
import { toast } from 'react-toastify';
import { optimizeImage } from '../utils/imageOptimizer';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, token, userData } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  
  // Review state
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const fetchProductData = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/single?productId=${productId}`);
      if (response.data.success) {
        setProductData(response.data.product);
      } else {
        setProductData(null);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      setProductData(null);
    }
  }, [productId, backendUrl]);

  const fetchReviewsData = useCallback(async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/reviews/product/${productId}`);
      if (res.data.success) {
        setReviews(res.data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [productId, backendUrl]);

  const checkReviewEligibility = useCallback(async () => {
    if (!token || !userData) return;
    try {
      const res = await axios.post(`${backendUrl}/api/reviews/can-review`, {
        productId,
        userId: userData._id
      }, { headers: { token } });
      
      if (res.data.success) {
        setCanReview(res.data.canReview);
        setHasReviewed(res.data.hasReviewed);
        if (res.data.review) {
           setUserReview(res.data.review);
           setRating(res.data.review.rating);
           setReviewText(res.data.review.reviewText);
        }
      }
    } catch (error) {
      console.error("Error checking eligibility:", error);
    }
  }, [productId, token, userData, backendUrl]);

  useEffect(() => {
    fetchProductData();
    fetchReviewsData();
    window.scrollTo(0, 0);
  }, [fetchProductData, fetchReviewsData]);

  useEffect(() => {
    checkReviewEligibility();
  }, [checkReviewEligibility]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token || !userData) {
       toast.error("Please login to review");
       return;
    }
    try {
      const endpoint = hasReviewed ? '/api/reviews/update' : '/api/reviews/add';
      const body = hasReviewed 
        ? { reviewId: userReview._id, userId: userData._id, rating, reviewText }
        : { userId: userData._id, productId, rating, reviewText };

      const res = await axios.post(`${backendUrl}${endpoint}`, body, { headers: { token } });
      
      if (res.data.success) {
        toast.success(res.data.message);
        fetchReviewsData();
        checkReviewEligibility();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting review");
    }
  };

  const deleteReview = async () => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    try {
      const res = await axios.post(`${backendUrl}/api/reviews/delete`, { reviewId: userReview._id, userId: userData._id }, { headers: { token } });
      if (res.data.success) {
        toast.success(res.data.message);
        setHasReviewed(false);
        setUserReview(null);
        setRating(5);
        setReviewText('');
        fetchReviewsData();
        checkReviewEligibility();
      } else {
        toast.error(res.data.message);
      }
    } catch(error) {
       toast.error(error.response?.data?.message || "Error deleting review");
    }
  };

  const renderStars = (ratingValue) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= ratingValue ? "text-yellow-500" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (productData === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8F5F1]">
        <p className="font-serif italic text-2xl text-[#7B746E]">Item not found in archive.</p>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8F5F1]">
        <div className="animate-spin rounded-full h-8 w-8 border-t border-[#2C2723]"></div>
      </div>
    );
  }

  return (
    <div className='bg-[#F8F5F1] text-[#2C2723] transition-opacity ease-in duration-500 opacity-100 min-h-screen pt-32 pb-24'>
      
      <div className='flex flex-col md:flex-row gap-12 lg:gap-24 px-6 md:px-12 lg:px-24'>
        
        {/* Editorial Vertical Image Stack */}
        <div className='w-full md:w-3/5 flex flex-col gap-8'>
          {productData.image.map((item, index) => (
            <div key={index} className='w-full bg-gray-100 overflow-hidden'>
              <img 
                src={optimizeImage(item)} 
                className='w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-[2s] ease-out' 
                alt={`Product view ${index + 1}`} 
              />
            </div>
          ))}
        </div>

        {/* Sticky Product Info */}
        <div className='w-full md:w-2/5'>
          <div className='md:sticky md:top-32 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8'>
            <div className='mb-12'>
              <p className='font-sans text-xs tracking-[0.2em] uppercase text-[#7B746E] mb-4'>Archive / {productData.category}</p>
              <h1 className='font-serif text-5xl lg:text-7xl leading-none mb-6'>{productData.name}</h1>
              
              {/* Added Rating Display */}
              <div className='flex items-center gap-4 mb-6'>
                {renderStars(productData.averageRating || 0)}
                <span className='font-sans text-xs text-[#7B746E] uppercase tracking-widest'>({productData.totalReviews || 0} Reviews)</span>
              </div>

              <div className='flex gap-4 items-center'>
                {productData.originalPrice && productData.originalPrice > productData.price && (
                  <p className='font-serif text-2xl italic text-gray-400 line-through'>
                    {currency}{productData.originalPrice.toLocaleString()}
                  </p>
                )}
                <p className='font-serif text-3xl italic text-[#7B746E]'>
                  {currency}{productData.price.toLocaleString()}
                </p>
                {productData.discountInfo && (
                  <div className='bg-[#C96A3C] text-white px-3 py-1 text-[10px] tracking-widest uppercase font-bold rounded-sm shadow-sm ml-2'>
                    {productData.discountInfo.type === 'percentage' 
                      ? `${productData.discountInfo.value}% OFF` 
                      : `SAVE ${currency}${productData.discountInfo.value}`}
                  </div>
                )}
              </div>
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
                    className={`font-sans text-sm w-12 h-12 border ${item === selectedSize ? 'border-[#2C2723] bg-[#2C2723] text-[#F8F5F1]' : 'border-gray-300 hover:border-[#2C2723]'} transition-colors`} 
                    key={index}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            
            <button  
              onClick={() => addToCart(productData._id, selectedSize)}
              className='w-full bg-[#2C2723] text-[#F8F5F1] py-5 font-sans text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={!selectedSize}
            >
              {selectedSize ? 'Add to Archive' : 'Select Size'}
            </button>
            
            <div className='mt-16 pt-8 border-t border-[#2C2723]/10 text-xs font-sans tracking-widest uppercase text-[#7B746E] flex flex-col gap-4'>
              <p>100% Original Documented Piece.</p>
              <p>Cash on delivery available.</p>
              <p>7-Day Return Policy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Review Section */}
      <div className='mt-32 px-6 md:px-12 lg:px-24 max-w-4xl'>
        <div className='flex gap-12 border-b border-[#2C2723]/10 pb-4 mb-8'>
          <button 
            className={`font-sans text-xs tracking-widest uppercase ${activeTab === 'description' ? 'text-[#2C2723] font-bold' : 'text-[#7B746E] hover:text-gray-600'}`}
            onClick={() => setActiveTab('description')}
          >
            Details
          </button>
          <button 
            className={`font-sans text-xs tracking-widest uppercase ${activeTab === 'reviews' ? 'text-[#2C2723] font-bold' : 'text-[#7B746E] hover:text-gray-600'}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reflections ({reviews.length})
          </button>
        </div>
        
        <div className='text-lg leading-loose text-gray-600'>
          {activeTab === 'description' ? (
            <div className='space-y-6 font-serif'>
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
            <div className='flex flex-col gap-12'>
              {/* Review Form */}
              {token && canReview && (
                <div className='bg-white p-8 border border-gray-200'>
                  <h3 className='font-sans text-sm tracking-widest uppercase text-[#2C2723] mb-6'>{hasReviewed ? 'Edit your reflection' : 'Leave a reflection'}</h3>
                  <form onSubmit={submitReview} className='flex flex-col gap-6'>
                    <div>
                      <label className='block font-sans text-xs uppercase tracking-widest text-[#7B746E] mb-2'>Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className={`text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-300"} hover:text-yellow-400 transition-colors`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className='block font-sans text-xs uppercase tracking-widest text-[#7B746E] mb-2'>Review</label>
                      <textarea 
                        className='w-full border border-gray-300 p-4 outline-none focus:border-[#2C2723] font-sans text-sm min-h-[100px]'
                        placeholder='Share your thoughts about this piece...'
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <div className='flex gap-4'>
                      <button type="submit" className='bg-[#2C2723] text-[#F8F5F1] px-8 py-3 font-sans text-xs tracking-widest uppercase hover:bg-black transition-colors'>
                        {hasReviewed ? 'Update Reflection' : 'Post Reflection'}
                      </button>
                      {hasReviewed && (
                         <button type="button" onClick={deleteReview} className='border border-red-200 text-red-500 px-8 py-3 font-sans text-xs tracking-widest uppercase hover:bg-red-50 transition-colors'>
                           Delete Reflection
                         </button>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {!token && (
                 <p className='font-sans text-sm text-[#7B746E]'>Please log in to leave a reflection.</p>
              )}
              {token && !canReview && !hasReviewed && (
                 <p className='font-sans text-sm text-[#7B746E]'>You can only leave a reflection after purchasing and receiving this piece.</p>
              )}

              {/* Reviews List */}
              <div className='flex flex-col gap-8'>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className='border-b border-gray-200 pb-8'>
                      <div className='flex items-center justify-between mb-4'>
                         <div className='flex items-center gap-4'>
                           <p className='font-sans text-sm font-bold text-[#2C2723]'>{review.userName}</p>
                           <span className='bg-green-100 text-green-800 text-[10px] font-sans px-2 py-1 uppercase tracking-widest'>Verified Purchase</span>
                         </div>
                         <p className='font-sans text-xs text-[#7B746E]'>{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className='mb-4'>
                        {renderStars(review.rating)}
                      </div>
                      <p className='font-serif text-base text-gray-600'>{review.reviewText}</p>
                    </div>
                  ))
                ) : (
                  <p className='italic text-[#7B746E] font-serif'>No reflections yet for this piece.</p>
                )}
              </div>
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