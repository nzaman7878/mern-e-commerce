import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../assets/frontend_assets/assets';

const Profile = () => {
  const { userData, fetchUserData, token, backendUrl, navigate } = useContext(ShopContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  
  const initialAddressForm = {
    firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: ''
  };
  const [addressForm, setAddressForm] = useState(initialAddressForm);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        password: '',
        phone: userData.phone || ''
      });
      setAddresses(userData.addresses || []);
    }
  }, [token, userData, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressInputChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const saveProfileData = async (updatedFields) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/user/profile/update',
        updatedFields,
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchUserData(token);
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await saveProfileData(formData);
    if (success) {
      setIsEditing(false);
      setFormData(prev => ({...prev, password: ''}));
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    let updatedAddresses = [...addresses];
    
    if (editingAddressId) {
      updatedAddresses = updatedAddresses.map(addr => 
        addr.id === editingAddressId ? { ...addressForm, id: editingAddressId, isDefault: addr.isDefault } : addr
      );
    } else {
      const newAddress = {
        ...addressForm,
        id: Date.now().toString(),
        isDefault: updatedAddresses.length === 0 
      };
      updatedAddresses.push(newAddress);
    }

    const success = await saveProfileData({ addresses: updatedAddresses });
    if (success) {
      setAddresses(updatedAddresses);
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressForm(initialAddressForm);
    }
  };

  const handleDeleteAddress = async (id) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    // If we deleted the default address and there are other addresses, make the first one default
    const deletedAddress = addresses.find(addr => addr.id === id);
    if (deletedAddress?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    const success = await saveProfileData({ addresses: updatedAddresses });
    if (success) {
      setAddresses(updatedAddresses);
    }
  };

  const handleSetDefaultAddress = async (id) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    const success = await saveProfileData({ addresses: updatedAddresses });
    if (success) {
      setAddresses(updatedAddresses);
    }
  };

  const openEditAddress = (addr) => {
    setAddressForm(addr);
    setEditingAddressId(addr.id);
    setShowAddressForm(true);
  };

  const cancelAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddressForm(initialAddressForm);
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8F5F1]">
        <div className="animate-spin rounded-full h-8 w-8 border-t border-[#2C2723]"></div>
      </div>
    );
  }

  return (
    <div className='bg-[#F8F5F1] text-[#2C2723] min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24 flex justify-center'>
      <div className='w-full max-w-4xl'>
        
        <div className='mb-16'>
          <h1 className='font-serif text-5xl lg:text-7xl leading-none mb-4'>
            My <span className='italic font-light text-[#7B746E]'>Profile.</span>
          </h1>
          <p className='font-sans text-xs tracking-[0.2em] uppercase text-[#7B746E]'>Account Details & Addresses</p>
        </div>

        <div className='flex flex-col gap-12'>
          
          {/* Personal Information */}
          <div className='bg-[#47362A] text-[#F8F5F1] p-8 md:p-12 shadow-sm border border-gray-100'>
            <div className='flex justify-between items-center mb-8 border-b border-gray-500/30 pb-4'>
              <h2 className='font-serif text-3xl'>Personal Information</h2>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className='text-xs tracking-[0.2em] uppercase hover:text-[#C96A3C] transition-colors'>
                  Edit
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div>
                  <p className='font-sans text-xs tracking-widest uppercase text-gray-400 mb-2'>Full Name</p>
                  <p className='font-serif text-xl'>{userData.name}</p>
                </div>
                <div>
                  <p className='font-sans text-xs tracking-widest uppercase text-gray-400 mb-2'>Email Address</p>
                  <p className='font-serif text-xl'>{userData.email}</p>
                </div>
                <div>
                  <p className='font-sans text-xs tracking-widest uppercase text-gray-400 mb-2'>Phone Number</p>
                  <p className='font-serif text-xl'>{userData.phone || 'Not set'}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div>
                    <label className='block font-sans text-xs tracking-widest uppercase text-gray-400 mb-2'>Full Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className='w-full bg-transparent border-b border-[#F8F5F1]/30 py-3 font-serif text-xl outline-none focus:border-[#F8F5F1] transition-colors' />
                  </div>
                  <div>
                    <label className='block font-sans text-xs tracking-widest uppercase text-gray-400 mb-2'>Email Address</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className='w-full bg-transparent border-b border-[#F8F5F1]/30 py-3 font-serif text-xl outline-none focus:border-[#F8F5F1] transition-colors' />
                  </div>
                  <div>
                    <label className='block font-sans text-xs tracking-widest uppercase text-gray-400 mb-2'>Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className='w-full bg-transparent border-b border-[#F8F5F1]/30 py-3 font-serif text-xl outline-none focus:border-[#F8F5F1] transition-colors' />
                  </div>
                  <div>
                    <label className='block font-sans text-xs tracking-widest uppercase text-gray-400 mb-2'>New Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Leave blank to keep current" className='w-full bg-transparent border-b border-[#F8F5F1]/30 py-3 font-serif text-xl outline-none focus:border-[#F8F5F1] transition-colors placeholder:text-gray-500 placeholder:font-sans placeholder:text-sm' />
                  </div>
                </div>
                <div className='flex gap-4 pt-4'>
                  <button type="submit" className='bg-[#F8F5F1] text-[#2C2723] px-8 py-3 font-sans text-xs tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors'>
                    Save
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className='border border-[#F8F5F1] text-[#F8F5F1] px-8 py-3 font-sans text-xs tracking-[0.2em] uppercase hover:bg-white/10 transition-colors'>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Addresses */}
          <div className='bg-white p-8 md:p-12 shadow-sm border border-gray-200'>
            <div className='flex justify-between items-center mb-8 border-b border-gray-200 pb-4'>
              <h2 className='font-serif text-3xl'>Saved Addresses</h2>
              {!showAddressForm && (
                <button onClick={() => setShowAddressForm(true)} className='text-xs tracking-[0.2em] uppercase hover:text-[#C96A3C] transition-colors'>
                  + Add New
                </button>
              )}
            </div>

            {showAddressForm ? (
              <form onSubmit={handleSaveAddress} className='space-y-6 mb-8 border border-gray-200 p-6 bg-gray-50'>
                <h3 className='font-sans text-sm tracking-widest uppercase mb-4'>{editingAddressId ? 'Edit Address' : 'New Address'}</h3>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <input required name="firstName" value={addressForm.firstName} onChange={handleAddressInputChange} type="text" placeholder="First Name" className='border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-[#2C2723]' />
                  <input required name="lastName" value={addressForm.lastName} onChange={handleAddressInputChange} type="text" placeholder="Last Name" className='border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-[#2C2723]' />
                  <input required name="email" value={addressForm.email} onChange={handleAddressInputChange} type="email" placeholder="Email Address" className='border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-[#2C2723]' />
                  <input required name="phone" value={addressForm.phone} onChange={handleAddressInputChange} type="tel" placeholder="Phone Number" className='border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-[#2C2723]' />
                  <input required name="street" value={addressForm.street} onChange={handleAddressInputChange} type="text" placeholder="Street Address" className='border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-[#2C2723] md:col-span-2' />
                  <input required name="city" value={addressForm.city} onChange={handleAddressInputChange} type="text" placeholder="City" className='border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-[#2C2723]' />
                  <input required name="state" value={addressForm.state} onChange={handleAddressInputChange} type="text" placeholder="State / Province" className='border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-[#2C2723]' />
                  <input required name="zipcode" value={addressForm.zipcode} onChange={handleAddressInputChange} type="text" placeholder="Zip Code" className='border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-[#2C2723]' />
                  <input required name="country" value={addressForm.country} onChange={handleAddressInputChange} type="text" placeholder="Country" className='border-b border-gray-300 bg-transparent py-3 text-sm outline-none focus:border-[#2C2723]' />
                </div>
                
                <div className='flex gap-4 pt-4'>
                  <button type="submit" className='bg-[#2C2723] text-white px-8 py-3 font-sans text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors'>
                    Save Address
                  </button>
                  <button type="button" onClick={cancelAddressForm} className='border border-[#2C2723] text-[#2C2723] px-8 py-3 font-sans text-xs tracking-[0.2em] uppercase hover:bg-gray-100 transition-colors'>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {addresses.length === 0 ? (
                  <p className='text-gray-500 font-serif italic col-span-2'>No addresses saved.</p>
                ) : (
                  addresses.map(addr => (
                    <div key={addr.id} className={`p-6 border transition-colors ${addr.isDefault ? 'border-[#C96A3C] bg-orange-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className='flex justify-between items-start mb-4'>
                        <h3 className='font-sans text-sm font-semibold'>{addr.firstName} {addr.lastName}</h3>
                        {addr.isDefault && <span className='bg-[#C96A3C] text-white text-[9px] tracking-widest uppercase px-2 py-1 rounded-sm'>Default</span>}
                      </div>
                      <div className='text-sm text-gray-600 mb-6 leading-relaxed'>
                        <p>{addr.street}</p>
                        <p>{addr.city}, {addr.state} {addr.zipcode}</p>
                        <p>{addr.country}</p>
                        <p className='mt-2'>📞 {addr.phone}</p>
                      </div>
                      <div className='flex gap-4 border-t border-gray-200 pt-4 text-xs font-sans tracking-widest uppercase'>
                        <button onClick={() => openEditAddress(addr)} className='hover:text-[#C96A3C] transition-colors'>Edit</button>
                        <button onClick={() => handleDeleteAddress(addr.id)} className='hover:text-red-600 transition-colors'>Delete</button>
                        {!addr.isDefault && (
                          <button onClick={() => handleSetDefaultAddress(addr.id)} className='text-gray-400 hover:text-[#2C2723] transition-colors ml-auto'>Set Default</button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
