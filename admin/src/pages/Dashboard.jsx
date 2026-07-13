import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

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
    <div className='flex flex-col gap-8 w-full font-sans'>
      <div>
        <h2 className='text-2xl font-bold text-slate-900'>Overview</h2>
        <p className='text-gray-500 text-sm mt-1'>Welcome back. Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Revenue Card */}
        <div className='bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <p className='text-slate-500 text-sm font-semibold uppercase tracking-wider'>Total Revenue</p>
            <div className='w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold'>
              {currency}
            </div>
          </div>
          <div>
            <p className='text-3xl font-bold text-slate-900'>{currency}{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Orders Card */}
        <div className='bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow'>
           <div className='flex items-center justify-between mb-4'>
            <p className='text-slate-500 text-sm font-semibold uppercase tracking-wider'>Total Orders</p>
            <div className='w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-lg'>
              📦
            </div>
          </div>
          <div>
            <p className='text-3xl font-bold text-slate-900'>{stats.totalOrders.toLocaleString()}</p>
          </div>
        </div>

        {/* Products Card */}
        <div className='bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow'>
           <div className='flex items-center justify-between mb-4'>
            <p className='text-slate-500 text-sm font-semibold uppercase tracking-wider'>Products</p>
            <div className='w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 text-lg'>
              🛍️
            </div>
          </div>
          <div>
            <p className='text-3xl font-bold text-slate-900'>{stats.totalProducts.toLocaleString()}</p>
          </div>
        </div>

        {/* Users Card */}
        <div className='bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow'>
           <div className='flex items-center justify-between mb-4'>
            <p className='text-slate-500 text-sm font-semibold uppercase tracking-wider'>Customers</p>
            <div className='w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 text-lg'>
              👥
            </div>
          </div>
          <div>
            <p className='text-3xl font-bold text-slate-900'>{stats.totalUsers.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Recent Actionable Orders */}
      <div className='bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden'>
        <div className='px-6 py-5 border-b border-gray-200 flex justify-between items-center'>
          <h3 className='text-lg font-bold text-slate-900'>Action Required</h3>
          <span className='text-sm text-slate-500 font-medium'>Recent pending orders</span>
        </div>
        
        <div className='overflow-x-auto'>
          {recentOrders.length === 0 ? (
            <div className='text-center py-12'>
               <p className='text-slate-500'>You're all caught up! No pending orders right now.</p>
            </div>
          ) : (
            <table className='w-full text-left border-collapse whitespace-nowrap'>
              <thead>
                <tr className='text-slate-500 text-xs uppercase tracking-wider border-b border-gray-200 bg-gray-50/50'>
                  <th className='px-6 py-4 font-semibold'>Customer</th>
                  <th className='px-6 py-4 font-semibold'>Items</th>
                  <th className='px-6 py-4 font-semibold text-right'>Amount</th>
                  <th className='px-6 py-4 font-semibold'>Status</th>
                  <th className='px-6 py-4 font-semibold'>Date</th>
                </tr>
              </thead>
              <tbody className='text-sm divide-y divide-gray-100'>
                {recentOrders.map((order) => (
                  <tr key={order._id} className='hover:bg-gray-50/80 transition-colors'>
                    <td className='px-6 py-4'>
                      <p className='font-medium text-slate-900'>{order.address.firstname} {order.address.lastname}</p>
                      <p className='text-xs text-slate-500 mt-0.5'>{order.address.city}, {order.address.country}</p>
                    </td>
                    <td className='px-6 py-4 text-slate-600'>
                      {order.items.length} item{order.items.length > 1 && 's'}
                    </td>
                    <td className='px-6 py-4 font-semibold text-slate-900 text-right'>
                      {currency}{order.amount}
                    </td>
                    <td className='px-6 py-4'>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        order.status === 'Packing' 
                          ? 'bg-orange-50 text-orange-700 border-orange-200' 
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-slate-500 text-sm'>
                      {new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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
