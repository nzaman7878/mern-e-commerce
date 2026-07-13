import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Server Error")
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Server Error")
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  // Filter and Pagination logic
  const filteredList = list.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const displayedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex flex-col sm:flex-row justify-between items-center mb-2'>
        <p className='text-lg font-semibold'>All Products List</p>
        <div className='flex gap-2 w-full sm:w-auto mt-2 sm:mt-0'>
          <input
            type="text"
            placeholder="Search products..."
            className='border px-3 py-1.5 rounded w-full sm:w-64 focus:outline-none focus:border-blue-500'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className='border px-3 py-1.5 rounded focus:outline-none focus:border-blue-500'
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
      </div>
      
      <div className='flex flex-col gap-2'>
        {/* Header row */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-3 border bg-gray-100 text-sm font-semibold rounded'>
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className='text-center'>Action</span>
        </div>
        
        {/* Product list */}
        {displayedList.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No products found.</p>
        ) : (
          displayedList.map((item) => (
            <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-2 px-3 border border-gray-100 rounded text-sm hover:bg-gray-50 transition-colors' key={item._id}>
              <img className='w-12 h-12 object-cover rounded' src={item.image[0]} alt="" />
              <p className="truncate">{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <div className='flex justify-end md:justify-center gap-3'>
                <Link to={`/edit/${item._id}`} className='text-blue-500 hover:text-blue-700 cursor-pointer text-sm font-semibold'>Edit</Link>
                <p onClick={() => removeProduct(item._id)} className='cursor-pointer text-lg text-red-500 hover:text-red-700'>X</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className={`px-4 py-2 border rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'}`}
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className={`px-4 py-2 border rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default List
