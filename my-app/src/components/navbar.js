import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';
import logo from '../images/photosense-resized.png';

const Navbar = () => (
  <nav className="navbar">
    <img src={logo} alt="Photosense Logo" ></img>
    <NavLink
      exact
      activeClassName="navbar__link--active"
      className="navbar__link"
      to="/"
    >
      Home
    </NavLink>
    
    <NavLink
      activeClassName="navbar__link--active"
      className="navbar__link"
      to="/learn-more"
    >
      Learn More
    </NavLink>

    <NavLink
      activeClassName="navbar__link--active"
      className="navbar__link"
      to="/dev"
    >
      Extension
    </NavLink>
  </nav>
);

export default Navbar;