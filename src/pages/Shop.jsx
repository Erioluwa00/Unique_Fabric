import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import SortDropdown from "../components/SortDropdown";
import './Shop.css'

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    color: "",
    texture: "",
    priceRange: [0, 500],
    inStock: false,
  });
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch('http://localhost:5000/api/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // FIX: Transform backend data to match frontend structure
        const transformedProducts = data.map(product => ({
          ...product,
          id: product._id, // Map _id to id for frontend consistency
          image: product.imageUrl, // Map imageUrl to image
          inStock: product.stock > 0, // Calculate inStock from stock
          rating: product.rating || 4.5,
          reviews: product.reviews || Math.floor(Math.random() * 50) + 1
        }));
        
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } catch (err) {
        setError(`Failed to load products: ${err.message}`);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters + sorting
  useEffect(() => {
    let filtered = products.filter((product) => {
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesColor = !filters.color || (product.color && product.color === filters.color);
      const matchesTexture = !filters.texture || (product.texture && product.texture === filters.texture);
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchesStock = !filters.inStock || product.inStock;

      return matchesCategory && matchesColor && matchesTexture && matchesPrice && matchesStock;
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "rating": return (b.rating || 0) - (a.rating || 0);
        case "newest": return new Date(b.createdAt) - new Date(a.createdAt);
        default: return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [products, filters, sortBy]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page with scroll to top
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top immediately when page changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      color: "",
      texture: "",
      priceRange: [0, 500],
      inStock: false,
    });
  };

  const retryFetch = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="shop-page">
        <div className="loading-container">
          <div className="loading">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      {/* Shop Header */}
      <div className="shop-header">
        <div className="container">
          <div className="shop-header-content">
            <div className="shop-title">
              <h1>Shop Fabrics</h1>
              <p>Discover our complete collection of premium fabrics</p>
            </div>

            {!error && (
              <div className="shop-controls">
                <button
                  className="filter-toggle"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  Filters ({Object.values(filters).filter(v => v && v !== "" && !(Array.isArray(v) && v[0] === 0 && v[1] === 500)).length})
                </button>

                <div className="view-controls">
                  <button className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>Grid</button>
                  <button className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>List</button>
                </div>

                <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shop Content */}
      <div className="shop-content">
        <div className="container">
          {error ? (
            <div className="error-container">
              <div className="error-message">
                <h3>Connection Error</h3>
                <p>{error}</p>
                <div className="error-actions">
                  <button onClick={retryFetch} className="retry-btn">Retry Connection</button>
                  <p className="error-help">
                    Make sure your backend server is running on http://localhost:5000
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="shop-layout">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                categories={[...new Set(products.map(p => p.category))]}
              />

              <div className="products-section">
                <div className="products-header">
                  <div className="results-info">
                    <span>
                      Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                      {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                    </span>
                  </div>
                </div>

                {currentProducts.length > 0 ? (
                  <>
                    <div className={`products-grid ${viewMode}`}>
                      {currentProducts.map((product) => (
                        <ProductCard 
                          key={product.id}
                          product={product} 
                          viewMode={viewMode} 
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="pagination-container">
                        <nav className="pagination">
                          <button
                            className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>

                          <div className="pagination-numbers">
                            {getPageNumbers().map(number => (
                              <button
                                key={number}
                                className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                                onClick={() => paginate(number)}
                              >
                                {number}
                              </button>
                            ))}
                          </div>

                          <button
                            className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="no-products">
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or browse all products.</p>
                    <button className="btn" onClick={clearFilters}>Clear Filters</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;