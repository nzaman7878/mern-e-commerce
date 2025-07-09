import React from 'react';
import { assets } from '../assets/frontend_assets/assets';

const Footer = () => {
  return (
    <div className='px-4 sm:px-10'>
      {/* Footer Content */}
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-20 text-sm'>
        {/* Brand Info */}
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt='SnazzyFit Logo' />
          <p className='w-full md:w-2/3 text-gray-600'>
            SnazzyFit is your go-to fashion destination for the latest trends, timeless classics, and premium comfort. We bring style to your doorstep with trust and quality.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+91 90876 53917</li>
            <li>support@snazzyfit.com</li>
          </ul>
        </div>
      </div>

      {/* Divider & Footer Bottom */}
      <hr className='border-gray-300' />
      <p className='py-5 text-sm text-center text-gray-500'>
        © 2025 SnazzyFit.com — All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
