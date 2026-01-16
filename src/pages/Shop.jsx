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
  const [displayedProducts, setDisplayedProducts] = useState([]); 
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [priceRangeChanged, setPriceRangeChanged] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform backend data to match frontend structure
        const transformedProducts = data.map(product => ({
          ...product,
          id: product._id,
          image: product.imageUrl,
          inStock: product.stock > 0,
          rating: product.rating || 4.5,
          reviews: product.reviews || Math.floor(Math.random() * 50) + 1
        }));
        
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        setDisplayedProducts(transformedProducts); // Initialize displayed products
      } catch (err) {
        setError(`Failed to load products: ${err.message}`);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters + sorting + search to filteredProducts
  useEffect(() => {
    let filtered = products.filter((product) => {
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesColor = !filters.color || (product.color && product.color === filters.color);
      const matchesTexture = !filters.texture || (product.texture && product.texture === filters.texture);
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchesStock = !filters.inStock || product.inStock;
      
      // Search functionality
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesColor && matchesTexture && matchesPrice && matchesStock && matchesSearch;
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
    
    // Only update displayed products if price range hasn't changed or we're not in the middle of price filtering
    if (!priceRangeChanged) {
      setDisplayedProducts(filtered);
    }
    
    // Reset to first page when filters or search change
    setCurrentPage(1);
  }, [products, filters, sortBy, searchQuery, priceRangeChanged]);

  // Apply price filter when user clicks "View X Products" button
  const applyPriceFilter = () => {
    setDisplayedProducts(filteredProducts);
    setPriceRangeChanged(false);
    if (isMobile) {
      closeFilterSidebar();
    }
  };

  // Handle filter changes for immediate application (except price range)
  const handleFilterChange = (newFilters) => {
    const isPriceChange = newFilters.priceRange[0] !== filters.priceRange[0] || 
                         newFilters.priceRange[1] !== filters.priceRange[1];
    
    setFilters(newFilters);
    
    if (isPriceChange) {
      setPriceRangeChanged(true);
    } else {
      // For other filters (category, color, texture, inStock), apply immediately
      setPriceRangeChanged(false);
      if (isMobile) {
        closeFilterSidebar();
      }
    }
  };

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

  // Close filter sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile && isFilterOpen) {
      setIsFilterOpen(false);
    }
  }, [isMobile, isFilterOpen]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = displayedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(displayedProducts.length / productsPerPage);

  // Change page with scroll to top
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      color: "",
      texture: "",
      priceRange: [0, 500],
      inStock: false,
    });
    setPriceRangeChanged(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const retryFetch = () => {
    window.location.reload();
  };

  const openFilterSidebar = () => {
    setIsFilterOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFilterSidebar = () => {
    setIsFilterOpen(false);
    document.body.style.overflow = 'auto';
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
                    Make sure your backend server is running on ${import.meta.env.VITE_API_URL}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="shop-layout">
              {/* Filter Sidebar */}
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                isOpen={isFilterOpen}
                onClose={closeFilterSidebar}
                categories={[...new Set(products.map(p => p.category))]}
                isMobile={isMobile}
                products={products}
                priceRangeChanged={priceRangeChanged}
                onApplyPriceFilter={applyPriceFilter}
              />

              <div className="products-section">
                {/* Mobile Filter Button and Search Bar */}
                <div className="mobile-search-filter">
                  {isMobile && (
                    <button 
                      className="mobile-filter-btn"
                      onClick={openFilterSidebar}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                      </svg>
                      Filters
                      {Object.values(filters).filter(v => v && v !== "" && !(Array.isArray(v) && v[0] === 0 && v[1] === 500)).length > 0 && (
                        <span className="filter-count">
                          ({Object.values(filters).filter(v => v && v !== "" && !(Array.isArray(v) && v[0] === 0 && v[1] === 500)).length})
                        </span>
                      )}
                    </button>
                  )}
                  
                  <div className="shop-search-container">
                    <div className="shop-search-wrapper">
                      <div className="shop-search-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="m21 21-4.3-4.3"></path>
                        </svg>
                      </div>
                      <input
                        type="text"
                        className="shop-search-input"
                        placeholder="Search products by name, description, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <button
                          className="shop-search-clear"
                          onClick={clearSearch}
                          type="button"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="products-header">
                  <div className="results-info">
                    <span>
                      Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, displayedProducts.length)} of {displayedProducts.length} products
                      {searchQuery && ` for "${searchQuery}"`}
                      {priceRangeChanged && " (Price filter not applied yet)"}
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
                    <p>
                      {searchQuery 
                        ? `No products found for "${searchQuery}". Try adjusting your search or filters.`
                        : "Try adjusting your filters or browse all products."
                      }
                    </p>
                    <div className="no-products-actions">
                      <button className="btn" onClick={clearFilters}>Clear Filters</button>
                      {searchQuery && (
                        <button className="btn btn-secondary" onClick={clearSearch}>Clear Search</button>
                      )}
                    </div>
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