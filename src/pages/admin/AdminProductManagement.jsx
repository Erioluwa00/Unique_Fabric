import React, { useState, useEffect } from "react";
import "./AdminProductManagement.css";
const API_URL = "http://localhost:5000/api/products";

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "African Prints",
    "Silk",
    "Cotton",
    "Lace",
    "Denim",
    "Chiffon",
    "Canvas",
    "Velvet",
    "Linen",
    "Polyester"
  ];

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setError("");
    } catch (err) {
      setError("Failed to load products: " + err.message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((product) => product.category === filterCategory);
    }

    // Stock filter
    if (filterStock !== "all") {
      if (filterStock === "in-stock") {
        filtered = filtered.filter((product) => product.stock > 0);
      } else if (filterStock === "low-stock") {
        filtered = filtered.filter(
          (product) => product.stock > 0 && product.stock <= 10
        );
      } else if (filterStock === "out-of-stock") {
        filtered = filtered.filter((product) => product.stock === 0);
      }
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, filterCategory, filterStock]);

  const getStockStatus = (product) => {
    return product.status || (product.stock > 0 ? "In Stock" : "Out of Stock");
  };

  const getStockColor = (product) => {
    const stock = product.stock;
    if (stock === 0) return "#ef4444";
    if (stock <= 10) return "#f59e0b";
    return "#10b981";
  };

  const handleAddProduct = async (productData) => {
    try {
      setError("");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }

      const newProduct = await response.json();
      setProducts([...products, newProduct]);
      setShowAddModal(false);
    } catch (err) {
      setError("Failed to add product: " + err.message);
      console.error("Error adding product:", err);
    }
  };

  const handleEditProduct = async (productData) => {
    try {
      setError("");
      const response = await fetch(`${API_URL}/${selectedProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      const updatedProduct = await response.json();
      const updatedProducts = products.map((p) =>
        p._id === selectedProduct._id ? updatedProduct : p
      );
      setProducts(updatedProducts);
      setShowEditModal(false);
      setSelectedProduct(null);
    } catch (err) {
      setError("Failed to update product: " + err.message);
      console.error("Error updating product:", err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`${API_URL}/${productId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error('Failed to delete product');
        }

        setProducts(products.filter((p) => p._id !== productId));
      } catch (err) {
        setError("Failed to delete product: " + err.message);
        console.error("Error deleting product:", err);
      }
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const retryFetch = () => {
    fetchProducts();
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-management">
      <div className="product-management-header">
        <div>
          <h2>Product Management</h2>
          <p>Manage your fabric inventory and product catalog</p>
        </div>
        <button className="add-product-btn" onClick={() => setShowAddModal(true)}>
          + Add New Fabric
        </button>
      </div>

      {error && (
        <div className="error-message">
          <div className="error-content">
            <span>{error}</span>
            <button onClick={retryFetch} className="retry-btn">Retry</button>
          </div>
          <button onClick={() => setError("")} className="close-error">×</button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="product-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)}>
            <option value="all">All Stock Levels</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Product Stats */}
      <div className="product-stats">
        <div className="stat-item">
          <span className="stat-number">{products.length}</span>
          <span className="stat-label">Total Products</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{products.filter((p) => p.stock > 0).length}</span>
          <span className="stat-label">In Stock</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {products.filter((p) => p.stock > 0 && p.stock <= 10).length}
          </span>
          <span className="stat-label">Low Stock</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{products.filter((p) => p.stock === 0).length}</span>
          <span className="stat-label">Out of Stock</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              <img src={product.imageUrl || "/placeholder.svg"} alt={product.name} />
              <div className="product-actions">
                <button className="edit-btn" onClick={() => openEditModal(product)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDeleteProduct(product._id)}>
                  Delete
                </button>
              </div>
            </div>

            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-category">{product.category}</p>
              {product.sku && <p className="product-sku">SKU: {product.sku}</p>}
              <p className="product-description">{product.description}</p>

              <div className="product-details">
                <div className="price">${product.price}</div>
                <div className="product-management-stock-info">
                  <span className="stock-status" style={{ color: getStockColor(product) }}>
                    {getStockStatus(product)}
                  </span>
                  <span className="stock-count">
                    {product.stock} in stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="no-products">
          <p>No products found matching your criteria.</p>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <ProductModal
          title="Add New Fabric"
          onSave={handleAddProduct}
          onClose={() => setShowAddModal(false)}
          categories={categories}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <ProductModal
          title="Edit Fabric"
          product={selectedProduct}
          onSave={handleEditProduct}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          categories={categories}
        />
      )}
    </div>
  );
};

// Simplified ProductModal with essential fields first
const ProductModal = ({ title, product, onSave, onClose, categories }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    name: product?.name || "",
    category: product?.category || categories[0],
    price: product?.price || "",
    stock: product?.stock || "0",
    description: product?.description || "",
    sku: product?.sku || "",
    
    // Images
    imageUrl: product?.imageUrl || "",
    
    // Additional Details
    color: product?.color || "",
    texture: product?.texture || "",
    
    // Features (simple text area for now)
    features: product?.features?.join(", ") || "",
    suitableFor: product?.suitableFor?.join(", ") || "",
    
    // Basic Specifications
    fabricWeight: product?.specifications?.fabricWeight || "",
    composition: product?.specifications?.composition || "",
    careInstructions: product?.specifications?.careInstructions || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Process the form data for API
      const productData = {
        name: formData.name,
        category: formData.category,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        description: formData.description,
        sku: formData.sku,
        imageUrl: formData.imageUrl,
        color: formData.color,
        texture: formData.texture,
        features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [],
        suitableFor: formData.suitableFor ? formData.suitableFor.split(',').map(s => s.trim()).filter(s => s) : [],
        specifications: {
          fabricWeight: formData.fabricWeight,
          composition: formData.composition,
          careInstructions: formData.careInstructions,
        }
      };
      
      await onSave(productData);
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Basic Information */}
          <div className="form-section">
            <h4>Basic Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>SKU</label>
                <input 
                  type="text" 
                  name="sku" 
                  value={formData.sku} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price ($) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Current Stock *</label>
                <input 
                  type="number" 
                  name="stock" 
                  value={formData.stock} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Color</label>
                <input 
                  type="text" 
                  name="color" 
                  value={formData.color} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="3" 
                required 
              />
            </div>
          </div>

          {/* Images */}
          <div className="form-section">
            <h4>Images</h4>
            <div className="form-group">
              <label>Main Image URL *</label>
              <input 
                type="url" 
                name="imageUrl" 
                value={formData.imageUrl} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* Features */}
          <div className="form-section">
            <h4>Features & Uses</h4>
            <div className="form-group">
              <label>Key Features (comma-separated)</label>
              <textarea 
                name="features" 
                value={formData.features} 
                onChange={handleChange} 
                rows="2" 
                placeholder="Luxurious finish, Excellent drape, Temperature regulating"
              />
            </div>
            <div className="form-group">
              <label>Suitable For (comma-separated)</label>
              <textarea 
                name="suitableFor" 
                value={formData.suitableFor} 
                onChange={handleChange} 
                rows="2" 
                placeholder="Evening gowns, Blouses, Lingerie, Scarves"
              />
            </div>
          </div>

          {/* Basic Specifications */}
          <div className="form-section">
            <h4>Specifications</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Fabric Weight</label>
                <input 
                  type="text" 
                  name="fabricWeight" 
                  value={formData.fabricWeight} 
                  onChange={handleChange} 
                  placeholder="16 momme"
                />
              </div>
              <div className="form-group">
                <label>Composition</label>
                <input 
                  type="text" 
                  name="composition" 
                  value={formData.composition} 
                  onChange={handleChange} 
                  placeholder="100% Mulberry Silk"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Care Instructions</label>
              <input 
                type="text" 
                name="careInstructions" 
                value={formData.careInstructions} 
                onChange={handleChange} 
                placeholder="Dry clean only"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? "Saving..." : (product ? "Update" : "Add") + " Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductManagement;



// Im trying to make my Ecommerce website work I'm using MongoDB a my Database and nodeJS for backend while react for frontend

// Now what i want is for my AdminProductManagement to show the products from the database and should also be able to do CRUD fom the website which will reflect on the database also
// Secondly, for the User page, I want my Shop page, i want it to show product that's on the database.

// Now I'll attach the code to them below:

// AdminProductManagement.jsx: