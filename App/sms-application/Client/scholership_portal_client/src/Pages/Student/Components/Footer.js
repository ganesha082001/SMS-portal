import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Box, Typography, Link, Divider } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#8A1538', color: 'white', py: 4 }}>
      <Container>
        <Row className="mb-4">
          <Col lg={6} md={6} sm={12} className="mb-3">
            <Typography variant="h5" component="h2" gutterBottom>
              About us
            </Typography>
            <Typography variant="body1">
              Greetings from the SDNB Vaishnav Women's College Scholarship Portal, 
              which serves as your entry point to learning opportunities. We provide 
              scholarships to worthy students to help them with their academic endeavours. 
              Our goal is to enable women to pursue their goals and make higher education 
              more accessible. Join us in exploring, applying, and securing your future!
            </Typography>
          </Col>

          <Col lg={6} md={6} sm={12}>
            <Typography variant="h5" component="h2" gutterBottom className="text-center text-md-end">
              SDNB Vaishnav College for Women
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-end' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Vaishnava College Road, Shanthi Nagar,
                  <br />Chromepet, Chennai, 600044,
                  <br />Tamil Nadu, India
                </Typography>
              </Box>
              
              <Typography variant="h5" component="h3" sx={{ mt: 3, mb: 2 }}>
                Need Help? Contact Us
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Some contact number
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Some Email ID
                </Typography>
              </Box>
            </Box>
          </Col>
        </Row>
        
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 2 }} />
        
        <Row>
          <Col className="text-center">
            <Typography variant="body2">
              © {new Date().getFullYear()} SDNB Vaishnav College for Women. All rights reserved.
            </Typography>
          </Col>
        </Row>
      </Container>
    </Box>
  );
};

export default Footer;