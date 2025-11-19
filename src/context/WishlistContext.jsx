import { createContext, useState, useEffect } from "react"

export const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("fabricWishlist")
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist)
        // Ensure all items have proper id field
        const normalizedWishlist = parsedWishlist.map(item => ({
          ...item,
          id: item.id || item._id // Handle both id and _id
        }))
        setWishlistItems(normalizedWishlist)
      } catch (error) {
        console.error("Error parsing wishlist from localStorage:", error)
        setWishlistItems([])
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("fabricWishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      // Ensure product has proper id field
      const normalizedProduct = {
        ...product,
        id: product.id || product._id
      }
      
      const exists = prevItems.find((item) => item.id === normalizedProduct.id)
      if (!exists) {
        return [...prevItems, normalizedProduct]
      }
      return prevItems
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId)
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  const getWishlistCount = () => {
    return wishlistItems.length
  }

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}