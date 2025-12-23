import React, { useState, useEffect } from 'react';
import "./AdminReports.css";
import { reportAPI } from '../../services/api';
import { apiRequest } from '../../services/api';
import { 
  FiDownload, 
  FiTrash2, 
  FiEye, 
  FiSave, 
  FiBookmark,
  FiCalendar,
  FiBarChart2,
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiDollarSign,
  FiFilter,
  FiRefreshCw,
  FiPrinter,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiShoppingCart,
  FiBox,
  FiUserPlus,
  FiStar,
  FiGrid,
  FiList,
  FiColumns,
  FiDatabase,
  FiArchive,
  FiActivity
} from 'react-icons/fi';

function AdminReports() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    period: 'month',
    start: '',
    end: ''
  });
  const [filters, setFilters] = useState({
    category: '',
    stockThreshold: 5
  });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  // Report Data States
  const [kpiData, setKpiData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [fabricData, setFabricData] = useState(null);
  
  // Load initial data
  useEffect(() => {
    loadKPISummary();
  }, [dateRange.period]);
  
  const loadKPISummary = async () => {
    setLoading(true);
    const response = await apiRequest(() => 
      reportAPI.getKPISummary({ 
        period: dateRange.period,
        startDate: dateRange.start,
        endDate: dateRange.end 
      })
    );
    if (response.success) {
      setKpiData(response.data);
    }
    setLoading(false);
  };
  
  const loadSalesReport = async () => {
    setLoading(true);
    const response = await apiRequest(() => 
      reportAPI.getSalesReport({ 
        period: 'daily',
        startDate: dateRange.start,
        endDate: dateRange.end,
        category: filters.category 
      })
    );
    if (response.success) {
      setSalesData(response.data);
    }
    setLoading(false);
  };
  
  const loadInventoryReport = async () => {
    setLoading(true);
    const response = await apiRequest(() => 
      reportAPI.getInventoryReport({ 
        stockThreshold: filters.stockThreshold 
      })
    );
    if (response.success) {
      setInventoryData(response.data);
    }
    setLoading(false);
  };
  
  const loadCustomerReport = async () => {
    setLoading(true);
    const response = await apiRequest(() => 
      reportAPI.getCustomerReport({ 
        period: dateRange.period,
        startDate: dateRange.start,
        endDate: dateRange.end 
      })
    );
    if (response.success) {
      setCustomerData(response.data);
    }
    setLoading(false);
  };
  
  const loadFabricPerformance = async () => {
    setLoading(true);
    const response = await apiRequest(() => 
      reportAPI.getFabricPerformance({ 
        period: dateRange.period,
        category: filters.category 
      })
    );
    if (response.success) {
      setFabricData(response.data);
    }
    setLoading(false);
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    switch(tab) {
      case 'sales':
        loadSalesReport();
        break;
      case 'inventory':
        loadInventoryReport();
        break;
      case 'customers':
        loadCustomerReport();
        break;
      case 'fabrics':
        loadFabricPerformance();
        break;
      default:
        loadKPISummary();
    }
  };
  
  const handleExport = async (type) => {
    setExporting(true);
    const response = await apiRequest(() => 
      reportAPI.exportReport(type, {
        format: 'csv',
        dateRange,
        filters
      })
    );
    if (response.success) {
      alert(`Export initiated for ${type} report. Download will start shortly.`);
    }
    setExporting(false);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStockColor = (stock, threshold = 5) => {
    if (stock === 0) return 'danger';
    if (stock < threshold) return 'warning';
    return 'success';
  };
  
  // Render KPI Cards
  const renderKPICards = () => {
    if (!kpiData) return null;
    
    const cards = [
      {
        title: 'Total Revenue',
        value: formatCurrency(kpiData.totalRevenue),
        icon: <FiDollarSign />,
        color: 'green',
        trend: '+12%'
      },
      {
        title: 'Total Orders',
        value: kpiData.totalOrders,
        icon: <FiShoppingBag />,
        color: 'blue',
        trend: '+8%'
      },
      {
        title: 'Avg Order Value',
        value: formatCurrency(kpiData.averageOrderValue),
        icon: <FiTrendingUp />,
        color: 'purple',
        trend: '+5%'
      },
      {
        title: 'New Customers',
        value: kpiData.newCustomers,
        icon: <FiUserPlus />,
        color: 'orange',
        trend: '+15%'
      },
      {
        title: 'Low Stock Items',
        value: kpiData.lowStockCount,
        icon: <FiAlertCircle />,
        color: 'red',
        trend: 'Need Attention'
      },
      {
        title: 'Out of Stock',
        value: kpiData.outOfStockCount,
        icon: <FiBox />,
        color: 'darkred',
        trend: 'Reorder Needed'
      }
    ];
    
    return (
      <div className="kpi-grid">
        {cards.map((card, index) => (
          <div key={index} className={`kpi-card kpi-${card.color}`}>
            <div className="kpi-icon">{card.icon}</div>
            <div className="kpi-content">
              <h3>{card.title}</h3>
              <div className="kpi-value">{card.value}</div>
              <div className="kpi-trend">{card.trend}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render Sales Report
  const renderSalesReport = () => {
    if (!salesData) return <div className="loading">Loading sales data...</div>;
    
    return (
      <div className="report-section">
        <div className="section-header">
          <h2><FiDollarSign /> Sales & Revenue Report</h2>
          <button 
            className="export-btn"
            onClick={() => handleExport('sales')}
            disabled={exporting}
          >
            <FiDownload /> Export CSV
          </button>
        </div>
        
        <h3>Revenue by Period</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Revenue</th>
              <th>Orders</th>
              <th>Avg Order Value</th>
            </tr>
          </thead>
          <tbody>
            {salesData.revenueByPeriod?.map((item, index) => (
              <tr key={index}>
                <td>{item._id}</td>
                <td>{formatCurrency(item.revenue)}</td>
                <td>{item.orders}</td>
                <td>{formatCurrency(item.avgOrderValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <h3>Revenue by Fabric Category</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Revenue</th>
              <th>Quantity Sold</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            {salesData.revenueByCategory?.map((item, index) => (
              <tr key={index}>
                <td>{item._id || 'Uncategorized'}</td>
                <td>{formatCurrency(item.revenue)}</td>
                <td>{item.quantitySold}</td>
                <td>{item.orderCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <h3>Best Selling Fabrics</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Fabric</th>
              <th>Category</th>
              <th>Quantity Sold</th>
              <th>Revenue</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {salesData.bestSellingFabrics?.map((item, index) => (
              <tr key={index}>
                <td>{item.fabricName}</td>
                <td>{item.category}</td>
                <td>{item.totalSold}</td>
                <td>{formatCurrency(item.revenue)}</td>
                <td>{formatCurrency(item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Render Inventory Report
  const renderInventoryReport = () => {
    if (!inventoryData) return <div className="loading">Loading inventory data...</div>;
    
    return (
      <div className="report-section">
        <div className="section-header">
          <h2><FiPackage /> Inventory Health Report</h2>
          <button 
            className="export-btn"
            onClick={() => handleExport('inventory')}
            disabled={exporting}
          >
            <FiDownload /> Export CSV
          </button>
        </div>
        
        <div className="stock-summary">
          {inventoryData.stockSummary?.map((status, index) => (
            <div key={index} className={`stock-status status-${status._id}`}>
              <h4>{status._id.replace('-', ' ').toUpperCase()}</h4>
              <div className="count">{status.count} items</div>
            </div>
          ))}
        </div>
        
        <h3>Low Stock Fabrics ({inventoryData.stockThreshold} yards/meters)</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Fabric</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Reorder Level</th>
              <th>Unit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.lowStockFabrics?.map((fabric, index) => (
              <tr key={index}>
                <td>{fabric.name}</td>
                <td>{fabric.category}</td>
                <td>
                  <span className={`stock-indicator ${getStockColor(fabric.stock, inventoryData.stockThreshold)}`}>
                    {fabric.stock}
                  </span>
                </td>
                <td>{fabric.reorderLevel || inventoryData.stockThreshold}</td>
                <td>{fabric.unit || 'yards'}</td>
                <td>
                  <span className={`status-badge ${getStockColor(fabric.stock, inventoryData.stockThreshold)}`}>
                    {fabric.stock === 0 ? 'Out of Stock' : 
                     fabric.stock < inventoryData.stockThreshold ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <h3>Auto-generated Reorder List</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Fabric</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Reorder Level</th>
              <th>Reorder Quantity</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.reorderList?.map((item, index) => (
              <tr key={index}>
                <td>{item.fabricName}</td>
                <td>{item.category}</td>
                <td>{item.currentStock}</td>
                <td>{item.reorderLevel}</td>
                <td>{item.reorderQuantity} {item.unit}</td>
                <td>
                  <span className={`priority-badge ${item.currentStock === 0 ? 'high' : 'medium'}`}>
                    {item.currentStock === 0 ? 'HIGH' : 'MEDIUM'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <h3>Dead Stock (No sales in 60 days)</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Fabric</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Last Sold</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.deadStockFabrics?.map((fabric, index) => (
              <tr key={index}>
                <td>{fabric.name}</td>
                <td>{fabric.category}</td>
                <td>{fabric.stock}</td>
                <td>{formatCurrency(fabric.price)}</td>
                <td>{fabric.lastSold ? formatDate(fabric.lastSold) : 'Never'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Render Customer Report
  const renderCustomerReport = () => {
    if (!customerData) return <div className="loading">Loading customer data...</div>;
    
    return (
      <div className="report-section">
        <div className="section-header">
          <h2><FiUsers /> Customer Analysis Report</h2>
          <button 
            className="export-btn"
            onClick={() => handleExport('customers')}
            disabled={exporting}
          >
            <FiDownload /> Export CSV
          </button>
        </div>
        
        <div className="customer-metrics">
          <div className="metric-card">
            <h4>New Customers</h4>
            <div className="metric-value">{customerData.customerMetrics?.newCustomers}</div>
          </div>
          <div className="metric-card">
            <h4>Returning Customers</h4>
            <div className="metric-value">{customerData.customerMetrics?.returningCustomers}</div>
          </div>
          <div className="metric-card">
            <h4>New/Returning Ratio</h4>
            <div className="metric-value">{customerData.customerMetrics?.newVsReturningRatio}</div>
          </div>
          <div className="metric-card">
            <h4>Total Customers</h4>
            <div className="metric-value">{customerData.customerMetrics?.totalCustomers}</div>
          </div>
        </div>
        
        <h3>Top Spending Customers</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Total Spent</th>
              <th>Orders</th>
              <th>Avg Order Value</th>
              <th>First Order</th>
              <th>Last Order</th>
            </tr>
          </thead>
          <tbody>
            {customerData.topSpendingCustomers?.map((customer, index) => (
              <tr key={index}>
                <td>{customer.customerName}</td>
                <td>{customer.email}</td>
                <td>{formatCurrency(customer.totalSpent)}</td>
                <td>{customer.orderCount}</td>
                <td>{formatCurrency(customer.averageOrderValue)}</td>
                <td>{formatDate(customer.firstOrder)}</td>
                <td>{formatDate(customer.lastOrder)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <h3>Cohort Analysis (First Purchase Month)</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Cohort Month</th>
              <th>Customers</th>
              <th>Total Orders</th>
              <th>Total Revenue</th>
              <th>Avg Revenue/Customer</th>
            </tr>
          </thead>
          <tbody>
            {customerData.cohortAnalysis?.map((cohort, index) => (
              <tr key={index}>
                <td>{cohort._id}</td>
                <td>{cohort.customerCount}</td>
                <td>{cohort.totalOrders}</td>
                <td>{formatCurrency(cohort.totalRevenue)}</td>
                <td>{formatCurrency(cohort.totalRevenue / cohort.customerCount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <h3>Purchase Frequency Distribution</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Number of Orders</th>
              <th>Number of Customers</th>
            </tr>
          </thead>
          <tbody>
            {customerData.purchaseFrequency && Object.entries(customerData.purchaseFrequency).map(([frequency, count], index) => (
              <tr key={index}>
                <td>{frequency} order{frequency !== '1' ? 's' : ''}</td>
                <td>{count} customers</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Render Fabric Performance
  const renderFabricPerformance = () => {
    if (!fabricData) return <div className="loading">Loading fabric data...</div>;
    
    return (
      <div className="report-section">
        <div className="section-header">
          <h2><FiGrid /> Fabric Performance Report</h2>
          <button 
            className="export-btn"
            onClick={() => handleExport('fabrics')}
            disabled={exporting}
          >
            <FiDownload /> Export CSV
          </button>
        </div>
        
        <h3>Most Viewed Fabrics</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Fabric</th>
              <th>Category</th>
              <th>Views</th>
              <th>Stock</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {fabricData.mostViewedFabrics?.map((fabric, index) => (
              <tr key={index}>
                <td>{fabric.name}</td>
                <td>{fabric.category}</td>
                <td>{fabric.views || 0}</td>
                <td>
                  <span className={`stock-indicator ${getStockColor(fabric.stock)}`}>
                    {fabric.stock}
                  </span>
                </td>
                <td>{formatCurrency(fabric.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <h3>View-to-Purchase Conversion</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Fabric</th>
              <th>Category</th>
              <th>Views</th>
              <th>Units Sold</th>
              <th>Revenue</th>
              <th>Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {fabricData.fabricPerformance?.map((fabric, index) => (
              <tr key={index}>
                <td>{fabric.fabricName}</td>
                <td>{fabric.category}</td>
                <td>{fabric.views || 0}</td>
                <td>{fabric.totalSold}</td>
                <td>{formatCurrency(fabric.revenue)}</td>
                <td>
                  <span className={`conversion-rate ${fabric.conversionRate > 5 ? 'high' : fabric.conversionRate > 2 ? 'medium' : 'low'}`}>
                    {fabric.conversionRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <h3>Category Performance</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Sold</th>
              <th>Revenue</th>
              <th>Unique Fabrics</th>
              <th>Avg Revenue/Fabric</th>
            </tr>
          </thead>
          <tbody>
            {fabricData.categoryPerformance?.map((category, index) => (
              <tr key={index}>
                <td>{category.category || 'Uncategorized'}</td>
                <td>{category.totalSold}</td>
                <td>{formatCurrency(category.revenue)}</td>
                <td>{category.fabricCount}</td>
                <td>{formatCurrency(category.avgRevenuePerFabric)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <div className="admin-reports page">
      <div className="reports-header">
        <h1><FiBarChart2 /> Fabric Store Analytics</h1>
        <p>Comprehensive reports for your textile e-commerce business</p>
      </div>
      
      {/* Global Controls */}
      <div className="global-controls">
        <div className="control-group">
          <label><FiCalendar /> Date Range</label>
          <div className="date-controls">
            <select 
              value={dateRange.period}
              onChange={(e) => setDateRange({...dateRange, period: e.target.value})}
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
            
            {dateRange.period === 'custom' && (
              <>
                <input 
                  type="date" 
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  placeholder="Start Date"
                />
                <input 
                  type="date" 
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  placeholder="End Date"
                />
              </>
            )}
          </div>
        </div>
        
        <div className="control-group">
          <label><FiFilter /> Filters</label>
          <div className="filter-controls">
            <select 
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="">All Categories</option>
              <option value="Ankara">Ankara</option>
              <option value="Cotton">Cotton</option>
              <option value="Silk">Silk</option>
              <option value="Linen">Linen</option>
              <option value="Wool">Wool</option>
              <option value="Polyester">Polyester</option>
            </select>
            
            <div className="stock-threshold">
              <label>Low Stock Threshold:</label>
              <input 
                type="number" 
                value={filters.stockThreshold}
                onChange={(e) => setFilters({...filters, stockThreshold: parseInt(e.target.value) || 5})}
                min="1"
                max="50"
              />
              <span>yards/meters</span>
            </div>
          </div>
        </div>
        
        <button 
          className="refresh-btn"
          onClick={() => handleTabChange(activeTab)}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? 'spin' : ''} /> Refresh Data
        </button>
      </div>
      
      {/* Navigation Tabs */}
      <div className="reports-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => handleTabChange('overview')}
        >
          <FiActivity /> Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => handleTabChange('sales')}
        >
          <FiDollarSign /> Sales
        </button>
        <button 
          className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => handleTabChange('inventory')}
        >
          <FiPackage /> Inventory
        </button>
        <button 
          className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => handleTabChange('customers')}
        >
          <FiUsers /> Customers
        </button>
        <button 
          className={`tab-btn ${activeTab === 'fabrics' ? 'active' : ''}`}
          onClick={() => handleTabChange('fabrics')}
        >
          <FiGrid /> Fabrics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
          onClick={() => setActiveTab('export')}
        >
          <FiDownload /> Export
        </button>
      </div>
      
      {/* Reports Content */}
      <div className="reports-content">
        {loading && activeTab !== 'export' ? (
          <div className="loading-overlay">
            <FiRefreshCw className="spin" />
            <p>Loading report data...</p>
          </div>
        ) : null}
        
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {renderKPICards()}
            
            <div className="quick-reports">
              <h2><FiBarChart2 /> Quick Reports</h2>
              <div className="quick-grid">
                <div className="quick-card" onClick={() => handleTabChange('sales')}>
                  <FiTrendingUp />
                  <h3>Revenue Trends</h3>
                  <p>Daily/Weekly/Monthly revenue</p>
                </div>
                <div className="quick-card" onClick={() => handleTabChange('inventory')}>
                  <FiAlertCircle />
                  <h3>Low Stock Alert</h3>
                  <p>{kpiData?.lowStockCount || 0} items need attention</p>
                </div>
                <div className="quick-card" onClick={() => handleTabChange('customers')}>
                  <FiStar />
                  <h3>Top Customers</h3>
                  <p>View highest spending customers</p>
                </div>
                <div className="quick-card" onClick={() => handleTabChange('fabrics')}>
                  <FiGrid />
                  <h3>Best Sellers</h3>
                  <p>Top performing fabrics</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'sales' && renderSalesReport()}
        {activeTab === 'inventory' && renderInventoryReport()}
        {activeTab === 'customers' && renderCustomerReport()}
        {activeTab === 'fabrics' && renderFabricPerformance()}
        
        {activeTab === 'export' && (
          <div className="export-tab">
            <h2><FiDownload /> Export Reports</h2>
            <p>Export data in CSV format for further analysis</p>
            
            <div className="export-options">
              <div className="export-card">
                <FiDollarSign />
                <h3>Sales Report</h3>
                <p>Revenue, orders, AOV, best sellers</p>
                <button 
                  className="export-action-btn"
                  onClick={() => handleExport('sales')}
                  disabled={exporting}
                >
                  {exporting ? 'Exporting...' : 'Export CSV'}
                </button>
              </div>
              
              <div className="export-card">
                <FiPackage />
                <h3>Inventory Report</h3>
                <p>Stock levels, reorder list, dead stock</p>
                <button 
                  className="export-action-btn"
                  onClick={() => handleExport('inventory')}
                  disabled={exporting}
                >
                  {exporting ? 'Exporting...' : 'Export CSV'}
                </button>
              </div>
              
              <div className="export-card">
                <FiUsers />
                <h3>Customer Report</h3>
                <p>Customer analysis, spending, cohorts</p>
                <button 
                  className="export-action-btn"
                  onClick={() => handleExport('customers')}
                  disabled={exporting}
                >
                  {exporting ? 'Exporting...' : 'Export CSV'}
                </button>
              </div>
              
              <div className="export-card">
                <FiGrid />
                <h3>Fabric Report</h3>
                <p>Performance, views, conversion rates</p>
                <button 
                  className="export-action-btn"
                  onClick={() => handleExport('fabrics')}
                  disabled={exporting}
                >
                  {exporting ? 'Exporting...' : 'Export CSV'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReports;