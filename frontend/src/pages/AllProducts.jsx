import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard';

const AllProducts = () => {

    const {products, searchQuery, setSearchQuery} = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect (()=>{
        if(searchQuery.length > 0 ){
            setFilteredProducts(products.filter(
                product => product.name.toLowerCase().includes(searchQuery.toLowerCase())))
        }else{
            setFilteredProducts(products)
        }
    },[products,searchQuery])

  return (
    <div className='mt-16 flex flex-col'>
        <div className='flex flex-col items-end w-max'>
            {searchQuery.length > 0 ? (
                <p className='text-2xl font-medium uppercase'>{`Search results for "${searchQuery}"`}</p>
            ):(
                <p className='text-2xl font-medium uppercase'>All Products</p>
            )}
            
            <div className='w-24 h-0.5 bg-primary rounded full'></div>
        </div>
        
        <div className='grid grid-cols-[repeat(auto-fit,_minmax(220px,220px))] gap-3 md:gap-6 mt-6 justify-items-center justify-center sm:justify-start'>
           {filteredProducts.length > 0 ? 
           filteredProducts.filter((product)=>product.inStock).map((product,index)=>(
            <ProductCard key={index} product={product} />
           )):
           (<div  className='items-center justify-center text-lg font-medium'> No products found</div>)}   
        </div>

    </div>
  )
}

export default AllProducts