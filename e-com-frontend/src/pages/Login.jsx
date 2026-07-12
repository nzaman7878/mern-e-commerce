import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Registration successful');
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Login
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Login successful');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'An error occurred');
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate]);

  return (
    <div className='bg-[#F8F5F1] min-h-screen pt-32 pb-24 px-6 flex items-center justify-center'>
      <form onSubmit={onSubmitHandler} className='w-full max-w-md flex flex-col gap-12'>
        <div className='text-center mb-4'>
          <h1 className='font-serif text-5xl lg:text-7xl text-[#2C2723] leading-none'>
            {currentState === 'Login' ? 'Sign In.' : 'Register.'}
          </h1>
        </div>

        <div className='flex flex-col gap-8'>
          {currentState === 'Sign Up' && (
            <div className='relative'>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className='peer w-full border-b border-[#2C2723]/30 py-4 bg-transparent outline-none focus:border-[#2C2723] transition-colors font-sans text-sm'
                type='text'
                placeholder=' '
                required
                autoComplete='name'
              />
              <label className="absolute left-0 top-4 text-[#7B746E] font-sans text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#2C2723] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#2C2723] pointer-events-none">Name</label>
            </div>
          )}

          <div className='relative'>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='peer w-full border-b border-[#2C2723]/30 py-4 bg-transparent outline-none focus:border-[#2C2723] transition-colors font-sans text-sm'
              type='email'
              placeholder=' '
              required
              autoComplete='email'
            />
            <label className="absolute left-0 top-4 text-[#7B746E] font-sans text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#2C2723] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#2C2723] pointer-events-none">Email Address</label>
          </div>

          <div className='relative'>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='peer w-full border-b border-[#2C2723]/30 py-4 bg-transparent outline-none focus:border-[#2C2723] transition-colors font-sans text-sm'
              type='password'
              placeholder=' '
              required
              autoComplete={currentState === 'Login' ? 'current-password' : 'new-password'}
            />
            <label className="absolute left-0 top-4 text-[#7B746E] font-sans text-xs tracking-widest uppercase transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#2C2723] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-[#2C2723] pointer-events-none">Password</label>
          </div>
        </div>

        <div className='flex flex-col gap-6 mt-4'>
          <button
            type='submit'
            className='w-full bg-[#2C2723] text-[#F8F5F1] py-5 font-sans text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors'
          >
            {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
          </button>
          
          <div className='w-full flex justify-between font-sans text-[10px] tracking-widest uppercase text-[#7B746E]'>
            {currentState === 'Login' ? (
              <>
                <p className='cursor-pointer hover:text-[#2C2723] transition-colors'>Forgot Password?</p>
                <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer hover:text-[#2C2723] transition-colors'>Create Account</p>
              </>
            ) : (
              <p onClick={() => setCurrentState('Login')} className='cursor-pointer hover:text-[#2C2723] transition-colors w-full text-center'>Already have an account? Sign In</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
