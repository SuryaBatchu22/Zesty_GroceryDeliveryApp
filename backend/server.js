import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import "dotenv/config";
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';
import newsletterRouter from './routes/newsletterRoute.js';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = process.env.PORT || 4000 ; 
app.use(express.json());

// Resolve __dirname (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Optional fallback in case favicon.ico is still not served
//app.get('/favicon.ico', (req, res) => res.status(204).end());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

await connectDB();          //db connection
await connectCloudinary();  //cloudinary connection

//Allow multiple Origins
const allowedOrigins =['http://localhost:5173','https://zesty-beta.vercel.app']

app.post('/stripe',express.raw({type:'application/json'}), stripeWebhooks)

//Middleware configuration
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials:true}));


app.get('/' , (req,res)=>{ 
    res.status(200).json("hello")
})


app.use('/api/user', userRouter) //user routes
app.use('/api/seller', sellerRouter) //seller routes
app.use('/api/product', productRouter) //product routes
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)
app.use('/api/newsletter', newsletterRouter)

app.listen(port , ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})
