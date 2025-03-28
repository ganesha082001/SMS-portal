import React, { useState, useEffect, useRef } from 'react';
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
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { notificationData } from '../data/notificationData';
import staffService from '../../../Services/staffService'
// Enhanced notification data with additional details


const NotificationList = () => {
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const listContainerRef = useRef(null);
  const listRef = useRef(null);
  const cloneRef = useRef(null);
  const theme = useTheme();
   const [notifications, setNotifications] = useState([]);
  
   const enhancedNotificationData = notifications.map(notification => ({
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
  // Use media queries to adjust the component height based on screen size
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  // Calculate responsive height based on screen size
  const getResponsiveHeight = () => {
    if (isXsScreen) return '200px';
    if (isSmScreen) return '250px';
    if (isMdScreen) return '300px';
    return '350px'; // default for large screens
  };

  // Set up vertical marquee
  useEffect(() => {
    fetchNotifications();
    if (listRef.current && cloneRef.current) {
      // Set up the marquee only when both elements are ready
      setupMarquee();
    }
  }, []);

  // Handle the marquee animation
  const marqueeRef = useRef(null);
  
  const setupMarquee = () => {
    // Start the animation
    startMarquee();
  };
  const fetchNotifications = async () => {
    try {
        const response = await staffService.getNotifications();
        setNotifications(response);
    } catch (error) {
        console.error('Failed to fetch notifications', error);
    }
};
  const startMarquee = () => {
    if (isPaused) return;
    
    let startTime;
    let scrollTop = 0;
    const scrollSpeed = 0.5; // pixels per frame - adjust for speed
    
    const scrollStep = (timestamp) => {
      if (!startTime) startTime = timestamp;
      
      if (listContainerRef.current) {
        const container = listContainerRef.current;
        const originalList = listRef.current;
        
        if (!originalList) return;
        
        // Update scroll position
        scrollTop += scrollSpeed;
        container.scrollTop = scrollTop;
        
        // If we've scrolled past the original content, reset to continue the loop
        if (scrollTop >= originalList.scrollHeight) {
          scrollTop = 0;
          container.scrollTop = 0;
        }
      }
      
      // Continue the animation loop
      marqueeRef.current = requestAnimationFrame(scrollStep);
    };
    
    marqueeRef.current = requestAnimationFrame(scrollStep);
  };

  const pauseMarquee = () => {
    if (marqueeRef.current) {
      cancelAnimationFrame(marqueeRef.current);
      marqueeRef.current = null;
    }
  };

  // Handle pausing and resuming the marquee
  useEffect(() => {
    if (isPaused) {
      pauseMarquee();
    } else {
      startMarquee();
    }
    
    return () => {
      if (marqueeRef.current) {
        cancelAnimationFrame(marqueeRef.current);
      }
    };
  }, [isPaused]);

  const handleClickOpen = async (notification) => {
    const response = await staffService.getNotificationById(notification.notificationId)
    setSelectedNotification(response);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedNotification(null)
    setOpen(false);
  };

  return (
    <>
      <Card 
        elevation={3} 
        sx={{ 
          height: '350px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          
          {/* Marquee container */}
          <Box
            ref={listContainerRef}
            sx={{
              height: getResponsiveHeight(),
              overflow: 'hidden',
              position: 'relative',
              flexGrow: 1,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.primary.light,
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                },
              },
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
                  <List 
                    ref={listRef}
                    disablePadding 
                    sx={{ 
                    width: '100%'
                    }}
                  >
                    {enhancedNotificationData.map((notification, index) => (
                    <React.Fragment key={index}>
                      <ListItem 
                      alignItems="flex-start"
                      button 
                      // onClick={() => handleClickOpen(notification)}
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        }
                      }}
                      >
                      <ListItemText
                        primary={
                        <Typography variant="subtitle1" component="div" fontWeight="medium">
                          {index + 1}. {notification.messageTitle}
                        </Typography>
                        }
                        secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', mr: 2 }}>
                          <EventIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem' }} />
                          <Typography variant="body2" component="span">
                            {new Date(notification.endDate).toLocaleDateString('en-GB')}
                          </Typography>
                          </Box>
                          {/* <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                          <LocationOnIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem' }} />
                          <Typography variant="body2" component="span">
                            {notification.venue}
                          </Typography>
                          </Box> */}
                          {notification.notificationType === 1 && (
                          <Chip 
                            label="Required" 
                            size="small" 
                            color="primary"
                            sx={{ ml: 1, height: '20px', fontSize: '0.7rem' }} 
                          />
                          )}
                        </Box>
                        }
                      />
                      </ListItem>
                      {index < enhancedNotificationData.length - 1 && <Divider />}
                    </React.Fragment>
                    ))}
                  </List>
                  
                  {/* Duplicated list for continuous scrolling */}
            <List 
              ref={cloneRef}
              disablePadding 
              sx={{ 
                width: '100%'
              }}
            >
              {enhancedNotificationData.map((notification, index) => (
                <React.Fragment key={`clone-${index}`}>
                  <ListItem 
                    alignItems="flex-start"
                    button 
                    // onClick={() => handleClickOpen(notification)}
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" component="div" fontWeight="medium">
                          {index + 1}. {notification.messageTitle}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', mr: 2 }}>
                            <EventIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem' }} />
                            <Typography variant="body2" component="span">
                            {new Date(notification.endDate).toLocaleDateString('en-GB')}
                            </Typography>
                          </Box>
                          {/* <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                            <LocationOnIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem' }} />
                            <Typography variant="body2" component="span">
                              {notification.venue}
                            </Typography>
                          </Box> */}
                          {notification.notificationType === 1 && (
                            <Chip 
                              label="Required" 
                              size="small" 
                              color="primary"
                              sx={{ ml: 1, height: '20px', fontSize: '0.7rem' }} 
                            />
                          )}
                        </Box>
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
          TransitionProps={{ 
            timeout: 300 
          }}
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