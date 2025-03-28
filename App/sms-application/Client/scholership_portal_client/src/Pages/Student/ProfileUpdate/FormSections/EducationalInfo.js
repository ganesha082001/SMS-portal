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
import StudentService from '../../../../Services/studentService';
import SessionStorageUtil from '../../../../Session/SessionStorageUtils';
const departmentOptions = {
  "UG-Aided": [
    "Department of Tamil",
    "Department of Hindi",
    "Department of Sanskrit",
    "BA English",
    "BA History and Tourism",
    "BA Economics",
    "BSc Mathematics",
    "BSc Statistics",
    "BSc Physics",
    "BSc Chemistry",
    "BSc Plant Biology and Plant Biotechnology",
    "BSc Computer Science",
    "Department of Commerce",
    "Physical Education",
  ],
  "UG-SFS": [
    "Library",
    "Department of Physical Education",
    "BSc Computer Science with Cognitive Systems",
    "BCom Computer Application",
    "BSc Computer Science with Artificial Intelligence",
    "BSc Computer Science with Data Science",
    "Tamil",
    "BA English SFS",
    "Hindi",
    "French",
    "Sanskrit",
    "Department of Business Administration",
    "Department of BCA",
    "BSc Computer Science",
    "BSc Mathematics",
    "BCom General",
    "Department of BCom (Corporate Secretaryship)",
    "BCom (Accounting and Finance)",
    "Department of BCom (Honours)",
    "BCom (Information Systems Management)",
    "BCom (Professional Accounting)",
    "BCom (Banking and Insurance Management)",
    "BSc Psychology",
    "BSc Visual Communication",
    "BSc Clinical Nutrition and Dietetics",
    "BSc Nutrition Food Service Management and Dietetics",
  ],
  PG: [
    "MA English",
    "MSc Counselling Psychology",
    "MA Economics",
    "MA Tamil",
    "MSc Physics",
    "MSc Chemistry",
    "MCom General",
    "MCom (Corporate Secretaryship)",
    "MCom (Accounting and Finance)",
    "MSc Applicable Mathematics",
    "MSc Computer Science",
    "Research Dept of Statistics",
    "MSc Home Science - Food Science, Nutrition and Dietetics",
    "PG Dept of Plant Biology and Plant Biotechnology",
    "Dept of Human Resource Management",
    "Dept of Social Work",
    "MA Journalism and Communication",
  ],
};

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

const EducationalInformationForm = () => {
  const defaultFormState = {
    educationalId: '',
    studentId: SessionStorageUtil.getParticularData('userID'),
    courseType: '',
    startYear: '',
    batch: '',
    shift: '',
    isHosteler: 'false',
    currentYear: '',
    section: '',
    isFirstGraduate: 'false',
    firstGraduateFilePath: '',
    schoolType: '',
    umiStudentNumber: '',
    department: '',
    previousYearMarks: '',
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchEducationalData = async () => {
      setIsLoading(true);
      const studentId = SessionStorageUtil.getParticularData('userID');
      try {
        // Replace this with your actual API endpoint
        const response = await StudentService.getEducationalInfo(studentId);

        if (response) {
          const data = response;

          // Check if we received valid data
          if (data && Object.keys(data).length > 0) {
            // Convert boolean values to string for radio buttons
            const formattedData = {
              ...data,
              isHosteler: data.isHosteler ? 'true' : 'false',
              isFirstGraduate: data.isFirstGraduate ? 'true' : 'false',
              startYear: data.startYear?.toString() || '',
              currentYear: data.currentYear?.toString() || '',
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
        console.error('Error fetching educational data:', error);
        setNotification({
          open: true,
          message: 'No educational information found. Please add your educational information.',
          severity: 'error'
        });
        // Reset to default state in case of error
        setFormData(defaultFormState);
        setIsEdit(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducationalData();
  }, []);

  const updateBatch = (courseType, startYear) => {
    if (courseType && startYear) {
      let endYear;
      if (courseType === 'UG') {
        endYear = parseInt(startYear) + 3;
      } else if (courseType === 'PG') {
        endYear = parseInt(startYear) + 2;
      }
      if (endYear) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          batch: `${startYear}-${endYear}`
        }));
      }
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));

    if (field === 'courseType' || field === 'startYear') {
      updateBatch(field === 'courseType' ? value : formData.courseType, field === 'startYear' ? value : formData.startYear);
    }
    // Clear associated file paths when changing radio buttons to 'false'
    if (field === 'isFirstGraduate' && value === 'false') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        firstGraduateFilePath: '',
      }));
    }
  };

  const handleNumberChange = (field) => (e) => {
    const value = e.target.value;

    // Only update if the input is empty or contains only digits
    if (value === '' || /^\d*$/.test(value)) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: value
      }));

      if (field === 'startYear') {
        updateBatch(formData.courseType, value);
      }
    }
  };

  const handleFileChange = (field) => (filePath) => {
    setFormData({
      ...formData,
      [field]: filePath
    });
  };

  const validateForm = () => {
    // Basic validations for form fields
    const formErrors = {};

    if (!formData.courseType) {
      formErrors.courseType = 'Course Type is required';
    }

    if (!formData.startYear) {
      formErrors.startYear = 'Start Year is required';
    } else if (formData.startYear < 1900 || formData.startYear > 2100) {
      formErrors.startYear = 'Start Year must be between 1900 and 2100';
    }

    if (!formData.batch) {
      formErrors.batch = 'Batch is required';
    }

    if (!formData.currentYear) {
      formErrors.currentYear = 'Current Year is required';
    } else if (formData.currentYear < 1 || formData.currentYear > 6) {
      formErrors.currentYear = 'Current Year must be between 1 and 6';
    }

    // Validate that files are uploaded when corresponding options are selected
    if (formData.isFirstGraduate === 'true' && !formData.firstGraduateFilePath) {
      formErrors.firstGraduate = 'Please upload First Graduate Proof';
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
        isHosteler: formData.isHosteler === 'true',
        isFirstGraduate: formData.isFirstGraduate === 'true',
        startYear: parseInt(formData.startYear, 10),
        currentYear: parseInt(formData.currentYear, 10),
        createdAt: formData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false
      };

      let response;
      if (isEdit) {
        // Update existing educational information
        response = await StudentService.updateEducationalInfo(submissionData);
      } else {
        delete submissionData.educationalId;
        // Create new educational information
        response = await StudentService.createEducationalInfo(submissionData);
      }

      if (response) {
        setNotification({
          open: true,
          message: isEdit ? 'Educational information updated successfully!' : 'Educational information saved successfully!',
          severity: 'success'
        });

        if (!isEdit) {
          // If this was an add operation, get the new data to update the form
          const newData = await response;
          setFormData({
            ...newData,
            isHosteler: newData.isHosteler ? 'true' : 'false',
            isFirstGraduate: newData.isFirstGraduate ? 'true' : 'false',
            startYear: newData.startYear?.toString() || '',
            currentYear: newData.currentYear?.toString() || '',
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
        message: 'Error saving educational information. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

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
        {isEdit ? 'Edit Educational Information' : 'Add Educational Information'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>

          <input type="hidden" name="educationalId" value={formData.educationalId} />
          <input type="hidden" name="studentId" value={formData.studentId} />

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal" error={!!errors.courseType}>
              <InputLabel>Course Type</InputLabel>
              <Select
                name="courseType"
                value={formData.courseType}
                onChange={handleChange('courseType')}
                label="Course Type"
                required
              >
                <MenuItem value="">Select One</MenuItem>
                <MenuItem value="UG">Undergraduate (UG)</MenuItem>
                <MenuItem value="PG">Postgraduate (PG)</MenuItem>

              </Select>
              {errors.courseType && (
                <Typography variant="caption" color="error">
                  {errors.courseType}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Start Year"
              value={formData.startYear}
              onChange={handleNumberChange('startYear')}
              margin="normal"
              required
              error={!!errors.startYear}
              helperText={errors.startYear || "Enter the year you started (e.g., 2022)"}
              inputProps={{ maxLength: 4 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Batch"
              value={formData.batch}
              onChange={handleChange('batch')}
              margin="normal"
              required
              error={!!errors.batch}
              helperText={errors.batch}
              placeholder="e.g., 2022-2026"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Shift</InputLabel>
              <Select
                name="shift"
                value={formData.shift}
                onChange={handleChange('shift')}
                label="Shift"
              >
                <MenuItem value="">Select One</MenuItem>
                <MenuItem value="UG-Aided">UG-Aided</MenuItem>
                <MenuItem value="UG-SFS">UG-SFS</MenuItem>
                <MenuItem value="PG">PG</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleChange("department")}
                label="Department"
              >
                <MenuItem value="">Select One</MenuItem>
                {departmentOptions[formData.shift]?.map((department, index) => (
                  <MenuItem key={index} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Current Year</InputLabel>
              <Select
                name="currentYear"
                value={formData.currentYear}
                onChange={handleChange("currentYear")}
                label="Current Year"
              >
                <MenuItem value="">Select One</MenuItem>
                {formData.courseType === "UG" && (
                  <>
                    <MenuItem value="1">1st Year</MenuItem>
                    <MenuItem value="2">2nd Year</MenuItem>
                    <MenuItem value="3">3rd Year</MenuItem>
                  </>
                )}
                {formData.courseType === "PG" && (
                  <>
                    <MenuItem value="1">1st Year</MenuItem>
                    <MenuItem value="2">2nd Year</MenuItem>
                  </>
                )}
              </Select>
            </FormControl>
          </Grid>
          {formData.currentYear != '' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={
                    formData.currentYear === "1"
                      ? "Enter HSLC Mark"
                      : formData.currentYear === "2"
                        ? "Enter 1st Year Mark"
                        : formData.currentYear === "3"
                          ? "Enter 2nd Year Mark"
                          : "Previous Year Marks"
                  }
                  value={formData.previousYearMarks || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
                      handleChange('previousYearMarks')(e);
                    }
                  }}
                  margin="normal"
                  required
                  error={!!errors.previousYearMarks}
                  helperText={errors.previousYearMarks || "Enter a value between 0 and 100"}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Section</InputLabel>
              <Select
                name="section"
                value={formData.section}
                onChange={handleChange('section')}
                label="section"
              >
                <MenuItem value="">Select One</MenuItem>
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="C">C</MenuItem>
                <MenuItem value="D">D</MenuItem>
                <MenuItem value="None">None</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="UMIS Student Number"
              value={formData.umiStudentNumber}
              onChange={handleChange('umiStudentNumber')}
              margin="normal"
              placeholder="Enter UMI Student Number"
              inputProps={{ maxLength: 10 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>School Type</InputLabel>
              <Select
                name="schoolType"
                value={formData.schoolType}
                onChange={handleChange('schoolType')}
                label="School Type"
              >
                <MenuItem value="">Select One</MenuItem>
                <MenuItem value="Government">Government</MenuItem>
                <MenuItem value="Government Aided(englishmedium)">Government Aided(English Medium)</MenuItem>
                <MenuItem value="Government Aided(tamilmedium)">Government Aided(Tamil Medium)</MenuItem>
                <MenuItem value="Private">Private</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" sx={{ mt: 2, mb: 2, borderBottom: '1px solid #eee', pb: 1 }}>
              Additional Information
            </Typography>
          </Grid>

          {/* Hosteler Status */}
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Hosteler Status</FormLabel>
              <RadioGroup
                row
                name="isHosteler"
                value={formData.isHosteler}
                onChange={handleChange('isHosteler')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* First Graduate Status */}
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">First Graduate</FormLabel>
              <RadioGroup
                row
                name="isFirstGraduate"
                value={formData.isFirstGraduate}
                onChange={handleChange('isFirstGraduate')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            {formData.isFirstGraduate === 'true' && (
              <FileUploader
                label="First Graduate Proof"
                destinationPath="uploads/first-graduate"
                destinationFileName={`first_graduate_${formData.studentId || 'new'}`}
                onChange={handleFileChange('firstGraduateFilePath')}
                value={formData.firstGraduateFilePath}
                disabled={false}
              />
            )}
            {errors.firstGraduate && (
              <Typography variant="caption" color="error">
                {errors.firstGraduate}
              </Typography>
            )}
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
              sx={{ minWidth: '200px' }}
            >
              {isEdit ? 'Update Information' : 'Submit Information'}
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

export default EducationalInformationForm;