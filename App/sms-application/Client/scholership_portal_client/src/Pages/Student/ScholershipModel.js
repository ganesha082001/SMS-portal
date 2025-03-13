import React, { useState } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Grid, 
  Paper, 
  Divider, 
  Chip,
  useMediaQuery,
  useTheme,
  List,
  Card,
  CardContent,
  ListItem,
  CardHeader,
  ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LinkIcon from '@mui/icons-material/Link';

// Scholarship modal component
function ScholarshipModal({ open, handleClose, scholarship }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // If no scholarship data is provided, don't render anything
  if (!scholarship) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="scholarship-modal-title"
      aria-describedby="scholarship-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '95%' : '90%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 2,
        overflow: 'auto',
        outline: 'none',
      }}>
        {/* Banner area with scholarship title */}
        <Box 
          sx={{ 
            position: 'relative',
            bgcolor: '#9e1c2e', 
            color: 'white',
            p: 4,
            pb: isMobile ? 3 : 5,
            backgroundImage: scholarship.bannerImage ? `url(${scholarship.bannerImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(158, 28, 46, 0.85)',
          }}
        >
          <IconButton 
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.2)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.4)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h2" 
            id="scholarship-modal-title"
            sx={{ fontWeight: 'bold', mb: 1 }}
          >
            {scholarship.scholarship_title}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            <Chip 
              label={scholarship.scholarship_type} 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.25)', color: 'white' }} 
            />
            <Chip 
              icon={<CalendarTodayIcon sx={{ color: 'white !important' }} />} 
              label={`Application Period: ${scholarship.application_start_date} - ${scholarship.application_end_date}`} 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.25)', color: 'white' }} 
            />
          </Box>
        </Box>
        
        {/* Main content */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={4}>
            {/* Left column - Main details */}
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {scholarship.scholarship_description}
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Eligibility Criteria
                </Typography>
                <Box sx={{ pl: 2 }}>
                  {scholarship.eligibility_criteria.split('\n').map((criterion, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                      <CheckCircleOutlineIcon sx={{ color: '#9e1c2e', mr: 1, mt: 0.5 }} />
                      <Typography variant="body1">{criterion}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
            
            {/* Right column - Application details and contact */}
            <Grid item xs={12} md={4}>
              {/* Application box */}
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  border: '1px solid #e0e0e0',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Application Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Opening Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {scholarship.application_start_date}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Closing Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {scholarship.application_end_date}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Contact Person
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {scholarship.contact_incharge || "Scholarship Office"}
                  </Typography>
                </Box>
                
                {scholarship.isself_enrollable && (
                  <Button 
                    variant="contained" 
                    fullWidth 
                    href={scholarship.self_enroll_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      bgcolor: '#9e1c2e', 
                      '&:hover': { bgcolor: '#7a1724' },
                      mt: 2
                    }}
                    startIcon={<LinkIcon />}
                  >
                    Apply Now
                  </Button>
                )}
              </Paper>
              
              {/* Additional information */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 3, 
                  backgroundColor: '#f8f8f8',
                  borderRadius: 2
                }}
              >
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Important Information
                </Typography>
                <Typography variant="body2" paragraph>
                  Please ensure all documents are submitted before the closing date. Incomplete applications will not be considered.
                </Typography>
                <Typography variant="body2">
                  For more details, visit the scholarship office or contact the scholarship coordinator.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
}

// Usage example with the Notice Board component
function NoticeBoard({ title, items, ref, height = '450px' }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  
  const handleOpenModal = (item) => {
    // Here we convert the notice item to the scholarship format
    // In a real application, you might fetch the full details from an API
    const scholarshipData = {
      scholarship_title: item.text,
      scholarship_description: "This scholarship aims to recognize and support outstanding students who demonstrate exceptional academic achievement and leadership potential. Recipients will receive financial assistance to pursue their educational goals and contribute to their community.",
      eligibility_criteria: "Minimum GPA of 3.5 or equivalent\nEnrolled as a full-time student\nDemonstrated leadership qualities\nFinancial need may be considered\nMust be a citizen or permanent resident",
      application_start_date: item.details.split('|')[0].split(':')[1].trim(),
      application_end_date: item.details.split('|')[1].split(':')[1].trim(),
      scholarship_type: "Merit-based",
      contact_incharge: "Dr. Scholarship Coordinator",
      isself_enrollable: true,
      self_enroll_url: "#apply-now",
      bannerImage: "/api/placeholder/1200/400" // Placeholder image
    };
    
    setSelectedScholarship(scholarshipData);
    setModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Card sx={{ 
        height: '100%', 
        minHeight: '500px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <CardHeader
          title={title}
          sx={{ 
            bgcolor: '#9e1c2e', 
            color: 'white',
            padding: '10px 15px',
            textAlign: 'center'
          }}
        />
        <CardContent sx={{ padding: 0 }}>
          <Box 
            ref={ref}
            sx={{ 
              height: height, 
              overflowY: 'hidden',
              '&:hover': {
                overflowY: 'auto'
              }
            }}
          >
            <List>
              {items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem 
                    alignItems="flex-start"
                    button
                    onClick={() => handleOpenModal(item)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <ListItemText
                      primary={`${index + 1}. ${item.text}`}
                      secondary={item.details}
                      primaryTypographyProps={{ 
                        variant: 'subtitle2', 
                        style: { fontWeight: 'bold' } 
                      }}
                    />
                  </ListItem>
                  {index < items.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </CardContent>
      </Card>
      
      <ScholarshipModal 
        open={modalOpen}
        handleClose={handleCloseModal}
        scholarship={selectedScholarship}
      />
    </>
  );
}

export default NoticeBoard;