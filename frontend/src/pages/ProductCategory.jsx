import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const ProductCategory = () => {
    const {products} = useAppContext();
    const {category} = useParams();

    const searchCategory = categories.find((item)=>item.path.toLocaleLowerCase() === category)

    const filteredProducts = products.filter((product)=>product.category.toLocaleLowerCase() === category )
  return (
    <div className='mt-16'>
      {searchCategory && (
        <div className='flex flex-col items-end w-max'>
            <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
            <div className='w-16 h-0.5 bg-primary rounded-full'></div>
        </div>
      )}

      {filteredProducts.length> 0 ? (
          <div className='grid grid-cols-[repeat(auto-fit,_minmax(220px,220px))] gap-3 md:gap-6 mt-6 justify-items-center justify-center md:justify-evenly'>
             {filteredProducts.map((product)=>(
                 <ProductCard key={product._id} product={product}/>
             ))}
          </div>
      ): (
          <div className='flex items-center justify-center h-[60vh]'>
             <p className='text-2xl font-medium text-primary'>No Products Found</p>
          </div>
      )} 
    </div>
  )
}

export default ProductCategory