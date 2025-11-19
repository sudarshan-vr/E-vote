// src/pages/HomePage.js
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section py-5 text-center">
        <Container>
          <h1 className="display-4 mb-4">E-Vote</h1>
          <p className="lead mb-4">A decentralized and transparent blockchain-inspired voting prototype</p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/login" variant="primary" size="lg">
              Login
            </Button>
            <Button as={Link} to="/register" variant="outline-primary" size="lg">
              Register
            </Button>
          </div>
        </Container>
      </div>

      <Container className="my-5">
        <h2 className="text-center mb-5">How It Works</h2>
        <Row className="g-4">
          <Col md={4} className="text-center">
            <div className="p-4 border rounded h-100">
              <h3>1. Register</h3>
              <p>Create your secure voting account with email verification</p>
            </div>
          </Col>
          <Col md={4} className="text-center">
            <div className="p-4 border rounded h-100">
              <h3>2. Verify</h3>
              <p>Verify your identity to ensure one person, one vote</p>
            </div>
          </Col>
          <Col md={4} className="text-center">
            <div className="p-4 border rounded h-100">
              <h3>3. Vote</h3>
              <p>Cast your vote securely on the blockchain</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;