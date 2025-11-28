import { createContext, useState, useEffect, useContext } from "react"

export const AuthContext = createContext()

// Create and export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

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
            setUser(data.user)
            localStorage.setItem("fabricUser", JSON.stringify(data.user))
          } else {
            localStorage.removeItem("fabricToken")
            localStorage.removeItem("fabricUser")
          }
        } catch {
          localStorage.removeItem("fabricToken")
          localStorage.removeItem("fabricUser")
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

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
          user: data.user
        }
      } else {
        return { success: false, error: data.message }
      }
    } catch {
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
    } catch {
      return { success: false, error: "Network error. Please try again." }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("fabricToken")
    localStorage.removeItem("fabricUser")
  }

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData)
    localStorage.setItem("fabricUser", JSON.stringify(updatedUserData))
  }

  // Role detection
  const getUserRole = () => {
    if (!user) return 'customer'

    if (user.role && typeof user.role === 'string') {
      return user.role
    }

    if (user.isAdmin) {
      return 'admin'
    }

    return 'customer'
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    updateUser,
    getUserRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
