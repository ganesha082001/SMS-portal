import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { 
  TextField, 
  FormControlLabel, 
  Checkbox, 
  IconButton, 
  InputAdornment,
  Avatar,
  Typography,
  Paper,
  Box,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Grid,
  Divider,
  Fade
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Person, 
  Lock, 
  AdminPanelSettings, 
  School,
  Refresh,
  Login as LoginIcon,
  ArrowForward
} from '@mui/icons-material';
import StudentService from '../../Services/studentService';
import SessionStorageUtil from '../../Session/SessionStorageUtils';
import StaffService from '../../Services/staffService';

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeRole, setActiveRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [formData, setFormData] = useState({
    studentUsername: '',
    studentPassword: '',
    adminUsername: '',
    adminPassword: '',
    rememberMe: false
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

  // Generate captcha on component mount and role change
  useEffect(() => {
    generateCaptcha();
  }, [activeRole]);

  const showAlert = (message, severity = 'success') => {
    setAlert({
      open: true,
      message,
      severity
    });
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({...alert, open: false});
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const switchRole = (role) => {
    setActiveRole(role);
    // Reset password fields when switching roles
    setFormData(prev => ({
      ...prev,
      studentPassword: '',
      adminPassword: ''
    }));
  };

  const validateCaptcha = () => {
    if (userCaptchaInput === captchaValue) {
      setCaptchaError(false);
      return true;
    } else {
      setCaptchaError(true);
      showAlert('Incorrect CAPTCHA. Please try again.', 'error');
      return false;
    }
  };

  const validateForm = () => {
    const isStudent = activeRole === 'student';
    const username = isStudent ? formData.studentUsername : formData.adminUsername;
    const password = isStudent ? formData.studentPassword : formData.adminPassword;
    
    if (!username.trim()) {
      showAlert(`Please enter a valid ${isStudent ? 'username' : 'admin ID'}.`, 'error');
      return false;
    }
    
    if (!password) {
      showAlert('Please enter your password.', 'error');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Validate captcha
    if (!validateCaptcha()) {
      return;
    }
  
    if (activeRole === 'student') {
      handleStudentSubmit();
    } else if (activeRole === 'admin') {
      handleAdminSubmit();
    }
  };

    const handleStudentSubmit = () => {
      // Simulate loading state
      setIsLoading(true);

      // Student login payload
      const payloadData = {
        username: formData.studentUsername,
        password: formData.studentPassword
      };

      StudentService.studentLogin(formData.studentUsername,formData.studentPassword )
        .then(data => {
          setIsLoading(false);
          if (data.responseCode === "allowed") {
            // Handle successful login
            showAlert('Login successful! Redirecting to dashboard...', 'success');
            
            // Save to localStorage if remember me is checked
            if (formData.rememberMe) {
              localStorage.setItem('savedUsername', formData.studentUsername);
            }
            
            // Add response code and role to session storage
            SessionStorageUtil.setAppData({
              role: 'student',
              responseCode: data.responseCode,
              userID: data.id,
              activeToken: data.token
            });

            // Redirect after a short delay to show success message
            setTimeout(() => {
              window.location.href = `/student/home`;
            }, 1500);
          } else {
            // Handle invalid login
            showAlert("Invalid login. Please check your credentials and try again.", "error");
            generateCaptcha();
          }
        })
        .catch(error => {
          setIsLoading(false);
          console.error('Error during login:', error);
          showAlert("An error occurred. Please check your connection and try again.", "error");
          generateCaptcha();
        });
    };
    const handleAdminSubmit = () => {
      // Simulate loading state
      setIsLoading(true);

      StaffService.staffLogin(formData.adminUsername,formData.adminPassword )
        .then(data => {
          setIsLoading(false);
          if (data.responseCode === "allowed") {
            // Handle successful login
            showAlert('Login successful! Redirecting to dashboard...', 'success');
            
            // Save to localStorage if remember me is checked
            if (formData.rememberMe) {
              localStorage.setItem('savedUsername', formData.studentUsername);
            }
            
            // Add response code and role to session storage
            SessionStorageUtil.setAppData({
              role: 'staff',
              responseCode: data.responseCode,
              userID: data.id,
              activeToken: data.token
            });

            // Redirect after a short delay to show success message
            setTimeout(() => {
              window.location.href = `/staff/home`;
            }, 1500);
          } else {
            // Handle invalid login
            showAlert("Invalid login. Please check your credentials and try again.", "error");
            generateCaptcha();
          }
        })
        .catch(error => {
          setIsLoading(false);
          console.error('Error during login:', error);
          showAlert("An error occurred. Please check your connection and try again.", "error");
          generateCaptcha();
        });
    };
  
    const handleRegisterClick = () => {
    // Redirect to registration page/component
    window.location.href = '/register';
  };

  // Load saved username from localStorage if available
  useEffect(() => {
    const savedStudentUsername = localStorage.getItem('savedUsername');
    const savedAdminUsername = localStorage.getItem('savedAdminUsername');
    
    if (savedStudentUsername) {
      setFormData(prev => ({
        ...prev,
        studentUsername: savedStudentUsername,
        rememberMe: true
      }));
    }
    
    if (savedAdminUsername) {
      setFormData(prev => ({
        ...prev,
        adminUsername: savedAdminUsername,
        rememberMe: true
      }));
    }
  }, []);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', padding: isMobile ? '1rem' : '2rem' }}>
      {/* Snackbar Alerts */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      
      <Paper 
        elevation={12} 
        sx={{ 
          width: '100%', 
          maxWidth: isTablet ? 500 : 800,
          overflow: 'hidden',
          borderRadius: 3,
          display: 'flex',
          flexDirection: isTablet ? 'column' : 'row',
        }}
      >
        {/* Left side - Branding/Info Column */}
        <Box 
          sx={{ 
            width: isTablet ? '100%' : '40%',
            background: 'rgb(168, 5, 11)',
            color: 'white',
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Box sx={{ mb: 4 }}>
            {/* Logo/School emblem could go here */}
            <Avatar 
              sx={{ 
                bgcolor: 'white', 
                width: 80, 
                height: 80,
                margin: '0 auto',
                mb: 2
              }}
            >
              {activeRole === 'student' ? 
                <School sx={{ color: 'rgb(168, 5, 11)', fontSize: 45 }} /> :
                <AdminPanelSettings sx={{ color: 'rgb(168, 5, 11)', fontSize: 45 }} />
              }
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Please sign in to continue to your
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {activeRole === 'student' ? 'Student' : 'Administration'} Portal
            </Typography>
          </Box>
          
          {/* Role Toggle Buttons */}
          <Box sx={{ width: '100%', mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, opacity: 0.9 }}>
              SIGN IN AS:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant={activeRole === 'student' ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => switchRole('student')}
                  sx={{
                    bgcolor: activeRole === 'student' ? 'white' : 'transparent',
                    color: activeRole === 'student' ? 'rgb(168, 5, 11)' : 'white',
                    borderColor: 'white',
                    '&:hover': {
                      bgcolor: activeRole === 'student' ? 'white' : 'rgba(255,255,255,0.1)',
                      borderColor: 'white'
                    }
                  }}
                  startIcon={<School />}
                >
                  Student
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant={activeRole === 'admin' ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => switchRole('admin')}
                  sx={{
                    bgcolor: activeRole === 'admin' ? 'white' : 'transparent',
                    color: activeRole === 'admin' ? 'rgb(168, 5, 11)' : 'white',
                    borderColor: 'white',
                    '&:hover': {
                      bgcolor: activeRole === 'admin' ? 'white' : 'rgba(255,255,255,0.1)',
                      borderColor: 'white'
                    }
                  }}
                  startIcon={<AdminPanelSettings />}
                >
                  Admin
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          {!isTablet && (
            <Box sx={{ mt: 'auto', pt: 4, width: '100%' }}>
              <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 3 }} />
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                © 2025 University Portal System
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                All rights reserved
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Right side - Login Form */}
        <Box 
          sx={{ 
            width: isTablet ? '100%' : '60%', 
            p: isTablet ? 3 : 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Fade in={true} timeout={500}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'rgb(168, 5, 11)' }}>
                {activeRole === 'student' ? 'Student Login' : 'Admin Login'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
                Enter your credentials to access your account
              </Typography>
              
              <Form onSubmit={handleSubmit}>
                {activeRole === 'student' ? (
                  <>
                    <TextField
                      label="Username"
                      variant="outlined"
                      fullWidth
                      name="studentUsername"
                      value={formData.studentUsername}
                      onChange={handleInputChange}
                      required
                      sx={{ mb: 3 }}
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
                      name="studentPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.studentPassword}
                      onChange={handleInputChange}
                      required
                      sx={{ mb: 3 }}
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
                      name="adminUsername"
                      value={formData.adminUsername}
                      onChange={handleInputChange}
                      required
                      sx={{ mb: 3 }}
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
                      name="adminPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.adminPassword}
                      onChange={handleInputChange}
                      required
                      sx={{ mb: 3 }}
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
                
                {/* CAPTCHA */}
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 3
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    p: 1.5,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    letterSpacing: '0.3em',
                    color: '#333',
                    border: captchaError ? '1px solid #f44336' : '1px solid #e0e0e0',
                    position: 'relative',
                    width: isTablet ? '50%' : '40%',
                    height: '45px',
                    justifyContent: 'center'
                  }}>
                    {captchaValue}
                    <IconButton 
                      onClick={generateCaptcha} 
                      size="small" 
                      sx={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)' }}
                    >
                      <Refresh fontSize="small" />
                    </IconButton>
                  </Box>
                  <TextField
                    label="Enter CAPTCHA"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={userCaptchaInput}
                    onChange={(e) => setUserCaptchaInput(e.target.value)}
                    error={captchaError}
                    helperText={captchaError ? "Incorrect CAPTCHA" : ""}
                    required
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        color="primary" 
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        sx={{ 
                          color: 'rgb(168, 5, 11)',
                          '&.Mui-checked': {
                            color: 'rgb(168, 5, 11)',
                          }
                        }}
                      />
                    }
                    label="Remember me"
                  />
                  <a href="#" className="text-decoration-none" style={{ color: 'rgb(168, 5, 11)' }}>
                    Forgot Password?
                  </a>
                </Box>

                <Button
                  variant="contained"
                  type="submit"
                  disabled={isLoading}
                  fullWidth
                  sx={{ 
                    bgcolor: 'rgb(168, 5, 11)',
                    py: 1.5,
                    mb: 3,
                    '&:hover': {
                      bgcolor: 'rgb(138, 5, 11)',
                    }
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
                  ) : (
                    <>
                      Sign In <ArrowForward sx={{ ml: 1 }} />
                    </>
                  )}
                </Button>
                
                {/* Only show register option for Student role */}
                {activeRole === 'student' && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" display="inline" sx={{ mr: 1 }}>
                      Don't have an account?
                    </Typography>
                    <Button 
                      variant="text" 
                      onClick={handleRegisterClick}
                      sx={{ 
                        color: 'rgb(168, 5, 11)',
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Register Now
                    </Button>
                  </Box>
                )}
              </Form>
            </Box>
          </Fade>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;