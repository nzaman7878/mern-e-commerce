 
import { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App.jsx'
import { toast } from'react-toastify';

const Login = ({setToken}) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
        } else {
          toast.error(response.data.message);
        }
    } catch (error) {
      console.log(error);
      console.log(error.message)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center w-full bg-gray-50 font-sans'>
        <div className='bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl px-10 py-10 max-w-md w-full border border-gray-100'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-slate-900 tracking-tight'>Snazzy<span className='text-slate-500 font-light italic'>Fit.</span></h1>
          <p className='text-gray-500 mt-2 font-medium'>Sign in to your admin panel</p>
        </div>
        <form onSubmit={onSubmitHandler} className='flex flex-col gap-5'>
            <div className='w-full'>
                <label className='text-sm font-semibold text-slate-700 mb-2 block'>Email Address</label>
                <input 
                  onChange={(e)=>setEmail(e.target.value)} 
                  value={email} 
                  className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all outline-none bg-gray-50 focus:bg-white' 
                  type="email" 
                  placeholder='admin@example.com' 
                  required 
                />
            </div>
             <div className='w-full'>
                <div className='flex justify-between items-center mb-2'>
                  <label className='text-sm font-semibold text-slate-700'>Password</label>
                </div>
                <input 
                  onChange={(e)=>setPassword(e.target.value)} 
                  value={password} 
                  className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all outline-none bg-gray-50 focus:bg-white' 
                  type="password" 
                  placeholder='••••••••' 
                  required 
                />
            </div>
            <button 
              className='mt-4 w-full py-3.5 px-4 rounded-xl text-white bg-slate-900 hover:bg-slate-800 transition-colors font-semibold shadow-sm' 
              type='submit'
            >
              Sign in
            </button>
        </form>
      </div>
    </div>
  )
}

export default Login