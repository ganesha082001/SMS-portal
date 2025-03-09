import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Tabs, Tab, Spinner, ToastContainer, Toast } from 'react-bootstrap';
import { 
  TextField, 
  FormControlLabel, 
  Checkbox, 
  IconButton, 
  InputAdornment,
  Avatar,
  Typography,
  Paper,
  Box
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Person, 
  Lock, 
  AdminPanelSettings, 
  School,
  Refresh
} from '@mui/icons-material';

const Login = () => {
  const [key, setKey] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  const [formData, setFormData] = useState({
    studentUsername: '',
    studentPassword: '',
    adminUsername: '',
    adminPassword: ''
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

  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({...prev, show: false}));
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validate captcha
    if (!validateCaptcha()) {
      return;
    }
  
    if (key === 'student') {
      handleStudentSubmit();
    } else if (key === 'admin') {
      handleAdminSubmit();
    }
  };

  const handleStudentSubmit = () => {
    // Simulate loading state
    setIsLoading(true);

    // remove admin fields from form data
    const payloadData = {
      username: formData.studentUsername,
      password: formData.studentPassword
    };

    // Here you would handle student form submission logic
    console.log('Student form submitted:', payloadData);
  
    // API call
    fetch('http://localhost:3006/Student/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify(payloadData)
    })
    .then(response => response.json())
    .then(data => {
      setIsLoading(false);
      if (data.responseCode === "allowed") {
        // Handle successful login
        // add response code and role to local storage
        localStorage.setItem('role', 'student');
        localStorage.setItem('responseCode', data.responseCode);
        window.location.href = `/student/home?route=${data.id}`;
      } else {
        // Handle invalid login
        showNotification("Invalid login. Please check your credentials and try again.", "error");
      }
      generateCaptcha(); // Reset captcha after submission
    })
    .catch(error => {
      setIsLoading(false);
      console.error('Error during login:', error);
      showNotification("An error occurred. Please try again.", "error");
      generateCaptcha(); // Reset captcha after submission
    });
  };
  
  const handleAdminSubmit = () => {
    // Simulate loading state
    setIsLoading(true);

    // Admin login payload
    const payloadData = {
      username: formData.adminUsername,
      password: formData.adminPassword
    };

    // Here you would handle admin form submission logic
    console.log('Admin form submitted:', payloadData);

    // API call
    fetch('http://localhost:3006/Staffs/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify(payloadData)
    })
    .then(response => response.json())
    .then(data => {
      setIsLoading(false);
      if (data.responseCode === "allowed") {
        // Handle successful login
        // add response code and role to local storage
        localStorage.setItem('role', 'admin');
        localStorage.setItem('responseCode', data.responseCode);
        window.location.href = `/staff/home?route=${data.id}`;
      } else {
        // Handle invalid login
        showNotification("Invalid login. Please check your credentials and try again.", "error");
      }
      generateCaptcha(); // Reset captcha after submission
    })
    .catch(error => {
      setIsLoading(false);
      console.error('Error during login:', error);
      showNotification("An error occurred. Please try again.", "error");
      generateCaptcha(); // Reset captcha after submission
    });
  };

  // Function to handle registration button click
  const handleRegisterClick = () => {
    // Redirect to registration page/component
    window.location.href = '/register';
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      {/* Notification Toast */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1500 }}>
        <Toast 
          show={notification.show} 
          onClose={() => setNotification(prev => ({...prev, show: false}))}
          bg={notification.type === 'success' ? 'success' : 'danger'}
          delay={5000}
          autohide
        >
          <Toast.Header closeButton>
            <strong className="me-auto">
              {notification.type === 'success' ? 'Success' : 'Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {notification.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      
      <Paper 
        elevation={12} 
        sx={{ 
          width: '100%', 
          maxWidth: 450, 
          overflow: 'hidden',
          borderRadius: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 16px 70px -12px rgba(0,0,0,0.3)'
          }
        }}
      >
        {/* Header with Avatar */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            background: 'linear-gradient(45deg,rgb(168, 5, 11) 30%, rgb(168, 5, 11) 90%)',
            py: 3
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: 'white', 
              width: 56, 
              height: 56,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            {key === 'student' ? 
              <School sx={{ color: '#2196F3' }} /> :
              <AdminPanelSettings sx={{ color: '#2196F3' }} />
            }
          </Avatar>
          <Typography variant="h5" sx={{ color: 'white', mt: 2, fontWeight: 'bold' }}>
            {key === 'student' ? 'Student Login' : 'Admin Login'}
          </Typography>
        </Box>

        {/* Tab Navigation */}
        <Tabs
          id="login-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
          fill
        >
          <Tab eventKey="student" title={
            <div className="d-flex align-items-center" >
              <School sx={{ mr: 1, fontSize: 20 }} />
              <span style={{textAlign: 'center'}}>Student</span>
            </div>
          } />
          <Tab eventKey="admin" title={
            <div className="d-flex align-items-center">
              <AdminPanelSettings sx={{ mr: 1, fontSize: 20 }} />
              <span>Admin</span>
            </div>
          } />
        </Tabs>

        {/* Form */}
        <div className="px-4 py-4">
          <Form onSubmit={handleSubmit}>
            {key === 'student' ? (
              <>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="studentUsername"
                  value={formData.studentUsername}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="studentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.studentPassword}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
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
              </>
            ) : (
              <>
                <TextField
                  label="Admin ID"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="adminUsername"
                  value={formData.adminUsername}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AdminPanelSettings />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="adminPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.adminPassword}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
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
              </>
            )}
            
            {/* CAPTCHA for Login */}
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom><strong>CAPTCHA Verification</strong></Typography>
              
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
                <IconButton onClick={generateCaptcha} size="small">
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

            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember me"
              sx={{ mt: 1, mb: 3 }}
            />

            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={isLoading}
              className="w-100 mb-3"
              style={{ 
                background: 'linear-gradient(45deg,rgb(168, 5, 11) 30%, rgb(168, 5, 11) 90%)',
                borderColor: 'transparent',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
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
              ) : 'Log In'}
            </Button>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <a href="#" className="text-decoration-none">
                Forgot Password?
              </a>
              
              {/* Only show register option for Student tab */}
              {key === 'student' && (
                <Button 
                  variant="outline-primary" 
                  onClick={handleRegisterClick}
                  className="ms-2"
                >
                  Register
                </Button>
              )}
            </div>
          </Form>
        </div>
      </Paper>
    </Container>
  );
};

export default Login;