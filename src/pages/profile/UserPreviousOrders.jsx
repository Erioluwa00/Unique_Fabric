import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./UserPreviousOrders.css";

const UserPreviousOrders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("fabricToken");
      const response = await fetch(
        "http://localhost:5000/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "order-status--pending",
      processing: "order-status--processing",
      shipped: "order-status--shipped",
      delivered: "order-status--delivered",
      cancelled: "order-status--cancelled",
    };
    return colors[status] || "order-status--default";
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return statusMap[status] || status;
  };

  const getFilteredOrders = () => {
    switch (activeTab) {
      case "all":
        return orders;
      case "delivered":
        return orders.filter((order) => order.status === "delivered");
      case "canceled":
        return orders.filter((order) => order.status === "cancelled");
      case "returned":
        return orders.filter((order) => order.returnStatus === "returned");
      default:
        return orders;
    }
  };

  const filteredOrders = getFilteredOrders();

  const getTabCount = (tab) => {
    switch (tab) {
      case "all":
        return orders.length;
      case "delivered":
        return orders.filter((order) => order.status === "delivered").length;
      case "canceled":
        return orders.filter((order) => order.status === "cancelled").length;
      case "returned":
        return orders.filter((order) => order.returnStatus === "returned")
          .length;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="previous-orders-page">
        <div className="previous-order-loading-spinner previous-orders-spinner">
          <div className="previous-orderspinner"></div>
          {/* <p>Loading your orders...</p> */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="previous-orders-page">
        <div className="error-message">
          <h3>Error Loading Orders</h3>
          <p>{error}</p>
          <button onClick={fetchOrders} className="btn btn--primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const allOrdersContent =
    filteredOrders.length > 0 ? (
      <div className="orders-list">
        {filteredOrders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="previous-order-header">
              <div className="order-info">
                <h4 className="order-id">Order #{order.orderNumber}</h4>
                <span className="order-date">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className={`order-status ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </div>
            </div>

            <div className="order-details">
              <div className="order-meta">
                <span className="items-count">
                  {order.orderItems.length} item
                  {order.orderItems.length > 1 ? "s" : ""}
                </span>
                <span className="order-total">
                  ${order.totalPrice?.toFixed(2) || "0.00"}
                </span>
              </div>
              {order.trackingNumber && (
                <div className="tracking-info">
                  <span className="tracking-number">
                    Tracking: {order.trackingNumber}
                  </span>
                </div>
              )}
            </div>

            <div className="order-card-items">
              {order.orderItems?.slice(0, 3).map((item, index) => (
                <div key={index} className="order-item-preview">
                  <img
                    src={item.image || "/images/placeholder-fabric.jpg"}
                    alt={item.name}
                    className="order-item-image"
                    onError={(e) => {
                      e.target.src = "/images/placeholder-fabric.jpg";
                    }}
                  />
                  <div className="previous-order-item-details">
                    <span className="order-item-name">{item.name}</span>
                    <br></br>
                    <span className="order-item-quantity">
                      Qty: {item.quantity}
                    </span>
                    <br></br>
                    <span className="order-item-price">
                      ${item.price?.toFixed(2) || "0.00"} each
                    </span>
                  </div>
                </div>
              ))}
              {order.orderItems?.length > 3 && (
                <div className="order-more-items">
                  +{order.orderItems.length - 3} more items
                </div>
              )}
            </div>

            <div className="order-actions">
              <Link
                to={`/orders/${order._id}`}
                className="action-btn view-details"
              >
                View Details
              </Link>
              
              <Link
                to={`/UserReorder`}
                className="action-btn reorder"
              >
                Reorder
              </Link>
              
              {order.status === "shipped" && order.trackingNumber && (
                <a
                  href={`https://tracking.carrier.com/track/${order.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn track-package"
                >
                  Track Package
                </a>
              )}
            </div>

            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="order-timeline">
                <div className="timeline-label">Latest Update:</div>
                <div className="timeline-item">
                  <span className="timeline-status">
                    {order.statusHistory[order.statusHistory.length - 1].status}
                  </span>
                  <span className="timeline-date">
                    {new Date(
                      order.statusHistory[order.statusHistory.length - 1].date
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <div className="empty-orders">
        <div className="empty-icon">
          {activeTab === "all" && "📦"}
          {activeTab === "delivered" && "✅"}
          {activeTab === "canceled" && "❌"}
          {activeTab === "returned" && "🔄"}
        </div>
        <h3>
          {activeTab === "all" && "No orders found"}
          {activeTab === "delivered" && "No delivered orders"}
          {activeTab === "canceled" && "No canceled orders"}
          {activeTab === "returned" && "No returned orders"}
        </h3>
        <p>
          {activeTab === "all" &&
            "When you place orders, they will appear here with all the details you need to track your purchases."}
          {activeTab === "delivered" &&
            "Your delivered orders will appear here once they are completed and marked as delivered."}
          {activeTab === "canceled" &&
            "Orders you cancel will appear here for your reference."}
          {activeTab === "returned" &&
            "Items you return will be listed here along with their return status."}
        </p>
        {activeTab === "all" && (
          <Link to="/shop" className="start-shopping-btn">
            Start Shopping
          </Link>
        )}
      </div>
    );

  return (
    <div className="previous-orders-page">
      <div className="orders-container">
        <h1 className="page-title">Previous Orders</h1>

        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Orders ({getTabCount("all")})
          </button>
          <button
            className={`tab-button ${
              activeTab === "delivered" ? "active" : ""
            }`}
            onClick={() => setActiveTab("delivered")}
          >
            Delivered ({getTabCount("delivered")})
          </button>
          <button
            className={`tab-button ${activeTab === "canceled" ? "active" : ""}`}
            onClick={() => setActiveTab("canceled")}
          >
            Canceled ({getTabCount("canceled")})
          </button>
          <button
            className={`tab-button ${activeTab === "returned" ? "active" : ""}`}
            onClick={() => setActiveTab("returned")}
          >
            Returned ({getTabCount("returned")})
          </button>
        </div>

        <div className="tab-content">{allOrdersContent}</div>
      </div>
    </div>
  );
};

export default UserPreviousOrders;