import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import GoogleLogo from '../../assets/googlelogo.png';

const Login = () => {
  const [userType, setUserType] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null); // Clear previous errors

    try {
      const res = await fetch('http://localhost:5000/api/auth/google-login', {
        method: 'POST',
        body: JSON.stringify({
          credential: credentialResponse.credential,
          userType: userType,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.token) {
        // Save token to localStorage for authenticated requests
        localStorage.setItem('token', data.token);

        // Optionally save user data if provided by the backend
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        setIsLoggedIn(true); // Mark user as logged in

        // Redirect to the target page based on user type or the backend's redirect target
        navigate(data.redirectTo || '/');
      } else {
        setError('Token not received. Check server response.');
        console.error('Token not received. Check server response.');
      }
    } catch (err) {
      setError('An error occurred while logging in. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleGoogleFailure = (error) => {
    setError('Google Login failed. Please try again.');
    console.error('Google Login failed:', error);
  };

  // Example function to attach token for secure API calls
  const fetchProtectedData = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/google-current-user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      console.log('Protected Data:', data);
    } catch (err) {
      console.error('Error fetching protected data:', err);
    }
  };

  return (
    <div className="login-container">
      <h2 className="signintitle">Sign In</h2>
      {error && (
        <div className="error-message" style={{ color: '#ff3333', marginBottom: '15px' }}>
          {error}
        </div>
      )}
      <div className="user-type-buttons">
        <button
          className={`user-type-button ${userType === 'company' ? 'selected' : ''}`}
          onClick={() => setUserType('company')}
        >
          <img className="googleSignInImag" src={GoogleLogo} alt="Google Logo" />
          Sign in as Company
        </button>
        <button
          className={`user-type-button ${userType === 'seeker' ? 'selected' : ''}`}
          onClick={() => setUserType('seeker')}
        >
          <img className="googleSignInImag" src={GoogleLogo} alt="Google Logo" />
          Sign in as Seeker
        </button>
      </div>
      {userType && (
        <div className="google-login-button">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} useOneTap />
        </div>
      )}
       {isLoggedIn && (
        <button className="fetch-data-button" onClick={fetchProtectedData}>
          Fetch Protected Data
        </button>
      )}

    </div>
  );
};

export default Login;
