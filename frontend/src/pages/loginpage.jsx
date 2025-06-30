// src/pages/LoginPage.jsx
import React from "react";
import "../styles/loginpage.css";
import LoginForm from "../components/loginform";


function LoginPage() {
  return (
    <div className="login-wrapper">
      <div className="login-main">
        <div className="login-left">left</div>
        <div className="login-right">
            <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
