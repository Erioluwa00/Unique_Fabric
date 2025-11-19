// import { Link } from "react-router-dom";
// import { FaFacebookF, FaInstagram, FaPinterestP, FaTwitter } from "react-icons/fa"; // Import icons
// import './Footer.css'

// const Footer = () => {
//   return (
//     <footer className="footer">
//       <div className="container">
//         <div className="footer-content">
//           <div className="footer-section">
//             <h3>Unique Fabric</h3>
//             <p>
//               Your premier destination for high-quality fabrics. From silk to cotton, we have everything you need for
//               your creative projects.
//             </p>
//             <div className="social-links">
//               <a href="#" aria-label="Facebook">
//                 <FaFacebookF size={24} />
//               </a>
//               <a href="#" aria-label="Instagram">
//                 <FaInstagram size={24} />
//               </a>
//               <a href="#" aria-label="Pinterest">
//                 <FaPinterestP size={24} />
//               </a>
//               <a href="#" aria-label="Twitter">
//                 <FaTwitter size={24} />
//               </a>
//             </div>
//           </div>

//           <div className="footer-section">
//             <h4>Quick Links</h4>
//             <ul>
//               <li>
//                 <Link to="/shop">Shop All Fabrics</Link>
//               </li>
//               <li>
//                 <Link to="/lookbook">Lookbook</Link>
//               </li>
//               <li>
//                 <Link to="/blog">Blog</Link>
//               </li>
//               <li>
//                 <Link to="/about">About Us</Link>
//               </li>
//               <li>
//                 <Link to="/contact">Contact</Link>
//               </li>
//             </ul>
//           </div>

//           <div className="footer-section">
//             <h4>Customer Service</h4>
//             <ul>
//               <li>
//                 <a href="#shipping">Shipping Info</a>
//               </li>
//               <li>
//                 <a href="#returns">Returns & Exchanges</a>
//               </li>
//               <li>
//                 <a href="#size-guide">Size Guide</a>
//               </li>
//               <li>
//                 <a href="#care">Fabric Care</a>
//               </li>
//               <li>
//                 <Link to="/Faq">FAQ</Link>
//               </li>
//             </ul>
//           </div>

//           <div className="footer-section">
//             <h4>Newsletter</h4>
//             <p>Subscribe for fabric trends, tips, and exclusive offers.</p>
//             <form className="newsletter-form">
//               <input type="email" placeholder="Enter your email" className="newsletter-input" />
//               <button type="submit" className="newsletter-btn">
//                 Subscribe
//               </button>
//             </form>
//           </div>
//         </div>

//         <div className="footer-bottom">
//           <div className="footer-bottom-content">
//             <p>&copy; 2025 Unique Fabric. All rights reserved.</p>
//             <div className="footer-links">
//               <a href="#privacy">Privacy Policy</a>
//               <a href="#terms">Terms of Service</a>
//               <a href="#cookies">Cookie Policy</a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaPinterestP, FaTwitter } from "react-icons/fa";
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Unique Fabric</h3>
            <p>
              Your premier destination for high-quality fabrics. From silk to cotton, we have everything you need for
              your creative projects.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <FaFacebookF size={24} />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram size={24} />
              </a>
              <a href="#" aria-label="Pinterest">
                <FaPinterestP size={24} />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/shop">Shop All Fabrics</Link>
              </li>
              <li>
                <Link to="/lookbook">Lookbook</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li>
                <Link to="/shipping-info">Shipping Info</Link>
              </li>
              <li>
                <Link to="/returns-exchanges">Returns & Exchanges</Link>
              </li>
              <li>
                <a href="#size-guide">Size Guide</a>
              </li>
              <li>
                <a href="#care">Fabric Care</a>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service">Terms of Service</Link>
              </li>
              <li>
                <Link to="/cookie-policy">Cookie Policy</Link>
              </li>
              <li>
                <a href="#accessibility">Accessibility</a>
              </li>
              <li>
                <a href="#sitemap">Sitemap</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Newsletter</h4>
            <p>Subscribe for fabric trends, tips, and exclusive offers.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" className="newsletter-input" />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 Unique Fabric. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-of-service">Terms of Service</Link>
              <Link to="/cookie-policy">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;