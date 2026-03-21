'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Badge, Button, Form } from 'react-bootstrap';
import Link from 'next/link';
import { FiStar, FiClock, FiBook, FiFilter, FiSearch } from 'react-icons/fi';

export default function PublicCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const dummyCourses = [
    { _id: 'd1', title: 'The Complete Next.js 14 Bootcamp', instructor: { name: 'Maximilian Schwarz' }, price: 49.99, rating: 4.8, reviews: '12k', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400', category: 'Development', level: 'Beginner' },
    { _id: 'd2', title: 'Machine Learning A-Z™: Hands-On Python', instructor: { name: 'Kirill Eremenko' }, price: 54.99, rating: 4.7, reviews: '15k', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400', category: 'Data Science', level: 'Intermediate' },
    { _id: 'd3', title: 'Ultimate AWS Certified Cloud Practitioner', instructor: { name: 'Stephane Maarek' }, price: 39.99, rating: 4.9, reviews: '22k', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400', category: 'Cloud Computing', level: 'Beginner' },
  ];

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/courses');
      if (res.data.success && res.data.data.length > 0) {
        setCourses(res.data.data);
      } else {
        setCourses(dummyCourses);
      }
    } catch (err) {
      setCourses(dummyCourses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <Container className="py-5 text-center min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <Spinner animation="grow" variant="danger" className="mb-3" />
        <h4 className="fw-bold text-dark">Loading Courses...</h4>
      </div>
    </Container>
  );

  return (
    <div style={{ backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
      {/* Page Header / Hero */}
      <section className="py-5 bg-dark text-white position-relative overflow-hidden mb-5" style={{ minHeight: '300px' }}>
        <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 opacity-25" style={{ background: 'linear-gradient(45deg, #dc3545 0%, #000 100%)', zIndex: 0 }}></div>
        <Container className="position-relative z-1 py-5">
           <Row className="align-items-center">
             <Col lg={7}>
               <Badge bg="danger" className="mb-3 px-3 py-2 rounded-pill fw-normal">Unlimited Learning</Badge>
               <h1 className="display-4 fw-bold mb-3 tracking-tighter">Explore Our Program Catalog</h1>
               <p className="lead opacity-75 mb-4">Choose from over 210,000 online video courses with new additions published every month.</p>
               
               <div className="bg-white p-2 rounded-pill shadow-lg d-flex align-items-center max-w-lg" style={{ maxWidth: '600px' }}>
                  <FiSearch className="ms-3 text-muted" size={20} />
                  <Form.Control 
                    type="text" 
                    placeholder="Search for courses, categories, or keywords..." 
                    className="border-0 shadow-none bg-transparent py-2 px-3 fw-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button variant="danger" className="rounded-pill px-4 py-2 fw-bold">Search</Button>
               </div>
             </Col>
             <Col lg={5} className="d-none d-lg-block text-center">
                <FiBook size={180} className="text-danger opacity-25" />
             </Col>
           </Row>
        </Container>
      </section>

      <Container className="pb-5">
        <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
           <h2 className="fw-bold m-0 text-dark">Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'}</h2>
           <div className="d-flex gap-3 align-items-center">
              <span className="text-muted fw-bold small text-uppercase">Sort By:</span>
              <Form.Select className="rounded-pill border-2 fw-bold shadow-sm px-4 py-2" style={{ minWidth: '200px' }}>
                <option>Most Popular</option>
                <option>Newest First</option>
                <option>Highest Rated</option>
                <option>Price: Low to High</option>
              </Form.Select>
           </div>
        </div>

        {error && <Alert variant="danger" className="rounded-4 border-0 shadow-sm">{error}</Alert>}

        {filteredCourses.length === 0 && !error ? (
          <Alert variant="light" className="text-center py-5 rounded-4 shadow-sm border border-light">
            <h1 className="display-1 text-muted opacity-25 mb-4">😕</h1>
            <h3 className="fw-bold text-dark">No courses found matching "{searchQuery}"</h3>
            <p className="text-muted mb-4">Try searching with different keywords or browse all categories.</p>
            <Button variant="outline-danger" className="rounded-pill px-5 py-2 fw-bold" onClick={() => setSearchQuery('')}>Clear Search</Button>
          </Alert>
        ) : (
          <Row className="g-4">
            {filteredCourses.map(course => (
              <Col md={6} lg={4} key={course._id}>
                <Link href={`/courses/${course._id}`} className="text-decoration-none text-dark">
                  <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden course-card-premium">
                    <div className="position-relative" style={{ height: '220px' }}>
                      <Badge bg="danger" className="position-absolute top-0 start-0 m-3 z-1 rounded-1">{course.level}</Badge>
                      {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="w-100 h-100" style={{objectFit:'cover'}} />
                      ) : (
                          <div className="d-flex align-items-center justify-content-center h-100 bg-light text-muted">
                             <FiBook size={40} className="opacity-25" />
                          </div>
                      )}
                      <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-dark text-white d-flex justify-content-between align-items-center z-1">
                         <small className="fw-bold text-uppercase tracking-wider">{course.category}</small>
                      </div>
                    </div>
                    <Card.Body className="p-4 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-1 text-warning">
                          <FiStar className="fill-warning" />
                          <span className="fw-bold text-dark ms-1">4.5</span>
                          <small className="text-muted tracking-tighter">(1.2k reviews)</small>
                        </div>
                      </div>
                      <Card.Title className="fw-bold fs-5 mb-3" style={{ lineHeight: '1.4', height: '3.4rem', overflow: 'hidden' }}>{course.title}</Card.Title>
                      
                      <div className="d-flex align-items-center gap-3 mb-4 pt-2 border-top">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src={`https://ui-avatars.com/api/?name=${course.instructor?.name || 'Instructor'}&background=random`} className="rounded-circle" style={{ width: '32px', height: '32px' }} alt="instructor" />
                         <span className="text-muted small fw-bold">{course.instructor?.name || 'Platform Mentor'}</span>
                      </div>

                      <div className="mt-auto pt-3 d-flex justify-content-between align-items-center">
                          <span className="fw-bold fs-4 text-dark font-primary">
                              {course.price > 0 ? `$${course.price.toFixed(2)}` : 'FREE'}
                          </span>
                          <Button variant="outline-dark" className="rounded-pill px-4 fw-bold border-2">Details</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      
      <style jsx>{`
        .course-card-premium {
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .course-card-premium:hover {
          transform: translateY(-8px);
          box-shadow: 0 1.5rem 3rem rgba(0,0,0,.15)!important;
        }
        .bg-gradient-dark {
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
        }
        .font-primary {
          font-family: var(--font-inter), sans-serif;
        }
      `}</style>
    </div>
  );
}
