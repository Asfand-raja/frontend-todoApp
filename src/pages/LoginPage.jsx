import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { AiFillApple, AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { BsArrowLeft } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { loginUser, registerUser, verifyEmail, resendVerificationCode } from '../utils/HandleApi';
import { AuthContext } from '../context/AuthContext';
import logo from '../logo.webp';

const LoginPage = ({ isSignup = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  // Auto-detect verification mode from URL (Google OAuth flow)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verifyParam = params.get('verify');
    const emailParam = params.get('email');

    if (verifyParam === 'true' && emailParam) {
      setEmail(emailParam);
      setVerificationMode(true);
<<<<<<< HEAD
      toast.info("A verification code has been sent to your email.");
=======
>>>>>>> 4b686ba (Update branding and fix Google OAuth verification flow)
      // Clear the query params from the URL bar
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verification state
  const [verificationMode, setVerificationMode] = useState(false);
  const [otp, setOtp] = useState('');

  // -------------------------
  // Helpers
  // -------------------------
  const validateEmail = (email) =>
    String(email)
      .toLowerCase()
      .match(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
      );

  const handleSocialLogin = (provider) => {
    const backendUrl =
      process.env.REACT_APP_BACKEND_URL ||
      'https://fullstack-todoapp-backend-production.up.railway.app';

    if (provider === 'Google') window.location.href = `${backendUrl}/auth/google`;
    else if (provider === 'Apple') alert('Apple Login support is under review. Coming soon!');
  };

  // -------------------------
  // Form submission
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // Verification flow
      if (verificationMode) {
        await verifyEmail({ email, code: otp }, setVerificationMode, navigate, setUser, rememberMe);
        return;
      }

      // Signup flow
      if (isSignup) {
        if (!validateEmail(email)) {
          toast.warn('Please enter a valid email address');
          return;
        }

        await registerUser(
          { firstName, lastName, email, password },
          (success) => {
            if (success) setVerificationMode(true);
          },
          setUser,
          rememberMe
        );
      } else {
        // Login flow
        await loginUser({ email, password }, setUser, null, rememberMe);
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Verification screen
  // -------------------------
  if (verificationMode) {
    const handleResendCode = () => resendVerificationCode(email);
    const handleGoBack = () => {
      setOtp('');
      setVerificationMode(false);
    };

    return (
      <div className="login-screen">
        <div className="login-box">
          <h1 className="welcome-text">Verify Email</h1>
          <p className="description">Enter the 6-digit code sent to your email.</p>

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
            <button type="submit" className="signin-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>
          </form>

          <div className="signup-footer">
            <p>
              Didn't get the code? <span onClick={handleResendCode}>Resend code</span>
            </p>
            <p>
              <span onClick={handleGoBack}>Go back</span>
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

        <h1 className="welcome-text">{isSignup ? 'Join Us!' : 'Welcome!'}</h1>
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
              type={showPassword ? 'text' : 'password'}
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

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? (isSignup ? 'Signing up...' : 'Signing in...') : isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <div className="social-logins">
          <div className="social-icon-card" onClick={() => handleSocialLogin('Google')}>
            <FcGoogle />
          </div>
          <div className="social-icon-card" onClick={() => handleSocialLogin('Apple')}>
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
