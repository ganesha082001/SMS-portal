import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, useMediaQuery, useTheme, IconButton } from '@mui/material';
import { Navbar, Nav, NavDropdown, Card } from 'react-bootstrap';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from '../asserts/logo.png';
import SessionStorageUtil from '../Session/SessionStorageUtils'; // Adjust the path as necessary
import StaffService from '../Services/staffService'; // Adjust the path as necessary

const StaffHeader = () => {

      const [privilage, setPrivilage] = useState([]);
    
     useEffect(() => {
  
  
     const getPrivilage = async () => {
        try {
          const data = await StaffService.getPrivilage();
          setPrivilage(data.staffPrivilageId);
        } catch (error) {
          console.error('Error fetching privilage data:', error);
        }
      };
  
      getPrivilage();
    }, []);
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
      {/* Navigation bar */}
      <Card>
        <Navbar bg="light" expand="lg" className="shadow-sm" sticky="bottom">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/staff/home">Home</Nav.Link>
                {( privilage === 2 ) ? <Nav.Link href="/staff/stafflist">Manage Staffs</Nav.Link> : null}
                <Nav.Link href="/staff/Scholarshiplist">Manage Scholarships</Nav.Link>
                {/* <NavDropdown title="Scholarships" id="collapsible-nav-dropdown">
                  <NavDropdown.Item href="/ScholarshipLayout">View Scholarships</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="">
                    Check Status
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/ProfileUpdateForm">Profile</Nav.Link> */}
              </Nav>
              <Nav className="ms-auto">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
                <IconButton color="inherit">
                  <AccountCircleIcon />
                </IconButton>
                <Nav.Link href="/" onClick={handleLogout}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Card>
    </AppBar>
  );
};

export default StaffHeader;