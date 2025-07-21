import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const ResetPassword = () => {
    const { token } = useParams();
    const { axios, navigate} = useAppContext();

    const [newPassword, setNewPassword] = useState("");

    const onSubmitHandler = async (e) => {

        try {
            e.preventDefault();
            const { data } = await axios.post(`/api/user/reset-password/${token}`, {
                newPassword,
            });

            if (data.success) {
                toast.success(data.message);
                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || "Reset failed");
        }
    };

    return (
        <div onClick={() => navigate('/')} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
            <form onSubmit={onSubmitHandler}  onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <h2 className="text-2xl font-medium text-center">
                    <span className="text-primary">Reset</span> Password
                </h2>
                <p className="text-sm text-gray-500 text-center mb-2">Enter your new password below.</p>
                <input
                    type="password"
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit" className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
