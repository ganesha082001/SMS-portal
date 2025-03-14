// components/CollegeInfo.jsx
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const CollegeInfo = () => {
  return (
    <Card className="college-info-card" elevation={3}>
      <CardContent className="college-info-content">
        <Typography variant="h5" component="h2" gutterBottom>
          SDNB Vaishnav College – Excellence in Education & Empowerment Through Scholarships
        </Typography>
        <Box sx={{ textAlign: 'left', mt: 2 }}>
          <Typography variant="body1" paragraph>
            Shrimathi Devkunvar Nanalal Bhatt Vaishnav College for Women, established in 1968, is a distinguished institution committed to academic excellence and women's empowerment. Affiliated with the University of Madras and accredited with A+ Grade by NAAC, the college offers a diverse range of UG, PG, M.Phil, and Ph.D. programs, fostering innovation and research.
          </Typography>
          <Typography variant="body1">
            Beyond academics, SDNB is dedicated to making education accessible through various scholarship programs, enabling students from diverse backgrounds to pursue their educational dreams without financial constraints.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CollegeInfo;