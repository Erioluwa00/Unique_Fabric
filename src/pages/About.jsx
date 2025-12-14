import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaLeaf, FaHandshake, FaStar, FaGlobe } from "react-icons/fa";
import './About.css'

const About = () => {
  const [activeTab, setActiveTab] = useState("story");
  const [counts, setCounts] = useState([0, 0, 0, 0]); // Initial counts for animation

  const stats = [
    { number: "50K+", label: "Fabrics Sold" },
    { number: "120+", label: "Countries Served" },
    { number: "15+", label: "Years Experience" },
    { number: "98%", label: "Customer Satisfaction" }
  ];

  useEffect(() => {
    const targetValues = stats.map(stat => {
      const numStr = stat.number.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      return parseInt(numStr, 10);
    });

    const duration = 4000; // Animation duration in ms
    const steps = 60; // Number of animation steps (approx 60 FPS)
    const increments = targetValues.map(target => target / steps);

    let currentStep = 0;
    const interval = setInterval(() => {
      setCounts(prevCounts =>
        prevCounts.map((count, index) =>
          Math.min(count + increments[index], targetValues[index])
        )
      );
      currentStep++;
      if (currentStep >= steps) {
        clearInterval(interval);
        setCounts(targetValues); // Ensure final values are exact
      }
    }, duration / steps);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const formatCount = (count, index) => {
    const suffix = stats[index].number.replace(/[0-9]/g, ''); // Extract suffix like K+ or %
    return Math.round(count) + suffix;
  };

  const team = [
    {
      name: "Amole Erioluwa",
      role: "Co-Dounder & Creative Director",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
      bio: "Textile expert with 20+ years in fabric innovation"
    },
    {
      name: "Marcus Johnson",
      role: "Head of Sustainability",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Former fashion designer passionate about sustainable fabrics"
    },
    {
      name: "Owolabi Fawaz.E.",
      role: "Founder & CEO",
      image: "https://i.pinimg.com/736x/0f/da/9f/0fda9f27627f65764fb316e1958a934c.jpg",
      bio: "Environmental scientist dedicated to eco-friendly practices"
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Woven with Passion</h1>
            {/* <p className="hero-subtitle">
              For over 15 years, Unique Fabric has been connecting artisans, designers,
              and fabric enthusiasts with the world's most extraordinary textiles.
            </p> */}
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="about-stat-card">
                <div className="about-stat-number">{formatCount(counts[index], index)}</div>
                <div className="about-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Story & Mission Tabs */}
      <section className="story-mission-section">
        <div className="container">
          <div className="about-tab-navigation">
            <button
              className={`tab-btn ${activeTab === 'story' ? 'active' : ''}`}
              onClick={() => setActiveTab('story')}
            >
              Our Story
            </button>
            <button
              className={`tab-btn ${activeTab === 'mission' ? 'active' : ''}`}
              onClick={() => setActiveTab('mission')}
            >
              Our Mission
            </button>
            <button
              className={`tab-btn ${activeTab === 'values' ? 'active' : ''}`}
              onClick={() => setActiveTab('values')}
            >
              Our Values
            </button>
          </div>
          <div className="tab-content">
            {activeTab === 'story' && (
              <div className="story-content">
                <div className="content-grid">
                  <div className="text-content">
                    <h2>From Humble Beginnings to Global Reach</h2>
                    <p>
                      What started as a small family-owned textile shop in 2008 has blossomed
                      into a global destination for unique and sustainable fabrics. Our founder,
                      Sarah Chen, began with a simple vision: to make extraordinary textiles
                      accessible to creators worldwide.
                    </p>
                    <p>
                      Today, we work directly with artisans from West Africa, India, Japan,
                      and South America, ensuring fair trade practices while preserving
                      traditional craftsmanship.
                    </p>
                  </div>
                  <div className="image-content">
                    <img
                      src="https://i.pinimg.com/736x/43/8a/14/438a14610479ac1524c7fe4102113d05.jpg"
                      alt="Our fabric story"
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'mission' && (
              <div className="mission-content">
                <div className="content-grid reversed">
                  <div className="image-content">
                    <img
                      src="https://i.pinimg.com/1200x/7a/5a/93/7a5a9399faa9ad2259c4a4644adee04c.jpg"
                      alt="Our mission"
                    />
                  </div>
                  <div className="text-content">
                    <h2>Revolutionizing Fabric Commerce</h2>
                    <p>
                      Our mission is to bridge the gap between traditional textile artisans
                      and modern creators. We're committed to preserving cultural heritage
                      while embracing sustainable innovation.
                    </p>
                    <ul className="mission-list">
                      <li><FaLeaf className="inline-block mr-2" /> Promote sustainable and ethical fabric production</li>
                      <li><FaStar className="inline-block mr-2" /> Support artisan communities worldwide</li>
                      <li><FaGlobe className="inline-block mr-2" /> Inspire creativity through unique materials</li>
                      <li><FaLeaf className="inline-block mr-2" /> Reduce environmental impact in textile industry</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'values' && (
              <div className="values-content">
                <div className="values-grid">
                  <div className="value-card">
                    <div className="value-icon"><FaLeaf /></div>
                    <h3>Sustainability</h3>
                    <p>We prioritize eco-friendly materials and processes, reducing our carbon footprint at every step.</p>
                  </div>
                  <div className="value-card">
                    <div className="value-icon"><FaHandshake /></div>
                    <h3>Fair Trade</h3>
                    <p>Direct partnerships with artisans ensure fair wages and support for traditional crafts.</p>
                  </div>
                  <div className="value-card">
                    <div className="value-icon"><FaStar /></div>
                    <h3>Quality</h3>
                    <p>Every fabric is carefully curated and tested to meet our high standards of excellence.</p>
                  </div>
                  <div className="value-card">
                    <div className="value-icon"><FaGlobe /></div>
                    <h3>Global Community</h3>
                    <p>We celebrate cultural diversity through our international fabric collections.</p>
                  </div>
                   <div className="value-card">
                    <div className="value-icon"><FaStar /></div>
                    <h3>Quality</h3>
                    <p>Every fabric is carefully curated and tested to meet our high standards of excellence.</p>
                  </div>
                   <div className="value-card">
                    <div className="value-icon"><FaStar /></div>
                    <h3>Quality</h3>
                    <p>Every fabric is carefully curated and tested to meet our high standards of excellence.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Meet Our Fabric Experts</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Create Something Extraordinary?</h2>
            <p>Explore our unique fabric collection and bring your creative vision to life.</p>
            <div className="cta-buttons">
              <Link to="/shop" className="btn btn-primary">Shop Fabrics</Link>
              <Link to="/contact" className="btn btn-outline">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;