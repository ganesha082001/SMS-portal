import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  LinearProgress, 
  Paper, 
  Grid,
  Button
} from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const DevelopmentPage = () => {
  const progressValue = 65; // Set your current progress here
  
  return (
    <Container maxWidth="md" sx={{ pt: 8, pb: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 5, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ef 100%)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <ConstructionIcon sx={{ fontSize: 80, color: '#B71C1C', mb: 2 }} />
          
          <Typography variant="h2" component="h1" sx={{ 
            fontWeight: 'bold',
            backgroundImage: 'linear-gradient(45deg, #B71C1C, #FF5722)',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitBackgroundClip: 'text',
            mb: 1
          }}>
            Site Under Development
          </Typography>
          
          <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
            We're crafting something amazing for you
          </Typography>
          
          <Box sx={{ mx: 'auto', maxWidth: '70%', mb: 4 }}>
            <LinearProgress 
              variant="determinate" 
              value={progressValue} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                backgroundColor: 'rgba(183, 28, 28, 0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#B71C1C',
                }
              }} 
            />
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'right' }}>
              {`${progressValue}% Complete`}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default DevelopmentPage;