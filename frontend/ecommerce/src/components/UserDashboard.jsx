import React, { useState, useEffect } from 'react';
import axios from 'axios';
// In your component file, e.g., UserDashboard.jsx
import './UserDashboard.css'; // applies globally
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchUserData();
    fetchOrders();
    fetchRecentProducts();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/orders/user', {
      headers: { Authorization: `Bearer ${token}` }
    });

    // ✅ Ensure it's always an array
    const data = response.data;
    setOrders(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error fetching orders:', error);
    setOrders([]); // fallback
  }
};


const fetchRecentProducts = async () => {
  try {
    const response = await axios.get('/api/products?limit=5');
    
    // ✅ backend returns { products: [...] }
    const products = Array.isArray(response.data) 
      ? response.data 
      : response.data.products || [];

    setRecentProducts(products);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching products:', error);
    setRecentProducts([]); // fallback
    setLoading(false);
  }
};


  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const cancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`/api/orders/${orderId}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchOrders(); // Refresh orders
        alert('Order cancelled successfully');
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Error cancelling order');
      }
    }
  };

  // Chart data
  const spendingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Spending ($)',
        data: [120, 190, 300, 250, 200, 350],
        backgroundColor: 'rgba(67, 97, 238, 0.5)',
        borderColor: 'rgba(67, 97, 238, 1)',
        borderWidth: 1
      }
    ]
  };

  const orderStatusData = {
    labels: ['Delivered', 'Processing', 'Cancelled'],
    datasets: [
      {
        data: [65, 15, 20],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {userData?.name}!</h1>
        <p>Here's what's happening with your account today.</p>
      </div>

      <div className="dashboard-content">
        <div className="sidebar">
          <div className="user-profile-card">
            <div className="profile-image">
              <img src={userData?.profilePic || '/default-avatar.png'} alt="Profile" />
            </div>
            <h3>{userData?.name}</h3>
            <p>{userData?.email}</p>
            <p className="user-role">{userData?.role}</p>
          </div>

          <nav className="dashboard-nav">
            <ul>
              <li className={activeTab === 'overview' ? 'active' : ''}>
                <button onClick={() => setActiveTab('overview')}>
                  <i className="fas fa-chart-pie"></i> Overview
                </button>
              </li>
              <li className={activeTab === 'profile' ? 'active' : ''}>
                <button onClick={() => setActiveTab('profile')}>
                  <i className="fas fa-user"></i> Profile
                </button>
              </li>
              <li className={activeTab === 'orders' ? 'active' : ''}>
                <button onClick={() => setActiveTab('orders')}>
                  <i className="fas fa-shopping-bag"></i> Orders
                </button>
              </li>
              <li className={activeTab === 'wishlist' ? 'active' : ''}>
                <button onClick={() => setActiveTab('wishlist')}>
                  <i className="fas fa-heart"></i> Wishlist
                </button>
              </li>
              <li className={activeTab === 'settings' ? 'active' : ''}>
                <button onClick={() => setActiveTab('settings')}>
                  <i className="fas fa-cog"></i> Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="main-content">
          {activeTab === 'overview' && (
            <OverviewTab 
              userData={userData} 
              recentProducts={recentProducts} 
              spendingData={spendingData}
              orderStatusData={orderStatusData}
              orders={orders}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileTab 
              userData={userData} 
              editMode={editMode}
              setEditMode={setEditMode}
              formData={formData}
              handleInputChange={handleInputChange}
              handleUpdateProfile={handleUpdateProfile}
            />
          )}
          {activeTab === 'orders' && (
            <OrdersTab orders={orders} cancelOrder={cancelOrder} />
          )}
          {activeTab === 'wishlist' && <WishlistTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

// Tab Components
const OverviewTab = ({ userData, recentProducts, spendingData, orderStatusData, orders }) => {
  const totalSpent = orders
    .filter(order => order.status === 'delivered')
    .reduce((total, order) => total + order.totalAmount, 0);

  return (
    <div className="tab-content">
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-shopping-bag"></i>
          </div>
          <div className="stat-info">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <h3>{orders.filter(order => order.status === 'delivered').length}</h3>
            <p>Completed Orders</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="stat-info">
            <h3>${totalSpent.toFixed(2)}</h3>
            <p>Total Spent</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-info">
            <h3>4.8</h3>
            <p>Average Rating</p>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Monthly Spending</h3>
          <div className="chart-container">
            <Bar 
              data={spendingData} 
              options={{ 
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                }
              }} 
            />
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Order Status</h3>
          <div className="chart-container">
            <Doughnut 
              data={orderStatusData} 
              options={{ 
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Orders</h3>
        {orders.slice(0, 3).map(order => (
          <div key={order._id} className="activity-item">
            <div className="activity-icon">
              <i className="fas fa-shopping-bag"></i>
            </div>
            <div className="activity-details">
              <h4>Order #{order._id.slice(-6)}</h4>
              <p>Status: <span className={`status-${order.status}`}>{order.status}</span></p>
              <p>Total: ${order.totalAmount}</p>
            </div>
            <div className="activity-date">
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      <div className="recent-products">
        <h3>New Products</h3>
        <div className="products-grid">
          {recentProducts.map(product => (
            <div key={product._id} className="product-card">
              <img src={product.imageUrl} alt={product.name} />
              <h4>{product.name}</h4>
              <p>${product.price}</p>
              <button className="btn-primary">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProfileTab = ({ 
  userData, 
  editMode, 
  setEditMode, 
  formData, 
  handleInputChange, 
  handleUpdateProfile 
}) => {
  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Profile Information</h2>
        {!editMode ? (
          <button className="btn-primary" onClick={() => setEditMode(true)}>
            <i className="fas fa-edit"></i> Edit Profile
          </button>
        ) : (
          <button className="btn-secondary" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        )}
      </div>

      {!editMode ? (
        <div className="profile-details">
          <div className="detail-row">
            <label>Full Name:</label>
            <span>{userData.name}</span>
          </div>
          <div className="detail-row">
            <label>Email:</label>
            <span>{userData.email}</span>
          </div>
          <div className="detail-row">
            <label>Phone:</label>
            <span>{userData.phone}</span>
          </div>
          {userData.dob && (
            <div className="detail-row">
              <label>Date of Birth:</label>
              <span>{new Date(userData.dob).toLocaleDateString()}</span>
            </div>
          )}
          {userData.gender && (
            <div className="detail-row">
              <label>Gender:</label>
              <span>{userData.gender}</span>
            </div>
          )}
          
          <h3>Address Information</h3>
          <div className="detail-row">
            <label>Street:</label>
            <span>{userData.address.street}</span>
          </div>
          <div className="detail-row">
            <label>City:</label>
            <span>{userData.address.city}</span>
          </div>
          <div className="detail-row">
            <label>State:</label>
            <span>{userData.address.state}</span>
          </div>
          <div className="detail-row">
            <label>Postal Code:</label>
            <span>{userData.address.postalCode}</span>
          </div>
          <div className="detail-row">
            <label>Country:</label>
            <span>{userData.address.country}</span>
          </div>
          {userData.address.altPhone && (
            <div className="detail-row">
              <label>Alt Phone:</label>
              <span>{userData.address.altPhone}</span>
            </div>
          )}
        </div>
      ) : (
        <form className="profile-form" onSubmit={handleUpdateProfile}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender || ''} onChange={handleInputChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <h3>Address Information</h3>
          <div className="form-group">
            <label>Street</label>
            <input
              type="text"
              name="address.street"
              value={formData.address?.street || ''}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="address.city"
                value={formData.address?.city || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="address.state"
                value={formData.address?.state || ''}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="address.postalCode"
                value={formData.address?.postalCode || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="address.country"
                value={formData.address?.country || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Alternate Phone</label>
            <input
              type="text"
              name="address.altPhone"
              value={formData.address?.altPhone || ''}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="btn-primary">Save Changes</button>
        </form>
      )}
    </div>
  );
};

const OrdersTab = ({ orders, cancelOrder }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'processing': return 'warning';
      case 'shipped': return 'info';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="tab-content">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-shopping-bag"></i>
          <h3>No orders yet</h3>
          <p>When you place orders, they'll appear here.</p>
        </div>
      ) : (
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.items.length} items</td>
                  <td>${order.totalAmount}</td>
                  <td>
                    <span className={`status-badge status-${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-sm btn-primary">View</button>
                    {order.status === 'processing' && (
                      <button 
                        className="btn-sm btn-danger" 
                        onClick={() => cancelOrder(order._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const WishlistTab = () => {
  return (
    <div className="tab-content">
      <h2>Your Wishlist</h2>
      <div className="empty-state">
        <i className="fas fa-heart"></i>
        <h3>Your wishlist is empty</h3>
        <p>Start adding items you love!</p>
      </div>
    </div>
  );
};

const SettingsTab = () => {
  return (
    <div className="tab-content">
      <h2>Account Settings</h2>
      <div className="settings-form">
        <div className="form-group">
          <label>Notification Preferences</label>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" defaultChecked /> Email notifications
            </label>
            <label>
              <input type="checkbox" defaultChecked /> Order updates
            </label>
            <label>
              <input type="checkbox" /> Promotional offers
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label>Change Password</label>
          <input type="password" placeholder="Current password" />
          <input type="password" placeholder="New password" />
          <input type="password" placeholder="Confirm new password" />
          <button className="btn-primary">Update Password</button>
        </div>
        
        <div className="form-group">
          <label>Account Actions</label>
          <button className="btn-danger">Deactivate Account</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;