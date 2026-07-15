import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

function CartTotal({ calculationData }) {
    const {currency, delivery_fee, getCartAmount} = useContext(ShopContext);

    // If we have calculation data from the backend, use it
    if (calculationData) {
        return (
            <div className='w-full'>
                <div className='mb-8 border-b border-[#2C2723]/10 pb-4'>
                    <h2 className='font-serif text-3xl text-[#2C2723]'>
                        Order <span className='italic text-[#7B746E]'>Summary.</span>
                    </h2>
                </div>
                
                <div className='flex flex-col gap-6 font-sans text-xs tracking-widest uppercase text-[#2C2723]'>
                    <div className='flex justify-between items-end border-b border-[#2C2723]/10 pb-4'>
                        <p>Base Subtotal</p>
                        <p className='font-serif italic text-base'>{currency}{calculationData.baseTotal.toFixed(2)}</p>
                    </div>
                    
                    {calculationData.discountAmount > 0 && (
                        <div className='flex justify-between items-end border-b border-[#2C2723]/10 pb-4 text-green-700'>
                            <p>Product Discounts</p>
                            <p className='font-serif italic text-base'>-{currency}{calculationData.discountAmount.toFixed(2)}</p>
                        </div>
                    )}

                    {calculationData.couponDiscount > 0 && (
                        <div className='flex justify-between items-end border-b border-[#2C2723]/10 pb-4 text-green-700'>
                            <p>Coupon Discount</p>
                            <p className='font-serif italic text-base'>-{currency}{calculationData.couponDiscount.toFixed(2)}</p>
                        </div>
                    )}
                    
                    <div className='flex justify-between items-end border-b border-[#2C2723]/10 pb-4'>
                        <p>Shipping</p>
                        <p className='font-serif italic text-base'>{currency}{delivery_fee.toFixed(2)}</p>
                    </div>
                    
                    <div className='flex justify-between items-end pt-4'>
                        <b>Total</b>
                        <b className='font-serif italic text-2xl'>{currency}{(calculationData.finalTotal + delivery_fee).toFixed(2)}</b>
                    </div>
                </div>
            </div>
        )
    }

    // Fallback to local calculation
    const subtotal = getCartAmount() || 0;
    const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

    return (
        <div className='w-full'>
            <div className='mb-8 border-b border-[#2C2723]/10 pb-4'>
                <h2 className='font-serif text-3xl text-[#2C2723]'>
                    Order <span className='italic text-[#7B746E]'>Summary.</span>
                </h2>
            </div>
            
            <div className='flex flex-col gap-6 font-sans text-xs tracking-widest uppercase text-[#2C2723]'>
                <div className='flex justify-between items-end border-b border-[#2C2723]/10 pb-4'>
                    <p>Subtotal</p>
                    <p className='font-serif italic text-base'>{currency}{subtotal.toFixed(2)}</p>
                </div>
                
                <div className='flex justify-between items-end border-b border-[#2C2723]/10 pb-4'>
                    <p>Shipping</p>
                    <p className='font-serif italic text-base'>{currency}{delivery_fee.toFixed(2)}</p>
                </div>
                
                <div className='flex justify-between items-end pt-4'>
                    <b>Total</b>
                    <b className='font-serif italic text-2xl'>{currency}{total.toFixed(2)}</b>
                </div>
            </div>
        </div>
    )
}

export default CartTotal
