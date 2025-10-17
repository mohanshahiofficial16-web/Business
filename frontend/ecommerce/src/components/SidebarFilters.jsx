import { useState, useEffect } from "react";
import "./SidebarFilters.css";  // ✅ import external CSS

function SidebarFilters({ categories, brands, onFilter }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [search, setSearch] = useState("");

  // Toggle functions
  const toggleCategory = (cat) =>
    selectedCategories.includes(cat)
      ? setSelectedCategories(selectedCategories.filter((c) => c !== cat))
      : setSelectedCategories([...selectedCategories, cat]);

  const toggleBrand = (brand) =>
    selectedBrands.includes(brand)
      ? setSelectedBrands(selectedBrands.filter((b) => b !== brand))
      : setSelectedBrands([...selectedBrands, brand]);

  // Live filter effect
  useEffect(() => {
    onFilter({
      categories: selectedCategories,
      brands: selectedBrands,
      priceRange,
      rating,
      sortBy,
      timeFilter,
      search,
    });
  }, [selectedCategories, selectedBrands, priceRange, rating, sortBy, timeFilter, search, onFilter]);

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 10000]);
    setRating(0);
    setSortBy("");
    setTimeFilter("");
    setSearch("");
  };

  return (
    <div className="sidebar">
      <h3 className="sidebar-heading">🔍 Filters</h3>

      {/* Search */}
      <div className="sidebar-section">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sidebar-input"
        />
      </div>

      {/* Categories */}
      <div className="sidebar-section">
        <h4 className="sidebar-subheading">Categories</h4>
        {categories.map((cat, i) => (
          <div key={i}>
            <input
              type="checkbox"
              id={cat}
              checked={selectedCategories.includes(cat)}
              onChange={() => toggleCategory(cat)}
            />
            <label htmlFor={cat} className="sidebar-label">{cat}</label>
          </div>
        ))}
      </div>

      {/* Brands */}
      <div className="sidebar-section">
        <h4 className="sidebar-subheading">Brands</h4>
        {brands.map((brand, i) => (
          <div key={i}>
            <input
              type="checkbox"
              id={brand}
              checked={selectedBrands.includes(brand)}
              onChange={() => toggleBrand(brand)}
            />
            <label htmlFor={brand} className="sidebar-label">{brand}</label>
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div className="sidebar-section">
        <h4 className="sidebar-subheading">Price Range</h4>
        <input
          type="number"
          value={priceRange[0]}
          onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
          className="sidebar-input"
          placeholder="Min"
        />
        <input
          type="number"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
          className="sidebar-input"
          placeholder="Max"
        />
      </div>

      {/* Rating */}
      <div className="sidebar-section">
        <h4 className="sidebar-subheading">Customer Rating</h4>
        {[4, 3, 2, 1].map((r) => (
          <div key={r}>
            <input
              type="radio"
              name="rating"
              id={`rating-${r}`}
              checked={rating === r}
              onChange={() => setRating(r)}
            />
            <label htmlFor={`rating-${r}`} className="sidebar-label">
              {"⭐".repeat(r)} & up
            </label>
          </div>
        ))}
      </div>

      {/* Sort */}
      <div className="sidebar-section">
        <h4 className="sidebar-subheading">Sort By</h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sidebar-select"
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Time Filter */}
      <div className="sidebar-section">
        <h4 className="sidebar-subheading">Recently Added</h4>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="sidebar-select"
        >
          <option value="">All Time</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      <button onClick={handleClearAll} className="sidebar-button clear-btn">
        Clear All
      </button>
    </div>
  );
}

export default SidebarFilters; // fixed a error