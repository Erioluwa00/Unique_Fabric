import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext"; 
import { FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import "./Contact.css";

const Contact = () => {
  const { user } = useContext(AuthContext); 
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    if (user?.name && user?.email) {
      setForm((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit form");
      }

      if (result.success) {
        console.log("Contact form submitted:", result.data);
        setSubmitted(true);
        setForm({
          name: user?.name || "",
          email: user?.email || "",
          message: "",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page contact-page">
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Reach out. Lets connect</h1>
          </div>
        </div>
      </section>

      <div className="container contact-content-container">
        <h1>Contact Us</h1>
        <p>Have questions or want to work with us? Fill out the form below.</p>

        <div className="contact-section">
          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  disabled={loading}
                  placeholder={user?.name ? "" : "Enter your name"}
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={loading}
                  placeholder={user?.email ? "" : "Enter your email"}
                />
              </div>

              <div className="form-group">
                <label>Message:</label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  rows="5"
                  required
                  disabled={loading}
                  placeholder="Your message here..."
                ></textarea>
              </div>

              {error && <p className="error-msg">{error}</p>}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
            {submitted && (
              <p className="success-msg">
                Thank you! Your message has been sent.
              </p>
            )}
          </div>

          <div className="contact-image">
            <img
              src="https://infographicdesign.org/wp-content/uploads/2021/05/Availability.jpg"
              alt="Our store location"
            />
          </div>
        </div>

        <div className="contact-cards">
          <div className="contact-card">
            <div className="card-icon">
              <FaPhone />
            </div>
            <h3>Phone</h3>
            <p>+1 (555) 123-4567</p>
          </div>

          <div className="contact-card">
            <div className="card-icon">
              <FaEnvelope />
            </div>
            <h3>Email</h3>
            <p>hello@uniquefabric.com</p>
          </div>

          <div className="contact-card">
            <div className="card-icon">
              <FaClock />
            </div>
            <h3>Business Hours</h3>
            <p>Mon-Fri: 9AM-6PM</p>
            <p>Sat: 10AM-4PM</p>
          </div>
        </div>

        <div className="map-section">
          <h2>
            <FaMapMarkerAlt style={{ marginRight: "10px", color: "#007bff" }} />
            Visit Our Store
          </h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.9503398796587!2d-74.00594938458926!3d40.71274997933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316e0b3d33%3A0x87d89d694e625d5f!2sFabric%20District!5e0!3m2!1sen!2sus!4v1681234567890!5m2!1sen!2sus"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: "12px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Store Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
