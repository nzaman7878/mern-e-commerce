import React, { useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Title from '../components/Title'

const ResetPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const { backendUrl } = useContext(ShopContext)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match")
        }
        
        try {
            const response = await axios.post(backendUrl + '/api/user/reset-password', { token, password })
            if (response.data.success) {
                toast.success("Password reset successfully")
                navigate('/login')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-[#2C2723]'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <Title text1={'RESET'} text2={'PASSWORD'} />
            </div>
            
            <input 
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
                type="password" 
                className='w-full px-3 py-2 border border-gray-300' 
                placeholder='New Password' 
                required 
            />
            <input 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                value={confirmPassword} 
                type="password" 
                className='w-full px-3 py-2 border border-gray-300' 
                placeholder='Confirm Password' 
                required 
            />
            
            <button type='submit' className='bg-[#2C2723] text-[#F8F5F1] font-light px-8 py-2 mt-4 hover:bg-black transition-colors'>
                Reset Password
            </button>
        </form>
    )
}

export default ResetPassword
