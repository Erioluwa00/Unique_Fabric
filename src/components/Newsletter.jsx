"use client"

import { useState } from "react"

const Newsletter = () => {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      // Simulate subscription
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h2>Stay Inspired</h2>
            <p>
              Subscribe to our newsletter for fabric trends, design tips, exclusive offers, and early access to new
              collections.
            </p>
          </div>

          <form className="newsletter-signup" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-email"
              />
              <button type="submit" className="btn btn-primary" style={{ border: '2px solid #1A365D', backgroundColor: '#1A365D', color: 'white' }}>
                Subscribe
              </button>

              {/* <button type="submit" className="btn btn-primary">
                Subscribe
              </button> */}
            </div>
            {subscribed && <p className="success-message">Thank you for subscribing!</p>}
          </form>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
