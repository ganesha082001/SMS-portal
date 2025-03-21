import React, { useState, useEffect } from 'react';
import { Modal, Button as BSButton } from 'react-bootstrap';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  InputLabel
} from '@mui/material';
import { CloudUpload, Visibility, Delete, Refresh } from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';
import StudentService from '../../../../Services/studentService';
import SessionStorageUtil from '../../../../Session/SessionStorageUtils';

// FileUploader component remains unchanged
const FileUploader = ({ 
  label, 
  accept = 'application/pdf,image/*', 
  onChange, 
  value, 
  destinationPath, 
  destinationFileName,
  onFileUploaded,
  disabled = false
}) => {
  const [preview, setPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Function to handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Create preview URL for the file
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      // Simulate file upload to local folder
      const filePath = await uploadFile(file, destinationPath, destinationFileName);
      
      // Call the parent onChange handler with the file path
      onChange(filePath);
      
      // Notify parent component about the upload
      if (onFileUploaded) {
        onFileUploaded(filePath);
      }
      
      setUploading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploading(false);
    }
  };
  
  // Simulate file upload to local folder
  const uploadFile = (file, path, fileName) => {
    return new Promise((resolve) => {
      // In a real application, you would use FormData and fetch/axios to upload to server
      // This is a simulation for demo purposes
      setTimeout(() => {
        const extension = file.name.split('.').pop();
        const finalFileName = fileName ? `${fileName}.${extension}` : file.name;
        const finalPath = path ? `${path}/${finalFileName}` : finalFileName;
        resolve(finalPath);
      }, 1000);
    });
  };
  
  // Function to handle file deletion
  const handleDelete = (e) => {
    e.stopPropagation();
    setPreview(null);
    onChange('');
  };
  
  // Function to handle file re-upload
  const handleReupload = (e) => {
    e.stopPropagation();
    document.getElementById(`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`).click();
  };
  
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body1" component="label" sx={{ mb: 1, display: 'block' }}>
        {label}
      </Typography>
      
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
        disabled={disabled}
      />
      
      <label htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}>
        <Box 
          sx={{ 
            border: '1px dashed #ccc', 
            borderRadius: 1, 
            p: 2, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            bgcolor: disabled ? '#f5f5f5' : 'white',
            cursor: disabled ? 'not-allowed' : 'pointer',
            height: '60px'
          }}
        >
          {uploading ? (
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : value ? (
            <>
              <Typography noWrap sx={{ maxWidth: '60%' }}>
                {value.split('/').pop()}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={(e) => { e.stopPropagation(); setShowPreview(true); }} 
                  disabled={disabled}
                  sx={{ color: 'primary.main' }}
                >
                  <Visibility />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={handleReupload} 
                  disabled={disabled}
                  sx={{ color: 'secondary.main' }}
                >
                  <Refresh />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={handleDelete} 
                  disabled={disabled}
                  sx={{ color: 'error.main' }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CloudUpload sx={{ fontSize: 28, color: 'primary.main' }} />
              <Typography variant="body2">Click to upload {label}</Typography>
            </Box>
          )}
        </Box>
      </label>
      
      <Modal show={showPreview} onHide={() => setShowPreview(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>File Preview: {value ? value.split('/').pop() : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {preview && (
            value.toLowerCase().includes('.pdf') ? (
              <iframe
                src={preview}
                title="PDF Preview"
                width="100%"
                height="500px"
              />
            ) : (
              <img 
                src={preview} 
                alt="Preview" 
                className="img-fluid" 
                style={{ maxHeight: '400px' }}
              />
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          <BSButton variant="secondary" onClick={() => setShowPreview(false)}>
            Close
          </BSButton>
        </Modal.Footer>
      </Modal>
    </Box>
  );
};

const ScholarshipInfoForm = () => {
  const defaultFormState = {
    scholarshipInfoID: '',
    studentID: SessionStorageUtil.getParticularData('userID'),
    isParentDivorced: 'false',
    divorcedProofFilePath: '',
    isParentPhysicallyDisabled: 'false',
    parentPhysicallyDisabledFilePath: '',
    isReceivedAnyScholarship: 'false',
    scholarshipName: '',
    scholarshipAmountReceived: '',
    siblingsDetails: '',
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  
  // Fetch scholarship info when component mounts
  useEffect(() => {
    const fetchScholarshipInfo = async () => {
      setIsLoading(true);
      const studentId = SessionStorageUtil.getParticularData('userID');
      try {
        const response = await StudentService.getScholarshipInfo(studentId);
        
        if (response) {
          const data = response;
          
          // Check if we received valid data
          if (data && Object.keys(data).length > 0) {
            // Convert boolean values to string for radio buttons
            const formattedData = {
              ...data,
              isParentDivorced: data.isParentDivorced ? 'true' : 'false',
              isParentPhysicallyDisabled: data.isParentPhysicallyDisabled ? 'true' : 'false',
              isReceivedAnyScholarship: data.isReceivedAnyScholarship ? 'true' : 'false',
              // Ensure this is a string for input field
              scholarshipAmountReceived: data.scholarshipAmountReceived ? String(data.scholarshipAmountReceived) : '',
            };
            
            setFormData(formattedData);
            setIsEdit(true);
          }
        } else if (response.status === 404) {
          // Profile not found - reset to default state for adding new profile
          setFormData(defaultFormState);
          setIsEdit(false);
        } else {
          throw new Error('Server responded with an error');
        }
      } catch (error) {
        console.error('Error fetching scholarship data:', error);
        setNotification({
          open: true,
          message: 'No Scholarship information found. Please add your educational information.',
          severity: 'error'
        });
        // Reset to default state in case of error
        setFormData(defaultFormState);
        setIsEdit(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchScholarshipInfo();
  }, []);
  
  // Validate scholarship amount
  const validateScholarshipAmount = (value) => {
    if (value && !/^\d*$/.test(value)) {
      return 'Only numbers are allowed';
    }
    
    if (value && parseFloat(value) < 0) {
      return 'Amount must be a positive number';
    }
    
    return '';
  };
  
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    
    const updatedData = { ...formData };
    
    // For numerical fields, only accept digits
    if (field === 'scholarshipAmountReceived') {
      // Only update if the input is empty or contains only digits
      if (value === '' || /^\d*$/.test(value)) {
        updatedData[field] = value;
        // Real-time validation
        setErrors(prev => ({
          ...prev,
          [field]: validateScholarshipAmount(value)
        }));
      }
    } else {
      updatedData[field] = value;
      
      // Clear associated file paths when changing radio buttons to 'false'
      if (field === 'isParentDivorced' && value === 'false') {
        updatedData.divorcedProofFilePath = '';
      } else if (field === 'isParentPhysicallyDisabled' && value === 'false') {
        updatedData.parentPhysicallyDisabledFilePath = '';
      } else if (field === 'isReceivedAnyScholarship' && value === 'false') {
        updatedData.scholarshipName = '';
        updatedData.scholarshipAmountReceived = '';
      }
    }
    
    setFormData(updatedData);
  };
  
  const handleFileChange = (field) => (filePath) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: filePath
    }));
  };
  
  const validateForm = () => {
    // Basic validations for form fields
    const formErrors = {};
    
    // Validate that files are uploaded when corresponding options are selected
    if (formData.isParentDivorced === 'true' && !formData.divorcedProofFilePath) {
      formErrors.divorcedProof = 'Please upload Divorced Proof document';
    }
    
    if (formData.isParentPhysicallyDisabled === 'true' && !formData.parentPhysicallyDisabledFilePath) {
      formErrors.disabledProof = 'Please upload Disability Proof document';
    }
    
    if (formData.isReceivedAnyScholarship === 'true') {
      if (!formData.scholarshipName) {
        formErrors.scholarshipName = 'Please enter Scholarship Name';
      }
      
      if (!formData.scholarshipAmountReceived) {
        formErrors.scholarshipAmountReceived = 'Please enter Scholarship Amount';
      } else if (validateScholarshipAmount(formData.scholarshipAmountReceived)) {
        formErrors.scholarshipAmountReceived = validateScholarshipAmount(formData.scholarshipAmountReceived);
      }
    }
    
    return formErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      // Show the first error
      setNotification({
        open: true,
        message: Object.values(formErrors)[0],
        severity: 'error'
      });
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    try {
      // Convert string values back to boolean for API submission
      const submissionData = {
        ...formData,
        isParentDivorced: formData.isParentDivorced === 'true',
        isParentPhysicallyDisabled: formData.isParentPhysicallyDisabled === 'true',
        isReceivedAnyScholarship: formData.isReceivedAnyScholarship === 'true',
        scholarshipAmountReceived: formData.scholarshipAmountReceived ? parseInt(formData.scholarshipAmountReceived, 10) : 0,
        createdAt: formData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false
      };
      
      let response;
      if (isEdit) {
        // Update existing scholarship information
        response = await StudentService.updateScholarshipInfo(submissionData);
      } else {
        // Create new scholarship information
        response = await StudentService.createScholarshipInfo(submissionData);
      }
      
      if (response) {
        setNotification({
          open: true,
          message: isEdit 
            ? 'Scholarship information updated successfully!' 
            : 'Scholarship information saved successfully!',
          severity: 'success'
        });
        
        if (!isEdit) {
          // If this was an add operation, update form to edit mode
          const newData = response;
          setFormData({
            ...newData,
            isParentDivorced: newData.isParentDivorced ? 'true' : 'false',
            isParentPhysicallyDisabled: newData.isParentPhysicallyDisabled ? 'true' : 'false',
            isReceivedAnyScholarship: newData.isReceivedAnyScholarship ? 'true' : 'false',
            scholarshipAmountReceived: newData.scholarshipAmountReceived?.toString() || ''
          });
          setIsEdit(true);
        }
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setNotification({
        open: true,
        message: 'Error saving scholarship information. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  // Show loading state while fetching data
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto', my: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEdit ? 'Edit Scholarship Information' : 'Add Scholarship Information'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          
          {/* Hidden fields for IDs - they're still in the state but not visible in UI */}
          <input type="hidden" name="scholarshipInfoID" value={formData.scholarshipInfoID || ''} />
          <input type="hidden" name="studentID" value={formData.studentID || ''} />
          
          {/* Family Situation Section */}
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" sx={{ mt: 2, mb: 2, borderBottom: '1px solid #eee', pb: 1 }}>
              Family Information
            </Typography>
          </Grid>
          
          {/* Parent Divorced Section */}
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Are Parents Divorced?</FormLabel>
              <RadioGroup
                row
                name="isParentDivorced"
                value={formData.isParentDivorced}
                onChange={handleChange('isParentDivorced')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
            
            {formData.isParentDivorced === 'true' && (
              <FileUploader
                label="Divorce Proof Document"
                destinationPath="uploads/divorce-proof"
                destinationFileName={`divorce_${formData.studentID || 'new'}`}
                onChange={handleFileChange('divorcedProofFilePath')}
                value={formData.divorcedProofFilePath || ''}
                disabled={false}
              />
            )}
            {errors.divorcedProof && (
              <Typography variant="caption" color="error">
                {errors.divorcedProof}
              </Typography>
            )}
          </Grid>
          
          {/* Parent Physically Disabled Section */}
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Is Any Parent Physically Disabled?</FormLabel>
              <RadioGroup
                row
                name="isParentPhysicallyDisabled"
                value={formData.isParentPhysicallyDisabled}
                onChange={handleChange('isParentPhysicallyDisabled')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
            
            {formData.isParentPhysicallyDisabled === 'true' && (
              <FileUploader
                label="Physical Disability Proof"
                destinationPath="uploads/disability-proof"
                destinationFileName={`disability_${formData.studentID || 'new'}`}
                onChange={handleFileChange('parentPhysicallyDisabledFilePath')}
                value={formData.parentPhysicallyDisabledFilePath || ''}
                disabled={false}
              />
            )}
            {errors.disabledProof && (
              <Typography variant="caption" color="error">
                {errors.disabledProof}
              </Typography>
            )}
          </Grid>
          
          {/* Siblings Information */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Siblings Details"
              multiline
              rows={3}
              value={formData.siblingsDetails || ''}
              onChange={handleChange('siblingsDetails')}
              margin="normal"
              placeholder="Enter details about siblings (name, age, education, etc.)"
              helperText="List your siblings with their names, ages, and education details"
            />
          </Grid>
          
          {/* Scholarship Section */}
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" sx={{ mt: 2, mb: 2, borderBottom: '1px solid #eee', pb: 1 }}>
              Scholarship Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Have You Received Any Other Scholarship?</FormLabel>
              <RadioGroup
                row
                name="isReceivedAnyScholarship"
                value={formData.isReceivedAnyScholarship}
                onChange={handleChange('isReceivedAnyScholarship')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
          
          {formData.isReceivedAnyScholarship === 'true' && (
            <>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Scholarship Name"
                  value={formData.scholarshipName || ''}
                  onChange={handleChange('scholarshipName')}
                  margin="normal"
                  required
                  error={!!errors.scholarshipName}
                  helperText={errors.scholarshipName}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Amount Received (₹)"
                  value={formData.scholarshipAmountReceived || ''}
                  onChange={handleChange('scholarshipAmountReceived')}
                  margin="normal"
                  required
                  error={!!errors.scholarshipAmountReceived}
                  helperText={errors.scholarshipAmountReceived || "Enter amount in rupees"}
                  InputProps={{
                    startAdornment: '₹',
                  }}
                />
              </Grid>
            </>
          )}
          
          {/* Submit Button */}
          <Grid item xs={12} sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading || !!errors.scholarshipAmountReceived}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
              sx={{ minWidth: '200px' }}
            >
              {isEdit ? 'Update Scholarship Information' : 'Submit Scholarship Information'}
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={closeNotification}>
        <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ScholarshipInfoForm;