import { createContext, useState, useEffect } from "react"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // Load cart from localStorage and refresh data from DB
  useEffect(() => {
    const fetchCartData = async () => {
      const savedCart = localStorage.getItem("fabricCart")
      if (!savedCart) return

      try {
        const parsedCart = JSON.parse(savedCart)
        const ids = parsedCart.map(item => item.id || item._id)

        if (ids.length > 0) {
          // Fetch latest product data from backend
          const res = await fetch(`http://localhost:5000/api/products/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids })
          })
          const products = await res.json()

          // Merge quantities with the fresh product data
          const mergedCart = products.map(product => {
            const savedItem = parsedCart.find(
              item => item.id === product._id || item.id === product.id
            )
            return {
              ...product,
              id: product._id || product.id,
              quantity: savedItem ? savedItem.quantity || 1 : 1,
            }
          })

          setCartItems(mergedCart)
        }
      } catch (error) {
        console.error("Error loading cart:", error)
      }
    }

    fetchCartData()
  }, [])

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("fabricCart", JSON.stringify(cartItems))
  }, [cartItems])

  // ----- The rest of your existing cart functions -----
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const normalizedProduct = { ...product, id: product.id || product._id }
      const existingItem = prevItems.find((item) => item.id === normalizedProduct.id)

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === normalizedProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prevItems, { ...normalizedProduct, quantity }]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId)
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setCartItems([])

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const getCartItemsCount = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0)


  const isInCart = (productId) => {
  return cartItems.some((item) => item.id === productId)
}

const getItemQuantity = (productId) => {
  const item = cartItems.find((item) => item.id === productId)
  return item ? item.quantity : 0
}


  const value = {
  cartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getCartTotal,
  getCartItemsCount,
  isInCart,
  getItemQuantity,
}


  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

