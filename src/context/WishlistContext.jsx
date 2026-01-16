import { createContext, useState, useEffect } from "react"

export const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  // ✅ Lazy initialization (loads before first render)
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem("fabricWishlist")
      if (!savedWishlist) return []

      return JSON.parse(savedWishlist).map(item => ({
        ...item,
        id: item.id || item._id,
      }))
    } catch (error) {
      console.error("Failed to load wishlist:", error)
      return []
    }
  })

  // ✅ Persist wishlist on every change
  useEffect(() => {
    localStorage.setItem("fabricWishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToWishlist = (product) => {
    setWishlistItems(prevItems => {
      const normalizedProduct = {
        ...product,
        id: product.id || product._id,
      }

      const exists = prevItems.some(item => item.id === normalizedProduct.id)
      if (exists) return prevItems

      return [...prevItems, normalizedProduct]
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems =>
      prevItems.filter(item => item.id !== productId)
    )
  }

  const clearWishlist = () => {
    setWishlistItems([])
    localStorage.removeItem("fabricWishlist")
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId)
  }

  const getWishlistCount = () => wishlistItems.length

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}
