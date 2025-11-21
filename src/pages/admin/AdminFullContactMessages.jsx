import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminFullContactMessages.css'

const AdminFullContactMessages = () => {
  const navigate = useNavigate()
  const [contactMessages, setContactMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAllContactMessages()
  }, [])

  const fetchAllContactMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/contact')
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      const result = await response.json()
      
      if (result.success) {
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

  const markAsRead = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/contact/${messageId}/read`, {
        method: 'PUT'
      })
      
      if (!response.ok) {
        throw new Error('Failed to mark as read')
      }

      const result = await response.json()
      
      if (result.success) {
        // Update local state
        setContactMessages(prev => prev.map(msg => 
          msg._id === messageId ? { ...msg, status: 'read' } : msg
        ))
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      console.error('Error marking message as read:', err)
      alert('Failed to mark message as read')
    }
  }

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/contact/${messageId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete message')
      }

      const result = await response.json()
      
      if (result.success) {
        // Remove from local state
        setContactMessages(prev => prev.filter(msg => msg._id !== messageId))
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      console.error('Error deleting message:', err)
      alert('Failed to delete message')
    }
  }

  const handleBackClick = () => {
    navigate('/admin/reports')
  }

  if (loading) {
    return (
      <div className="contact-messages-page">
        <div className="contact-page-header">
          <button className="back-button" onClick={handleBackClick}>
            <span className="back-arrow">←</span>
            Back to Reports
          </button>
          <h1 className="contact-page-title">Contact Messages</h1>
          <div className="loading-state">Loading messages...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="contact-messages-page">
      <div className="contact-page-header">
        <button className="back-button" onClick={handleBackClick}>
          <span className="back-arrow">←</span>
          Back to Reports
        </button>
        <h1 className="contact-page-title">Contact Messages</h1>
        <div className="contact-page-stats">
          <span className="total-messages">{contactMessages.length} Total Messages</span>
          <span className="unread-count">
            {contactMessages.filter(msg => msg.status === 'unread').length} Unread
          </span>
        </div>
      </div>

      {error && <div className="error-state">{error}</div>}

      <div className="contact-messages-container">
        <div className="messages-table-container">
          <div className="messages-table-header">
            <div className="message-col message-col-status">Status</div>
            <div className="message-col message-col-name">Name</div>
            <div className="message-col message-col-email">Email</div>
            <div className="message-col message-col-message">Message</div>
            <div className="message-col message-col-date">Date</div>
            <div className="message-col message-col-actions">Actions</div>
          </div>

          <div className="messages-table-body">
            {contactMessages.length === 0 ? (
              <div className="no-messages-full">
                <div className="no-messages-icon">📭</div>
                <h3>No Contact Messages</h3>
                <p>There are no contact form submissions yet.</p>
              </div>
            ) : (
              contactMessages.map((message) => (
                <div key={message._id} className={`message-table-row ${message.status}`}>
                  <div className="message-col message-col-status">
                    <span className={`status-indicator ${message.status}`}>
                      {message.status === 'unread' ? '●' : '✓'}
                    </span>
                  </div>
                  
                  <div className="message-col message-col-name">
                    <span className="message-sender-name">{message.name}</span>
                  </div>
                  
                  <div className="message-col message-col-email">
                    <span className="message-sender-email">{message.email}</span>
                  </div>
                  
                  <div className="message-col message-col-message">
                    <p className="message-full-preview">{message.message}</p>
                  </div>
                  
                  <div className="message-col message-col-date">
                    <span className="message-full-date">{message.formattedDate}</span>
                  </div>
                  
                  <div className="message-col message-col-actions">
                    <div className="message-actions">
                      {message.status === 'unread' && (
                        <button 
                          className="action-btn read-btn"
                          onClick={() => markAsRead(message._id)}
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => deleteMessage(message._id)}
                        title="Delete message"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminFullContactMessages