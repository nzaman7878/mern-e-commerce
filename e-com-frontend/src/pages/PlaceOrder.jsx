import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/frontend_assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const navigate = useNavigate(); 
  const { 
    getCartAmount, 
    backendUrl, 
    token, 
    cartItems, 
    setCartItems, 
    delivery_fee, 
    products, 
    userId,
    userData
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [calculationData, setCalculationData] = useState(null);

  const calculateTotals = async () => {
    try {
      let orderItems = []
      for(const items in cartItems){
        for(const item in cartItems[items]){
          if(cartItems[items][item] > 0){
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }
      
      if (orderItems.length === 0) return;

      const response = await axios.post(backendUrl + '/api/cart/calculate', { 
        items: orderItems, 
        couponCode: appliedCoupon,
        userId: userId
      }, { headers: { token } });

      if (response.data.success) {
        setCalculationData(response.data.calculation);
        if (response.data.calculation.couponError && appliedCoupon) {
          toast.error(response.data.calculation.couponError);
          setAppliedCoupon(''); // clear invalid coupon
        } else if (response.data.calculation.couponApplied && appliedCoupon) {
          toast.success("Coupon applied successfully!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      calculateTotals();
    }
  }, [cartItems, appliedCoupon, token]);

  useEffect(() => {
    if (userData && userData.addresses && userData.addresses.length > 0) {
      const defaultAddr = userData.addresses.find(a => a.isDefault);
      if (defaultAddr) {
        setFormData({
          firstName: defaultAddr.firstName || '',
          lastName: defaultAddr.lastName || '',
          email: defaultAddr.email || '',
          street: defaultAddr.street || '',
          city: defaultAddr.city || '',
          state: defaultAddr.state || '',
          zipcode: defaultAddr.zipcode || '',
          country: defaultAddr.country || '',
          phone: defaultAddr.phone || ''
        });
      }
    }
  }, [userData]);

  const handleAddressSelect = (e) => {
    if (e.target.value === 'new') {
      setFormData({
        firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: ''
      });
      return;
    }
    const selectedAddr = userData.addresses.find(a => a.id === e.target.value);
    if (selectedAddr) {
      setFormData({
        firstName: selectedAddr.firstName || '',
        lastName: selectedAddr.lastName || '',
        email: selectedAddr.email || '',
        street: selectedAddr.street || '',
        city: selectedAddr.city || '',
        state: selectedAddr.state || '',
        zipcode: selectedAddr.zipcode || '',
        country: selectedAddr.country || '',
        phone: selectedAddr.phone || ''
      });
    }
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (getCartAmount() === 0) {
      toast.error('Your archive is empty');
      return;
    }
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.street || !formData.city || !formData.state || !formData.zipcode || !formData.country || !formData.phone) {
      toast.error('Complete all required fields');
      return;
    }
    
    try {
      let orderItems = []
      for(const items in cartItems){
        for(const item in cartItems[items]){
          if(cartItems[items][item] > 0){
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }
      
      let orderData = {
        userId,
        address: formData,
        items: orderItems,
        couponCode: appliedCoupon
      }

      switch(method) {
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
          if(response.data.success){
            setCartItems({})
            toast.success('Order placed successfully.')
            navigate('/orders')
          } else {
            toast.error(response.data.message) 
          }
          break;
        case 'stripe': 
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
          if (responseStripe.data.success) {
            window.location.replace(responseStripe.data.session_url)
          } else {
            toast.error(responseStripe.data.message)
          }
          break;
        case 'razorpay':
          const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, { headers: { token } })
          if (responseRazorpay.data.success) {
            toast.success('Redirecting to Razorpay...')
          } else {
            toast.error(responseRazorpay.data.message)
          }
          break;
        default:
          toast.error('Select a payment method');
          break;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='px-6 md:px-12 lg:px-24 pt-32 pb-24 min-h-screen bg-[#F8F5F1] text-[#2C2723]'>
      
      <div className='flex flex-col lg:flex-row justify-between gap-24'>
        
        {/* Delivery Details */}
        <div className='flex flex-col gap-8 w-full lg:w-3/5'>
          <h2 className='font-serif text-4xl md:text-5xl mb-8'>Delivery Details.</h2>

          {userData && userData.addresses && userData.addresses.length > 0 && (
            <div className='mb-4'>
              <select 
                onChange={handleAddressSelect} 
                className='w-full border-b border-[#2C2723]/30 py-4 bg-transparent outline-none focus:border-[#2C2723] transition-colors font-sans text-sm'
              >
                <option value="" disabled selected>Select a saved address...</option>
                {userData.addresses.map(addr => (
                  <option key={addr.id} value={addr.id}>
                    {addr.firstName} {addr.lastName} - {addr.street}, {addr.city} {addr.isDefault ? '(Default)' : ''}
                  </option>
                ))}
                <option value="new">Use a new address</option>
              </select>
            </div>
          )}
          
          <div className='flex gap-8'>
            <div className='relative w-full'>
               <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" placeholder=" " className="peer w-full border-b border-[#2C2723]/30 py-4 bg-transparent outline-none focus:border-[#2C2723] transition-colors font-sans text-sm" />
               <label className="absolute left-0 top-4 text-[#7B746E] font-sans text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#2C2723] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#2C2723] pointer-events-none">First Name</label>
            </div>
            <div className='relative w-full'>
               <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" placeholder=" " className="peer w-full border-b border-[#2C2723]/30 py-4 bg-transparent outline-none focus:border-[#2C2723] transition-colors font-sans text-sm" />
               <label className="absolute left-0 top-4 text-[#7B746E] font-sans text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#2C2723] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#2C2723] pointer-events-none">Last Name</label>
            </div>
          </div>
          
          <div className='relative w-full'>
             <input required onChange={onChangeHandler} name='email' value={formData.email} type="email" placeholder=" " className="peer w-full border-b border-[#2C2723]/30 py-4 bg-transparent outline-none focus:border-[#2C2723] transition-colors font-sans text-sm" />
             <label className="absolute left-0 top-4 text-[#7B746E] font-sans text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#2C2723] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#2C2723] pointer-events-none">Email Address</label>
          </div>
          
          <div className='relative w-full'>
             <input required onChange={onChangeHandler} name='street' value={formData.street} type="text" placeholder=" " className="peer w-full border-b border-[#2C2723]/30 py-4 bg-transparent outline-none focus:border-[#2C2723] transition-colors font-sans text-sm" />
             <label className="absolute left-0 top-4 text-[#7B746E] font-sans text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#2C2723] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#2C2723] pointer-events-none">Street Address</label>
          </div>
          
          <div className='flex gap-8'>
            <div className='relative w-full'>
               <input required onChange={onChangeHandler} name='city' value={formData.city} type="text" placeholder=" " className="peer w-full border-b border-[#2C2723]/30 py-4 bg-transparent outline-none focus:border-[#2C2723] transition-colors font-sans text-sm" />
               <label className="absolute left-0 top-4 text-[#7B746E] font-sans text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#2C2723] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#2C2723] pointer-events-none">City</label>
            </div>
            <div className='relative w-full'>
               <input required onChange={onChangeHandler} name='state' value={formData.state} type="text" placeholder=" " className="peer w-full border-b border-[#2C2723]/30 py-4 bg-transparent outline-none focus:border-[#2C2723] transition-colors font-sans text-sm" />
               <label className="absolute left-0 top-4 text-[#7B746E] font-sans text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#2C2723] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#2C2723] pointer-events-none">State / Province</label>
            </div>
          </div>
          
          <div className='flex gap-8'>
            <div className='relative w-full'>
               <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} type="text" placeholder=" " className="peer w-full border-b border-[#2C2723]/30 py-4 bg-transparent outline-none focus:border-[#2C2723] transition-colors font-sans text-sm" />
               <label className="absolute left-0 top-4 text-[#7B746E] font-sans text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#2C2723] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#2C2723] pointer-events-none">Zip Code</label>
            </div>
            <div className='relative w-full'>
               <input required onChange={onChangeHandler} name='country' value={formData.country} type="text" placeholder=" " className="peer w-full border-b border-[#2C2723]/30 py-4 bg-transparent outline-none focus:border-[#2C2723] transition-colors font-sans text-sm" />
               <label className="absolute left-0 top-4 text-[#7B746E] font-sans text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#2C2723] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#2C2723] pointer-events-none">Country</label>
            </div>
          </div>
          
          <div className='relative w-full'>
             <input required onChange={onChangeHandler} name='phone' value={formData.phone} type="tel" placeholder=" " className="peer w-full border-b border-[#2C2723]/30 py-4 bg-transparent outline-none focus:border-[#2C2723] transition-colors font-sans text-sm" />
             <label className="absolute left-0 top-4 text-[#7B746E] font-sans text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#2C2723] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#2C2723] pointer-events-none">Phone Number</label>
          </div>
        </div>

        {/* Order Summary */}
        <div className='w-full lg:w-2/5'>
          <div className='lg:sticky lg:top-32'>
            
            {/* Coupon Input */}
            <div className='mb-8 border border-[#2C2723]/20 p-4'>
              <h3 className='font-sans text-xs tracking-widest uppercase mb-4'>Discount Code</h3>
              <div className='flex gap-2'>
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code" 
                  className='flex-1 border-b border-[#2C2723]/30 bg-transparent outline-none py-2 font-sans text-sm uppercase'
                />
                <button 
                  type="button"
                  onClick={() => setAppliedCoupon(couponCode)}
                  className='bg-[#2C2723] text-[#F8F5F1] px-4 py-2 font-sans text-xs tracking-widest uppercase hover:bg-black transition-colors'
                >
                  Apply
                </button>
              </div>
            </div>

            <div className='mb-12'>
              <CartTotal calculationData={calculationData} />
            </div>
            
            <div className='mt-12'>
              <h3 className='font-sans text-xs tracking-[0.2em] uppercase mb-8 border-b border-[#2C2723]/10 pb-4'>Payment Method</h3>
              
              <div className='flex flex-col gap-4'>
                <div 
                  onClick={() => setMethod('stripe')} 
                  className={`flex items-center justify-between p-4 cursor-pointer border transition-colors ${method === 'stripe' ? 'border-[#2C2723] bg-[#2C2723] text-[#F8F5F1]' : 'border-[#2C2723]/20 hover:border-[#2C2723]'}`}
                >
                  <span className='font-sans text-xs tracking-widest uppercase'>Credit Card (Stripe)</span>
                  <div className={`w-3 h-3 rounded-full border ${method === 'stripe' ? 'border-[#F8F5F1] bg-[#F8F5F1]' : 'border-[#2C2723]/30'}`}></div>
                </div>
                
                <div 
                  onClick={() => setMethod('razorpay')} 
                  className={`flex items-center justify-between p-4 cursor-pointer border transition-colors ${method === 'razorpay' ? 'border-[#2C2723] bg-[#2C2723] text-[#F8F5F1]' : 'border-[#2C2723]/20 hover:border-[#2C2723]'}`}
                >
                  <span className='font-sans text-xs tracking-widest uppercase'>Razorpay</span>
                  <div className={`w-3 h-3 rounded-full border ${method === 'razorpay' ? 'border-[#F8F5F1] bg-[#F8F5F1]' : 'border-[#2C2723]/30'}`}></div>
                </div>
                
                <div 
                  onClick={() => setMethod('cod')} 
                  className={`flex items-center justify-between p-4 cursor-pointer border transition-colors ${method === 'cod' ? 'border-[#2C2723] bg-[#2C2723] text-[#F8F5F1]' : 'border-[#2C2723]/20 hover:border-[#2C2723]'}`}
                >
                  <span className='font-sans text-xs tracking-widest uppercase'>Cash on Delivery</span>
                  <div className={`w-3 h-3 rounded-full border ${method === 'cod' ? 'border-[#F8F5F1] bg-[#F8F5F1]' : 'border-[#2C2723]/30'}`}></div>
                </div>
              </div>
              
              <div className='mt-12'>
                <button 
                  type="submit"
                  className='w-full bg-[#2C2723] text-[#F8F5F1] py-5 font-sans text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={!method}
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
