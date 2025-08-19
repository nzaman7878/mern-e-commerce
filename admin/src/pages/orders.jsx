import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
      
      console.log(response.data)
      
      if (response.data.success) {
        setOrders(response.data.orders || response.data.data || [])
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

  if (loading) {
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
    <div className="max-w-7xl mx-auto p-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 pb-4 border-b-2 border-gray-100">
        <h2 className="text-3xl font-semibold text-gray-800 mb-3 sm:mb-0">Order Management</h2>
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-medium">
          Total Orders: {orders.length}
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <img 
              src={assets.parcel_icon} 
              alt="No orders" 
              className="w-20 h-20 opacity-50 mx-auto mb-5"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500">Orders will appear here once customers start placing them.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div 
              key={order._id} 
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row p-6 gap-5">
                {/* Order Icon */}
                <div className="flex-shrink-0 self-start">
                  <img 
                    src={assets.parcel_icon} 
                    alt="Parcel" 
                    className="w-12 h-12"
                  />
                </div>
                
                <div className="flex-1 space-y-5">
                  {/* Order Items */}
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="font-medium text-gray-800 flex-1">{item.name}</span>
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            x{item.quantity}
                          </span>
                          {item.size && (
                            <span className="text-gray-500 text-sm">({item.size})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Delivery Address</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-semibold text-gray-800 text-base mb-2">
                        {order.address.firstname} {order.address.lastname}
                      </p>
                      <div className="text-gray-600 leading-relaxed space-y-1">
                        <p>{order.address.street}</p>
                        <p>
                          {order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipcode}
                        </p>
                      </div>
                      <p className="text-blue-600 font-medium mt-2">
                        📞 {order.address.phone}
                      </p>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Items:</span>
                        <span className="text-gray-800 font-semibold">{order.items.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Method:</span>
                        <span className="text-gray-800 font-semibold">{order.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Payment:</span>
                        <span className={`font-semibold ${order.payment ? 'text-green-600' : 'text-orange-600'}`}>
                          {order.payment ? '✅ Done' : '⏳ Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Date:</span>
                        <span className="text-gray-800 font-semibold">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Total:</span>
                        <span className="text-blue-600 font-bold text-base">
                          {currency}{order.amount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <label className="font-semibold text-gray-800">
                      Order Status:
                    </label>
                    <select 
                      id={`status-${order._id}`}
                      value={order.status || 'Order Placed'}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className={`px-4 py-2 border-2 rounded-lg font-medium cursor-pointer transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-blue-300 min-w-40 ${getStatusColor(order.status || 'Order Placed')}`}
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
    </div>
  )
}

export default Orders
