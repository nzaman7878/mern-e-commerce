import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/admin/dashboard', {
        headers: { token }
      })

      if (response.data.success) {
        setStats(response.data.stats)
        setRecentOrders(response.data.recentOrders)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchDashboardData()
    }
  }, [token])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6 w-full font-sans'>
      <h2 className='text-3xl font-semibold text-gray-800 mb-2'>Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        
        {/* Revenue Card */}
        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4'>
          <div className='w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl font-bold'>
            {currency}
          </div>
          <div>
            <p className='text-gray-500 text-sm font-medium uppercase'>Total Revenue</p>
            <p className='text-2xl font-bold text-gray-800'>{currency}{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Orders Card */}
        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4'>
          <div className='w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold'>
            📦
          </div>
          <div>
            <p className='text-gray-500 text-sm font-medium uppercase'>Total Orders</p>
            <p className='text-2xl font-bold text-gray-800'>{stats.totalOrders.toLocaleString()}</p>
          </div>
        </div>

        {/* Products Card */}
        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4'>
          <div className='w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl font-bold'>
            🛍️
          </div>
          <div>
            <p className='text-gray-500 text-sm font-medium uppercase'>Total Products</p>
            <p className='text-2xl font-bold text-gray-800'>{stats.totalProducts.toLocaleString()}</p>
          </div>
        </div>

        {/* Users Card */}
        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4'>
          <div className='w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xl font-bold'>
            👥
          </div>
          <div>
            <p className='text-gray-500 text-sm font-medium uppercase'>Active Users</p>
            <p className='text-2xl font-bold text-gray-800'>{stats.totalUsers.toLocaleString()}</p>
          </div>
        </div>

      </div>

      {/* Recent Actionable Orders */}
      <div className='mt-6 bg-white border border-gray-200 rounded-xl shadow-sm'>
        <div className='px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl flex justify-between items-center'>
          <h3 className='text-lg font-semibold text-gray-800'>Recent Actionable Orders</h3>
          <span className='text-sm text-gray-500'>Pending & Packing</span>
        </div>
        
        <div className='p-0 overflow-x-auto'>
          {recentOrders.length === 0 ? (
            <p className='text-center py-10 text-gray-500'>No pending orders to process right now.</p>
          ) : (
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='text-gray-500 text-sm border-b border-gray-200 bg-white'>
                  <th className='px-6 py-4 font-medium'>Customer</th>
                  <th className='px-6 py-4 font-medium'>Items</th>
                  <th className='px-6 py-4 font-medium'>Amount</th>
                  <th className='px-6 py-4 font-medium'>Status</th>
                  <th className='px-6 py-4 font-medium'>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className='border-b border-gray-100 hover:bg-gray-50 transition-colors'>
                    <td className='px-6 py-4'>
                      <p className='font-medium text-gray-800'>{order.address.firstname} {order.address.lastname}</p>
                      <p className='text-sm text-gray-500'>{order.address.city}, {order.address.country}</p>
                    </td>
                    <td className='px-6 py-4 text-gray-600'>
                      {order.items.length} item{order.items.length > 1 && 's'}
                    </td>
                    <td className='px-6 py-4 font-semibold text-gray-800'>
                      {currency}{order.amount}
                    </td>
                    <td className='px-6 py-4'>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Packing' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-gray-500 text-sm'>
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  )
}

export default Dashboard
