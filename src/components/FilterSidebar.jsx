const FilterSidebar = ({ filters, onFilterChange, onClearFilters, isOpen, onClose }) => {
const categories = ["Silk","Cotton","Lace","Denim","African Prints","Chiffon","Canvas","Velvet","Linen","Polyester"];
const colors = ["white", "ivory", "black", "navy", "charcoal", "beige", "pink", "green", "gold", "natural"]
// const colors = ["Orange & Brown","Red & Black","Blue & Orange","Orange & Red","Gold & Maroon","Yellow & Blue","Yellow & Purple","Pink & Olive","Green & Red","Teal & Red","Green & Orange", "Blue & Orange","Blue & Gold","Green & Gold","Teal & Yellow","Blue & Yellow","Red & Blue","Gold & Multi","Teal & Gold","Orange & Black","Purple & Green","Pink & Blue","Gold & Navy","Green & Yellow"]

const textures = ["Wax Print", "Smooth", "Soft", "Textured", "Metallic", "Delicate", "Thick"]


  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
    })
  }

  const handlePriceChange = (e) => {
    const value = Number.parseInt(e.target.value)
    onFilterChange({
      ...filters,
      priceRange: [filters.priceRange[0], value],
    })
  }

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v && v !== "" && !(Array.isArray(v) && v[0] === 0 && v[1] === 500),
  ).length

  return (
    <>
      {isOpen && <div className="filter-overlay" onClick={onClose}></div>}
      <div className={`filter-sidebar ${isOpen ? "open" : ""}`}>
        <div className="filter-header">
          <h3>Filters</h3>
          <button className="close-filters" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="filter-content">
          {activeFiltersCount > 0 && (
            <div className="filter-section">
              <button className="clear-filters" onClick={onClearFilters}>
                Clear All Filters ({activeFiltersCount})
              </button>
            </div>
          )}

          <div className="filter-section">
            <h4>Category</h4>
            <div className="filter-options">
              {categories.map((category) => (
                <label key={category} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters.category === category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                  />
                  <span className="checkmark"></span>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
              ))}
              <label className="filter-option">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={filters.category === ""}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                />
                <span className="checkmark"></span>
                All Categories
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h4>Color</h4>
            <div className="filter-options">
              {colors.map((color) => (
                <label key={color} className="filter-option">
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    checked={filters.color === color}
                    onChange={(e) => handleFilterChange("color", e.target.value)}
                  />
                  <span className="checkmark"></span>
                  <span className={`color-swatch ${color}`}></span>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </label>
              ))}
              <label className="filter-option">
                <input
                  type="radio"
                  name="color"
                  value=""
                  checked={filters.color === ""}
                  onChange={(e) => handleFilterChange("color", e.target.value)}
                />
                <span className="checkmark"></span>
                All Colors
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h4>Texture</h4>
            <div className="filter-options">
              {textures.map((texture) => (
                <label key={texture} className="filter-option">
                  <input
                    type="radio"
                    name="texture"
                    value={texture}
                    checked={filters.texture === texture}
                    onChange={(e) => handleFilterChange("texture", e.target.value)}
                  />
                  <span className="checkmark"></span>
                  {texture.charAt(0).toUpperCase() + texture.slice(1)}
                </label>
              ))}
              <label className="filter-option">
                <input
                  type="radio"
                  name="texture"
                  value=""
                  checked={filters.texture === ""}
                  onChange={(e) => handleFilterChange("texture", e.target.value)}
                />
                <span className="checkmark"></span>
                All Textures
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-filter">
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
              <div className="price-display">Up to ${filters.priceRange[1]}</div>
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
