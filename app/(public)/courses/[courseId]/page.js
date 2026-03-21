'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert, Accordion, ListGroup, Badge } from 'react-bootstrap';
import { useParams } from 'next/navigation';

export default function PublicCourseDetailPage() {
    const params = useParams();
    const courseId = params.courseId;

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCourse = async () => {
        try {
            const res = await axios.get(`/api/courses/${courseId}`);
            if (res.data.success) {
                setCourse(res.data.data);
            }
        } catch (err) {
            setError('Failed to load course details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const handleEnroll = () => {
        // Stub for next phase: payments / enrollments
        alert('Enrollment system coming soon!');
    };

    if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;
    if (error || !course) return <Container className="py-5"><Alert variant="danger">{error || 'Not found'}</Alert></Container>;

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-dark text-white py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={8} className="mb-4 mb-lg-0">
                            <Badge bg="primary" className="mb-3 px-3 py-2">{course.category}</Badge>
                            <h1 className="fw-bold mb-3">{course.title}</h1>
                            <p className="lead mb-4 opacity-75">{course.description}</p>
                            <div className="d-flex align-items-center small opacity-75">
                                <i className="bi bi-person-circle me-2 fs-5"></i>
                                <span className="me-4 fs-6">Created by {course.instructor?.name || 'Instructor'}</span>
                                <i className="bi bi-bar-chart-fill me-2 fs-5"></i>
                                <span className="fs-6">{course.level}</span>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <Card className="text-dark shadow-lg border-0">
                                <div style={{ height: '220px', backgroundColor: '#e9ecef', overflow: 'hidden' }} className="rounded-top">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className="d-flex align-items-center justify-content-center h-100">Course Image</div>
                                    )}
                                </div>
                                <Card.Body className="p-4 text-center">
                                    <h2 className="fw-bold mb-3">
                                        {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}
                                    </h2>
                                    <Button variant="success" size="lg" className="w-100 fw-bold py-3" onClick={handleEnroll}>
                                        Enroll Now
                                    </Button>
                                    <p className="text-muted small mt-3 mb-0">30-Day Money-Back Guarantee</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Curriculum Section */}
            <Container className="py-5 mb-5">
                <Row>
                    <Col lg={8}>
                        <h3 className="fw-bold mb-4">Course Content</h3>
                        {course.sections?.length > 0 ? (
                            <Accordion defaultActiveKey="0">
                                {course.sections.map((section, idx) => (
                                    <Accordion.Item eventKey={idx.toString()} key={section._id} className="mb-2">
                                        <Accordion.Header>
                                            <div className="fw-bold">{section.title}</div>
                                        </Accordion.Header>
                                        <Accordion.Body className="p-0">
                                            <ListGroup variant="flush">
                                                {section.lessons?.map((lesson) => (
                                                    <ListGroup.Item key={lesson._id} className="py-3 px-4 bg-light text-muted d-flex align-items-center">
                                                        <i className="bi bi-play-circle me-3"></i>
                                                        <span>{lesson.title}</span>
                                                        <span className="ms-auto small">
                                                            {lesson.videoUrl && <Badge bg="secondary">Video</Badge>}
                                                        </span>
                                                    </ListGroup.Item>
                                                ))}
                                                {!section.lessons?.length && (
                                                    <ListGroup.Item className="py-3 px-4 text-muted small">No lessons available yet.</ListGroup.Item>
                                                )}
                                            </ListGroup>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        ) : (
                            <Alert variant="secondary">The curriculum for this course is being prepared.</Alert>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
