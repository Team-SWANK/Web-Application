import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../images/photosense-resized.png';
import { Nav, Navbar } from 'react-bootstrap'; 
import '../styles/navbar.css';

const Navigation = () => (
    // Parent Navbar UI
    <Navbar collapseOnSelect bg="light" expand="sm">
        {/* Navbar Branding: PhotoSense Logo */}
        <Navbar.Brand>
            <img src={logo} alt="Photosense Logo" ></img>
        </Navbar.Brand>
        {/* Renders a hamburger menu for mobile view */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {/* UI of navbar when the screen size decreases 
        or when navbar collapses */}
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
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
                    to="/dev"
                >
                    Extension
                </NavLink>

                <NavLink
                    activeClassName="navbar__link--active"
                    className="navbar__link"
                    to="/learn-more"
                >
                    Learn More
                </NavLink>
            </Nav>
        </Navbar.Collapse>
  </Navbar>
);

export default Navigation;