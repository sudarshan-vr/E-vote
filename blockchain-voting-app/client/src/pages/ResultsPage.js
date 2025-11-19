// src/pages/ResultsPage.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ProgressBar, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const ResultsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/votes/stats');
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load voting results.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading results...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <h2>E-Vote Results</h2>
          <p className="text-muted">Live aggregated results from the simulated blockchain vote records.</p>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Overall Statistics</Card.Title>
              <Card.Text className="mt-2">
                Total confirmed votes: <strong>{stats?.totalVotes || 0}</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-1">
        {stats?.candidates?.map((candidate) => (
          <Col md={6} key={candidate.id}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>{candidate.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{candidate.party}</Card.Subtitle>
                <Card.Text className="mt-2">
                  Votes: <strong>{candidate.voteCount}</strong>
                </Card.Text>
                <Card.Text>
                  Percentage: <strong>{candidate.percentage}%</strong>
                </Card.Text>
                <ProgressBar now={parseFloat(candidate.percentage)} label={`${candidate.percentage}%`} />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ResultsPage;
