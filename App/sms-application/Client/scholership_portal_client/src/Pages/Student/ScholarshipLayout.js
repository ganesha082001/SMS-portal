import React, { useState, useEffect } from 'react';
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
import StudentHeader from '../../Components/StudentHeader';
import StaffService from '../../Services/staffService';

// Format date to display in a more readable format
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ScholarshipLayout = () => {
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoading(true);
        const response = await StaffService.getactiveScholarships();
        if (response) {
          setScholarships(response);
        } 
      } catch (error) {
        console.error('Error fetching scholarships:', error);
        setError('Failed to load scholarships');
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchScholarships();
  }, []);

  const handleClickOpen = (scholarship) => {
    setSelectedScholarship(scholarship);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApply = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      setSnackbarMessage('Application URL not available');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Parse eligibility criteria string into an array
  const parseEligibilityCriteria = (criteriaString) => {
    if (!criteriaString) return [];
    // Split by comma, semicolon, or newline
    return criteriaString.split(/[,;\n]+/).map(item => item.trim()).filter(item => item);
  };

  // Filter out deleted scholarships
  const activeScholarships = scholarships;

  if (loading) {
    return (
      <Container className="mt-4 mb-4">
        <Typography variant="h6">Loading scholarships...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4 mb-4">
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <div>
      {/* <StudentHeader /> */}
      <Container className="mt-4 mb-4">
        {activeScholarships.length === 0 ? (
          <Typography variant="body1">No scholarships currently available.</Typography>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {activeScholarships.map((scholarship, index) => (
              <Col key={scholarship.scholarshipId || index}>
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
                      backgroundColor: 
                        (scholarship.scholarshipType === 'Public Scholarships') ? '#B22222' : 
                        (scholarship.scholarshipType === 'Private Scholarships') ? '#1E88E5' :
                        (scholarship.scholarshipType === 'Leadership') ? '#43A047' :
                        (scholarship.scholarshipType === 'Community Service') ? '#9C27B0' : '#FF8F00',
                      color: 'white',
                      padding: '15px',
                      position: 'relative'
                    }}
                  >
                    <Typography variant="h6" component="h2" fontWeight="500">
                      {scholarship.scholarshipTitle || 'Untitled Scholarship'}
                    </Typography>
                    
                    <Box mt={1} mb={1}>
                      <Chip 
                        label={scholarship.scholarshipType || 'Other'} 
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
                        Application Period: {formatDate(scholarship.applicationStartDate).split(',')[0]} - {formatDate(scholarship.applicationEndDate).split(',')[0]}
                      </Typography>
                    </Box>
                  </div>
                  
                  <Card.Body>
                    <Card.Text style={{ fontSize: '14px', color: '#555' }}>
                      {scholarship.scholarshipDescription ? 
                        `${scholarship.scholarshipDescription.substring(0, 120)}...` : 
                        'No description available'}
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
        )}

        {/* Detailed Modal */}
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
                backgroundColor: 
                  (selectedScholarship.scholarshipType === 'Public Scholarships') ? '#B22222' : 
                  (selectedScholarship.scholarshipType === 'STEM') ? '#1E88E5' :
                  (selectedScholarship.scholarshipType === 'Leadership') ? '#43A047' :
                  (selectedScholarship.scholarshipType === 'Community Service') ? '#9C27B0' : '#FF8F00',
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
                {selectedScholarship.scholarshipTitle || 'Untitled Scholarship'}
              </Typography>
              
              <Box display="flex" alignItems="center" mt={1} mb={1}>
                <Chip 
                  label={selectedScholarship.scholarshipType || 'Other'} 
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
                    Application Period: {formatDate(selectedScholarship.applicationStartDate).split(',')[0]} - {formatDate(selectedScholarship.applicationEndDate).split(',')[0]}
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
                    {selectedScholarship.scholarshipDescription || 'No description available.'}
                  </Typography>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h6" gutterBottom fontWeight="500">
                    Eligibility Criteria
                  </Typography>
                  
                  {selectedScholarship.eligibilityCriteria ? (
                    parseEligibilityCriteria(selectedScholarship.eligibilityCriteria).map((criteria, index) => (
                      <Box key={index} display="flex" alignItems="center" mb={1}>
                        <CheckCircle fontSize="small" style={{ color: '#B22222', marginRight: '10px' }} />
                        <Typography variant="body1">
                          {criteria}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      No specific eligibility criteria provided.
                    </Typography>
                  )}
                  
                  {/* Display as single item if parsing didn't result in multiple items */}
                  {selectedScholarship.eligibilityCriteria && 
                   parseEligibilityCriteria(selectedScholarship.eligibilityCriteria).length === 0 && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <CheckCircle fontSize="small" style={{ color: '#B22222', marginRight: '10px' }} />
                      <Typography variant="body1">
                        {selectedScholarship.eligibilityCriteria}
                      </Typography>
                    </Box>
                  )}
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
                        {formatDate(selectedScholarship.applicationStartDate)}
                      </Typography>
                      
                      <Typography variant="body2" color="textSecondary">
                        Closing Date
                      </Typography>
                      <Typography variant="body1" mb={2}>
                        {formatDate(selectedScholarship.applicationEndDate)}
                      </Typography>
                      
                      <Typography variant="body2" color="textSecondary">
                        Contact Person
                      </Typography>
                      <Typography variant="body1" mb={2}>
                        {selectedScholarship.contactStaff ? selectedScholarship.contactStaff.staffName : "Scholarship Coordinator"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Contact Number
                      </Typography>
                      <Typography variant="body1" mb={2}>
                        {selectedScholarship.contactStaff ? selectedScholarship.contactStaff.staffPhone : "N/A"}
                      </Typography>                      
                      {selectedScholarship.isSelfEnrollable && selectedScholarship.selfEnrollUrl && (
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
                          onClick={() => handleApply(selectedScholarship.selfEnrollUrl)}
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