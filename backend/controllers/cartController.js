import User from "../models/User.js";


//Update user cart data: /api/cart/update
export const updateCart = async(req,res)=>{
    try {
        const userId = req.user.id;
        const {cartItems} = req.body;

        await User.findByIdAndUpdate(userId,{cartItems})
        res.json({success:true, message:"cart updated"})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}