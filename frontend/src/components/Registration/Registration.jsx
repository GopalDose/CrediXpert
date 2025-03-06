import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Registration.css";
import backgroundImage from "../../assets/images/bg.jpg";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        toast.success(`Login attempt successful as ${loginType}!`);
      } else {
        toast.success("Registration successful!");
      }
    } catch (error) {
      toast.error("An error occurred!");
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
            <h2 className="form-title">
              {isLogin ? "Login" : "Registration"}
            </h2>

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