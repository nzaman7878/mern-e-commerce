import { NavLink, Link } from 'react-router-dom';
import { assets } from '../assets/frontend_assets/assets';
import { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [vissible, setVisible] = useState(false);
  const {setShowSearch, getCartCount} = useContext(ShopContext);
  

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      <img src={assets.logo} alt='logo' className='w-36' />

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-6'>
        <img onClick={()=>setShowSearch(true)} src={assets.search_icon} alt='search' className='w-5 cursor-pointer' />

        <div className='group relative'>
          <img src={assets.profile_icon} alt='profile' className='w-5 cursor-pointer' />
          
          <div className='group-hover:block hidden absolute right-0 pt-4'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded-lg'>
              <p className='cursor-pointer hover:text-black'>My Profile</p>
              <p className='cursor-pointer hover:text-black'>Orders</p>
              <p className='cursor-pointer hover:text-black'>Logout</p>
            </div>
          </div>
        </div>

        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} alt='cart' className='w-5 min-w-5' />
          <p className='absolute right-[-5px] bottom-[-5px] text-center leading-4 bg-black text-white aspect-square rounded-full text-[10px]'>{getCartCount()}</p>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          alt='menu'
          className='w-5 cursor-pointer sm:hidden'
        />
      </div>
     {/* Mobile Menu */}
        {vissible && (
            <div className='fixed top-0 left-0 w-full h-full bg-black/50 z-50 sm:hidden' onClick={() => setVisible(false)}>
            <div className='absolute top-0 right-0 w-[70%] h-full bg-white p-5 flex flex-col gap-5'>
                <ul className='flex flex-col gap-5 text-sm text-gray-700'>
                <NavLink onClick={()=>setVisible(false)} to='/' className='flex flex-col items-center gap-1'>
                    <p>HOME</p>
                </NavLink>
                <NavLink onClick={()=>setVisible(false)} to='/collection' className='flex flex-col items-center gap-1'>
                    <p>COLLECTION</p>
                </NavLink>
                <NavLink onClick={()=>setVisible(false)} to='/about' className='flex flex-col items-center gap-1'>
                    <p>ABOUT</p>
                </NavLink>
                <NavLink onClick={()=>setVisible(false)} to='/contact' className='flex flex-col items-center gap-1'>
                    <p>CONTACT</p>
                </NavLink>
                </ul>
            </div>
            </div>
        )}
    </div>
  );
};

export default Navbar;
