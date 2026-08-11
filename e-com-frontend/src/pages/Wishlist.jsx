import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'
import Title from '../components/Title'

const Wishlist = () => {
    const { products, wishlist } = useContext(ShopContext)
    const [wishlistProducts, setWishlistProducts] = useState([])

    useEffect(() => {
        if (products.length > 0) {
            setWishlistProducts(products.filter(item => wishlist.includes(item._id)))
        }
    }, [products, wishlist])

    return (
        <div className='border-t pt-14 border-[#2C2723]/10'>
            <div className='text-2xl mb-8'>
                <Title text1={'MY'} text2={'WISHLIST'} />
            </div>

            {wishlistProducts.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-20 opacity-50'>
                    <p className='font-serif text-2xl text-[#2C2723] mb-4'>Your wishlist is empty</p>
                    <p className='text-sm uppercase tracking-widest'>Explore our collection to add items</p>
                </div>
            ) : (
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 gap-y-12 lg:gap-8 lg:gap-y-16'>
                    {wishlistProducts.map((item, index) => (
                        <ProductItem
                            key={index}
                            id={item._id}
                            name={item.name}
                            price={item.price}
                            image={item.image}
                            originalPrice={item.originalPrice}
                            discountInfo={item.discountInfo}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Wishlist
