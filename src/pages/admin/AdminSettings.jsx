import { useState } from "react"
import "./AdminSettings.css"

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("store")
  const [settings, setSettings] = useState({
    store: {
      name: "Unique Fabrics",
      description: "Premium quality fabrics for all your creative needs",
      email: "info@uniquefabrics.com",
      phone: "+1 (555) 123-4567",
      address: "123 Fabric Street, Textile City, TC 12345",
      logo: "/placeholder.svg?key=logo",
      website: "https://uniquefabrics.com",
      socialMedia: {
        facebook: "https://facebook.com/uniquefabrics",
        instagram: "https://instagram.com/uniquefabrics",
        twitter: "https://twitter.com/uniquefabrics",
      },
    },
    notifications: {
      lowStockAlerts: true,
      newOrderAlerts: true,
      salesMilestones: true,
      emailNotifications: true,
      smsNotifications: false,
      lowStockThreshold: 10,
    },
    payment: {
      acceptCreditCards: true,
      acceptPayPal: true,
      acceptBankTransfer: false,
      currency: "USD",
      taxRate: 8.5,
      shippingRates: [
        { name: "Standard Shipping", price: 9.99, days: "5-7" },
        { name: "Express Shipping", price: 19.99, days: "2-3" },
        { name: "Overnight Shipping", price: 39.99, days: "1" },
      ],
    },
    users: [
      {
        id: 1,
        name: "Admin User",
        email: "admin@uniquefabrics.com",
        role: "Super Admin",
        status: "Active",
        lastLogin: "2024-01-15",
      },
      {
        id: 2,
        name: "Staff User",
        email: "staff@uniquefabrics.com",
        role: "Staff",
        status: "Active",
        lastLogin: "2024-01-14",
      },
      {
        id: 3,
        name: "Manager User",
        email: "manager@uniquefabrics.com",
        role: "Manager",
        status: "Inactive",
        lastLogin: "2024-01-10",
      },
    ],
  })

  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  const handleSettingChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
    setUnsavedChanges(true)
  }

  const handleNestedSettingChange = (section, parent, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [field]: value,
        },
      },
    }))
    setUnsavedChanges(true)
  }

  const handleSaveSettings = () => {
    // Mock save functionality
    setTimeout(() => {
      setUnsavedChanges(false)
      alert("Settings saved successfully!")
    }, 500)
  }

  const handleAddUser = (userData) => {
    const newUser = {
      ...userData,
      id: Math.max(...settings.users.map((u) => u.id)) + 1,
      lastLogin: "Never",
      status: "Active",
    }
    setSettings((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
    }))
    setShowAddUserModal(false)
    setUnsavedChanges(true)
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setSettings((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u.id !== userId),
      }))
      setUnsavedChanges(true)
    }
  }

  const handleToggleUserStatus = (userId) => {
    setSettings((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === userId ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u,
      ),
    }))
    setUnsavedChanges(true)
  }

  const renderStoreSettings = () => (
    <div className="settings-section">
      <h3>Store Information</h3>
      <div className="settings-form">
        <div className="form-row">
          <div className="form-group">
            <label>Store Name</label>
            <input
              type="text"
              value={settings.store.name}
              onChange={(e) => handleSettingChange("store", "name", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={settings.store.email}
              onChange={(e) => handleSettingChange("store", "email", e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Store Description</label>
          <textarea
            value={settings.store.description}
            onChange={(e) => handleSettingChange("store", "description", e.target.value)}
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={settings.store.phone}
              onChange={(e) => handleSettingChange("store", "phone", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Website URL</label>
            <input
              type="url"
              value={settings.store.website}
              onChange={(e) => handleSettingChange("store", "website", e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Store Address</label>
          <textarea
            value={settings.store.address}
            onChange={(e) => handleSettingChange("store", "address", e.target.value)}
            rows="2"
          />
        </div>

        <div className="form-group">
          <label>Logo URL</label>
          <input
            type="url"
            value={settings.store.logo}
            onChange={(e) => handleSettingChange("store", "logo", e.target.value)}
          />
        </div>

        <h4>Social Media Links</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Facebook</label>
            <input
              type="url"
              value={settings.store.socialMedia.facebook}
              onChange={(e) => handleNestedSettingChange("store", "socialMedia", "facebook", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Instagram</label>
            <input
              type="url"
              value={settings.store.socialMedia.instagram}
              onChange={(e) => handleNestedSettingChange("store", "socialMedia", "instagram", e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Twitter</label>
          <input
            type="url"
            value={settings.store.socialMedia.twitter}
            onChange={(e) => handleNestedSettingChange("store", "socialMedia", "twitter", e.target.value)}
          />
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h3>Notification Preferences</h3>
      <div className="settings-form">
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.notifications.lowStockAlerts}
              onChange={(e) => handleSettingChange("notifications", "lowStockAlerts", e.target.checked)}
            />
            <span>Low Stock Alerts</span>
          </label>
          <p className="checkbox-description">Get notified when products are running low</p>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.notifications.newOrderAlerts}
              onChange={(e) => handleSettingChange("notifications", "newOrderAlerts", e.target.checked)}
            />
            <span>New Order Alerts</span>
          </label>
          <p className="checkbox-description">Get notified when new orders are placed</p>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.notifications.salesMilestones}
              onChange={(e) => handleSettingChange("notifications", "salesMilestones", e.target.checked)}
            />
            <span>Sales Milestone Notifications</span>
          </label>
          <p className="checkbox-description">Get notified when you reach sales goals</p>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => handleSettingChange("notifications", "emailNotifications", e.target.checked)}
            />
            <span>Email Notifications</span>
          </label>
          <p className="checkbox-description">Receive notifications via email</p>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.notifications.smsNotifications}
              onChange={(e) => handleSettingChange("notifications", "smsNotifications", e.target.checked)}
            />
            <span>SMS Notifications</span>
          </label>
          <p className="checkbox-description">Receive notifications via text message</p>
        </div>

        <div className="form-group">
          <label>Low Stock Threshold</label>
          <input
            type="number"
            min="1"
            value={settings.notifications.lowStockThreshold}
            onChange={(e) => handleSettingChange("notifications", "lowStockThreshold", Number.parseInt(e.target.value))}
          />
          <p className="field-description">Alert when stock falls below this number</p>
        </div>
      </div>
    </div>
  )

  const renderPaymentSettings = () => (
    <div className="settings-section">
      <h3>Payment & Shipping</h3>
      <div className="settings-form">
        <h4>Payment Methods</h4>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.payment.acceptCreditCards}
              onChange={(e) => handleSettingChange("payment", "acceptCreditCards", e.target.checked)}
            />
            <span>Accept Credit Cards</span>
          </label>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.payment.acceptPayPal}
              onChange={(e) => handleSettingChange("payment", "acceptPayPal", e.target.checked)}
            />
            <span>Accept PayPal</span>
          </label>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.payment.acceptBankTransfer}
              onChange={(e) => handleSettingChange("payment", "acceptBankTransfer", e.target.checked)}
            />
            <span>Accept Bank Transfer</span>
          </label>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Currency</label>
            <select
              value={settings.payment.currency}
              onChange={(e) => handleSettingChange("payment", "currency", e.target.value)}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={settings.payment.taxRate}
              onChange={(e) => handleSettingChange("payment", "taxRate", Number.parseFloat(e.target.value))}
            />
          </div>
        </div>

        <h4>Shipping Rates</h4>
        <div className="shipping-rates">
          {settings.payment.shippingRates.map((rate, index) => (
            <div key={index} className="shipping-rate">
              <div className="rate-info">
                <span className="rate-name">{rate.name}</span>
                <span className="rate-details">
                  ${rate.price} - {rate.days} business days
                </span>
              </div>
              <button className="edit-rate-btn">Edit</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderUserManagement = () => (
    <div className="settings-section">
      <div className="section-header">
        <h3>User Management</h3>
        <button className="add-user-btn" onClick={() => setShowAddUserModal(true)}>
          + Add User
        </button>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {settings.users.map((user) => (
              <tr key={user.id}>
                <td className="user-name">{user.name}</td>
                <td className="user-email">{user.email}</td>
                <td className="user-role">{user.role}</td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>{user.status}</span>
                </td>
                <td className="last-login">{user.lastLogin}</td>
                <td className="user-actions">
                  <button
                    className="toggle-status-btn"
                    onClick={() => handleToggleUserStatus(user.id)}
                    title={user.status === "Active" ? "Deactivate" : "Activate"}
                  >
                    {user.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button className="delete-user-btn" onClick={() => handleDeleteUser(user.id)} title="Delete User">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="password-section">
        <h4>Change Password</h4>
        <button className="change-password-btn" onClick={() => setShowPasswordModal(true)}>
          Change Password
        </button>
      </div>
    </div>
  )

  return (
    <div className="settings">
      <div className="settings-header">
        <div>
          <h2>Settings & Configuration</h2>
          <p>Manage your store settings and preferences</p>
        </div>
        {unsavedChanges && (
          <button className="save-btn" onClick={handleSaveSettings}>
            Save Changes
          </button>
        )}
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          <button className={activeTab === "store" ? "tab active" : "tab"} onClick={() => setActiveTab("store")}>
            Store Info
          </button>
          <button
            className={activeTab === "notifications" ? "tab active" : "tab"}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
          <button className={activeTab === "payment" ? "tab active" : "tab"} onClick={() => setActiveTab("payment")}>
            Payment & Shipping
          </button>
          <button className={activeTab === "users" ? "tab active" : "tab"} onClick={() => setActiveTab("users")}>
            Users
          </button>
        </div>

        <div className="settings-content">
          {activeTab === "store" && renderStoreSettings()}
          {activeTab === "notifications" && renderNotificationSettings()}
          {activeTab === "payment" && renderPaymentSettings()}
          {activeTab === "users" && renderUserManagement()}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && <AddUserModal onSave={handleAddUser} onClose={() => setShowAddUserModal(false)} />}

      {/* Change Password Modal */}
      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
    </div>
  )
}

// Add User Modal Component
const AddUserModal = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Staff",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Add New User</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="Staff">Staff</option>
              <option value="Manager">Manager</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Change Password Modal Component
const ChangePasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match!")
      return
    }
    // Mock password change
    alert("Password changed successfully!")
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Change Password</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminSettings
