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
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import { CloudUpload, Visibility, Delete, Refresh } from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';
import SessionStorageUtil from '../../../../Session/SessionStorageUtils';
import StudentService from '../../../../Services/studentService';

// FileUploader component remains unchanged...
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
  // FileUploader implementation remains the same
  const [preview, setPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileObj, setFileObj] = useState(null); // Store the actual file object
  
  // Function to handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Create preview URL for the file
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      // Keep a reference to the file object for later use during form submission
      setFileObj(file);
      
      // Create temporary file path (will be used for final storage during form submission)
      const extension = file.name.split('.').pop();
      const finalFileName = destinationFileName ? `${destinationFileName}.${extension}` : file.name;
      const tempPath = destinationPath ? `${destinationPath}/${finalFileName}` : finalFileName;
      
      // Call the parent onChange handler with the file path
      onChange(tempPath);
      
      // Notify parent component about the upload
      if (onFileUploaded) {
        onFileUploaded(tempPath, file); // Pass both the path and file object
      }
      
      setUploading(false);
    } catch (error) {
      console.error('Error preparing file:', error);
      setUploading(false);
    }
  };
  
  // Function to handle file deletion
  const handleDelete = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileObj(null);
    onChange('');
  };
  
  // Function to handle file re-upload
  const handleReupload = (e) => {
    e.stopPropagation();
    document.getElementById(`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`).click();
  };
  
  // Get the file object for external access
  const getFileObject = () => fileObj;
  
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
              <Box sx={{ width:'20%', display: 'flex', gap: 1 }} xs={12}>
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

const StudentInformationForm = () => {
  const defaultFormState = {
    personalId: '',
    studentId: SessionStorageUtil.getParticularData('userID') || '',
    community: '',
    aadharNumber: '',
    aadharMobileNumber: '',
    hasCommunityCertificate: 'false',
    communityCertificatePath: '',
    hasIncomeCertificate: 'false',
    incomeCertificatePath: '',
    isDonePartTime: 'false',
    partTimeProofFilePath: '',
    incomeCertificateIssuedDate: '',
    bankName:'',
    accountHolderName:'',
    accountNumber:'',
    ifscCode:'',
    DOB:'',
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState({
    aadharNumber: '',
    aadharMobileNumber: ''
  });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Store file objects separately for submission
  const [uploadedFiles, setUploadedFiles] = useState({
    communityCertificate: null,
    incomeCertificate: null,
    partTimeProof: null
  });

  // Fetch student data on component load
  useEffect(() => {
    const fetchStudentData = async () => {
      setFetchLoading(true);
      
      try {
        // Get studentId from session storage
        const studentId = SessionStorageUtil.getParticularData('userID');

        // Call StudentService to get the profile
        const response = await StudentService.hasSavedPersonalInfo(studentId);
        
        if (response) {
          // Profile exists - convert boolean values to string for radio buttons
          setFormData({
            ...response,
            hasCommunityCertificate: response.hasCommunityCertificate ? 'true' : 'false',
            hasIncomeCertificate: response.hasIncomeCertificate ? 'true' : 'false',
            isDonePartTime: response.isDonePartTime ? 'true' : 'false',
          });
          setIsEdit(true);
        } else {
          // No profile found - show add form with studentId populated
          setIsEdit(false);
          setFormData({
            ...defaultFormState,
            studentId: studentId
          });
          setNotification({
            open: true,
            message: 'No existing data found for this student. Please fill in the details.',
            severity: 'info'
          });
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        // Handle specific error cases
        if (error.response && error.response.status === 404) {
          // Not found - show add form
          setIsEdit(false);
          setFormData({
            ...defaultFormState,
            studentId: SessionStorageUtil.getParticularData('userID') || ''
          });
        } else {
          // Other error
          setNotification({
            open: true,
            message: 'No Personal information found. Please add your educational information.',
            severity: 'error'
          });
        }
      } finally {
        setFetchLoading(false);
      }
    };
    
    fetchStudentData();
    const studentId = defaultFormState.studentId;
        
    if (!studentId) {
      // No studentId found, show add form
      setIsEdit(false);
      setFormData(defaultFormState);
      setFetchLoading(false);
      return;
    }
  }, []);
  
  // Validate mobile numbers in real-time
  const validateMobileNumber = (field, value) => {
    // Only numbers allowed
    if (value && !/^\d*$/.test(value)) {
      return 'Only numbers are allowed';
    }
    
    // Must start with 5-9 and be 10 digits when complete
    if (value && value.length === 10) {
      if (!/^[5-9]\d{9}$/.test(value)) {
        return 'Number must start with 5-9 and be 10 digits';
      }
    }
    
    return '';
  };

  const validateAadharNumber = (field, value) => {
    // Only numbers allowed
    if (value && !/^\d*$/.test(value)) {
      return 'Only numbers are allowed';
    }

    // Must be exactly 12 digits
    if (value && value.length !== 12) {
      return 'Aadhar Number must be exactly 12 digits';
    }

    return '';
  };
  
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    
    const updatedData = { ...formData };
    
    // For mobile number fields, only accept digits
    if ( field === 'aadharMobileNumber') {
      // Only update if the input is empty or contains only digits
      if (value === '' || /^\d*$/.test(value)) {
        updatedData[field] = value;
        // Real-time validation
        setErrors(prev => ({
          ...prev,
          [field]: validateMobileNumber(field, value)
        }));
      }
    }
    else if(field === 'aadharNumber'){
      updatedData[field] = value;
      setErrors(prev => ({
        ...prev,
        [field]: validateAadharNumber(field, value)}))
    }
       else {
      updatedData[field] = value;
      
      // Clear associated file paths when changing radio buttons to 'false'
      if (field === 'hasCommunityCertificate' && value === 'false') {
        updatedData.communityCertificatePath = '';
        // Also clear the file object
        setUploadedFiles(prev => ({ ...prev, communityCertificate: null }));
      } else if (field === 'hasIncomeCertificate' && value === 'false') {
        updatedData.incomeCertificatePath = '';
        updatedData.incomeCertificateIssuedDate = '';
        // Also clear the file object
        setUploadedFiles(prev => ({ ...prev, incomeCertificate: null }));
      } else if (field === 'isDonePartTime' && value === 'false') {
        updatedData.partTimeProofFilePath = '';
        // Also clear the file object
        setUploadedFiles(prev => ({ ...prev, partTimeProof: null }));
      }
    }
    
    setFormData(updatedData);
  };
  
  const handleFileChange = (field) => (filePath, fileObj) => {
    setFormData({
      ...formData,
      [field]: filePath
    });
    
    // Store the file object for later processing
    if (field === 'communityCertificatePath') {
      setUploadedFiles(prev => ({ ...prev, communityCertificate: fileObj }));
    } else if (field === 'incomeCertificatePath') {
      setUploadedFiles(prev => ({ ...prev, incomeCertificate: fileObj }));
    } else if (field === 'partTimeProofFilePath') {
      setUploadedFiles(prev => ({ ...prev, partTimeProof: fileObj }));
    }
  };
  
  // Function to copy file to New folder
  const copyFileToNewFolder = async (file, originalPath) => {
    if (!file) return originalPath; // Return original path if no file object is available
    
    return new Promise((resolve, reject) => {
      try {
        // Extract filename from the original path
        const filename = originalPath.split('/').pop();
        
        // Create new path in the "New" folder in root directory
        const newPath = `New/${filename}`;
        
        // In a real application, you would use server-side code to copy the file
        // This is a simulation for demonstration purposes
        console.log(`File copied from ${originalPath} to ${newPath}`);
        
        // For real implementation, you'd use FileSystem APIs or upload to server
        // Here we're simulating successful copy
        resolve(newPath);
      } catch (error) {
        console.error(`Error copying file to New folder: ${error}`);
        reject(error);
      }
    });
  };
  
  const validateForm = () => {
    // Basic validations for form fields
    const formErrors = {};
    
    if (!formData.community) {
      formErrors.community = 'Community is required';
    }
    
    // Validate aadhar number
    if (!formData.aadharNumber) {
      formErrors.aadharNumber = 'Aadhar Number is required';
    } else if (formData.aadharNumber.length !== 12) {
      formErrors.aadharNumber = 'Aadhar Number must be 12 digits';
    } 
    
    // Validate aadhar mobile number
    if (!formData.aadharMobileNumber) {
      formErrors.aadharMobileNumber = 'Aadhar Mobile Number is required';
    } else if (formData.aadharMobileNumber.length !== 10) {
      formErrors.aadharMobileNumber = 'Mobile Number must be 10 digits';
    } else if (!/^[5-9]\d{9}$/.test(formData.aadharMobileNumber)) {
      formErrors.aadharMobileNumber = 'Mobile Number must start with 5-9';
    }
    
    // Validate that files are uploaded when corresponding options are selected
    if (formData.hasCommunityCertificate === 'true' && !formData.communityCertificatePath) {
      formErrors.communityCertificate = 'Please upload Community Certificate';
    }
    
    if (formData.hasIncomeCertificate === 'true') {
      if (!formData.incomeCertificatePath) {
        formErrors.incomeCertificate = 'Please upload Income Certificate';
      }
      if (!formData.incomeCertificateIssuedDate) {
        formErrors.incomeCertificateIssuedDate = 'Please select Income Certificate Issue Date';
      }
    }
    
    if (formData.isDonePartTime === 'true' && !formData.partTimeProofFilePath) {
      formErrors.partTime = 'Please upload Part-Time Work Proof';
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
      setLoading(false);
      return;
    }

    try {
      // Copy files to the New folder
      let updatedFormData = { ...formData };
      
      // Process community certificate if exists
      if (formData.hasCommunityCertificate === 'true' && uploadedFiles.communityCertificate) {
        const newPath = await copyFileToNewFolder(
          uploadedFiles.communityCertificate, 
          formData.communityCertificatePath
        );
        updatedFormData.communityCertificatePath = newPath;
      }
      
      // Process income certificate if exists
      if (formData.hasIncomeCertificate === 'true' && uploadedFiles.incomeCertificate) {
        const newPath = await copyFileToNewFolder(
          uploadedFiles.incomeCertificate, 
          formData.incomeCertificatePath
        );
        updatedFormData.incomeCertificatePath = newPath;
      }
      
      // Process part-time proof if exists
      if (formData.isDonePartTime === 'true' && uploadedFiles.partTimeProof) {
        const newPath = await copyFileToNewFolder(
          uploadedFiles.partTimeProof, 
          formData.partTimeProofFilePath
        );
        updatedFormData.partTimeProofFilePath = newPath;
      }
      
      // Convert string values back to boolean for API submission
      const currentDate = new Date().toISOString();
      const submissionData = {
        ...updatedFormData,
        hasCommunityCertificate: updatedFormData.hasCommunityCertificate === 'true',
        hasIncomeCertificate: updatedFormData.hasIncomeCertificate === 'true',
        isDonePartTime: updatedFormData.isDonePartTime === 'true',
        createdAt: isEdit ? undefined : currentDate, // Only set for new records
        updatedAt: currentDate,
        isDeleted: false
      };
      
      // Use StudentService to either create or update
      if (isEdit) {
        // Update existing student data
        await StudentService.updatePersonalInfo(submissionData);
        setNotification({
          open: true,
          message: 'Student information updated successfully!',
          severity: 'success'
        });
      } else {
        // Create new student data
        delete submissionData.personalId;
        await StudentService.savePersonalInfo(submissionData);
        setNotification({
          open: true,
          message: 'Student information saved successfully!',
          severity: 'success'
        });
        // Set to edit mode after successful creation
        setIsEdit(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setNotification({
        open: true,
        message: 'Error saving student information. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  if (fetchLoading) {
    return (
      <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto', my: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading student information...</Typography>
        </Box>
      </Paper>
    );
  }
  
  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto', my: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEdit ? 'Edit Personal Information' : 'Add Personal Information'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          
          {/* Hidden fields for studentID and personalID - they're still in the state but not visible in UI */}
          <input type="hidden" name="studentId" value={formData.studentId} />
          <input type="hidden" name="personalId" value={formData.personalId} />
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Community</InputLabel>
              <Select
                name="community"
                value={formData.community}
                onChange={handleChange('community')}
                label="Community"
                required
              >
                <MenuItem value="">Select One</MenuItem>
                <MenuItem value="BC/BCM">BC/BCM</MenuItem>
                <MenuItem value="MBC/BNC">MBC/BNC</MenuItem>
                <MenuItem value="SC/ST/SCA">SC/ST/SCA</MenuItem>
                <MenuItem value="OC">OC</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} >
          <TextField
                  fullWidth
                  label="DOB"
                  type="date"
                  value={formData.dob ? formData.dob.split('T')[0] : ''}
                  onChange={handleChange('DOB')}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Aadhar Number"
              value={formData.aadharNumber}
              onChange={handleChange('aadharNumber')}
              margin="normal"
              required
              error={!!errors.aadharNumber}
              helperText={errors.aadharNumber || "Enter valid 12 digit Aadhar Number"}
              inputProps={{ maxLength: 12 }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Aadhar Mobile Number"
              value={formData.aadharMobileNumber}
              onChange={handleChange('aadharMobileNumber')}
              margin="normal"
              required
              error={!!errors.aadharMobileNumber}
              helperText={errors.aadharMobileNumber || "10 digits starting with 5-9"}
              inputProps={{ maxLength: 10 }}
            />
          </Grid>
          
          {/* Certificates Section */}
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" sx={{ mt: 2, mb: 2, borderBottom: '1px solid #eee', pb: 1 }}>
              Certificates & Documentation
            </Typography>
          </Grid>
          
          {/* Community Certificate Section */}
          <Grid item xs={12} md={4}>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Community Certificate</FormLabel>
              <RadioGroup
                row
                name="hasCommunityCertificate"
                value={formData.hasCommunityCertificate}
                onChange={handleChange('hasCommunityCertificate')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
            
            {formData.hasCommunityCertificate === 'true' && (
              <FileUploader
                label="Community Certificate"
                destinationPath="uploads/community"
                destinationFileName={`community_${formData.studentId || 'new'}`}
                onChange={handleFileChange('communityCertificatePath')}
                value={formData.communityCertificatePath}
                disabled={false}
              />
            )}
          </Grid>
          
          {/* Income Certificate Section */}
          <Grid item xs={12} md={4}>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Income Certificate</FormLabel>
              <RadioGroup
                row
                name="hasIncomeCertificate"
                value={formData.hasIncomeCertificate}
                onChange={handleChange('hasIncomeCertificate')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
            
            {formData.hasIncomeCertificate === 'true' && (
              <>
                <FileUploader
                  label="Income Certificate"
                  destinationPath="uploads/income"
                  destinationFileName={`income_${formData.studentId || 'new'}`}
                  onChange={handleFileChange('incomeCertificatePath')}
                  value={formData.incomeCertificatePath}
                  disabled={false}
                />
                <TextField
                  fullWidth
                  label="Income Certificate Issued Date"
                  type="date"
                  value={formData.incomeCertificateIssuedDate ? formData.incomeCertificateIssuedDate.split('T')[0] : ''}
                  onChange={handleChange('incomeCertificateIssuedDate')}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </>
            )}
          </Grid>
          
          {/* Part-Time Section */}
          <Grid item xs={12} md={4}>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Part-Time Work</FormLabel>
              <RadioGroup
                row
                name="isDonePartTime"
                value={formData.isDonePartTime}
                onChange={handleChange('isDonePartTime')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
            
            {formData.isDonePartTime === 'true' && (
              <FileUploader
                label="Part-Time Proof"
                destinationPath="uploads/part-time"
                destinationFileName={`parttime_${formData.studentId || 'new'}`}
                onChange={handleFileChange('partTimeProofFilePath')}
                value={formData.partTimeProofFilePath}
                disabled={false}
              />
            )}
          </Grid>
          {/* Bank Details Section */}
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" sx={{ mt: 2, mb: 2, borderBottom: '1px solid #eee', pb: 1 }}>
              Bank Details
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Bank Name"
              value={formData.bankName}
              onChange={handleChange('bankName')}
              margin="normal"
              required
              error={!!errors.bankName}
              helperText={errors.bankName || "Bank Name is mandatory"}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Account Holder Name"
              value={formData.accountHolderName}
              onChange={handleChange('accountHolderName')}
              margin="normal"
              required
              error={!!errors.accountHolderName}
              helperText={errors.accountHolderName || "Account Holder Name is mandatory"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Account Number"
              value={formData.accountNumber}
              onChange={handleChange('accountNumber')}
              margin="normal"
              required
              error={!!errors.accountNumber}
              helperText={errors.accountNumber || "Account Number is mandatory"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="IFSC Code"
              value={formData.ifscCode}
              onChange={handleChange('ifscCode')}
              margin="normal"
              required
              error={!!errors.ifscCode}
              helperText={errors.ifscCode || "IFSC Code is mandatory"}
            />
          </Grid>
          
          {/* Submit Button */}
          <Grid item xs={12} sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading || !!errors.aadharNumber || !!errors.aadharMobileNumber}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
              sx={{ minWidth: '200px' }}
            >
              {isEdit ? 'Update Personal Information' : 'Save Personal Information'}
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

export default StudentInformationForm;