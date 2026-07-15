import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
const Sidebar = () => {
  const navLinkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
      isActive 
        ? 'bg-slate-100 text-slate-900 shadow-sm' 
        : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
    }`

  return (
    <aside className='w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex'>
        <div className='h-16 flex items-center px-6 border-b border-gray-200'>
          <span className='text-xs font-bold tracking-widest text-slate-400 uppercase'>Menu</span>
        </div>
        <nav className='flex-1 py-6 px-4 space-y-1 overflow-y-auto'>
            <NavLink className={navLinkClass} to="/">
                <span className='text-lg opacity-70'>📊</span>
                <p>Dashboard</p>
            </NavLink>

            <NavLink className={navLinkClass} to="/categories">
                <span className='text-lg opacity-70'>📁</span>
                <p>Categories</p>
            </NavLink>

            <NavLink className={navLinkClass} to="/customers">
                <span className='text-lg opacity-70'>👥</span>
                <p>Customers</p>
            </NavLink>

            <NavLink className={navLinkClass} to="/add">
                <span className='text-lg opacity-70'>➕</span>
                <p>Add Product</p>
            </NavLink>

            <NavLink className={navLinkClass} to="/list">
                <span className='text-lg opacity-70'>📋</span>
                <p>Product List</p>
            </NavLink>

            <NavLink className={navLinkClass} to="/orders">
                <span className='text-lg opacity-70'>📦</span>
                <p>Orders</p>
            </NavLink>

            <NavLink className={navLinkClass} to="/reviews">
                <span className='text-lg opacity-70'>⭐</span>
                <p>Reviews</p>
            </NavLink>
        </nav>
    </aside>
  )
}

export default Sidebar