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


// import { useState, useEffect } from "react"
// import "./AdminSettings.css"

// const AdminSettings = () => {
//   const [activeTab, setActiveTab] = useState("general")
//   const [settings, setSettings] = useState({
//     general: {
//       siteName: "Unique Fabrics",
//       siteDescription: "Premium quality fabrics for all your creative needs",
//       siteUrl: "https://uniquefabrics.com",
//       contactEmail: "info@uniquefabrics.com",
//       contactPhone: "+1 (555) 123-4567",
//       businessHours: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM",
//       timezone: "America/New_York",
//       dateFormat: "MM/DD/YYYY",
//       itemsPerPage: 20,
//     },
//     store: {
//       name: "Unique Fabrics",
//       description: "Premium quality fabrics for all your creative needs",
//       email: "info@uniquefabrics.com",
//       phone: "+1 (555) 123-4567",
//       address: "123 Fabric Street, Textile City, TC 12345",
//       logo: "/placeholder.svg?key=logo",
//       website: "https://uniquefabrics.com",
//       socialMedia: {
//         facebook: "https://facebook.com/uniquefabrics",
//         instagram: "https://instagram.com/uniquefabrics",
//         twitter: "https://twitter.com/uniquefabrics",
//         pinterest: "https://pinterest.com/uniquefabrics",
//       },
//     },
//     notifications: {
//       lowStockAlerts: true,
//       newOrderAlerts: true,
//       newUserRegistration: true,
//       customerReviews: true,
//       emailNotifications: true,
//       lowStockThreshold: 10,
//     },
//     security: {
//       require2FA: false,
//       sessionTimeout: 30, // minutes
//       maxLoginAttempts: 5,
//       passwordExpiryDays: 90,
//       ipWhitelist: "",
//       maintenanceMode: false,
//     },
//     users: [
//       {
//         id: 1,
//         name: "Admin User",
//         email: "admin@uniquefabrics.com",
//         role: "Super Admin",
//         status: "Active",
//         lastLogin: "2024-01-15",
//         permissions: ["all"],
//       },
//       {
//         id: 2,
//         name: "Staff User",
//         email: "staff@uniquefabrics.com",
//         role: "Staff",
//         status: "Active",
//         lastLogin: "2024-01-14",
//         permissions: ["view", "edit"],
//       },
//       {
//         id: 3,
//         name: "Manager User",
//         email: "manager@uniquefabrics.com",
//         role: "Manager",
//         status: "Inactive",
//         lastLogin: "2024-01-10",
//         permissions: ["view", "edit", "delete"],
//       },
//     ],
//     roles: [
//       {
//         id: 1,
//         name: "Super Admin",
//         description: "Full system access",
//         permissions: ["all"],
//         userCount: 1,
//       },
//       {
//         id: 2,
//         name: "Manager",
//         description: "Manage products, orders, and staff",
//         permissions: ["view", "edit", "delete", "manage_users"],
//         userCount: 2,
//       },
//       {
//         id: 3,
//         name: "Staff",
//         description: "View and edit products/orders",
//         permissions: ["view", "edit"],
//         userCount: 5,
//       },
//       {
//         id: 4,
//         name: "Content Manager",
//         description: "Manage blog and content",
//         permissions: ["view", "edit", "publish"],
//         userCount: 1,
//       },
//     ],
//     activityLogs: [
//       {
//         id: 1,
//         user: "Admin User",
//         action: "Logged in",
//         timestamp: "2024-01-15 10:30:00",
//         ipAddress: "192.168.1.1",
//       },
//       {
//         id: 2,
//         user: "Staff User",
//         action: "Updated product stock",
//         details: "Product ID: 12345, New stock: 100",
//         timestamp: "2024-01-15 09:15:00",
//         ipAddress: "192.168.1.2",
//       },
//       {
//         id: 3,
//         user: "Manager User",
//         action: "Created new user account",
//         details: "Email: john@example.com, Role: Staff",
//         timestamp: "2024-01-14 14:20:00",
//         ipAddress: "192.168.1.3",
//       },
//     ],
//   })

//   const [showAddUserModal, setShowAddUserModal] = useState(false)
//   const [showPasswordModal, setShowPasswordModal] = useState(false)
//   const [showAddRoleModal, setShowAddRoleModal] = useState(false)
//   const [unsavedChanges, setUnsavedChanges] = useState(false)

//   const handleSettingChange = (section, field, value) => {
//     setSettings((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value,
//       },
//     }))
//     setUnsavedChanges(true)
//   }

//   const handleNestedSettingChange = (section, parent, field, value) => {
//     setSettings((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [parent]: {
//           ...prev[section][parent],
//           [field]: value,
//         },
//       },
//     }))
//     setUnsavedChanges(true)
//   }

//   const handleSaveSettings = () => {
//     // Save to localStorage for demo purposes
//     localStorage.setItem('adminSettings', JSON.stringify(settings));
//     setTimeout(() => {
//       setUnsavedChanges(false)
//       alert("Settings saved successfully!")
//     }, 500)
//   }

//   // Load settings from localStorage on component mount
//   useEffect(() => {
//     const savedSettings = localStorage.getItem('adminSettings');
//     if (savedSettings) {
//       setSettings(JSON.parse(savedSettings));
//     }
//   }, []);

//   const handleAddUser = (userData) => {
//     const newUser = {
//       ...userData,
//       id: Math.max(...settings.users.map((u) => u.id)) + 1,
//       lastLogin: "Never",
//       status: "Active",
//       permissions: getDefaultPermissions(userData.role),
//     }
//     setSettings((prev) => ({
//       ...prev,
//       users: [...prev.users, newUser],
//     }))
//     setShowAddUserModal(false)
//     setUnsavedChanges(true)
//   }

//   const handleAddRole = (roleData) => {
//     const newRole = {
//       ...roleData,
//       id: Math.max(...settings.roles.map((r) => r.id)) + 1,
//       userCount: 0,
//     }
//     setSettings((prev) => ({
//       ...prev,
//       roles: [...prev.roles, newRole],
//     }))
//     setShowAddRoleModal(false)
//     setUnsavedChanges(true)
//   }

//   const handleDeleteUser = (userId) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       setSettings((prev) => ({
//         ...prev,
//         users: prev.users.filter((u) => u.id !== userId),
//       }))
//       setUnsavedChanges(true)
//     }
//   }

//   const handleToggleUserStatus = (userId) => {
//     setSettings((prev) => ({
//       ...prev,
//       users: prev.users.map((u) =>
//         u.id === userId ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u,
//       ),
//     }))
//     setUnsavedChanges(true)
//   }

//   const handleDeleteRole = (roleId) => {
//     if (window.confirm("Are you sure you want to delete this role?")) {
//       setSettings((prev) => ({
//         ...prev,
//         roles: prev.roles.filter((r) => r.id !== roleId),
//       }))
//       setUnsavedChanges(true)
//     }
//   }

//   const getDefaultPermissions = (role) => {
//     const roleData = settings.roles.find(r => r.name === role);
//     return roleData ? roleData.permissions : ["view"];
//   }

//   const renderGeneralSettings = () => (
//     <div className="settings-section">
//       <h3>General Settings</h3>
//       <div className="settings-form">
//         <div className="form-row">
//           <div className="form-group">
//             <label>Site Name</label>
//             <input
//               type="text"
//               value={settings.general.siteName}
//               onChange={(e) => handleSettingChange("general", "siteName", e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Site URL</label>
//             <input
//               type="url"
//               value={settings.general.siteUrl}
//               onChange={(e) => handleSettingChange("general", "siteUrl", e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Site Description</label>
//           <textarea
//             value={settings.general.siteDescription}
//             onChange={(e) => handleSettingChange("general", "siteDescription", e.target.value)}
//             rows="3"
//           />
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Contact Email</label>
//             <input
//               type="email"
//               value={settings.general.contactEmail}
//               onChange={(e) => handleSettingChange("general", "contactEmail", e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Contact Phone</label>
//             <input
//               type="tel"
//               value={settings.general.contactPhone}
//               onChange={(e) => handleSettingChange("general", "contactPhone", e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Business Hours</label>
//             <input
//               type="text"
//               value={settings.general.businessHours}
//               onChange={(e) => handleSettingChange("general", "businessHours", e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Timezone</label>
//             <select
//               value={settings.general.timezone}
//               onChange={(e) => handleSettingChange("general", "timezone", e.target.value)}
//             >
//               <option value="America/New_York">Eastern Time (ET)</option>
//               <option value="America/Chicago">Central Time (CT)</option>
//               <option value="America/Denver">Mountain Time (MT)</option>
//               <option value="America/Los_Angeles">Pacific Time (PT)</option>
//             </select>
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Date Format</label>
//             <select
//               value={settings.general.dateFormat}
//               onChange={(e) => handleSettingChange("general", "dateFormat", e.target.value)}
//             >
//               <option value="MM/DD/YYYY">MM/DD/YYYY</option>
//               <option value="DD/MM/YYYY">DD/MM/YYYY</option>
//               <option value="YYYY-MM-DD">YYYY-MM-DD</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label>Items Per Page</label>
//             <input
//               type="number"
//               min="5"
//               max="100"
//               value={settings.general.itemsPerPage}
//               onChange={(e) => handleSettingChange("general", "itemsPerPage", parseInt(e.target.value))}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )

//   const renderStoreSettings = () => (
//     <div className="settings-section">
//       <h3>Store Information</h3>
//       <div className="settings-form">
//         <div className="form-row">
//           <div className="form-group">
//             <label>Store Name</label>
//             <input
//               type="text"
//               value={settings.store.name}
//               onChange={(e) => handleSettingChange("store", "name", e.target.value)}
//             />
//             <p className="field-description">Will appear in footer and emails</p>
//           </div>
//           <div className="form-group">
//             <label>Email Address</label>
//             <input
//               type="email"
//               value={settings.store.email}
//               onChange={(e) => handleSettingChange("store", "email", e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Store Description</label>
//           <textarea
//             value={settings.store.description}
//             onChange={(e) => handleSettingChange("store", "description", e.target.value)}
//             rows="3"
//           />
//           <p className="field-description">Appears in footer and meta description</p>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Phone Number</label>
//             <input
//               type="tel"
//               value={settings.store.phone}
//               onChange={(e) => handleSettingChange("store", "phone", e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Website URL</label>
//             <input
//               type="url"
//               value={settings.store.website}
//               onChange={(e) => handleSettingChange("store", "website", e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Store Address</label>
//           <textarea
//             value={settings.store.address}
//             onChange={(e) => handleSettingChange("store", "address", e.target.value)}
//             rows="2"
//           />
//         </div>

//         <div className="form-group">
//           <label>Logo URL</label>
//           <input
//             type="url"
//             value={settings.store.logo}
//             onChange={(e) => handleSettingChange("store", "logo", e.target.value)}
//           />
//         </div>

//         <h4>Social Media Links (Used in Footer)</h4>
//         <div className="form-row">
//           <div className="form-group">
//             <label>Facebook</label>
//             <input
//               type="url"
//               value={settings.store.socialMedia.facebook}
//               onChange={(e) => handleNestedSettingChange("store", "socialMedia", "facebook", e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Instagram</label>
//             <input
//               type="url"
//               value={settings.store.socialMedia.instagram}
//               onChange={(e) => handleNestedSettingChange("store", "socialMedia", "instagram", e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="form-row">
//           <div className="form-group">
//             <label>Twitter</label>
//             <input
//               type="url"
//               value={settings.store.socialMedia.twitter}
//               onChange={(e) => handleNestedSettingChange("store", "socialMedia", "twitter", e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Pinterest</label>
//             <input
//               type="url"
//               value={settings.store.socialMedia.pinterest}
//               onChange={(e) => handleNestedSettingChange("store", "socialMedia", "pinterest", e.target.value)}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )

//   const renderNotificationSettings = () => (
//     <div className="settings-section">
//       <h3>Notification Preferences</h3>
//       <div className="settings-form">
//         <div className="checkbox-group">
//           <label className="checkbox-label">
//             <input
//               type="checkbox"
//               checked={settings.notifications.lowStockAlerts}
//               onChange={(e) => handleSettingChange("notifications", "lowStockAlerts", e.target.checked)}
//             />
//             <span>Low Stock Alerts</span>
//           </label>
//           <p className="checkbox-description">Get notified when products are running low</p>
//         </div>

//         <div className="checkbox-group">
//           <label className="checkbox-label">
//             <input
//               type="checkbox"
//               checked={settings.notifications.newOrderAlerts}
//               onChange={(e) => handleSettingChange("notifications", "newOrderAlerts", e.target.checked)}
//             />
//             <span>New Order Alerts</span>
//           </label>
//           <p className="checkbox-description">Get notified when new orders are placed</p>
//         </div>

//         <div className="checkbox-group">
//           <label className="checkbox-label">
//             <input
//               type="checkbox"
//               checked={settings.notifications.newUserRegistration}
//               onChange={(e) => handleSettingChange("notifications", "newUserRegistration", e.target.checked)}
//             />
//             <span>New User Registration</span>
//           </label>
//           <p className="checkbox-description">Get notified when new users register</p>
//         </div>

//         <div className="checkbox-group">
//           <label className="checkbox-label">
//             <input
//               type="checkbox"
//               checked={settings.notifications.customerReviews}
//               onChange={(e) => handleSettingChange("notifications", "customerReviews", e.target.checked)}
//             />
//             <span>Customer Reviews</span>
//           </label>
//           <p className="checkbox-description">Get notified when customers leave reviews</p>
//         </div>

//         <div className="checkbox-group">
//           <label className="checkbox-label">
//             <input
//               type="checkbox"
//               checked={settings.notifications.emailNotifications}
//               onChange={(e) => handleSettingChange("notifications", "emailNotifications", e.target.checked)}
//             />
//             <span>Email Notifications</span>
//           </label>
//           <p className="checkbox-description">Receive notifications via email</p>
//         </div>

//         <div className="form-group">
//           <label>Low Stock Threshold</label>
//           <input
//             type="number"
//             min="1"
//             max="100"
//             value={settings.notifications.lowStockThreshold}
//             onChange={(e) => handleSettingChange("notifications", "lowStockThreshold", Number.parseInt(e.target.value))}
//           />
//           <p className="field-description">Alert when stock falls below this number</p>
//         </div>
//       </div>
//     </div>
//   )

//   const renderSecuritySettings = () => (
//     <div className="settings-section">
//       <h3>Security Settings</h3>
//       <div className="settings-form">
//         <div className="checkbox-group">
//           <label className="checkbox-label">
//             <input
//               type="checkbox"
//               checked={settings.security.require2FA}
//               onChange={(e) => handleSettingChange("security", "require2FA", e.target.checked)}
//             />
//             <span>Require Two-Factor Authentication</span>
//           </label>
//           <p className="checkbox-description">Enable 2FA for all admin users</p>
//         </div>

//         <div className="form-group">
//           <label>Session Timeout (minutes)</label>
//           <input
//             type="number"
//             min="5"
//             max="480"
//             value={settings.security.sessionTimeout}
//             onChange={(e) => handleSettingChange("security", "sessionTimeout", Number.parseInt(e.target.value))}
//           />
//           <p className="field-description">Auto-logout after inactivity</p>
//         </div>

//         <div className="form-group">
//           <label>Max Login Attempts</label>
//           <input
//             type="number"
//             min="1"
//             max="10"
//             value={settings.security.maxLoginAttempts}
//             onChange={(e) => handleSettingChange("security", "maxLoginAttempts", Number.parseInt(e.target.value))}
//           />
//           <p className="field-description">Lock account after failed attempts</p>
//         </div>

//         <div className="form-group">
//           <label>Password Expiry (days)</label>
//           <input
//             type="number"
//             min="0"
//             max="365"
//             value={settings.security.passwordExpiryDays}
//             onChange={(e) => handleSettingChange("security", "passwordExpiryDays", Number.parseInt(e.target.value))}
//           />
//           <p className="field-description">0 = Never expire</p>
//         </div>

//         <div className="form-group">
//           <label>IP Whitelist (optional)</label>
//           <textarea
//             value={settings.security.ipWhitelist}
//             onChange={(e) => handleSettingChange("security", "ipWhitelist", e.target.value)}
//             rows="3"
//             placeholder="Enter IP addresses separated by commas"
//           />
//           <p className="field-description">Restrict admin access to specific IPs</p>
//         </div>

//         <div className="checkbox-group">
//           <label className="checkbox-label">
//             <input
//               type="checkbox"
//               checked={settings.security.maintenanceMode}
//               onChange={(e) => handleSettingChange("security", "maintenanceMode", e.target.checked)}
//             />
//             <span>Maintenance Mode</span>
//           </label>
//           <p className="checkbox-description">Enable to take site offline for maintenance</p>
//         </div>
//       </div>
//     </div>
//   )

//   const renderUserManagement = () => (
//     <div className="settings-section">
//       <div className="section-header">
//         <h3>User Management</h3>
//         <button className="add-user-btn" onClick={() => setShowAddUserModal(true)}>
//           + Add User
//         </button>
//       </div>

//       <div className="users-table">
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Status</th>
//               <th>Last Login</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {settings.users.map((user) => (
//               <tr key={user.id}>
//                 <td className="user-name">{user.name}</td>
//                 <td className="user-email">{user.email}</td>
//                 <td className="user-role">{user.role}</td>
//                 <td>
//                   <span className={`status-badge ${user.status.toLowerCase()}`}>{user.status}</span>
//                 </td>
//                 <td className="last-login">{user.lastLogin}</td>
//                 <td className="user-actions">
//                   <button
//                     className="toggle-status-btn"
//                     onClick={() => handleToggleUserStatus(user.id)}
//                     title={user.status === "Active" ? "Deactivate" : "Activate"}
//                   >
//                     {user.status === "Active" ? "Deactivate" : "Activate"}
//                   </button>
//                   <button className="edit-user-btn">Edit</button>
//                   <button className="delete-user-btn" onClick={() => handleDeleteUser(user.id)} title="Delete User">
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="section-header">
//         <h3>Role Management</h3>
//         <button className="add-user-btn" onClick={() => setShowAddRoleModal(true)}>
//           + Add Role
//         </button>
//       </div>

//       <div className="roles-grid">
//         {settings.roles.map((role) => (
//           <div key={role.id} className="role-card">
//             <div className="role-header">
//               <h4>{role.name}</h4>
//               <span className="user-count">{role.userCount} users</span>
//             </div>
//             <p className="role-description">{role.description}</p>
//             <div className="role-permissions">
//               {role.permissions.map((perm, index) => (
//                 <span key={index} className="permission-tag">{perm}</span>
//               ))}
//             </div>
//             <div className="role-actions">
//               <button className="edit-role-btn">Edit</button>
//               <button className="delete-role-btn" onClick={() => handleDeleteRole(role.id)}>Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="password-section">
//         <h3>Activity Logs</h3>
//         <div className="activity-logs">
//           {settings.activityLogs.map((log) => (
//             <div key={log.id} className="log-entry">
//               <div className="log-header">
//                 <span className="log-user">{log.user}</span>
//                 <span className="log-time">{log.timestamp}</span>
//               </div>
//               <div className="log-action">{log.action}</div>
//               {log.details && <div className="log-details">{log.details}</div>}
//               <div className="log-footer">
//                 <span className="log-ip">IP: {log.ipAddress}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//         <button className="view-all-logs-btn">View All Activity Logs</button>
//       </div>
//     </div>
//   )

//   return (
//     <div className="settings">
//       <div className="settings-header">
//         <div>
//           <h2>Admin Settings & Configuration</h2>
//           <p>Manage your store settings, users, and security preferences</p>
//         </div>
//         {unsavedChanges && (
//           <button className="save-btn" onClick={handleSaveSettings}>
//             Save Changes
//           </button>
//         )}
//       </div>

//       <div className="settings-container">
//         <div className="settings-tabs">
//           <button className={activeTab === "general" ? "tab active" : "tab"} onClick={() => setActiveTab("general")}>
//             <i className="tab-icon">⚙️</i> General
//           </button>
//           <button className={activeTab === "store" ? "tab active" : "tab"} onClick={() => setActiveTab("store")}>
//             <i className="tab-icon">🏪</i> Store Info
//           </button>
//           <button className={activeTab === "notifications" ? "tab active" : "tab"} onClick={() => setActiveTab("notifications")}>
//             <i className="tab-icon">🔔</i> Notifications
//           </button>
//           <button className={activeTab === "security" ? "tab active" : "tab"} onClick={() => setActiveTab("security")}>
//             <i className="tab-icon">🔒</i> Security
//           </button>
//           <button className={activeTab === "users" ? "tab active" : "tab"} onClick={() => setActiveTab("users")}>
//             <i className="tab-icon">👥</i> Users & Roles
//           </button>
//         </div>

//         <div className="settings-content">
//           {activeTab === "general" && renderGeneralSettings()}
//           {activeTab === "store" && renderStoreSettings()}
//           {activeTab === "notifications" && renderNotificationSettings()}
//           {activeTab === "security" && renderSecuritySettings()}
//           {activeTab === "users" && renderUserManagement()}
//         </div>
//       </div>

//       {/* Add User Modal */}
//       {showAddUserModal && <AddUserModal onSave={handleAddUser} onClose={() => setShowAddUserModal(false)} roles={settings.roles} />}

//       {/* Add Role Modal */}
//       {showAddRoleModal && <AddRoleModal onSave={handleAddRole} onClose={() => setShowAddRoleModal(false)} />}

//       {/* Change Password Modal */}
//       {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
//     </div>
//   )
// }

// // Add User Modal Component
// const AddUserModal = ({ onSave, onClose, roles }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     role: "Staff",
//   })

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     })
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     onSave(formData)
//   }

//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <div className="modal-header">
//           <h3>Add New User</h3>
//           <button className="close-btn" onClick={onClose}>
//             ×
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="modal-form">
//           <div className="form-group">
//             <label>Full Name</label>
//             <input type="text" name="name" value={formData.name} onChange={handleChange} required />
//           </div>

//           <div className="form-group">
//             <label>Email Address</label>
//             <input type="email" name="email" value={formData.email} onChange={handleChange} required />
//           </div>

//           <div className="form-group">
//             <label>Role</label>
//             <select name="role" value={formData.role} onChange={handleChange} required>
//               {roles.map((role) => (
//                 <option key={role.id} value={role.name}>{role.name}</option>
//               ))}
//             </select>
//           </div>

//           <div className="modal-actions">
//             <button type="button" className="cancel-btn" onClick={onClose}>
//               Cancel
//             </button>
//             <button type="submit" className="save-btn">
//               Add User
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// // Add Role Modal Component
// const AddRoleModal = ({ onSave, onClose }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     permissions: ["view"],
//   })

//   const permissionsOptions = [
//     "view", "edit", "delete", "create", "manage_users", 
//     "manage_products", "manage_orders", "manage_settings", "all"
//   ]

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     })
//   }

//   const handlePermissionToggle = (permission) => {
//     setFormData(prev => ({
//       ...prev,
//       permissions: prev.permissions.includes(permission)
//         ? prev.permissions.filter(p => p !== permission)
//         : [...prev.permissions, permission]
//     }))
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     onSave(formData)
//   }

//   return (
//     <div className="modal-overlay">
//       <div className="modal modal-lg">
//         <div className="modal-header">
//           <h3>Add New Role</h3>
//           <button className="close-btn" onClick={onClose}>
//             ×
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="modal-form">
//           <div className="form-group">
//             <label>Role Name</label>
//             <input type="text" name="name" value={formData.name} onChange={handleChange} required />
//           </div>

//           <div className="form-group">
//             <label>Description</label>
//             <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required />
//           </div>

//           <div className="form-group">
//             <label>Permissions</label>
//             <div className="permissions-grid">
//               {permissionsOptions.map(permission => (
//                 <label key={permission} className="permission-checkbox">
//                   <input
//                     type="checkbox"
//                     checked={formData.permissions.includes(permission)}
//                     onChange={() => handlePermissionToggle(permission)}
//                   />
//                   <span>{permission}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="modal-actions">
//             <button type="button" className="cancel-btn" onClick={onClose}>
//               Cancel
//             </button>
//             <button type="submit" className="save-btn">
//               Create Role
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// // Change Password Modal Component (same as before)
// const ChangePasswordModal = ({ onClose }) => {
//   const [formData, setFormData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   })

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     })
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (formData.newPassword !== formData.confirmPassword) {
//       alert("New passwords do not match!")
//       return
//     }
//     alert("Password changed successfully!")
//     onClose()
//   }

//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <div className="modal-header">
//           <h3>Change Password</h3>
//           <button className="close-btn" onClick={onClose}>
//             ×
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="modal-form">
//           <div className="form-group">
//             <label>Current Password</label>
//             <input
//               type="password"
//               name="currentPassword"
//               value={formData.currentPassword}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>New Password</label>
//             <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
//           </div>

//           <div className="form-group">
//             <label>Confirm New Password</label>
//             <input
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="modal-actions">
//             <button type="button" className="cancel-btn" onClick={onClose}>
//               Cancel
//             </button>
//             <button type="submit" className="save-btn">
//               Change Password
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default AdminSettings