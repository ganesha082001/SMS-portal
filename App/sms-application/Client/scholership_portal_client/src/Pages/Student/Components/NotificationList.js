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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { notificationData } from '../data/notificationData';

// Enhanced notification data with additional details
const enhancedNotificationData = notificationData.map(notification => ({
  ...notification,
  description: `This is an important announcement for all students. Please make sure to attend and bring all necessary documents and information.`,
  details: [
    "All students must bring their ID cards.",
    "The event is mandatory for scholarship recipients.",
    "Please arrive 15 minutes before the scheduled time."
  ],
  contactPerson: "Student Affairs Office",
  importantInfo: [
    "For any queries, please contact the event coordinator at coordinator@college.edu",
    "Updates will be posted on the official college website."
  ],
  isRequired: Math.random() > 0.5
}));

const NotificationList = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        const listElement = document.getElementById('notification-list');
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

  const handleClickOpen = (notification) => {
    setSelectedNotification(notification);
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
            Announcements
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Date: 5th April 2025 | Venue: Conference Hall
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box
            id="notification-list"
            className="scrollable-list"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <List>
              {enhancedNotificationData.map((notification, index) => (
                <React.Fragment key={index}>
                  <ListItem 
                    alignItems="flex-start"
                    button 
                    onClick={() => handleClickOpen(notification)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <ListItemText
                      primary={`${index + 1}. ${notification.title}`}
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            Date: {notification.date} | Venue: {notification.venue}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < enhancedNotificationData.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </CardContent>
      </Card>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box>
              {selectedNotification.title}
              <Box sx={{ mt: 1 }}>
                {selectedNotification.isRequired && (
                  <Chip 
                    label="Required" 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      mr: 1
                    }} 
                  />
                )}
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', mr: 2 }}>
                  <EventIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {selectedNotification.date}
                </Box>
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                  {selectedNotification.venue}
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
                  {selectedNotification.description}
                </Typography>

                <Typography variant="h6" gutterBottom>Important Details</Typography>
                {selectedNotification.details.map((detail, index) => (
                  <Typography key={index} paragraph variant="body1" sx={{ ml: 2, '&:before': { content: '"• "' } }}>
                    {detail}
                  </Typography>
                ))}
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>Event Details</Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>Date</Typography>
                  <Typography paragraph>{selectedNotification.date}</Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>Venue</Typography>
                  <Typography paragraph>{selectedNotification.venue}</Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>Contact</Typography>
                  <Typography paragraph>{selectedNotification.contactPerson}</Typography>
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                  >
                    RSVP NOW
                  </Button>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Additional Information</Typography>
                  {selectedNotification.importantInfo.map((info, index) => (
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

export default NotificationList;