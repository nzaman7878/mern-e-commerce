import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Reviews = ({ token }) => {
  const [reviews, setReviews] = useState([])

  const fetchReviews = async () => {
    if (!token) return null;

    try {
      const response = await axios.post(backendUrl + '/api/reviews/admin/all', {}, { headers: { token } })
      
      if (response.data.success) {
        setReviews(response.data.reviews)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const response = await axios.post(backendUrl + '/api/reviews/admin/delete', { reviewId }, { headers: { token } })
      
      if (response.data.success) {
        toast.success(response.data.message)
        fetchReviews()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [token])

  const renderStars = (rating) => {
    return (
      <span className="text-yellow-500">
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </span>
    )
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-semibold text-slate-800'>Reviews Moderation</h1>
      </div>
      
      <div className='bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200'>
        <div className='overflow-x-auto'>
          <table className='w-full whitespace-nowrap text-left text-sm text-slate-600'>
            <thead className='bg-slate-50 border-b border-gray-200 text-slate-800 font-medium'>
              <tr>
                <th className='px-6 py-4'>Reviewer</th>
                <th className='px-6 py-4'>Product ID</th>
                <th className='px-6 py-4'>Rating</th>
                <th className='px-6 py-4'>Comment</th>
                <th className='px-6 py-4'>Date</th>
                <th className='px-6 py-4'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {reviews.map((review, index) => (
                <tr key={index} className='hover:bg-slate-50/50 transition-colors'>
                  <td className='px-6 py-4 font-medium text-slate-900'>{review.userName}</td>
                  <td className='px-6 py-4'>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-500">
                      {review.productId}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-base'>{renderStars(review.rating)}</td>
                  <td className='px-6 py-4 whitespace-normal max-w-xs'>
                    <p className="line-clamp-2 text-gray-500">{review.reviewText}</p>
                  </td>
                  <td className='px-6 py-4'>{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td className='px-6 py-4'>
                    <button 
                      onClick={() => deleteReview(review._id)} 
                      className='text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-xs font-medium transition-colors'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reviews.length === 0 && (
            <div className='text-center py-12 text-slate-500'>
              No reviews found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reviews
