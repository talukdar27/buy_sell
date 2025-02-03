import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const navigate = useNavigate();

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaValue) {
      setMessage("Please complete the reCAPTCHA verification");
      return;
    }

    try {
      const response = await axios.post("/api/auth/login", { email, password });
      setMessage("Login successful");
      const { token, user } = response.data;
      // Save the token in localStorage
      localStorage.setItem("token", response.data.token);
      // Redirect to home page
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(`Login failed: ${error.response.data.message}`);
      } else {
        setMessage("Login failed: An unknown error occurred");
      }
    }
  };

  return (
    

    <div className="login">
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
        </div>
      </nav>

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-9">
            <div
              className="app-img mb-1"
              style={{ marginLeft: "190px", marginTop: "50px" }}
            >
              <img
                src="/Sale.jpg"
                alt="Sale"
                className="rounded img-fluid"
                style={{ maxWidth: "100%" }}
              />
            </div>
          </div>
        </div>

        <div
          className="login-container card p-4 shadow-lg"
          style={{
            boxShadow: "0 10px 20px rgba(114, 125, 115, 0.7)", // Shadow in navbar color
            marginLeft: "850px",
            marginTop: "-520px",
          }}
        >
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Password:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Add reCAPTCHA component */}
            <div className="form-group mb-4 d-flex justify-content-center">
              <ReCAPTCHA
                sitekey="6Le2jMsqAAAAAJku5P7OpEu4Yl9CaoMzWiltZcuf" // Replace with your actual site key
                onChange={handleRecaptchaChange}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          {message && <p className="mt-3 text-center text-danger">{message}</p>}
          <div className="text-center mt-3">
            <h5>
              If not registered, click here to <Link to="/signup">Signup</Link>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
