// import { useState, useEffect } from "react";
// import AdminSidebar from "./AdminSidebar"; // ✅ import sidebar
// import "./AdminPanel.css";

// const AdminProductManagement = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterCategory, setFilterCategory] = useState("all");
//   const [filterStock, setFilterStock] = useState("all");

//   const categories = [
//     "Silk",
//     "Cotton",
//     "Lace",
//     "Denim",
//     "African Prints",
//     "Chiffon",
//     "Canvas",
//     "Velvet",
//     "Linen",
//     "Polyester",
//   ];

//   useEffect(() => {
//     // Mock product data - in real app, this would be API call
//     const mockProducts = [
//       {
//         id: 1,
//         name: "Silk Chiffon - Royal Blue",
//         category: "Silk",
//         price: 45.99,
//         stock: 3,
//         minStock: 10,
//         description:
//           "Luxurious royal blue silk chiffon perfect for evening wear",
//         image: "/royal-blue-silk-fabric.jpg",
//         status: "In Stock",
//         sku: "SLK-CHF-001",
//         dateAdded: "2024-01-10",
//       },
//       {
//         id: 2,
//         name: "Cotton Canvas - Natural",
//         category: "Cotton",
//         price: 18.5,
//         stock: 5,
//         minStock: 15,
//         description:
//           "Heavy-duty natural cotton canvas for upholstery and crafts",
//         image: "/natural-cotton-canvas-fabric.jpg",
//         status: "Low Stock",
//         sku: "CTN-CNV-002",
//         dateAdded: "2024-01-08",
//       },
//       {
//         id: 3,
//         name: "Lace Overlay - Ivory",
//         category: "Lace",
//         price: 32.75,
//         stock: 2,
//         minStock: 8,
//         description: "Delicate ivory lace overlay with floral pattern",
//         image: "/ivory-lace-fabric-with-floral-pattern.jpg",
//         status: "Low Stock",
//         sku: "LCE-OVR-003",
//         dateAdded: "2024-01-05",
//       },
//       {
//         id: 4,
//         name: "Denim - Dark Wash",
//         category: "Denim",
//         price: 24.99,
//         stock: 7,
//         minStock: 20,
//         description: "Premium dark wash denim fabric, 12oz weight",
//         image: "/dark-wash-denim-fabric.jpg",
//         status: "Low Stock",
//         sku: "DNM-DRK-004",
//         dateAdded: "2024-01-03",
//       },
//       {
//         id: 5,
//         name: "African Print - Ankara Gold",
//         category: "African Prints",
//         price: 28.0,
//         stock: 25,
//         minStock: 10,
//         description:
//           "Vibrant Ankara print with gold and red geometric patterns",
//         image: "/ankara-african-print-fabric-gold-red.jpg",
//         status: "In Stock",
//         sku: "AFP-ANK-005",
//         dateAdded: "2024-01-01",
//       },
//       {
//         id: 6,
//         name: "Velvet - Emerald Green",
//         category: "Velvet",
//         price: 52.0,
//         stock: 0,
//         minStock: 5,
//         description: "Rich emerald green velvet fabric with soft texture",
//         image: "/emerald-green-velvet-fabric.jpg",
//         status: "Out of Stock",
//         sku: "VLV-EMR-006",
//         dateAdded: "2023-12-28",
//       },
//     ];

//     setProducts(mockProducts);
//     setFilteredProducts(mockProducts);
//   }, []);

//   useEffect(() => {
//     let filtered = products;

//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (product) =>
//           product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           product.category.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Category filter
//     if (filterCategory !== "all") {
//       filtered = filtered.filter(
//         (product) => product.category === filterCategory
//       );
//     }

//     // Stock filter
//     if (filterStock !== "all") {
//       if (filterStock === "in-stock") {
//         filtered = filtered.filter(
//           (product) => product.stock > product.minStock
//         );
//       } else if (filterStock === "low-stock") {
//         filtered = filtered.filter(
//           (product) => product.stock > 0 && product.stock <= product.minStock
//         );
//       } else if (filterStock === "out-of-stock") {
//         filtered = filtered.filter((product) => product.stock === 0);
//       }
//     }

//     setFilteredProducts(filtered);
//   }, [products, searchTerm, filterCategory, filterStock]);

//   const getStockStatus = (product) => {
//     if (product.stock === 0) return "Out of Stock";
//     if (product.stock <= product.minStock) return "Low Stock";
//     return "In Stock";
//   };

//   const getStockColor = (product) => {
//     if (product.stock === 0) return "#ef4444";
//     if (product.stock <= product.minStock) return "#f59e0b";
//     return "#10b981";
//   };

//   const handleAddProduct = (productData) => {
//     const newProduct = {
//       ...productData,
//       id: Math.max(...products.map((p) => p.id)) + 1,
//       dateAdded: new Date().toISOString().split("T")[0],
//       status: getStockStatus(productData),
//     };
//     setProducts([...products, newProduct]);
//     setShowAddModal(false);
//   };

//   const handleEditProduct = (productData) => {
//     const updatedProducts = products.map((p) =>
//       p.id === selectedProduct.id
//         ? { ...productData, id: selectedProduct.id }
//         : p
//     );
//     setProducts(updatedProducts);
//     setShowEditModal(false);
//     setSelectedProduct(null);
//   };

//   const handleDeleteProduct = (productId) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       setProducts(products.filter((p) => p.id !== productId));
//     }
//   };

//   const openEditModal = (product) => {
//     setSelectedProduct(product);
//     setShowEditModal(true);
//   };

//   return (
//     <div className="admin-layout">
//       <AdminSidebar /> {/* ✅ Sidebar included */}
//       <div className="main-content">
//         <div className="content-area">
//           <div className="product-management">
//             <div className="product-header">
//               <div>
//                 <h2>Product Management</h2>
//                 <p>Manage your fabric inventory and product catalog</p>
//               </div>
//               <button
//                 className="add-product-btn"
//                 onClick={() => setShowAddModal(true)}
//               >
//                 + Add New Fabric
//               </button>
//             </div>

//             {/* Filters and Search */}
//             <div className="product-filters">
//               <div className="search-box">
//                 <input
//                   type="text"
//                   placeholder="Search products, SKU, or category..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               <div className="filter-group">
//                 <select
//                   value={filterCategory}
//                   onChange={(e) => setFilterCategory(e.target.value)}
//                 >
//                   <option value="all">All Categories</option>
//                   {categories.map((category) => (
//                     <option key={category} value={category}>
//                       {category}
//                     </option>
//                   ))}
//                 </select>

//                 <select
//                   value={filterStock}
//                   onChange={(e) => setFilterStock(e.target.value)}
//                 >
//                   <option value="all">All Stock Levels</option>
//                   <option value="in-stock">In Stock</option>
//                   <option value="low-stock">Low Stock</option>
//                   <option value="out-of-stock">Out of Stock</option>
//                 </select>
//               </div>
//             </div>

//             {/* Product Stats */}
//             <div className="product-stats">
//               <div className="stat-item">
//                 <span className="stat-number">{products.length}</span>
//                 <span className="stat-label">Total Products</span>
//               </div>
//               <div className="stat-item">
//                 <span className="stat-number">
//                   {products.filter((p) => p.stock > p.minStock).length}
//                 </span>
//                 <span className="stat-label">In Stock</span>
//               </div>
//               <div className="stat-item">
//                 <span className="stat-number">
//                   {
//                     products.filter((p) => p.stock > 0 && p.stock <= p.minStock)
//                       .length
//                   }
//                 </span>
//                 <span className="stat-label">Low Stock</span>
//               </div>
//               <div className="stat-item">
//                 <span className="stat-number">
//                   {products.filter((p) => p.stock === 0).length}
//                 </span>
//                 <span className="stat-label">Out of Stock</span>
//               </div>
//             </div>

//             {/* Products Grid */}
//             <div className="products-grid">
//               {filteredProducts.map((product) => (
//                 <div key={product.id} className="product-card">
//                   <div className="product-image">
//                     <img
//                       src={product.image || "/placeholder.svg"}
//                       alt={product.name}
//                     />
//                     <div className="product-actions">
//                       <button
//                         className="edit-btn"
//                         onClick={() => openEditModal(product)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="delete-btn"
//                         onClick={() => handleDeleteProduct(product.id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>

//                   <div className="product-info">
//                     <h3>{product.name}</h3>
//                     <p className="product-category">{product.category}</p>
//                     <p className="product-sku">SKU: {product.sku}</p>
//                     <p className="product-description">{product.description}</p>

//                     <div className="product-details">
//                       <div className="price">${product.price}</div>
//                       <div className="stock-info">
//                         <span
//                           className="stock-status"
//                           style={{ color: getStockColor(product) }}
//                         >
//                           {getStockStatus(product)}
//                         </span>
//                         <span className="stock-count">
//                           {product.stock} / {product.minStock} min
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {filteredProducts.length === 0 && (
//               <div className="no-products">
//                 <p>No products found matching your criteria.</p>
//               </div>
//             )}

//             {/* Add Product Modal */}
//             {showAddModal && (
//               <ProductModal
//                 title="Add New Fabric"
//                 onSave={handleAddProduct}
//                 onClose={() => setShowAddModal(false)}
//                 categories={categories}
//               />
//             )}

//             {/* Edit Product Modal */}
//             {showEditModal && selectedProduct && (
//               <ProductModal
//                 title="Edit Fabric"
//                 product={selectedProduct}
//                 onSave={handleEditProduct}
//                 onClose={() => {
//                   setShowEditModal(false);
//                   setSelectedProduct(null);
//                 }}
//                 categories={categories}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Product Modal Component
// const ProductModal = ({ title, product, onSave, onClose, categories }) => {
//   const [formData, setFormData] = useState({
//     name: product?.name || "",
//     category: product?.category || categories[0],
//     price: product?.price || "",
//     stock: product?.stock || "",
//     minStock: product?.minStock || "",
//     description: product?.description || "",
//     sku: product?.sku || "",
//     image: product?.image || "/fabric-texture.png",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave({
//       ...formData,
//       price: Number.parseFloat(formData.price),
//       stock: Number.parseInt(formData.stock),
//       minStock: Number.parseInt(formData.minStock),
//     });
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <div className="modal-header">
//           <h3>{title}</h3>
//           <button className="close-btn" onClick={onClose}>
//             ×
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="modal-form">
//           <div className="form-row">
//             <div className="form-group">
//               <label>Product Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>SKU</label>
//               <input
//                 type="text"
//                 name="sku"
//                 value={formData.sku}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label>Category</label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 required
//               >
//                 {categories.map((category) => (
//                   <option key={category} value={category}>
//                     {category}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="form-group">
//               <label>Price ($)</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label>Current Stock</label>
//               <input
//                 type="number"
//                 name="stock"
//                 value={formData.stock}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Minimum Stock</label>
//               <input
//                 type="number"
//                 name="minStock"
//                 value={formData.minStock}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label>Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows="3"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Image URL</label>
//             <input
//               type="url"
//               name="image"
//               value={formData.image}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="modal-actions">
//             <button type="button" className="cancel-btn" onClick={onClose}>
//               Cancel
//             </button>
//             <button type="submit" className="save-btn">
//               {product ? "Update" : "Add"} Product
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminProductManagement;


import React from 'react';

function AdminReports() {
  return (
    <div className="page">
      <h1>Manage Reports</h1>
      <p>View and process customer orders.</p>
    </div>
  );
}

export default AdminReports;



      

