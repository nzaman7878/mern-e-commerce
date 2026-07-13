import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Search, Filter and Pagination State
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        {
          headers: {
            token
          }
        }
      )
      
      if (response.data.success) {
        // Reverse to show newest orders first (assuming they are returned sequentially)
        const fetchedOrders = response.data.orders || response.data.data || []
        setOrders(fetchedOrders.reverse())
      }
      
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: newStatus },
        {
          headers: {
            token
          }
        }
      )

      if (response.data.success) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        )
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getStatusColor = (status) => {
    const statusColors = {
      'Order Placed': 'bg-gray-100 border-gray-300 text-gray-700',
      'Packing': 'bg-orange-50 border-orange-300 text-orange-700',
      'Shipped': 'bg-blue-50 border-blue-300 text-blue-700',
      'Out for delivery': 'bg-purple-50 border-purple-300 text-purple-700',
      'Delivered': 'bg-green-50 border-green-300 text-green-700'
    }
    return statusColors[status] || statusColors['Order Placed']
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  // Filter logic
  const filteredOrders = orders.filter(order => {
    const customerName = `${order.address.firstname} ${order.address.lastname}`.toLowerCase();
    const matchesSearch = customerName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);


  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-80 text-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-80">
        <div className="text-center p-10 bg-red-50 border border-red-200 rounded-xl max-w-md">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchAllOrders}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Order Management</h2>
              <p className="text-slate-500 text-sm mt-1">Track and process customer orders.</p>
            </div>
            <div className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold text-xs border border-slate-200">
              {orders.length} Total
            </div>
        </div>
        
        <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
          <input
            type="text"
            placeholder="Search by customer name..."
            className='border border-gray-200 px-4 py-2.5 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all text-sm bg-white shadow-sm'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className='border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all text-sm bg-white shadow-sm cursor-pointer'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>
      
      {displayedOrders.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px] bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="text-center p-8">
            <div className="text-4xl mb-4 opacity-50">📦</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No orders found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your filters or search term.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => (
            <div 
              key={order._id} 
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row p-6 gap-6">
                
                <div className="flex-1 space-y-6">
                  {/* Order Items */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-3 p-3 bg-gray-50/50 border border-gray-100 rounded-lg"
                        >
                          <span className="font-medium text-slate-900 text-sm flex-1">{item.name}</span>
                          <span className="bg-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-md font-semibold">
                            x{item.quantity}
                          </span>
                          {item.size && (
                            <span className="text-slate-500 text-xs font-medium">({item.size})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    {/* Customer Information */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Delivery Address</h4>
                      <div className="text-sm text-slate-600 leading-relaxed">
                        <p className="font-semibold text-slate-900 text-base mb-1">
                          {order.address.firstname} {order.address.lastname}
                        </p>
                        <p>{order.address.street}</p>
                        <p>{order.address.city}, {order.address.state}</p>
                        <p>{order.address.country} - {order.address.zipcode}</p>
                        <p className="text-slate-900 font-medium mt-2">
                          📞 {order.address.phone}
                        </p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500">Items:</span>
                          <span className="text-slate-900 font-medium">{order.items.length}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500">Method:</span>
                          <span className="text-slate-900 font-medium">{order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500">Payment:</span>
                          <span className={`font-semibold ${order.payment ? 'text-emerald-600' : 'text-orange-600'}`}>
                            {order.payment ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500">Date:</span>
                          <span className="text-slate-900 font-medium">
                            {new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                          <span className="text-slate-900 font-semibold">Total:</span>
                          <span className="text-slate-900 font-bold text-lg">
                            {currency}{order.amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t border-gray-100">
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                      Status:
                    </label>
                    <select 
                      id={`status-${order._id}`}
                      value={order.status || 'Order Placed'}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className={`px-4 py-2 border rounded-lg text-sm font-semibold cursor-pointer transition-all focus:outline-none focus:ring-4 focus:ring-slate-100 min-w-40 ${getStatusColor(order.status || 'Order Placed')}`}
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Packing">Packing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center py-6 mt-4">
          <span className="text-sm text-slate-500 font-medium">
             Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${currentPage === 1 ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-200 text-slate-700 hover:bg-gray-50 hover:border-slate-300 shadow-sm'}`}
            >
              Previous
            </button>
            
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
               className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${currentPage === totalPages ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-200 text-slate-700 hover:bg-gray-50 hover:border-slate-300 shadow-sm'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Orders
