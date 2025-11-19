import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import './Auth.css'
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useContext(AuthContext)
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.")
      return
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    const result = await register(form.name, form.email, form.password)
    if (result.success) {
      setError("")
      navigate("/shop") // redirect after successful register
    } else {
      setError(result.error || "Registration failed. Please try again.")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Join us and start exploring premium fabrics today.</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "796px",
                      top: "51.5%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "grey",
                    }}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
              <span
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: "796px",
          top: "62.5%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          color: "grey",
        }}
      >
        {showPassword ? <FaEye /> : <FaEyeSlash />}
      </span>
          </div>

          <button type="submit" className="btn btn-primary">Register</button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
