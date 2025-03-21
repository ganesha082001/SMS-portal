// components/ScrollingAnnouncement.jsx
import React from 'react';
import { Box, Link } from '@mui/material';

const ScrollingAnnouncement = ({ text, link }) => {
  return (
    <Box className="announcement-container" style={{ backgroundColor: 'DodgerBlue', color: 'white', padding: '10px' }}>
      <Link 
        href={link} 
        color="inherit" 
        underline="hover"
        className="announcement-text"
      >
        {text}
      </Link>
    </Box>
  );
};

export default ScrollingAnnouncement;