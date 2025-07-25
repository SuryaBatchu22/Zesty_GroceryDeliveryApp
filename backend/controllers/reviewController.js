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

// DELETE: /api/review/delete
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.body;

    if (!reviewId) {
      return res.status(400).json({ success: false, message: "Review ID is required" });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.log("delete review error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// DELETE by user : /api/review/delete/:reviewId
export const deleteReviewByUser = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Optional: Only allow deleting own review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Review.findByIdAndDelete(reviewId);
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
