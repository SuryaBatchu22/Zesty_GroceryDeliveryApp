import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const EditProfile = () => {
    const { user, axios, setUser, navigate } = useAppContext();

    const [showNameForm, setShowNameForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [newName, setNewName] = useState(user?.name || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // Update Name Handler
    const updateNameHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/user/update-name", {newName});
            if (data.success) {
                setUser((prev) => ({ ...prev, name: newName }));
                setShowNameForm(false);
                toast.success("Name updated successfully");
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Update Password Handler
    const updatePasswordHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/user/update-password", {
                currentPassword,
                newPassword,
            });
            if (data.success) {
                setShowPasswordForm(false);
                setCurrentPassword("");
                setNewPassword("");
                toast.success("Password updated");
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    console.log(user)

    return (
        <div className="min-h-screen flex flex-col items-center px-4 pt-20">
            <div className="w-full max-w-md bg-white shadow-lg p-6 rounded-lg space-y-6 border border-gray-200">
                <h2 className="text-2xl font-semibold text-center">Edit Profile</h2>

                {/* Name */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-bold">Name:</span>
                        <span className="px-4">{user?.name}</span>
                    </div>
                    <button
                        onClick={() => setShowNameForm(!showNameForm)}
                        className="text-primary text-sm underline cursor-pointer"
                    >
                        Edit
                    </button>
                </div>

                {showNameForm && (
                    <form onSubmit={updateNameHandler} className="space-y-2">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="New name"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary-dull text-white py-2 px-4 rounded w-full"
                        >
                            Update Name
                        </button>
                    </form>
                )}

                {/* Email */}
                <div className="flex items-center">
                    <span className="font-bold">Email:</span>
                    <span className="px-4">{user?.email}</span>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between">
                    <div>
                    <span className="font-bold">Password:</span>
                    <span className="px-4">########</span>
                    </div>
                    <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="text-primary text-sm underline cursor-pointer"
                    >
                        Edit
                    </button>
                </div>

                {showPasswordForm && (
                    <form onSubmit={updatePasswordHandler} className="space-y-2">
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current password"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary-dull text-white py-2 px-4 rounded w-full"
                        >
                            Update Password
                        </button>
                    </form>
                )}

                <div>
                    <button
                            onClick={()=>navigate('/')}
                            className="bg-primary hover:bg-primary-dull text-white py-2 px-4 rounded w-auto"
                        >
                            Back To Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
