// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './order_history.css';

// function OrderHistory() {
//   const [orderHistory, setOrderHistory] = useState({ soldItems: [], boughtItems: [], pendingOrders: [] });
//   const [activeTab, setActiveTab] = useState('sold');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrderHistory = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('/api/order-history', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setOrderHistory(response.data);
//       } catch (error) {
//         console.error('Error fetching order history:', error);
//       }
//     };

//     fetchOrderHistory();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     window.location.href = '/login';
//   };

//   // const renderOrders = (orders) => {
//   //   return orders.length > 0 ? (
//   //     orders.map((order) => (
//   //       <div key={order._id} className="order-item">
//   //         <h3>{order.itemId.itemName}</h3>
//   //         <p>Price: ${order.itemId.price}</p>
//   //         <p>Description: {order.itemId.description}</p>
//   //         <p>Status: {order.status}</p>
//   //       </div>
//   //     ))
//   //   ) : (
//   //     <p>No orders available.</p>
//   //   );
//   // };

//   const renderOrders = (orders, type) => {
//     if (!Array.isArray(orders) || orders.length === 0) {
//       return <p>No orders available.</p>;
//     }

//     return orders.map((order) => {
//       // For pending orders, get item details from itemId
//       // const item = type === 'pending' ? order.itemId : order;

//       let item;
//       if (type === 'pending') {
//         // For pending orders, the item details are nested in itemId
//         item = order.itemId || {};
//       } else {
//         // For sold and bought items, the details are directly on the order
//         item = order;
//       }

//       if (!item) {
//         console.warn('Invalid order data:', order);
//         return null;
//       }

//       return (
//         <div key={item._id} className="order-item">
//           <h3>{item.itemId.itemName}</h3>
//           <p>Price: ${item.price}</p>
//           <p>Description: {item.itemId.description}</p>
//           <p>Category: {item.itemId.category}</p>
//           <p>Status: {item.status}</p>
//         </div>
//       );
//     });
//   };

//   return (
//     <>
//       <nav className="navbar">
//         <div className="navbar-brand">
//           <img src="/650c7525713f5d255e612a01_Best-places-to-buy-websites.jpg" alt="Buy&Sell Icon" className="navbar-icon" />
//           Buy&Sell
//         </div>
//         <div className="navbar-links">
//           <Link to="/home" className="nav-link">Home</Link>
//           <Link to="/search-items" className="nav-link">Search-Items</Link>
//           <Link to="/order-history" className="nav-link">Order-History</Link>
//           <Link to="/deliver-items" className="nav-link">Deliver-Items</Link>
//           <Link to="/cart" className="nav-link">My Cart</Link>
//           <Link to="/link5" className="nav-link">Support</Link>
//           <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
//         </div>
//       </nav>
//       <div className="order-history-container">
//         <h2>Order History</h2>
//         <div className="tabs">
//           <button className={`tab ${activeTab === 'sold' ? 'active' : ''}`} onClick={() => setActiveTab('sold')}>Items Sold</button>
//           <button className={`tab ${activeTab === 'bought' ? 'active' : ''}`} onClick={() => setActiveTab('bought')}>Items Bought</button>
//           <button className={`tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Pending Orders</button>
//         </div>
//         <div className="orders">
//           {activeTab === 'sold' && renderOrders(orderHistory.soldItems)}
//           {activeTab === 'bought' && renderOrders(orderHistory.boughtItems)}
//           {activeTab === 'pending' && renderOrders(orderHistory.pendingOrders)}
//         </div>
//       </div>
//     </>
//   );
// }

// export default OrderHistory;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./order_history.css";

function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState({
    soldItems: [],
    boughtItems: [],
    pendingOrders: [],
  });
  const [activeTab, setActiveTab] = useState("sold");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/order-history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrderHistory(response.data);
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    };

    fetchOrderHistory();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const renderOrders = (orders, type) => {
    if (!Array.isArray(orders) || orders.length === 0) {
      return <p>No orders available.</p>;
    }

    return orders.map((order) => {
      let item;

      if (type === "pending") {
        // For pending orders, the item details are nested in itemId
        item = order.itemId || {};
      } else {
        // For sold and bought items, the details are directly on the order
        item = order;
      }

      if (!item) {
        console.warn("Invalid order data:", order);
        return null;
      }

      return (
        <div key={item._id} className="order-item">
          <h3>{item.itemName}</h3>
          <p>Price: ${item.price}</p>
          <p>Description: {item.description}</p>
          <p>Category: {item.category}</p>
          <p>Status: {item.status}</p>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg #F0F0D7">
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
      <div className="flex-1 overflow-hidden">
      <div className="container mt-4">
        <h2 className="text-center font-semibold text-xl">Order History</h2>
        <div className="nav nav-tabs flex justify-center gap-2 mb-3">
          <button
            className={`nav-link px-4 py-2 text-black hover:text-black focus:text-black ${
              activeTab === "sold"
                ? "border-b-2 border-black font-medium"
                : "opacity-75"
            }`}
            onClick={() => setActiveTab("sold")}
          >
            Items Sold
          </button>
          <button
            className={`nav-link px-4 py-2 text-black hover:text-black focus:text-black ${
              activeTab === "bought"
                ? "border-b-2 border-black font-medium"
                : "opacity-75"
            }`}
            onClick={() => setActiveTab("bought")}
          >
            Items Bought
          </button>
          <button
            className={`nav-link px-4 py-2 text-black hover:text-black focus:text-black ${
              activeTab === "pending"
                ? "border-b-2 border-black font-medium"
                : "opacity-75"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Orders
          </button>
        </div>
        <div className="orders">
          {activeTab === "sold" && renderOrders(orderHistory.soldItems, "sold")}
          {activeTab === "bought" &&
            renderOrders(orderHistory.boughtItems, "bought")}
          {activeTab === "pending" &&
            renderOrders(orderHistory.pendingOrders, "pending")}
        </div>
      </div>
      </div>
    </div>
  );
}

export default OrderHistory;
