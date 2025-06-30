// src/components/LoginForm.jsx
import React from "react";
import "../styles/loginform.css"; // Create this file for form-specific styles
import logo from "../assets/logonew.png"

function LoginForm() {
  return (
    <div className="login-form">
      <div className="logo"><img src={logo} alt="Logo" className="logo-class" />
      </div>

      <form>
        <label>Email</label>
        <input type="email" placeholder="Email" />

        <label>Password</label>
        <input type="password" placeholder="Password" />

        <div className="form-extras">
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit" className="sign-in-btn">Sign in</button>

        <div className="divider">
          <hr /> <span>or</span> <hr />
        </div>

        <button className="google-btn">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
            alt="Google"
          />
          Sign in with Google
        </button>

        <p className="bottom-text">
          Are you new? <a href="#">Create Account</a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
