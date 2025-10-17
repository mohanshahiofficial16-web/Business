import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("⚠️ Please log in to view your orders.");
          setTimeout(() => navigate("/login"), 1500);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        setMessage("❌ Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) return <p className="orders-loading">Loading orders...</p>;

  return (
    <div className="orders-container">
      <h2 className="orders-heading">📦 My Orders</h2>

      {message && <p className="orders-message">{message}</p>}

      {orders.length === 0 ? (
        <p className="orders-empty">You don’t have any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <h3>Order ID: {order._id}</h3>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> Rs. {order.totalAmount}</p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

              <div className="order-products">
                <h4>🛒 Products:</h4>
                <ul>
                  {order.products.map((p, i) => (
                    <li key={i}>
                      {p.name} x {p.quantity} — Rs. {p.price}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-shipping">
                <h4>🚚 Shipping:</h4>
                <p>
                  {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
  