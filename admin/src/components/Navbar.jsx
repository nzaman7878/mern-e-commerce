import React from 'react'
import {assets} from '../assets/assets'

const Navbar = ({setToken}) => {
  return (
    <header className='sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='font-bold text-2xl tracking-tight text-slate-900'>Snazzy<span className='text-slate-500 font-light italic'>Fit.</span></div>
        </div>
        <div className='flex items-center gap-4'>
          <div className='hidden sm:flex items-center gap-2 mr-4 border-r border-gray-200 pr-4'>
            <div className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium'>
              A
            </div>
            <div className='text-sm font-medium text-slate-700'>Admin</div>
          </div>
          <button 
            onClick={()=>setToken('')} 
            className='bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 hover:text-slate-900 px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm'
          >
            Log Out
          </button>
        </div>
    </header>
  )
}

export default Navbar