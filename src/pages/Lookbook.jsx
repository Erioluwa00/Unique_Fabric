import { useState } from "react";
import { Link } from "react-router-dom";
import "./Lookbook.css";

const LookBook = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedLook, setSelectedLook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: "all", name: "All Looks" },
    { id: "women", name: "Women Styles" },
    { id: "men", name: "Men Styles" },
    { id: "kids", name: "Kid Styles" },
    { id: "couples", name: "Couple Styles" },
    { id: "occasion", name: "Occasions" },
    { id: "pattern", name: "Fabric Pattern" }
  ];

  const looks = [
  {
    id: 1,
    title: "Modern Ankara Fusion",
    category: "women",
    designer: "Nia Designs",
    fabrics: ["Classic Ankara Print", "Silk Lining"],
    image: "https://www.thrivenaija.com/wp-content/uploads/2021/04/ankarastyles.jpg",
    description: "Contemporary dress blending traditional African prints with modern silhouettes",
    fullDescription: "This stunning contemporary dress masterfully blends traditional African Ankara prints with modern fashion silhouettes. The bold patterns are carefully placed to create a flattering shape that celebrates cultural heritage while embracing contemporary design principles."
  },
  {
    id: 2,
    title: "Silk Evening Gown",
    category: "men",
    designer: "Luxe Creations",
    fabrics: ["Italian Silk", "French Lace"],
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjtuck1xz_dEc6JqnsLJXr69U0waKZzaffnnydLmHd24cpGzYYrDgU5KxzpAAS7LQ2Oy8KRV45IwgURAmFpN1Y98ccHrKT7zLRvEnjqVcoTGRUxDwCBSzzjKwDN8g1PD4b7XOSx8FMJnz1A-WgHOIwchGoWixiuq3ZGlemnYBDPGOJE8gEE14Byiv2TTh05/s800/Ankarafashion%20style%20inspiration%20--___oboshies_sewing_class%20___ankarastyles%20_ankarazone%20_ankarastyles%20_ankarafashiongallery%20_madeinnigeria(image2).JPG",
    description: "Elegant floor-length gown featuring our premium silk collection",
    fullDescription: "An exquisite floor-length evening gown crafted from the finest Italian silk and delicate French lace. The gown features a flowing train and intricate beading that catches the light beautifully, making it perfect for formal events and red carpet appearances."
  },
  {
    id: 3,
    title: "Casual Linen Set",
    category: "kids",
    designer: "Urban Weavers",
    fabrics: ["Belgian Linen", "Organic Cotton"],
    image: "https://i.pinimg.com/1200x/13/5d/38/135d3885c4703c584932726cd2a0c080.jpg",
    description: "Comfortable and sustainable everyday wear perfect for warm weather",
    fullDescription: "This comfortable and sustainable linen set is perfect for everyday wear in warm climates. Made from premium Belgian linen and organic cotton, the set includes a relaxed-fit top and wide-leg pants that prioritize both style and comfort while being environmentally conscious."
  },
  {
    id: 4,
    title: "Traditional Bridal Attire",
    category: "couples",
    designer: "Heritage Bridal",
    fabrics: ["Hand-embroidered Silk", "Pearl Accents"],
    image: "https://res.cloudinary.com/dwhlsl0yn/image/upload/v1712303820/articles/o8yhqccp7xohwgnhyjg9.jpg",
    description: "Custom bridal wear incorporating traditional craftsmanship",
    fullDescription: "A breathtaking traditional bridal ensemble that incorporates centuries-old craftsmanship techniques. Each piece is hand-embroidered with silk thread and accented with genuine pearls, creating a timeless look that honors cultural traditions while making any bride feel exceptionally special on her wedding day."
  },
  {
    id: 5,
    title: "Artisan Scarf Collection",
    category: "occasion",
    designer: "Texture Studio",
    fabrics: ["Japanese Chiffon", "Wool Blend"],
    image: "https://www.ruffntumblekids.com/cdn/shop/products/10.png?v=1755699432",
    description: "Handcrafted scarves showcasing unique textures and patterns",
    fullDescription: "This collection of artisan scarves showcases unique textures and patterns inspired by global textile traditions. Each scarf is handcrafted using Japanese chiffon and premium wool blends, resulting in versatile accessories that can transform any outfit while providing warmth and style."
  },
  {
    id: 6,
    title: "Bohemian Maxi Dress",
    category: "pattern",
    designer: "Free Spirit Fashion",
    fabrics: ["Rayon Blend", "Embroidered Cotton"],
    image: "https://i0.wp.com/clipkulture.com/wp-content/uploads/2021/06/13-41-38-132290009_864623571023565_8813636967934182517_n-e1623923857105.jpg?fit=700%2C834&ssl=1",
    description: "Flowy bohemian dress perfect for summer festivals and beach weddings",
    fullDescription: "A beautiful flowy bohemian maxi dress that embodies the free-spirited aesthetic. Made from a comfortable rayon blend with intricate embroidered cotton details, this dress is perfect for summer festivals, beach weddings, or any occasion where you want to express your bohemian style with elegance and comfort."
  },
  // Now adding 30 more items to reach 36
  {
    id: 7,
    title: "Ankara Peplum Top",
    category: "women",
    designer: "Kente Couture",
    fabrics: ["Ankara Wax Print", "Cotton Blend"],
    image: "https://i.pinimg.com/1200x/1d/8e/b2/1d8eb2c33747be482c1f46461dbd0e77.jpg",
    description: "Tailored peplum top made from vibrant Ankara print",
    fullDescription: "This tailored peplum top highlights the bold and colorful Ankara wax print. The fitted bodice flares at the waist, creating a flattering shape that balances structure and playfulness."
  },
  {
    id: 8,
    title: "Ankara Pencil Skirt",
    category: "women",
    designer: "Urban Weavers",
    fabrics: ["Ankara Print", "Stretch Cotton"],
    image: "https://i.pinimg.com/736x/6c/58/d6/6c58d6615363b8a93332c6ba8786f542.jpg",
    description: "Slim-fit pencil skirt in a bold African wax print",
    fullDescription: "A sleek pencil skirt designed to hug the body while showcasing a bright and bold Ankara wax print. The stretch cotton fabric ensures comfort and mobility, perfect for both work and social outings."
  },
  {
    id: 9,
    title: "Couple Matching Dashiki Set",
    category: "couples",
    designer: "Heritage Threads",
    fabrics: ["Ankara Print", "Linen"],
    image: "https://i.pinimg.com/1200x/31/48/c4/3148c44633502e5d0dd1a729ab7a29fa.jpg",
    description: "Matching dashiki outfits for couples featuring traditional prints",
    fullDescription: "This set features coordinated dashiki tops for couples, crafted from Ankara print and linen blend. The set celebrates unity and style with a nod to heritage, ideal for cultural celebrations or couple photoshoots."
  },
  {
    id: 10,
    title: "Ankara Kids Jumpsuit",
    category: "kids",
    designer: "Mini Africana",
    fabrics: ["Ankara Wax", "Cotton"],
    image: "https://i.pinimg.com/736x/3c/d7/d6/3cd7d69bb11ac0831a54c216b5fa0679.jpg",
    description: "Playful jumpsuit for kids made from colorful African prints",
    fullDescription: "A comfortable and stylish jumpsuit for kids, made from soft Ankara wax print and breathable cotton. The design allows easy movement while staying eye-catching and culturally rich."
  },
  {
    id: 11,
    title: "Ankara Ball Gown",
    category: "women",
    designer: "Royal Afrika",
    fabrics: ["Silk", "Ankara Print"],
    image: "https://res.cloudinary.com/dwhlsl0yn/image/upload/v1712303820/articles/o8yhqccp7xohwgnhyjg9.jpg",
    description: "Dramatic ball gown mixing silk and Ankara fabrics",
    fullDescription: "This dramatic ball gown combines luxurious silk and vibrant Ankara print. The full skirt and fitted bodice enhance the silhouette, while the bold patterns reflect a strong cultural identity."
  },
  {
    id: 12,
    title: "Ankara Shirt Dress",
    category: "women",
    designer: "Everyday Ethnic",
    fabrics: ["Ankara Wax", "Cotton"],
    image: "https://i0.wp.com/clipkulture.com/wp-content/uploads/2021/06/13-41-38-132290009_864623571023565_8813636967934182517_n-e1623923857105.jpg?fit=700%2C834&ssl=1",
    description: "Casual shirt dress with bold print",
    fullDescription: "A relaxed shirt dress made from Ankara wax print and cotton, perfect for both casual wear and semi-formal settings. The button-down design adds structure, while the print keeps it lively."
  },
  {
    id: 13,
    title: "Ankara Wide‑Leg Trousers",
    category: "men",
    designer: "Kente Couture",
    fabrics: ["Ankara Print", "Cotton"],
    image: "https://i.pinimg.com/1200x/75/96/cf/7596cfc368a7547b434799fe926c1d1d.jpg",
    description: "Comfortable wide-leg trousers featuring African print",
    fullDescription: "These wide-leg trousers combine the boldness of Ankara print with the comfort of cotton. Designed for a relaxed fit, they’re ideal for creative or cultural events."
  },
  {
    id: 14,
    title: "Ankara Bomber Jacket",
    category: "men",
    designer: "Modern Heritage",
    fabrics: ["Ankara Print", "Polyester Lining"],
    image: "https://i.pinimg.com/1200x/d4/7d/32/d47d32b531c1c21400e4f442f94fe23c.jpg",
    description: "Stylish bomber jacket with Ankara accent panels",
    fullDescription: "A trendy bomber jacket that fuses modern streetwear with African tradition. Features Ankara print panels on the sleeves and body, and a smooth polyester lining for comfort."
  },
  {
    id: 15,
    title: "Ankara Romper",
    category: "kids",
    designer: "Mini Africana",
    fabrics: ["Ankara Wax", "Linen"],
    image: "https://i.pinimg.com/1200x/64/d1/6f/64d16f797e59ad72903b3b615cf5646e.jpg",
    description: "Cute kids romper made from vibrant African prints",
    fullDescription: "This romper is crafted from soft Ankara wax print and linen for breathability. With easy snap closures, it’s both functional and fun for active kids."
  },
  {
    id: 16,
    title: "Ankara Maxi Skirt",
    category: "women",
    designer: "Free Spirit Fashion",
    fabrics: ["Ankara Print", "Cotton"],
    image: "https://i0.wp.com/clipkulture.com/wp-content/uploads/2021/06/13-41-38-132290009_864623571023565_8813636967934182517_n-e1623923857105.jpg?fit=700%2C834&ssl=1",
    description: "Long flowing skirt with bold print",
    fullDescription: "A long, flowing maxi skirt made from Ankara print and cotton. The design offers elegance and ease, ideal for summer outings or relaxed settings."
  },
  {
    id: 17,
    title: "Ankara Kimono Robe",
    category: "occasion",
    designer: "Texture Studio",
    fabrics: ["Ankara Wax", "Silk"],
    image: "https://www.ruffntumblekids.com/cdn/shop/products/10.png?v=1755699432",
    description: "Luxurious kimono-style robe for special occasions",
    fullDescription: "This kimono-style robe features Ankara wax print with a silk interior. It’s a luxurious layering piece, perfect for special events or as elegant loungewear."
  },
  {
    id: 18,
    title: "Ankara Tunic",
    category: "women",
    designer: "Everyday Ethnic",
    fabrics: ["Ankara Print", "Cotton"],
    image: "https://i0.wp.com/clipkulture.com/wp-content/uploads/2021/06/13-41-38-132290009_864623571023565_8813636967934182517_n-e1623923857105.jpg?fit=700%2C834&ssl=1",
    description: "Comfortable tunic top for day to day wear",
    fullDescription: "A loose-fit tunic made with Ankara wax print and cotton. Designed for breathable comfort and cultural flair — perfect over leggings or trousers."
  },
  {
    id: 19,
    title: "Ankara Cargo Pants",
    category: "men",
    designer: "Modern Heritage",
    fabrics: ["Ankara Print", "Denim"],
    image: "https://i.pinimg.com/1200x/5c/13/77/5c1377e2415a3a74dbf414deb193446b.jpg",
    description: "Functional cargo pants with African print pockets",
    fullDescription: "These cargo pants combine denim with Ankara-printed pockets and accents. They’re practical yet fashion-forward, with a utilitarian silhouette and cultural print detail."
  },
  {
    id: 20,
    title: "Ankara Sports Jacket",
    category: "men",
    designer: "Urban Weavers",
    fabrics: ["Ankara Wax", "Polyester"],
    image: "https://i.pinimg.com/1200x/59/9d/83/599d83562e68515fecbb34f276f13692.jpg",
    description: "Sporty jacket with African wax print panels",
    fullDescription: "A sporty jacket that blends performance fabrics with cultural flair. Ankara print panels are accentuated on the chest and sleeves, giving a unique and bold look."
  },
  {
    id: 21,
    title: "Ankara Pleated Dress",
    category: "women",
    designer: "Kente Couture",
    fabrics: ["Ankara Wax", "Silk Blend"],
    image: "https://www.thrivenaija.com/wp-content/uploads/2021/04/ankarastyles.jpg",
    description: "Elegant pleated dress for formal and semi-formal occasions",
    fullDescription: "This pleated dress, made from a silk blend and Ankara wax print, features elegant knife pleats and a flowing silhouette. Its rich pattern and refined cut make it suitable for formal evening wear."
  },
  {
    id: 22,
    title: "Ankara Wrap Skirt",
    category: "women",
    designer: "Free Spirit Fashion",
    fabrics: ["Ankara Print", "Cotton"],
    image: "https://i0.wp.com/clipkulture.com/wp-content/uploads/2021/06/13-41-38-132290009_864623571023565_8813636967934182517_n-e1623923857105.jpg?fit=700%2C834&ssl=1",
    description: "Wrap skirt that ties at the waist with vibrant print",
    fullDescription: "A flattering wrap skirt made from Ankara wax print and cotton, adjustable at the waist for a custom fit. Light and breezy, it's a great piece for transitional weather."
  },
  {
    id: 23,
    title: "Ankara Peasant Blouse",
    category: "women",
    designer: "Everyday Ethnic",
    fabrics: ["Ankara Print", "Linen"],
    image: "https://i0.wp.com/clipkulture.com/wp-content/uploads/2021/06/13-41-38-132290009_864623571023565_8813636967934182517_n-e1623923857105.jpg?fit=700%2C834&ssl=1",
    description: "Loose peasant blouse with elastic neckline",
    fullDescription: "This peasant blouse has a relaxed fit, elastic neckline, and flowing sleeves. Made with Ankara wax print and linen, it’s breathable and expressive — ideal for warm days."
  },
  {
    id: 24,
    title: "Ankara Jumpsuit (Adult)",
    category: "women",
    designer: "Kente Couture",
    fabrics: ["Ankara Wax", "Cotton"],
    image: "https://www.thrivenaija.com/wp-content/uploads/2021/04/ankarastyles.jpg",
    description: "Stylish and comfortable one-piece jumpsuit",
    fullDescription: "A one-piece ankle-length jumpsuit made from Ankara wax print and cotton. Tailored for a relaxed fit, with wide legs and a cinched waist to balance comfort and style."
  },
  {
    id: 25,
    title: "Ankara Blazer",
    category: "men",
    designer: "Modern Heritage",
    fabrics: ["Ankara Print", "Wool Blend"],
    image: "https://i.pinimg.com/736x/25/69/91/25699106b85b926024fbbf5eaa1ddda4.jpg",
    description: "Tailored blazer with an Ankara twist",
    fullDescription: "A structured blazer combining classic tailoring with a bold Ankara print. The wool blend body gives it form, while Ankara panels bring character and cultural flair."
  },
  {
    id: 26,
    title: "Ankara Midi Dress",
    category: "women",
    designer: "Free Spirit Fashion",
    fabrics: ["Ankara Print", "Polyester"],
    image: "https://i0.wp.com/clipkulture.com/wp-content/uploads/2021/06/13-41-38-132290009_864623571023565_8813636967934182517_n-e1623923857105.jpg?fit=700%2C834&ssl=1",
    description: "Midi-length dress with bold African prints",
    fullDescription: "A midi-length dress made from Ankara print and lightweight polyester. It features a flattering A-line cut, making it both stylish and comfortable for all-day wear."
  },
  {
    id: 27,
    title: "Ankara Headwrap Collection",
    category: "pattern",
    designer: "Texture Studio",
    fabrics: ["Ankara Wax", "Silk"],
    image: "https://www.ruffntumblekids.com/cdn/shop/products/10.png?v=1755699432",
    description: "Set of headwraps crafted from vibrant fabrics",
    fullDescription: "This collection includes several styles of headwraps — turban, scarf wrap, bow — all made from colorful Ankara wax print and silk blend. They’re versatile accessories that elevate any outfit."
  },
  {
    id: 28,
    title: "Ankara Layered Skirt",
    category: "women",
    designer: "Kente Couture",
    fabrics: ["Ankara Print", "Tulle"],
    image: "https://i0.wp.com/clipkulture.com/wp-content/uploads/2021/06/13-41-38-132290009_864623571023565_8813636967934182517_n-e1623923857105.jpg?fit=700%2C834&ssl=1",
    description: "Multi-tiered skirt for maximum movement and flair",
    fullDescription: "A multi-layered skirt combining Ankara wax print with soft tulle for dramatic volume and flow. Perfect for dance, festive events, or any moment you want to make a statement."
  },
  {
    id: 29,
    title: "Ankara Corset Top",
    category: "women",
    designer: "Royal Afrika",
    fabrics: ["Ankara Wax", "Satin"],
    image: "https://www.thrivenaija.com/wp-content/uploads/2021/04/ankarastyles.jpg",
    description: "Structured corset top with bold print and satin accents",
    fullDescription: "This corset-style top uses structured boning and Ankara wax print, contrasted with satin panels to highlight the silhouette. It’s designed to be both bold and elegant."
  },
  {
    id: 30,
    title: "Kids Ankara Dress with Ruffles",
    category: "kids",
    designer: "Mini Africana",
    fabrics: ["Ankara Wax", "Cotton"],
    image: "https://i.pinimg.com/1200x/10/db/4a/10db4a85014ea6e0ca36dcb1e743b658.jpg",
    description: "Cute ruffle dress for little ones in vibrant print",
    fullDescription: "A playful ruffle dress for kids, made from Ankara wax print and soft cotton. The layered ruffles add movement and fun, perfect for both playdates and special occasions."
  },
  {
    id: 31,
    title: "Ankara Shirt (Short‑Sleeve)",
    category: "men",
    designer: "Everyday Ethnic",
    fabrics: ["Ankara Print", "Cotton"],
    image: "https://i.pinimg.com/1200x/88/d1/25/88d12537c9ddd9c8beffd338f0626a72.jpg",
    description: "Casual short-sleeve shirt in African print",
    fullDescription: "A comfortable short-sleeve shirt made from Ankara wax print and cotton. It’s easy to wear and pairs well with jeans or chinos for a smart-casual look."
  },
  {
    id: 32,
    title: "Ankara Culottes",
    category: "women",
    designer: "Free Spirit Fashion",
    fabrics: ["Ankara Print", "Cotton"],
    image: "https://i0.wp.com/clipkulture.com/wp-content/uploads/2021/06/13-41-38-132290009_864623571023565_8813636967934182517_n-e1623923857105.jpg?fit=700%2C834&ssl=1",
    description: "Wide-legged culottes in bright African print",
    fullDescription: "These culottes are made from Ankara wax print and cotton, featuring a wide leg design for flow and comfort. Great for summer or layered looks."
  },
  {
    id: 33,
    title: "Ankara Slip Dress",
    category: "women",
    designer: "Kente Couture",
    fabrics: ["Ankara Print", "Silk"],
    image: "https://www.thrivenaija.com/wp-content/uploads/2021/04/ankarastyles.jpg",
    description: "Simple and elegant slip dress with cultural flair",
    fullDescription: "A minimalistic slip dress made from silk and Ankara wax print. The lightweight fabric slides gently over the body, giving an elegant, refined look."
  },
  {
    id: 34,
    title: "Ankara Vest",
    category: "men",
    designer: "Modern Heritage",
    fabrics: ["Ankara Print", "Cotton"],
    image: "https://i.pinimg.com/1200x/11/4f/1b/114f1b7075865c86e5aea404f0cb0402.jpg",
    description: "Stylish vest with African wax print",
    fullDescription: "A tailored vest made from Ankara wax print and cotton. Perfect for layering over a shirt for a cultural yet sophisticated look."
  },
  {
    id: 35,
    title: "Ankara Festival Pants",
    category: "men",
    designer: "Free Spirit Fashion",
    fabrics: ["Ankara Print", "Linen"],
    image: "https://i.pinimg.com/1200x/10/9a/88/109a88a03282ffce1867eec723ec5af9.jpg",
    description: "Loose festival pants that move with you",
    fullDescription: "Flowy linen pants with Ankara print accents built for comfort and style. These are great for festivals, travel, or any relaxed cultural setting."
  },
  {
    id: 36,
    title: "Ankara Caftan",
    category: "occasion",
    designer: "Heritage Threads",
    fabrics: ["Ankara Wax", "Silk"],
    image: "https://www.ruffntumblekids.com/cdn/shop/products/10.png?v=1755699432",
    description: "Flowing caftan made for special cultural occasions",
    fullDescription: "A beautifully draped caftan made from Ankara wax print and silk, designed for elegance and ease. The generous cut makes it ideal for ceremonies, celebrations, or as a statement piece in any wardrobe."
  }
];


  const filteredLooks =
    activeCategory === "all"
      ? looks
      : looks.filter((look) => look.category === activeCategory);

  const openModal = (look) => {
    setSelectedLook(look);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLook(null);
  };

  return (
    <div className="lookbook-page">
      {/* Hero Section */}
      <section className="lookbook-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Fabric Inspiration Gallery</h1>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="lookbook-filter">
        <div className="container">
          <div className="filter-tabs">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`filter-tab ${
                  activeCategory === category.id ? "active" : ""
                }`}
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
            {filteredLooks.map((look) => (
              <div key={look.id} className="look-card">
                <div className="look-image">
                  <img src={look.image} alt={look.title} />
                  <div className="look-overlay">
                    <button
                      className="view-details-btn"
                      onClick={() => openModal(look)}
                    >
                      View Details
                    </button>
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
                        <span key={index} className="fabric-tag">
                          {fabric}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="look-actions">
                    <Link to="/shop" className="btn btn-outline">
                      Shop Similar Fabrics
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedLook && (
        <div className="lookbook-modal-overlay" onClick={closeModal}>
          <div className="lookbook-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="lookbook-modal-close" onClick={closeModal}>
              ×
            </button>
            <div className="lookbook-modal-body">
              <div className="lookbook-modal-image">
                <img src={selectedLook.image} alt={selectedLook.title} />
              </div>
              <div className="lookbook-modal-details">
                <h2>{selectedLook.title}</h2>
                <p className="lookbook-modal-designer">by {selectedLook.designer}</p>
                <p className="lookbook-modal-category">
                  Category:{" "}
                  {
                    categories.find((cat) => cat.id === selectedLook.category)
                      ?.name
                  }
                </p>
                <p className="lookbook-modal-full-description">
                  {selectedLook.fullDescription}
                </p>
                <div className="lookbook-modal-fabrics">
                  <h4>Fabrics Used:</h4>
                  <div className="fabric-tags">
                    {selectedLook.fabrics.map((fabric, index) => (
                      <span key={index} className="fabric-tag">
                        {fabric}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="modal-actions">
                  <Link to="/shop" className="btn btn-primary">
                    Shop Similar Fabrics
                  </Link>
                  <button className="btn " onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                The quality and variety of their African prints allow me to
                create pieces that truly celebrate our cultural heritage while
                appealing to modern fashion sensibilities."
              </p>
              <div className="designer-stats">
                <div className="stat">
                  <span className="lookbook-stat-number">3</span>
                  <span className="lookbook-stat-label">Collections</span>
                </div>
                <div className="stat">
                  <span className="lookbook-stat-number">50+</span>
                  <span className="lookbook-stat-label">Pieces Created</span>
                </div>
                <div className="stat">
                  <span className="lookbook-stat-number">2</span>
                  <span className="lookbook-stat-label">Years Partnered</span>
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
              Have you created something amazing with our fabrics? We'd love to
              feature your work in our lookbook and inspire other creators.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Submit Your Project</button>
              <Link to="/shop" className="btn btn-outline">
                Get Inspired
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LookBook;
