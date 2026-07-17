import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'      
import ProductItem from './ProductItem'  

const RelatedProducts = ({category, subCategory}) => {

        const { backendUrl } = useContext(ShopContext);
        const [related, setRelated] = useState([]);

        useEffect (() => {
            const fetchRelated = async () => {
              try {
                let url = `${backendUrl}/api/product/list?limit=5`;
                if (category) url += `&category=${category}`;
                if (subCategory) url += `&subCategory=${subCategory}`;
                const response = await axios.get(url);
                if (response.data.success) {
                  setRelated(response.data.products);
                }
              } catch (error) {
                console.error("Failed to fetch related products", error);
              }
            };
            
            if (category) {
               fetchRelated();
            }
        }, [category, subCategory, backendUrl]);

  return (
    <div className='my-24'>
        <div className='text-center text-3xl py-2'>
            <Title text1={"RELATED"} text2={"PRODUCTS"} />

        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-6'>
            {related.map((item,index)=>(
                <ProductItem 
                key ={index}
                id = {item._id}
                name = {item.name}
                price = {item.price}
                originalPrice={item.originalPrice}
                discountInfo={item.discountInfo}
                image = {item.image}
                />
            ))}

        </div>

    </div>
  )
}

export default RelatedProducts