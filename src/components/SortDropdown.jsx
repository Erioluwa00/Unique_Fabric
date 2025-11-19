import { useState } from "react"

const SortDropdown = ({ sortBy, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "price-low", label: "Price (Low to High)" },
    { value: "price-high", label: "Price (High to Low)" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
  ]

  const currentOption = sortOptions.find((option) => option.value === sortBy)

  const handleSelect = (value) => {
    onSortChange(value)
    setIsOpen(false)
  }

  return (
    <div className="sort-dropdown">
      <button className="sort-trigger" onClick={() => setIsOpen(!isOpen)}>
        Sort by: {currentOption?.label}
        <span className={`arrow ${isOpen ? "up" : "down"}`}>▼</span>
      </button>

      {isOpen && (
        <div className="sort-options">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`sort-option ${sortBy === option.value ? "active" : ""}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SortDropdown
