const ProductSpecs = ({ specifications }) => {
  return (
    <div className="product-specs">
      <h3>Technical Specifications</h3>
      <div className="specs-grid">
        {Object.entries(specifications).map(([key, value]) => (
          <div key={key} className="spec-item">
            <div className="spec-label">{key}:</div>
            <div className="spec-value">{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductSpecs
