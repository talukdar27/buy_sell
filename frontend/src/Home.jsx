import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function Home() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    contactNumber: "",
  });
  const [itemData, setItemData] = useState({
    itemName: "",
    price: "",
    description: "",
    category: "Clothes",
  });
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          age: response.data.age,
          contactNumber: response.data.contactNumber,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchUserItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/items/my-items", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching user items:", error);
      }
    };

    fetchUserDetails();
    fetchUserItems();
  }, []);

  const handleLogout = () => {
    // Clear the token from localStorage or state
    localStorage.removeItem("token");
    // Redirect to the login page
    window.location.href = "/login";
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("/api/auth/user", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setItemData((prevItemData) => ({
      ...prevItemData,
      [name]: value,
    }));
  };

  const handleItemFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/items", itemData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Item added successfully");
      setItemData({
        itemName: "",
        price: "",
        description: "",
        category: "Clothes",
      });
      // Fetch the updated list of items
      const response = await axios.get("/api/items/my-items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(response.data);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/auth/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear form and show success
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      alert("Password updated successfully");
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || "Error updating password"
      );
    }
  };

  return (
    <div className="home">
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#727D73" }}
      >
        <div className="container">
          <a
            className="navbar-brand d-flex align-items-center me-auto"
            href="#"
          >
            <img
              src="/650c7525713f5d255e612a01_Best-places-to-buy-websites.jpg"
              alt="Buy&Sell Icon"
              className="navbar-icon"
            />
            Buy&Sell
          </a>
          <div className="navbar-links">
            <Link to="/home" className="nav-link">
              Home
            </Link>
            <Link to="/search-items" className="nav-link">
              Search-Items
            </Link>
            <Link to="/order-history" className="nav-link">
              Order-History
            </Link>
            <Link to="/deliver-items" className="nav-link">
              Deliver-Items
            </Link>
            <Link to="/cart" className="nav-link">
              My Cart
            </Link>
            <Link to="/support" className="nav-link">
              Support
            </Link>
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* User Details Section */}
      <div className="user-details container mt-4">
        {user ? (
          isEditing ? (
            <form onSubmit={handleFormSubmit}>
              <h2>Edit User Details</h2>
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age:</label>
                <input
                  type="number"
                  name="age"
                  className="form-control"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Number:</label>
                <input
                  type="text"
                  name="contactNumber"
                  className="form-control"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <h2>User Details</h2>
              <p>First Name: {user.firstName}</p>
              <p>Last Name: {user.lastName}</p>
              <p>Email: {user.email}</p>
              <p>Age: {user.age}</p>
              <p>Contact Number: {user.contactNumber}</p>
              {/* <button className="btn btn-edit" onClick={handleEditClick}>Edit</button> */}
              <div className="buttons-container">
                <button className="btn btn-edit" onClick={handleEditClick}>
                  Edit
                </button>
                <button
                  className="btn btn-edit ms-2"
                  onClick={() => setShowPasswordForm(true)}
                >
                  Change Password
                </button>
              </div>
            </div>
          )
        ) : (
          <p>Loading user details...</p>
        )}

        {/* Password Change Form */}
        {showPasswordForm && !isEditing && (
          <div className="password-change-form mt-4">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Current Password:</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-control"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              {passwordError && (
                <div className="alert alert-danger">{passwordError}</div>
              )}
              <button type="submit" className="btn btn-primary">
                Update Password
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordError("");
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Sell Item Section */}
      <div className="Sell-item-add container mt-5">
        <h2>Sell Item</h2>
        <form onSubmit={handleItemFormSubmit}>
          <div className="form-group">
            <label>Name of Item:</label>
            <input
              type="text"
              name="itemName"
              className="form-control"
              value={itemData.itemName}
              onChange={handleItemInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={itemData.price}
              onChange={handleItemInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              className="form-control"
              value={itemData.description}
              onChange={handleItemInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select
              name="category"
              className="form-control"
              value={itemData.category}
              onChange={handleItemInputChange}
              required
            >
              <option value="Clothes">Clothes</option>
              <option value="Personal Accessories">Personal Accessories</option>
              <option value="Electronics">Electronics</option>
              <option value="Food">Food</option>
              <option value="Room Accessories">Room Accessories</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Add Item
          </button>
        </form>
      </div>

      <hr className="black-line" />

      {/* My Items Section */}
      <div className="my-items container mt-5">
        <h2>My Items</h2>
        <div className="row">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item._id} className="col-md-4 mb-4">
                <div className="item-card border p-3">
                  <h3>{item.itemName}</h3>
                  <p>
                    <strong>Price:</strong> ${item.price}
                  </p>
                  <p>
                    <strong>Description:</strong> {item.description}
                  </p>
                  <p>
                    <strong>Category:</strong> {item.category}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No items found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
