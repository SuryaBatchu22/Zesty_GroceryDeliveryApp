import React from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';
import StarRating from '../../components/StarRating';
import { useState } from 'react';

const ManageReviews = () => {

    const { products,axios, fetchProducts } = useAppContext();
    const [visibleCount, setVisibleCount] = useState(3);
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            const { data } = await axios.post("/api/review/delete", { reviewId });
            if (data.success) {
                toast.success(data.message);
                fetchProducts()
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to delete review");
            console.log(error.message)
        }
    };


    return products?.length > 0 && (
        <div className='className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between"'>
            <div className="flex flex-col mt-6 w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">Manage Reviews</h2>
                <>
                    {products.map((product, index) => product?.review?.length > 0 && (
                        <div key={product._id} className="bg-white p-4 rounded-md shadow mb-4">
                            <div className="flex justify-between items-center w-full mb-2">
                                <h4 className="font-semibold">{product.name}</h4>
                                {openIndex === index ? (
                                    <button className='w-auto px-2 bg-primary/10 text-primary hover:bg-primary/30 transition cursor-pointer' onClick={() => toggle(index)}>Hide Reviews</button>
                                ) : (
                                    <button className='w-auto px-2 bg-primary/10 text-primary hover:bg-primary/30 transition cursor-pointer' onClick={() => toggle(index)}>View Reviews</button>
                                )}

                            </div>
                            {openIndex === index && product?.review.slice(0, visibleCount).map((r, i) => (
                                <div className='flex flex-col p-2 rounded-md shadow' key={i}>
                                    <div className="flex justify-between items-start">
                                        <p className="text-gray-700 font-semibold mr-2">{r?.userId?.name}&nbsp;&nbsp;
                                            <span className='font-medium text-sm'>{`(${new Date(r.createdAt).toLocaleDateString()})`}</span></p>
                                        <span className="flex items-center"><StarRating rating={r.rating} />&nbsp;
                                            <span>{`(${r.rating})`}</span></span>
                                    </div>
                                    <div className="flex justify-between w-full ">
                                        <p className="text-sm text-gray-700 mr-2">{r.comment}</p>
                                        <button onClick={() => handleDeleteReview(r._id)}
                                            className='w-auto px-2 cursor-pointer  text-black hover:text-primary hover:underline'>Delete</button>
                                    </div>
                                </div>
                            ))}
                            <div className="flex gap-4 mt-2">
                                {openIndex === index && product?.review?.length > visibleCount && (
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
                        </div>
                    ))}
                </>
            </div>
        </div>
    )
}

export default ManageReviews;