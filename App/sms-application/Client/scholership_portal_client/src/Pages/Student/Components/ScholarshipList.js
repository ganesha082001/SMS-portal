import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Chip,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { scholarshipData } from '../data/notificationData';

// Enhanced scholarship data with additional details
const enhancedScholarshipData = scholarshipData.map(scholarship => ({
  ...scholarship,
  description: `This scholarship aims to recognize and support outstanding students who demonstrate exceptional academic achievement and leadership potential. Recipients will receive financial assistance to pursue their educational goals and contribute to their community.`,
  eligibilityCriteria: [
    "Minimum GPA of 3.5 or equivalent",
    "Enrolled as a full-time student",
    "Demonstrated leadership qualities",
    "Financial need may be considered",
    "Must be a citizen or permanent resident"
  ],
  contactPerson: "Dr. Scholarship Coordinator",
  importantInfo: [
    "Please ensure all documents are submitted before the closing date. Incomplete applications will not be considered.",
    "For more details, visit the scholarship office or contact the scholarship coordinator."
  ],
  isMeritBased: true
}));

const ScholarshipList = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        const listElement = document.getElementById('scholarship-list');
        if (listElement) {
          if (scrollPosition >= listElement.scrollHeight - listElement.clientHeight) {
            setScrollPosition(0);
          } else {
            setScrollPosition(prev => prev + 1);
          }
          listElement.scrollTop = scrollPosition;
        }
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [scrollPosition, isPaused]);

  const handleClickOpen = (scholarship) => {
    setSelectedScholarship(scholarship);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Card elevation={3} sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom align="center" color="primary">
            Active Scholarships
          </Typography>
          {/* <Typography variant="subtitle2" gutterBottom>
            Start Date: 10th March 2025 | End Date: 30th April 2025
          </Typography> */}
          <Divider sx={{ my: 1 }} />
          <Box
            id="scholarship-list"
            className="scrollable-list"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <List>
              {enhancedScholarshipData.map((scholarship, index) => (
                <React.Fragment key={index}>
                  <ListItem 
                    alignItems="flex-start"
                    button 
                    onClick={() => handleClickOpen(scholarship)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <ListItemText
                      primary={`${index + 1}. ${scholarship.title}`}
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            Start Date: {scholarship.startDate} | End Date: {scholarship.endDate}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < enhancedScholarshipData.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </CardContent>
      </Card>

      {/* Scholarship Detail Modal */}
      {selectedScholarship && (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            bgcolor: 'error.main', 
            color: 'white', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box>
              {selectedScholarship.title}
              <Box sx={{ mt: 1 }}>
                {selectedScholarship.isMeritBased && (
                  <Chip 
                    label="Public Scholarships" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      mr: 1
                    }} 
                  />
                )}
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  <EventIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Application Period: {selectedScholarship.startDate.split(' ')[0]} - {selectedScholarship.endDate.split(' ')[0]}
                </Box>
              </Box>
            </Box>
            <IconButton 
              edge="end" 
              color="inherit" 
              onClick={handleClose} 
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Typography variant="h6" gutterBottom>Description</Typography>
                <Typography paragraph>
                  {selectedScholarship.description}
                </Typography>

                <Typography variant="h6" gutterBottom>Eligibility Criteria</Typography>
                {selectedScholarship.eligibilityCriteria.map((criterion, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <CheckCircleIcon color="error" fontSize="small" sx={{ mr: 1, mt: 0.3 }} />
                    <Typography>{criterion}</Typography>
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>Application Details</Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>Opening Date</Typography>
                  <Typography paragraph>{selectedScholarship.startDate}</Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>Closing Date</Typography>
                  <Typography paragraph>{selectedScholarship.endDate}</Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>Contact Person</Typography>
                  <Typography paragraph>{selectedScholarship.contactPerson}</Typography>
                  
                  <Button 
                    variant="contained" 
                    color="error" 
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    APPLY NOW
                  </Button>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Important Information</Typography>
                  {selectedScholarship.importantInfo.map((info, index) => (
                    <Typography key={index} paragraph variant="body2">
                      {info}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ScholarshipList;