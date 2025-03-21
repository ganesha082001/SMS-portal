import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, useMediaQuery, useTheme, IconButton } from '@mui/material';
import { Navbar, Nav, NavDropdown, Card } from 'react-bootstrap';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from '../asserts/logo.png';
import SessionStorageUtil from '../Session/SessionStorageUtils'; // Adjust the path as necessary
import LogoutIcon from '@mui/icons-material/Logout';
const StudentHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    SessionStorageUtil.clearAppData();
    window.location.href = '/';
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#9e1c2e', padding: '10px 0' }}>
      <Container>
        <Toolbar style={{ display: 'flex', alignItems: 'center', padding: 0 }}>
          <img
            src={logo}  // Logo image
            alt="SDNB Logo"
            style={{ width: isMobile ? '80px' : '110px', marginRight: '15px', borderRadius: '50%' }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant={isMobile ? 'subtitle1' : 'h5'} component="div" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
              Shrimathi Devkunvar Nanalal Bhatt Vaishnav College for Women (Autonomous)
            </Typography>
            <Typography variant={isMobile ? 'caption' : 'subtitle1'} component="div" sx={{ lineHeight: 1.2 }}>
              Owned and Managed by Cork Industries Charities Trust
            </Typography>
            <Typography variant={isMobile ? 'caption' : 'subtitle1'} component="div" sx={{ lineHeight: 1.2 }}>
              Affiliated to University of Madras - Re-Accredited with 'A+' Grade by NAAC
            </Typography>
          </Box>
        </Toolbar>
      </Container>
      <Card>
        <Navbar bg="light" expand="lg" className="shadow-sm" sticky="bottom">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              {/* <Nav className="me-auto">
                <Nav.Link href="/student/home">Home</Nav.Link>
                <NavDropdown title="Scholarships" id="collapsible-nav-dropdown">
                  <NavDropdown.Item href="/student/scholarshiplist">View Scholarships</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="">
                    Check Status
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/student/profile">Profile</Nav.Link>
                <Nav.Link href="">About</Nav.Link>
                <Nav.Link href="">Contact</Nav.Link>
              </Nav> */}
              <Nav className="ms-auto">
                <Nav.Link href="/" onClick={handleLogout}><LogoutIcon/> Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Card>
    </AppBar>
  );
};

export default StudentHeader;