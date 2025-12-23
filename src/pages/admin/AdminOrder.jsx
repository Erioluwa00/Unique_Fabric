// import { useState, useEffect } from "react"
// import "./AdminOrder.css"

// const AdminOrder = () => {
//   const [orders, setOrders] = useState([])
//   const [filteredOrders, setFilteredOrders] = useState([])
//   const [selectedOrder, setSelectedOrder] = useState(null)
//   const [showOrderModal, setShowOrderModal] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [filterStatus, setFilterStatus] = useState("all")
//   const [loading, setLoading] = useState(true)
//   const [updatingStatus, setUpdatingStatus] = useState(null)
//   const [error, setError] = useState(null)

//   const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]

//   useEffect(() => {
//     fetchOrders()
//   }, [])

//   useEffect(() => {
//     filterOrders()
//   }, [orders, searchTerm, filterStatus])

//   const fetchOrders = async () => {
//     try {
//       setLoading(true)
//       setError(null)
//       const token = localStorage.getItem('fabricToken')
      
//       const response = await fetch('http://localhost:5000/api/orders', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       })
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`)
//       }

//       const data = await response.json()
      
//       if (data.success) {
//         setOrders(data.orders || [])
//       } else {
//         throw new Error(data.message || 'Failed to fetch orders')
//       }
//     } catch (error) {
//       setError(error.message)
//       setOrders([]) 
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filterOrders = () => {
//     let filtered = orders

//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (order) =>
//           order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     }

//     // Status filter
//     if (filterStatus !== "all") {
//       filtered = filtered.filter((order) => order.status === filterStatus)
//     }

//     setFilteredOrders(filtered)
//   }

//   const handleStatusChange = async (orderId, newStatus) => {
//     setUpdatingStatus(orderId)
//     try {
//       const token = localStorage.getItem('fabricToken')
//       const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           status: newStatus,
//           note: `Status changed to ${newStatus}`
//         })
//       })

//       if (!response.ok) {
//         throw new Error('Failed to update order status')
//       }

//       const data = await response.json()
//       if (data.success) {
//         setOrders(orders.map(order => 
//           order._id === orderId ? data.order : order
//         ))
//       }
//     } catch (error) {
//       alert('Failed to update order status')
//     } finally {
//       setUpdatingStatus(null)
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "pending":
//         return "#f59e0b"
//       case "processing":
//         return "#3b82f6"
//       case "shipped":
//         return "#8b5cf6"
//       case "delivered":
//         return "#10b981"
//       case "cancelled":
//         return "#ef4444"
//       default:
//         return "#6b7280"
//     }
//   }

//   const openOrderModal = (order) => {
//     setSelectedOrder(order)
//     setShowOrderModal(true)
//   }

//   const closeOrderModal = () => {
//     setSelectedOrder(null)
//     setShowOrderModal(false)
//   }

//   const getOrderStats = () => {
//     return {
//       total: orders.length,
//       pending: orders.filter((o) => o.status === "pending").length,
//       processing: orders.filter((o) => o.status === "processing").length,
//       shipped: orders.filter((o) => o.status === "shipped").length,
//       delivered: orders.filter((o) => o.status === "delivered").length,
//       cancelled: orders.filter((o) => o.status === "cancelled").length,
//     }
//   }

//   const stats = getOrderStats()

//   if (loading) {
//     return (
//       <div className="order-management">
//         <div className="loading">Loading orders...</div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="order-management">
//         <div className="error-message">
//           <h3>Error Loading Orders</h3>
//           <p>{error}</p>
//           <button onClick={fetchOrders} className="retry-btn">
//             Try Again
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="order-management">
//       <div className="order-header">
//         <div>
//           <h2>Order Management</h2>
//           <p>Track and manage customer orders</p>
//         </div>
//         <button onClick={fetchOrders} className="refresh-btn">
//           Refresh
//         </button>
//       </div>

//       {/* Order Stats */}
//       <div className="order-stats">
//         <div className="stat-item">
//           <span className="stat-number">{stats.total}</span>
//           <span className="stat-label">Total Orders</span>
//         </div>
//         <div className="stat-item">
//           <span className="stat-number" style={{ color: getStatusColor("pending") }}>
//             {stats.pending}
//           </span>
//           <span className="stat-label">Pending</span>
//         </div>
//         <div className="stat-item">
//           <span className="stat-number" style={{ color: getStatusColor("processing") }}>
//             {stats.processing}
//           </span>
//           <span className="stat-label">Processing</span>
//         </div>
//         <div className="stat-item">
//           <span className="stat-number" style={{ color: getStatusColor("shipped") }}>
//             {stats.shipped}
//           </span>
//           <span className="stat-label">Shipped</span>
//         </div>
//         <div className="stat-item">
//           <span className="stat-number" style={{ color: getStatusColor("delivered") }}>
//             {stats.delivered}
//           </span>
//           <span className="stat-label">Delivered</span>
//         </div>
//         <div className="stat-item">
//           <span className="stat-number" style={{ color: getStatusColor("cancelled") }}>
//             {stats.cancelled}
//           </span>
//           <span className="stat-label">Cancelled</span>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="order-filters">
//         <div className="search-box">
//           <input
//             type="text"
//             placeholder="Search orders, customer name, or email..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <div className="filter-group">
//           <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
//             <option value="all">All Statuses</option>
//             {orderStatuses.map((status) => (
//               <option key={status} value={status}>
//                 {status.charAt(0).toUpperCase() + status.slice(1)}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Orders Table */}
//       <div className="orders-table-container">
//         {orders.length === 0 ? (
//           <div className="no-orders">
//             <h3>No Orders Found</h3>
//             <p>There are no orders in the system yet.</p>
//             <p>Orders will appear here when customers place orders.</p>
//           </div>
//         ) : (
//           <table className="orders-table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Customer</th>
//                 <th>Date</th>
//                 <th>Items</th>
//                 <th>Total</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.map((order) => (
//                 <tr key={order._id}>
//                   <td className="order-id">{order.orderNumber}</td>
//                   <td>
//                     <div className="customer-info">
//                       <div className="customer-name">{order.user?.name || 'N/A'}</div>
//                       <div className="customer-email">{order.user?.email || 'N/A'}</div>
//                     </div>
//                   </td>
//                   <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
//                   <td>{order.orderItems?.length || 0} items</td>
//                   <td className="amount">${order.totalPrice?.toFixed(2) || '0.00'}</td>
//                   <td>
//                     <select
//                       className="status-select"
//                       value={order.status || 'pending'}
//                       onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                       style={{ color: getStatusColor(order.status) }}
//                       disabled={updatingStatus === order._id}
//                     >
//                       {orderStatuses.map((status) => (
//                         <option key={status} value={status}>
//                           {status.charAt(0).toUpperCase() + status.slice(1)}
//                         </option>
//                       ))}
//                     </select>
//                     {updatingStatus === order._id && <span className="updating">Updating...</span>}
//                   </td>
//                   <td>
//                     <button className="view-btn" onClick={() => openOrderModal(order)}>
//                       View Details
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {filteredOrders.length === 0 && orders.length > 0 && (
//         <div className="no-orders">
//           <p>No orders found matching your criteria.</p>
//         </div>
//       )}

//       {showOrderModal && selectedOrder && (
//         <OrderDetailsModal order={selectedOrder} onClose={closeOrderModal} />
//       )}
//     </div>
//   )
// }

// // Order Details Modal Component
// const OrderDetailsModal = ({ order, onClose }) => {
//   return (
//     <div className="modal-overlay">
//       <div className="modal order-modal">
//         <div className="modal-header">
//           <h3>Order Details - {order.orderNumber}</h3>
//           <button className="close-btn" onClick={onClose}>
//             ×
//           </button>
//         </div>

//         <div className="modal-content">
//           <div className="order-summary">
//             <div className="summary-row">
//               <span className="label">Status:</span>
//               <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
//                 {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//               </span>
//             </div>
//             <div className="summary-row">
//               <span className="label">Order Date:</span>
//               <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
//             </div>
//             <div className="summary-row">
//               <span className="label">Total Amount:</span>
//               <span className="amount">${order.totalPrice?.toFixed(2) || '0.00'}</span>
//             </div>
//             {order.trackingNumber && (
//               <div className="summary-row">
//                 <span className="label">Tracking Number:</span>
//                 <span className="tracking">{order.trackingNumber}</span>
//               </div>
//             )}
//           </div>

//           {/* Customer Information */}
//           <div className="section">
//             <h4>Customer Information</h4>
//             <div className="customer-details">
//               <div className="detail-row">
//                 <span className="label">Name:</span>
//                 <span>{order.user?.name || 'N/A'}</span>
//               </div>
//               <div className="detail-row">
//                 <span className="label">Email:</span>
//                 <span>{order.user?.email || 'N/A'}</span>
//               </div>
//               {order.shippingAddress?.phone && (
//                 <div className="detail-row">
//                   <span className="label">Phone:</span>
//                   <span>{order.shippingAddress.phone}</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Shipping Address */}
//           {order.shippingAddress && (
//             <div className="section">
//               <h4>Shipping Address</h4>
//               <div className="address">
//                 <p>{order.shippingAddress.fullName || ''}</p>
//                 <p>{order.shippingAddress.address || ''}</p>
//                 <p>
//                   {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
//                 </p>
//                 <p>{order.shippingAddress.country}</p>
//               </div>
//             </div>
//           )}

//           {/* Order Items */}
//           <div className="section">
//             <h4>Order Items</h4>
//             <div className="items-table">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Product</th>
//                     <th>Quantity</th>
//                     <th>Price</th>
//                     <th>Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {order.orderItems?.map((item, index) => (
//                     <tr key={index}>
//                       <td>{item.name}</td>
//                       <td>{item.quantity}</td>
//                       <td>${item.price?.toFixed(2) || '0.00'}</td>
//                       <td>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colSpan="3" className="total-label">
//                       Total:
//                     </td>
//                     <td className="total-amount">${order.totalPrice?.toFixed(2) || '0.00'}</td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>

//           {/* Status History */}
//           {order.statusHistory && order.statusHistory.length > 0 && (
//             <div className="section">
//               <h4>Status History</h4>
//               <div className="status-history">
//                 {order.statusHistory.map((history, index) => (
//                   <div key={index} className="history-item">
//                     <span className="history-status">{history.status}</span>
//                     <span className="history-date">
//                       {new Date(history.date).toLocaleDateString()}
//                     </span>
//                     {history.note && <span className="history-note">- {history.note}</span>}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// // Helper function for status colors
// const getStatusColor = (status) => {
//   switch (status) {
//     case "pending":
//       return "#f59e0b"
//     case "processing":
//       return "#3b82f6"
//     case "shipped":
//       return "#8b5cf6"
//     case "delivered":
//       return "#10b981"
//     case "cancelled":
//       return "#ef4444"
//     default:
//       return "#6b7280"
//   }
// }

// export default AdminOrder


import { useState, useEffect } from "react"
import "./AdminOrder.css"

const AdminOrder = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [error, setError] = useState(null)

  const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]

  // Define status hierarchy for one-way progression
  const statusHierarchy = ["pending", "processing", "shipped", "delivered"]
  // "cancelled" is a special terminal state

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, filterStatus])

  // Function to get available statuses based on current status
  const getAvailableStatuses = (currentStatus) => {
    // If already cancelled, can only stay cancelled
    if (currentStatus === "cancelled") {
      return ["cancelled"]
    }
    
    // If already delivered, can only stay delivered (can't change)
    if (currentStatus === "delivered") {
      return ["delivered"]
    }
    
    // Find current position in hierarchy
    const currentIndex = statusHierarchy.indexOf(currentStatus)
    
    if (currentIndex === -1) {
      // If current status not in hierarchy (e.g., cancelled), return all
      return [...statusHierarchy, "cancelled"]
    }
    
    // Get statuses from current position onward, plus cancelled
    const forwardStatuses = statusHierarchy.slice(currentIndex)
    return [...forwardStatuses, "cancelled"]
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('fabricToken')
      
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setOrders(data.orders || [])
      } else {
        throw new Error(data.message || 'Failed to fetch orders')
      }
    } catch (error) {
      setError(error.message)
      setOrders([]) 
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => order.status === filterStatus)
    }

    setFilteredOrders(filtered)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    const order = orders.find(o => o._id === orderId)
    if (!order) return

    const currentStatus = order.status
    
    // Prevent invalid status changes
    if (currentStatus === "cancelled") {
      alert("Cannot change status of a cancelled order.")
      return
    }
    
    if (currentStatus === "delivered") {
      alert("Cannot change status of a delivered order.")
      return
    }
    
    // Get available statuses for current status
    const availableStatuses = getAvailableStatuses(currentStatus)
    
    // Check if new status is available
    if (!availableStatuses.includes(newStatus)) {
      alert(`Cannot change status from ${currentStatus} to ${newStatus}. You can only move forward in the order flow.`)
      return
    }
    
    // Additional validation for cancelled status
    if (newStatus === "cancelled") {
      if (currentStatus === "delivered") {
        alert("Cannot cancel a delivered order.")
        return
      }
      // Optional: Add confirmation for cancellation
      if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
        return
      }
    }

    setUpdatingStatus(orderId)
    try {
      const token = localStorage.getItem('fabricToken')
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          note: `Status changed to ${newStatus}`
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      const data = await response.json()
      if (data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? data.order : order
        ))
      }
    } catch (error) {
      alert('Failed to update order status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f59e0b"
      case "processing":
        return "#3b82f6"
      case "shipped":
        return "#8b5cf6"
      case "delivered":
        return "#10b981"
      case "cancelled":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const openOrderModal = (order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const closeOrderModal = () => {
    setSelectedOrder(null)
    setShowOrderModal(false)
  }

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    }
  }

  const stats = getOrderStats()

  if (loading) {
    return (
      <div className="order-management">
        <div className="loading">Loading orders...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="order-management">
        <div className="error-message">
          <h3>Error Loading Orders</h3>
          <p>{error}</p>
          <button onClick={fetchOrders} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="order-management">
      <div className="order-header">
        <div>
          <h2>Order Management</h2>
          <p>Track and manage customer orders</p>
        </div>
        <button onClick={fetchOrders} className="refresh-btn">
          Refresh
        </button>
      </div>

      {/* Order Stats */}
      <div className="order-stats">
        <div className="adminOrder-stat-item">
          <span className="adminOrder-stat-number">{stats.total}</span>
          <span className="adminOrder-stat-label">Total Orders</span>
        </div>
        <div className="adminOrder-stat-item">
          <span className="adminOrder-stat-number" style={{ color: getStatusColor("pending") }}>
            {stats.pending}
          </span>
          <span className="adminOrder-stat-label">Pending</span>
        </div>
        <div className="adminOrder-stat-item">
          <span className="adminOrder-stat-number" style={{ color: getStatusColor("processing") }}>
            {stats.processing}
          </span>
          <span className="adminOrder-stat-label">Processing</span>
        </div>
        <div className="adminOrder-stat-item">
          <span className="adminOrder-stat-number" style={{ color: getStatusColor("shipped") }}>
            {stats.shipped}
          </span>
          <span className="adminOrder-stat-label">Shipped</span>
        </div>
        <div className="adminOrder-stat-item">
          <span className="adminOrder-stat-number" style={{ color: getStatusColor("delivered") }}>
            {stats.delivered}
          </span>
          <span className="adminOrder-stat-label">Delivered</span>
        </div>
        <div className="adminOrder-stat-item">
          <span className="adminOrder-stat-number" style={{ color: getStatusColor("cancelled") }}>
            {stats.cancelled}
          </span>
          <span className="adminOrder-stat-label">Cancelled</span>
        </div>
      </div>

      {/* Filters */}
      <div className="order-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search orders, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        {orders.length === 0 ? (
          <div className="no-orders">
            <h3>No Orders Found</h3>
            <p>There are no orders in the system yet.</p>
            <p>Orders will appear here when customers place orders.</p>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const availableStatuses = getAvailableStatuses(order.status)
                const isDisabled = order.status === "cancelled" || order.status === "delivered"
                
                return (
                  <tr key={order._id}>
                    <td className="order-id">{order.orderNumber}</td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">{order.user?.name || 'N/A'}</div>
                        <div className="customer-email">{order.user?.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>{order.orderItems?.length || 0} items</td>
                    <td className="amount">${order.totalPrice?.toFixed(2) || '0.00'}</td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{ color: getStatusColor(order.status) }}
                        disabled={updatingStatus === order._id || isDisabled}
                      >
                        {availableStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                      {updatingStatus === order._id && <span className="updating">Updating...</span>}
                    </td>
                    <td>
                      <button className="view-btn" onClick={() => openOrderModal(order)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {filteredOrders.length === 0 && orders.length > 0 && (
        <div className="no-orders">
          <p>No orders found matching your criteria.</p>
        </div>
      )}

      {showOrderModal && selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={closeOrderModal} 
          getStatusColor={getStatusColor}
        />
      )}
    </div>
  )
}

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose, getStatusColor }) => {
  return (
    <div className="modal-overlay">
      <div className="modal order-modal">
        <div className="modal-header">
          <h3>Order Details - {order.orderNumber}</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="order-summary">
            <div className="summary-row">
              <span className="label">Status:</span>
              <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="summary-row">
              <span className="label">Order Date:</span>
              <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="summary-row">
              <span className="label">Total Amount:</span>
              <span className="amount">${order.totalPrice?.toFixed(2) || '0.00'}</span>
            </div>
            {order.trackingNumber && (
              <div className="summary-row">
                <span className="label">Tracking Number:</span>
                <span className="tracking">{order.trackingNumber}</span>
              </div>
            )}
          </div>

          {/* Customer Information */}
          <div className="section">
            <h4>Customer Information</h4>
            <div className="customer-details">
              <div className="detail-row">
                <span className="label">Name:</span>
                <span>{order.user?.name || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span>{order.user?.email || 'N/A'}</span>
              </div>
              {order.shippingAddress?.phone && (
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span>{order.shippingAddress.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="section">
              <h4>Shipping Address</h4>
              <div className="address">
                <p>{order.shippingAddress.fullName || ''}</p>
                <p>{order.shippingAddress.address || ''}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="section">
            <h4>Order Items</h4>
            <div className="items-table">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price?.toFixed(2) || '0.00'}</td>
                      <td>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="total-label">
                      Total:
                    </td>
                    <td className="total-amount">${order.totalPrice?.toFixed(2) || '0.00'}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Status History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="section">
              <h4>Status History</h4>
              <div className="status-history">
                {order.statusHistory.map((history, index) => (
                  <div key={index} className="history-item">
                    <span className="history-status">{history.status}</span>
                    <span className="history-date">
                      {new Date(history.date).toLocaleDateString()}
                    </span>
                    {history.note && <span className="history-note">- {history.note}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminOrder