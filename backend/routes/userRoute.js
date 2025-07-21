import express from 'express';
import { forgotPassword, isAuth, login, logout, register, resetPassword, updateName, updatePassword } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register' , register)
userRouter.post('/login' , login)
userRouter.get('/is-auth' ,authUser, isAuth)
userRouter.get('/logout' , authUser, logout)
userRouter.post('/forgot-password' , forgotPassword)
userRouter.post('/reset-password/:token' , resetPassword)
userRouter.post('/update-password' ,authUser, updatePassword)
userRouter.post('/update-name' ,authUser, updateName)


export default userRouter;