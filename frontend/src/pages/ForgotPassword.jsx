import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";


const ForgotPassword = () => {
  const { axios, navigate,showPassReset , setShowPassReset } = useAppContext();
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post("/api/user/forgot-password", { email });
      if (data.success) {
        toast.success(data.message);
        setEmail("");
        navigate('/');
        setShowPassReset(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div onClick={() => setShowPassReset(false)} className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
      <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
        <h2 className="text-2xl font-medium text-center">
          <span className="text-primary">Forgot</span> Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-2">Enter your registered email address. We'll send you a reset link.</p>
        <input
          type="email"
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
