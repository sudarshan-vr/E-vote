// src/components/layout/Header.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaUser, FaVoteYea, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <header>
      <Navbar
        bg={isLight ? 'light' : 'dark'}
        variant={isLight ? 'light' : 'dark'}
        expand="lg"
        collapseOnSelect
        className="shadow-sm"
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <FaVoteYea className="me-2" />
              E-Vote
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/results">
                <Nav.Link>Results</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/login">
                <Nav.Link>
                  <FaUser className="me-1" /> Sign In
                </Nav.Link>
              </LinkContainer>
              <Nav.Link onClick={toggleTheme} className="ms-2">
                {isLight ? (
                  <>
                    <FaMoon className="me-1" /> Dark
                  </>
                ) : (
                  <>
                    <FaSun className="me-1" /> Light
                  </>
                )}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;