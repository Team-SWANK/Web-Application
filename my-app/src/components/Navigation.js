import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/photosense-resized.png';
import { Nav, Navbar } from 'react-bootstrap'; 

const Navigation = () => (
    // Parent Navbar UI
    <Navbar bg="light" expand="sm">
        {/* Navbar Branding: PhotoSense Logo */}
        <Navbar.Brand>
            <img src={logo} alt="Photosense Logo" ></img>
        </Navbar.Brand>
        {/* When in mobile view, Navbar.Toggle will 
        render a hamburger menu to display nav options */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {/* UI of navbar when the screen size decreases 
        or when navbar collapses */}
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Link exact to="/">
                    Home
                    </Link>

                <Link to="/learn-more">
                    Learn More
                    </Link>

                <Link to="/dev">
                    Extension
                </Link>
            </Nav>
        </Navbar.Collapse>
  </Navbar>
);

export default Navigation;