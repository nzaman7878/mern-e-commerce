import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  
  // Discount Fields
  const [discountType, setDiscountType] = useState('percentage')
  const [discountValue, setDiscountValue] = useState('')
  const [discountStartDate, setDiscountStartDate] = useState('')
  const [discountEndDate, setDiscountEndDate] = useState('')
  const [subCategoriesList, setSubCategoriesList] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/category/list')
        if (response.data.success) {
          const all = response.data.categories
          setCategoriesList(all.filter(c => c.type === 'category'))
          setSubCategoriesList(all.filter(c => c.type === 'subCategory'))
        }
      } catch (error) {
        console.error("Failed to fetch categories", error)
      }
    }
    fetchCategories()
  }, [])

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      image1 && formData.append('image1', image1);
      image2 && formData.append('image2', image2);
      image3 && formData.append('image3', image3);
      image4 && formData.append('image4', image4);

      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      formData.append('sizes', JSON.stringify(sizes));

      if (discountValue) {
        formData.append('discountType', discountType);
        formData.append('discountValue', discountValue);
        formData.append('discountStartDate', discountStartDate);
        formData.append('discountEndDate', discountEndDate);
      }

      const response = await axios.post(
        backendUrl + '/api/product/add',
        formData,
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setPrice('')
        setCategory('')
        setSubCategory('')
        setBestseller(false)
        setSizes([])
        setImage1(null)
        setImage2(null)
        setImage3(null)
        setImage4(null)
        setDiscountValue('')
        setDiscountStartDate('')
        setDiscountEndDate('')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <div className='flex flex-col w-full max-w-4xl font-sans'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-slate-900'>Add New Product</h2>
        <p className='text-slate-500 mt-1 text-sm'>Create a new product in your catalog.</p>
      </div>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-8'>
        
        {/* Media Section */}
        <div className='bg-white p-6 border border-gray-200 rounded-2xl shadow-sm'>
          <h3 className='text-base font-semibold text-slate-900 mb-4'>Product Media</h3>
          <p className='text-sm text-slate-500 mb-4'>Upload up to 4 images for this product.</p>
          <div className='flex flex-wrap gap-4'>
            {[
              { id: 'image1', state: image1, set: setImage1 },
              { id: 'image2', state: image2, set: setImage2 },
              { id: 'image3', state: image3, set: setImage3 },
              { id: 'image4', state: image4, set: setImage4 },
            ].map((imgItem) => (
              <label key={imgItem.id} htmlFor={imgItem.id} className='cursor-pointer group'>
                <div className='w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden group-hover:border-slate-400 transition-colors'>
                  <img 
                    className={imgItem.state ? 'w-full h-full object-cover' : 'w-8 h-8 opacity-50'} 
                    src={!imgItem.state ? assets.upload_area : URL.createObjectURL(imgItem.state)} 
                    alt="Upload" 
                  />
                </div>
                <input onChange={(e) => imgItem.set(e.target.files[0])} type="file" id={imgItem.id} hidden />
              </label>
            ))}
          </div>
        </div>

        {/* Basic Info Section */}
        <div className='bg-white p-6 border border-gray-200 rounded-2xl shadow-sm space-y-6'>
          <h3 className='text-base font-semibold text-slate-900'>Basic Information</h3>
          
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Product Name</label>
            <input 
              onChange={(e) => setName(e.target.value)} 
              value={name} 
              type="text" 
              className='w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all bg-gray-50 focus:bg-white text-sm' 
              placeholder='e.g., Classic White T-Shirt' 
              required 
            />
          </div>
          
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Description</label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className='w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all bg-gray-50 focus:bg-white text-sm min-h-[120px]'
              placeholder='Describe the product details...'
              required
            />
          </div>
        </div>

        {/* Organization & Pricing */}
        <div className='bg-white p-6 border border-gray-200 rounded-2xl shadow-sm space-y-6'>
          <h3 className='text-base font-semibold text-slate-900'>Pricing & Organization</h3>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Category</label>
              <select onChange={(e) => setCategory(e.target.value)} className='w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all bg-gray-50 focus:bg-white text-sm cursor-pointer'>
                <option value="">Select...</option>
                {categoriesList.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Subcategory</label>
              <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all bg-gray-50 focus:bg-white text-sm cursor-pointer'>
                <option value="">Select...</option>
                {subCategoriesList.map(sub => (
                  <option key={sub._id} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Price</label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium'>$</span>
                <input
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  className='w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all bg-gray-50 focus:bg-white text-sm'
                  type="number"
                  placeholder='0.00'
                  required
                />
              </div>
            </div>
          </div>

          <div className='pt-2'>
            <label className='block text-sm font-medium text-slate-700 mb-3'>Available Sizes</label>
            <div className='flex flex-wrap gap-3'>
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <div 
                  key={size} 
                  onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}
                  className={`w-12 h-10 flex items-center justify-center rounded-lg font-medium text-sm cursor-pointer transition-colors border ${
                    sizes.includes(size) 
                      ? "bg-slate-900 text-white border-slate-900" 
                      : "bg-white text-slate-600 border-gray-200 hover:border-slate-400 hover:bg-gray-50"
                  }`}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          <div className='pt-4 pb-2'>
            <label className='flex items-center gap-3 cursor-pointer group'>
              <input
                type="checkbox"
                id="bestseller"
                checked={bestseller}
                onChange={() => setBestseller(prev => !prev)}
                className='w-5 h-5 rounded border-gray-300 text-slate-900 focus:ring-slate-900'
              />
              <span className='text-sm font-medium text-slate-700 group-hover:text-slate-900'>Mark as Bestseller</span>
            </label>
          </div>
        </div>

        {/* Product Discount Section */}
        <div className='bg-white p-6 border border-gray-200 rounded-2xl shadow-sm space-y-6'>
          <h3 className='text-base font-semibold text-slate-900'>Product Discount (Optional)</h3>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Discount Type</label>
              <select onChange={(e) => setDiscountType(e.target.value)} value={discountType} className='w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all bg-gray-50 focus:bg-white text-sm cursor-pointer'>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Discount Value</label>
              <input
                onChange={(e) => setDiscountValue(e.target.value)}
                value={discountValue}
                className='w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all bg-gray-50 focus:bg-white text-sm'
                type="number"
                placeholder='e.g., 20'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Start Date</label>
              <input
                onChange={(e) => setDiscountStartDate(e.target.value)}
                value={discountStartDate}
                className='w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all bg-gray-50 focus:bg-white text-sm'
                type="date"
                required={!!discountValue}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>End Date</label>
              <input
                onChange={(e) => setDiscountEndDate(e.target.value)}
                value={discountEndDate}
                className='w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all bg-gray-50 focus:bg-white text-sm'
                type="date"
                required={!!discountValue}
              />
            </div>
          </div>
        </div>

        <div className='flex justify-end pt-2 pb-10'>
          <button type='submit' className='bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-medium shadow-sm transition-colors text-sm'>
            Create Product
          </button>
        </div>
      </form>
    </div>
  )
}

export default Add
