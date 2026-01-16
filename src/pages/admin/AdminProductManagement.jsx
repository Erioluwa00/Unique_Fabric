import React, { useState, useEffect } from "react";
import "./AdminProductManagement.css";

const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;
const CLOUDINARY_UPLOAD_PRESET = "Unique_Fabric"; 
const CLOUDINARY_CLOUD_NAME = "dy8mxgqzy";

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
        <div className="adminProduct-stat-item">
          <span className="adminProduct-stat-number">{products.length}</span>
          <span className="adminProduct-stat-label">Total Products</span>
        </div>
        <div className="adminProduct-stat-item">
          <span className="adminProduct-stat-number">{products.filter((p) => p.stock > 0).length}</span>
          <span className="adminProduct-stat-label">In Stock</span>
        </div>
        <div className="adminProduct-stat-item">
          <span className="adminProduct-stat-number">
            {products.filter((p) => p.stock > 0 && p.stock <= 10).length}
          </span>
          <span className="adminProduct-stat-label">Low Stock</span>
        </div>
        <div className="adminProduct-stat-item">
          <span className="adminProduct-stat-number">{products.filter((p) => p.stock === 0).length}</span>
          <span className="adminProduct-stat-label">Out of Stock</span>
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

// ProductModal Component with Cloudinary Upload
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
    
    // Features
    features: product?.features?.join(", ") || "",
    suitableFor: product?.suitableFor?.join(", ") || "",
    
    // Basic Specifications
    fabricWeight: product?.specifications?.fabricWeight || "",
    composition: product?.specifications?.composition || "",
    careInstructions: product?.specifications?.careInstructions || "",
    width: product?.specifications?.width || "",
    origin: product?.specifications?.origin || "",
    stretch: product?.specifications?.stretch || "",
    opacity: product?.specifications?.opacity || "",
  });

  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear the URL input when file is selected
      setFormData(prev => ({ ...prev, imageUrl: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = formData.imageUrl;
      
      // Upload new image if a file was selected
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        uploadFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        uploadFormData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: uploadFormData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.secure_url;
      }

      // Validate that we have an image
      if (!imageUrl && !product?.imageUrl) {
        throw new Error('Please upload an image or provide an image URL');
      }

      // Process the form data for API
      const productData = {
        name: formData.name,
        category: formData.category,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        description: formData.description,
        sku: formData.sku,
        imageUrl: imageUrl || product?.imageUrl,
        color: formData.color,
        texture: formData.texture,
        features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [],
        suitableFor: formData.suitableFor ? formData.suitableFor.split(',').map(s => s.trim()).filter(s => s) : [],
        specifications: {
          fabricWeight: formData.fabricWeight,
          composition: formData.composition,
          careInstructions: formData.careInstructions,
          width: formData.width,
          origin: formData.origin,
          stretch: formData.stretch,
          opacity: formData.opacity,
        }
      };
      
      await onSave(productData);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData(prev => ({ ...prev, imageUrl: "" }));
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

          {/* Images Section with Cloudinary Upload */}
          <div className="form-section">
            <h4>Product Image</h4>
            
            {/* Image Preview */}
            {(imagePreview || product?.imageUrl) && (
              <div className="image-preview-container">
                <img 
                  src={imagePreview || product?.imageUrl} 
                  alt="Preview" 
                  className="image-preview"
                />
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={removeImage}
                >
                  Remove
                </button>
              </div>
            )}

            {/* File Upload */}
            <div className="form-group">
              <label>Upload Image from Device</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                disabled={uploading}
              />
              <small style={{ color: '#6b7280', fontSize: '12px' }}>
                {uploading ? 'Uploading to Cloudinary...' : 'Supported: JPG, PNG, WebP. Max 5MB'}
              </small>
            </div>

            <div className="form-divider">OR</div>

            {/* URL Input (fallback) */}
            <div className="form-group">
              <label>Enter Image URL</label>
              <input 
                type="url" 
                name="imageUrl" 
                value={formData.imageUrl} 
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                disabled={!!imageFile}
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

          {/* Specifications */}
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
                <label>Width</label>
                <input 
                  type="text" 
                  name="width" 
                  value={formData.width} 
                  onChange={handleChange} 
                  placeholder="45 inches"
                />
              </div>
            </div>

            <div className="form-row">
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
              <div className="form-group">
                <label>Origin</label>
                <input 
                  type="text" 
                  name="origin" 
                  value={formData.origin} 
                  onChange={handleChange} 
                  placeholder="Italy"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Stretch</label>
                <input 
                  type="text" 
                  name="stretch" 
                  value={formData.stretch} 
                  onChange={handleChange} 
                  placeholder="None"
                />
              </div>
              <div className="form-group">
                <label>Opacity</label>
                <input 
                  type="text" 
                  name="opacity" 
                  value={formData.opacity} 
                  onChange={handleChange} 
                  placeholder="Opaque"
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
            <button type="button" className="cancel-btn" onClick={onClose} disabled={uploading}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={uploading}>
              {uploading ? "Uploading..." : (product ? "Update" : "Add") + " Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductManagement;