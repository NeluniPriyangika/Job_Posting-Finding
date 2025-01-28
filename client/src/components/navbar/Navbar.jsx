// Navbar.js
import React, { useState, useEffect } from 'react';
import "./navbar.css";
import { BsChatDotsFill } from "react-icons/bs";
import { BiSolidUser } from "react-icons/bi";
import Login1 from '../../components/login1/Login1';
import Logo from "../../assets/logo.png";

function Navbar() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loginComponent, setLoginComponent] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleShowPopup = (component) => {
    setLoginComponent(component);
    setShowLoginPopup(true);
  };

  const handleClosePopup = () => {
    setShowLoginPopup(false);
    setLoginComponent(null);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <a href="/"><img className="logo-navbar" src={Logo} alt="" /></a>
      <nav className='navbar'>
        <a href="/" className='navlink'>Explore Companys</a>
        <a href="/" className='navlink'>Let's Chat</a>
        <a href="/" className='navlink'>Search</a>
      </nav>
      <button className='joinusButton' onClick={() => handleShowPopup(<Login1 onSignInClick={handleShowPopup} />)}>
        Join Us
      </button>
      <nav className='navicons'>
        <a href="/"><BsChatDotsFill className='navbaricon'/></a>
        <a href="/"><BiSolidUser className='navbaricon' /></a>
      </nav>

      {showLoginPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-button" onClick={handleClosePopup}>×</button>
            <img src={Logo} alt="" />
            {loginComponent}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
