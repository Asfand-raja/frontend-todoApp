import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { AiFillApple, AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { BsArrowLeft } from 'react-icons/bs';
import { loginUser, registerUser, verifyEmail, resendVerificationCode } from '../utils/HandleApi';

const LoginPage = ({ isSignup = false }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Verification state
  const [verificationMode, setVerificationMode] = useState(false);
  const [otp, setOtp] = useState("");

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSocialLogin = (provider) => {
    const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    if (provider === "Google") {
      window.location.href = `${backendUrl}/auth/google`;
    } else if (provider === "Apple") {
      alert("Apple Login support is being configured. Redirecting to mock flow.");
      setTimeout(() => {
        alert(`${provider} authentication successful!`);
        navigate('/');
      }, 1000);
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
        alert("Please enter a valid email address");
        return;
      }
      registerUser({ firstName, lastName, email, password }, (success) => {
        if (success) setVerificationMode(true);
      });
    } else {
      loginUser({ email, password }, navigate);
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
              <input type="checkbox" id="remember" />
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
          <div className="social-icon-card" onClick={() => handleSocialLogin("Apple")}>
            <AiFillApple />
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
