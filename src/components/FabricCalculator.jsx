"use client"

import { useState } from "react"

const FabricCalculator = ({ product }) => {
  const [projectType, setProjectType] = useState("")
  const [measurements, setMeasurements] = useState({
    length: "",
    width: "",
    quantity: 1,
  })
  const [result, setResult] = useState(null)

  const projectTypes = {
    dress: { multiplier: 1.2, description: "Dress (includes seam allowances)" },
    shirt: { multiplier: 1.15, description: "Shirt/Blouse (includes seam allowances)" },
    pants: { multiplier: 1.1, description: "Pants/Trousers (includes seam allowances)" },
    curtains: { multiplier: 2.5, description: "Curtains (includes fullness and hems)" },
    pillowcase: { multiplier: 1.05, description: "Pillowcase (includes seam allowances)" },
    tablecloth: { multiplier: 1.1, description: "Tablecloth (includes hem allowances)" },
    custom: { multiplier: 1, description: "Custom project" },
  }

  const handleCalculate = () => {
    const length = Number.parseFloat(measurements.length)
    const width = Number.parseFloat(measurements.width)
    const quantity = Number.parseInt(measurements.quantity) || 1

    if (!length || !width || !projectType) {
      alert("Please fill in all fields")
      return
    }

    // Convert measurements to yards (assuming input is in inches)
    const lengthInYards = length / 36
    const widthInYards = width / 36

    // Calculate fabric needed
    const fabricWidth = 45 // inches (from product specs)
    const fabricWidthYards = fabricWidth / 36

    let fabricNeeded
    if (widthInYards <= fabricWidthYards) {
      // Project fits within fabric width
      fabricNeeded = lengthInYards * projectTypes[projectType].multiplier * quantity
    } else {
      // Need to piece fabric
      const pieces = Math.ceil(widthInYards / fabricWidthYards)
      fabricNeeded = lengthInYards * pieces * projectTypes[projectType].multiplier * quantity
    }

    const totalCost = fabricNeeded * product.price

    setResult({
      fabricNeeded: Math.ceil(fabricNeeded * 4) / 4, // Round up to nearest quarter yard
      totalCost: totalCost,
      pieces: widthInYards > fabricWidthYards ? Math.ceil(widthInYards / fabricWidthYards) : 1,
    })
  }

  const handleReset = () => {
    setMeasurements({ length: "", width: "", quantity: 1 })
    setProjectType("")
    setResult(null)
  }

  return (
    <div className="fabric-calculator">
      <h3>Fabric Calculator</h3>
      <p>Calculate how much fabric you need for your project.</p>

      <div className="calculator-form">
        <div className="form-group">
          <label>Project Type:</label>
          <select value={projectType} onChange={(e) => setProjectType(e.target.value)}>
            <option value="">Select project type</option>
            {Object.entries(projectTypes).map(([key, type]) => (
              <option key={key} value={key}>
                {type.description}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Length (inches):</label>
            <input
              type="number"
              value={measurements.length}
              onChange={(e) => setMeasurements({ ...measurements, length: e.target.value })}
              placeholder="e.g., 60"
            />
          </div>

          <div className="form-group">
            <label>Width (inches):</label>
            <input
              type="number"
              value={measurements.width}
              onChange={(e) => setMeasurements({ ...measurements, width: e.target.value })}
              placeholder="e.g., 45"
            />
          </div>

          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              value={measurements.quantity}
              onChange={(e) => setMeasurements({ ...measurements, quantity: e.target.value })}
              min="1"
            />
          </div>
        </div>

        <div className="calculator-actions">
          <button className="btn btn-primary" onClick={handleCalculate}>
            Calculate
          </button>
          <button className="btn btn-outline" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className="calculation-result">
          <h4>Calculation Result:</h4>
          <div className="result-details">
            <div className="result-item">
              <span className="label">Fabric Needed:</span>
              <span className="value">{result.fabricNeeded} yards</span>
            </div>
            <div className="result-item">
              <span className="label">Estimated Cost:</span>
              <span className="value">${result.totalCost.toFixed(2)}</span>
            </div>
            {result.pieces > 1 && (
              <div className="result-item">
                <span className="label">Fabric Pieces:</span>
                <span className="value">{result.pieces} (due to width constraints)</span>
              </div>
            )}
          </div>
          <div className="result-note">
            <p>
              <strong>Note:</strong> This calculation includes recommended allowances for your project type. Always
              purchase a little extra for mistakes and adjustments.
            </p>
          </div>
        </div>
      )}

      <div className="calculator-info">
        <h4>Fabric Information:</h4>
        <p>
          <strong>Width:</strong> {product.specifications.Width}
        </p>
        <p>
          <strong>Price:</strong> ${product.price} per yard
        </p>
      </div>
    </div>
  )
}

export default FabricCalculator
