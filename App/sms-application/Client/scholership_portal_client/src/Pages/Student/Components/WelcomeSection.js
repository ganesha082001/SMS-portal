// components/WelcomeSection.jsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const WelcomeSection = ({ username }) => {
  return (
    <Card className="welcome-card" elevation={3}>
      <CardContent className="welcome-content">
        <Typography variant="h4" component="h1" gutterBottom>
          Hi, {username}
        </Typography>
        <Typography variant="body1">
          Dare to dream big. We're committed to supporting your journey to success.
        </Typography>
      </CardContent>
      <img 
        src="/api/placeholder/120/120" 
        alt="Student studying" 
        className="welcome-image" 
      />
    </Card>
  );
};

export default WelcomeSection;