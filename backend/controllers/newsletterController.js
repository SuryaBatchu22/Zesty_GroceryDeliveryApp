import nodemailer from "nodemailer";
import NewsletterSubscriber from "../models/NewsLetterSubscriber.js";

// Gmail transporter setup (free)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS  // App password from Gmail
    }
});

//newslettersubscribe : /api/newsletter/subscribe
export const subscribe = async (req, res) => {
    try {

        const { email } = req.body;

        // Check if already subscribed
        const exists = await NewsletterSubscriber.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Already subscribed!" })
        }

        // Save to DB
        await NewsletterSubscriber.create({ email })

        // Send Thank You email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Thanks for Subscribing!",
            html: `
        <h3>🎉 Thanks for subscribing to Zesty!</h3>
        <p>You'll now receive the latest offers, new arrivals, and discounts.</p>
        <p>If you wish to unsubscribe, <a href="${process.env.BASE_API_URL}/api/newsletter/unsubscribe?email=${email}">click here</a>.</p>
      `
        });

        res.json({ success: true, message: "Subscribed successfully." })

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server Error, please try again later" })

    }
}

//unsubscribe: /api/newsletter/unsubscribe

export const unsubscribe = async (req, res) => {
    try {
        const email = req.query.email;

        const removed = await NewsletterSubscriber.findOneAndDelete({ email });

        if (!removed) {
            return res.send("<h3>Email not found or already unsubscribed.</h3>");
        }

        // Send Unsubscribe confirmation
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "You've Unsubscribed",
            html: `<p>You have been unsubscribed from our grocery app newsletter.</p>`
        });

        res.send("<h3>✅ You have been successfully unsubscribed.</h3>");
    } catch (error) {
        console.error(err);
        res.status(500).send("<h3>Server error during unsubscribe.</h3>");

    }
}