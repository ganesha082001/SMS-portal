import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Card, 
  Nav, 
  Modal
} from 'react-bootstrap';
import {
  TextField,
  MenuItem,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  InputLabel
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import 'bootstrap/dist/css/bootstrap.min.css';
import StudentHeader from '../../Components/StudentHeader'; // Adjust the path as necessary

const ProfileUpdateForm = () => {
  // State for form sections
  const [activeTab, setActiveTab] = useState('personal');
  
  // State for form data
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    dateOfBirth: '',
    mobileNumber: '',
    community: '',
    rollNumber: '',
    startYear: '',
    batch: '',
    address: '',
    
    // Educational Information
    academicYear: '',
    umisNumber: '',
    hasCommunityReference: '',
    hasIncomeCertificate: '',
    shift: '',
    section: '',
    hostelOrDayScholar: '',
    yearOfStudy: '',
    aadharNumber: '',
    mobileLinkedWithAadhar: '',
    isFirstGraduate: '',
    schoolType: '',
    hasBankAccount: '',
    
    // Scholarship Information
    isParentSeparated: '',
    isParentSick: '',
    hasParentPassedAway: '',
    siblings: '',
    hasDisability: '',
    
    // Document uploads
    profileImage: null,
    communityDocument: null,
    incomeDocument: null,
    aadharDocument: null,
    bankDocument: null
  });
  
  // State for preview modals
  const [previewModal, setPreviewModal] = useState({
    show: false,
    type: '',
    file: null,
    name: ''
  });
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    }
  };
  
  // Handle file delete
  const handleFileDelete = (name) => {
    setFormData({
      ...formData,
      [name]: null
    });
  };
  
  // Preview file
  const handlePreview = (file, type, name) => {
    if (file) {
      setPreviewModal({
        show: true,
        type,
        file,
        name
      });
    }
  };
  
  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  };
  
  // Tab navigation
  const changeTab = (tab) => {
    setActiveTab(tab);
  };
  
  // Render file preview
  const renderFilePreview = () => {
    const { file, type } = previewModal;
    
    if (!file) return null;
    
    if (type === 'image') {
      return (
        <img 
          src={URL.createObjectURL(file)} 
          alt="Preview" 
          className="img-fluid" 
          style={{ maxHeight: '400px' }}
        />
      );
    } else if (type === 'pdf') {
      return (
        <iframe
          src={URL.createObjectURL(file)}
          title="PDF Preview"
          width="100%"
          height="500px"
        />
      );
    }
    
    return <p>File cannot be previewed</p>;
  };
  
  // Render file upload field
  const renderFileUpload = (name, label, type = 'pdf', required = false) => {
    const file = formData[name];
    
    return (
        <div>

      <Form.Group className="mb-3">
        <Form.Label>{label}{required && <span className="text-danger">*</span>}</Form.Label>
        <div className="input-group">
          <Button
            as="label"
            htmlFor={`upload-${name}`}
            variant="outline-secondary"
            className="d-flex align-items-center"
          >
            <CloudUploadIcon className="me-2" />
            Upload {type === 'image' ? 'Image' : 'PDF'}
          </Button>
          <Form.Control
            type="text"
            value={file ? file.name : ''}
            readOnly
            placeholder="No file chosen"
          />
          <input
            type="file"
            id={`upload-${name}`}
            name={name}
            accept={type === 'image' ? 'image/*' : 'application/pdf'}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          {file && (
            <>
              <Button 
                variant="outline-primary"
                onClick={() => handlePreview(file, type, label)}
              >
                <VisibilityIcon />
              </Button>
              <Button 
                variant="outline-danger"
                onClick={() => handleFileDelete(name)}
              >
                <DeleteIcon />
              </Button>
            </>
          )}
        </div>
      </Form.Group>
      </div>
    );
  };
  
  return (
    <div>
                        <StudentHeader/>

    <Container className="py-4">
      <Card>
        <Card.Header className="bg-light">
          <h2 className="text-center mb-0">Profile Update Form</h2>
        </Card.Header>
        
        <Nav 
          variant="tabs" 
          activeKey={activeTab}
          onSelect={(k) => changeTab(k)}
          className="bg-light"
        >
          <Nav.Item>
            <Nav.Link 
              eventKey="personal"
              className={activeTab === 'personal' ? 'bg-danger text-white' : ''}
            >
              Personal Information
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              eventKey="educational"
              className={activeTab === 'educational' ? 'bg-danger text-white' : ''}
            >
              Educational Information
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              eventKey="scholarship"
              className={activeTab === 'scholarship' ? 'bg-danger text-white' : ''}
            >
              Scholarship Information
            </Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            {activeTab === 'personal' && (
              <div>
                <Card className="mb-4">
                  <Card.Header className="bg-danger text-white">
                    <h4 className="mb-0">Personal Information</h4>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <TextField
                          label="Full Name"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                          required
                        />
                        
                        <TextField
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                          required
                        />
                        
                        <TextField
                          label="Date of Birth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          required
                        />
                        
                        <TextField
                          label="Mobile Number"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                          required
                        />
                        
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Community</InputLabel>
                          <Select
                            name="community"
                            value={formData.community}
                            onChange={handleInputChange}
                            label="Community"
                            required
                          >
                            <MenuItem value="">Select One</MenuItem>
                            <MenuItem value="BC">BC</MenuItem>
                            <MenuItem value="MBC">MBC</MenuItem>
                            <MenuItem value="SC">SC</MenuItem>
                            <MenuItem value="ST">ST</MenuItem>
                            <MenuItem value="General">General</MenuItem>
                          </Select>
                        </FormControl>
                      </Col>
                      
                      <Col md={6}>
                        <TextField
                          label="Roll Number"
                          name="rollNumber"
                          value={formData.rollNumber}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                        />
                        
                        <TextField
                          label="Start Year"
                          name="startYear"
                          value={formData.startYear}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                        />
                        
                        <TextField
                          label="Batch"
                          name="batch"
                          value={formData.batch}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                        />
                        
                        <TextField
                          label="Address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          fullWidth
                          multiline
                          rows={4}
                          margin="normal"
                        />
                        
                        {renderFileUpload('profileImage', 'Profile Photo', 'image')}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                <div className="d-flex justify-content-between">
                  <Button variant="secondary" disabled>
                    Previous
                  </Button>
                  <Button variant="danger" onClick={() => changeTab('educational')}>
                    Continue
                  </Button>
                </div>
              </div>
            )}
            
            {/* Educational Information Section */}
            {activeTab === 'educational' && (
              <div>
                <Card className="mb-4">
                  <Card.Header className="bg-danger text-white">
                    <h4 className="mb-0">Educational Information</h4>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Academic Year</InputLabel>
                          <Select
                            name="academicYear"
                            value={formData.academicYear}
                            onChange={handleInputChange}
                            label="Academic Year"
                          >
                            <MenuItem value="">Select Year</MenuItem>
                            <MenuItem value="2023-2024">2023-2024</MenuItem>
                            <MenuItem value="2024-2025">2024-2025</MenuItem>
                            <MenuItem value="2025-2026">2025-2026</MenuItem>
                          </Select>
                        </FormControl>
                        
                        <TextField
                          label="UMIS Number"
                          name="umisNumber"
                          value={formData.umisNumber}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                        />
                        
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Do You Have a Community Certificate</InputLabel>
                          <Select
                            name="hasCommunityReference"
                            value={formData.hasCommunityReference}
                            onChange={handleInputChange}
                            label="Do You Have a Community Certificate"
                          >
                            <MenuItem value="">Select One</MenuItem>
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </Select>
                        </FormControl>
                        
                        {formData.hasCommunityReference === 'yes' && 
                          renderFileUpload('communityDocument', 'Community Certificate')
                        }
                        
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Do You Have an Income Certificate</InputLabel>
                          <Select
                            name="hasIncomeCertificate"
                            value={formData.hasIncomeCertificate}
                            onChange={handleInputChange}
                            label="Do You Have an Income Certificate"
                          >
                            <MenuItem value="">Select One</MenuItem>
                            <MenuItem value="yes">Yes</MenuItem>
                            <MenuItem value="no">No</MenuItem>
                          </Select>
                        </FormControl>
                        
                        {formData.hasIncomeCertificate === 'yes' && 
                          renderFileUpload('incomeDocument', 'Income Certificate')
                        }
                      </Col>
                      
                      <Col md={6}>
                        <TextField
                          label="Shift"
                          name="shift"
                          value={formData.shift}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                        />
                        
                        <TextField
                          label="Section"
                          name="section"
                          value={formData.section}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                        />
                        
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Hostel or Day Scholar</InputLabel>
                          <Select
                            name="hostelOrDayScholar"
                            value={formData.hostelOrDayScholar}
                            onChange={handleInputChange}
                            label="Hostel or Day Scholar"
                          >
                            <MenuItem value="">Select One</MenuItem>
                            <MenuItem value="hostel">Hostel</MenuItem>
                            <MenuItem value="day">Day Scholar</MenuItem>
                          </Select>
                        </FormControl>
                        
                        <TextField
                          label="Year of Study"
                          name="yearOfStudy"
                          value={formData.yearOfStudy}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                        />
                        
                        <TextField
                          label="Aadhar Card Number"
                          name="aadharNumber"
                          value={formData.aadharNumber}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                        />
                        
                        {renderFileUpload('aadharDocument', 'Aadhar Card Document')}
                      </Col>
                    </Row>
                    
                    <Row className="mt-3">
                      <Col md={6}>
                        <TextField
                          label="Mobile Number Linked With Aadhar"
                          name="mobileLinkedWithAadhar"
                          value={formData.mobileLinkedWithAadhar}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                        />
                      </Col>
                      
                      <Col md={6}>
                        <FormControl component="fieldset" className="mt-3">
                          <Form.Label>Is First Graduate</Form.Label>
                          <RadioGroup
                            row
                            name="isFirstGraduate"
                            value={formData.isFirstGraduate}
                            onChange={handleInputChange}
                          >
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>School Type</InputLabel>
                          <Select
                            name="schoolType"
                            value={formData.schoolType}
                            onChange={handleInputChange}
                            label="School Type"
                          >
                            <MenuItem value="">Select One</MenuItem>
                            <MenuItem value="government">Government</MenuItem>
                            <MenuItem value="private">Private</MenuItem>
                          </Select>
                        </FormControl>
                      </Col>
                      
                      <Col md={6}>
                        <FormControl component="fieldset" className="mt-3">
                          <Form.Label>Do you have a bank account?</Form.Label>
                          <RadioGroup
                            row
                            name="hasBankAccount"
                            value={formData.hasBankAccount}
                            onChange={handleInputChange}
                          >
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                        
                        {formData.hasBankAccount === 'yes' && 
                          renderFileUpload('bankDocument', 'Bank Account Document')
                        }
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => changeTab('personal')}>
                    Previous
                  </Button>
                  <Button variant="danger" onClick={() => changeTab('scholarship')}>
                    Continue
                  </Button>
                </div>
              </div>
            )}
            
            {/* Scholarship Information Section */}
            {activeTab === 'scholarship' && (
              <div>
                <Card className="mb-4">
                  <Card.Header className="bg-danger text-white">
                    <h4 className="mb-0">Scholarship Information</h4>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <FormControl component="fieldset" className="mt-3">
                          <Form.Label>Is Your Parent Separated?</Form.Label>
                          <RadioGroup
                            row
                            name="isParentSeparated"
                            value={formData.isParentSeparated}
                            onChange={handleInputChange}
                          >
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                        
                        <FormControl component="fieldset" className="mt-3">
                          <Form.Label>Is Your Parent Sick?</Form.Label>
                          <RadioGroup
                            row
                            name="isParentSick"
                            value={formData.isParentSick}
                            onChange={handleInputChange}
                          >
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                        
                        <FormControl component="fieldset" className="mt-3">
                          <Form.Label>Has Your Parent Passed Away?</Form.Label>
                          <RadioGroup
                            row
                            name="hasParentPassedAway"
                            value={formData.hasParentPassedAway}
                            onChange={handleInputChange}
                          >
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                      </Col>
                      
                      <Col md={6}>
                        <TextField
                          label="Siblings (Work/Study)"
                          name="siblings"
                          value={formData.siblings}
                          onChange={handleInputChange}
                          fullWidth
                          multiline
                          rows={4}
                          margin="normal"
                          placeholder="Enter information about your siblings"
                        />
                        
                        <FormControl component="fieldset" className="mt-3">
                          <Form.Label>Do You Have a Disability?</Form.Label>
                          <RadioGroup
                            row
                            name="hasDisability"
                            value={formData.hasDisability}
                            onChange={handleInputChange}
                          >
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                          </RadioGroup>
                        </FormControl>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => changeTab('educational')}>
                    Previous
                  </Button>
                  <Button variant="success" type="submit">
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>
      
      {/* Preview Modal */}
      <Modal
        show={previewModal.show}
        onHide={() => setPreviewModal({ ...previewModal, show: false })}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{previewModal.name} Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderFilePreview()}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setPreviewModal({ ...previewModal, show: false })}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </div>
  );
};

export default ProfileUpdateForm;