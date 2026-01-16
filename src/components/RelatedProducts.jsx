import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const RelatedProducts = ({ currentProduct }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch related products from your database
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const allProducts = await response.json();
        
        // Transform the data to match frontend structure
        const transformedProducts = allProducts.map(product => ({
          id: product._id, // Use MongoDB _id as id
          name: product.name,
          price: product.price,
          image: product.imageUrl, // Map imageUrl to image
          category: product.category,
          description: product.description,
          inStock: product.stock > 0,
          stock: product.stock
        }));

        // Filter out current product and find related products
        let related = transformedProducts.filter(product => 
          product.id !== currentProduct.id
        );

        // Priority 1: Same category products
        const sameCategory = related.filter(product => 
          product.category === currentProduct.category
        );

        // Priority 2: Similar price range (±20%)
        const similarPrice = related.filter(product => {
          const priceDiff = Math.abs(product.price - currentProduct.price);
          const priceThreshold = currentProduct.price * 0.2; // 20% threshold
          return priceDiff <= priceThreshold && product.category !== currentProduct.category;
        });

        // Priority 3: Other in-stock products
        const otherInStock = related.filter(product => 
          product.inStock && 
          product.category !== currentProduct.category &&
          !similarPrice.includes(product)
        );

        // Combine with priority: same category -> similar price -> other in-stock
        const combinedRelated = [
          ...sameCategory,
          ...similarPrice,
          ...otherInStock
        ];

        // Remove duplicates and take first 4
        const uniqueRelated = combinedRelated.filter((product, index, self) =>
          index === self.findIndex(p => p.id === product.id)
        ).slice(0, 4);

        // If we don't have enough related products, fill with random in-stock products
        if (uniqueRelated.length < 4) {
          const remainingNeeded = 4 - uniqueRelated.length;
          const additionalProducts = related
            .filter(product => !uniqueRelated.some(p => p.id === product.id))
            .filter(product => product.inStock)
            .sort(() => 0.5 - Math.random())
            .slice(0, remainingNeeded);
          
          setRelatedProducts([...uniqueRelated, ...additionalProducts]);
        } else {
          setRelatedProducts(uniqueRelated);
        }

        setError("");
      } catch (err) {
        setError("Failed to load related products");
        console.error("Error fetching related products:", err);
        
        // Fallback: use mock data but filter out current product
        const fallbackRelated = getFallbackRelatedProducts(currentProduct);
        setRelatedProducts(fallbackRelated);
      } finally {
        setLoading(false);
      }
    };

    if (currentProduct && currentProduct.id) {
      fetchRelatedProducts();
    }
  }, [currentProduct]);

  // Fallback related products if API fails
  const getFallbackRelatedProducts = (currentProduct) => {
    const fallbackProducts = [
      {
        id: "1",
        name: "Vibrant Ankara Print - Gold & Blue",
        price: 32.99,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
        category: "African Prints",
      },
      {
        id: "2",
        name: "Classic Ankara Fabric - Red & Black",
        price: 28.50,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
        category: "African Prints",
      },
      {
        id: "3",
        name: "Premium Silk Fabric",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=300&h=300&fit=crop",
        category: "Silk",
      },
      {
        id: "4",
        name: "Organic Cotton",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=300&h=300&fit=crop",
        category: "Cotton",
      }
    ].filter(product => product.id !== currentProduct.id);
    
    return fallbackProducts.slice(0, 4);
  };

  if (loading) {
    return (
      <div className="related-products">
        <h3>You Might Also Like</h3>
        <div className="loading">Loading related products...</div>
      </div>
    );
  }

  if (error && relatedProducts.length === 0) {
    return (
      <div className="related-products">
        <h3>You Might Also Like</h3>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null; // Don't show section if no related products
  }

  return (
    <div className="related-products">
      <h3>You Might Also Like</h3>
      <div className="related-grid">
        {relatedProducts.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="related-item">
            <div className="related-image">
              <img 
                src={product.image || "/placeholder.svg"} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = "/placeholder.svg";
                }}
              />
              {!product.inStock && (
                <div className="out-of-stock-badge">Out of Stock</div>
              )}
            </div>
            <div className="related-info">
              <div className="related-category">{product.category}</div>
              <h4 className="related-name">{product.name}</h4>
              <div className="related-price">${product.price}/yard</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;