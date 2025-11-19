import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import './Auth.css'
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext)
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Updated handleSubmit to redirect based on user role
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError("Please fill in all fields.")
      return
    }

    const result = await login(form.email, form.password)
    if (result.success) {
      setError("")

      // Redirect based on user role
      if (result.user.isAdmin) {
        navigate("/admin") // Redirect to admin dashboard
      } else {
        navigate("/shop") // Redirect to regular user page
      }
    } else {
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

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <span
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: "796px",
          top: "49%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          // color: "black",
        }}
      >
        {showPassword ? <FaEye /> : <FaEyeSlash />}
      </span>
          </div>
           <p className="forgotten-password-switch">
          Forgotten your password? <Link to="/forgot-password">Reset password</Link>
        </p>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
       
      </div>
    </div>
  )
}

export default Login
