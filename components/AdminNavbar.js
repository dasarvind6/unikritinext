import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAdminLogoutMutation } from '@/redux/api/apiSlice';
import { FiLogOut, FiUser, FiBell, FiMenu } from 'react-icons/fi';

export default function AdminNavbar({ onToggleSidebar }) {
  const router = useRouter();
  const [logout] = useAdminLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Navbar bg="white" className="border-bottom py-2 shadow-sm" sticky="top">
      <Container fluid>
        <div className="d-flex align-items-center gap-3">
          <Button 
            variant="light" 
            className="d-md-none border-0 bg-transparent text-dark" 
            onClick={onToggleSidebar}
          >
            <FiMenu size={24} />
          </Button>
          <Navbar.Brand className="fw-bold text-primary mb-0 d-md-none">NextLMS Admin</Navbar.Brand>
        </div>

        <Nav className="ms-auto align-items-center">
          <Nav.Link className="text-muted mx-2 d-none d-sm-block">
            <FiBell size={20} />
          </Nav.Link>
          
          <Dropdown align="end" className="ms-2">
            <Dropdown.Toggle variant="light" className="d-flex align-items-center gap-2 border-0 bg-transparent">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '32px', height: '32px' }}>
                <FiUser />
              </div>
              <span className="d-none d-sm-inline fw-semibold text-dark">Admin</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow border-0 mt-2 py-2">
              <Dropdown.Header className="text-uppercase small fw-bold text-muted">Account Settings</Dropdown.Header>
              <Dropdown.Item href="/admin/settings" className="py-2">Admin Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger d-flex align-items-center gap-2 py-2">
                <FiLogOut /> Logout Session
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
