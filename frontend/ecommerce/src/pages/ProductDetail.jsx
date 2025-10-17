import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError(
          err.response?.data?.message || "Could not fetch product details"
        );
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <p className="product-detail-loading">Loading product...</p>;
  if (error) return <p className="product-detail-error">{error}</p>;

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItemIndex = cart.findIndex(
      (item) => item._id === product._id
    );

    if (existingItemIndex >= 0) {
      cart[existingItemIndex] = {
        ...cart[existingItemIndex],
        quantity: cart[existingItemIndex].quantity + 1,
      };
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✅ Product added to cart!");
  };

  return (
    <div className="product-detail-container">
      <h2>{product.name}</h2>
      <img
        src={
          product.imageUrl ||
          "https://via.placeholder.com/300x300?text=Nepal+Product"
        }
        alt={product.name}
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/300x300?text=Nepal+Product";
        }}
     className="product-detail-image" />
      <p>{product.description}</p>
      <p>
        <b>Price:</b> Rs. {product.price}
      </p>
      <p>
        <b>Category:</b> {product.category}
      </p>

      <button onClick={addToCart} className="product-detail-btn">
        ➕ Add to Cart
      </button>
    </div>
  );
}

export default ProductDetail;
