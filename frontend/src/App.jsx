// import './App.css';
// import Signup from './Signup';
// import Login from './Login';
// import Home from './Home';
// import SearchItems from './Search_items';
// import Cart from './Cart';
// import ItemDetails from './ItemDetails'; 
// import DeliverItems from './DeliverItems';
// import OrderHistory from './order_history';
// import Support from './support';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const checkToken = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const response = await axios.get('/api/auth/user', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           if (response.status === 200) {
//             setIsAuthenticated(true);
//           }
//         } catch (error) {
//           console.error('Token validation error:', error);
//         }
//       }
//       setIsLoading(false);
//     };

//     checkToken();
//   }, []);

//   useEffect(() => {
//     console.log('isAuthenticated:', isAuthenticated); // Debugging statement
//   }, [isAuthenticated]);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Router>
//       <div className="app-container">
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/home" element={<Home /> } />
//           <Route path="/search-items" element={<SearchItems /> } />
//           <Route path="/cart" element={<Cart /> } />
//           <Route path="/items/:id" element={ <ItemDetails /> } />
//           <Route path="/deliver-items" element={<DeliverItems />} />
//           <Route path="/order-history" element={<OrderHistory />} />
//           <Route path="/support" element={<Support />} />
//           <Route path="/" element={<Home/> } />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


import './App.css';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import SearchItems from './Search_items';
import Cart from './Cart';
import ItemDetails from './ItemDetails'; 
import DeliverItems from './DeliverItems';
import OrderHistory from './order_history';
import Support from './support';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

// New Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/auth/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Token validation error:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkToken();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/signup" />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Wrap protected routes with ProtectedRoute */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/search-items" 
            element={
              <ProtectedRoute>
                <SearchItems />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/items/:id" 
            element={
              <ProtectedRoute>
                <ItemDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/deliver-items" 
            element={
              <ProtectedRoute>
                <DeliverItems />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-history" 
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/support" 
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            } 
          />
          
          {/* Default route */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;