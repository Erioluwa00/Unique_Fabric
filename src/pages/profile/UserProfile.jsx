import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { userAPI, orderAPI, addressAPI } from '../../services/api';
import './UserProfile.css';

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [newsletterPref, setNewsletterPref] = useState(true);
    const [loading, setLoading] = useState({
        profile: true,
        orders: true,
        addresses: true,
        newsletter: true
    });
    const [error, setError] = useState(null);

    // Fetch user profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await userAPI.getProfile();
                
                if (response.data.success) {
                    setProfile(response.data.user);
                } else {
                    setProfile(user);
                }
                setLoading(prev => ({ ...prev, profile: false }));
            } catch (err) {
                setProfile(user);
                setLoading(prev => ({ ...prev, profile: false }));
            }
        };

        if (user?.id) {
            fetchProfile();
        } else {
            setLoading(prev => ({ ...prev, profile: false }));
        }
    }, [user]);

    // Fetch recent orders (last 3 only)
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await orderAPI.getMyOrders();
                
                if (response.data.success) {
                    const allOrders = response.data.orders || [];
                    const lastThreeOrders = allOrders
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 3);
                    setOrders(lastThreeOrders);
                }
                setLoading(prev => ({ ...prev, orders: false }));
            } catch {
                setLoading(prev => ({ ...prev, orders: false }));
            }
        };

        if (user?.id) {
            fetchOrders();
        } else {
            setLoading(prev => ({ ...prev, orders: false }));
        }
    }, [user]);

    // Fetch addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await addressAPI.getAddresses();
                
                if (response.data.success) {
                    setAddresses(response.data.data || []);
                }
                setLoading(prev => ({ ...prev, addresses: false }));
            } catch {
                setLoading(prev => ({ ...prev, addresses: false }));
            }
        };

        if (user?.id) {
            fetchAddresses();
        } else {
            setLoading(prev => ({ ...prev, addresses: false }));
        }
    }, [user]);

    // Handle newsletter toggle
    const handleNewsletterToggle = async (e) => {
        const isSubscribed = e.target.checked;
        try {
            setNewsletterPref(isSubscribed);
            await userAPI.updateNewsletterPreference({ subscribed: isSubscribed });
        } catch {
            setNewsletterPref(!isSubscribed);
            e.target.checked = !isSubscribed;
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (!amount) return '₦ 0';
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Get default address
    const getDefaultAddress = () => {
        return addresses.find(addr => addr.isDefault) || addresses[0];
    };

    // Calculate account stats
    const calculateStats = () => {
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        const daysAsMember = profile?.createdAt 
            ? Math.floor((new Date() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24))
            : 0;
        
        return { totalOrders, totalSpent, daysAsMember };
    };

    const defaultAddress = getDefaultAddress();
    const stats = calculateStats();

    // Check if still loading
    const isLoading = loading.profile || loading.orders || loading.addresses;

    if (isLoading) {
        return (
            <div className="user-profile-dashboard">
                <main className="user-profile-main">
                    <div className="loading-state">
                        <i className="fas fa-spinner fa-spin"></i>
                        <p>Loading your profile...</p>
                    </div>
                </main>
            </div>
        );
    }

    // Don't show error if we have user data from context
    if (error && !user) {
        return (
            <div className="user-profile-dashboard">
                <main className="user-profile-main">
                    <div className="error-state">
                        <i className="fas fa-exclamation-triangle"></i>
                        <p>{error}</p>
                        <a href="/login" className="profile-button" style={{marginTop: '20px'}}>
                            Go to Login
                        </a>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="user-profile-dashboard">
            <main className="user-profile-main">
                <div className="user-profile-header">
                    <h1 className="user-profile-title">My Account</h1>
                    <p className="user-profile-welcome">
                        Welcome back, {profile?.name || user?.name || 'Guest'}!
                    </p>
                </div>

                <div className="user-profile-grid">
                    {/* Account Details Card */}
                    <div className="profile-card profile-card-highlight">
                        <div className="profile-card-header">
                            <i className="fas fa-user-circle profile-card-icon"></i>
                            <h2 className="profile-card-title">Account Details</h2>
                        </div>
                        <div className="profile-card-content">
                            <div className="profile-detail-item">
                                <span className="profile-detail-label">Full Name</span>
                                <span className="profile-detail-value">
                                    {profile?.name || user?.name || 'Not available'}
                                </span>
                            </div>
                            <div className="profile-detail-item">
                                <span className="profile-detail-label">Email Address</span>
                                <span className="profile-detail-value">
                                    {profile?.email || user?.email || 'Not available'}
                                </span>
                            </div>
                            <div className="profile-detail-item">
                                <span className="profile-detail-label">Phone Number</span>
                                <span className="profile-detail-value">
                                    {profile?.phone || user?.phone || 'Not provided'}
                                </span>
                            </div>
                           
                            <a href="/userEditProfile" className="profile-button profile-button-outline">
                                <i className="fas fa-edit profile-button-icon"></i> Edit Profile
                            </a>
                        </div>
                    </div>

                    {/* Recent Orders Card - Show last 3 orders */}
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <i className="fas fa-shopping-bag profile-card-icon"></i>
                            <h2 className="profile-card-title">Recent Orders</h2>
                        </div>
                        <div className="profile-card-content">
                            {orders.length > 0 ? (
                                <div className="orders-container">
                                    {orders.map(order => (
                                        <div key={order._id} className="order-item">
                                            <div className="order-info">
                                                <span className="order-number">
                                                    Order #{order.orderNumber || `#${order._id?.slice(-6)}`}
                                                </span>
                                                <span className="order-date">
                                                    {formatDate(order.createdAt)}
                                                </span>
                                            </div>
                                            <div className="order-status-container">
                                                <span className={`status-badge status-${order.status?.toLowerCase() || 'pending'}`}>
                                                    {order.status || 'Processing'}
                                                </span>
                                                <span className="order-total">
                                                    {formatCurrency(order.totalPrice || 0)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data-message">You haven't placed any orders yet.</p>
                            )}
                            <a href="/userPreviousOrders" className="profile-link view-all-link">
                                View All Orders <i className="fas fa-arrow-right profile-link-icon"></i>
                            </a>
                        </div>
                    </div>

                    {/* Address Book Card */}
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <i className="fas fa-map-marker-alt profile-card-icon"></i>
                            <h2 className="profile-card-title">Address Book</h2>
                        </div>
                        <div className="profile-card-content">
                            <div className="address-preview">
                                <h3 className="address-title">Default Shipping Address</h3>
                                {defaultAddress ? (
                                    <div className="address-details">
                                        <p className="address-name">
                                            <strong>{defaultAddress.fullName}</strong>
                                            {defaultAddress.isDefault && (
                                                <span className="default-badge">Default</span>
                                            )}
                                        </p>
                                        <p className="address-street">{defaultAddress.street}</p>
                                        <p className="address-city">
                                            {defaultAddress.city}, {defaultAddress.state} {defaultAddress.zipCode}
                                        </p>
                                        <p className="address-country">{defaultAddress.country}</p>
                                        <p className="address-phone">Phone: {defaultAddress.phone}</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="no-address-message">
                                            <i className="fas fa-exclamation-circle address-icon"></i>
                                            No default shipping address set
                                        </p>
                                        <p className="address-notice">
                                            Add an address for faster checkout and order tracking
                                        </p>
                                    </>
                                )}
                            </div>
                            <a href="/userAddressPayment" className="profile-button">
                                <i className="fas fa-plus profile-button-icon"></i> 
                                {defaultAddress ? 'Manage Addresses' : 'Add New Address'}
                            </a>
                        </div>
                    </div>

                    {/* Account Stats Card - Show if user has orders */}
                    {orders.length > 0 && (
                        <div className="profile-card profile-card-stats">
                            <div className="profile-card-header">
                                <i className="fas fa-chart-line profile-card-icon"></i>
                                <h2 className="profile-card-title">Account Stats</h2>
                            </div>
                            <div className="profile-card-content">
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <span className="stat-number">{stats.totalOrders}</span>
                                        <span className="stat-label">Total Orders</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">{formatCurrency(stats.totalSpent)}</span>
                                        <span className="stat-label">Total Spent</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">{stats.daysAsMember}</span>
                                        <span className="stat-label">Days as Member</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions Card */}
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <i className="fas fa-bolt profile-card-icon"></i>
                            <h2 className="profile-card-title">Quick Actions</h2>
                        </div>
                        <div className="profile-card-content">
                            <div className="quick-actions-grid">
                                <a href="/wishlist" className="action-link">
                                    <i className="fas fa-heart action-icon"></i>
                                    <span className="action-text">View Wishlist</span>
                                </a>
                                <a href="/userEditProfile" className="action-link">
                                    <i className="fas fa-cog action-icon"></i>
                                    <span className="action-text">Account Settings</span>
                                </a>
                                <a href="/contact" className="action-link">
                                    <i className="fas fa-headset action-icon"></i>
                                    <span className="action-text">Contact Support</span>
                                </a>
                                <a href="/userRecentlyViewed" className="action-link">
                                    <i className="fas fa-history action-icon"></i>
                                    <span className="action-text">Recently Viewed</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter Preferences Card */}
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <i className="fas fa-envelope profile-card-icon"></i>
                            <h2 className="profile-card-title">Newsletter Preferences</h2>
                        </div>
                        <div className="profile-card-content">
                            <p className="newsletter-description">
                                Stay updated with our latest products, promotions, and exclusive offers.
                            </p>
                            <div className="toggle-container">
                                <span className="toggle-label">Marketing Emails</span>
                                <label className="toggle-switch">
                                    <input 
                                        type="checkbox" 
                                        checked={newsletterPref}
                                        onChange={handleNewsletterToggle}
                                        disabled={loading.newsletter}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <a href="/userNewsletter" className="profile-link">
                                Manage All Preferences
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;