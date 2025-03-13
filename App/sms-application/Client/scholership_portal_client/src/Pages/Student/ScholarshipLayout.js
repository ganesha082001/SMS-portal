import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { 
  Dialog, 
  DialogContent, 
  Typography, 
  Chip, 
  Box, 
  Divider,
  IconButton,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import { Close, CalendarToday, CheckCircle, Link as LinkIcon } from '@mui/icons-material';
import StudentHeader from '../../Components/StudentHeader'; // Adjust the path as necessary

// Sample scholarship data based on provided schema
const scholarships = [
  {
    ScholarshipId: 1,
    scholership_title: "National Talent Search Scholarship 2025",
    scholership_description: "This scholarship aims to recognize and support outstanding students who demonstrate exceptional academic achievement and leadership potential. Recipients will receive financial assistance to pursue their educational goals and contribute to their community.",
    eligibility_criteria: [
      "Minimum GPA of 3.5 or equivalent",
      "Enrolled as a full-time student",
      "Demonstrated leadership qualities",
      "Financial need may be considered",
      "Must be a citizen or permanent resident"
    ],
    application_start_date: "2025-03-01",
    application_end_date: "2025-04-30",
    scholarship_type: "Merit-based",
    Contact_Incharge_id: 101,
    contact_person: "Dr. Scholarship Coordinator",
    created_at: "2024-12-01",
    updated_at: "2024-12-15",
    is_deleted: false,
    isself_enrollable: true,
    self_enroll_url: "https://example.com/apply/national-talent"
  },
  {
    ScholarshipId: 2,
    scholership_title: "STEM Innovation Grant",
    scholership_description: "The STEM Innovation Grant supports students pursuing degrees in Science, Technology, Engineering, and Mathematics who demonstrate innovative thinking and research potential.",
    eligibility_criteria: [
      "Enrolled in STEM program",
      "Minimum GPA of 3.2 or higher",
      "Research proposal required",
      "Letter of recommendation",
      "Must be a sophomore or higher"
    ],
    application_start_date: "2025-02-01",
    application_end_date: "2025-05-30",
    scholarship_type: "STEM",
    Contact_Incharge_id: 102,
    contact_person: "Prof. Emily Stevens",
    created_at: "2024-12-05",
    updated_at: "2024-12-20",
    is_deleted: false,
    isself_enrollable: true,
    self_enroll_url: "https://example.com/apply/stem-innovation"
  },
  {
    ScholarshipId: 3,
    scholership_title: "Community Leadership Award",
    scholership_description: "This award recognizes students who have made significant contributions to their communities through volunteer work, activism, or leadership roles.",
    eligibility_criteria: [
      "Demonstrated community involvement",
      "Minimum 100 hours of community service",
      "Two recommendation letters",
      "Essay submission required",
      "Open to all academic disciplines"
    ],
    application_start_date: "2025-02-15",
    application_end_date: "2025-06-01",
    scholarship_type: "Leadership",
    Contact_Incharge_id: 103,
    contact_person: "Dr. James Williams",
    created_at: "2024-12-10",
    updated_at: "2025-01-05",
    is_deleted: false,
    isself_enrollable: true,
    self_enroll_url: "https://example.com/apply/community-leadership"
  },
  {
    ScholarshipId: 4,
    scholership_title: "First Generation Learner Scholarship",
    scholership_description: "This scholarship supports first-generation college students who are the first in their families to pursue higher education, helping to break barriers and create new opportunities.",
    eligibility_criteria: [
      "First in family to attend college",
      "Demonstrated financial need",
      "Minimum GPA of 3.0",
      "Full-time enrollment",
      "Personal statement required"
    ],
    application_start_date: "2025-03-15",
    application_end_date: "2025-05-15",
    scholarship_type: "Need-based",
    Contact_Incharge_id: 104,
    contact_person: "Dr. Maria Rodriguez",
    created_at: "2024-12-15",
    updated_at: "2025-01-10",
    is_deleted: false,
    isself_enrollable: true,
    self_enroll_url: "https://example.com/apply/firstgen"
  }
];

// Format date to display in a more readable format
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ScholarshipLayout = () => {
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleClickOpen = (scholarship) => {
    setSelectedScholarship(scholarship);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApply = (url) => {
    window.open(url, '_blank');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Filter out deleted scholarships
  const activeScholarships = scholarships.filter(s => !s.is_deleted);

  return (
    <div>
      <StudentHeader />
    <Container className="mt-4 mb-4">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Scholarships
        </Typography>
      </Box>
      
      <Row xs={1} md={2} lg={4} className="g-4">
        {activeScholarships.map((scholarship) => (
          <Col key={scholarship.ScholarshipId}>
            <Card 
              className="h-100 shadow-sm" 
              style={{ 
                cursor: 'pointer',
                border: 'none',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
              onClick={() => handleClickOpen(scholarship)}
            >
              <div 
                style={{ 
                  backgroundColor: scholarship.scholarship_type === 'Merit-based' ? '#B22222' : 
                                   scholarship.scholarship_type === 'STEM' ? '#1E88E5' :
                                   scholarship.scholarship_type === 'Leadership' ? '#43A047' : '#FF8F00',
                  color: 'white',
                  padding: '15px',
                  position: 'relative'
                }}
              >
                <Typography variant="h6" component="h2" fontWeight="500">
                  {scholarship.scholership_title}
                </Typography>
                
                <Box mt={1} mb={1}>
                  <Chip 
                    label={scholarship.scholarship_type} 
                    size="small" 
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: '500'
                    }}
                  />
                </Box>
                
                <Box display="flex" alignItems="center" mt={1}>
                  <CalendarToday fontSize="small" style={{ marginRight: '8px' }} />
                  <Typography variant="body2" component="span">
                    Application Period: {formatDate(scholarship.application_start_date).split(',')[0]} - {formatDate(scholarship.application_end_date).split(',')[0]}
                  </Typography>
                </Box>
              </div>
              
              <Card.Body>
                <Card.Text style={{ fontSize: '14px', color: '#555' }}>
                  {scholarship.scholership_description.substring(0, 120)}...
                </Card.Text>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  className="mt-2" 
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Detailed Modal Styled like the reference image */}
      {selectedScholarship && (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              borderRadius: '8px',
              overflow: 'hidden',
              maxHeight: '90vh'
            }
          }}
        >
          <Box 
            style={{ 
              backgroundColor: selectedScholarship.scholarship_type === 'Merit-based' ? '#B22222' : 
                             selectedScholarship.scholarship_type === 'STEM' ? '#1E88E5' :
                             selectedScholarship.scholarship_type === 'Leadership' ? '#43A047' : '#FF8F00',
              color: 'white',
              padding: '20px',
              position: 'relative'
            }}
          >
            <IconButton 
              onClick={handleClose}
              style={{ 
                position: 'absolute', 
                right: '10px', 
                top: '10px',
                color: 'white'
              }}
            >
              <Close />
            </IconButton>
            
            <Typography variant="h4" component="h1" fontWeight="500" mb={1}>
              {selectedScholarship.scholership_title}
            </Typography>
            
            <Box display="flex" alignItems="center" mt={1} mb={1}>
              <Chip 
                label={selectedScholarship.scholarship_type} 
                size="medium" 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: '500',
                  marginRight: '15px'
                }}
              />
              
              <Box display="flex" alignItems="center">
                <CalendarToday fontSize="small" style={{ marginRight: '8px' }} />
                <Typography variant="body2" component="span">
                  Application Period: {formatDate(selectedScholarship.application_start_date).split(',')[0]} - {formatDate(selectedScholarship.application_end_date).split(',')[0]}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <DialogContent style={{ padding: '0' }}>
            <Box display="flex" sx={{ flexDirection: { xs: 'column', md: 'row' }}}>
              {/* Left side - Description and Eligibility */}
              <Box sx={{ flex: '3', padding: '20px' }}>
                <Typography variant="h6" gutterBottom fontWeight="500">
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedScholarship.scholership_description}
                </Typography>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom fontWeight="500">
                  Eligibility Criteria
                </Typography>
                
                {selectedScholarship.eligibility_criteria.map((criteria, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={1}>
                    <CheckCircle fontSize="small" style={{ color: '#B22222', marginRight: '10px' }} />
                    <Typography variant="body1">
                      {criteria}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              {/* Right side - Application Details and Important Information */}
              <Box sx={{ flex: '2', padding: '20px' }}>
                <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '8px' }}>
                  <Typography variant="h6" gutterBottom fontWeight="500">
                    Application Details
                  </Typography>
                  
                  <Box mt={2}>
                    <Typography variant="body2" color="textSecondary">
                      Opening Date
                    </Typography>
                    <Typography variant="body1" mb={2}>
                      {formatDate(selectedScholarship.application_start_date)}
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary">
                      Closing Date
                    </Typography>
                    <Typography variant="body1" mb={2}>
                      {formatDate(selectedScholarship.application_end_date)}
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary">
                      Contact Person
                    </Typography>
                    <Typography variant="body1" mb={2}>
                      {selectedScholarship.contact_person}
                    </Typography>
                    
                    {selectedScholarship.isself_enrollable && selectedScholarship.self_enroll_url && (
                      <Button 
                        variant="contained" 
                        fullWidth
                        style={{ 
                          backgroundColor: '#B22222',
                          borderColor: '#B22222',
                          color: 'white',
                          fontWeight: '500',
                          padding: '10px'
                        }}
                        onClick={() => handleApply(selectedScholarship.self_enroll_url)}
                        startIcon={<LinkIcon />}
                      >
                        APPLY NOW
                      </Button>
                    )}
                  </Box>
                </Paper>
                
                <Paper elevation={1} sx={{ p: 3, borderRadius: '8px' }}>
                  <Typography variant="h6" gutterBottom fontWeight="500">
                    Important Information
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    Please ensure all documents are submitted before the closing date. Incomplete applications will not be considered.
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    For more details, visit the scholarship office or contact the scholarship coordinator.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
    </div>
  );
};

export default ScholarshipLayout;