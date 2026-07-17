import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';
import { ProductSkeleton } from '../components/Skeleton';

const Collection = () => {
  const { search, showSearch, backendUrl } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [subCategoriesList, setSubCategoriesList] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubcategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  
  // Pagination & Infinite Scroll state
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    if (category.includes(value)) {
      setCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setCategory((prev) => [...prev, value]);
    }
    setPage(1); // Reset page on filter change
    setFilterProducts([]); // Clear list
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    if (subCategory.includes(value)) {
      setSubcategory((prev) => prev.filter((item) => item !== value));
    } else {
      setSubcategory((prev) => [...prev, value]);
    }
    setPage(1);
    setFilterProducts([]);
  };

  const handleSort = (e) => {
    setSortType(e.target.value);
    setPage(1);
    setFilterProducts([]);
  };

  useEffect(() => {
    setPage(1);
    setFilterProducts([]);
  }, [search, showSearch]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let queryUrl = `${backendUrl}/api/product/list?page=${page}&limit=12`;
      if (showSearch && search) queryUrl += `&search=${search}`;
      if (category.length > 0) queryUrl += `&category=${category.join(',')}`;
      if (subCategory.length > 0) queryUrl += `&subCategory=${subCategory.join(',')}`;
      if (sortType) queryUrl += `&sortType=${sortType}`;

      const response = await axios.get(queryUrl);
      if (response.data.success) {
        const { products, pagination } = response.data;
        if (page === 1) {
          setFilterProducts(products);
        } else {
          setFilterProducts(prev => [...prev, ...products]);
        }
        setHasMore(page < pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [page, category, subCategory, sortType, search, showSearch]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/category/list');
        if (response.data.success) {
          const all = response.data.categories;
          setCategoriesList(all.filter(c => c.type === 'category'));
          setSubCategoriesList(all.filter(c => c.type === 'subCategory'));
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, [backendUrl]);

  return (
    <div className='relative flex flex-col md:flex-row gap-8 lg:gap-16 pt-32 px-6 md:px-12 lg:px-24 min-h-screen overflow-hidden'>
      {/* Background Aura */}
      <div className='absolute top-0 right-0 w-[800px] h-[800px] bg-[#C96A3C] rounded-full blur-[150px] opacity-[0.03] pointer-events-none translate-x-1/2 -translate-y-1/2'></div>
      
      {/* Editorial Sidebar Filter */}
      <div className='w-full md:w-48 lg:w-64 shrink-0 relative z-10'>
        <div className='sticky top-32 glass-panel p-6 rounded-2xl'>
          <p
            onClick={() => setShowFilter(!showFilter)}
            className='font-sans text-xs tracking-[0.2em] uppercase font-semibold flex items-center cursor-pointer gap-2 mb-8 text-[#2C2723]'
          >
            Filters
            <span className={`text-[10px] md:hidden transition-transform duration-300 ${showFilter ? 'rotate-90' : ''}`}>[+]</span>
          </p>

          <div className={`space-y-12 ${showFilter ? 'block' : 'hidden md:block'} transition-all`}>
            {/* Categories */}
            <div>
              <p className='font-serif italic text-[#7B746E] mb-4'>Category</p>
              <div className='flex flex-col gap-3 font-sans text-xs tracking-widest uppercase text-[#2C2723]'>
                {categoriesList.map((catObj) => (
                  <label key={catObj._id} className='flex items-center gap-3 cursor-pointer group'>
                    <input
                      className='appearance-none w-3 h-3 border border-[#2C2723] checked:bg-[#2C2723] flex items-center justify-center after:content-[""] checked:after:w-1 checked:after:h-1 checked:after:bg-[#F8F5F1] transition-colors cursor-pointer'
                      type='checkbox'
                      value={catObj.name}
                      onChange={toggleCategory}
                      checked={category.includes(catObj.name)}
                    />
                    <span className='group-hover:opacity-70 transition-opacity'>{catObj.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subcategories */}
            <div>
              <p className='font-serif italic text-[#7B746E] mb-4'>Type</p>
              <div className='flex flex-col gap-3 font-sans text-xs tracking-widest uppercase text-[#2C2723]'>
                {subCategoriesList.map((subObj) => (
                  <label key={subObj._id} className='flex items-center gap-3 cursor-pointer group'>
                    <input
                      className='appearance-none w-3 h-3 border border-[#2C2723] checked:bg-[#2C2723] flex items-center justify-center after:content-[""] checked:after:w-1 checked:after:h-1 checked:after:bg-[#F8F5F1] transition-colors cursor-pointer'
                      type='checkbox'
                      value={subObj.name}
                      onChange={toggleSubCategory}
                      checked={subCategory.includes(subObj.name)}
                    />
                    <span className='group-hover:opacity-70 transition-opacity'>{subObj.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Collection Area */}
      <div className='flex-1 relative z-10'>
        <div className='flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6'>
          <h1 className='font-serif text-5xl lg:text-7xl leading-none text-[#2C2723] drop-shadow-lg'>
            Archive <br />
            <span className='italic font-light text-[#C96A3C] opacity-90'>Index.</span>
          </h1>
          
          <div className='flex items-center border-b border-[rgba(44,39,35,0.1)] pb-1 w-max relative'>
             <select 
                onChange={handleSort} 
                value={sortType}
                className='bg-transparent font-sans text-xs tracking-[0.2em] uppercase text-[#2C2723] focus:outline-none cursor-pointer appearance-none pr-6 w-full'
             >
                <option className='bg-[#FDFBF8] text-[#2C2723]' value='relevant'>Sort: Relevant</option>
                <option className='bg-[#FDFBF8] text-[#2C2723]' value='low - high'>Sort: Ascending</option>
                <option className='bg-[#FDFBF8] text-[#2C2723]' value='high - low'>Sort: Descending</option>
             </select>
             <span className='absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-[#2C2723]'>▼</span>
          </div>
        </div>

        {/* Minimalist Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 pb-32'>
          {filterProducts.map((item, index) => {
             const isLastElement = filterProducts.length === index + 1;
             return (
              <div ref={isLastElement ? lastElementRef : null} key={item._id || index}>
                <ProductItem
                  name={item.name}
                  id={item._id}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  discountInfo={item.discountInfo}
                  image={item.image}
                />
              </div>
            );
          })}
          
          {loading && (
             [...Array(6)].map((_, idx) => (
                <div key={`skel-${idx}`}>
                   <ProductSkeleton />
                </div>
             ))
          )}
          
          {!loading && filterProducts.length === 0 && (
            <div className='col-span-full py-12 text-center text-[#7B746E] font-serif italic text-xl'>
               No items found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
