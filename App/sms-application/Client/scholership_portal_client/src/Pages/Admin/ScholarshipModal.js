import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Switch, 
  FormHelperText,
  Alert
} from '@mui/material';

// Remove the date-fns adapter imports
// Instead use standard input for dates that's more compatible
import { Box } from '@mui/material';

const scholarshipTypes = [
  'Merit-Based',
  'Need-Based',
  'Research',
  'Athletic',
  'Community Service',
  'Diversity',
  'International',
  'Career-Specific',
  'Other'
];

const ScholarshipModal = ({ show, handleClose, scholarshipData, saveScholarship, staffList }) => {
  const isEditMode = Boolean(scholarshipData?.scholarshipId);
  const [formData, setFormData] = useState({
    scholarshipId: scholarshipData?.scholarshipId || '',
    scholarshipTitle: scholarshipData?.scholarshipTitle || '',
    scholarshipDescription: scholarshipData?.scholarshipDescription || '',
    eligibilityCriteria: scholarshipData?.eligibilityCriteria || '',
    // Format date to YYYY-MM-DDThh:mm
    applicationStartDate: scholarshipData?.applicationStartDate ? 
      new Date(scholarshipData.applicationStartDate).toISOString().slice(0, 16) : 
      new Date().toISOString().slice(0, 16),
    applicationEndDate: scholarshipData?.applicationEndDate ? 
      new Date(scholarshipData.applicationEndDate).toISOString().slice(0, 16) : 
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    scholarshipType: scholarshipData?.scholarshipType || '',
    contactStaffId: scholarshipData?.contactStaffId || '',
    canNotify: scholarshipData?.canNotify !== undefined ? scholarshipData.canNotify : true,
    isSelfEnrollable: scholarshipData?.isSelfEnrollable !== undefined ? scholarshipData.isSelfEnrollable : false,
    selfEnrollUrl: scholarshipData?.selfEnrollUrl || '',
    createdAt: scholarshipData?.createdAt || new Date().toISOString(),
    updatedAt: scholarshipData?.updatedAt || new Date().toISOString(),
    isDeleted: scholarshipData?.isDeleted !== undefined ? scholarshipData.isDeleted : false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Update form when scholarshipData changes
  React.useEffect(() => {
    if (scholarshipData) {
      setFormData({
        scholarshipId: scholarshipData.scholarshipId || '',
        scholarshipTitle: scholarshipData.scholarshipTitle || '',
        scholarshipDescription: scholarshipData.scholarshipDescription || '',
        eligibilityCriteria: scholarshipData.eligibilityCriteria || '',
        applicationStartDate: scholarshipData.applicationStartDate ? 
          new Date(scholarshipData.applicationStartDate).toISOString().slice(0, 16) : 
          new Date().toISOString().slice(0, 16),
        applicationEndDate: scholarshipData.applicationEndDate ? 
          new Date(scholarshipData.applicationEndDate).toISOString().slice(0, 16) : 
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        scholarshipType: scholarshipData.scholarshipType || '',
        contactStaffId: scholarshipData.contactStaffId || '',
        canNotify: scholarshipData.canNotify !== undefined ? scholarshipData.canNotify : true,
        isSelfEnrollable: scholarshipData.isSelfEnrollable !== undefined ? scholarshipData.isSelfEnrollable : false,
        selfEnrollUrl: scholarshipData.selfEnrollUrl || '',
      });
    }
  }, [scholarshipData]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.scholarshipTitle.trim())
      newErrors.scholarshipTitle = 'Title is required';
    else if (formData.scholarshipTitle.length < 3)
      newErrors.scholarshipTitle = 'Title must be at least 3 characters';
      
    if (!formData.scholarshipDescription.trim())
      newErrors.scholarshipDescription = 'Description is required';
    
    if (!formData.eligibilityCriteria.trim())
      newErrors.eligibilityCriteria = 'Eligibility criteria is required';
    
    if (!formData.applicationStartDate)
      newErrors.applicationStartDate = 'Start date is required';
    
    if (!formData.applicationEndDate)
      newErrors.applicationEndDate = 'End date is required';
    else if (new Date(formData.applicationEndDate) < new Date(formData.applicationStartDate))
      newErrors.applicationEndDate = 'End date must be after start date';
    
    if (!formData.scholarshipType)
      newErrors.scholarshipType = 'Scholarship type is required';
    
    if (!formData.contactStaffId)
      newErrors.contactStaffId = 'Contact staff is required';
    
    if (formData.isSelfEnrollable && !formData.selfEnrollUrl)
      newErrors.selfEnrollUrl = 'URL is required for self-enrollment';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setNotification({
        show: true,
        message: 'Please fix the errors before submitting',
        type: 'error'
      });
      return;
    }
    
    // Convert form dates to ISO strings for API
    const formattedData = {
      ...formData,
      applicationStartDate: new Date(formData.applicationStartDate).toISOString(),
      applicationEndDate: new Date(formData.applicationEndDate).toISOString()
    };
    
    setIsSubmitting(true);
    try {
      await saveScholarship(formattedData);
      setNotification({
        show: true,
        message: `Scholarship ${isEditMode ? 'updated' : 'created'} successfully!`,
        type: 'success'
      });
      
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      setNotification({
        show: true,
        message: `Error: ${error.message || 'Something went wrong'}`,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="lg" 
      backdrop="static" 
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditMode ? 'Edit Scholarship' : 'Add New Scholarship'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {notification.show && (
          <Alert 
            severity={notification.type} 
            onClose={() => setNotification({ ...notification, show: false })}
            sx={{ mb: 2 }}
          >
            {notification.message}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="scholarshipTitle"
            name="scholarshipTitle"
            label="Scholarship Title"
            value={formData.scholarshipTitle}
            onChange={handleChange}
            error={Boolean(errors.scholarshipTitle)}
            helperText={errors.scholarshipTitle}
            variant="outlined"
            margin="normal"
          />

          <TextField
            fullWidth
            id="scholarshipDescription"
            name="scholarshipDescription"
            label="Description"
            value={formData.scholarshipDescription}
            onChange={handleChange}
            error={Boolean(errors.scholarshipDescription)}
            helperText={errors.scholarshipDescription}
            variant="outlined"
            margin="normal"
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            id="eligibilityCriteria"
            name="eligibilityCriteria"
            label="Eligibility Criteria"
            value={formData.eligibilityCriteria}
            onChange={handleChange}
            error={Boolean(errors.eligibilityCriteria)}
            helperText={errors.eligibilityCriteria}
            variant="outlined"
            margin="normal"
            multiline
            rows={2}
          />

          <div className="row mb-3 mt-3">
            <div className="col-md-6">
              {/* Replace DateTimePicker with standard TextField type="datetime-local" */}
              <TextField
                fullWidth
                id="applicationStartDate"
                name="applicationStartDate"
                label="Application Start Date"
                type="datetime-local"
                value={formData.applicationStartDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.applicationStartDate)}
                helperText={errors.applicationStartDate}
                variant="outlined"
                margin="normal"
              />
            </div>
            <div className="col-md-6">
              {/* Replace DateTimePicker with standard TextField type="datetime-local" */}
              <TextField
                fullWidth
                id="applicationEndDate"
                name="applicationEndDate"
                label="Application End Date"
                type="datetime-local"
                value={formData.applicationEndDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.applicationEndDate)}
                helperText={errors.applicationEndDate}
                variant="outlined"
                margin="normal"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <FormControl 
                fullWidth 
                variant="outlined" 
                margin="normal"
                error={Boolean(errors.scholarshipType)}
              >
                <InputLabel id="scholarship-type-label">Scholarship Type</InputLabel>
                <Select
                  labelId="scholarship-type-label"
                  id="scholarshipType"
                  name="scholarshipType"
                  value={formData.scholarshipType}
                  onChange={handleChange}
                  label="Scholarship Type"
                >
                  {scholarshipTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.scholarshipType && (
                  <FormHelperText error>{errors.scholarshipType}</FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="col-md-6">
              <FormControl 
                fullWidth 
                variant="outlined" 
                margin="normal"
                error={Boolean(errors.contactStaffId)}
              >
                <InputLabel id="contact-staff-label">Contact Staff</InputLabel>
                <Select
                  labelId="contact-staff-label"
                  id="contactStaffId"
                  name="contactStaffId"
                  value={formData.contactStaffId}
                  onChange={handleChange}
                  label="Contact Staff"
                >
                  {staffList && staffList.map((staff) => (
                    <MenuItem key={staff.id} value={staff.id}>
                      {staff.staffName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.contactStaffId && (
                  <FormHelperText error>{errors.contactStaffId}</FormHelperText>
                )}
              </FormControl>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.canNotify}
                    onChange={handleChange}
                    name="canNotify"
                    color="primary"
                  />
                }
                label="Enable Notifications"
              />
            </div>
            <div className="col-md-6">
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isSelfEnrollable}
                    onChange={handleChange}
                    name="isSelfEnrollable"
                    color="primary"
                  />
                }
                label="Self Enrollment"
              />
            </div>
          </div>

          {formData.isSelfEnrollable && (
            <TextField
              fullWidth
              id="selfEnrollUrl"
              name="selfEnrollUrl"
              label="Self Enrollment URL"
              value={formData.selfEnrollUrl}
              onChange={handleChange}
              error={Boolean(errors.selfEnrollUrl)}
              helperText={errors.selfEnrollUrl}
              variant="outlined"
              margin="normal"
            />
          )}

          <Box className="d-flex justify-content-end mt-4">
            <Button 
              variant="secondary" 
              onClick={handleClose} 
              className="me-2"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
            </Button>
          </Box>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ScholarshipModal;