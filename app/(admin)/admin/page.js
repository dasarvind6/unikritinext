'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner, Container } from 'react-bootstrap';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <Container className="py-5 text-center">
      <Spinner animation="border" variant="primary" />
      <p className="mt-3 text-muted">Redirecting to administrator dashboard...</p>
    </Container>
  );
}
