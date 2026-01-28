// import { FaStar } from "react-icons/fa"; 

// const Testimonials = () => {
//   const testimonials = [
//     {
//       name: "Sarah Chen",
//       role: "Fashion Designer",
//       content:
//         "Unique Fabric has been my go-to source for premium materials. Their silk collection is unmatched, and the quality is consistently exceptional.",
//       rating: 5,
//     },
//     {
//       name: "Michael Rodriguez",
//       role: "Interior Designer",
//       content:
//         "The variety and quality of fabrics here is incredible. I've furnished entire homes using their collections, and clients are always impressed.",
//       rating: 5,
//     },
//     {
//       name: "Emma Thompson",
//       role: "Costume Designer",
//       content:
//         "From period pieces to modern productions, Unique Fabric always has exactly what I need. Their custom cutting service is a game-changer.",
//       rating: 5,
//     },
//   ];

//   return (
//     <section className="testimonials">
//       <div className="container">
//         <div className="ffabric-header">
//           <h2>What Our Customers Say</h2>
//           <p>Trusted by designers, creators, and fabric enthusiasts worldwide</p>
//         </div>

//         <div className="testimonials-grid">
//           {testimonials.map((testimonial, index) => (
//             <div key={index} className="testimonial-card">
//               <div className="testimonial-rating">
//                 {[...Array(5)].map((_, i) => (
//                   <FaStar
//                     key={i}
//                     size={20} // Set the size of the star icon
//                     color={i < testimonial.rating ? "#FFD700" : "#D3D3D3"} // Gold for filled stars, light gray for empty
//                   />
//                 ))}
//               </div>
//               <p className="testimonial-content">"{testimonial.content}"</p>
//               <div className="testimonial-author">
//                 <strong>{testimonial.name}</strong>
//                 <span>{testimonial.role}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Testimonials;



import { FaStar } from "react-icons/fa";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Mrs. Iyinade E.",
      role: "Sustainable Fashion Brand",
      // role: "Creative Director, S.C. Studio",
      content: "Unique Fabric has been my go-to source for premium materials. Their silk collection is unmatched, and the quality is consistently exceptional.",
      rating: 5,
      // project: "Spring '24 Couture Line"
    },
    {
      name: "Femi-Johnson",
      role: "Fashion Designer",
      content: "The variety and quality of fabrics here is incredible. I've furnished entire homes using their collections, and clients are always impressed.",
      rating: 4,
      // project: "Skyline Towers Penthouse"
    },
    {
      name: "Miss Opeyemi",
      role: "Costume Designer",
      content: "From period pieces to modern productions, Unique Fabric always has exactly what I need. Their custom cutting service is a game-changer.",
      rating: 5,
      // project: "Zero-Waste Collection"
    },
  ];

  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <div className="header-badge">Verified Reviews</div>
          <h2>Trusted by Visionary Creators</h2>
          <p className="subtitle">Join 5,000+ designers who elevate their work with our fabrics</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="card-header">
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className="star-icon"
                      color={i < testimonial.rating ? "#D4AF37" : "#E2E8F0"}
                    />
                  ))}
                  <span className="rating-text">/ 5.0</span>
                </div>
                <div className="quote-icon">
                  <RiDoubleQuotesL size={28} color="#D4AF37" />
                </div>
              </div>
              
              <p className="testimonial-content">
                {testimonial.content}
              </p>
              
              {/* <div className="project-tag">
                <span>Project: </span>{testimonial.project}
              </div> */}
              
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="author-info">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;