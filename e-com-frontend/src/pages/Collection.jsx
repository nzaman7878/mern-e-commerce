import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubcategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');

  // ✅ Handle category filter toggle
  const toggleCategory = (e) => {
    const value = e.target.value;
    if (category.includes(value)) {
      setCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setCategory((prev) => [...prev, value]);
    }
  };

  // ✅ Handle subcategory filter toggle
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    if (subCategory.includes(value)) {
      setSubcategory((prev) => prev.filter((item) => item !== value));
    } else {
      setSubcategory((prev) => [...prev, value]);
    }
  };

  // ✅ Apply filters
  const applyFilter = () => {
    let filtered = products;

    if (category.length > 0) {
      filtered = filtered.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      filtered = filtered.filter((item) => subCategory.includes(item.subCategory));
    }

    setFilterProducts(filtered);
  };

  const sortProduct = () =>{
    let fpCopy = filterProducts.slice();
    switch(sortType) {
      case 'low - high' : 
      setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
      break;

      case 'high - low' : 
      setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
      break;

      default :
      applyFilter();
      break;
    }
  }

  // ✅ On first load, set all products
  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  // ✅ Whenever filters change, apply them
  useEffect(() => {
    applyFilter();
  }, [category, subCategory]);

  // Whenever sort change , apply them

  useEffect(()=>{
    sortProduct();
  },[sortType]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t px-4 sm:px-10'>
      {/* Filter Section */}
      <div className='min-w-60'>
        <p
          onClick={() => setShowFilter(!showFilter)}
          className='my-2 text-xl flex items-center cursor-pointer gap-2'
        >
          FILTERS
          <img
            className={`h-3 sm:hidden transition-transform duration-300 ${
              showFilter ? 'rotate-90' : ''
            }`}
            src={assets.dropdown_icon}
            alt='toggle'
          />
        </p>

        {/* Categories Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {['Men', 'Women', 'Kids'].map((cat) => (
              <label key={cat} className='flex gap-2'>
                <input
                  className='w-3'
                  type='checkbox'
                  value={cat}
                  onChange={toggleCategory}
                  checked={category.includes(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Subcategories Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {['Topwear', 'Bottomwear', 'Winterwear'].map((type) => (
              <label key={type} className='flex gap-2'>
                <input
                  className='w-3'
                  type='checkbox'
                  value={type}
                  onChange={toggleSubCategory}
                  checked={subCategory.includes(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Products */}
      <div className='flex-1'>
        <div className='flex justify-between items-center text-base sm:text-2xl mb-4'>
          <Title text1='All' text2='COLLECTIONS' />
          <select onChange={(e)=> setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2 py-1 rounded'>
            <option value='relevant'>Sort by: Relevant</option>
            <option value='low - high'>Sort by: Low to High</option>
            <option value='high - low'>Sort by: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
