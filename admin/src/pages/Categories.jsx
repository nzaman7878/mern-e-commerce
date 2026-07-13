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
    <div className='flex flex-col gap-8 w-full max-w-4xl'>
      <div>
        <h2 className='text-2xl font-semibold mb-4'>Category Management</h2>
        <p className='text-gray-600 mb-6'>Add or remove main categories and subcategories dynamically.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        
        {/* Main Categories */}
        <div className='bg-white p-6 border rounded-lg shadow-sm'>
          <h3 className='text-lg font-semibold mb-4 border-b pb-2'>Main Categories</h3>
          
          <div className='flex gap-2 mb-4'>
            <input 
              type="text" 
              placeholder="e.g., Men, Electronics..." 
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              className='flex-1 border px-3 py-2 rounded outline-none focus:border-blue-500'
            />
            <button 
              onClick={() => addCategory('category', catName, setCatName)}
              className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors'
            >
              Add
            </button>
          </div>

          <div className='flex flex-col gap-2 max-h-80 overflow-y-auto'>
            {categories.length === 0 ? (
              <p className='text-sm text-gray-500'>No categories found.</p>
            ) : (
              categories.map(c => (
                <div key={c._id} className='flex justify-between items-center bg-gray-50 px-3 py-2 border rounded'>
                  <span>{c.name}</span>
                  <button onClick={() => removeCategory(c._id)} className='text-red-500 hover:text-red-700 font-bold'>&times;</button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sub Categories */}
        <div className='bg-white p-6 border rounded-lg shadow-sm'>
          <h3 className='text-lg font-semibold mb-4 border-b pb-2'>Sub Categories</h3>
          
          <div className='flex gap-2 mb-4'>
            <input 
              type="text" 
              placeholder="e.g., Topwear, Footwear..." 
              value={subCatName}
              onChange={(e) => setSubCatName(e.target.value)}
              className='flex-1 border px-3 py-2 rounded outline-none focus:border-blue-500'
            />
            <button 
              onClick={() => addCategory('subCategory', subCatName, setSubCatName)}
              className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors'
            >
              Add
            </button>
          </div>

          <div className='flex flex-col gap-2 max-h-80 overflow-y-auto'>
            {subCategories.length === 0 ? (
              <p className='text-sm text-gray-500'>No subcategories found.</p>
            ) : (
              subCategories.map(c => (
                <div key={c._id} className='flex justify-between items-center bg-gray-50 px-3 py-2 border rounded'>
                  <span>{c.name}</span>
                  <button onClick={() => removeCategory(c._id)} className='text-red-500 hover:text-red-700 font-bold'>&times;</button>
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
