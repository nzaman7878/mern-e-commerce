import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Edit = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)
  
  const [existingImages, setExistingImages] = useState([])

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/product/single', {
          params: { productId: id }
        })
        
        if (response.data.success) {
          const product = response.data.product
          setName(product.name)
          setDescription(product.description)
          setPrice(product.price)
          setCategory(product.category)
          setSubCategory(product.subCategory)
          setBestseller(product.bestseller)
          setSizes(product.sizes)
          setExistingImages(product.image || [])
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        toast.error("Error fetching product")
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchProduct()
    }
  }, [id])

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      formData.append('id', id);
      
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

      const response = await axios.post(
        backendUrl + '/api/product/update',
        formData,
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/list')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  if (loading) return <p>Loading product...</p>

  return (
    <div className='flex flex-col w-full items-start gap-3'>
      <h2 className='text-2xl font-semibold mb-4'>Edit Product</h2>
      <form onSubmit={onSubmitHandler} >
        <div>
          <p className='mb-2'>Upload Images (Leave blank to keep existing images)</p>
          <div className='flex gap-2 mb-2'>
             {existingImages.map((img, i) => (
                <img key={i} src={img} alt={`Existing ${i}`} className="w-16 h-16 object-cover border border-gray-300 rounded" />
             ))}
          </div>
          <div className='flex gap-2'>
            <label htmlFor="image1">
              <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
              <input onChange={(e) => setImage1(e.target.files[0])} type="file" id='image1' hidden />
            </label>
            <label htmlFor="image2">
              <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
              <input onChange={(e) => setImage2(e.target.files[0])} type="file" id='image2' hidden />
            </label>
            <label htmlFor="image3">
              <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
              <input onChange={(e) => setImage3(e.target.files[0])} type="file" id='image3' hidden />
            </label>
            <label htmlFor="image4">
              <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
              <input onChange={(e) => setImage4(e.target.files[0])} type="file" id='image4' hidden />
            </label>
          </div>
        </div>
        <div className='w-full mt-4'>
          <p className='mb-2'>Product Name</p>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full max-w-[500px] px-3 py-2 border rounded' placeholder='Enter product name' required />
        </div>
        <div className='w-full mt-4'>
          <p className='mb-2'>Product description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className='w-full max-w-[500px] px-3 py-2 border rounded'
            placeholder='write content here'
            required
            rows="4"
          />
        </div>
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8 mt-4'>
          <div>
            <p className='mb-2'>Product category</p>
            <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2 border rounded' >
              <option value="">Select...</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <p className='mb-2'>Sub category</p>
            <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2 border rounded' >
              <option value="">Select...</option>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>
          <div>
            <p className='mb-2'>Product Price</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className='w-full px-3 py-2 border rounded sm:w-[120px]'
              type="number"
              placeholder='25'
              required
            />
          </div>
        </div>
        <div className='mt-4'>
          <p>Product Sizes</p>
          <div className='flex gap-3 mt-2'>
            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <div key={size} onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}>
                <p className={`${sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer rounded`}>{size}</p>
              </div>
            ))}
          </div>
        </div>
        <div className='flex gap-2 mt-6'>
          <input
            type="checkbox"
            id="bestseller"
            checked={bestseller}
            onChange={() => setBestseller(prev => !prev)}
          />
          <label className='cursor-pointer font-medium' htmlFor="bestseller">Add to bestseller</label>
        </div>
        <div className='flex gap-4'>
          <button type='submit' className='w-28 py-3 mt-4 bg-black text-white rounded'>UPDATE</button>
          <button type='button' onClick={() => navigate('/list')} className='w-28 py-3 mt-4 bg-gray-200 text-black rounded'>CANCEL</button>
        </div>
      </form>
    </div>
  )
}

export default Edit
