import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PersonalInfo from './FormSections/PersonalInfo'
import EducationalInfo from './FormSections/EducationalInfo'
import ScholarshipInfo from './FormSections/ScholarshipInfo'
import StudentService from '../../../Services/studentService';
import SessionStorageUtil from '../../../Session/SessionStorageUtils';
import StudentHeader from '../../../Components/StudentHeader'; // Adjust the path as necessary
import {
  Card,
  Button,
  Container,
  Row,
  Col
} from 'react-bootstrap';
import {
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const StudentProfileLayout = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [studentData, setStudentData] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState({
    personalInfoId: null,
    educationalInfoId: null,
    scholarshipInfoId: null
  });
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isSubmittingForReview, setIsSubmittingForReview] = useState(false);
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentId = SessionStorageUtil.getParticularData('userID'); // Get the student ID from session storage
        if (studentId) {
          const data = await StudentService.getStudentProfile(studentId);
          setStudentData(data);
        } else {
          console.error('No student ID found in session storage');
        }

        // Check if all sections are complete
        const responseData = await StudentService.canShowAcknowledge(studentId);

        if (
          responseData.personalInfoId &&
          responseData.educationalInfoId &&
          responseData.scholarshipInfoId
        ) {
            setProfileCompletion(responseData)
          setIsProfileComplete(true);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, []);

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return < PersonalInfo />;
      case 'educational':
        return <EducationalInfo />;
      case 'scholarship':
        return <ScholarshipInfo />;
      default:
        return <PersonalInfo />;
    }
  };

  const submitProfileForReview = async () => {
    if (!isAcknowledged) {
      alert('Please acknowledge the information before submission.');
      return;
    }

    setIsSubmittingForReview(true);

    try {
      const studentId = SessionStorageUtil.getParticularData('userID');
      const profileData = {
        personalInfoId: profileCompletion.personalInfoId,
        educationalInfoId: profileCompletion.educationalInfoId,
        scholarshipInfoId: profileCompletion.scholarshipInfoId,
        studentId: studentId,
        profileStatus: "Under Review",
        reviewerId: '',
        reviewerComments: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false
      };

      // Call API to submit profile for review

      await StudentService.submitProfileForReview(profileData);

      alert('Profile submitted for review successfully!');
    } catch (error) {
      console.error('Error submitting profile for review:', error);
      alert('Failed to submit profile for review');
    } finally {
      setIsSubmittingForReview(false);
    }
  };

  return (
    <div >
      {/* < StudentHeader /> */}
      <div className="container mt-4">
        {studentData ? (
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              Student Information
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Name:</strong> {studentData.studentName}</p>
                  <p><strong>Email:</strong> {studentData.studentEmail}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Phone:</strong> {studentData.studentPhone}</p>
                  <p><strong>Roll Number:</strong> {studentData.studentRollnumber}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading student information...</p>
        )}

        {/* Tabbed Layout */}
        <div className="card">
          <div className="card-header p-0">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('personal')}
                >
                  Personal
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'educational' ? 'active' : ''}`}
                  onClick={() => setActiveTab('educational')}
                >
                  Educational
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'scholarship' ? 'active' : ''}`}
                  onClick={() => setActiveTab('scholarship')}
                >
                  Scholarship
                </button>
              </li>
            </ul>
          </div>
          <div className="card-body">
            {renderTabContent()}
          </div>
        </div>
        {/* Profile Completion Acknowledgement Block */}
        {isProfileComplete && (
          <Container className="mt-4">
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: '#f4f6f9'
              }}
            >
              <Card className="border-0">
                <Card.Header
                  className="d-flex align-items-center justify-content-between"
                  style={{
                    backgroundColor: '#2196f3',
                    color: 'white',
                    padding: '15px 20px'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <VerifiedUserIcon />
                    <Typography variant="h6" component="span">
                      Profile Completion Verification
                    </Typography>
                  </Box>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        backgroundColor: 'white',
                        padding: 3,
                        borderRadius: 2
                      }}>
                        <Alert
                          icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                          severity="info"
                          sx={{
                            marginBottom: 2,
                            backgroundColor: '#e6f2ff',
                            color: '#1565c0'
                          }}
                        >
                          Once you have completed all profile sections. Please submit for review and verification.
                        </Alert>

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isAcknowledged}
                              onChange={(e) => setIsAcknowledged(e.target.checked)}
                              color="primary"
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  fontSize: 28
                                }
                              }}
                            />
                          }
                          label={
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              I confirm that all the information provided is accurate and complete to the best of my knowledge.
                            </Typography>
                          }
                        />

                        <Button
                          variant="contained"
                          color="success"
                          onClick={submitProfileForReview}
                          disabled={!isAcknowledged || isSubmittingForReview}
                          sx={{
                            marginTop: 2,
                            padding: '12px 24px',
                            fontSize: '1rem',
                            textTransform: 'none',
                            backgroundColor: '#2196f3', // Maintaining the existing blue color
                            color: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#1976d2', // Slightly darker blue on hover
                              boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
                              transform: 'translateY(-2px)'
                            },
                            '&:disabled': {
                              backgroundColor: '#e0e0e0',
                              color: '#9e9e9e',
                              boxShadow: 'none',
                              transform: 'none'
                            },
                            '& .MuiButton-startIcon': {
                              marginRight: 1
                            }
                          }}
                          startIcon={<VerifiedUserIcon />}
                        >
                          {isSubmittingForReview ? (
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <CircularProgress
                                size={20}
                                sx={{
                                  color: 'white',
                                  marginRight: 1
                                }}
                              />
                              Submitting...
                            </Box>
                          ) : (
                            'Submit Profile for Review'
                          )}
                        </Button>
                      </Box>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Paper>
          </Container>
        )}
      </div>
    </div>
  );
};

export default StudentProfileLayout;