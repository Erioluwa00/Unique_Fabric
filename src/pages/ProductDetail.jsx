import { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { WishlistContext } from "../context/WishlistContext"
import { useRecentlyViewed } from "../context/RecentlyViewedContext"
import ImageGallery from "../components/ImageGallery"
import ProductSpecs from "../components/ProductSpecs"
import ProductReviews from "../components/ProductReviews"
import FabricCalculator from "../components/FabricCalculator"
import RelatedProducts from "../components/RelatedProducts"
import '../components/ProductDetail.css';


const ProductDetail = () => {
  const { id } = useParams()
  const { addToCart, updateQuantity, getItemQuantity } = useContext(CartContext)
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState("description")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext)
  const { addToRecentlyViewed } = useRecentlyViewed()

  // Get cart quantity for this product
  const cartQuantity = product ? (getItemQuantity ? getItemQuantity(product.id) : 0) : 0

  // Fetch product from database
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`Product not found: ${response.status}`);
        }
        
        const productData = await response.json();
        
        // Transform database data to match frontend structure
        const transformedProduct = transformProductData(productData);
        setProduct(transformedProduct);
        
      } catch (err) {
        setError("Failed to load product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Track product view when product is loaded
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product, addToRecentlyViewed]);

  // Helper function to transform database data
  const transformProductData = (productData) => {
    // Generate basic fallback data based on category
    const fallbackData = generateFallbackData(productData);
    
    return {
      id: productData._id, // Map _id to id for frontend consistency
      name: productData.name,
      price: productData.price,
      images: productData.images && productData.images.length > 0 
        ? productData.images 
        : [productData.imageUrl || fallbackData.images[0]],
      category: productData.category,
      color: productData.color || fallbackData.color,
      texture: productData.texture || fallbackData.texture,
      description: productData.description || fallbackData.description,
      inStock: productData.stock > 0,
      stockQuantity: productData.stock,
      rating: productData.rating || fallbackData.rating,
      reviews: productData.reviews || fallbackData.reviews,
      
      // Features with fallbacks
      features: productData.features && productData.features.length > 0 
        ? productData.features 
        : fallbackData.features,
      
      // Suitable for with fallbacks
      suitableFor: productData.suitableFor && productData.suitableFor.length > 0 
        ? productData.suitableFor 
        : fallbackData.suitableFor,
      
      // Specifications with fallbacks
      specifications: productData.specifications && Object.keys(productData.specifications).length > 0
        ? productData.specifications
        : fallbackData.specifications
    };
  };

  // Generate fallback data based on product category
  const generateFallbackData = (productData) => {
    const fallbacks = {
      "African Prints": {
        color: "Multi-color",
        texture: "Wax Print",
        description: `Beautiful ${productData.name} featuring vibrant African patterns and traditional motifs. Perfect for traditional outfits and modern fashion.`,
        rating: 4.7,
        reviews: 15,
        features: ["Vibrant colors", "Traditional patterns", "Durable", "Cultural significance", "Breathable"],
        suitableFor: ["Traditional outfits", "Modern fashion", "Headwraps", "Home decor", "Accessories"],
        specifications: {
          fabricWeight: "5.5 oz/sq yd",
          width: "44 inches",
          composition: "100% Cotton",
          careInstructions: "Machine wash cold, gentle cycle",
          origin: "West Africa",
          stretch: "Minimal",
          opacity: "Opaque"
        },
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop"
        ]
      },
      "Silk": {
        color: "Various",
        texture: "Smooth",
        description: `Luxurious ${productData.name} with excellent drape and lustrous finish. Perfect for elegant evening wear and special occasions.`,
        rating: 4.8,
        reviews: 24,
        features: ["Lustrous finish", "Excellent drape", "Hypoallergenic", "Temperature regulating", "Naturally antimicrobial"],
        suitableFor: ["Evening gowns", "Blouses", "Lingerie", "Scarves", "Pillowcases"],
        specifications: {
          fabricWeight: "16 momme",
          width: "45 inches",
          composition: "100% Mulberry Silk",
          careInstructions: "Dry clean only",
          origin: "Italy",
          stretch: "None",
          opacity: "Semi-opaque"
        },
        images: [
          "https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=600&h=600&fit=crop"
        ]
      },
      "Cotton": {
        color: "Natural",
        texture: "Soft",
        description: `Soft and breathable ${productData.name} perfect for everyday wear and comfortable clothing.`,
        rating: 4.5,
        reviews: 18,
        features: ["Breathable", "Soft hand feel", "Easy care", "Eco-friendly", "Hypoallergenic"],
        suitableFor: ["Summer dresses", "Children's clothing", "Blouses", "Linings", "Curtains"],
        specifications: {
          fabricWeight: "4.5 oz/sq yd",
          width: "44 inches",
          composition: "100% Cotton",
          careInstructions: "Machine wash warm",
          origin: "India",
          stretch: "Minimal",
          opacity: "Opaque"
        },
        images: [
          "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=600&h=600&fit=crop"
        ]
      },
      "Linen": {
        color: "Natural",
        texture: "Textured",
        description: `Natural ${productData.name} with excellent breathability perfect for warm weather and sustainable fashion.`,
        rating: 4.6,
        reviews: 22,
        features: ["Highly breathable", "Sustainable", "Durable", "Absorbent", "Eco-friendly"],
        suitableFor: ["Summer suits", "Dresses", "Shirts", "Home textiles", "Table linens"],
        specifications: {
          fabricWeight: "6.5 oz/sq yd",
          width: "55 inches",
          composition: "100% Linen",
          careInstructions: "Machine wash cool, tumble dry low",
          origin: "Belgium",
          stretch: "None",
          opacity: "Opaque"
        },
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop"
        ]
      },
      "Denim": {
        color: "Indigo",
        texture: "Durable",
        description: `Classic ${productData.name} for durable and stylish casual wear that gets better with age.`,
        rating: 4.4,
        reviews: 30,
        features: ["Durable", "Classic look", "Comfortable", "Versatile", "Ages beautifully"],
        suitableFor: ["Jeans", "Jackets", "Shirts", "Skirts", "Bags"],
        specifications: {
          fabricWeight: "12 oz",
          width: "58 inches",
          composition: "100% Cotton",
          careInstructions: "Machine wash cold, inside out",
          origin: "USA",
          stretch: "Minimal",
          opacity: "Opaque"
        },
        images: [
          "https://images.unsplash.com/photo-1544966503-7cc5ac882d5b?w=600&h=600&fit=crop"
        ]
      },
      "Wool": {
        color: "Various",
        texture: "Warm",
        description: `Premium ${productData.name} providing excellent warmth and comfort for cold weather garments.`,
        rating: 4.7,
        reviews: 19,
        features: ["Excellent insulation", "Moisture wicking", "Durable", "Wrinkle resistant", "Natural"],
        suitableFor: ["Coats", "Suits", "Sweaters", "Blankets", "Winter accessories"],
        specifications: {
          fabricWeight: "10 oz/sq yd",
          width: "60 inches",
          composition: "100% Wool",
          careInstructions: "Dry clean recommended",
          origin: "New Zealand",
          stretch: "Natural elasticity",
          opacity: "Opaque"
        },
        images: [
          "https://images.unsplash.com/photo-1598706449009-ae0136c3423c?w=600&h=600&fit=crop"
        ]
      }
    };

    return fallbacks[productData.category] || {
      color: "Various",
      texture: "Standard",
      description: `High-quality ${productData.name} fabric suitable for various creative projects and fashion applications.`,
      rating: 4.5,
      reviews: 12,
      features: ["Quality material", "Durable", "Versatile", "Easy to work with"],
      suitableFor: ["Various projects", "Fashion", "Home decor", "Crafts"],
      specifications: {
        fabricWeight: "Standard weight",
        width: "45 inches",
        composition: "Quality materials",
        careInstructions: "Follow care label instructions",
        origin: "Various",
        stretch: "Standard",
        opacity: "Opaque"
      },
      images: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop"
      ]
    };
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
    }
  };

  const handleIncrease = () => {
    if (product) {
      updateQuantity(product.id, cartQuantity + 1);
    }
  };

  const handleDecrease = () => {
    if (product && cartQuantity > 1) {
      updateQuantity(product.id, cartQuantity - 1);
    } else if (product && cartQuantity === 1) {
      updateQuantity(product.id, 0);
    }
  };

  const handleWishlist = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="container">
          <div className="loading-spinner">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-not-found">
        <div className="container">
          <h2>Product Not Found</h2>
          <p>{error || "The product you're looking for doesn't exist."}</p>
          <Link to="/shop" className="btn btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        {/* Product Main Section */}
        <div className="product-main">
          <div className="product-gallery">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          <div className="product-info">
            <div className="product-header">
              <div className="product-category">{product.category}</div>
              <h1 className="product-title">{product.name}</h1>

              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? "star filled" : "star"}>
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="rating-text">({product.reviews} reviews)</span>
              </div>

              <div className="product-price">
                <span className="price">${product.price}</span>
                <span className="unit">per yard</span>
              </div>
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            <div className="product-features">
              <h4>Key Features:</h4>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="product-purchase">
              <div className="stock-info">
                {product.inStock ? (
                  <span className="in-stock">✓ {product.stockQuantity} yards in stock</span>
                ) : (
                  <span className="out-of-stock">✗ Out of stock</span>
                )}
              </div>

              <div className="purchase-actions product-actions-below">
                <button 
                  className="btn wishlist-btn" 
                  onClick={handleWishlist}
                  title={
                    isInWishlist(product.id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  {isInWishlist(product.id) ? "❤️ Remove from Wishlist" : "🤍 Add to Wishlist"}
                </button>
                
                {product.inStock ? (
                  cartQuantity > 0 ? (
                    <div className="quantity-controls">
                      <button 
                        className="qty-btn" 
                        onClick={handleDecrease}
                      >
                        -
                      </button>
                      <span className="qty-value">{cartQuantity}</span>
                      <button 
                        className="qty-btn" 
                        onClick={handleIncrease}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn add-to-cart" 
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </button>
                  )
                ) : (
                  <button 
                    className="btn out-of-stock-btn" 
                    disabled
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="product-tabs">
          <div className="tab-navigation">
            <button
              className={`tab-btn ${selectedTab === "description" ? "active" : ""}`}
              onClick={() => setSelectedTab("description")}
            >
              Description
            </button>
            <button
              className={`tab-btn ${selectedTab === "specifications" ? "active" : ""}`}
              onClick={() => setSelectedTab("specifications")}
            >
              Specifications
            </button>
            <button
              className={`tab-btn ${selectedTab === "calculator" ? "active" : ""}`}
              onClick={() => setSelectedTab("calculator")}
            >
              Fabric Calculator
            </button>
            <button
              className={`tab-btn ${selectedTab === "reviews" ? "active" : ""}`}
              onClick={() => setSelectedTab("reviews")}
            >
              Reviews ({product.reviews})
            </button>
          </div>

          <div className="tab-content">
            {selectedTab === "description" && (
              <div className="description-tab">
                <h3>About This Fabric</h3>
                <p>{product.description}</p>

                <h4>Suitable For:</h4>
                <div className="suitable-for">
                  {product.suitableFor.map((use, index) => (
                    <span key={index} className="use-tag">
                      {use}
                    </span>
                  ))}
                </div>

                <h4>Care Instructions:</h4>
                <p>{product.specifications.careInstructions}</p>
              </div>
            )}

            {selectedTab === "specifications" && (
              <ProductSpecs specifications={product.specifications} />
            )}

            {selectedTab === "calculator" && (
              <FabricCalculator product={product} />
            )}

            {selectedTab === "reviews" && (
              <ProductReviews 
                productId={product.id} 
                rating={product.rating} 
                reviewCount={product.reviews} 
              />
            )}
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts currentProduct={product} />
      </div>
    </div>
  )
}

export default ProductDetail