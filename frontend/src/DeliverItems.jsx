import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './DeliverItems.css';

function DeliverItems() {
  const [deliverItems, setDeliverItems] = useState([]);
  const [showOtpInput, setShowOtpInput] = useState({});
  const [otp, setOtp] = useState('');
  const [selectedDeliverItemId, setSelectedDeliverItemId] = useState(null);

  useEffect(() => {
    const fetchDeliverItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/deliver-items', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data)) {
          setDeliverItems(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setDeliverItems([]);
        }
      } catch (error) {
        console.error('Error fetching deliver items:', error);
        setDeliverItems([]);
      }
    };

    fetchDeliverItems();
  }, []);

  const handleLogout = () => {
    // Clear the token from localStorage or state
    localStorage.removeItem('token');
    // Redirect to the login page
    window.location.href = '/login';
  };

  const handleCompleteTransaction = (deliverItemId) => {
    setShowOtpInput((prev) => ({ ...prev, [deliverItemId]: true }));
    setSelectedDeliverItemId(deliverItemId);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Sending OTP verification with:', {
        deliverItemId: selectedDeliverItemId,
        otp: otp
      });
      
      const response = await axios.post('/api/deliver-items/complete-transaction', {
        deliverItemId: selectedDeliverItemId,
        otp: otp,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(response.data.message);
      setOtp('');
      setShowOtpInput({});
      setSelectedDeliverItemId(null);

      // Remove the item from the deliverItems state
      setDeliverItems(deliverItems.filter(item => item._id !== selectedDeliverItemId));
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Failed to complete transaction. Please try again.');
    }
  };

  return (
    <>
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

      

<div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="text-center">Items to Deliver</h2>
        </div>
      </div>

      {deliverItems.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {deliverItems.map((item) => (
            <div key={item._id} className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title h5">{item.itemId.itemName}</h3>
                  <div className="card-text">
                    <div className="mb-3">
                      <p className="mb-2">
                        <strong>Price:</strong> ${item.price}
                      </p>
                      <p className="mb-2">
                        <strong>Description:</strong> {item.itemId.description}
                      </p>
                      <p className="mb-2">
                        <strong>Buyer:</strong> {item.buyerId.firstName} {item.buyerId.lastName}
                      </p>
                      <p className="mb-2">
                        <strong>Buyer Email:</strong> {item.buyerId.email}
                      </p>
                    </div>
                    
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleCompleteTransaction(item._id)}
                      >
                        Complete Transaction
                      </button>

                      {showOtpInput[item._id] && (
                        <div className="mt-3">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter OTP"
                              value={otp}
                              onChange={handleOtpChange}
                            />
                            <button 
                              className="btn btn-success"
                              onClick={handleVerifyOtp}
                            >
                              Verify OTP
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="row">
          <div className="col">
            <div className="alert alert-info text-center" role="alert">
              No items to deliver.
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default DeliverItems;