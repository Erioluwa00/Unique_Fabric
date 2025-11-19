import { Link } from "react-router-dom";
import { FaTruck, FaCut, FaSeedling } from "react-icons/fa"; 

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <img src="https://i.pinimg.com/1200x/97/a2/f0/97a2f0a0bb256532603fecbb9b2b27d1.jpg" alt="Premium fabrics" />
      </div>
      <div className="hero-overlay">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Premium Fabrics for Every Vision</h1>
            {/* <p className="hero-subtitle">
              Discover our curated collection of luxury silks, organic cottons, delicate laces, and innovative textiles.
              From fashion designers to home decorators, we have the perfect fabric for your next masterpiece.
            </p> */}
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary">
                Shop All Fabrics
              </Link>
              <Link to="/lookbook" className="btn btn-outline">
                View Inspiration
              </Link>
            </div>
            <div className="hero-features">
              <div className="feature">
                <span className="feature-icon">
                  <FaTruck size={24} />
                </span>
                <span>Free shipping over $100</span>
              </div>
              <div className="feature">
                <span className="feature-icon">
                  <FaCut size={24} />
                </span>
                <span>Custom cutting available</span>
              </div>
              <div className="feature">
                <span className="feature-icon">
                  <FaSeedling size={24} />
                </span>
                <span>Eco-friendly options</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
