import React, { forwardRef } from 'react'
import ProductCard from './ProductCard.jsx'
import { useAppContext } from '../context/AppContext'

const TopDiscounts = () => {
    const { products } = useAppContext();

    const topDiscountedProducts = products
        .filter((product) => product.inStock)
        .map(product => ({
            ...product,
            discountPercent: ((product.price - product.offerPrice) / product.price) * 100
        }))
        .sort((a, b) => b.discountPercent - a.discountPercent)
        .slice(0, 5);

    return topDiscountedProducts?.length > 0 && (
        <div className='mt-16' >
            <p className='text-2xl md:text-3xl font-medium'>Top Discounts</p>

            <div className='grid grid-cols-[repeat(auto-fit,_minmax(220px,220px))] gap-3 md:gap-6 mt-6 justify-items-center justify-center md:justify-evenly'>
                {topDiscountedProducts.map((product) => (
                    <ProductCard key={product._id} product={product || {}} />
                ))}

            </div>
        </div>
    )
}

export default TopDiscounts;