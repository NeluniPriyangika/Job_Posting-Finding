import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import './loginFB.css';
import { useNavigate } from 'react-router-dom';

function LoginFB() {
  const [userType, setUserType] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const responseFacebook = async (response) => {
    // Clear any previous errors
    setError(null);

    // Check if the response is valid
    if (!response || response.status === 'unknown' || !response.accessToken) {
      setError('Facebook login failed or was cancelled');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/facebook-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: response.accessToken,
          userID: response.id,
          email: response.email,
          name: response.name,
          userType: userType,
        }),
        credentials: 'include',
      });

      // Parse the response
      const data = await res.json();

      // Check if there's an error
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.token) {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate(data.redirectTo);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      setError(error.message || 'Failed to authenticate with Facebook');
    }
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setError(null); // Clear any previous errors when switching user type
  };

  // Example of using the token in an authenticated request
  const fetchProtectedData = async () => {
    const token = localStorage.getItem('token'); // Retrieve the token
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/google-current-user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Attach the token
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch protected data');
      }

      console.log('Protected data:', data);
    } catch (error) {
      console.error('Error fetching protected data:', error);
      setError(error.message || 'Failed to fetch protected data');
    }
  };

  return (
    <div className="login-container">
      <h2 className="signintitle">Sign In</h2>
      {error && (
        <div
          className="error-message"
          style={{
            color: '#ff3333',
            backgroundColor: '#ffebeb',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}
      <div className="user-type-selection">
        <div className="user-type-buttons">
          <button
            className={`user-type-button ${userType === 'company' ? 'selected' : ''}`}
            onClick={() => handleUserTypeSelect('company')}
          >
            Sign in as Company
          </button>
          <button
            className={`user-type-button ${userType === 'seeker' ? 'selected' : ''}`}
            onClick={() => handleUserTypeSelect('seeker')}
          >
            Sign in as Seeker
          </button>
        </div>
        {userType && (
          <FacebookLogin
            appId="2001351663675828"
            autoLoad={false}
            fields="name,email,picture"
            callback={responseFacebook}
            cssClass="facebook-login-button"
            icon="fa-facebook"
            textButton={`Continue with Facebook as ${userType}`}
            disableMobileRedirect={true}
            onFailure={(error) => {
              console.error('Facebook login failed:', error);
              setError('Failed to connect with Facebook');
            }}
          />
        )}
      </div>
      {localStorage.getItem('token') && (
        <div className="fetch-data-section">
          <button className="fetch-protected-data-button" onClick={fetchProtectedData}>
            Fetch Protected Data
          </button>
        </div>
      )}
    </div>
  );
}

export default LoginFB;