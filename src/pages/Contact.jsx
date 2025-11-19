import { useState } from "react"
import './Contact.css'

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Contact form submitted:", form)
    setSubmitted(true)
    setForm({ name: "", email: "", message: "" })
  }

  return (
    <div className="page contact-page">
        <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Reach out. Lets connect </h1>
            {/* <p className="hero-subtitle">
              For over 15 years, Unique Fabric has been connecting artisans, designers,
              and fabric enthusiasts with the world's most extraordinary textiles.
            </p> */}
          </div>
        </div>
      </section>
      <div className=" container contact-content-container">
        <h1>Contact Us</h1>
        <p>Have questions or want to work with us? Fill out the form below.</p>

        

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Message:</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows="5"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
        {submitted && <p className="success-msg">Thank you! Your message has been sent.</p>}
      </div>
    </div>
  )
}

export default Contact
