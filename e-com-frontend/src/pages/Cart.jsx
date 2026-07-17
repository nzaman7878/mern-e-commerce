import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets';
import CartTotal from '../components/CartTotal';
import { optimizeImage } from '../utils/imageOptimizer';

const Cart = () => {
  const {products, currency, cartItems, updateQuantity, navigate} = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if(products.length > 0){
         const tempData = [];
    for (const items in cartItems) {
      for(const item in cartItems[items]) {
        if(cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item]
          })
        }
      }
    }
      setCartData(tempData);
    }
 
    
  }, [cartItems,products]);

  return (
    <div className='bg-[#F8F5F1] text-[#2C2723] min-h-screen pt-32 px-6 md:px-12 lg:px-24'>
      <div className='mb-24'>
        <h1 className='font-serif text-5xl lg:text-7xl leading-none'>
          Your <span className='italic font-light text-[#7B746E]'>Bag.</span>
        </h1>
      </div>

      <div className='flex flex-col lg:flex-row gap-24'> 
        
        {/* Cart Items List */}
        <div className='flex-1'>
          {cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);
            
            if (!productData) return null;

            return (
              <div 
                key={index} 
                className='py-8 border-b border-[#2C2723]/10 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_auto] items-center gap-8 group'
              >
                <div className='flex items-center gap-8'>
                  <img className='w-24 md:w-32 object-cover aspect-[4/5]' src={optimizeImage(productData.image[0])} alt="" />
                  <div>
                    <p className='font-serif text-xl md:text-3xl mb-2'>
                      {productData.name}
                    </p>
                    <div className='flex items-center gap-6 font-sans text-xs tracking-widest uppercase'>
                      <p className='font-serif italic text-base'>{currency}{productData.price}</p>
                      <p className='border border-[#2C2723] px-3 py-1'>{item.size}</p>
                    </div>
                  </div>
                </div>
                
                <input 
                  className='bg-transparent border-b border-[#2C2723]/30 w-16 px-2 py-2 text-center font-sans text-xs tracking-widest outline-none focus:border-[#2C2723] transition-colors' 
                  type="number" 
                  min={1} 
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item._id, item.size, Number(e.target.value))}
                />
                
                <button 
                  onClick={() => updateQuantity(item._id, item.size, 0)} 
                  className='font-sans text-[10px] tracking-widest uppercase text-[#7B746E] hover:text-[#2C2723] transition-colors'
                >
                  Remove
                </button>
              </div>
            )
          })}

          {/* Empty cart message */}
          {cartData.length === 0 && (
            <div className='py-24 border-b border-[#2C2723]/10'>
              <p className='font-sans text-sm tracking-widest uppercase text-[#7B746E]'>Your bag is empty.</p>
            </div>
          )}
        </div>

        {/* Cart Total Section */}
        <div className='w-full lg:w-[450px] shrink-0'>
          <CartTotal />
          <div className='mt-12'>
            <button onClick={()=>navigate('/place-order')} className='w-full bg-[#2C2723] text-[#F8F5F1] py-5 font-sans text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors'>
              Proceed to Checkout
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cart
