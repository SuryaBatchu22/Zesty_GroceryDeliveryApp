import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard';
import { assets } from '../assets/assets';
import { GrUnorderedList } from "react-icons/gr";

const AllProducts = () => {

    const { products, searchQuery, setSearchQuery } = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [showFilter, setShowFilter] = useState(false)
    const [category, setCategory] = useState([]);
    const [priceRange, setPriceRange] = useState([]);
    const [discountRange, setDiscountRange] = useState([]);
    const [sortType, setSortType] = useState('relavent')

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item !== e.target.value))
        }
        else {
            setCategory(prev => [...prev, e.target.value])
        }
    }

    const togglePriceRange = (e) => {
        if (priceRange.includes(e.target.value)) {
            setPriceRange(prev => prev.filter(item => item !== e.target.value))
        }
        else {
            setPriceRange(prev => [...prev, e.target.value])
        }
    }

    const toggleDiscountRange = (e) => {
        if (discountRange.includes(e.target.value)) {
            setDiscountRange(prev => prev.filter(item => item !== e.target.value))
        }
        else {
            setDiscountRange(prev => [...prev, e.target.value])
        }
    }

    const applyFilter = () => {
        let productsCopy = products.slice();

        if (category.length > 0) {
            productsCopy = productsCopy.filter(item => category.includes(item.category))
        }

        if (searchQuery.length > 0) {
            productsCopy = productsCopy.filter(
                product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
        }

        if (priceRange.length > 0) {
            productsCopy = productsCopy.filter(product => {
                return priceRange.some(range => {
                    const [min, max] = range.split('-').map(Number);
                    return product.offerPrice >= min && product.offerPrice <= max;
                });
            });
        }

        if (discountRange.length > 0) {
            productsCopy = productsCopy.filter(product => {
                return discountRange.some(minDiscount => {
                    const discount = ((product.price - product.offerPrice) / product.price) * 100;
                    return Math.round(discount) >= minDiscount;
                });
            });
        }

        switch (sortType) {
            case 'low-high':
                setFilteredProducts(productsCopy.sort((a, b) => a.offerPrice - b.offerPrice));
                break;

            case 'high-low':
                setFilteredProducts(productsCopy.sort((a, b) => b.offerPrice - a.offerPrice));
                break;

            case 'A-Z':
                setFilteredProducts(productsCopy.sort((a, b) => a.name.localeCompare(b.name)));
                break;

            case 'Z-A':
                setFilteredProducts(productsCopy.sort((a, b) => b.name.localeCompare(a.name)));
                break;
            default:
                break;
        }

        setFilteredProducts(productsCopy)
    }

    useEffect(() => {
        applyFilter();
    }, [searchQuery, category, products, priceRange, sortType, discountRange])

    return (
        <div className='mt-4 md:mt-12 flex flex-col'>
            <div className='flex flex-col md:flex-row gap-1 md:gap-6'>
                <div className='min-w-50 mt-1'>
                    <div className='flex flex-row-reverse justify-between md:flex-col md:gap-3'>
                        <div className='flex md:flex-col items-center md:items-start'>
                            <p className='md:text-xl items-center font-semibold md:pb-2.5 md:pt-1 pr-1 md:pr-0'>Sort By:</p>
                            <select onChange={(e) => setSortType(e.target.value)} className='border rounded border-gray-300  px-2 py-1 text-sm md:w-full'>
                            <option value="relavent">Relavent</option>
                            <option value="A-Z">A to Z</option>
                            <option value="Z-A">Z to A</option>
                            <option value="low-high">Low to High</option>
                            <option value="high-low">High to Low</option>
                        </select>
                        </div>
                        <div className='flex items-center border border-gray-300 rounded px-1 bg-gray-100 md:border-none md:bg-white'>
                            <GrUnorderedList className={`h-5 w-5 pr-1  md:hidden `}/>
                            <p onClick={() => setShowFilter(!showFilter)} className='md:my-2 md:text-xl flex items-center font-semibold'>Filters
                        </p>

                        </div>
                        
                        
                    </div>
                    <div className={`border rounded border-gray-300 pl-3 py-3 mt-1  ${showFilter ? '' : 'hidden'} md:block`}>
                        <p className='mb-3 text-sm font-medium'>Categories</p>
                        <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                            <p className='flex gap-2'>
                                <input className='w-3' type='checkbox' value={'Vegetables'} onChange={toggleCategory} />Organic Veggies
                            </p>
                            <p className='flex gap-2'>
                                <input className='w-3' type='checkbox' value={'Fruits'} onChange={toggleCategory} />Fresh Fruits
                            </p>
                            <p className='flex gap-2'>
                                <input className='w-3' type='checkbox' value={'Drinks'} onChange={toggleCategory} />Cold Drinks
                            </p>
                            <p className='flex gap-2'>
                                <input className='w-3' type='checkbox' value={'Instant'} onChange={toggleCategory} />Instant Food
                            </p>
                            <p className='flex gap-2'>
                                <input className='w-3' type='checkbox' value={'Dairy'} onChange={toggleCategory} />Dairy Products
                            </p>
                            <p className='flex gap-2'>
                                <input className='w-3' type='checkbox' value={'Bakery'} onChange={toggleCategory} />Bakery & Breads
                            </p>
                            <p className='flex gap-2'>
                                <input className='w-3' type='checkbox' value={'Grains'} onChange={toggleCategory} />Grains & Cereals
                            </p>
                        </div>
                    </div>

                    <div className={`border border-gray-300 rounded pl-5 py-3 mt-3  ${showFilter ? '' : 'hidden'} md:block`}>
                        <p className='mb-3 text-sm font-medium'>Price Range</p>
                        <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                            <p className='flex gap-2'>
                                <input className='w-3' type='checkbox' value={'0-10'} onChange={togglePriceRange} />$0 - $10
                            </p>
                            <p className='flex gap-2'>
                                <input className='w-3' type='checkbox' value={'11-20'} onChange={togglePriceRange} />$11 - $20
                            </p>
                            <p className='flex gap-2'>
                                <input className='w-3' type='checkbox' value={'20-1000'} onChange={togglePriceRange} />$21 - max
                            </p>
                        </div>

                    </div>

                    <div className={`border border-gray-300 rounded pl-5 py-3 mt-3  ${showFilter ? '' : 'hidden'} md:block`}>
                        <p className='mb-3 text-sm font-medium'>Discount Range</p>
                        <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                            <p className='flex gap-2'>
                                <input className='w-3' type='checkbox' value={'10'} onChange={toggleDiscountRange} />more than 10%
                            </p>
                            <p className='flex gap-2'>
                                <input className='w-3' type='checkbox' value={'20'} onChange={toggleDiscountRange} />more than 20%
                            </p>
                            <p className='flex gap-2'>
                                <input className='w-3' type='checkbox' value={'30'} onChange={toggleDiscountRange} />more than 30%
                            </p>
                            <p className='flex gap-2'>
                                <input className='w-3' type='checkbox' value={'40'} onChange={toggleDiscountRange} />more than 40%
                            </p>
                        </div>

                    </div>
                </div>

                <div className='flex flex-col w-full pt-4 md:pt-0'>
                    <div className='flex flex-col items-end w-max pb-3'>
                        {searchQuery.length > 0 ? (
                            <p className='text-lg md:text-2xl font-medium uppercase'>{`Search results for "${searchQuery}"`}</p>
                        ) : (
                            <p className='text-lg md:text-2xl font-medium uppercase'>All Products</p>
                        )}

                        <div className='w-24 h-0.5 bg-primary rounded full'></div>
                    </div>

                    <div className='grid grid-cols-[repeat(auto-fit,_minmax(220px,220px))] gap-3 md:gap-6  justify-items-center justify-center md:justify-start w-full'>
                        {filteredProducts.length > 0 ?
                            filteredProducts.filter((product) => product.inStock).map((product, index) => (
                                <ProductCard key={index} product={product} />
                            )) :
                            (<div className='items-center justify-center text-lg font-medium'> No products found</div>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllProducts