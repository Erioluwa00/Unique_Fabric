import { useState } from "react";
import { Link } from "react-router-dom";
import './Blog.css'

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Articles" },
    { id: "fabric-care", name: "Fabric Care" },
    { id: "diy-projects", name: "DIY Projects" },
    { id: "sustainability", name: "Sustainability" },
    { id: "design-tips", name: "Design Tips" },
    { id: "industry-news", name: "Industry News" }
  ];

  const featuredPost = {
    id: 1,
    title: "The Future of Sustainable Textiles: Innovations Changing the Fabric Industry",
    excerpt: "Explore groundbreaking technologies and materials that are revolutionizing how we produce and consume fabrics sustainably.",
    category: "sustainability",
    author: "Dr. Elena Rodriguez",
    date: "2024-01-15",
    readTime: "8 min read",
    image: "https://i.pinimg.com/1200x/89/4d/0e/894d0e630dd68cdb1c08ac0b4bc3d6ee.jpg",
    featured: true
  };

  const posts = [
    {
      id: 2,
      title: "Caring for Your African Print Fabrics: A Complete Guide",
      excerpt: "Learn how to properly wash, iron, and store your precious Ankara and other African print fabrics to maintain their vibrant colors.",
      category: "fabric-care",
      author: "Sarah Chen",
      date: "2024-01-12",
      readTime: "5 min read",
      image: "https://i.pinimg.com/1200x/3c/fb/08/3cfb0830c2ffa49ff86188fa6970973f.jpg"
    },
    {
      id: 3,
      title: "10 DIY Projects Using Fabric Scraps",
      excerpt: "Turn your leftover fabric pieces into beautiful home decor items, accessories, and gifts with these creative ideas.",
      category: "diy-projects",
      author: "Marcus Johnson",
      date: "2024-01-10",
      readTime: "6 min read",
      image: "https://i.pinimg.com/1200x/1e/88/66/1e88668c83f16c04f0d702ca06540275.jpg"
    },
    {
      id: 4,
      title: "Understanding Fabric Weaves: A Designer's Handbook",
      excerpt: "Deep dive into different weaving techniques and how they affect fabric drape, texture, and performance in your designs.",
      category: "design-tips",
      author: "Amina Diallo",
      date: "2024-01-08",
      readTime: "7 min read",
      image: "https://i.pinimg.com/1200x/f6/66/d1/f666d15a386d87dd537b3000d66164fd.jpg"
    },
    {
      id: 5,
      title: "The Rise of Eco-Friendly Dyes in Modern Textiles",
      excerpt: "Discover how natural and low-impact dyes are creating vibrant colors without harming the environment.",
      category: "sustainability",
      author: "Dr. Elena Rodriguez",
      date: "2024-01-05",
      readTime: "4 min read",
      image: "https://i.pinimg.com/1200x/d2/f8/89/d2f88990037de05eb3df070ca780dce5.jpg"
    },
    {
      id: 6,
      title: "Seasonal Fabric Guide: Best Textiles for Every Climate",
      excerpt: "Choose the right fabrics for your projects based on weather conditions and seasonal requirements.",
      category: "design-tips",
      author: "Sarah Chen",
      date: "2024-01-03",
      readTime: "5 min read",
      image: "https://i.pinimg.com/1200x/25/62/54/2562545a2aba803c7511ac340c333e5a.jpg"
    }
  ];

  const filteredPosts = activeCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Fabric Knowledge Hub</h1>
            {/* <p className="hero-subtitle">
              Expert insights, creative inspiration, and industry updates for fabric 
              enthusiasts, designers, and makers.
            </p> */}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="featured-post">
        <div className="container">
          <div className="featured-card">
            <div className="featured-image">
              <img src={featuredPost.image} alt={featuredPost.title} />
              <div className="featured-badge">Featured</div>
            </div>
            <div className="featured-content">
              <div className="post-meta">
                <span className="category-tag">{featuredPost.category}</span>
                <span className="read-time">{featuredPost.readTime}</span>
              </div>
              <h2 className="post-title">{featuredPost.title}</h2>
              <p className="post-excerpt">{featuredPost.excerpt}</p>
              <div className="post-footer">
                <div className="author-info">
                  <span className="author-name">By {featuredPost.author}</span>
                  <span className="post-date">{formatDate(featuredPost.date)}</span>
                </div>
                <button className="read-more-btn">Read Full Article</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="blog-content">
        <div className="container">
          <div className="blog-layout">
            {/* Sidebar */}
            <aside className="blog-sidebar">
              <div className="sidebar-widget">
                <h3>Categories</h3>
                <div className="category-list">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sidebar-widget">
                <h3>Popular Tags</h3>
                <div className="tag-cloud">
                  <span className="tag">Sustainable Fashion</span>
                  <span className="tag">Fabric Care</span>
                  <span className="tag">DIY</span>
                  <span className="tag">Textile Innovation</span>
                  <span className="tag">African Prints</span>
                  <span className="tag">Weaving Techniques</span>
                </div>
              </div>

              {/* <div className="sidebar-widget newsletter-widget">
                <h3>Stay Updated</h3>
                <p>Get the latest articles and fabric insights delivered to your inbox.</p>
                <div className="newsletter-form">
                  <input type="email" placeholder="Enter your email" />
                  <button className="btn btn-primary">Subscribe</button>
                </div>
              </div> */}
            </aside>

            {/* Main Content */}
            <main className="blog-main">
              <div className="posts-grid">
                {filteredPosts.map(post => (
                  <article key={post.id} className="post-card">
                    <div className="post-image">
                      <img src={post.image} alt={post.title} />
                      <div className="category-badge">{post.category}</div>
                    </div>
                    <div className="post-content">
                      <div className="post-meta">
                        <span className="author">By {post.author}</span>
                        <span className="date">{formatDate(post.date)}</span>
                        <span className="read-time">{post.readTime}</span>
                      </div>
                      <h3 className="post-title">{post.title}</h3>
                      <p className="post-excerpt">{post.excerpt}</p>
                      <button className="read-more-link">Continue Reading →</button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More */}
              <div className="load-more-section">
                <button className="btn blog-btn">Load More Articles</button>
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="blog-newsletter">
        <div className="container">
          <div className="blog-newsletter-content">
            <h2>Join Our Creative Community</h2>
            <p>
              Get weekly inspiration, exclusive tutorials, and early access to new 
              fabric collections.
            </p>
            <div className="newsletter-form-large">
              <input type="email" placeholder="Your email address" />
              <button className="btn btn-primary">Subscribe Now</button>
            </div>
            {/* <p className="newsletter-note">
              No spam, unsubscribe at any time. Read our <Link to="/privacy">Privacy Policy</Link>.
            </p> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;