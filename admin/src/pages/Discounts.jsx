import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Discounts = ({ token }) => {
  const [discounts, setDiscounts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'percentage',
    value: '',
    targetType: 'sitewide',
    targetIds: '',
    startDate: '',
    endDate: '',
    isActive: true
  })

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/discounts/list', { headers: { token } })
      if (response.data.success) {
        setDiscounts(response.data.discounts)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) fetchDiscounts()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...formData, targetIds: formData.targetIds.split(',').map(id => id.trim()).filter(id => id) }
      if (editId) payload.id = editId
      
      const endpoint = editId ? '/api/discounts/update' : '/api/discounts/add'
      const response = await axios.post(backendUrl + endpoint, payload, { headers: { token } })
      
      if (response.data.success) {
        toast.success(response.data.message)
        fetchDiscounts()
        setShowForm(false)
        setEditId(null)
        setFormData({ name: '', type: 'percentage', value: '', targetType: 'sitewide', targetIds: '', startDate: '', endDate: '', isActive: true })
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleEdit = (discount) => {
    setEditId(discount._id);
    setFormData({
      name: discount.name,
      type: discount.type,
      value: discount.value,
      targetType: discount.targetType,
      targetIds: discount.targetIds ? discount.targetIds.join(', ') : '',
      startDate: new Date(discount.startDate).toISOString().split('T')[0],
      endDate: new Date(discount.endDate).toISOString().split('T')[0],
      isActive: discount.isActive
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const response = await axios.post(backendUrl + '/api/discounts/delete', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchDiscounts()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleActive = async (discount) => {
    try {
      const payload = { ...discount, isActive: !discount.isActive }
      const response = await axios.post(backendUrl + '/api/discounts/update', { ...payload, id: discount._id }, { headers: { token } })
      if (response.data.success) {
        toast.success('Status updated')
        fetchDiscounts()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-semibold text-slate-800'>Product Discounts</h1>
        <button onClick={() => {
            setShowForm(!showForm);
            if(showForm) {
                setEditId(null);
                setFormData({ name: '', type: 'percentage', value: '', targetType: 'sitewide', targetIds: '', startDate: '', endDate: '', isActive: true })
            }
        }} className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition'>
          {showForm ? 'Cancel' : 'Add Discount'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className='w-full border rounded-md p-2' />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Type</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className='w-full border rounded-md p-2'>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Value</label>
              <input type="number" required value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} className='w-full border rounded-md p-2' />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Target Type</label>
              <select value={formData.targetType} onChange={(e) => setFormData({...formData, targetType: e.target.value})} className='w-full border rounded-md p-2'>
                <option value="sitewide">Sitewide</option>
                <option value="category">Category</option>
                <option value="subCategory">SubCategory</option>
                <option value="product">Specific Product</option>
              </select>
            </div>
            {formData.targetType !== 'sitewide' && (
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium mb-1'>Target IDs (comma separated Product IDs or Categories)</label>
                <input type="text" value={formData.targetIds} onChange={(e) => setFormData({...formData, targetIds: e.target.value})} className='w-full border rounded-md p-2' />
              </div>
            )}
            <div>
              <label className='block text-sm font-medium mb-1'>Start Date</label>
              <input type="date" required value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className='w-full border rounded-md p-2' />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>End Date</label>
              <input type="date" required value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className='w-full border rounded-md p-2' />
            </div>
          </div>
          <button type="submit" className='bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition'>
            {editId ? 'Update Discount' : 'Save Discount'}
          </button>
        </form>
      )}

      <div className='bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-slate-600'>
            <thead className='bg-slate-50 border-b border-gray-200 text-slate-800 font-medium'>
              <tr>
                <th className='px-6 py-4'>Name</th>
                <th className='px-6 py-4'>Value</th>
                <th className='px-6 py-4'>Target</th>
                <th className='px-6 py-4'>Valid Period</th>
                <th className='px-6 py-4'>Status</th>
                <th className='px-6 py-4'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {discounts.map(discount => (
                <tr key={discount._id}>
                  <td className='px-6 py-4 font-medium text-slate-900'>{discount.name}</td>
                  <td className='px-6 py-4'>{discount.value}{discount.type === 'percentage' ? '%' : ' currency'}</td>
                  <td className='px-6 py-4 capitalize'>{discount.targetType}</td>
                  <td className='px-6 py-4'>
                    {new Date(discount.startDate).toLocaleDateString()} - {new Date(discount.endDate).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4'>
                    <button onClick={() => toggleActive(discount)} className={`px-2 py-1 rounded text-xs ${discount.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className='px-6 py-4 flex gap-3'>
                    <button onClick={() => handleEdit(discount)} className='text-blue-600 hover:underline'>Edit</button>
                    <button onClick={() => handleDelete(discount._id)} className='text-red-600 hover:underline'>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Discounts
