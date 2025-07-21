import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getAllOrders, getUserOrder, placeOrderCOD, placeOrderStripe, updateOrderStatus } from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

//payment routes
orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.post('/stripe', authUser, placeOrderStripe);

//user routes
orderRouter.get('/user', authUser, getUserOrder);

//seller routes
orderRouter.get('/seller', authSeller, getAllOrders);
orderRouter.post('/status', authSeller, updateOrderStatus);



export default orderRouter;