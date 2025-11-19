const CheckoutSteps = ({ steps, currentStep }) => {
  return (
    <div className="checkout-steps">
      {steps.map((step, index) => (
        <div key={step.number} className="step-container">
          <div className={`step ${step.completed ? "completed" : ""} ${currentStep === step.number ? "active" : ""}`}>
            <div className="step-number">{step.completed ? "✓" : step.number}</div>
            <div className="step-title">{step.title}</div>
          </div>
          {index < steps.length - 1 && <div className={`step-connector ${step.completed ? "completed" : ""}`}></div>}
        </div>
      ))}
    </div>
  )
}

export default CheckoutSteps
