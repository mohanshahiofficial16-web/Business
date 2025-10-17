import { useState } from "react";
import axios from "axios";
import './AdminAddProduct.css';

function AdminAddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: ""
    
  });

  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/products", formData);
      setMessage("✅ " + res.data.message);
      setFormData({ name: "", description: "", price: "", imageUrl: "", category: "" });
    } catch (error) {
      console.error(error);
      setMessage("❌ Error adding product");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-heading">Add New Product</h2>

      {message && <p className="admin-message">{message}</p>}

      <form onSubmit={handleSubmit} className="admin-form">
        <input 
          type="text" name="name" value={formData.name} 
          onChange={handleChange} placeholder="Product Name" required className="admin-input" 
        />
        <textarea 
          name="description" value={formData.description} 
          onChange={handleChange} placeholder="Product Description" className="admin-textarea" 
        />
        <input 
          type="number" name="price" value={formData.price} 
          onChange={handleChange} placeholder="Price (Rs)" required className="admin-input" 
        />
        <input 
          type="text" name="imageUrl" value={formData.imageUrl} 
          onChange={handleChange} placeholder="Image URL" className="admin-input" 
        />
        <input 
          type="text" name="category" value={formData.category} 
          onChange={handleChange} placeholder="Category" className="admin-input" 
        />
        <button type="submit" className="admin-button">Add Product</button>
      </form>
    </div>
  );
}

export default AdminAddProduct;
