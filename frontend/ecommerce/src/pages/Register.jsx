import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    dob: "",
    gender: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nepal",
    altPhone: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const { name, email, phone, password, street, city, state } = formData;
    if (!name || !email || !phone || !password || !street || !city || !state) {
      setMessage("❌ Please fill all required fields");
      return;
    }

    try {
      const data = new FormData();

      // Append form data
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      // Append profile picture
      if (profilePic) data.append("profilePic", profilePic);

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("✅ Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error(error.response?.data || error.message);
      // Show backend message like "User already exists"
      setMessage(
        error.response?.data?.message || "❌ Registration failed. Try again."
      );
    }
  };

  return (
    <div className="register-container">
      <h2>Create Your Account</h2>
      {message && <p className="register-message">{message}</p>}

      <form
        onSubmit={handleSubmit}
        className="register-form"
        encType="multipart/form-data"
      >
        {/* Basic Info */}
        <input
          type="text"
          name="name"
          placeholder="Full Name *"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone *"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password *"
          onChange={handleChange}
          required
        />

        {/* Profile & Details */}
        <input
          type="file"
          name="profilePic"
          accept="image/*"
          onChange={handleFileChange}
        />
        <input type="date" name="dob" onChange={handleChange} />
        <select name="gender" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {/* Address */}
        <input
          type="text"
          name="street"
          placeholder="Street *"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City *"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State *"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal / ZIP"
          onChange={handleChange}
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />
        <input
          type="text"
          name="altPhone"
          placeholder="Alternate Phone"
          onChange={handleChange}
        />

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account?{" "}
        <span className="register-link" onClick={() => navigate("/login")}>
          Login here
        </span>
      </p>
    </div>
  );
}

export default Register;
