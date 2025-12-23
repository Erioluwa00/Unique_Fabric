import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminFullContactMessages.css'

const AdminFullContactMessages = () => {
  const navigate = useNavigate()
  const [contactMessages, setContactMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedMessageId, setExpandedMessageId] = useState(null)

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
        setContactMessages(prev => prev.filter(msg => msg._id !== messageId))
        if (expandedMessageId === messageId) {
          setExpandedMessageId(null)
        }
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      console.error('Error deleting message:', err)
      alert('Failed to delete message')
    }
  }

  const toggleMessageExpansion = (messageId) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId)
  }

  const handleBackClick = () => {
    navigate('/admin/reports')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="admin-contact-messages-page">
        <div className="admin-contact-page-header">
          <button className="admin-contact-back-button" onClick={handleBackClick}>
            <span className="admin-back-arrow">←</span>
            Back to Reports
          </button>
          <h1 className="admin-contact-page-title">Contact Messages</h1>
          <div className="admin-contact-loading-state">Loading messages...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-contact-messages-page">
      <div className="admin-contact-page-header">
        <div className="admin-contact-header-top">
          <button className="admin-contact-back-button" onClick={handleBackClick}>
            <span className="admin-back-arrow">←</span>
           
          </button>
        </div>
        
        <div className="admin-contact-header-main">
          <h1 className="admin-contact-page-title">Contact Messages</h1>
          <div className="admin-contact-page-stats">
            <div className="admin-contact-stat-item">
              <span className="admin-contact-stat-value">{contactMessages.length}</span>
              <span className="admin-contact-stat-label">Total Messages</span>
            </div>
            <div className="admin-contact-stat-item">
              <span className="admin-contact-stat-value admin-contact-unread-count">
                {contactMessages.filter(msg => msg.status === 'unread').length}
              </span>
              <span className="admin-contact-stat-label">Unread</span>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="admin-contact-error-state">{error}</div>}

      <div className="admin-contact-messages-container">
        {contactMessages.length === 0 ? (
          <div className="admin-contact-no-messages">
            <div className="admin-contact-no-messages-icon">📭</div>
            <h3 className="admin-contact-no-messages-title">No Contact Messages</h3>
            <p className="admin-contact-no-messages-text">There are no contact form submissions yet.</p>
          </div>
        ) : (
          <div className="admin-contact-messages-list">
            {contactMessages.map((message) => (
              <div 
                key={message._id} 
                className={`admin-contact-message-card admin-contact-message-${message.status} ${expandedMessageId === message._id ? 'admin-contact-message-expanded' : ''}`}
              >
                <div className="admin-contact-message-header">
                  <div className="admin-contact-message-header-left">
                    <span className={`admin-contact-status-indicator admin-contact-status-${message.status}`}>
                      {message.status === 'unread' ? '●' : '✓'}
                    </span>
                    <div className="admin-contact-sender-info">
                      <span className="admin-contact-sender-name">{message.name}</span>
                      <span className="admin-contact-sender-email">{message.email}</span>
                    </div>
                  </div>
                  
                  <div className="admin-contact-message-header-right">
                    <span className="admin-contact-message-date">{formatDate(message.createdAt || message.date)}</span>
                    <div className="admin-contact-header-actions">
                      {message.status === 'unread' && (
                        <button 
                          className="admin-contact-action-btn admin-contact-read-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(message._id)
                          }}
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button 
                        className="admin-contact-action-btn admin-contact-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteMessage(message._id)
                        }}
                        title="Delete message"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>

                <div className="admin-contact-message-content">
                  <div className={`admin-contact-message-preview ${expandedMessageId === message._id ? 'admin-contact-message-expanded' : ''}`}>
                    {message.message}
                  </div>
                </div>

                <div className="admin-contact-message-footer">
                  {message.message.length > 200 && (
                    <button 
                      className="admin-contact-expand-toggle-btn"
                      onClick={() => toggleMessageExpansion(message._id)}
                    >
                      {expandedMessageId === message._id ? (
                        <>
                          <span className="admin-contact-toggle-icon">▲</span>
                          Show Less
                        </>
                      ) : (
                        <>
                          <span className="admin-contact-toggle-icon">▼</span>
                          Show More
                        </>
                      )}
                    </button>
                  )}
                  
                  {/* <div className="admin-contact-footer-actions">
                    {message.status === 'unread' && (
                      <button 
                        className="admin-contact-action-btn admin-contact-read-btn admin-contact-footer-btn"
                        onClick={() => markAsRead(message._id)}
                      >
                        <span className="admin-contact-btn-icon">✓</span>
                        Mark as Read
                      </button>
                    )}
                    <button 
                      className="admin-contact-action-btn admin-contact-delete-btn admin-contact-footer-btn"
                      onClick={() => deleteMessage(message._id)}
                    >
                      <span className="admin-contact-btn-icon">×</span>
                      Delete
                    </button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminFullContactMessages