import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import Customers from './pages/Customers'
import Add from './pages/Add'
import Edit from './pages/Edit'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
 import { ToastContainer } from 'react-toastify';



export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '₹'


const App = () => {

  const storedToken = localStorage.getItem('token') || '';

const [token, setToken] = useState(storedToken);

useEffect(() => {
  localStorage.setItem('token', token);
}, [token]);



  return (
   <div className='bg-gray-50 min-h-screen text-gray-900 font-sans'>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} className="text-sm" /> 
      {token === "" ?
      <Login setToken={setToken} /> :
      <div className='flex h-screen overflow-hidden'>
          <Sidebar />
          <div className='flex-1 flex flex-col overflow-hidden bg-gray-50'>
              <Navbar setToken={setToken} />
              <main className='flex-1 overflow-y-auto p-6 lg:p-8'>
                <div className='max-w-7xl mx-auto'>
                  <Routes>
                    <Route path='/' element={<Dashboard token={token} />} />
                    <Route path='/categories' element={<Categories token={token} />} />
                    <Route path='/customers' element={<Customers token={token} />} />
                    <Route path='/add' element={<Add token={token} />} />
                    <Route path='/edit/:id' element={<Edit token={token} />} />
                    <Route path='/list' element={<List token={token} />} />
                    <Route path='/orders' element={<Orders token={token} />} />
                  </Routes>
                </div>
              </main>
          </div>
      </div>
      }
   </div>
  )
}

export default App