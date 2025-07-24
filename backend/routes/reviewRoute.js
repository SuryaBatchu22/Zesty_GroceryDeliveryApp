import express from 'express';
import authUser from '../middlewares/authUser.js';
import { addReview, getReviewsByProduct } from '../controllers/reviewController.js';

const reviewRoute = express.Router();

reviewRoute.post('/add', authUser, addReview);
reviewRoute.get('/:productId', getReviewsByProduct);

export default reviewRoute;