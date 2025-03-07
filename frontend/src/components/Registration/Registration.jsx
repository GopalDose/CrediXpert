import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Registration.css";
import backgroundImage from "../../assets/images/bg.jpg";
import { useNavigate } from "react-router-dom";

function Registration() {
  const [isLogin, setIsLogin] = useState(false);
  const [loginType, setLoginType] = useState("user"); // "user" or "bank"
  const [formData, setFormData] = useState({
    tan: "",
    email: "",
    password: "",
    companyName: "",
    founderName: "",
    industry: "",
    foundingYear: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Handle login
        const loginEndpoint =
          loginType === "bank"
            ? "http://127.0.0.1:5000/bank-login"
            : "http://127.0.0.1:5000/login";

        const loginData = {
          email: formData.email,
          password: formData.password,
          ...(loginType === "user" && { tan: formData.tan }),
        };

        const response = await fetch(loginEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });

        const result = await response.json();
        if (response.ok) {
          toast.success(`Login successful as ${loginType}!`);
          localStorage.setItem("token", result.access_token); // Store JWT token
          setTimeout(() => {
            navigate("/admin-dashboard");
          }, 1500);
        } else {
          throw new Error(result.error || "Login failed");
        }
      } else {
        // Handle registration
        const response = await fetch("http://127.0.0.1:5000/register", { // Changed to /register
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
          toast.success(result.message || "Registration successful!");
          setFormData({
            tan: "",
            email: "",
            password: "",
            companyName: "",
            founderName: "",
            industry: "",
            foundingYear: "",
          });
          setIsLogin(true)
        } else {
          throw new Error(result.error || "Registration failed");
        }
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        className="page-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="form-container">
          <form className="startup-form" onSubmit={handleSubmit}>
            <h2 className="form-title">{isLogin ? "Login" : "Registration"}</h2>

            {/* Login Type Selection */}
            {isLogin && (
              <div className="form-group full-width">
                <label>Login As</label>
                <select
                  name="loginType"
                  value={loginType}
                  onChange={(e) => setLoginType(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="bank">Bank</option>
                </select>
              </div>
            )}

            {/* Bank Login Fields */}
            {isLogin && loginType === "bank" && (
              <>
                <div className="form-group full-width">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </>
            )}

            {/* User Login Fields */}
            {isLogin && loginType === "user" && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>TAN</label>
                    <input
                      type="text"
                      name="tan"
                      value={formData.tan}
                      onChange={handleChange}
                      placeholder="Enter TAN"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </>
            )}

            {/* Registration Fields (User only) */}
            {!isLogin && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>TAN</label>
                    <input
                      type="text"
                      name="tan"
                      value={formData.tan}
                      onChange={handleChange}
                      placeholder="Enter TAN"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Founder Name</label>
                    <input
                      type="text"
                      name="founderName"
                      value={formData.founderName}
                      onChange={handleChange}
                      placeholder="Enter founder name"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Industry</label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Industry</option>
                      <option value="tech">Technology</option>
                      <option value="health">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Founding Year</label>
                    <input
                      type="number"
                      name="foundingYear"
                      value={formData.foundingYear}
                      onChange={handleChange}
                      placeholder="Enter year"
                      min="1900"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="submit-btn">
              {isLogin ? "Login" : "Register"}
            </button>

            <p className="toggle-text">
              {isLogin ? "Need to register?" : "Already registered?"}
              <span
                className="toggle-link"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign Up" : "Login"}
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Registration;