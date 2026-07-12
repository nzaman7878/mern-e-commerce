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
    password: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        password: ''
      });
    }
  }, [token, userData, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        backendUrl + '/api/user/profile/update',
        formData,
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setIsEditing(false);
        fetchUserData(token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
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
      <div className='w-full max-w-3xl'>
        
        <div className='mb-16'>
          <h1 className='font-serif text-5xl lg:text-7xl leading-none mb-4'>
            My <span className='italic font-light text-[#7B746E]'>Profile.</span>
          </h1>
          <p className='font-sans text-xs tracking-[0.2em] uppercase text-[#7B746E]'>Account Details & Settings</p>
        </div>

        <div className='bg-[#47362A] p-8 md:p-12 shadow-sm border border-gray-100'>
          
          <div className='flex items-center gap-8 mb-12 pb-8 border-b border-gray-100'>
            <div className='w-24 h-24 bg-[#2C2723] rounded-full flex items-center justify-center text-[#F8F5F1] font-serif text-4xl'>
              {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className='font-serif text-3xl'>{userData.name}</h2>
              <p className='font-sans text-sm tracking-widest text-[#7B746E] mt-2'>{userData.email}</p>
            </div>
          </div>

          {!isEditing ? (
            <div className='space-y-8'>
              <div>
                <p className='font-sans text-xs tracking-widest uppercase text-[#7B746E] mb-2'>Full Name</p>
                <p className='font-serif text-xl'>{userData.name}</p>
              </div>
              <div>
                <p className='font-sans text-xs tracking-widest uppercase text-[#7B746E] mb-2'>Email Address</p>
                <p className='font-serif text-xl'>{userData.email}</p>
              </div>
              
              <div className='pt-8 mt-8 border-t border-gray-100'>
                <button 
                  onClick={() => setIsEditing(true)}
                  className='bg-[#2C2723] text-[#F8F5F1] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors'
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-8'>
              <div>
                <label className='block font-sans text-xs tracking-widest uppercase text-[#7B746E] mb-2'>Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className='w-full bg-transparent border-b border-[#2C2723]/30 py-3 font-serif text-xl outline-none focus:border-[#2C2723] transition-colors'
                />
              </div>
              
              <div>
                <label className='block font-sans text-xs tracking-widest uppercase text-[#7B746E] mb-2'>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className='w-full bg-transparent border-b border-[#2C2723]/30 py-3 font-serif text-xl outline-none focus:border-[#2C2723] transition-colors'
                />
              </div>

              <div>
                <label className='block font-sans text-xs tracking-widest uppercase text-[#7B746E] mb-2'>New Password (Optional)</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Leave blank to keep current password"
                  className='w-full bg-transparent border-b border-[#2C2723]/30 py-3 font-serif text-xl outline-none focus:border-[#2C2723] transition-colors placeholder:text-gray-300 placeholder:font-sans placeholder:text-sm'
                />
              </div>

              <div className='flex gap-4 pt-8 mt-8 border-t border-gray-100'>
                <button 
                  type="submit"
                  className='bg-[#2C2723] text-[#F8F5F1] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors'
                >
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className='border border-[#2C2723] text-[#2C2723] px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors'
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
