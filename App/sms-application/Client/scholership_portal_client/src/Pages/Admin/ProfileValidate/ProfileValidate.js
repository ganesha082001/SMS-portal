import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Grid, 
    Paper, 
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Avatar,
    Divider,
    Chip,
        TextField,
        Button,
        Select,
        MenuItem,
        FormControl,
        InputLabel
} from '@mui/material';
import { 
    ExpandMore as ExpandMoreIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    ContactMail as ContactMailIcon,
    AssuredWorkload as BankIcon,
    Badge as BadgeIcon,
    Warning as WarningIcon,
    Send as SendIcon
} from '@mui/icons-material';
import staffService from '../../../Services/staffService'; // Adjust the path as needed
import { blue, green, orange, red } from '@mui/material/colors';
import SessionStorageUtil from '../../../Session/SessionStorageUtils';

const InfoRow = ({ label, value, icon, color = blue[500] }) => (
    <Grid 
        container 
        alignItems="center" 
        sx={{ 
            mb: 1.5, 
            p: 1, 
            borderRadius: 2,
            transition: 'background-color 0.3s',
            '&:hover': {
                backgroundColor: color + '10'
            }
        }}
    >
        {icon && (
            <Grid 
                item 
                xs={2} 
                sm={1} 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    color: color
                }}
            >
                {icon}
            </Grid>
        )}
        <Grid item xs={icon ? 10 : 12} sm={icon ? 11 : 12}>
            <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontWeight: 500 }}
            >
                {label}
            </Typography>
            <Typography 
                variant="body1" 
                color={value ? 'text.primary' : 'text.disabled'}
                sx={{ 
                    fontWeight: 600,
                    fontStyle: value ? 'normal' : 'italic'
                }}
            >
                {value || 'No information available'}
            </Typography>
        </Grid>
    </Grid>
);

const StudentInfoReview = ({ studentId }) => {
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewMessage, setReviewMessage] = useState('');
    const [reviewStatus, setReviewStatus] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const reviewerId =  SessionStorageUtil.getParticularData('userID')
    useEffect(() => {
        const fetchStudentData = async () => {
            if (!studentId) return;

            setLoading(true);
            try {
                const data = await staffService.getFullProfile(studentId);
                setStudentData(data);
            } catch (err) {
                setError(err.message || 'Failed to retrieve student information');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [studentId]);

    const handleSubmitReview = async () => {
        if (!reviewMessage || !reviewStatus) {
            alert('Please provide both a review message and status');
            return;
        }

        setSubmitting(true);
        try {
            await staffService.reviewStudentProfile(studentId,{
                message: reviewMessage,
                reviewerId: reviewerId,
                status: reviewStatus
            });
            alert('Review submitted successfully');
            setReviewMessage('');
            setReviewStatus('');
            
        } catch (err) {
            alert(`Failed to submit review: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };
    if (loading) return (
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}
        >
            <Typography variant="h4" color="primary">
                Loading Student Information...
            </Typography>
        </Box>
    );

    if (error) return (
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                bgcolor: red[50]
            }}
        >
            <Typography variant="h5" color="error">
                {error}
            </Typography>
        </Box>
    );

    if (!studentData) return null;

    const { 
        studentInfo, 
        personalInfo, 
        educationalInfo, 
        scholarshipInfo 
    } = studentData;

    return (
        <Box 
            className="hidden-scrollbar"
            sx={{ 
                width: '100%', 
                maxWidth: 800, 
                mx: 'auto', 
                p: { xs: 1, sm: 2, md: 3 } ,
                maxHeight: '100vh',
                overflowY: 'auto' 
            }}
        >
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 3, 
                    borderRadius: 2 
                }}
            >
                {/* Header */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 3 
                    }}
                >
                    <Avatar 
                        sx={{ 
                            width: 70, 
                            height: 70, 
                            mr: 3,
                            bgcolor: blue[500] 
                        }}
                    >
                        {studentInfo.studentName?.charAt(0).toUpperCase() || '?'}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight={600}>
                            {studentInfo.studentName || 'Student Name Not Available'}
                        </Typography>
                        <Chip 
                            label={`Student ID: ${studentInfo.studentRollnumber || 'N/A'}`} 
                            color="primary" 
                            variant="outlined" 
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />
                <Box >
                {/* Student Information Accordion */}
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="student-info-content"
                        id="student-info-header"
                    >
                        <PersonIcon sx={{ mr: 2, color: blue[500] }} />
                        <Typography variant="h6">Student Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box>
                            <InfoRow 
                                label="Full Name" 
                                value={studentInfo.studentName}
                                icon={<PersonIcon />}
                            />
                            {/* <InfoRow 
                                label="Student ID" 
                                value={studentInfo.studentId}
                                icon={<BadgeIcon />}
                            /> */}
                            <InfoRow 
                                label="Email" 
                                value={studentInfo.studentEmail}
                                icon={<ContactMailIcon />}
                            />
                            <InfoRow 
                                label="Phone Number" 
                                value={studentInfo.studentPhone}
                                icon={<ContactMailIcon />}
                            />
                            <InfoRow 
                                label="Roll Number" 
                                value={studentInfo.studentRollnumber}
                                icon={<BadgeIcon />}
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>

                {/* Personal Information Accordion */}
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="personal-info-content"
                        id="personal-info-header"
                    >
                        <ContactMailIcon sx={{ mr: 2, color: green[500] }} />
                        <Typography variant="h6">Personal Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box>
                            <InfoRow 
                                label="Community" 
                                value={personalInfo.community}
                                icon={<BadgeIcon />}
                                color={green[500]}
                            />
                            <InfoRow 
                                label="Aadhar Number" 
                                value={personalInfo.aadharNumber}
                                icon={<BadgeIcon />}
                                color={green[500]}
                            />
                             <InfoRow 
                                label="Aadhar Linked Mobile Number" 
                                value={personalInfo.aadharMobileNumber}
                                icon={<BadgeIcon />}
                                color={green[500]}
                            />
                            <InfoRow 
                                label="Date of Birth" 
                                value={personalInfo.dob ? new Date(personalInfo.dob).toLocaleDateString() : null}
                                icon={<PersonIcon />}
                                color={green[500]}
                            />
                             <InfoRow 
                                label="Community Certificate" 
                                value={personalInfo.hasCommunityCertificate ? 'Available' : 'Not Available'}
                                icon={<WarningIcon />}
                                color={personalInfo.hasCommunityCertificate ? green[500] : orange[500]}
                            />
                            <InfoRow 
                                label="Income Certificate" 
                                value={personalInfo.hasIncomeCertificate ? 'Available' : 'Not Available'}
                                icon={<WarningIcon />}
                                color={personalInfo.hasIncomeCertificate ? green[500] : orange[500]}
                            />
                            <InfoRow 
                                label="Income Certificate issued date" 
                                value={personalInfo.incomeCertificateIssuedDate ? new Date(personalInfo.dob).toLocaleDateString() : null}
                                icon={<PersonIcon />}
                                color={green[500]}
                            />
                            <InfoRow 
                                label="Part Time proof" 
                                value={personalInfo.isDonePartTime ? 'Available' : 'Not Available'}
                                icon={<WarningIcon />}
                                color={personalInfo.isDonePartTime ? green[500] : orange[500]}
                            />
                             <InfoRow 
                                label="Bank Name" 
                                value={personalInfo.bankName}
                                icon={<BadgeIcon />}
                                color={green[500]}
                            />
                             <InfoRow 
                                label="Account Holder Name" 
                                value={personalInfo.accountHolderName}
                                icon={<BadgeIcon />}
                                color={green[500]}
                            />
                            <InfoRow 
                                label="Account Number" 
                                value={personalInfo.accountNumber}
                                icon={<BadgeIcon />}
                                color={green[500]}
                            />
                            <InfoRow 
                                label="IFSC Code" 
                                value={personalInfo.ifscCode}
                                icon={<BadgeIcon />}
                                color={green[500]}
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>

                {/* Educational Information Accordion */}
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="educational-info-content"
                        id="educational-info-header"
                    >
                        <SchoolIcon sx={{ mr: 2, color: orange[500] }} />
                        <Typography variant="h6">Educational Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box>
                            <InfoRow 
                                label="Department" 
                                value={educationalInfo.department}
                                icon={<SchoolIcon />}
                                color={orange[500]}
                            />
                            <InfoRow 
                                label="Course Type" 
                                value={educationalInfo.courseType}
                                icon={<SchoolIcon />}
                                color={orange[500]}
                            />
                            <InfoRow 
                                label="Start Year" 
                                value={educationalInfo.startYear}
                                icon={<BadgeIcon />}
                                color={orange[500]}
                            />
                            <InfoRow 
                                label="Batch" 
                                value={educationalInfo.batch}
                                icon={<BadgeIcon />}
                                color={orange[500]}
                            />
                            <InfoRow 
                                label="Shift" 
                                value={educationalInfo.shift}
                                icon={<BadgeIcon />}
                                color={orange[500]}
                            />
                            <InfoRow 
                                label="Current Year" 
                                value={educationalInfo.currentYear}
                                icon={<SchoolIcon />}
                                color={orange[500]}
                            />
                            <InfoRow 
                                label="Section" 
                                value={educationalInfo.section}
                                icon={<BadgeIcon />}
                                color={orange[500]}
                            />
                            <InfoRow 
                                label="Previous Year Marks" 
                                value={educationalInfo.previousYearMarks ? `${educationalInfo.previousYearMarks}` : null}
                                icon={<SchoolIcon />}
                                color={orange[500]}
                            />
                            <InfoRow 
                                label="First Graduate" 
                                value={educationalInfo.isFirstGraduate ? 'Yes' : 'No'}
                                icon={<WarningIcon />}
                                color={educationalInfo.isFirstGraduate ? green[500] : orange[500]}
                            />
                            <InfoRow 
                                label="UMIS Number" 
                                value={educationalInfo.umiStudentNumber}
                                icon={<BadgeIcon />}
                                color={orange[500]}
                            />
                            <InfoRow 
                                label="School Type" 
                                value={educationalInfo.schoolType}
                                icon={<BadgeIcon />}
                                color={orange[500]}
                            />
                            <InfoRow 
                                label="Hosteler" 
                                value={educationalInfo.isHosteler == true? 'Yes' : 'No'}
                                icon={<BadgeIcon />}
                                color={orange[500]}
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>

                {/* Scholarship Information Accordion */}
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="scholarship-info-content"
                        id="scholarship-info-header"
                    >
                        <BankIcon sx={{ mr: 2, color: red[500] }} />
                        <Typography variant="h6">Scholarship Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box>
                            <InfoRow 
                                label="Is Parent Divorced" 
                                value={scholarshipInfo.isParentDivorced ? 'Yes' : 'No'}
                                icon={<BadgeIcon />}
                                color={red[500]}
                            />
                            <InfoRow 
                                label="Is Parent Physically Disabled" 
                                value={scholarshipInfo.isParentPhysicallyDisabled ? 'Yes' : 'No'}
                                icon={<BadgeIcon />}
                                color={red[500]}
                            />
                            <InfoRow 
                                        label="Sibling Details" 
                                        value={scholarshipInfo.siblingsDetails}
                                        icon={<BadgeIcon />}
                                        color={red[500]}
                                    />
                            <InfoRow 
                                label="Is Parent Divorced" 
                                value={scholarshipInfo.isParentDivorced ? 'Yes' : 'No'}
                                icon={<BadgeIcon />}
                                color={red[500]}
                            />  
                            <InfoRow 
                                label="Scholarship Received" 
                                value={scholarshipInfo.isReceivedAnyScholarship ? 'Yes' : 'No'}
                                icon={<BadgeIcon />}
                                color={red[500]}
                            />
                            {scholarshipInfo.isReceivedAnyScholarship && (
                                <>
                                    <InfoRow 
                                        label="Scholarship Name" 
                                        value={scholarshipInfo.scholarshipName}
                                        icon={<BadgeIcon />}
                                        color={red[500]}
                                    />
                                    <InfoRow 
                                        label="Amount Received" 
                                        value={scholarshipInfo.scholarshipAmountReceived ? `₹${scholarshipInfo.scholarshipAmountReceived}` : null}
                                        icon={<BankIcon />}
                                        color={red[500]}
                                    />
                                </>
                            )}
                            <InfoRow 
                                label="Single Parent Child" 
                                value={scholarshipInfo.isSingleParentChild ? 'Yes' : 'No'}
                                icon={<WarningIcon />}
                                color={scholarshipInfo.isSingleParentChild ? green[500] : orange[500]}
                            />
                             <InfoRow 
                                        label="Raised by" 
                                        value={scholarshipInfo.raisedBy}
                                        icon={<BadgeIcon />}
                                        color={red[500]}
                                    />
                                     <InfoRow 
                                        label="Parent Name" 
                                        value={scholarshipInfo.parentName}
                                        icon={<BadgeIcon />}
                                        color={red[500]}
                                    />
                                     <InfoRow 
                                        label="Parent Occupation" 
                                        value={scholarshipInfo.parentOccupation}
                                        icon={<BadgeIcon />}
                                        color={red[500]}
                                    />
                                     <InfoRow 
                                        label="Annual Income" 
                                        value={scholarshipInfo.annualIncome}
                                        icon={<BadgeIcon />}
                                        color={red[500]}
                                    />
                        </Box>
                    </AccordionDetails>
                </Accordion>
                </Box>
{/* Review Form */}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Student Profile Review
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Review Status</InputLabel>
                                <Select
                                    value={reviewStatus}
                                    onChange={(e) => setReviewStatus(e.target.value)}
                                    label="Review Status"
                                >
                                    <MenuItem value="Verified">Verified</MenuItem>
                                    <MenuItem value="Suspended">Suspended</MenuItem>
                                    <MenuItem value="Insufficient Information">Insufficient Information</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                label="Review Comments"
                                value={reviewMessage}
                                onChange={(e) => setReviewMessage(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<SendIcon />}
                                onClick={handleSubmitReview}
                                disabled={submitting}
                            >
                                Submit Review
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default StudentInfoReview;