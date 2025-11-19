import { useState } from "react";
import { Link } from "react-router-dom";
import LookbookDetails from "./LookbookDetails";
import './Lookbook.css'

const LookBook = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Looks" },
    { id: "african", name: "African Prints" },
    { id: "evening", name: "Evening Wear" },
    { id: "casual", name: "Casual Fashion" },
    { id: "bridal", name: "Bridal Collection" },
    { id: "accessories", name: "Accessories" }
  ];

  const looks = [
    {
      id: 1,
      title: "Modern Ankara Fusion",
      category: "african",
      designer: "Nia Designs",
      fabrics: ["Classic Ankara Print", "Silk Lining"],
      image: "https://www.thrivenaija.com/wp-content/uploads/2021/04/ankarastyles.jpg",
      description: "Contemporary dress blending traditional African prints with modern silhouettes"
    },
    {
      id: 2,
      title: "Silk Evening Gown",
      category: "evening",
      designer: "Luxe Creations",
      fabrics: ["Italian Silk", "French Lace"],
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjtuck1xz_dEc6JqnsLJXr69U0waKZzaffnnydLmHd24cpGzYYrDgU5KxzpAAS7LQ2Oy8KRV45IwgURAmFpN1Y98ccHrKT7zLRvEnjqVcoTGRUxDwCBSzzjKwDN8g1PD4b7XOSx8FMJnz1A-WgHOIwchGoWixiuq3ZGlemnYBDPGOJE8gEE14Byiv2TTh05/s800/Ankarafashion%20style%20inspiration%20--___oboshies_sewing_class%20___ankarastyles%20_ankarazone%20_ankarastyles%20_ankarafashiongallery%20_madeinnigeria(image2).JPG",
      description: "Elegant floor-length gown featuring our premium silk collection"
    },
    {
      id: 3,
      title: "Casual Linen Set",
      category: "casual",
      designer: "Urban Weavers",
      fabrics: ["Belgian Linen", "Organic Cotton"],
      image: "https://s.alicdn.com/@sc04/kf/He10cd89f4ed34160885baa53720dc89dk/Women-Fashionable-Colorful-Ankara-Off-Shoulder-Crop-Top.jpg",
      description: "Comfortable and sustainable everyday wear perfect for warm weather"
    },
    {
      id: 4,
      title: "Traditional Bridal Attire",
      category: "bridal",
      designer: "Heritage Bridal",
      fabrics: ["Hand-embroidered Silk", "Pearl Accents"],
      image: "https://res.cloudinary.com/dwhlsl0yn/image/upload/v1712303820/articles/o8yhqccp7xohwgnhyjg9.jpg",
      description: "Custom bridal wear incorporating traditional craftsmanship"
    },
    {
      id: 5,
      title: "Artisan Scarf Collection",
      category: "accessories",
      designer: "Texture Studio",
      fabrics: ["Japanese Chiffon", "Wool Blend"],
      image: "https://www.ruffntumblekids.com/cdn/shop/products/10.png?v=1755699432",
      description: "Handcrafted scarves showcasing unique textures and patterns"
    },
    {
      id: 6,
      title: "Bohemian Maxi Dress",
      category: "casual",
      designer: "Free Spirit Fashion",
      fabrics: ["Rayon Blend", "Embroidered Cotton"],
      image: "https://i0.wp.com/clipkulture.com/wp-content/uploads/2021/06/13-41-38-132290009_864623571023565_8813636967934182517_n-e1623923857105.jpg?fit=700%2C834&ssl=1",
      description: "Flowy bohemian dress perfect for summer festivals and beach weddings"
    }
  ];

  const filteredLooks = activeCategory === "all" 
    ? looks 
    : looks.filter(look => look.category === activeCategory);

  return (
    <div className="lookbook-page">
      {/* Hero Section */}
      <section className="lookbook-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Fabric Inspiration Gallery</h1>
            {/* <p className="hero-subtitle">
              Discover how designers and creators are transforming our fabrics into 
              stunning fashion pieces and home decor.
            </p> */}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="lookbook-filter">
        <div className="container">
          <div className="filter-tabs">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-tab ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lookbook Grid */}
      <section className="lookbook-grid-section">
        <div className="container">
          <div className="lookbook-grid">
            {filteredLooks.map(look => (
              <div key={look.id} className="look-card">
                <div className="look-image">
                  <img src={look.image} alt={look.title} />
                  <div className="look-overlay">
                    <button className="view-details-btn"><Link to="/lookbookDetails">View Details</Link> </button>
                  </div>
                </div>
                <div className="look-info">
                  <h3 className="look-title">{look.title}</h3>
                  <p className="look-designer">by {look.designer}</p>
                  <p className="look-description">{look.description}</p>
                  <div className="look-fabrics">
                    <span className="fabrics-label">Fabrics Used:</span>
                    <div className="fabric-tags">
                      {look.fabrics.map((fabric, index) => (
                        <span key={index} className="fabric-tag">{fabric}</span>
                      ))}
                    </div>
                  </div>
                  <div className="look-actions">
                    <Link to="/shop" className="btn btn-outline">Shop Similar Fabrics</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Designer Spotlight */}
      <section className="designer-spotlight">
        <div className="container">
          <h2 className="section-title">Designer Spotlight</h2>
          <div className="spotlight-content">
            <div className="spotlight-image">
              <img 
                src="https://i.pinimg.com/originals/54/ec/9b/54ec9bec1e1d08987a9c5dd747367d44.jpg" 
                alt="Designer at work" 
              />
            </div>
            <div className="spotlight-text">
              <h3>Featured Designer: Amina Diallo</h3>
              <p className="designer-quote">
                "Working with Unique Fabric has transformed my design process. 
                The quality and variety of their African prints allow me to create 
                pieces that truly celebrate our cultural heritage while appealing 
                to modern fashion sensibilities."
              </p>
              <div className="designer-stats">
                <div className="stat">
                  <span className="stat-number">3</span>
                  <span className="stat-label">Collections</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Pieces Created</span>
                </div>
                <div className="stat">
                  <span className="stat-number">2</span>
                  <span className="stat-label">Years Partnered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="lookbook-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Share Your Creations</h2>
            <p>
              Have you created something amazing with our fabrics? We'd love to feature 
              your work in our lookbook and inspire other creators.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Submit Your Project</button>
              <Link to="/shop" className="btn btn-outline">Get Inspired</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LookBook;