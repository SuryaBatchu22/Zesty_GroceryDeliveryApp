import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/User.js";

//place order COD: /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, address } = req.body;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" })
        }

        //calculate amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        //add tax-2%
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'COD'
        });

        return res.json({ success: true, message: "Order Placed Successfully" })
    } catch (error) {
        console.log("COD error:", error.message)
        return res.json({ success: false, message: error.message })
    }
}

//place order stripe: /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, address } = req.body;

        const { origin } = req.headers;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid order data" })
        }

        let productData = [];

        //calculate amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity
            })
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        //add tax-2%
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'Online'
        });

        //stripe gateway initialization
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        //create line items for stripe
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                },
                quantity: item.quantity,
            }
        })

        //create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })

        console.log(session, 'stripe')

        return res.json({ success: true, url: session.url })
    } catch (error) {
        console.log("stripe error:", error.message)
        return res.json({ success: false, message: error.message })
    }
}


//Stripe webhooks to verify payments actions: /stripe
export const stripeWebhooks = async (req, res) => {
    //stripe gateway initialization
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            Request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Payment verification failed", error.message)
        res.status(400).send(`Webhook Error: ${error.message}`)
    }

    //handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;

            const orderId = session.metadata?.orderId;
            const userId = session.metadata?.userId;

            if (!orderId || !userId) {
                return console.error("Missing orderId or userId in metadata");
            }
            try {
                //mark payment as paid
                await Order.findByIdAndUpdate(orderId, { isPaid: true })

                //clear cart data
                await User.findByIdAndUpdate(userId, { cartItems: {} })
                console.log(" Order marked as paid & cart cleared");
            } catch (error) {
                console.error("DB Update Error:", error.message);
            }

            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            const paymenyIntentId = paymentIntent.id;

            //getting session metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymenyIntentId
            });

            const { orderId } = session.data[0].metadata;

            //mark payment as paid
            await Order.findByIdAndDelete(orderId);
            break;
        }
        default:
            console.error(`Unhadled event type ${event.type}`)
            break;
    }
    res.json({ received: true })
}

//get orders by userId: /api/order/user
export const getUserOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate('items.product').populate('address').sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log("get orders error:", error.message)
        return res.json({ success: false, message: error.message })
    }
}

//get all orders(for seller) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate('items.product').populate('address').sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.log("get all orders error:", error.message)
        return res.json({ success: false, message: error.message })
    }
}

//update order status from admin panel

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await Order.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: "Status updated" })
    } catch (error) {
        console.log("Order Status update error:", error);
        res.json({ success: false, message: error.message })
    }
}