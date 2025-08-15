import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const Verify = () => {
  const { backendUrl, token, setCartItems } = useContext(ShopContext)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const success = searchParams.get('success')
  const orderId = searchParams.get('orderId')

  const verifyPayment = async () => {
    try {
      if (!token) {
        navigate('/')
        return
      }

      const response = await axios.post(
        backendUrl + '/api/order/verifyStripe',
        { success, orderId },
        { headers: { token } }
      )

      if (response.data.success) {
        setCartItems({})
        navigate('/orders')
        toast.success('Payment successful!')
      } else {
        navigate('/cart')
        toast.error('Payment failed!')
      }
    } catch (error) {
      console.log(error)
      toast.error('Payment verification failed!')
      navigate('/cart')
    }
  }

  useEffect(() => {
    if (token && orderId && success) {
      verifyPayment()
    }
  }, [token, orderId, success])

  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <div className='w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin'></div>
    </div>
  )
}

export default Verify
