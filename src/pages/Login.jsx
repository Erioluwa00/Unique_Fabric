// import { useState, useContext } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { AuthContext } from "../context/AuthContext"
// import './Auth.css'
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Login = () => {
//     const [showPassword, setShowPassword] = useState(false);
//   const { login } = useContext(AuthContext)
//   const [form, setForm] = useState({ email: "", password: "" })
//   const [error, setError] = useState("")
//   const navigate = useNavigate()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!form.email || !form.password) {
//       setError("Please fill in all fields.")
//       return
//     }

//     const result = await login(form.email, form.password)
//     if (result.success) {
//       setError("")

//       // Redirect based on user role
//       if (result.user.isAdmin) {
//         navigate("/admin")
//       } else {
//         navigate("/shop")
//       }
//     } else {
//       setError(result.error || "Login failed. Please try again.")
//     }
//   }

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <h1>Login</h1>
//         <p>Welcome back! Please log in to your account.</p>

//         {error && <div className="auth-error">{error}</div>}

//         <form className="auth-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Email Address</label>
//             <input
//               type="email"
//               autoComplete="username"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//               required
//             />
//           </div>

//           <div className="form-group password-input-container">
//             <label>Password</label>
//             <div className="password-input-wrapper">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 autoComplete="current-password"
//                 value={form.password}
//                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 required
//               />
//               <span
//                 className="password-toggle-icon"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>
//           </div>
          
//           <p className="forgotten-password-switch">
//             Forgotten your password? <Link to="/forgot-password">Reset password</Link>
//           </p>
//           <button type="submit" className="btn btn-primary">Login</button>
//         </form>

//         <p className="auth-switch">
//           Don't have an account? <Link to="/register">Register</Link>
//         </p>
//       </div>
//     </div>
//   )
// }

// export default Login


// // pages/Login.jsx - Fix the role detection
// import { useState, useContext } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { AuthContext } from "../context/AuthContext"
// import './Auth.css'
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const { login, getUserRole } = useContext(AuthContext) // Make sure getUserRole is destructured
//   const [form, setForm] = useState({ email: "", password: "" })
//   const [error, setError] = useState("")
//   const navigate = useNavigate()

//   // pages/Login.jsx - Add more detailed debugging
// const handleSubmit = async (e) => {
//   e.preventDefault()
//   if (!form.email || !form.password) {
//     setError("Please fill in all fields.")
//     return
//   }

//   console.log('🔄 Attempting login with:', form.email);
  
//   const result = await login(form.email, form.password)
//   console.log('📨 Login result:', result); 
  
//   if (result.success) {
//     setError("")

//     // Debug: Check what user data we have
//     console.log('👤 User data after login:', result.user);
    
//     // Get user role
//     const userRole = getUserRole();
//     console.log('🎯 Determined user role:', userRole);
//     console.log('📧 User email:', result.user.email);
    
//     // Redirect based on user role
//     if (['admin', 'manager', 'staff'].includes(userRole)) {
//       console.log('🚀 Redirecting to admin panel');
//       navigate("/admin")
//     } else {
//       console.log('🛍️ Redirecting to shop');
//       navigate("/shop")
//     }
//   } else {
//     console.log('❌ Login failed:', result.error);
//     setError(result.error || "Login failed. Please try again.")
//   }
// }

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <h1>Login</h1>
//         <p>Welcome back! Please log in to your account.</p>

//         {error && <div className="auth-error">{error}</div>}

//         <form className="auth-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Email Address</label>
//             <input
//               type="email"
//               autoComplete="username"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//               required
//             />
//           </div>

//           <div className="form-group password-input-container">
//             <label>Password</label>
//             <div className="password-input-wrapper">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 autoComplete="current-password"
//                 value={form.password}
//                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 required
//               />
//               <span
//                 className="password-toggle-icon"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>
//           </div>
          
//           <p className="forgotten-password-switch">
//             Forgotten your password? <Link to="/forgot-password">Reset password</Link>
//           </p>
//           <button type="submit" className="btn btn-primary">Login</button>
//         </form>

//         <p className="auth-switch">
//           Don't have an account? <Link to="/register">Register</Link>
//         </p>

//         {/* Debug info - remove in production */}
//         <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '5px', fontSize: '12px' }}>
//           <strong>Test Accounts:</strong><br/>
//           Admin: admin@uniquefabric.com / UniqueAdmin123<br/>
//           Manager: manager@uniquefabric.com / Manager123<br/>
//           Staff: staff@uniquefabric.com / Staff123<br/>
//           Customer: any other email
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login


// $#$$$##############$$$$$$$$$$$$$$$$$

// pages/Login.jsx - Add more detailed debugging
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

        {/* Test accounts reminder */}
        <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '5px', fontSize: '12px' }}>
          <strong>Test Accounts:</strong><br/>
          Admin: admin@uniquefabric.com / UniqueAdmin123<br/>
          Manager: manager@uniquefabric.com / Manager123<br/>
          Staff: staff@uniquefabric.com / Staff123
        </div>
      </div>
    </div>
  )
}

export default Login