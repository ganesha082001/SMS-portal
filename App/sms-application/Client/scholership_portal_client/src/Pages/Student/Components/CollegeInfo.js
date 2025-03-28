import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Divider, 
  useMediaQuery, 
  useTheme,
  CardMedia,
  Grid,
  Chip,
  Button
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';

const CollegeInfo = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Adjust typography variant based on screen size
  const headingVariant = isMobile ? "h6" : isTablet ? "h5" : "h5";
  const bodyVariant = isMobile ? "body2" : "body1";
  
  // Adjust spacing based on screen size
  const spacing = isMobile ? 1 : 2;

  return (
    <Card 
      className="college-info-card" 
      elevation={3}
      sx={{
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Grid container>

        {/* Content Section */}
        <Grid item xs={12} md={12}>
          <CardContent className="college-info-content" sx={{ p: spacing + 1 }}>
            {/* College Title with Verification Badge */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SchoolIcon 
                color="primary" 
                sx={{ mr: 1, fontSize: isMobile ? 20 : 24 }} 
              />
              <Typography 
                variant={headingVariant} 
                component="h2" 
                fontWeight="bold"
                sx={{ 
                  lineHeight: 1.3,
                  fontSize: {
                    xs: '1.1rem',
                    sm: '1.3rem',
                    md: '1.5rem'
                  }
                }}
              >
                SDNB Vaishnav College
              </Typography>
              <VerifiedIcon 
                color="primary" 
                sx={{ ml: 1, fontSize: isMobile ? 16 : 20 }} 
              />
            </Box>

            {/* Tagline */}
            <Typography 
              variant={isMobile ? "subtitle2" : "subtitle1"} 
              color="text.secondary"
              sx={{ mb: 2, fontStyle: 'italic' }}
            >
              Excellence in Education & Empowerment Through Scholarships
            </Typography>

            {/* Accreditation Badges */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip 
                icon={<StarIcon />} 
                label="NAAC A+ Grade" 
                size={isMobile ? "small" : "medium"}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label="University of Madras" 
                size={isMobile ? "small" : "medium"}
                variant="outlined"
              />
              <Chip 
                label="Established 1968" 
                size={isMobile ? "small" : "medium"}
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* College Description */}
            <Box sx={{ mt: 2 }}>
              <Typography 
                variant={bodyVariant} 
                paragraph 
                sx={{ 
                  textAlign: 'left',
                  fontSize: {
                    xs: '0.875rem',
                    sm: '0.9rem',
                    md: '1rem'
                  },
                  lineHeight: 1.6,
                  mb: 1.5
                }}
              >
                Shrimathi Devkunvar Nanalal Bhatt Vaishnav College for Women, established in 1968, is a distinguished institution committed to academic excellence and women's empowerment. Affiliated with the University of Madras and accredited with A+ Grade by NAAC, the college offers a diverse range of UG, PG, M.Phil, and Ph.D. programs, fostering innovation and research.
              </Typography>
              <Typography 
                variant={bodyVariant}
                sx={{ 
                  textAlign: 'left',
                  fontSize: {
                    xs: '0.875rem',
                    sm: '0.9rem',
                    md: '1rem'
                  },
                  lineHeight: 1.6
                }}
              >
                Beyond academics, SDNB is dedicated to making education accessible through various scholarship programs, enabling students from diverse backgrounds to pursue their educational dreams without financial constraints.
              </Typography>
            </Box>

                  {!isMobile && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size={isMobile ? "small" : "medium"}
                      component="a"
                      href="https://www.sdnbvc.edu.in"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      See More
                    </Button>
                    </Box>
                  )}
                  </CardContent>
                </Grid>
                </Grid>

                {/* Mobile-only Action Button */}
      {isMobile && (
        <Box sx={{ p: 2, pt: 0 }}>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            size="small"
          >
            See More
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default CollegeInfo;