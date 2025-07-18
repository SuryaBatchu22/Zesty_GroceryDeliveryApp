import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {

    const { products, navigate, currency, addToCart, cartItems, removeFromCart } = useAppContext();
    const { id } = useParams();

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);

    const product = products.find((item) => item._id === id);

    function calculateOffPercentage(originalPrice, discountedPrice) {
        const off = ((originalPrice - discountedPrice) / originalPrice) * 100;
        return Math.round(off); // Rounded off to nearest integer
    }

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item) => item.category == product.category && item._id !== id)
            setRelatedProducts(productsCopy.filter((product) => product.inStock).slice(0, 5))
        }    
    }, [products])

  

    useEffect(() => {
        setThumbnail(product?.image[0] ? product.image[0] : assets.placeholder_image)
    }, [product])



    return product && (
        <div className="mt-12">
            <p>
                <Link to={'/'}>Home</Link> /
                <Link to={'/products'}>Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`} > {product.category}</Link> /
                <span className="text-primary"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image ? image : assets.placeholder_image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                                <img src={image || assets.placeholder_image} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={thumbnail} alt="Selected product" className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (

                            <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" className="md:w-4 w-3.5" />

                        ))}
                        <p className="text-base ml-2">(4)</p>
                    </div>

                    <div className="mt-6">
                        {!product.offerPrice ? (
                            <>
                                <p className="text-2xl font-medium">MSRP: {currency}{product.price}</p>
                                <span className="text-gray-500/70">(inclusive of all taxes)</span>
                            </>
                        ) :
                            (
                                <>
                                    <p className="text-gray-500/70 line-through">MSRP: {currency}{product.price}</p>
                                    <p className="text-2xl font-medium"><span className="text-xl bg-primary-dull/40">{"NOW:"}</span> {currency}{product.offerPrice}{" "}
                                        {product.price - product.offerPrice === 0 ? null: 
                                        <span className="text-gray-500/60 text-xs">{`(${calculateOffPercentage(product.price,product.offerPrice)}% off)`}</span> }</p>
                                    <span className="text-gray-500/70">(inclusive of all taxes)</span>
                                </>
                            )}
                    </div>

                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {(Array.isArray(product.description) ? product.description[0] : product.description || '')
                            .split('\n')
                            .map((line, index) =>
                                line.trim() ? <li key={index}>{line.trim()}</li> : null
                            )}
                    </ul>

                    <div className="flex items-center mt-10 gap-4 text-base">
                        {!cartItems[product._id] ? (
                            <button onClick={() => addToCart(product._id)} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" >
                                Add to Cart
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 py-3.5 w-full  bg-primary/25 rounded select-none ">
                                <button onClick={() => { removeFromCart(product._id) }} className="cursor-pointer text-md px-2" >
                                    -
                                </button>
                                <span className="w-5 text-center">{cartItems[product._id]}</span>
                                <button onClick={() => { addToCart(product._id) }} className="cursor-pointer text-md px-2 " >
                                    +
                                </button>
                            </div>
                        )}

                        <button onClick={() => { addToCart(product._id); navigate('/cart') }} className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition" >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>


            <div className="flex flex-col items-center mt-20">
                {relatedProducts.length > 0 ?
                    (
                        <>
                            <div className="flex flex-col items-center w-max">
                                <p className="text-3xl font-medium">Related Products</p>
                                <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
                            </div>
                            <div className="grid grid-cols-[repeat(auto-fit,_minmax(220px,220px))] gap-3 md:gap-6 mt-6 justify-items-center w-full">
                                {relatedProducts.map(
                                    (product, index) => (
                                        <ProductCard key={index} product={product} />
                                    )
                                )}
                            </div>
                        </>) : null}
                <button onClick={() => { navigate('/products'); scrollTo(0, 0); }} className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition">
                    See More
                </button>
            </div>
        </div>
    );
};

export default ProductDetails