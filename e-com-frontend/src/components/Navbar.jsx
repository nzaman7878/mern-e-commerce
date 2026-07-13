import { NavLink, Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/frontend_assets/assets';
import { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const {setShowSearch, getCartCount, navigate, token, setToken, setCartItems} = useContext(ShopContext);
  
  const logout = () => {
    if (token) {
       navigate("/login");
      setToken('');
      localStorage.removeItem('token');
      setCartItems([]);
    }
  };

  const handleSearchClick = () => {
    setShowSearch(true);
    navigate('/collection');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 px-6 md:px-12 flex items-center justify-between ${scrolled ? 'glass-nav py-4' : 'bg-transparent py-6'}`}>
        
        {/* Left: Menu Toggle */}
        <div className='flex-1 flex items-center'>
          <button 
            onClick={() => setVisible(true)}
            className='text-xs tracking-[0.2em] font-medium uppercase hover:opacity-70 transition-opacity'
          >
            Menu
          </button>
        </div>

        {/* Center: Logo */}
        <div className='flex-1 flex justify-center'>
          <Link to='/' onClick={() => window.scrollTo(0, 0)} className='group'>
            <h1 className='font-serif text-3xl md:text-4xl leading-none text-[#2C2723] transition-colors'>
              Snazzy<span className='italic font-light text-[#C96A3C]'>Fit.</span>
            </h1>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className='flex-1 flex items-center justify-end gap-6 md:gap-8'>
          <button onClick={handleSearchClick} className='hover:opacity-70 transition-opacity'>
            <img src={assets.search_icon} alt='search' className='w-4 md:w-5' />
          </button>

          <div className='group relative hidden sm:block'>
            <div onClick={() => token ? null : navigate('/login')} className='hover:opacity-70 transition-opacity block cursor-pointer'>
              <img src={assets.profile_icon} alt='profile' className='w-4 md:w-5' />
            </div>
            {token && 
              <div className='group-hover:block hidden absolute right-0 pt-6'>
                <div className='flex flex-col gap-3 w-40 py-4 px-6 glass-panel shadow-xl text-gray-300 text-sm rounded-xl border border-[rgba(44,39,35,0.05)]'>
                  <p onClick={() => navigate('/profile')} className='cursor-pointer hover:text-[#2C2723] transition-colors w-max'>My Profile</p>
                  <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-[#2C2723] transition-colors w-max'>Orders</p>
                  <p onClick={logout} className='cursor-pointer hover:text-[#2C2723] transition-colors w-max'>Logout</p>
                </div>
              </div>
            }
          </div>

          <Link to='/cart' className='relative flex items-center justify-center hover:opacity-70 transition-opacity'>
            <img src={assets.cart_icon} alt='cart' className='w-4 md:w-5' />
            <p className='absolute right-[-7px] bottom-[-7px] w-[18px] text-center leading-4 bg-[#C96A3C] text-[#2C2723] aspect-square rounded-full text-[9px] flex items-center justify-center font-bold shadow-[0_0_10px_rgba(201,106,60,0.6)]'>
              {getCartCount()}
            </p>
          </Link>
        </div>
      </div>

      {/* Full Screen Menu Overlay */}
      <div className={`fixed inset-0 bg-[#F8F5F1]/95 backdrop-blur-3xl z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${visible ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}>
        <div className='absolute top-6 right-6 md:top-10 md:right-12'>
          <button 
            onClick={() => setVisible(false)}
            className='text-xs tracking-[0.2em] font-medium uppercase hover:opacity-70 transition-opacity'
          >
            Close
          </button>
        </div>

        <div className='flex flex-col items-center justify-center h-full gap-8 md:gap-12'>
          <NavLink onClick={() => setVisible(false)} to='/' className='group overflow-hidden'>
            <p className='font-serif text-4xl md:text-7xl group-hover:text-[#C96A3C] transition-colors duration-500'>Home</p>
          </NavLink>
          <NavLink onClick={() => setVisible(false)} to='/collection' className='group overflow-hidden'>
            <p className='font-serif text-4xl md:text-7xl group-hover:text-[#C96A3C] transition-colors duration-500'>Collection</p>
          </NavLink>
          <NavLink onClick={() => setVisible(false)} to='/about' className='group overflow-hidden'>
            <p className='font-serif text-4xl md:text-7xl group-hover:text-[#C96A3C] transition-colors duration-500'>About</p>
          </NavLink>
          <NavLink onClick={() => setVisible(false)} to='/contact' className='group overflow-hidden'>
            <p className='font-serif text-4xl md:text-7xl group-hover:text-[#C96A3C] transition-colors duration-500'>Contact</p>
          </NavLink>
          
          <div className='mt-12 flex gap-8 sm:hidden'>
             <Link to='/login' onClick={() => setVisible(false)} className='text-xs uppercase tracking-widest editorial-link'>Account</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
