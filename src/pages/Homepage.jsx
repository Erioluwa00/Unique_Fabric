import { Link } from "react-router-dom"
import HeroSection from "../components/HeroSection"
import FeaturedFabrics from "../components/FeaturedFabrics"
import CategoryGrid from "../components/CategoryGrid"
import Newsletter from "../components/Newsletter"
import Testimonials from "../components/Testimonials"
import './Homepage.css'

const Homepage = () => {
  return (
    <div className="homepage">
      <HeroSection />
      <FeaturedFabrics />
      <CategoryGrid />
      <div className="inspiration-section">
        <div className="container">
          <div className="inspiration-content">
            <div className="inspiration-text">
              <h2>Need Inspiration?</h2>
              <p>
                Explore our curated lookbook featuring stunning projects created with our premium fabrics. From haute
                couture to home décor, discover endless possibilities.
              </p>
              <Link to="/lookbook" className="btn">
                View Lookbook
              </Link>
            </div>
            <div className="inspiration-image">
              <img src="https://i.pinimg.com/1200x/f6/66/d1/f666d15a386d87dd537b3000d66164fd.jpg" alt="Fabric inspiration" />
            </div>
          </div>
        </div>
      </div>
      <Testimonials />
      <Newsletter />
    </div>
  )
}

export default Homepage
