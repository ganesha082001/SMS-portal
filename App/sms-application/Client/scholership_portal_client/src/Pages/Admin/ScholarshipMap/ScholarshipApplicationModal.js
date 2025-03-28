import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Chip,
  TextField,
  Autocomplete,
  Collapse,
  Stack,
  FormControlLabel,
  Checkbox,
  Container
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  AssignmentTurnedIn as ApproveIcon,
  Cancel as RejectIcon
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';
import ProfileValidate from '../ProfileValidate/ProfileValidate'; // Import ProfileValidate component
import StudentHeader from '../../../Components/StudentHeader';
import Footer from '../../Student/Components/Footer';
import StaffHeader from '../../../Components/StaffHeader';

const ScholarshipDashboard = () => {
  // State Management
  const [applications, setApplications] = useState([
    {
      id: "0a2579e5-467d-4407-997a-08dd6b986d0c",
      studentName: 'Maha lakshmi',
      rollNo: 'CS22001',
      department: 'Computer Science',
      scholarship: 'Merit Scholarship',
      appliedDate: 'UG-Aided',
      status: 'Pending',
      type: 'self',
      backgroundReason: 'Academic excellence with 9.5 CGPA',
      merit: 85,
      income: 'Low',
      singleParent: false,
      schoolType: 'Government'
    },
    {
      id: "41779701-f10e-493b-b3a6-08dd6bf512ea",
      studentName: 'Shreya',
      rollNo: 'EE22045',
      department: 'Electrical Engineering',
      scholarship: 'Research Innovation Grant',
      appliedDate: 'UG-Aided',
      status: 'Under Review',
      type: 'staff',
      backgroundReason: 'Outstanding research publications',
      merit: 92,
      income: 'Medium',
      singleParent: true,
      schoolType: 'Private'
    }
  ]);

  // Student and Scholarship Lists
  const [students, setStudents] = useState([
    { id: 1, name: 'Mahalakshmi', rollNo: 'CS22001', department: 'Computer Science' },
    { id: 2, name: 'Preethi', rollNo: 'EE22045', department: 'Electrical Engineering' }
  ]);

  const [scholarships, setScholarships] = useState([
    { id: 1, name: 'Merit Scholarship', amount: 5000 },
    { id: 2, name: 'Research Innovation Grant', amount: 7500 }
  ]);

  // New Application Form States
  const [isNewApplicationOpen, setIsNewApplicationOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  // Filter States
  const [filters, setFilters] = useState({
    nameFilter: '',
    scholarshipFilter: '',
    meritMin: '',
    meritMax: '',
    income: null,
    singleParent: null,
    schoolType: null,
    studentFilter: '',
    scholarshipFilter: ''
  });

  // Filter Options
  const filterOptions = {
    income: ['Low', 'Medium', 'High'],
    schoolType: ['Government', 'Private', 'Aided']
  };

  // Filtered Applications
  const filteredApplications = applications.filter(app => {
    const meritMinCheck = filters.meritMin === '' || app.merit >= parseFloat(filters.meritMin);
    const meritMaxCheck = filters.meritMax === '' || app.merit <= parseFloat(filters.meritMax);

    return (
      (filters.nameFilter === '' || app.studentName.toLowerCase().includes(filters.nameFilter.toLowerCase())) &&
      (filters.scholarshipFilter === '' || app.scholarship.toLowerCase().includes(filters.scholarshipFilter.toLowerCase())) &&
      meritMinCheck &&
      meritMaxCheck &&
      (filters.income === null || app.income === filters.income) &&
      (filters.singleParent === null || app.singleParent === filters.singleParent) &&
      (filters.schoolType === null || app.schoolType === filters.schoolType)
    );
  });

  // Filtered Students and Scholarships
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(filters.studentFilter.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(filters.studentFilter.toLowerCase())
  );

  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.name.toLowerCase().includes(filters.scholarshipFilter.toLowerCase())
  );

  // Handle New Application Submission
  const handleSubmitApplication = () => {
    if (selectedStudent && selectedScholarship) {
      const newApplication = {
        id: applications.length + 1,
        studentName: selectedStudent.name,
        rollNo: selectedStudent.rollNo,
        department: selectedStudent.department,
        scholarship: selectedScholarship.name,
        appliedDate: 'UG-Aided',
        status: 'Pending',
        type: 'self',
        backgroundReason: 'New application submitted',
        merit: 0, // You might want to add a way to input merit
        income: null,
        singleParent: null,
        schoolType: null
      };

      setApplications([...applications, newApplication]);

      // Reset form
      setSelectedStudent(null);
      setSelectedScholarship(null);
      setFilters(prev => ({ ...prev, studentFilter: '', scholarshipFilter: '' }));
      setIsNewApplicationOpen(false);
    }
  };

  // Action Handlers
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // State for modal visibility
  const [selectedStudentId, setSelectedStudentId] = useState(null); // State for selected student ID

  const handleViewDetails = (application) => {
    setSelectedStudentId(application); // Set the student ID (assuming rollNo is unique)
    setIsProfileModalOpen(true); // Open the modal
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false); // Close the modal
    setSelectedStudentId(null); // Clear the selected student ID
  };

  const handleApprove = (id) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status: 'Approved' } : app
      )
    );
  };

  const handleReject = (id) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status: 'Rejected' } : app
      )
    );
  };

  // Render Filter Chips
  const renderFilterChips = () => {
    const activeFilters = Object.entries(filters)
      .filter(([key, value]) => value !== null && value !== '')
      .map(([key, value]) => ({ key, value }));

    return (
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {activeFilters.map((filter) => (
          <Chip
            key={filter.key}
            label={`${filter.key}: ${filter.value}`}
            onDelete={() => setFilters({ ...filters, [filter.key]: null })}
          />
        ))}
        {activeFilters.length > 0 && (
          <Chip
            label="Clear All"
            color="secondary"
            onClick={() => setFilters({
              nameFilter: '',
              scholarshipFilter: '',
              meritMin: '',
              meritMax: '',
              income: null,
              singleParent: null,
              schoolType: null,
              studentFilter: '',
              scholarshipFilter: ''
            })}
          />
        )}
      </Stack>
    );
  };

  // Columns for Data Grid
  const columns = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleViewDetails(params.row.id)}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Approve">
            <IconButton
              color="success"
              size="small"
              onClick={() => handleApprove(params.row.id)}
            >
              <ApproveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleReject(params.row.id)}
            >
              <RejectIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    {
      field: 'studentName',
      headerName: 'Student Name',
      width: 200
    },
    {
      field: 'rollNo',
      headerName: 'Roll No',
      width: 150
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 200
    },
    {
      field: 'scholarship',
      headerName: 'Scholarship',
      width: 200
    },
    {
      field: 'appliedDate',
      headerName: 'Shift',
      width: 150
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Pending' ? 'warning' :
              params.value === 'Approved' ? 'success' :
                params.value === 'Under Review' ? 'info' : 'error'
          }
          size="small"
        />
      )
    }
  ];

  return (
    <><StaffHeader /><Container>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold">
              Scholarship Applications
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsNewApplicationOpen(!isNewApplicationOpen)}
            >
              {isNewApplicationOpen ? 'Cancel' : 'New Application'}
            </Button>
          </Grid>
        </Grid>

        {/* New Application Form */}
        <Collapse in={isNewApplicationOpen}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Create New Scholarship Application
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={filteredStudents}
                  getOptionLabel={(option) => `${option.name} (${option.rollNo})`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Student"
                      variant="outlined"
                      onChange={(e) => setFilters(prev => ({ ...prev, studentFilter: e.target.value }))} />
                  )}
                  value={selectedStudent}
                  onChange={(event, newValue) => setSelectedStudent(newValue)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={filteredScholarships}
                  getOptionLabel={(option) => `${option.name}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Scholarship"
                      variant="outlined"
                      onChange={(e) => setFilters(prev => ({ ...prev, scholarshipFilter: e.target.value }))} />
                  )}
                  value={selectedScholarship}
                  onChange={(event, newValue) => setSelectedScholarship(newValue)} />
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitApplication}
                  disabled={!selectedStudent || !selectedScholarship}
                >
                  Submit Application
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>

        {/* Filter Section */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Name Filter"
                variant="outlined"
                value={filters.nameFilter}
                onChange={(e) => setFilters({ ...filters, nameFilter: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Scholarship Filter"
                variant="outlined"
                value={filters.scholarshipFilter}
                onChange={(e) => setFilters({ ...filters, scholarshipFilter: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={3}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Merit Min (%)"
                    type="number"
                    variant="outlined"
                    value={filters.meritMin}
                    onChange={(e) => setFilters({ ...filters, meritMin: e.target.value })}
                    InputProps={{ inputProps: { min: 0, max: 100 } }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Merit Max (%)"
                    type="number"
                    variant="outlined"
                    value={filters.meritMax}
                    onChange={(e) => setFilters({ ...filters, meritMax: e.target.value })}
                    InputProps={{ inputProps: { min: 0, max: 100 } }} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={3}>
              <Autocomplete
                options={filterOptions.income}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Income"
                    variant="outlined" />
                )}
                value={filters.income}
                onChange={(event, newValue) => setFilters({ ...filters, income: newValue })} />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={<Checkbox
                  checked={filters.singleParent === true}
                  indeterminate={filters.singleParent === null}
                  onChange={() => {
                    // Cycle through null (no filter) -> true -> false
                    setFilters({
                      ...filters,
                      singleParent: filters.singleParent === null ? true :
                        filters.singleParent === true ? false : null
                    });
                  } } />}
                label="Single Parent" />
            </Grid>
            <Grid item xs={12} md={3}>
              <Autocomplete
                options={filterOptions.schoolType}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="School Type"
                    variant="outlined" />
                )}
                value={filters.schoolType}
                onChange={(event, newValue) => setFilters({ ...filters, schoolType: newValue })} />
            </Grid>
          </Grid>

          {/* Active Filters Chips */}
          {renderFilterChips()}
        </Paper>

        <Paper elevation={3}>
          <DataGrid
            rows={filteredApplications}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
            components={{
              Toolbar: GridToolbar,
            }}
            sx={{
              height: 500,
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }} />
        </Paper>
      </Box>
      <Modal open={isProfileModalOpen} onClose={handleCloseProfileModal}>
        <ProfileValidate studentId={selectedStudentId} handleClose={handleCloseProfileModal} />
      </Modal>
    </Container><Footer /></>
  );
};

export default ScholarshipDashboard;