import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "./Signup.css";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const navigate = useNavigate(); // Correctly define navigate using useNavigate

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaValue) {
      setMessage("Please complete the reCAPTCHA verification");
      return;
    }

    // Validate email domain
    const allowedDomains = [
      "@research.iiit.ac.in",
      "@students.iiit.ac.in",
      "@iiit.ac.in",
    ];
    const emailDomain = email.substring(email.lastIndexOf("@"));
    if (!allowedDomains.includes(emailDomain)) {
      setMessage("Signup failed: Only iiit.ac.in email addresses are allowed");
      return;
    }

    try {
      const response = await axios.post("/api/auth/signup", {
        firstName,
        lastName,
        email,
        age,
        contactNumber,
        password,
        recaptchaToken: recaptchaValue,
      });
      setMessage("Signup successful");
      // Save the token in localStorage
      localStorage.setItem("token", response.data.token);
      navigate("/home"); // Redirect to home page
    } catch (error) {
      console.error("Signup error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(`Signup failed: ${error.response.data.message}`);
      } else {
        setMessage("Signup failed: An unknown error occurred");
      }
    }
  };

  return (
    // <div className="whole">
    //   <nav className="navbar">
    //     <div className="navbar-brand">
    //       <img
    //         src="/650c7525713f5d255e612a01_Best-places-to-buy-websites.jpg"
    //         alt="Buy&Sell Icon"
    //         className="navbar-icon"
    //       />
    //       Buy&Sell
    //     </div>
    //   </nav>
      

    //   <div className="app-img">
    //     <img src="/Sale.jpg" alt="Sale" />
    //   </div>
    //   <div className="signup-container container mt-5">
    //     <h2 className="text-center mb-4">SignUp</h2>
    //     <form onSubmit={handleSubmit}>
    //       <div className="form-group">
    //         <label>First Name:</label>
    //         <input
    //           type="text"
    //           className="form-control"
    //           value={firstName}
    //           onChange={(e) => setFirstName(e.target.value)}
    //           required
    //         />
    //       </div>
    //       <div className="form-group">
    //         <label>Last Name:</label>
    //         <input
    //           type="text"
    //           className="form-control"
    //           value={lastName}
    //           onChange={(e) => setLastName(e.target.value)}
    //           required
    //         />
    //       </div>
    //       <div className="form-group">
    //         <label>Email:</label>
    //         <input
    //           type="email"
    //           className="form-control"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           required
    //         />
    //       </div>
    //       <div className="form-group">
    //         <label>Age:</label>
    //         <input
    //           type="number"
    //           className="form-control"
    //           value={age}
    //           onChange={(e) => setAge(e.target.value)}
    //           required
    //         />
    //       </div>
    //       <div className="form-group">
    //         <label>Contact:</label>
    //         <input
    //           type="text"
    //           className="form-control"
    //           value={contactNumber}
    //           onChange={(e) => setContactNumber(e.target.value)}
    //           required
    //         />
    //       </div>
    //       <div className="form-group">
    //         <label>Password:</label>
    //         <input
    //           type="password"
    //           className="form-control"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           required
    //         />
    //       </div>
    //       <button type="submit" className="btn btn-primary btn-block">
    //         Signup
    //       </button>
    //     </form>
    //     {message && <p className="mt-3 text-center text-danger">{message}</p>}
    //     <div>
    //       <br></br>
    //       <h5>
    //         {" "}
    //         If already registered, click here <Link to="/login">Login</Link>
    //       </h5>
    //     </div>
    //   </div>
    // </div>
    <div className="signup">
  <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#727D73" }}>
    <div className="container">
      <a className="navbar-brand d-flex align-items-center " href="#">
        <img
          src="/650c7525713f5d255e612a01_Best-places-to-buy-websites.jpg"
          alt="Buy&Sell Icon"
          className="navbar-icon"
        />
        Buy&Sell
      </a>
    </div>
  </nav>

  {/* <div className="container mt-5 d-flex flex-column align-items-center">
    <div className="app-img mb-4">
      <img
        src="/Sale.jpg"
        alt="Sale"
        className="rounded img-fluid"
        style={{ maxWidth: "600px" }}
      />
    </div> */}

<div className="container mt-5">
  <div className="row">
    <div className="col-md-9">
      <div className="app-img mb-1 " style={{ marginLeft: "-100px" , marginTop: "200px", marginRight: "180px"}}>  
        <img
          src="/Sale.jpg"
          alt="Sale"
          className="rounded img-fluid"
          style={{ maxWidth: "100%" }}
        />
      </div>
    </div>
    </div>
    <div className="signup-container card p-4 shadow-lg" style={{ 
    boxShadow: "0 10px 20px rgba(114, 125, 115, 0.7)",  // Shadow in navbar color
    marginLeft: "850px", 
    marginTop: "-650px"
  }}>
      <h2 className="text-center mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>First Name:</label>
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Last Name:</label>
          <input
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
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
          <label>Age:</label>
          <input
            type="number"
            className="form-control"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Contact:</label>
          <input
            type="text"
            className="form-control"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-4">
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
          Sign Up
        </button>
      </form>
      {message && (
        <p className="mt-3 text-center text-danger">
          {message}
        </p>
      )}
      <div className="text-center mt-3">
        <p>
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  </div>
</div>
  );
}

export default Signup;
