// Navbar.js
import React, { useState, useEffect } from 'react';
import "./navbar2.css";
import { BsChatDotsFill } from "react-icons/bs";
import { BiSolidUser } from "react-icons/bi";
import Logo from "../../assets/logo.png";
import { useLogout } from '../logOut/LogOut';

function Navbar2() {
  const [isScrolled, setIsScrolled] = useState(false);
  const logout = useLogout();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <a href="/"><img className="logo-navbar" src={Logo} alt="" /></a>
      <nav className='navbar'>
        <a href="/" className='navlink'>Explore Companys</a>
        <a href="/" className='navlink'>Let's Chat</a>
        <a href="/" className='navlink'>Search</a>
      </nav>
      <button className='joinusButton' onClick={logout}>
        LogOut
      </button>
      <nav className='navicons'>
        <a href="/"><BsChatDotsFill className='navbaricon'/></a>
        <a href="/"><BiSolidUser className='navbaricon' /></a>
      </nav>

    </header>
  );
}

export default Navbar2;
