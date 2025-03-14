// App.jsx
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Grid, useMediaQuery } from '@mui/material';
// import Header from './Components/Header';
import WelcomeSection from './Components/WelcomeSection';
import ScrollingAnnouncement from './Components/ScrollingAnnouncement';
import ScholarshipList from './Components/ScholarshipList';
import CollegeInfo from './Components/CollegeInfo';
import NotificationList from './Components/NotificationList';
import './style.css';
import StudentHeader from '../../Components/StudentHeader';
const theme = createTheme({
  palette: {
    primary: {
      main: '#a01c2e',
    },
    secondary: {
      main: '#1c5da0',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
  },
});

function StudentHomepage() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        < StudentHeader />
        <ScrollingAnnouncement 
          text="New Scholarship Arrived - Last date to apply is 15th April 2025 • Congratulations to the 250 students who received scholarships last month!" 
          link="#scholarship-details" 
        />
        <Container maxWidth="xl" className="main-container">
          <WelcomeSection username="Mahalakshmi" />
          
          {isMobile ? (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <ScholarshipList />
              </Grid>
              <Grid item xs={6}>
                <NotificationList />
              </Grid>
              <Grid item xs={12}>
                <CollegeInfo />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <ScholarshipList />
              </Grid>
              <Grid item xs={12} md={6}>
                <CollegeInfo />
              </Grid>
              <Grid item xs={12} md={3}>
                <NotificationList />
              </Grid>
            </Grid>
          )}
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default StudentHomepage;