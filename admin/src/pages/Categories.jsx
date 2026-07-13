import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Categories = ({ token }) => {
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  
  const [catName, setCatName] = useState('')
  const [subCatName, setSubCatName] = useState('')

  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/category/list')
      if (response.data.success) {
        const all = response.data.categories
        setCategories(all.filter(c => c.type === 'category'))
        setSubCategories(all.filter(c => c.type === 'subCategory'))
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch categories')
    }
  }

  const addCategory = async (type, name, setName) => {
    if (!name.trim()) return toast.error(`Please enter a ${type} name`)
    try {
      const response = await axios.post(
        backendUrl + '/api/category/add',
        { name: name.trim(), type },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        fetchCategories()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to add')
    }
  }

  const removeCategory = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/category/remove',
        { id },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        fetchCategories()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to remove')
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className='flex flex-col gap-8 w-full max-w-5xl font-sans'>
      <div>
        <h2 className='text-2xl font-bold text-slate-900'>Category Management</h2>
        <p className='text-slate-500 mt-1 text-sm'>Add or remove main categories and subcategories dynamically.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        
        {/* Main Categories */}
        <div className='bg-white p-6 border border-gray-200 rounded-2xl shadow-sm'>
          <h3 className='text-lg font-semibold text-slate-900 mb-4'>Main Categories</h3>
          
          <div className='flex gap-3 mb-6'>
            <input 
              type="text" 
              placeholder="e.g., Men, Electronics..." 
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              className='flex-1 border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all text-sm bg-gray-50 focus:bg-white'
            />
            <button 
              onClick={() => addCategory('category', catName, setCatName)}
              className='bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm shadow-sm'
            >
              Add
            </button>
          </div>

          <div className='flex flex-col gap-2 max-h-80 overflow-y-auto pr-1'>
            {categories.length === 0 ? (
              <p className='text-sm text-slate-500 text-center py-4 border border-dashed border-gray-200 rounded-lg'>No categories found.</p>
            ) : (
              categories.map(c => (
                <div key={c._id} className='flex justify-between items-center bg-white px-4 py-3 border border-gray-100 rounded-xl shadow-sm hover:border-gray-200 transition-colors group'>
                  <span className='font-medium text-slate-700'>{c.name}</span>
                  <button 
                    onClick={() => removeCategory(c._id)} 
                    className='text-gray-400 hover:text-red-600 hover:bg-red-50 w-8 h-8 flex items-center justify-center rounded-lg transition-colors'
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sub Categories */}
        <div className='bg-white p-6 border border-gray-200 rounded-2xl shadow-sm'>
          <h3 className='text-lg font-semibold text-slate-900 mb-4'>Sub Categories</h3>
          
          <div className='flex gap-3 mb-6'>
            <input 
              type="text" 
              placeholder="e.g., Topwear, Footwear..." 
              value={subCatName}
              onChange={(e) => setSubCatName(e.target.value)}
              className='flex-1 border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all text-sm bg-gray-50 focus:bg-white'
            />
            <button 
              onClick={() => addCategory('subCategory', subCatName, setSubCatName)}
              className='bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm shadow-sm'
            >
              Add
            </button>
          </div>

          <div className='flex flex-col gap-2 max-h-80 overflow-y-auto pr-1'>
            {subCategories.length === 0 ? (
              <p className='text-sm text-slate-500 text-center py-4 border border-dashed border-gray-200 rounded-lg'>No subcategories found.</p>
            ) : (
              subCategories.map(c => (
                <div key={c._id} className='flex justify-between items-center bg-white px-4 py-3 border border-gray-100 rounded-xl shadow-sm hover:border-gray-200 transition-colors group'>
                  <span className='font-medium text-slate-700'>{c.name}</span>
                  <button 
                    onClick={() => removeCategory(c._id)} 
                    className='text-gray-400 hover:text-red-600 hover:bg-red-50 w-8 h-8 flex items-center justify-center rounded-lg transition-colors'
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Categories
