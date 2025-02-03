import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ItemDetails.css';

function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/items/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItem(response.data);
        console.log('Item details:', response.data); // Print item details in the console

        // Fetch seller details
        const sellerResponse = await axios.get(`/api/auth/user/${response.data.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSeller(sellerResponse.data);
        console.log('Seller details:', sellerResponse.data); // Print seller details in the console
      } catch (error) {
        console.error('Error fetching item or seller details:', error);
      }
    };

    fetchItemDetails();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      if (!item || !item._id) {
        throw new Error('Invalid item details');
      }
      console.log('Adding to cart - Item ID:', item._id);


      await axios.post('/api/cart/add', { itemId: item._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Item added to cart successfully');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  if (!item || !seller) {
    return <div>Loading item details...</div>;
  }

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
          <button className="btn btn-logout" onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}>Logout</button>
        </div>
        </div>
      </nav>



      {/* <div className="item-details">
        <h2>{item.itemName}</h2>
        <p>Item ID: {item._id}</p>
        <p>Price: ${item.price}</p>
        <p>Description: {item.description}</p>
        <p>Category: {item.category}</p>
        <p>Seller Name: {seller.firstName} {seller.lastName}</p>
        <p>Seller ID: {seller._id}</p>
        <button className="btn btn-add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
      </div> */}

<div className="container d-flex justify-content-center align-items-center min-vh-100">
  <div className="card" style={{ maxWidth: '800px' }}>
    <div className="card-body">
      <h2 className="card-title">{item.itemName}</h2>
      <div className="card-text">
        <p className="mb-1"><strong>Item ID:</strong> {item._id}</p>
        <p className="mb-1"><strong>Price:</strong> ${item.price}</p>
        <p className="mb-1"><strong>Description:</strong> {item.description}</p>
        <p className="mb-1"><strong>Category:</strong> {item.category}</p>
        <p className="mb-1"><strong>Seller:</strong> {seller.firstName} {seller.lastName}</p>
        <p className="mb-1"><strong>Seller ID:</strong> {seller._id}</p>
      </div>
      <button 
        className="btn btn-primary w-100 mt-3" 
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  </div>
</div>
    </>
  );
}

export default ItemDetails;
