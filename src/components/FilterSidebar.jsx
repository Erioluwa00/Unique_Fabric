import { useEffect, useState } from "react";

const FilterSidebar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  isOpen, 
  onClose, 
  isMobile, 
  products,
  priceRangeChanged,
  onApplyPriceFilter 
}) => {
  const categories = ["Silk","Cotton","Lace","Denim","African Prints","Chiffon","Canvas","Velvet","Linen","Polyester"];
  const colors = ["white", "ivory", "black", "navy", "charcoal", "beige", "pink", "green", "gold", "natural"]
  const textures = ["Wax Print", "Smooth", "Soft", "Textured", "Metallic", "Delicate", "Thick"]

  const [productsInPriceRange, setProductsInPriceRange] = useState(0);

  // Calculate products in current price range
  useEffect(() => {
    if (products && products.length > 0) {
      const productsInRange = products.filter(product => 
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      );
      setProductsInPriceRange(productsInRange.length);
    }
  }, [filters.priceRange, products]);

  // Prevent body scroll when mobile filter is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobile, isOpen]);

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    onFilterChange(newFilters);
  }

  const handlePriceChange = (e) => {
    const value = Number.parseInt(e.target.value)
    const newFilters = {
      ...filters,
      priceRange: [filters.priceRange[0], value],
    };
    onFilterChange(newFilters);
  }

  const handleMinPriceChange = (e) => {
    const value = Number.parseInt(e.target.value)
    const newFilters = {
      ...filters,
      priceRange: [value, filters.priceRange[1]],
    };
    onFilterChange(newFilters);
  }

  // Handle radio button clicks - apply immediately and close sidebar on mobile
  const handleRadioChange = (key, value) => {
    handleFilterChange(key, value);
  }

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v && v !== "" && !(Array.isArray(v) && v[0] === 0 && v[1] === 500),
  ).length

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && (
        <div 
          className={`filter-overlay ${isOpen ? 'active' : ''}`}
          onClick={onClose}
        />
      )}
      
      <div className={`filter-sidebar ${isMobile ? 'mobile-open' : ''} ${isOpen ? 'active' : ''}`}>
        <div className="filter-header">
          <h3>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</h3>
          {/* Only show close button on mobile */}
          {isMobile && (
            <button className="close-filters" onClick={onClose}>
              ×
            </button>
          )}
        </div>

        <div className="filter-content">
          {activeFiltersCount > 0 && (
            <div className="filter-section">
              <button className="clear-filters" onClick={onClearFilters}>
                Clear All Filters
              </button>
            </div>
          )}

          <div className="filter-section">
            <h4>Category</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={filters.category === ""}
                  onChange={(e) => handleRadioChange("category", e.target.value)}
                />
                <span className="checkmark"></span>
                All Categories
              </label>
              {categories.map((category) => (
                <label key={category} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters.category === category}
                    onChange={(e) => handleRadioChange("category", e.target.value)}
                  />
                  <span className="checkmark"></span>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Color</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="color"
                  value=""
                  checked={filters.color === ""}
                  onChange={(e) => handleRadioChange("color", e.target.value)}
                />
                <span className="checkmark"></span>
                All Colors
              </label>
              {colors.map((color) => (
                <label key={color} className="filter-option">
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    checked={filters.color === color}
                    onChange={(e) => handleRadioChange("color", e.target.value)}
                  />
                  <span className="checkmark"></span>
                  <span className={`color-swatch ${color}`}></span>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Texture</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="texture"
                  value=""
                  checked={filters.texture === ""}
                  onChange={(e) => handleRadioChange("texture", e.target.value)}
                />
                <span className="checkmark"></span>
                All Textures
              </label>
              {textures.map((texture) => (
                <label key={texture} className="filter-option">
                  <input
                    type="radio"
                    name="texture"
                    value={texture}
                    checked={filters.texture === texture}
                    onChange={(e) => handleRadioChange("texture", e.target.value)}
                  />
                  <span className="checkmark"></span>
                  {texture.charAt(0).toUpperCase() + texture.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-filter">
              <div className="price-inputs">
                <div className="price-input-group">
                  <label>Min: ${filters.priceRange[0]}</label>
                </div>
                <div className="price-input-group">
                  <label>Max: ${filters.priceRange[1]}</label>
                </div>
              </div>
              
              <div className="price-range">
                <span>$0</span>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={filters.priceRange[1]}
                  onChange={handlePriceChange}
                  className="price-slider"
                />
                <span>$500+</span>
              </div>
              
              <div className="price-display">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
                {priceRangeChanged && <span className="price-changed-indicator"> *</span>}
              </div>
              
              {/* View Products Button */}
              <button 
                className={`view-products-btn ${priceRangeChanged ? 'changed' : ''}`}
                onClick={onApplyPriceFilter}
              >
                View {productsInPriceRange} Product{productsInPriceRange !== 1 ? 's' : ''}
              </button>
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-option checkbox">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange("inStock", e.target.checked)}
              />
              <span className="checkmark"></span>
              In Stock Only
            </label>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterSidebar