import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import "dotenv/config";
import nodemailer from "nodemailer";


//Register User  : /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing New User Details" })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.json({ success: false, message: "User Already Exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true, //prevent js to access cookie
            secure: process.env.NODE_ENV === 'production', //use secure cookiw in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //csrf protection
            maxAge: 7 * 24 * 60 * 60 * 1000, //cookie exp time:7d
        })

        return res.json({ success: true, user: { email: user.email, name: user.name }, message:"User registered successfully" })

    } catch (error) {
        console.log("Register Error:", error.message);
        res.json({ success: false, message: error.message })
    }

}

//Login User  : /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required" })
        };

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid email or password" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid email or password" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({ success: true, user: { email: user.email, name: user.name }, message:"User logged In" })

    } catch (error) {
        console.log("Login Error:", error.message);
        res.json({ success: false, message: error.message })
    }
}

//Check Auth: /api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password')
        return res.json({ success: true, user })

    } catch (error) {
        console.log("Auth Error:", error.message);
        res.status(500).json({ success: false, message: error.message })
    }
}

//Logout user : /api/user/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({ success: true, message: "Logged out" })
    } catch (error) {
        console.log("Logout Error:", error.message);
        res.json({ success: false, message: error.message })
    }

}

//forgot password: /api/user/forgot-password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.json({ success: false, message: "Email is required" })
        };
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid email" })
        }


        // Create short-lived token
        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_RESET_SECRET,
            { expiresIn: "10m" }
        );

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `
        <p>Hi ${user.name || "User"},</p>
        <p>Click the link below to reset your password. This link is valid for 10 minutes:</p>
        <a href="${resetLink}">${resetLink}</a>
      `
        });

        res.status(200).json({ success: true, message: "Reset link sent to your email." });

    } catch (error) {
        console.error("Forgot password error:", error);
        res.json({ success: false, message: error.message })
    }
}

//reset password: /api/user/reset-password/:token
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
        const user = await User.findById(decoded.id);
        if (!user){
             return res.status(404).json({ success: false, message: "User not found." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        
        res.status(200).json({ success: true, message: "Password has been reset." });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(400).json({ success: false, message: "Invalid or expired reset link." });
    }
}

//update password: /api/user/update-password/
export const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const {currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.json({ success: false, message: "current and new passwords are required" })
        };
        
        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid current password" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        
        res.status(200).json({ success: true, message: "Password has been updated." });

    } catch (error) {
        console.error("Update password error:", error);
        res.status(400).json({ success: false, message: "Unable to change password, please try again later" });
    }
}

//update-name: /api/user/update-name
export const updateName = async(req,res)=>{
    try {
        const userId = req.user.id;
        const {newName } = req.body;

        if (!newName) {
            return res.json({ success: false, message: "New name is required" })
        };

        const user = await User.findByIdAndUpdate(userId, {name:newName});

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        res.status(200).json({ success: true, message: "Name has been updated successfully." });

    } catch (error) {
        console.error("Update name error:", error);
        res.status(400).json({ success: false, message: "Unable to update your name, please try again later" });
        
    }
}