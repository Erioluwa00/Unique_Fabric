import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Package,
  Hourglass,
  AlertTriangle,
  BarChart2,
  RefreshCw,
} from "lucide-react"; 
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalFabrics: 0,
    inStock: 0,
    outOfStock: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockItems: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Enhanced protection - redirect if not admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user?.isAdmin) {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem('fabricToken');
      
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const productsResponse = await fetch('http://localhost:5000/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!productsResponse.ok) {
        if (productsResponse.status === 401 || productsResponse.status === 403) {
          setError("Authentication failed. Please login again.");
          return;
        }
        throw new Error('Failed to fetch products');
      }
      
      const productsData = await productsResponse.json();
      
      let products = [];
      if (Array.isArray(productsData)) {
        products = productsData;
      } else if (productsData.products && Array.isArray(productsData.products)) {
        products = productsData.products;
      } else if (productsData.data && Array.isArray(productsData.data)) {
        products = productsData.data;
      } else if (productsData.success && Array.isArray(productsData.products)) {
        products = productsData.products;
      }

      // Fetch orders from database
      const ordersResponse = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      let orders = [];
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        
        // Handle different orders response structures
        if (Array.isArray(ordersData)) {
          orders = ordersData;
        } else if (ordersData.orders && Array.isArray(ordersData.orders)) {
          orders = ordersData.orders;
        } else if (ordersData.data && Array.isArray(ordersData.data)) {
          orders = ordersData.data;
        } else if (ordersData.success && Array.isArray(ordersData.orders)) {
          orders = ordersData.orders;
        }
      } else if (ordersResponse.status === 401 || ordersResponse.status === 403) {
        // Continue with just product data
      }

      // Calculate stats from products
      const totalFabrics = products.length;
      const inStock = products.filter(product => 
        product.stock > 0 || product.inStock === true || product.quantity > 0
      ).length;
      const outOfStock = products.filter(product => 
        product.stock === 0 || product.inStock === false || product.quantity === 0
      ).length;
      const lowStockItems = products.filter(product => {
        const stock = product.stock || product.quantity || 0;
        return stock > 0 && stock <= 10;
      }).length;

      // Calculate order stats from real data
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(order => 
        order.status === 'pending' || order.orderStatus === 'pending'
      ).length;

      // Get recent orders (last 5 orders)
      const sortedOrders = orders
        .sort((a, b) => new Date(b.createdAt || b.orderDate || b.date) - new Date(a.createdAt || a.orderDate || a.date))
        .slice(0, 5)
        .map(order => {
          // Extract customer name from different possible fields
          const customerName = order.user?.name || 
                             order.customer?.name || 
                             order.customerName || 
                             order.user?.username || 
                             'Unknown Customer';
          
          // Extract order number from different possible fields
          const orderNumber = order.orderNumber || 
                            order.orderId || 
                            `ORD-${order._id ? order._id.slice(-6).toUpperCase() : order.id ? order.id.slice(-6).toUpperCase() : 'UNKNOWN'}`;
          
          // Extract total price from different possible fields
          const totalAmount = order.totalPrice || order.amount || order.total || 0;
          
          return {
            id: order._id || order.id,
            orderNumber: orderNumber,
            customer: customerName,
            amount: `$${parseFloat(totalAmount).toFixed(2)}`,
            status: order.status || order.orderStatus || 'pending',
            date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 
                  order.orderDate ? new Date(order.orderDate).toLocaleDateString() :
                  order.date ? new Date(order.date).toLocaleDateString() : 'Unknown Date'
          };
        });

      // Get low stock products (stock <= 10)
      const lowStockProducts = products
        .filter(product => {
          const stock = product.stock || product.quantity || 0;
          return stock > 0 && stock <= 10;
        })
        .slice(0, 10)
        .map(product => ({
          id: product._id || product.id,
          name: product.name || product.productName || 'Unknown Product',
          stock: product.stock || product.quantity || 0,
          threshold: 10,
          category: product.category || 'Uncategorized',
          price: product.price || product.productPrice || 0
        }));

      setStats({
        totalFabrics,
        inStock,
        outOfStock,
        totalOrders,
        pendingOrders,
        lowStockItems: lowStockProducts.length,
      });

      setRecentOrders(sortedOrders);
      setLowStockAlerts(lowStockProducts);

    } catch (err) {
      setError("Failed to load dashboard data: " + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Handle restock action
  const handleRestock = async (productId) => {
    try {
      const token = localStorage.getItem('fabricToken');
      const newStock = prompt('Enter new stock quantity:');
      
      if (newStock && !isNaN(newStock)) {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ stock: parseInt(newStock) })
        });

        if (response.ok) {
          alert('Stock updated successfully!');
          fetchDashboardData(); // Refresh data
        } else {
          throw new Error('Failed to update stock');
        }
      }
    } catch (err) {
      alert("Failed to restock product");
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "#6b7280";
    switch (status.toLowerCase()) {
      case "pending":
        return "#f59e0b";
      case "processing":
        return "#3b82f6";
      case "shipped":
        return "#8b5cf6";
      case "delivered":
        return "#10b981";
      case "completed":
        return "#10b981";
      case "cancelled":
        return "#ef4444";
      case "canceled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Early return if not admin (additional protection)
  if (!user?.isAdmin) {
    return (
      <div className="dashboard">
        <div className="error-message">
          <h3>Access Denied</h3>
          <p>You need administrator privileges to access this page.</p>
          <p>Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Dashboard Overview</h2>
          <p>Welcome to your fabric store management system</p>
        </div>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Dashboard Overview</h2>
          <p>Welcome to your fabric store management system</p>
        </div>
        <button 
          onClick={handleRefresh} 
          className="refresh-btn"
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <BarChart2 size={32} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalFabrics}</h3>
            <p>Total Fabrics</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle2 size={32} />
          </div>
          <div className="stat-content">
            <h3>{stats.inStock}</h3>
            <p>In Stock</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <XCircle size={32} />
          </div>
          <div className="stat-content">
            <h3>{stats.outOfStock}</h3>
            <p>Out of Stock</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Package size={32} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Hourglass size={32} />
          </div>
          <div className="stat-content">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>

        <div className="stat-card alert">
          <div className="stat-icon">
            <AlertTriangle size={32} />
          </div>
          <div className="stat-content">
            <h3>{stats.lowStockItems}</h3>
            <p>Low Stock Alerts</p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="dashboard-content">
        {/* Recent Orders */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Recent Orders</h3>
            <span className="section-count">{recentOrders.length}</span>
          </div>
          {recentOrders.length > 0 ? (
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="order-id">{order.orderNumber}</td>
                      <td>{order.customer}</td>
                      <td className="amount">{order.amount}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(order.status),
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            textTransform: "capitalize"
                          }}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td>{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">
              <Package size={48} />
              <p>No orders found in the system</p>
              <small>Orders will appear here when customers place orders</small>
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Low Stock Alerts</h3>
            <span className="section-count alert-count">{stats.lowStockItems}</span>
          </div>
          {lowStockAlerts.length > 0 ? (
            <div className="alerts-list">
              {lowStockAlerts.map((item) => (
                <div key={item.id} className="alert-item">
                  <div className="alert-info">
                    <h4>{item.name}</h4>
                    <p className="stock-info">
                      <span className="stock-level" style={{ 
                        color: item.stock <= 5 ? '#ef4444' : '#f59e0b',
                        fontWeight: 'bold'
                      }}>
                        Stock: {item.stock}
                      </span>
                      {item.category && ` | Category: ${item.category}`}
                      {item.price && ` | Price: $${item.price}`}
                    </p>
                  </div>
                  <div className="alert-action">
                    <button 
                      className="restock-btn"
                      onClick={() => handleRestock(item.id)}
                    >
                      Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <CheckCircle2 size={48} />
              <p>No low stock alerts</p>
              <small>All products have sufficient stock levels</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;