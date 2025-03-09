import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Button, Spinner } from 'react-bootstrap';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Person,
  Lock,
  Email,
  Phone,
  AccountCircle,
  Numbers,
  Visibility,
  VisibilityOff,
  Refresh,
  HowToReg,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';

// Create a custom theme with the primary color
const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(168, 5, 11)',
      light: 'rgba(168, 5, 11, 0.8)',
      dark: 'rgb(128, 3, 8)',
      contrastText: '#fff'
    },
    secondary: {
      main: '#424242',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", sans-serif',
  },
  components: {
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontWeight: 500,
        },
      },
    },
  },
});

const StudentRegistration = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  const [registerData, setRegisterData] = useState({
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    studentRollnumber: '',
    studentusername: '',
    studentpassword: '',
    confirmPassword: ''
  });

  // Generate a random captcha string
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaValue(result);
    setUserCaptchaInput('');
    setCaptchaError(false);
  };

  // Generate captcha on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validation for phone number - only allow digits
    if (name === 'studentPhone') {
      const digits = value.replace(/\D/g, '');
      const isValidStart = /^[6-9]/.test(digits);
      setPhoneError((digits.length !== 10 || !isValidStart) && digits.length > 0);
      setRegisterData({
        ...registerData,
        [name]: digits
      });
    } else {
      setRegisterData({
        ...registerData,
        [name]: value
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateCaptcha = () => {
    if (userCaptchaInput === captchaValue) {
      setCaptchaError(false);
      return true;
    } else {
      setCaptchaError(true);
      return false;
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setRegisterData({
      studentName: '',
      studentEmail: '',
      studentPhone: '',
      studentRollnumber: '',
      studentusername: '',
      studentpassword: '',
      confirmPassword: ''
    });
    generateCaptcha();
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 5000);
  };

  const handleNext = () => {
    // Validate phone number before moving to next step
    if (activeStep === 0 && registerData.studentPhone && registerData.studentPhone.length !== 10) {
      setPhoneError(true);
      return;
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleRegisterSubmit = () => {
    // Validate captcha
    if (!validateCaptcha()) {
      showNotification("Please enter the correct CAPTCHA", "error");
      return;
    }
    
    // Validate password match
    if (registerData.studentpassword !== registerData.confirmPassword) {
      showNotification("Passwords don't match", "error");
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    // Prepare the data for API
    const currentDate = new Date().toISOString();
    const registerPayload = {
      ...registerData,
      isDeleted: false,
      createdAt: currentDate,
      updatedAt: currentDate
    };
    
    // Remove confirmPassword as it's not needed in the API
    delete registerPayload.confirmPassword;
    // Make the API call
    fetch('http://localhost:3006/Student/register', {
      method: 'POST',
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerPayload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      return response.json();
    })
    .then(data => {
      setIsLoading(false);
      
      // Reset form and show success
      handleReset();

      showNotification("Registration successful! Please login with your new credentials.", "success");
      window.location.href = '/';
    })
    .catch(error => {
      setIsLoading(false);
      console.error('Error during registration:', error);
      showNotification("Registration failed. Please try again later.", "error");
    });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
              Personal Information
            </Typography>
            
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="studentName"
              value={registerData.studentName}
              onChange={handleRegisterInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              margin="normal"
              name="studentEmail"
              type="email"
              value={registerData.studentEmail}
              onChange={handleRegisterInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              name="studentPhone"
              value={registerData.studentPhone}
              onChange={handleRegisterInputChange}
              required
              error={phoneError}
              helperText={phoneError ? "Please enter a valid 10-digit mobile number starting with 6-9" : ""}
              inputProps={{ maxLength: 10 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="Roll Number"
              variant="outlined"
              fullWidth
              margin="normal"
              name="studentRollnumber"
              value={registerData.studentRollnumber}
              onChange={handleRegisterInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Numbers color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );
        
      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
              Account Setup
            </Typography>
            
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              name="studentusername"
              value={registerData.studentusername}
              onChange={handleRegisterInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              name="studentpassword"
              type={showPassword ? 'text' : 'password'}
              value={registerData.studentpassword}
              onChange={handleRegisterInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              margin="normal"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={registerData.confirmPassword}
              onChange={handleRegisterInputChange}
              required
              error={registerData.studentpassword !== registerData.confirmPassword && registerData.confirmPassword !== ''}
              helperText={registerData.studentpassword !== registerData.confirmPassword && registerData.confirmPassword !== '' ? "Passwords don't match" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );
        
      case 2:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
              Review & Confirm
            </Typography>
            
            <Card variant="outlined" sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Personal Information
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <Typography variant="body2">
                    <strong>Full Name:</strong> {registerData.studentName}
                  </Typography>
                  
                  <Typography variant="body2">
                    <strong>Roll Number:</strong> {registerData.studentRollnumber}
                  </Typography>
                  
                  <Typography variant="body2">
                    <strong>Email:</strong> {registerData.studentEmail}
                  </Typography>
                  
                  <Typography variant="body2">
                    <strong>Phone:</strong> {registerData.studentPhone}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Account Information
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <Typography variant="body2">
                    <strong>Username:</strong> {registerData.studentusername}
                  </Typography>
                  
                  <Typography variant="body2">
                    <strong>Password:</strong> {"•".repeat(registerData.studentpassword.length)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              CAPTCHA Verification
            </Typography>
            
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              bgcolor: '#f5f5f5',
              borderRadius: 1,
              mb: 2,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              letterSpacing: '0.5em',
              color: '#333',
              textDecoration: 'line-through',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #ddd',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)',
                backgroundSize: '4px 4px',
              }
            }}>
              {captchaValue}
              <IconButton onClick={generateCaptcha} size="small" color="primary">
                <Refresh />
              </IconButton>
            </Box>
            
            <TextField
              label="Enter CAPTCHA"
              variant="outlined"
              fullWidth
              margin="normal"
              value={userCaptchaInput}
              onChange={(e) => setUserCaptchaInput(e.target.value)}
              error={captchaError}
              helperText={captchaError ? "Incorrect CAPTCHA. Please try again." : ""}
              required
            />
          </Box>
        );
        
      default:
        return 'Unknown step';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" className="mt-4 mb-5">
        <Button className='m-4' variant="primary" href="/login">
            <LoginIcon />
            Back to Login
        </Button>
        <Paper elevation={4} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {/* Header */}
          <Box sx={{ 
            background: 'linear-gradient(45deg, rgb(168, 5, 11) 30%, rgb(128, 3, 8) 90%)', 
            color: 'white',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <HowToReg fontSize="large" />
            <Typography variant="h5" component="h1" fontWeight="500">
              Student Registration
            </Typography>
          </Box>
          
          {/* Stepper */}
          <Box sx={{ width: '100%', p: 3, bgcolor: '#f5f5f5', borderBottom: '1px solid #eee' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              <Step>
                <StepLabel>Personal Information</StepLabel>
              </Step>
              <Step>
                <StepLabel>Account Setup</StepLabel>
              </Step>
              <Step>
                <StepLabel>Review & Confirm</StepLabel>
              </Step>
            </Stepper>
          </Box>
          
          {/* Content */}
          {getStepContent(activeStep)}
          
          {/* Footer */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            p: 3, 
            borderTop: '1px solid #eee',
            bgcolor: '#f9f9f9'
          }}>
            <Button 
              variant={activeStep === 0 ? "outline-secondary" : "outline-primary"}
              onClick={activeStep === 0 ? handleReset : handleBack}
              disabled={isLoading}
            >
              {activeStep === 0 ? 'Reset' : 'Back'}
            </Button>
            
            <Button 
              variant="contained"
              color="primary"
              onClick={activeStep === 2 ? handleRegisterSubmit : handleNext}
              disabled={isLoading || (activeStep === 1 && 
                (registerData.studentpassword !== registerData.confirmPassword || 
                !registerData.studentusername ||
                !registerData.studentpassword))}
              style={{ 
                background: 'linear-gradient(45deg, rgb(168, 5, 11) 30%, rgb(128, 3, 8) 90%)',
                padding: '8px 24px'
              }}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Processing...
                </>
              ) : (activeStep === 2 ? 'Register' : 'Next')}
            </Button>
          </Box>
        </Paper>
      
        {/* Notification */}
        {notification.show && (
          <div className={`position-fixed top-0 end-0 p-3 m-3 rounded shadow-lg notification ${notification.type}`}
               style={{ 
                 backgroundColor: notification.type === 'success' ? '#28a745' : '#dc3545',
                 color: 'white',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '10px',
                 zIndex: 1050 
               }}>
            {notification.type === 'success' ? 
              <CheckCircle fontSize="small" /> : 
              <Cancel fontSize="small" />
            }
            {notification.message}
          </div>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default StudentRegistration;