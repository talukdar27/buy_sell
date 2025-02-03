import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Search_items.css';

function SearchItems() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sellers, setSellers] = useState({});
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedCategories, setSelectedCategories] = useState({
    Clothes: false,
    'Personal Accessories': false,
    Electronics: false,
    Food: false,
    'Room Accessories': false,
  });

  useEffect(() => {
    const fetchOtherItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/items/other-items', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Filter out sold items
        const availableItems = response.data.filter(item => item.status !== 'Sold');
        setItems(availableItems);

        // Fetch seller details for each item
        const sellerPromises = availableItems.map(item =>
          axios.get(`/api/auth/user/${item.userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );

        const sellerResponses = await Promise.all(sellerPromises);
        const sellersData = sellerResponses.reduce((acc, res, index) => {
          acc[availableItems[index].userId] = res.data;
          return acc;
        }, {});

        setSellers(sellersData);
      } catch (error) {
        console.error('Error fetching items or sellers:', error);
      }
    };

    fetchOtherItems();
  }, []);

  const handleLogout = () => {
    // Clear the token from localStorage or state
    localStorage.removeItem('token');
    // Redirect to the login page
    window.location.href = '/login';
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prevPriceRange) => ({
      ...prevPriceRange,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const { name, checked } = e.target;
    setSelectedCategories((prevSelectedCategories) => ({
      ...prevSelectedCategories,
      [name]: checked,
    }));
  };

  const filteredItems = items.filter((item) => {
    const matchesSearchQuery = item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriceRange = item.price >= priceRange.min && item.price <= priceRange.max;
    const selectedCategoryKeys = Object.keys(selectedCategories).filter(key => selectedCategories[key]);
    const matchesCategory = selectedCategoryKeys.length === 0 || selectedCategories[item.category];
    return matchesSearchQuery && matchesPriceRange && matchesCategory;
  });

  return (
   
    <div className="seach-items">
  <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#727D73" }}>
      <div className="container">
        <a className="navbar-brand d-flex align-items-center me-auto" href="#">
          <img
            src="/650c7525713f5d255e612a01_Best-places-to-buy-websites.jpg"
            alt="Buy&Sell Icon"
            className="navbar-icon"
          />
          Buy&Sell
        </a>
        <div className="navbar-links">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/search-items" className="nav-link">Search-Items</Link>
          <Link to="/order-history" className="nav-link">Order-History</Link>
          <Link to="/deliver-items" className="nav-link">Deliver-Items</Link>
          <Link to="/cart" className="nav-link">My Cart</Link>
          <Link to="/support" className="nav-link">Support</Link>
          <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>

  <div className="search-bar container mt-4">
    <form onSubmit={handleSearch} className="input-group">
      <input
        type="text"
        placeholder="Search items..."
        className="form-control"
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      <button type="submit" className="btn btn-outline-secondary">
        <img src="/search-icon.png" alt="Search" className="search-icon" />
      </button>
    </form>
  </div>

  <div className="content-container container mt-5">
    <div className="row">
      {/* Filter Box */}
      <div className="col-md-3">
        <div className="card">
          <div className="card-body">
            <h3>Filter Items</h3>
            <div className="price-range">
              <label>
                Min Price:
                <input
                  type="number"
                  name="min"
                  value={priceRange.min}
                  onChange={handlePriceRangeChange}
                  className="form-control"
                />
              </label>
              <label>
                Max Price:
                <input
                  type="number"
                  name="max"
                  value={priceRange.max}
                  onChange={handlePriceRangeChange}
                  className="form-control"
                />
              </label>
            </div>
            <div className="categories mt-3">
              <h4>Categories</h4>
              {Object.keys(selectedCategories).map((category) => (
                <label key={category} className="form-check-label">
                  <input
                    type="checkbox"
                    name={category}
                    checked={selectedCategories[category]}
                    onChange={handleCategoryChange}
                    className="form-check-input"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="col-md-9">
        <div className="row">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Link
                to={`/items/${item._id}`}
                key={item._id}
                className="col-md-4 mb-4 text-decoration-none"
              >
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{item.itemName}</h5>
                    <p className="card-text">Price: ${item.price}</p>
                    <p className="card-text">Seller: {sellers[item.userId]?.firstName} {sellers[item.userId]?.lastName}</p>
                    <p className="card-text">Category: {item.category}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No items found.</p>
          )}
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default SearchItems;
