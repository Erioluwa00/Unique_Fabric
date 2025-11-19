import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch categories from your database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        
        // Count products by category
        const categoryCounts = {};
        products.forEach(product => {
          if (product.category) {
            categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
          }
        });

        // Create category objects with real counts and appropriate images
        const dynamicCategories = Object.keys(categoryCounts).map(categoryName => {
          const count = categoryCounts[categoryName];
          return {
            name: categoryName,
            description: getCategoryDescription(categoryName),
            image: getCategoryImage(categoryName),
            count: `${count}+ fabric${count !== 1 ? 's' : ''}`,
            productCount: count
          };
        });

        // Sort by product count (descending) and take top 6
        const sortedCategories = dynamicCategories
          .sort((a, b) => b.productCount - a.productCount)
          .slice(0, 6);

        setCategories(sortedCategories);
        setError("");
      } catch (err) {
        setError("Failed to load categories");
        console.error("Error fetching categories:", err);
        
        // Fallback to default categories if API fails
        setCategories(getDefaultCategories());
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Helper function to get appropriate descriptions for each category
  const getCategoryDescription = (categoryName) => {
    const descriptions = {
      "African Prints": "Vibrant Ankara and traditional African patterns",
      "Silk": "Luxurious silk fabrics with elegant drape",
      "Cotton": "Soft, breathable organic cotton",
      "Lace": "Delicate lace & intricate embroidery",
      "Wool": "Premium wool blends for warmth",
      "Linen": "Natural linen for comfortable wear",
      "Denim": "Durable denim for casual fashion",
      "Chiffon": "Lightweight and sheer elegance",
      "Velvet": "Rich velvet with luxurious texture",
      "Polyester": "Durable and versatile synthetic blends",
      "Canvas": "Heavy-duty canvas for various uses",
      "Satin": "Smooth satin with glossy finish"
    };
    
    return descriptions[categoryName] || `Beautiful ${categoryName.toLowerCase()} fabrics`;
  };

  // Helper function to get appropriate images for each category
  const getCategoryImage = (categoryName) => {
    const categoryImages = {
      "African Prints": "https://i.pinimg.com/1200x/b6/01/0b/b6010b556395a9bb41a5b5ab32d34831.jpg",
      "Silk": "https://i.pinimg.com/1200x/fb/33/5e/fb335e5c756b6c9a8ba82805e3e5b53e.jpg",
      "Cotton": "https://i.pinimg.com/1200x/dc/8f/25/dc8f25d81c733f6fd42c0aa4b4df1cbf.jpg",
      "Lace": "https://i.pinimg.com/1200x/c0/76/41/c07641492a44b0cc4f5e00f1eecfeb04.jpg",
      "Wool": "https://i.pinimg.com/1200x/76/02/a0/7602a0982f954bcc3165970abd175af5.jpg",
      "Linen": "https://i.pinimg.com/1200x/0c/29/48/0c2948e5aa1b66397f08c384e87280e4.jpg",
      "Denim": "https://i.pinimg.com/1200x/7a/5a/93/7a5a9399faa9ad2259c4a4644adee04c.jpg",
      "Chiffon": "https://i.pinimg.com/1200x/bf/bd/40/bfbd40b595fd30ca5ae74d849cda7b62.jpg",
      "Velvet": "https://i.pinimg.com/1200x/81/ca/e1/81cae10a73897b489a21a3a7a6c2af4c.jpg",
      "Polyester": "https://i.pinimg.com/1200x/62/b4/bf/62b4bfa5b49fd574a9ae26f6f19a91ba.jpg",
      "Canvas": "https://i.pinimg.com/1200x/65/fd/d8/65fdd89c31aa18f8865018e669f11523.jpg",
      "Satin": "https://i.pinimg.com/1200x/d3/b1/d5/d3b1d50e556378a284701f2a07e535f4.jpg"
    };
    
    return categoryImages[categoryName] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center";
  };

  // Fallback categories if API fails
  const getDefaultCategories = () => [
    {
      name: "African Prints",
      description: "Vibrant Ankara and traditional African patterns",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center",
      count: "Loading...",
    },
    {
      name: "Silk",
      description: "Luxurious silk fabrics with elegant drape",
      image: "https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=400&h=300&fit=crop&crop=center",
      count: "Loading...",
    },
    {
      name: "Cotton",
      description: "Soft, breathable organic cotton",
      image: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=400&h=300&fit=crop&crop=center",
      count: "Loading...",
    },
    {
      name: "Linen",
      description: "Natural linen for comfortable wear",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center",
      count: "Loading...",
    },
    {
      name: "Denim",
      description: "Durable denim for casual fashion",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5b?w=400&h=300&fit=crop&crop=center",
      count: "Loading...",
    },
    {
      name: "Wool",
      description: "Premium wool blends for warmth",
      image: "https://images.unsplash.com/photo-1598706449009-ae0136c3423c?w=400&h=300&fit=crop&crop=center",
      count: "Loading...",
    }
  ];

  if (loading) {
    return (
      <section className="category-grid">
        <div className="container">
          <div className="ffabric-header">
            <h2>Shop by Category</h2>
            <p>Explore our extensive collection organized by fabric type</p>
          </div>
          <div className="loading">Loading categories...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="category-grid">
      <div className="container">
        <div className="ffabric-header">
          <h2>Shop by Category</h2>
          <p>Explore our extensive collection organized by fabric type</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="categories-grid">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={`/shop?category=${encodeURIComponent(category.name)}`} 
              className="category-card"
            >
              <div className="category-image">
                <img 
                  src={category.image || "/placeholder.svg"} 
                  alt={category.name}
                  onError={(e) => {
                    e.target.src = "/placeholder.svg";
                  }}
                />
                <div className="category-overlay">
                  <div className="category-content">
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <span className="category-count">{category.count}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && !loading && (
          <div className="no-categories">
            <p>No categories available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;