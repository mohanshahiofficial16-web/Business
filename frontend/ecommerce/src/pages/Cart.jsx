import React, { useEffect, useState } from "react";
import axios from "axios";

function AddCartForm({ products, token }) {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    // Fetch user's cart on load
    axios
      .get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCart(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return alert("Select a product");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart",
        { productId: selectedProduct, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data);
      setQuantity(1);
      alert("Added to cart!");
    } catch (err) {
      console.error(err);
      alert("Error adding to cart");
    }
  };

  return (
    <div>
      <h2>Add to Cart</h2>
      <form onSubmit={handleAddToCart}>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">-- Select Product --</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} (${p.price})
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <button type="submit">Add to Cart</button>
      </form>

      <h3>Your Cart:</h3>
{cart?.items?.length > 0 ? (
  <ul>
    {cart.items.map((item) => (
      <li key={item.product._id}>
        {item.product.name} - {item.quantity} × ${item.product.price}
      </li>
    ))}
  </ul>
) : (
  <p>Cart is empty</p>
)}

    </div>
  );
}

export default AddCartForm;
