import React, { forwardRef } from 'react'
import ProductCard from './ProductCard.jsx'
import { useAppContext } from '../context/AppContext'
 
 const BestSeller = () => {
    const {products } = useAppContext();
    
    return products?.length > 0 && (
     <div  className='mt-16' >
        <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>

        <div className='grid grid-cols-[repeat(auto-fit,_minmax(220px,220px))] gap-3 md:gap-6 mt-6 justify-items-center justify-center md:justify-evenly'>
            {products?.length > 0 && products.filter((product)=>product.inStock).slice(0,5).map((product)=>(
              <ProductCard key={product._id} product={product || {}}/>
            ))}
            
        </div>
     </div>
   )
 }
 
 export default BestSeller;