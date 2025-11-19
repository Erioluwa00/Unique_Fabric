import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage and verify with backend
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("fabricToken")
      const savedUser = localStorage.getItem("fabricUser")
      
      if (token && savedUser) {
        try {
          // Verify token with backend
          const response = await fetch("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            console.log('User data from /api/auth/me:', data.user);
            setUser(data.user)
          } else {
            // Token is invalid
            localStorage.removeItem("fabricToken")
            localStorage.removeItem("fabricUser")
          }
        } catch (error) {
          console.error("Auth check failed:", error)
          localStorage.removeItem("fabricToken")
          localStorage.removeItem("fabricUser")
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  // Updated login function
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        localStorage.setItem("fabricToken", data.token)
        localStorage.setItem("fabricUser", JSON.stringify(data.user))
        
        return { 
          success: true, 
          user: data.user // Return user data for redirect logic
        }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        localStorage.setItem("fabricToken", data.token)
        localStorage.setItem("fabricUser", JSON.stringify(data.user))
        return { success: true }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("fabricToken")
    localStorage.removeItem("fabricUser")
  }

  // NEW: Update user function for profile updates
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("fabricUser", JSON.stringify(updatedUserData));
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    updateUser, // Added this function
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}