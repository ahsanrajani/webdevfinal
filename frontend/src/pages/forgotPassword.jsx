import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/user/verify-email`, { email });
      toast.success(res.data.message);
      setShowPasswordInput(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Email not found");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters");

    try {
      const res = await axios.post(`${BASE_URL}/api/user/reset-password`, {
        email,
        newPassword,
      });
      toast.success(res.data.message);
      setEmail("");
      setNewPassword("");
      setShowPasswordInput(false);
    window.location.href = "/login";
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-[90%] sm:max-w-96 mx-auto mt-20 text-gray-800 flex flex-col gap-5">
      <h2 className="text-2xl font-semibold">Reset Password</h2>

      <form onSubmit={showPasswordInput ? handlePasswordReset : handleEmailSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          className="px-3 py-2 border border-gray-800"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {showPasswordInput && (
          <input
            type="password"
            className="px-3 py-2 border border-gray-800"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        )}

        <button className="px-8 py-2 text-white bg-black hover:bg-gray-900">
          {loading
            ? "Please wait..."
            : showPasswordInput
            ? "Reset Password"
            : "Verify Email"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
