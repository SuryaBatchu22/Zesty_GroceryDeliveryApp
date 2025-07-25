import express from 'express';
import authUser from '../middlewares/authUser.js';
import { addReview, deleteReview, deleteReviewByUser, getReviewsByProduct } from '../controllers/reviewController.js';
import authSeller from '../middlewares/authSeller.js';

const reviewRoute = express.Router();

reviewRoute.post('/add', authUser, addReview);
reviewRoute.get('/:productId', getReviewsByProduct);
reviewRoute.post('/delete', authSeller, deleteReview);
reviewRoute.delete('/delete/:reviewId', authUser, deleteReviewByUser);

export default reviewRoute;