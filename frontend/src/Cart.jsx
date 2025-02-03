import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to remove items from your cart');
        // You might want to redirect to login page here
        return;
      }
      // const response = await axios.delete('/api/cart/remove', { itemId }, {
      //   headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, data: { itemId } 
      // });
      const response = await axios.delete('/api/cart/remove', {
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        },
        data: { itemId }  // For DELETE requests, the body goes in the data property
      });

      console.log('Remove from cart response:', response.data);
      setCartItems(response.data.cart);
      alert('Item successfully removed from cart');
    } catch (error) {
      console.error('Full error details:', error);
      if (error.response) {
        console.error('Server responded with error:', error.response.data);
        console.error('Status code:', error.response.status);
        alert(error.response.data.message || 'Failed to remove item from cart');
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('No response from server. Please check your connection.');
      } else {
        console.error('Error setting up request:', error.message);
        alert(error.message);
      }
    }
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/cart/checkout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems([]);
      alert(`Checkout successful! Your OTP is: ${response.data.otp}\nPlease save this OTP to complete the transaction with the seller.`);
      //navigate('/deliver-items');
    } catch (error) {
      // console.error('Error during checkout:', error);
      // if (error.response && error.response.data && error.response.data.alreadyCheckedOutItems) {
      //   alert('Some items have already been checked out by other users. Please remove these items from your cart.');
      //   setCartItems(cartItems.filter(item => !error.response.data.alreadyCheckedOutItems.some(checkedOutItem => checkedOutItem._id === item._id)));
      // } else {
      //   alert('Failed to checkout');
      // }

      console.error('Error during checkout:', error);
      if (error.response && error.response.data && error.response.data.alreadyCheckedOutItems) {
        const itemNames = error.response.data.alreadyCheckedOutItems.map(item => item.itemName).join(', ');
        alert(`The following items have already been checked out by other users: ${itemNames}. Please remove these items from your cart.`);
      } else {
        alert('Failed to checkout');
      }
      }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

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
      {/* <div className="cart-container">
        <h2>My Cart</h2>
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((cartItem) => (
              <div key={cartItem._id} className="cart-item">
                <h3>{cartItem.itemName}</h3>
                <p>Price: ${cartItem.price}</p>
                <p>Description: {cartItem.description}</p>
                <button className="btn btn-remove-from-cart" onClick={() => handleRemoveFromCart(cartItem._id)}>Remove from Cart</button>
              </div>
            ))}
            <div className="cart-total">
              <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
              <button className="btn btn-checkout" onClick={handleCheckout}>Checkout</button>
            </div>
          </>
        ) : (
          <p>No items in cart.</p>
        )}
      </div> */}
       <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="text-center">My Cart</h2>
        </div>
      </div>

      {cartItems.length > 0 ? (
        <>
          <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
            {cartItems.map((cartItem) => (
              <div key={cartItem._id} className="col">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title h5">{cartItem.itemName}</h3>
                    <div className="card-text">
                      <p className="mb-2">
                        <strong>Price:</strong> ${cartItem.price}
                      </p>
                      <p className="mb-3">
                        <strong>Description:</strong> {cartItem.description}
                      </p>
                      <div className="d-grid">
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleRemoveFromCart(cartItem._id)}
                        >
                          Remove from Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="card-title h5 mb-0">
                      Total Price: ${totalPrice.toFixed(2)}
                    </h3>
                    <button 
                      className="btn btn-primary"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="row">
          <div className="col">
            <div className="alert alert-info text-center" role="alert">
              No items in cart.
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default Cart;