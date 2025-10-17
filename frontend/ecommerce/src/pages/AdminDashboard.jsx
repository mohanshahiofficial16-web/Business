import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [activeTab, setActiveTab] = useState("orders");

  const token = localStorage.getItem("token");

  // 📌 Fetch Analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(res.data);
      } catch (err) {
        console.error("❌ Analytics fetch error:", err);
      }
    };
    fetchAnalytics();
  }, []);

  // 📌 Fetch Orders
  useEffect(() => {
    if (activeTab === "orders") {
      axios
        .get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("❌ Orders fetch error:", err));
    }
  }, [activeTab]);

  // 📌 Fetch Users
  useEffect(() => {
    if (activeTab === "users") {
      axios
        .get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data))
        .catch((err) => console.error("❌ Users fetch error:", err));
    }
  }, [activeTab]);

  // 📌 Update order status
  const updateStatus = async (id, status) => {
    await axios.put(
      `http://localhost:5000/api/orders/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
  };

  // 📌 Delete user
  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    }
  };

  // 📌 Toggle admin role
  const toggleAdmin = async (id) => {
    await axios.put(
      `http://localhost:5000/api/users/${id}/admin`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, isAdmin: !u.isAdmin } : u))
    );
  };

  return (
    <div className="admin-container">
      <h2>👑 Admin Dashboard</h2>

      {/* 📊 Analytics Cards */}
      <div className="analytics-cards">
        <div className="card">
          <h3>Total Users</h3>
          <p>{analytics.totalUsers || 0}</p>
        </div>
        <div className="card">
          <h3>Total Orders</h3>
          <p>{analytics.totalOrders || 0}</p>
        </div>
        <div className="card">
          <h3>Total Revenue</h3>
          <p>Rs. {analytics.totalRevenue || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
      </div>

      {/* Orders Table */}
      {activeTab === "orders" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{o.user?.name} ({o.user?.email})</td>
                <td>Rs. {o.totalAmount}</td>
                <td>{o.paymentMethod}</td>
                <td>{o.status}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Users Table */}
      {activeTab === "users" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name / Email</th>
              <th>Phone</th>
              <th>Admin?</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u._id}</td>
                <td>
                  {u.name} <br />
                  <small>{u.email}</small>
                </td>
                <td>{u.phone}</td>
                <td>{u.isAdmin ? "✅ Yes" : "❌ No"}</td>
                <td>
                  <button onClick={() => toggleAdmin(u._id)}>
                    {u.isAdmin ? "Remove Admin" : "Make Admin"}
                  </button>
                  <button onClick={() => deleteUser(u._id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
