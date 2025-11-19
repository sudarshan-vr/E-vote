// src/components/layout/Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3 mt-5">
      <Container>
        <Row>
          <Col className="text-center">
            <p>E-Vote &copy; {new Date().getFullYear()} built with love on blockchain and crypto, by CMR students</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;