import Review from "../models/Review.js";
import User from '../models/User.js';

//addReview: /api/review/add
export const addReview = async(req,res)=>{
    try {
        const userId = req.user.id;
        const{productId , rating, comment} = req.body;

        if(!productId || !rating){
            return res.json({success:false, message: "Rating is required"})
        }
        await Review.create({userId, productId, rating, comment})
        res.json({success:true, message:"Thank you for your review"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

//getReviews: /api/review/:productId
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).populate('userId', 'name').sort({ createdAt: -1 });; // so you get user names
    res.json({ success: true, reviews });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};