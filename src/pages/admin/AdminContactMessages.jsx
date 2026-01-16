import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './AdminContactMessages.css'

const AdminContactMessages = () => {
  const [contactMessages, setContactMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchContactMessages()
  }, [])

  const fetchContactMessages = async () => {
    try {
            console.log("🔄 Fetching contact messages from API...");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact/dashboard`)
      console.log("📡 API Response status:", response.status);
      if (!response.ok) {
        
        throw new Error('Failed to fetch messages')
      }
      const result = await response.json()
      console.log("✅ API Success response:", result);
      if (result.success) {
         console.log(`📨 Loaded ${result.data.length} messages:`, result.data);
        setContactMessages(result.data)
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      setError('Failed to load contact messages')
      console.error('Error fetching messages:', err)
    } finally {
      setLoading(false)
    }
  }


 // Test function to check if API is accessible
  const testAPI = async () => {
    try {
      console.log("🧪 Testing API connection...");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact/dashboard`);
      console.log("🧪 Test response:", response);
      const data = await response.json();
      console.log("🧪 Test data:", data);
    } catch (error) {
      console.error("🧪 Test failed:", error);
    }
  }

  // Call test on component mount
  useEffect(() => {
    testAPI();
  }, []);



  if (loading) {
    return (
      <div className="admin-contact-section">
        <div className="contact-section-header">
          <h2 className="contact-section-title">Contact Messages</h2>
          <span className="contact-messages-count">Loading...</span>
        </div>
        <div className="loading-state">Loading messages...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-contact-section">
        <div className="contact-section-header">
          <h2 className="contact-section-title">Contact Messages</h2>
          <span className="contact-messages-count">Error</span>
        </div>
        <div className="error-state">{error}</div>
      </div>
    )
  }

  return (
    <div className="admin-contact-section">
      <div className="contact-section-header">
        <h2 className="contact-section-title">Contact Messages</h2>
        <div className="contact-header-right">
          <span className="contact-messages-count">{contactMessages.length} messages</span>
          <button className="contact-view-all-btn">
            <Link to="/admin/adminFullContactMessages" className='view-all-link'>
              View All
              <span className="contact-arrow-icon">→</span>
            </Link>
          </button>
        </div>
      </div>

      {contactMessages.length === 0 ? (
        <div className="contact-empty-state">
          <div className="contact-empty-icon">📭</div>
          <h3 className="contact-empty-title">No Contact Messages</h3>
          <p className="contact-empty-text">There are no contact form submissions yet.</p>
        </div>
      ) : (
        <div className="contact-messages-table">
          <div className="contact-table-header">
            <div className="contact-col contact-col-name">Name</div>
            <div className="contact-col contact-col-email">Email</div>
            <div className="contact-col contact-col-message">Message</div>
            <div className="contact-col contact-col-date">Date</div>
          </div>
          
          <div className="contact-table-body">
            {contactMessages.map((message) => (
              <div key={message._id} className="contact-table-row">
                <div className="contact-col contact-col-name">
                  <span className="contact-sender-name">{message.name}</span>
                </div>
                
                <div className="contact-col contact-col-email">
                  <span className="contact-sender-email">{message.email}</span>
                </div>
                
                <div className="contact-col contact-col-message">
                  <p className="contact-message-preview">{message.message}</p>
                </div>
                
                <div className="contact-col contact-col-date">
                  <span className="contact-message-date">{message.formattedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminContactMessages