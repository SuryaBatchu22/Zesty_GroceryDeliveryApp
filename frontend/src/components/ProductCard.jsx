import React from "react";
import { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import StarRating from "./StarRating.jsx";

const ProductCard = ({ product }) => {
    const { currency, addToCart, updateCartItem, removeFromCart, cartItems, navigate } = useAppContext();

    function calculateOffPercentage(originalPrice, discountedPrice) {
        const off = ((originalPrice - discountedPrice) / originalPrice) * 100;
        return Math.round(off); // Rounded off to nearest integer
    }

    const totalRating = product.review.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = product.review.length > 0 ? totalRating / product.review.length : 0;
    
    return product && (
        <div onClick={() => {
            navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
            scrollTo(0, 0)
        }} className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full">
            <div className="group cursor-pointer flex items-center justify-center px-2">
                <img className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={product.image[0] || assets.placeholder_image} alt={product.name} />
            </div>
            <div className="text-gray-500/60 text-sm">
                <p>{product.category}</p>
                <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>
                <div className="flex items-center gap-0.5">
                    <StarRating rating = {averageRating.toFixed(1)}/>
                    <p className="text-semibold ml-2">{" "}{`(${averageRating.toFixed(1)})`}</p>
                </div>
                <div className="flex items-end justify-between mt-3">
                    {!product.offerPrice ? (
                        <p className="md:text-xl text-base font-medium text-primary">{currency}{product.price}</p>
                    ):(
                        <p className="md:text-xl text-base font-medium text-primary">

                        {currency}{product.offerPrice} {" "}<span className="text-gray-500/60 md:text-sm text-xs line-through">{currency}{product.price}{" "}</span>
                        {product.price - product.offerPrice === 0 ? null: 
                        <span className="text-gray-500/60 text-xs">{`(${calculateOffPercentage(product.price,product.offerPrice)}% off)`}</span> }
                    </p>
                    )}

                    <div onClick={(e) => { e.stopPropagation(); }} className="text-primary">
                        {!cartItems[product?._id] ? (
                            <button className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded cursor-pointer "
                                onClick={() => addToCart(product._id)} >
                                <img src={assets.cart_icon} alt='alt_icon' />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                                <button onClick={() => { removeFromCart(product._id) }} className="cursor-pointer text-md px-2 h-full" >
                                    -
                                </button>
                                <span className="w-5 text-center">{cartItems[product._id]}</span>
                                <button onClick={() => { addToCart(product._id) }} className="cursor-pointer text-md px-2 h-full" >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ProductCard;