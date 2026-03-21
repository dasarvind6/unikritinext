'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, ListGroup, Table } from 'react-bootstrap';
import Link from 'next/link';

export default function InstructorDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/instructor/analytics');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" variant="primary" /></Container>;

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">Instructor Dashboard</h2>
        <Link href="/instructor/courses" className="btn btn-primary fw-bold px-4">Create New Course</Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center py-3">
             <Card.Body>
                <h2 className="fw-bold text-primary mb-0">{stats.totalStudents}</h2>
                <div className="text-muted small fw-bold text-uppercase">Total Students</div>
             </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center py-3">
             <Card.Body>
                <h2 className="fw-bold text-success mb-0">${stats.totalRevenue.toFixed(2)}</h2>
                <div className="text-muted small fw-bold text-uppercase">Total Revenue</div>
             </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center py-3">
             <Card.Body>
                <h2 className="fw-bold text-info mb-0">{stats.totalCourses}</h2>
                <div className="text-muted small fw-bold text-uppercase">Total Courses</div>
             </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm text-center py-3">
             <Card.Body>
                <h2 className="fw-bold text-warning mb-0">4.8</h2>
                <div className="text-muted small fw-bold text-uppercase">Instructor Rating</div>
             </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white py-3 border-0">
               <h5 className="fw-bold m-0">Recent Course Performance</h5>
            </Card.Header>
            <Card.Body className="p-0">
               <Table hover responsive className="mb-0">
                  <thead className="bg-light">
                     <tr>
                        <th className="ps-4">Course Title</th>
                        <th>Enrollments</th>
                        <th>Revenue</th>
                        <th className="pe-4 text-end">Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     {stats.courseStats.map((course, idx) => (
                       <tr key={idx}>
                          <td className="ps-4 fw-semibold">{course.title}</td>
                          <td>{course.enrollments}</td>
                          <td>${course.revenue.toFixed(2)}</td>
                          <td className="pe-4 text-end">
                             <span className={`badge ${course.published ? 'bg-success' : 'bg-secondary'}`}>
                                {course.published ? 'Published' : 'Draft'}
                             </span>
                          </td>
                       </tr>
                     ))}
                     {stats.courseStats.length === 0 && (
                        <tr><td colSpan="4" className="text-center py-4 text-muted">No courses yet.</td></tr>
                     )}
                  </tbody>
               </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
           <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white py-3 border-0">
                 <h5 className="fw-bold m-0">Quick Links</h5>
              </Card.Header>
              <ListGroup variant="flush">
                 <ListGroup.Item action as={Link} href="/instructor/earnings" className="py-3 px-4 d-flex align-items-center">
                    <i className="bi bi-wallet2 me-3 fs-5 text-primary"></i>
                    <span className="fw-semibold">Revenue & Payouts</span>
                 </ListGroup.Item>
                 <ListGroup.Item action as={Link} href="/instructor/students" className="py-3 px-4 d-flex align-items-center">
                    <i className="bi bi-people me-3 fs-5 text-success"></i>
                    <span className="fw-semibold">Student Management</span>
                 </ListGroup.Item>
                 <ListGroup.Item action as={Link} href="/instructor/analytics" className="py-3 px-4 d-flex align-items-center">
                    <i className="bi bi-bar-chart me-3 fs-5 text-warning"></i>
                    <span className="fw-semibold">Detailed Analytics</span>
                 </ListGroup.Item>
                 <ListGroup.Item action as={Link} href="/instructor/courses" className="py-3 px-4 d-flex align-items-center border-bottom-0 rounded-bottom">
                    <i className="bi bi-book me-3 fs-5 text-info"></i>
                    <span className="fw-semibold">Course Manager</span>
                 </ListGroup.Item>
              </ListGroup>
           </Card>
        </Col>
      </Row>
    </Container>
  );
}
