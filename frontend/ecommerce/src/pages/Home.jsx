import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SidebarFilters from "../components/SidebarFilters";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);

  // ✅ Load products and user/cart info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile(token);
      fetchUserOrders(token);
      fetchCart(token); // ✅ load cart from backend
    }

    setLoading(true);
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        setFiltered(res.data);

        const cats = [...new Set(res.data.map((p) => p.category))];
        const brs = [...new Set(res.data.map((p) => p.brand))];
        setCategories(cats);
        setBrands(brs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      });
  }, []);

  // ✅ Fetch cart from backend
  const fetchCart = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // ✅ Fetch user profile
  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // ✅ Fetch user orders
  const fetchUserOrders = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  // ✅ Add to Cart (backend)
  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add items to your cart");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/cart",
        { productId: product._id, qty: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart(res.data.items);
      setShowCart(true);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // ✅ Update Quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId, qty: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCart(token);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // ✅ Remove from Cart
  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchCart(token);
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  // ✅ Get Cart Total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.qty, 0);
  };

  // ✅ Checkout -> create order & clear backend cart
  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to complete your order");
        return;
      }

      const orderData = {
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.qty,
          price: item.product.price,
        })),
        totalAmount: getCartTotal(),
        shippingAddress: user?.address || {},
      };

      await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Clear cart in backend
      await axios.delete("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart([]);
      fetchUserOrders(token);
      alert("Order placed successfully!");
      setShowCart(false);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error placing order. Please try again.");
    }
  };

  // ✅ Cancel order
  const cancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `http://localhost:5000/api/orders/${orderId}/cancel`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchUserOrders(token);
        alert("Order cancelled successfully");
      } catch (error) {
        console.error("Error cancelling order:", error);
        alert("Error cancelling order");
      }
    }
  };

  // ✅ Filters
  const applyFilters = useCallback(
    ({ categories: catFilter, brands: brandFilter, priceRange, rating, sortBy, timeFilter, search }) => {
      let temp = [...products];

      if (catFilter?.length > 0) temp = temp.filter((p) => catFilter.includes(p.category));
      if (brandFilter?.length > 0) temp = temp.filter((p) => brandFilter.includes(p.brand));
      temp = temp.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
      if (rating > 0) temp = temp.filter((p) => p.rating >= rating);

      if (search) {
        temp = temp.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (timeFilter) {
        const now = new Date();
        temp = temp.filter((p) => {
          const createdAt = new Date(p.createdAt);
          if (timeFilter === "24h") return now - createdAt <= 24 * 60 * 60 * 1000;
          if (timeFilter === "7d") return now - createdAt <= 7 * 24 * 60 * 60 * 1000;
          if (timeFilter === "30d") return now - createdAt <= 30 * 24 * 60 * 60 * 1000;
          return true;
        });
      }

      if (sortBy === "price-asc") temp.sort((a, b) => a.price - b.price);
      if (sortBy === "price-desc") temp.sort((a, b) => b.price - a.price);
      if (sortBy === "newest") temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (sortBy === "popular") temp.sort((a, b) => (b.sales || 0) - (a.sales || 0));

      setFiltered(temp);
    },
    [products]
  );

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="star-rating">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`star ${
              i < fullStars ? "full" : i === fullStars && hasHalfStar ? "half" : "empty"
            }`}
          >
            ★
          </span>
        ))}
        <span className="rating-count">({Math.floor(Math.random() * 100)})</span>
      </div>
    );
  };

  return (
    <div className="home-container">
      <SidebarFilters categories={categories} brands={brands} onFilter={applyFilters} />

      <div className="main-content">
        <div className="page-header">
          <h1>Discover Authentic Nepali Products</h1>
          <p>Support local artisans and businesses from the heart of the Himalayas</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="results-info">
              <p>Showing {filtered.length} of {products.length} products</p>
              <div className="header-buttons">
                <button className="cart-toggle-btn" onClick={() => setShowCart(!showCart)}>
                  🛒 Cart ({cart.reduce((total, item) => total + item.qty, 0)})
                </button>
                {user && (
                  <button className="orders-toggle-btn" onClick={() => setShowOrders(!showOrders)}>
                    📋 My Orders
                  </button>
                )}
              </div>
            </div>

            <div className="product-grid">
              {filtered.length === 0 ? (
                <div className="no-products">
                  <img
                    src="https://cdni.iconscout.com/illustration/premium/thumb/no-product-found-8867280-7265557.png"
                    alt="No products found"
                  />
                  <h3>No products match your filters</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              ) : (
                filtered.map((product) => (
                  <div key={product._id} className="product-card">
                    <div className="product-badges">
                      {product.createdAt &&
                        new Date() - new Date(product.createdAt) < 7 * 24 * 60 * 60 * 1000 && (
                          <span className="badge new">New</span>
                        )}
                      {product.sales > 50 && <span className="badge popular">Popular</span>}
                      {product.discount > 0 && (
                        <span className="badge discount">-{product.discount}%</span>
                      )}
                    </div>

                    <div className="product-image-container">
                      <img
                        src={
                          product.imageUrl ||
                          "https://via.placeholder.com/300x300?text=Nepal+Product"
                        }
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x300?text=Nepal+Product";
                        }}
                      />

                      <div className="product-overlay">
                        <Link to={`/product/${product._id}`} className="overlay-btn">
                          View
                        </Link>
                      </div>
                    </div>

                    <div className="product-info">
                      <div className="product-brand">{product.brand}</div>
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-desc">
                        {product.description.length > 60
                          ? `${product.description.substring(0, 60)}...`
                          : product.description}
                      </p>
                      <div className="product-meta">
                        {renderStars(product.rating || 0)}
                        <div className="product-price">
                          {product.originalPrice && product.originalPrice > product.price ? (
                            <>
                              <span className="current-price">
                                Rs. {product.price.toLocaleString()}
                              </span>
                              <span className="original-price">
                                Rs. {product.originalPrice.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="current-price">Rs. {product.price.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* ✅ Cart Panel */}
      <div className={`cart-panel ${showCart ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Your Shopping Cart</h2>
          <button className="close-cart" onClick={() => setShowCart(false)}>×</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button className="continue-shopping" onClick={() => setShowCart(false)}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.product._id} className="cart-item">
                  <img
                    src={
                      item.product.imageUrl ||
                      "https://via.placeholder.com/300x300?text=Nepal+Product"
                    }
                    alt={item.product.name}
                  />
                  <div className="cart-item-details">
                    <h4>{item.product.name}</h4>
                    <p>Rs. {item.product.price.toLocaleString()}</p>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.product._id, item.qty - 1)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.qty + 1)}>+</button>
                    </div>
                  </div>
                  <button className="remove-item" onClick={() => removeFromCart(item.product._id)}>
                    ×
                  </button>
                </div>
              ))}

              <div className="cart-total">
                <h3>Total: Rs. {getCartTotal().toLocaleString()}</h3>
              </div>

              <div className="cart-actions">
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
                <button className="continue-shopping" onClick={() => setShowCart(false)}>
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ✅ Orders Panel */}
      <div className={`orders-panel ${showOrders ? "open" : ""}`}>
        <div className="orders-header">
          <h2>Your Order History</h2>
          <button className="close-orders" onClick={() => setShowOrders(false)}>×</button>
        </div>

        <div className="orders-content">
          {orders.length === 0 ? (
            <div className="empty-orders">
              <p>You haven't placed any orders yet</p>
              <button className="continue-shopping" onClick={() => setShowOrders(false)}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-item">
                  <div className="order-header">
                    <div className="order-info">
                      <h4>Order #{order._id.slice(-6).toUpperCase()}</h4>
                      <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="order-status">
                      <span className={`status-${order.status}`}>{order.status}</span>
                      <p>Rs. {order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item._id} className="order-product">
                        <img
                          src={
                            item.product?.imageUrl ||
                            "https://via.placeholder.com/300x300?text=Nepal+Product"
                          }
                          alt={item.product?.name}
                        />
                        <div className="order-product-info">
                          <p>{item.product?.name}</p>
                          <p>Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="more-items">+{order.items.length - 2} more items</p>
                    )}
                  </div>

                  <div className="order-actions">
                    <button className="btn-view">View Details</button>
                    {order.status === "processing" && (
                      <button className="btn-cancel" onClick={() => cancelOrder(order._id)}>
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {(showCart || showOrders) && (
        <div
          className="overlay"
          onClick={() => {
            setShowCart(false);
            setShowOrders(false);
          }}
        ></div>
      )}
    </div>
  );
}

export default Home;
