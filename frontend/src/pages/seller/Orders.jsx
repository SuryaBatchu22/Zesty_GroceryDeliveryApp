import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets,  dummyOrders } from '../../assets/assets';
import toast from 'react-hot-toast';

const Orders = () => {

    const {currency, axios} = useAppContext();
    const [orders, setOrders] = useState([]);

    const fetchOrders=async()=>{
        try{
            const {data} =  await axios.get('/api/order/seller');
            if(data.success){
                setOrders(data.orders)
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    const statusHandler = async(event,orderId)=>{
        try {
            const {data} = await axios.post('/api/order/status', {orderId,status:event.target.value} )
            if(data.success){
                await fetchOrders()
                toast.success(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        fetchOrders();
    },[])


    return (
        <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
        <div className="md:p-10 p-4 space-y-4">
            <h2 className="text-lg font-medium">Orders List</h2>
            {orders.map((order, index) => (
                <div key={index} className="flex flex-col md:items-center md:flex-row justify-between gap-5 p-5 max-w-4xl rounded-md border border-gray-300">
                    <div className="flex gap-5 max-w-80">
                        <img className="w-12 h-12 object-cover " src={assets.box_icon} alt="boxIcon" />
                        <div>
                            {order.items.map((item, index) => (
                                <div key={index} className="flex flex-col">
                                    <p className="font-medium">
                                        {item.product.name}{" "} <span className="text-primary ">x {item.quantity}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                     {order && 
                     <div className="text-sm md:text-base text-black/60">
                        <p className='text-black/80'>{order.address?.firstName} {order.address?.lastName}</p>
                        <p>{order.address?.street}, {order.address?.city}</p>
                        <p>{order.address?.state}, {order.address?.zipcode}, {order.address?.country}</p>
                        <p></p>
                        <p>{order.address?.phone}</p>
                    </div>
                     }
                    

                    

                    <div className="flex flex-col text-sm md:text-base tet-black/60">
                        <p className="font-medium">Amount:{currency}{order.amount}</p>
                        <p>Method: {order.paymentType}</p>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                    </div>
                    <div>
                        <select onChange={(e)=>statusHandler(e,order._id)} value={order.status} className='border border-gray-600'>
                            <option value="Order Placed">Order Placed</option>
                            <option value="Packing">Packing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for delivery">Out For Delivery</option>
                            <option value="Delivered">Delivered</option>

                        </select>

                    </div>
                </div>
            ))}
        </div>
        </div>
    )
}

export default Orders