import React, { useState } from "react";
import axios from "axios";
import './ForgotPassword.css'
import { Link, useNavigate } from "react-router-dom"
const ForgotPassword = () => {
     const [email, setEmail] = useState("");
     const [message, setMessage] = useState("");
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate();
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(res.data.message || "OTP sent successfully! Check your email.");
       setTimeout(() => {
        navigate(`/verifyOTP?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
    return(
        <>
             <div class="fp-container">
        <div class="fp-card">
            <div class="fp-header">
                <h2>Forgot Password</h2>
                <p>Enter your email to receive an OTP</p>
            </div>
            
            <form class="fp-form" onSubmit={handleSendOTP}>
                <div class="fp-form-group">
                    <label for="email-address" class="sr-only">Email address</label>
                    <input 
                    id="email-address"
                    type="email" value={email}  
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                    class="fp-form-input" 
                    placeholder="Email address"/>
                </div>

                <div>
                    <button type="submit"  disabled={loading} class="fp-submit-btn">
                          {loading ? "Sending..." : "Send OTP"}
                    </button>
                </div>
            </form>
              {message && <p>{message}</p>}
            <div class="fp-footer-link">
               <Link to="/login" >
                    Back to Login
                </Link>
            </div>
        </div>
    </div>

        </>
    )
}
export default ForgotPassword;