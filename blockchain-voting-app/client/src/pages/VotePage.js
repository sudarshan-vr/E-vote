// src/pages/VotePage.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const VotePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [voting, setVoting] = useState(false);
  const [voteReceipt, setVoteReceipt] = useState(null);
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

    const loadData = async () => {
      try {
        const [userRes, candRes] = await Promise.all([
          api.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/api/candidates'),
        ]);
        setUser(userRes.data);
        setCandidates(candRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load voting data. Please try again.');
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleVote = async (candidateId) => {
    const stored = localStorage.getItem('userInfo');
    if (!stored) {
      navigate('/login');
      return;
    }
    const { token } = JSON.parse(stored);

    if (user?.hasVoted) {
      toast.info('You have already cast your vote.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to cast your vote for this candidate? This action cannot be undone.');
    if (!confirmed) return;

    try {
      setVoting(true);
      const { data } = await api.post(
        '/api/votes',
        { candidateId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Vote cast successfully!');
      setVoteReceipt({
        transactionId: data.transactionId,
        hash: data.hash,
        signature: data.signature,
      });
      setUser((prev) => ({ ...prev, hasVoted: true }));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error casting vote';
      setError(msg);
      toast.error(msg);
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading candidates...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <h2>Cast Your Vote</h2>
          <p className="text-muted">Select one candidate from the list below and confirm your vote.</p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row className="g-4 mb-4">
        {candidates.map((candidate) => (
          <Col md={4} key={candidate.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{candidate.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{candidate.party}</Card.Subtitle>
                {candidate.description && <Card.Text className="mt-2">{candidate.description}</Card.Text>}
                <Card.Text className="mt-2">
                  Current votes: <strong>{candidate.voteCount}</strong>
                </Card.Text>
                <Button
                  variant="primary"
                  className="mt-2"
                  onClick={() => handleVote(candidate.id)}
                  disabled={user?.hasVoted || voting}
                >
                  {user?.hasVoted ? 'Already Voted' : 'Vote'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {voteReceipt && (
        <Row className="mt-4">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Vote Confirmation (Stored on Simulated Blockchain)</Card.Title>
                <Card.Text className="mt-3">
                  Your vote has been recorded as a transaction in the system.
                </Card.Text>
                <Card.Text>
                  <strong>Transaction ID:</strong> {voteReceipt.transactionId}
                </Card.Text>
                <Card.Text>
                  <strong>Hash:</strong> {voteReceipt.hash}
                </Card.Text>
                <Card.Text>
                  <strong>Signature:</strong> {voteReceipt.signature}
                </Card.Text>
                <Button as={Link} to="/results" variant="success" className="mt-3">
                  View Results
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default VotePage;
