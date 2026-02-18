import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { BsArrowLeft } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { loginUser, registerUser, verifyEmail, resendVerificationCode } from '../utils/HandleApi';
import logo from '../logo.webp';

const LoginPage = ({ isSignup = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Verification state
  const [verificationMode, setVerificationMode] = useState(false);
  const [otp, setOtp] = useState("");

  // Auto-detect verification mode from URL (Google OAuth flow)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verifyParam = params.get('verify');
    const emailParam = params.get('email');

    if (verifyParam === 'true' && emailParam) {
      setEmail(emailParam);
      setVerificationMode(true);
      toast.info("A verification code has been sent to your email.");
      // Clear the query params from the URL bar
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const validateEmail = (email) => {
    // Improved regex for better validation
    return String(email)
      .toLowerCase()
      .match(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
      );
  };

  const handleSocialLogin = (provider) => {
    const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    if (provider === "Google") {
      window.location.href = `${backendUrl}/auth/google`;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verification flow
    if (verificationMode) {
      verifyEmail({ email, code: otp }, setVerificationMode, navigate);
      return;
    }

    if (isSignup) {
      if (!validateEmail(email)) {
        toast.warn("Please enter a valid email address");
        return;
      }
      registerUser({ firstName, lastName, email, password }, (success) => {
        if (success) setVerificationMode(true);
      });
    } else {
      // Pass rememberMe state
      loginUser({ email, password }, navigate, rememberMe);
    }
  };

  // -------------------------
  // Verification screen
  // -------------------------
  if (verificationMode) {
    return (
      <div className="login-screen">
        <div className="login-box">
          <h1 className="welcome-text">Verify Email</h1>
          <p className="description">
            Enter the 6-digit code sent to your email.
          </p>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Verification Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="signin-btn">
              Verify Account
            </button>
          </form>
          <div className="signup-footer">
            <p>
              Didn't get the code?{" "}
              <span onClick={() => resendVerificationCode(email)}>Resend code</span>
            </p>
            <p>
              <span onClick={() => setVerificationMode(false)}>Go back</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------
  // Login / Signup screen
  // -------------------------
  return (
    <div className="login-screen">
      <div className="login-box">
        {isSignup && (
          <div className="back-arrow" onClick={() => navigate('/')}>
            <BsArrowLeft />
          </div>
        )}
        <div className="logo-container">
          <img src={logo} alt="Todo App Logo" className="login-logo" />
        </div>
        <h1 className="welcome-text">{isSignup ? "Join Us!" : "Welcome!"}</h1>
        {isSignup && <p className="description">Kick in! Leave procrastination behind.</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="input-row">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <AiFillEye onClick={() => setShowPassword(false)} className="eye-icon" />
            ) : (
              <AiFillEyeInvisible onClick={() => setShowPassword(true)} className="eye-icon" />
            )}
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
          </div>

          <button type="submit" className="signin-btn">
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <div className="social-logins">
          <div className="social-icon-card" onClick={() => handleSocialLogin("Google")}>
            <FcGoogle />
          </div>
        </div>

        <div className="signup-footer">
          {isSignup ? (
            <p>
              Already have an account? <span onClick={() => navigate('/')}>Login</span>
            </p>
          ) : (
            <p>
              Don't have an account? <span onClick={() => navigate('/signup')}>Sign up</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
