// src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, ListGroup, Badge } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (!stored) {
      navigate('/login');
      return;
    }
    const { token } = JSON.parse(stored);
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await api.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user information. Please login again.');
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleVerify = () => {
    // Academic prototype: simulate Aadhaar/OTP verification with a simple button
    setVerified(true);
  };

  const goToVote = () => {
    navigate('/vote');
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <p>Loading dashboard...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
        <Button as={Link} to="/login" variant="primary">
          Go to Login
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col md={8}>
          <h2>Welcome, {user?.username}</h2>
          <p className="text-muted mb-1">Email: {user?.email}</p>
          <p className="text-muted">Role: {user?.role}</p>
        </Col>
        <Col md={4} className="text-md-end mt-3 mt-md-0">
          <Button as={Link} to="/results" variant="outline-primary" className="me-2">
            View Results
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>E-Vote Flow Status</Card.Title>
              <ListGroup variant="flush" className="mt-3">
                <ListGroup.Item>
                  Start <Badge bg="success" className="ms-2">Done</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  User Registration{' '}
                  <Badge bg="success" className="ms-2">Done</Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  Login &amp; Verify (simulated)
                  {verified ? (
                    <Badge bg="success" className="ms-2">Verified</Badge>
                  ) : (
                    <Badge bg="secondary" className="ms-2">Pending</Badge>
                  )}
                  {!verified && (
                    <div className="mt-2">
                      <Button size="sm" variant="primary" onClick={handleVerify}>
                        Simulate Verification
                      </Button>
                    </div>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  Cast Vote
                  {user?.hasVoted ? (
                    <Badge bg="success" className="ms-2">Completed</Badge>
                  ) : (
                    <Badge bg="secondary" className="ms-2">Not yet</Badge>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  View Results
                  <Badge bg="info" className="ms-2">Any time</Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Next Action</Card.Title>
              {user?.hasVoted ? (
                <>
                  <Alert variant="success" className="mt-3">
                    You have already cast your vote. Thank you for participating in E-Vote.
                  </Alert>
                  <Button as={Link} to="/results" variant="primary" className="mt-2">
                    View Results
                  </Button>
                </>
              ) : (
                <>
                  {!verified && (
                    <Alert variant="warning" className="mt-3">
                      Please complete the simulated verification step before voting.
                    </Alert>
                  )}
                  <Button
                    className="mt-3"
                    variant="primary"
                    onClick={goToVote}
                    disabled={!verified}
                  >
                    Go to Candidate List &amp; Vote
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
