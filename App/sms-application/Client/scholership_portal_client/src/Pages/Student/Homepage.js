import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Container, 
  Grid, 
  useMediaQuery, 
  Box, 
  Paper, 
  Typography, 
  Fade, 
  CircularProgress,
  Backdrop,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

// Import icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';

import ScholarshipList from './Components/ScholarshipList';
import ScholarshipLayout from '../../Pages/Student/ScholarshipLayout';
import CollegeInfo from './Components/CollegeInfo';
import NotificationList from './Components/NotificationList';
import ScrollingAnnouncement from './Components/ScrollingAnnouncement';
import StudentService from '../../Services/studentService';
import SessionStorageUtil from '../../Session/SessionStorageUtils';
import './style.css';
import StudentHeader from '../../Components/StudentHeader';
import ProfileUpdateFormNew from '../Student/ProfileUpdate/ProfileUpdateForm';
import Footer from './Components/Footer';
import staffService from '../../Services/staffService';
// Enhanced theme with more design considerations
const theme = createTheme({
  palette: {
    primary: {
      main: '#a01c2e',
      light: '#d04b5d',
      dark: '#700014',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1c5da0',
      light: '#4d7fb1',
      dark: '#094180',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    success: { main: '#4caf50' },
    error: { main: '#f44336' },
    warning: { main: '#ff9800' },
    info: { main: '#2196f3' },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    subtitle1: { fontWeight: 400 },
    button: { 
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
  },
});

function StudentHomepage() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);
  
  // New state for profile update dialog
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [profileNeedsUpdate, setProfileNeedsUpdate] = useState(false);
 const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const studentId = SessionStorageUtil.getParticularData('userID');
        if (studentId) {
          const data = await StudentService.getStudentProfile(studentId);
          setStudentData(data);
          
          // Check if profile needs to be updated after fetching student data
          checkProfileUpdateStatus(studentId);
        } else {
          console.error('No student ID found in session storage');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchStudentData();
    fetchNotifications();
  }, []);
  const fetchNotifications = async () => {
    try {
        const response = await staffService.getNotifications();
        setNotifications(response);
    } catch (error) {
        console.error('Failed to fetch notifications', error);
    }
};
  // Function to check if profile needs update
  const checkProfileUpdateStatus = async (studentId) => {
    try {
      // Make API call to check if profile needs updating using StudentService
      const data = await StudentService.checkStudentProfile(studentId);
      // If the profile needs updating, show the dialog
      if (data.profileUpdateRequired === true ) {
        setProfileNeedsUpdate(true);
        setOpenProfileDialog(true);
      }
    } catch (error) {
      console.error('Error checking profile update status:', error);
      // For demo purposes, you might want to show the dialog anyway
      // Comment this out when using actual API
      setProfileNeedsUpdate(true);
      setOpenProfileDialog(true);
    }
  };

  // Handle dialog close - user clicked "Not Now"
  const handleDialogClose = () => {
    setOpenProfileDialog(false);
  };

  // Handle dialog confirmation - user wants to update profile
  const handleUpdateProfile = () => {
    setOpenProfileDialog(false);
    // Navigate to profile tab (index 2)
    setTabValue(2);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Mock data for dashboard metrics
  const dashboardMetrics = [
    { label: 'Applied Scholarships', value: '0', icon: <SchoolIcon />, color: theme.palette.primary.main },
    { label: 'Upcoming Deadlines', value: '1', icon: <CalendarTodayIcon />, color: theme.palette.warning.main },
    { label: 'Total Scholarships', value: '1', icon: <BookmarkIcon />, color: theme.palette.secondary.main },
    { label: 'Approved Scholarships', value: '0', icon: <TrendingUpIcon />, color: theme.palette.success.main },
  ];

  // Sidebar content for desktop
  const sidebarContent = (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar 
          sx={{ width: 80, height: 80, mb: 1, bgcolor: theme.palette.primary.main }}
          alt={studentData?.studentName || 'Student'}
          src={studentData?.profileImage}
        >
          {studentData?.studentName?.charAt(0) || 'S'}
        </Avatar>
        <Typography variant="h6" sx={{ mt: 1 }}>
          {studentData?.studentName || 'Student'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          ID: {studentData?.studentRollnumber || 'Loading...'}
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          sx={{ mt: 2 }}
          startIcon={<AccountCircleIcon />}
          onClick={() => setTabValue(2)}
        >
          View Profile
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List>
        <ListItem button selected={tabValue === 0} onClick={() => setTabValue(0)}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button selected={tabValue === 1} onClick={() => setTabValue(1)}>
          <ListItemIcon><SchoolIcon /></ListItemIcon>
          <ListItemText primary="Scholarships" />
        </ListItem>
        <ListItem button selected={tabValue === 2} onClick={() => setTabValue(2)}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button selected={tabValue === 3} onClick={() => setTabValue(3)}>
          <ListItemIcon>
            {/* <Badge badgeContent={notificationCount} color="error"> */}
              <NotificationsIcon />
            {/* </Badge> */}
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItem>
      </List>
    </Box>
  );

  // Custom announcement data with multiple items
  const announcements = [
    "New Scholarship Arrived - Register now!"
  ];

  // Render content based on selected tab
  const renderTabContent = () => {
    switch (tabValue) {
      case 0: // Dashboard
        return (
          <Box>
            <Grid container spacing={3}>
              {/* Dashboard Metrics */}
              {dashboardMetrics.map((metric, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Fade in={!loading} timeout={600 + (index * 100)}>
                    <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                      <Avatar sx={{ bgcolor: metric.color, mx: 'auto', mb: 1 }}>
                        {metric.icon}
                      </Avatar>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {metric.value}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {metric.label}
                      </Typography>
                    </Paper>
                  </Fade>
                </Grid>
              ))}
              
              {/* Featured Scholarship */}
              <Grid item xs={12} md={8}>
              <CollegeInfo enhanced={true} />
              </Grid>
              
              {/* Recent Notifications */}
              <Grid item xs={12} md={4}>
                <Fade in={!loading} timeout={1100}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                      <Button 
                        variant="text" 
                        color="primary"
                        onClick={() => setTabValue(3)}
                      >
                        View All Notifications
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {/* <Badge badgeContent={notificationCount} color="error"> */}
                        <NotificationsIcon color="action" />
                      {/* </Badge> */}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        Recent Notifications
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <NotificationList limit={3} />
                  </Paper>
                </Fade>
              </Grid>
            </Grid>
          </Box>
        );
      case 1: // Scholarships
        return (
          <Fade in={!loading} timeout={800}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Available Scholarships
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ScholarshipLayout/>
              {/* <ScholarshipList enhanced={true} /> */}
            </Paper>
          </Fade>
        );
      case 2: // Profile
        return (
          <Fade in={!loading} timeout={800}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <ProfileUpdateFormNew/>
            </Paper>
          </Fade>
        );
      case 3: // Notifications
        return (
          <Fade in={!loading} timeout={800}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Notifications & Updates
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <NotificationList enhanced={true} />
            </Paper>
          </Fade>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <StudentHeader />
      <CssBaseline />
      <div className="app">
        {/* Profile Update Dialog */}
        <Dialog
          open={openProfileDialog}
          onClose={handleDialogClose}
          aria-labelledby="profile-update-dialog-title"
          aria-describedby="profile-update-dialog-description"
        >
          <DialogTitle id="profile-update-dialog-title">
            {"Update Your Profile"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="profile-update-dialog-description">
              To ensure you receive the most relevant scholarship opportunities, 
              please update your profile information. This will help us match you 
              with scholarships that fit your qualifications and interests.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Not Now
            </Button>
            <Button onClick={handleUpdateProfile} color="primary" variant="contained" autoFocus>
              Update Profile
            </Button>
          </DialogActions>
        </Dialog>

        {/* Mobile App Bar */}
        {isMobile && (
          <AppBar position="static" color="primary">
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Student Portal
              </Typography>
              <IconButton color="inherit">
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Toolbar>
          </AppBar>
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: 240 } }}
          >
            {sidebarContent}
          </Drawer>
        )}

        <ScrollingAnnouncement 
          text={announcements.join(' • ')} 
          link="#scholarship-details" 
        />
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          
          {!loading && (
            <Grid container spacing={3}>
              {/* Sidebar for desktop */}
              {!isMobile && !isTablet && (
                <Grid item md={3}>
                  <Paper elevation={2} sx={{ height: '100%' }}>
                    {sidebarContent}
                  </Paper>
                </Grid>
              )}
              
              {/* Main content */}
              <Grid item xs={12} md={!isMobile && !isTablet ? 9 : 12}>
                {/* Tabs for tablet */}
                {isTablet && (
                  <Paper sx={{ mb: 3 }}>
                    <Tabs 
                      value={tabValue} 
                      onChange={handleTabChange}
                      variant="fullWidth"
                      indicatorColor="primary"
                      textColor="primary"
                    >
                      <Tab icon={<DashboardIcon />} label="Dashboard" />
                      <Tab icon={<SchoolIcon />} label="Scholarships" />
                      <Tab icon={<HomeIcon />} label="Profile" />
                      <Tab 
                        icon={
                          <Badge badgeContent={notificationCount} color="error">
                            <NotificationsIcon />
                          </Badge>
                        } 
                        label="Notifications" 
                      />
                    </Tabs>
                  </Paper>
                )}
                
                {/* Welcome header for mobile & tablet */}
                {(isMobile || isTablet) && (
                  <Fade in={!loading} timeout={600}>
                    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}
                          alt={studentData?.studentName || 'Student'}
                        >
                          {studentData?.studentName?.charAt(0) || 'S'}
                        </Avatar>
                        <Box>
                          <Typography variant="h5">
                            Welcome, {studentData?.studentName || 'Student'}!
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Fade>
                )}
                
                {/* Tab content */}
                {renderTabContent()}
              </Grid>
            </Grid>
          )}
        </Container>
        
        {/* Bottom navigation for mobile */}
        {isMobile && (
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
            <BottomNavigation
              value={tabValue}
              onChange={(event, newValue) => {
                setTabValue(newValue);
              }}
              showLabels
            >
              <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} />
              <BottomNavigationAction label="Scholarships" icon={<SchoolIcon />} />
              <BottomNavigationAction label="Profile" icon={<HomeIcon />} />
              <BottomNavigationAction 
                label="Notifications" 
                icon={
                  <Badge badgeContent={notificationCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                } 
              />
            </BottomNavigation>
          </Paper>
        )}
      </div>
      < Footer/>
    </ThemeProvider>
  );
}

export default StudentHomepage;