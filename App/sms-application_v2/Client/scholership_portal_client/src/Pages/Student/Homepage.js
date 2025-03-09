import React, { useEffect, useRef, useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Paper, 
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Modal,
  Button,
  IconButton,
  Grid,
  Chip
} from '@mui/material';
import {
  Navbar,
  Nav,
  Row,
  Col,
  Image,
  NavDropdown
} from 'react-bootstrap';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import 'bootstrap/dist/css/bootstrap.min.css';
import StudentHeader from '../../Components/StudentHeader'; // Adjust the path as necessary
import studentimage from '../../asserts/student.png'; // Adjust the path as necessary
import { useLocation } from 'react-router-dom';
import StudentService from '../../Services/studentService';
// Scholarship modal component

function ScholarshipModal({ open, handleClose, scholarship }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // If no scholarship data is provided, don't render anything
  if (!scholarship) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="scholarship-modal-title"
      aria-describedby="scholarship-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '95%' : '90%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 2,
        overflow: 'auto',
        outline: 'none',
      }}>
        {/* Banner area with scholarship title */}
        <Box 
          sx={{ 
            position: 'relative',
            bgcolor: '#9e1c2e', 
            color: 'white',
            p: 4,
            pb: isMobile ? 3 : 5,
            backgroundImage: scholarship.bannerImage ? `url(${scholarship.bannerImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(158, 28, 46, 0.85)',
          }}
        >
          <IconButton 
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.2)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.4)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h2" 
            id="scholarship-modal-title"
            sx={{ fontWeight: 'bold', mb: 1 }}
          >
            {scholarship.scholarship_title}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            <Chip 
              label={scholarship.scholarship_type} 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.25)', color: 'white' }} 
            />
            <Chip 
              icon={<CalendarTodayIcon sx={{ color: 'white !important' }} />} 
              label={`Application Period: ${scholarship.application_start_date} - ${scholarship.application_end_date}`} 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.25)', color: 'white' }} 
            />
          </Box>
        </Box>
        
        {/* Main content */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={4}>
            {/* Left column - Main details */}
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {scholarship.scholarship_description}
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Eligibility Criteria
                </Typography>
                <Box sx={{ pl: 2 }}>
                  {scholarship.eligibility_criteria.split('\n').map((criterion, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                      <CheckCircleOutlineIcon sx={{ color: '#9e1c2e', mr: 1, mt: 0.5 }} />
                      <Typography variant="body1">{criterion}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
            
            {/* Right column - Application details and contact */}
            <Grid item xs={12} md={4}>
              {/* Application box */}
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  border: '1px solid #e0e0e0',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Application Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Opening Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {scholarship.application_start_date}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Closing Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {scholarship.application_end_date}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Contact Person
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {scholarship.contact_incharge || "Scholarship Office"}
                  </Typography>
                </Box>
                
                {scholarship.isself_enrollable && (
                  <Button 
                    variant="contained" 
                    fullWidth 
                    href={scholarship.self_enroll_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      bgcolor: '#9e1c2e', 
                      '&:hover': { bgcolor: '#7a1724' },
                      mt: 2
                    }}
                    startIcon={<LinkIcon />}
                  >
                    Apply Now
                  </Button>
                )}
              </Paper>
              
              {/* Additional information */}
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 3, 
                  backgroundColor: '#f8f8f8',
                  borderRadius: 2
                }}
              >
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Important Information
                </Typography>
                <Typography variant="body2" paragraph>
                  Please ensure all documents are submitted before the closing date. Incomplete applications will not be considered.
                </Typography>
                <Typography variant="body2">
                  For more details, visit the scholarship office or contact the scholarship coordinator.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
}

// Notice Board Component - Updated with auto-scrolling functionality
function NoticeBoard({ title, items, height = '450px' }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // Auto-scrolling functionality
  useEffect(() => {
    const scrollBox = scrollRef.current;
    if (!scrollBox) return;
    
    let scrollInterval;
    
    // Set up the auto-scrolling
    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (!isPaused && scrollBox) {
          // Increment scroll position
          scrollBox.scrollTop += 1;
          
          // If we've scrolled to the bottom, reset to top
          if (scrollBox.scrollTop >= (scrollBox.scrollHeight - scrollBox.clientHeight)) {
            scrollBox.scrollTop = 0;
          }
        }
      }, 50); // Adjust speed by changing this value
    };
    
    startScrolling();
    
    // Clean up on unmount
    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [isPaused]);
  
  const handleOpenModal = (item) => {
    // Convert the notice item to the scholarship format
    const scholarshipData = {
      scholarship_title: item.text,
      scholarship_description: "This scholarship aims to recognize and support outstanding students who demonstrate exceptional academic achievement and leadership potential. Recipients will receive financial assistance to pursue their educational goals and contribute to their community.",
      eligibility_criteria: "Minimum GPA of 3.5 or equivalent\nEnrolled as a full-time student\nDemonstrated leadership qualities\nFinancial need may be considered\nMust be a citizen or permanent resident",
      application_start_date: item.details.split('|')[0].split(':')[1].trim(),
      application_end_date: item.details.split('|')[1].split(':')[1].trim(),
      scholarship_type: "Merit-based",
      contact_incharge: "Dr. Scholarship Coordinator",
      isself_enrollable: true,
      self_enroll_url: "#apply-now",
      bannerImage: "/api/placeholder/1200/400" // Placeholder image
    };
    
    setSelectedScholarship(scholarshipData);
    setModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Card sx={{ 
        height: '100%', 
        minHeight: '500px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <CardHeader
          title={title}
          sx={{ 
            bgcolor: '#9e1c2e', 
            color: 'white',
            padding: '10px 15px',
            textAlign: 'center'
          }}
        />
        <CardContent sx={{ padding: 0 }}>
          <Box 
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            sx={{ 
              height: height, 
              overflowY: 'auto',
              scrollBehavior: 'smooth'
            }}
          >
            <List>
              {items.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem 
                    alignItems="flex-start"
                    button
                    onClick={() => handleOpenModal(item)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <ListItemText
                      primary={`${index + 1}. ${item.text}`}
                      secondary={item.details}
                      primaryTypographyProps={{ 
                        variant: 'subtitle2', 
                        style: { fontWeight: 'bold' } 
                      }}
                    />
                  </ListItem>
                  {index < items.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </CardContent>
      </Card>
      
      <ScholarshipModal 
        open={modalOpen}
        handleClose={handleCloseModal}
        scholarship={selectedScholarship}
      />
    </>
  );
}

function SDNBScholarshipPortal() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const queryParams = new URLSearchParams(location.search);
  const userGuid = queryParams.get('route');

  // onload of the page, get the student details
  useEffect(() => {
    StudentService.getStudentProfile(userGuid)
      .then(data => {
        setProfileData(data);
      }
      )
  }, []);


  // Simulated data
  const leftNoticeItems = [
    { id: 1, text: "National Talent Search Scholarship 2025", 
      details: "Start Date: 1st March 2025 | End Date: 30th April 2025" },
    { id: 2, text: "Global Excellence Scholarship 2025", 
      details: "Start Date: 10th March 2025 | End Date: 30th April 2025" },
    { id: 3, text: "Global Excellence Scholarship 2025", 
      details: "Start Date: 10th March 2025 | End Date: 30th April 2025" },
    { id: 4, text: "Merit Scholarship Program", 
      details: "Start Date: 15th March 2025 | End Date: 15th May 2025" },
    { id: 5, text: "Women in STEM Scholarship", 
      details: "Start Date: 1st April 2025 | End Date: 31st May 2025" },
    { id: 6, text: "First Generation Learner Grant", 
      details: "Start Date: 5th April 2025 | End Date: 5th June 2025" },
  ];

  const rightNoticeItems = [
    { id: 1, text: "Profile Update pending", 
      details: "Date: 25th March 2025 | Venue: Main Auditorium" },
    { id: 2, text: "Interview Preparation Session", 
      details: "Date: 5th April 2025 | Venue: Conference Hall" },
    { id: 3, text: "Document Verification Drive", 
      details: "Date: 10th-15th April 2025 | Venue: Admin Block" },
    { id: 4, text: "Financial Aid Counseling", 
      details: "Date: Every Monday | Venue: Student Services" },
    { id: 5, text: "Scholarship Result Announcement", 
      details: "Date: 15th June 2025 | Check Portal for Updates" },
    { id: 6, text: "New Donor Meet and Greet", 
      details: "Date: 20th March 2025 | Venue: College Garden" },
  ];

  const announcements = [
    "New Scholarship Arrived - Last date to apply is 15th April 2025",
    "Congratulations to the 250 students who received scholarships last year",
    "Special scholarship for rural students now available",
    "Visit the financial aid office for guidance on scholarship applications"
  ];
  
  return (
    
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    
    {/* Header */}
    <StudentHeader/>

      {/* Announcement Marquee */}
      <Box sx={{ 
        bgcolor: '#9e1c2e', 
        color: 'white',
        padding: '10px 0',
        position: 'relative',
        display: 'flex'
      }}>
        <Box sx={{ 
          width: '200px', 
          bgcolor: '#7a1724',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          padding: '0 15px'
        }}>
          <Typography variant="subtitle1">Announcement</Typography>
        </Box>
        <Box sx={{ 
          overflow: 'hidden',
          flexGrow: 1,
          whiteSpace: 'nowrap'
        }}>
          <Typography
            variant="body1"
            component="div"
            sx={{
              display: 'inline-block',
              paddingLeft: '100%',
              animation: 'marquee 25s linear infinite',
              '@keyframes marquee': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-100%)' }
              }
            }}
          >
            {announcements.join(' • ')}
          </Typography>
        </Box>
      </Box>
      
      {/* Student Welcome Card */}
      <Container sx={{ my: 4 }}>
        <Card sx={{ 
          bgcolor: '#9e1c2e', 
          color: 'white', 
          borderRadius: '10px', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' 
        }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box style={{ textAlign: 'left', padding: '20px' }}>
              <Typography variant="h5" component="div" gutterBottom>
                Hi, {profileData?.studentName}
              </Typography>
              <Typography variant="body2">
                Dare to dream big. We're committed to supporting your journey to success
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <img 
                src={studentimage} 
                alt="Student" 
                style={{ borderRadius: '50%' }}
              />
            </Box>
          </CardContent>
        </Card>
      </Container>



      {/* Main Content Area */}
      <Container fluid sx={{ py: 3, flexGrow: 1 }}>
        {/* Mobile View - Notice Boards at the top in 50-50 split */}
        {isMobile && (
          <Row className="mb-4">
            <Col xs={6}>
              <NoticeBoard 
                title="Active Scholarships" 
                items={leftNoticeItems} 
                height="300px" 
              />
            </Col>
            <Col xs={6}>
              <NoticeBoard 
                title="Announcements" 
                items={rightNoticeItems} 
                height="300px" 
              />
            </Col>
          </Row>
        )}

        {/* Desktop View - 3-column layout */}
        <Row>
          {/* Left Column - Notice Board (Only visible on desktop) */}
          {!isMobile && (
            <Col md={3}>
              <NoticeBoard 
                title="Active Scholarships" 
                items={leftNoticeItems} 
              />
            </Col>
          )}

          {/* Middle Column - Main Content */}
          <Col xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              minHeight: isMobile ? '400px' : '500px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <CardHeader
                title="SDNB Vaishnav College – Excellence in Education & Empowerment Through Scholarships"
                sx={{ 
                  bgcolor: '#9e1c2e', 
                  color: 'white',
                  padding: '10px 15px',
                  textAlign: 'center'
                }}
              />
              <CardContent>
                <Row>
                  <Col xs={12} md={8}>
                    <Typography paragraph>
                      Shrimathi Devkunvar Nanalal Bhatt Vaishnav College for Women, established in 1968, is a distinguished institution committed to academic excellence and women's empowerment. Affiliated with the University of Madras and accredited with A+ Grade by NAAC, the college offers a diverse range of UG, PG, M.Phil, and Ph.D. programs, fostering innovation and research.
                    </Typography>
                    <Typography paragraph>
                      Beyond academics, SDNB is dedicated to making education accessible through various scholarships and financial aid programs. These scholarships support meritorious students and those from economically challenged backgrounds, ensuring that every student has the opportunity to excel. With a strong focus on holistic development, the college nurtures future leaders by providing a dynamic learning environment and global exposure.
                    </Typography>
                  </Col>
                  {/* <Col xs={12} md={4} className="d-flex align-items-center justify-content-center">
                    <img 
                      src="/api/placeholder/250/200" 
                      alt="SDNB Students" 
                      style={{ maxWidth: '100%', borderRadius: '8px' }}
                    />
                  </Col> */}
                </Row>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Available Scholarships
                  </Typography>
                  <Row>
                    {[1, 2, 3].map((item) => (
                      <Col xs={12} md={4} key={item} className="mb-3">
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                              Scholarship Type {item}
                            </Typography>
                            <Typography variant="body2">
                              Brief description of the scholarship and eligibility criteria.
                            </Typography>
                          </CardContent>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Box>
              </CardContent>
            </Card>
          </Col>

          {/* Right Column - Notice Board (Only visible on desktop) */}
          {!isMobile && (
            <Col md={3}>
              <NoticeBoard 
                title="Announcements" 
                items={rightNoticeItems} 
              />
            </Col>
          )}
        </Row>
        <Row>
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Available Scholarships
                        </Typography>
                        <Row>
                            {[1, 2, 3, 4].map((item) => (
                                <Col xs={12} md={3} key={item} className="mb-3">
                                    <Card>
                                        <CardContent>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Scholarship Type {item}
                                            </Typography>
                                            <Typography variant="body2">
                                                Brief description of the scholarship and eligibility criteria.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Box>
                </Row>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#9e1c2e', color: 'white', py: 3 }}>
        <Container>
          <Row>
            <Col xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                About us
              </Typography>
              <Typography variant="body2" paragraph>
                Greetings from the SDNB Vaishnav Women's College Scholarship Portal, which serves as your entry point to learning opportunities. We provide scholarship to worthy students to help them with their academic endeavours. Our goal is to enable women to pursue their goals and make higher education more accessible by providing, applying, and securing your future!
              </Typography>
            </Col>
            <Col xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                SDNB Vaishnav College for Women
              </Typography>
              <Typography variant="body2">
                Vaishnav College for Women, Chrompet, Chennai, 600044, Tamil Nadu, India
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Need Help? Contact Us
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Some contact number</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Some Email ID</Typography>
                </Box>
              </Box>
            </Col>
          </Row>
        </Container>
      </Box>
    </div>
  );
}

export default SDNBScholarshipPortal;