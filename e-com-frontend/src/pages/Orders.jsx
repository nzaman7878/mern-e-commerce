import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const Orders = () => {
  const {backendUrl, token, currency} = useContext(ShopContext);
  const [orderData, setOrderData] = useState([])

  const loadOrderData = async () => {
    try {
      if(!token) {
        return null;
      }
      
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, {
        headers: {token}
      })
      
      if(response.data.success) {
        let allOrdersItem = [] 
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        
        
        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <div className='bg-[#F8F5F1] text-[#2C2723] min-h-screen pt-32 px-6 md:px-12 lg:px-24'>
      <div className='mb-24'>
        <h1 className='font-serif text-5xl lg:text-7xl leading-none'>
          Order <span className='italic font-light text-[#7B746E]'>History.</span>
        </h1>
      </div>
      
      <div className='border-t border-[#2C2723]/10'>
        {orderData.length === 0 ? (
          <div className='py-24 text-center'>
            <p className='font-sans text-sm tracking-widest uppercase text-[#7B746E]'>No orders found.</p>
          </div>
        ) : (
          orderData.map((item, index) => (
            <div key={index} className='py-8 border-b border-[#2C2723]/10 flex flex-col md:flex-row md:items-center justify-between gap-8 group'>
              
              <div className='flex items-start gap-8'>
                <img className='w-20 md:w-28 object-cover aspect-[4/5] grayscale group-hover:grayscale-0 transition-all duration-[2s] ease-out' src={item.image?.[0]} alt="" />
                
                <div className='flex flex-col gap-3'>
                  <p className='font-serif text-xl md:text-2xl'>{item.name}</p>
                  
                  <div className='flex items-center gap-6 font-sans text-xs tracking-widest uppercase text-[#7B746E]'>
                    <p className='font-serif italic text-base text-[#2C2723]'>{currency}{item.price}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  
                  <div className='flex flex-col gap-1 mt-2 font-sans text-[10px] tracking-[0.2em] uppercase text-[#7B746E]'>
                    <p>Date: <span className='text-[#2C2723]'>{new Date(item.date).toDateString()}</span></p>
                    <p>Payment: <span className='text-[#2C2723]'>{item.paymentMethod}</span></p>
                  </div>
                </div>
              </div>
              
              <div className='md:w-1/3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6'>
                <div className='flex items-center gap-2'>
                  <p className='font-sans text-xs tracking-widest uppercase'>[ {item.status} ]</p>
                </div>
                <button onClick={loadOrderData} className='bg-transparent border border-[#2C2723] text-[#2C2723] px-6 py-3 font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-[#2C2723] hover:text-[#F8F5F1] transition-colors shrink-0'>
                  Track
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders
