import React, { useState } from "react";
import axios from "axios";
import "./VerifyOTP.css"; // your custom CSS
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });

      setMessage(res.data.message || "OTP verified successfully!");

      // Redirect to reset password page after success
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2>Verify OTP</h2>
        <p>Enter the OTP sent to your email address</p>

        <form onSubmit={handleVerifyOTP} className="otp-form">
          <div className="otp-form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="otp-input"
            />
          </div>

          <div className="otp-form-group">
            <label>OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="otp-input"
            />
          </div>

          <button type="submit" className="otp-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {message && <p className="otp-message">{message}</p>}
      </div>
    </div>
  );
};

export default VerifyOTP;
