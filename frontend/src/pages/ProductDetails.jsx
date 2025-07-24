import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";
import StarRating from "../components/StarRating";

const ProductDetails = () => {

    const { products, navigate, currency, addToCart, cartItems, removeFromCart, axios, user } = useAppContext();
    const { id } = useParams();

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [visibleCount, setVisibleCount] = useState(3);

    const product = products.find((item) => item._id === id);

    function calculateOffPercentage(originalPrice, discountedPrice) {
        const off = ((originalPrice - discountedPrice) / originalPrice) * 100;
        return Math.round(off); // Rounded off to nearest integer
    }

    const getProductReviews = async () => {
        try {
            const { data } = await axios.get(`/api/review/${id}`);
            if (data.success) {
                setReviews(data.reviews)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!rating) {
            toast.error('Please select a rating.');
            return;
        }
        try {
            const { data } = await axios.post('/api/review/add', {
                productId: id,
                rating,
                comment,
            });

            if (data.success) {
                toast.success(data.message);
                setRating(0);
                setComment('');
                getProductReviews(); // optional callback to refresh list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item) => item.category == product.category && item._id !== id)
            setRelatedProducts(productsCopy.filter((product) => product.inStock).slice(0, 5))
        }

        setThumbnail(product?.image[0] ? product.image[0] : assets.placeholder_image);
        getProductReviews();
    }, [product])

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;



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
                        <StarRating rating = {averageRating.toFixed(1)}/>
                        <p className="text-semibold ml-2">{" "}{`(${averageRating.toFixed(1)})`}</p>
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
                                        {product.price - product.offerPrice === 0 ? null :
                                            <span className="text-gray-500/60 text-xs">{`(${calculateOffPercentage(product.price, product.offerPrice)}% off)`}</span>}</p>
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

            <div className="flex flex-col md:flex-row mt-20 w-full ">

                <div className="flex flex-col w-full mr-4">
                    <div className="flex flex-col items-center w-max mb-2">
                        <p className="text-xl font-medium">Customer Reviews</p>
                        <div className="w-15 h-0.25 bg-primary rounded-full mt-0.5"></div>
                    </div>
                    {reviews.length > 0 ? (
                        <>
                            {
                                reviews.slice(0, visibleCount).map((r) => (
                                    <div key={r._id} className="bg-white p-4 rounded-md shadow mb-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold">{r.userId.name}</h4>
                                            <span className="text-xs text-gray-500">
                                                {new Date(r.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm text-gray-700 mr-2">{r.comment}</p>
                                            <span className="flex items-center"><StarRating rating={r.rating}/>&nbsp;
                                            <span>{`(${r.rating})`}</span></span>
                                        </div>

                                    </div>
                                ))}
                            <div className="flex gap-4 mt-2">
                                {reviews.length > visibleCount && (
                                    <button
                                        onClick={() => setVisibleCount(prev => prev + 3)}
                                        className="text-primary hover:underline cursor-pointer"
                                    >
                                        Show more reviews
                                    </button>
                                )}

                                {visibleCount > 3 && (
                                    <button
                                        onClick={() => setVisibleCount(count => count - 3)}
                                        className="text-primary hover:underline cursor-pointer"
                                    >
                                        Show less
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className=" flex items-center justify-center h-[20vh] text-gray-500 italic">No reviews yet.</div>
                    )}
                </div >
                {user && (<div className="flex flex-col w-full md:w-2/3">
                    <div>
                        <form onSubmit={handleReviewSubmit} className="mt-4 bg-white shadow-md p-4 rounded-md space-y-4">
                            <h3 className="text-lg font-semibold">Leave a Review</h3>
                            <div>
                                <label className="block mb-1 text-sm">Rating</label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    className="border rounded w-full p-2 outline-none"
                                    required
                                >
                                    <option value="">-- Select --</option>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>{num} Star{num > 1 && 's'}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">Comment</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write something..."
                                    rows={3}
                                    className="border rounded w-full p-2 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-primary hover:bg-primary-dull text-white px-4 py-2 rounded w-full"
                            >
                                Submit Review
                            </button>
                        </form>

                    </div>
                </div>)}



            </div>



            <div className="flex flex-col items-center mt-20">
                {relatedProducts.length > 0 ?
                    (
                        <>
                            <div className="flex flex-col items-center w-max">
                                <p className="text-3xl font-medium">Related Products</p>
                                <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
                            </div>
                            <div className="grid grid-cols-[repeat(auto-fit,_minmax(220px,220px))] gap-3 md:gap-6 mt-6 justify-items-center w-full  justify-center md:justify-evenly">
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