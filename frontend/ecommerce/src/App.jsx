import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Service from "./pages/Service";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import AdminAddProduct from "./pages/AdminAddProduct";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DashboardRedirect from "./components/DashboardRedirect"; // optional redirect component
import "./App.css";

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <Header cartCount={cartCount} onSearch={setSearchQuery} />

      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/add" element={<AdminAddProduct />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Dashboard redirect based on role */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* Separate user/admin dashboards */}
        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
