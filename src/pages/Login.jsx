import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import './Auth.css'
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, getUserRole, user } = useContext(AuthContext)
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError("Please fill in all fields.")
      return
    }

    console.log('🔄 Attempting login with:', form.email);
    
    const result = await login(form.email, form.password)
    console.log('📨 Login API response:', result); 
    
    if (result.success) {
      setError("")

      // Debug: Check what user data we have
      console.log('👤 User object from backend:', result.user);
      console.log('🔍 Checking user properties:', {
        hasRole: !!result.user.role,
        roleValue: result.user.role,
        isAdmin: result.user.isAdmin,
        email: result.user.email
      });
      
      // Get user role with detailed debugging
      const userRole = getUserRole();
      console.log('🎯 Final determined user role:', userRole);
      
      // Check current user state in context
      console.log('📊 Current user in context:', user);
      
      // Redirect based on user role
      if (['admin', 'manager', 'staff'].includes(userRole)) {
        console.log('🚀 Redirecting to ADMIN panel');
        navigate("/admin", { replace: true });
      } else {
        console.log('🛍️ Redirecting to SHOP');
        navigate("/shop", { replace: true });
      }
    } else {
      console.log('❌ Login failed:', result.error);
      setError(result.error || "Login failed. Please try again.")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        <p>Welcome back! Please log in to your account.</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              autoComplete="username"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group password-input-container">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          
          <p className="forgotten-password-switch">
            Forgotten your password? <Link to="/forgot-password">Reset password</Link>
          </p>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  )
}

export default Login

