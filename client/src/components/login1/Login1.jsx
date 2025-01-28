// Login1.js
import React from 'react';
import './login1.css';
import GoogleLogo from "../../assets/googlelogo.png";
import FBLogo from '../../assets/FBLogo.png';
import LoginPage from '../../pages/loginPage/LoginPage';
import LoginFBPage from '../../pages/LoginFBPage/LoginFBPage';

function Login1({ onSignInClick }) {
  const handleGoogleSignIn = () => {
    onSignInClick(<LoginPage />); // Show LoginPage in popup for Google sign-in
  };

  const handleFacebookSignIn = () => {
    onSignInClick(<LoginFBPage/>); // Show LoginPage in popup for Facebook sign-in
  };

  return (
    <div className='login1-main'>
      <h2 className='login1-signintitle'>Sign In</h2>
      <div className="login1-type-buttons">
        <button className='login1-type-button' onClick={handleGoogleSignIn}>
          <img className='googleSignInImag' src={GoogleLogo} alt='' /> Sign In with Google
        </button>
        <button className="login1-type-button" onClick={handleFacebookSignIn}>
          <img className='googleSignInImag' src={FBLogo} alt='' /> Sign In with Facebook
        </button>
      </div>
    </div>
  );
}

export default Login1;
