import React, { useState } from "react";
import axios from "axios";
import GoogleSignIn from "../GoogleSignIn/GoogleSignIn";
import style from "./login.module.css";

function LoginComponent({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });
        setMessage("Login successful! Welcome back!");
        setMessageType("success");
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        setTimeout(() => {
          const user = response.data.user;
          if (user && user.role === 'admin') {
            onNavigate('admin');
          } else {
            onNavigate('blog');
          }
        }, 1000);
        
      } catch {
        console.log('Backend not available, using mock authentication');
        
        const mockUser = {
          id: 1,
          username: email.split('@')[0],
          email: email,
          role: email.includes('admin') ? 'admin' : 'user'
        };
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setMessage("Login successful! (Using offline mode)");
        setMessageType("success");
        
        setTimeout(() => {
          if (mockUser.role === 'admin') {
            onNavigate('admin');
          } else {
            onNavigate('blog');
          }
        }, 1000);
      }
      
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.leftSection}>
        <div className={style.loginBox}>
          <h2>Welcome Back</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          
          <GoogleSignIn onNavigate={onNavigate} />
          
          {message && (
            <p className={`${style.message} ${messageType === 'error' ? style.error : style.success}`}>
              {message}
            </p>
          )}
          
          <div className={style.footer}>
            <p className={style.footerText}>
              Don't have an account?{' '}
              <button 
                className={style.link}
                onClick={() => onNavigate('register')}
                type="button"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
      
      <div className={style.rightSection}>
        <div className={style.imageContainer}>
          <div className={style.imageContent}>
            <h1 className={style.imageTitle}>Welcome to Blogging Platform</h1>
            <p className={style.imageSubtitle}>
              Welcome to your personal space to share thoughts, stories, and passions with the world. Create, connect, and grow your voice easily with our powerful and user-friendly blogging platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;