import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Coupons = ({ token }) => {
  const [coupons, setCoupons] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    expirationDate: '',
    minOrderValue: 0,
    usageLimit: '',
    isActive: true
  })

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/coupons/list', { headers: { token } })
      if (response.data.success) {
        setCoupons(response.data.coupons)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) fetchCoupons()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...formData, usageLimit: formData.usageLimit === '' ? null : Number(formData.usageLimit) }
      const response = await axios.post(backendUrl + '/api/coupons/add', payload, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchCoupons()
        setShowForm(false)
        setFormData({ code: '', type: 'percentage', value: '', expirationDate: '', minOrderValue: 0, usageLimit: '', isActive: true })
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const response = await axios.post(backendUrl + '/api/coupons/delete', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchCoupons()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleActive = async (coupon) => {
    try {
      const payload = { ...coupon, isActive: !coupon.isActive }
      const response = await axios.post(backendUrl + '/api/coupons/update', { ...payload, id: coupon._id }, { headers: { token } })
      if (response.data.success) {
        toast.success('Status updated')
        fetchCoupons()
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
        <h1 className='text-2xl font-semibold text-slate-800'>Coupons</h1>
        <button onClick={() => setShowForm(!showForm)} className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition'>
          {showForm ? 'Cancel' : 'Add Coupon'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Code</label>
              <input type="text" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} className='w-full border rounded-md p-2' />
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
              <label className='block text-sm font-medium mb-1'>Min Order Value</label>
              <input type="number" value={formData.minOrderValue} onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})} className='w-full border rounded-md p-2' />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Expiration Date</label>
              <input type="date" required value={formData.expirationDate} onChange={(e) => setFormData({...formData, expirationDate: e.target.value})} className='w-full border rounded-md p-2' />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Usage Limit (leave empty for unlimited)</label>
              <input type="number" value={formData.usageLimit} onChange={(e) => setFormData({...formData, usageLimit: e.target.value})} className='w-full border rounded-md p-2' />
            </div>
          </div>
          <button type="submit" className='bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition'>Save Coupon</button>
        </form>
      )}

      <div className='bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm text-slate-600'>
            <thead className='bg-slate-50 border-b border-gray-200 text-slate-800 font-medium'>
              <tr>
                <th className='px-6 py-4'>Code</th>
                <th className='px-6 py-4'>Value</th>
                <th className='px-6 py-4'>Expires</th>
                <th className='px-6 py-4'>Min Order</th>
                <th className='px-6 py-4'>Usage</th>
                <th className='px-6 py-4'>Status</th>
                <th className='px-6 py-4'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {coupons.map(coupon => (
                <tr key={coupon._id}>
                  <td className='px-6 py-4 font-bold text-slate-900'>{coupon.code}</td>
                  <td className='px-6 py-4'>{coupon.value}{coupon.type === 'percentage' ? '%' : ' currency'}</td>
                  <td className='px-6 py-4'>{new Date(coupon.expirationDate).toLocaleDateString()}</td>
                  <td className='px-6 py-4'>{coupon.minOrderValue}</td>
                  <td className='px-6 py-4'>{coupon.usedCount} / {coupon.usageLimit || '∞'}</td>
                  <td className='px-6 py-4'>
                    <button onClick={() => toggleActive(coupon)} className={`px-2 py-1 rounded text-xs ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className='px-6 py-4'>
                    <button onClick={() => handleDelete(coupon._id)} className='text-red-600 hover:underline'>Delete</button>
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

export default Coupons
