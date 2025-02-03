# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


Introduction

This project is a dedicated Buy-Sell web portal for the IIIT Hyderabad community, developed using the MERN stack. The website allows users to act as both buyers and sellers while facilitating transactions without the 10% tax imposed by Whatscap.

Tech Stack

Frontend: React.js

Backend: Express.js (Node.js)

Database: MongoDB

Authentication: JSON Web Tokens (JWT) and bcrypt.js for password hashing

Security: Google Recaptcha/LibreCaptcha, CASLogin (Bonus)

Features

User Management

User Registration with validation for IIIT emails

Secure Login/Logout with session persistence

User Profile with editing capabilities

Item Listings & Search

Search bar with case-insensitive search functionality

Category-based filtering

Item detail page with name, price, seller, and description

Option to add items to "My Cart"

Order Management

Orders History: Track all past and pending orders

Delivery Management: Sellers can view orders and complete transactions using OTP validation

"My Cart" functionality with checkout system

Secure OTP-based order confirmation, OTP is hashed in database 

Additional Features

Navbar for easy navigation across pages

Authentication and authorization using JWT tokens

AI-powered chatbot for user support (Bonus feature)