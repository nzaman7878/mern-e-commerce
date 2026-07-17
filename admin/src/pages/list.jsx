import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { optimizeImage } from '../utils/imageOptimizer'
import { TableRowSkeleton } from '../components/Skeleton'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [categoriesList, setCategoriesList] = useState([])
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 10

  const fetchList = async (page = 1, search = '', category = 'All') => {
    setLoading(true)
    try {
      let queryUrl = `${backendUrl}/api/product/list?page=${page}&limit=${itemsPerPage}`
      if (search) queryUrl += `&search=${search}`
      if (category !== 'All') queryUrl += `&category=${category}`

      const response = await axios.get(queryUrl)
      if (response.data.success) {
        setList(response.data.products)
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages)
        }
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Server Error")
    } finally {
      setLoading(false)
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
        await fetchList(currentPage, searchTerm, categoryFilter)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Server Error")
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/category/list')
        if (response.data.success) {
          const all = response.data.categories
          setCategoriesList(all.filter(c => c.type === 'category'))
        }
      } catch (error) {
        console.error("Failed to fetch categories", error)
      }
    }
    fetchCategories()
  }, [])

  // Refetch when filters or page change
  // Debounce search slightly for better UX
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchList(currentPage, searchTerm, categoryFilter)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, categoryFilter, currentPage])

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  return (
    <div className='flex flex-col gap-6 w-full font-sans'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-slate-900'>Products</h2>
          <p className='text-slate-500 text-sm mt-1'>Manage your catalog and inventory.</p>
        </div>
        
        <div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
          <input
            type="text"
            placeholder="Search products..."
            className='border border-gray-200 px-4 py-2.5 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all text-sm bg-white shadow-sm'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className='border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all text-sm bg-white shadow-sm cursor-pointer'
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categoriesList.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className='bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse whitespace-nowrap'>
            <thead>
              <tr className='bg-gray-50/50 border-b border-gray-200 text-xs text-slate-500 uppercase tracking-wider'>
                <th className='px-6 py-4 font-semibold w-24'>Image</th>
                <th className='px-6 py-4 font-semibold'>Name</th>
                <th className='px-6 py-4 font-semibold'>Category</th>
                <th className='px-6 py-4 font-semibold'>Price</th>
                <th className='px-6 py-4 font-semibold text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='text-sm divide-y divide-gray-100'>
              {loading ? (
                // Show skeletons while loading
                [...Array(5)].map((_, idx) => <TableRowSkeleton key={idx} />)
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No products found matching your criteria.
                  </td>
                </tr>
              ) : (
                list.map((item) => (
                  <tr key={item._id} className='hover:bg-gray-50/80 transition-colors group'>
                    <td className='px-6 py-3'>
                      <div className='w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-50'>
                        <img className='w-full h-full object-cover' src={optimizeImage(item.image[0])} alt={item.name} />
                      </div>
                    </td>
                    <td className='px-6 py-4 font-medium text-slate-900'>
                      {item.name}
                    </td>
                    <td className='px-6 py-4 text-slate-600'>
                       <span className='px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium'>
                        {item.category}
                       </span>
                    </td>
                    <td className='px-6 py-4 font-medium text-slate-900'>
                      {currency}{item.price}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity'>
                        <Link 
                          to={`/edit/${item._id}`} 
                          className='text-slate-700 hover:text-slate-900 bg-white border border-gray-200 hover:border-slate-300 hover:bg-gray-50 px-3 py-1.5 rounded-md transition-all font-medium text-xs shadow-sm'
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => removeProduct(item._id)} 
                          className='text-red-600 hover:text-red-700 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-md transition-all font-medium text-xs shadow-sm'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50/30">
            <span className="text-sm text-slate-500 font-medium">
              Showing page {currentPage} of {totalPages}
            </span>
            <div className='flex gap-2'>
              <button 
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${currentPage === 1 || loading ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-200 text-slate-700 hover:bg-gray-50 hover:border-slate-300 shadow-sm'}`}
              >
                Previous
              </button>
              <button 
                disabled={currentPage === totalPages || loading}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${currentPage === totalPages || loading ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-200 text-slate-700 hover:bg-gray-50 hover:border-slate-300 shadow-sm'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default List
