'use client';
import { useState } from 'react';
import { Container, Row, Col, Nav, Offcanvas } from 'react-bootstrap';
import Link from 'next/link';
import AdminNavbar from '@/components/AdminNavbar';
import { FiUsers, FiLayers, FiCreditCard, FiSliders, FiHome, FiUserCheck, FiBox, FiImage, FiSettings, FiBarChart2, FiList, FiFileText } from 'react-icons/fi';

export default function AdminLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebarToggle = () => setShowSidebar(!showSidebar);

  const sidebarLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <FiHome /> },
    { name: 'Users', href: '/admin/users', icon: <FiUsers /> },
    { name: 'Instructors', href: '/admin/instructors', icon: <FiUserCheck /> },
    { name: 'Courses', href: '/admin/courses', icon: <FiLayers /> },
    { name: 'Categories', href: '/admin/categories', icon: <FiBox /> },
    { name: 'Menus', href: '/admin/menus', icon: <FiList /> },
    { name: 'Banners', href: '/admin/banners', icon: <FiImage /> },
    { name: 'Pages', href: '/admin/pages', icon: <FiFileText /> },
    { name: 'Payments', href: '/admin/payments', icon: <FiCreditCard /> },
    { name: 'Settings', href: '/admin/settings', icon: <FiSettings /> },
    { name: 'Analytics', href: '/admin/analytics', icon: <FiBarChart2 /> },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-4 border-bottom border-secondary d-flex align-items-center gap-2">
        <div className="bg-primary rounded-1 p-1">
          <FiLayers className="text-white" size={20} />
        </div>
        <h5 className="mb-0 fw-bold text-white tracking-tight">NextLMS</h5>
      </div>
      <Nav className="flex-column p-3">
        {sidebarLinks.map((link) => (
          <Nav.Link
            key={link.href}
            as={Link}
            href={link.href}
            onClick={() => setShowSidebar(false)}
            className="text-white-50 mb-1 py-1 px-3 rounded-2 transition-all d-flex align-items-center gap-3 sidebar-link"
          >
            <span className="fs-5">{link.icon}</span>
            <span className="fw-medium">{link.name}</span>
          </Nav.Link>
        ))}
      </Nav>
    </>
  );

  return (
    <>
      <div className="d-flex">
        {/* Desktop Sidebar (Fixed) */}
        <div
          className="bg-dark text-white min-vh-100 position-fixed d-none d-md-block shadow"
          style={{ width: '250px', zIndex: 1000 }}
        >
          <SidebarContent />
        </div>

        {/* Mobile Sidebar (Offcanvas) */}
        <Offcanvas
          show={showSidebar}
          onHide={() => setShowSidebar(false)}
          className="bg-dark text-white"
          style={{ width: '280px' }}
        >
          <Offcanvas.Header closeButton closeVariant="white">
          </Offcanvas.Header>
          <Offcanvas.Body className="p-0">
            <SidebarContent />
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main Content */}
        <div
          className="flex-grow-1 min-vh-100 bg-light-gray"
          style={{
            marginLeft: '250px',
            width: 'calc(100% - 250px)' // Fix desktop overflow
          }}
          id="admin-main-content"
        >
          <AdminNavbar onToggleSidebar={handleSidebarToggle} />
          <Container fluid className="p-4 p-lg-5">
            {children}
          </Container>
        </div>
      </div>

      <style jsx global>{`
        .bg-light-gray { background-color: #f8f9fa; }
        .sidebar-link:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: white !important;
          opacity: 1;
        }
        .sidebar-link.active {
          background-color: var(--bs-primary);
          color: white !important;
        }
        .transition-all { transition: all 0.2s ease-in-out; }
        
        @media (max-width: 767.98px) {
          #admin-main-content {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </>
  );
}
