import React, { useState, useEffect } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Badge, 
  Chip, 
  Button, 
  Menu, 
  MenuItem,
  Tabs,
  Tab,
  Paper,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  School as SchoolIcon, 
  Assignment as AssignmentIcon, 
  People as PeopleIcon, 
  Event as EventIcon, 
  Notifications as NotificationsIcon, 
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ThumbUp as ThumbUpIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Message as MessageIcon,
  Add as AddIcon,
  MonetizationOn as MonetizationOnIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from 'chart.js/auto';
import { Container } from 'react-bootstrap';

// Example data
const scholarshipApplications = [
  { id: 1, student: 'Priya Sharma', course: 'BSc Computer Science', type: 'Merit-based', amount: '₹25,000', gpa: '9.3', date: '2025-03-06', status: 'Pending', avatar: '/api/placeholder/40/40' },
  { id: 2, student: 'Ananya Singh', course: 'BA Economics', type: 'Need-based', amount: '₹30,000', gpa: '8.7', date: '2025-03-07', status: 'Approved', avatar: '/api/placeholder/40/40' },
  { id: 3, student: 'Kavita Patel', course: 'BSc Mathematics', type: 'Merit-based', amount: '₹25,000', gpa: '9.1', date: '2025-03-07', status: 'Pending', avatar: '/api/placeholder/40/40' },
  { id: 4, student: 'Meera Reddy', course: 'BCom', type: 'First-generation', amount: '₹35,000', gpa: '8.5', date: '2025-03-08', status: 'Rejected', avatar: '/api/placeholder/40/40' },
  { id: 5, student: 'Neha Joshi', course: 'BTech Computer Science', type: 'STEM Innovation', amount: '₹40,000', gpa: '9.5', date: '2025-03-08', status: 'Approved', avatar: '/api/placeholder/40/40' }
];

const upcomingEvents = [
  { id: 1, title: 'Scholarship Interview Panel', date: '2025-03-15', time: '10:00 AM', location: 'Conference Room A', participants: 12 },
  { id: 2, title: 'Faculty Development Program', date: '2025-03-20', time: '2:00 PM', location: 'Main Auditorium', participants: 35 },
  { id: 3, title: 'Annual Department Meeting', date: '2025-03-25', time: '11:00 AM', location: 'Meeting Room 103', participants: 18 }
];

// Scholarship programs data
const scholarshipPrograms = [
  { id: 1, name: 'Merit Excellence Scholarship', eligibility: 'CGPA > 9.0', amount: '₹25,000', deadline: '2025-04-15', status: 'Active', applicants: 87 },
  { id: 2, name: 'STEM Innovation Grant', eligibility: 'STEM disciplines', amount: '₹40,000', deadline: '2025-04-10', status: 'Active', applicants: 62 },
  { id: 3, name: 'First-Generation Scholar Fund', eligibility: 'First in family', amount: '₹35,000', deadline: '2025-04-20', status: 'Active', applicants: 45 },
  { id: 4, name: 'Financial Need Scholarship', eligibility: 'Income < ₹3L p.a.', amount: '₹30,000', deadline: '2025-04-25', status: 'Active', applicants: 103 }
];

const StaffDashboardComponent = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState(scholarshipApplications);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newScholarshipDialog, setNewScholarshipDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [programs, setPrograms] = useState(scholarshipPrograms);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleFilterClick = () => {
    setFilterOpen(!filterOpen);
  };

  const handleApprove = (id) => {
    setIsLoading(true);
    setTimeout(() => {
      setApplications(applications.map(app => 
        app.id === id ? {...app, status: 'Approved'} : app
      ));
      setSnackbarMessage(`Application #${id} has been approved successfully!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setIsLoading(false);
    }, 800);
  };

  const handleReject = (id) => {
    setIsLoading(true);
    setTimeout(() => {
      setApplications(applications.map(app => 
        app.id === id ? {...app, status: 'Rejected'} : app
      ));
      setSnackbarMessage(`Application #${id} has been rejected.`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setIsLoading(false);
    }, 800);
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setDetailsDialog(true);
  };

  const handleCloseDetails = () => {
    setDetailsDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNewScholarship = () => {
    setNewScholarshipDialog(true);
  };

  const handleCloseNewScholarship = () => {
    setNewScholarshipDialog(false);
  };

  const handleAddNewScholarship = () => {
    // In a real app, this would add a new scholarship to the database
    setNewScholarshipDialog(false);
    setSnackbarMessage("New scholarship program created successfully!");
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleDeleteProgram = (program) => {
    setSelectedProgram(program);
    setDeleteConfirmDialog(true);
  };

  const confirmDeleteProgram = () => {
    setPrograms(programs.filter(prog => prog.id !== selectedProgram.id));
    setDeleteConfirmDialog(false);
    setSnackbarMessage(`${selectedProgram.name} has been deleted.`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmDialog(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved':
        return { bg: '#e8f5e9', color: '#4caf50', chip: '#4caf50' };
      case 'Pending':
        return { bg: '#fff8e1', color: '#ff9800', chip: '#ff9800' };
      case 'Rejected':
        return { bg: '#ffebee', color: '#f44336', chip: '#f44336' };
      case 'Active':
        return { bg: '#e8f5e9', color: '#4caf50', chip: '#4caf50' };
      default:
        return { bg: '#f5f5f5', color: '#757575', chip: '#757575' };
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesType = typeFilter === 'All' || app.type === typeFilter;
    const matchesSearch = app.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const drawerWidth = 240;

  // Chart data
  const scholarshipDistributionData = {
    labels: ['Merit-based', 'Need-based', 'STEM Innovation', 'First-generation', 'Community Leadership'],
    datasets: [
      {
        label: 'Number of Scholarships',
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#a41421',
          '#2196f3',
          '#4caf50',
          '#ff9800',
          '#9c27b0',
        ],
        borderWidth: 0,
      },
    ],
  };

  const monthlyApplicationsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Applications',
        data: [120, 135, 170, 90, 110, 85],
        fill: true,
        backgroundColor: 'rgba(164, 20, 33, 0.1)',
        borderColor: '#a41421',
        tension: 0.4,
        pointBackgroundColor: '#a41421',
      },
      {
        label: 'Approvals',
        data: [80, 100, 130, 65, 90, 70],
        fill: true,
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        borderColor: '#2196f3',
        tension: 0.4,
        pointBackgroundColor: '#2196f3',
      }
    ],
  };

  const fundAllocationData = {
    labels: ['Merit-based', 'Need-based', 'STEM Innovation', 'First-generation', 'Community Leadership'],
    datasets: [
      {
        label: 'Fund Allocation (in Lakhs)',
        data: [14.5, 10.2, 8.3, 6.7, 4.8],
        backgroundColor: [
          '#a41421',
          '#2196f3',
          '#4caf50',
          '#ff9800',
          '#9c27b0',
        ],
        borderWidth: 1,
        borderColor: '#ffffff',
      },
    ],
  };

  const genderDistributionData = {
    labels: ['Female', 'Male', 'Other'],
    datasets: [
      {
        label: 'Gender Distribution',
        data: [58, 40, 2],
        backgroundColor: [
          '#f06292',
          '#5c6bc0',
          '#81c784',
        ],
        borderWidth: 1,
        borderColor: '#ffffff',
      },
    ],
  };

  const performanceData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Application Processing Time (days)',
        data: [12, 8, 6, 5],
        backgroundColor: 'rgba(164, 20, 33, 0.7)',
        borderColor: '#a41421',
        borderWidth: 1,
      },
      {
        label: 'Average Approval Rate (%)',
        data: [65, 70, 78, 85],
        backgroundColor: 'rgba(33, 150, 243, 0.7)',
        borderColor: '#2196f3',
        borderWidth: 1,
      }
    ],
  };

  const renderDashboardTab = () => (
    <>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%', 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: 4, 
                bgcolor: '#a41421' 
              }} 
            />
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" fontSize={14} fontWeight="500">
                    Pending Applications
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" sx={{ mt: 0.5 }}>
                    138
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(164, 20, 33, 0.1)', color: '#a41421' }}>
                  <AssignmentIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%', 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: 4, 
                bgcolor: '#2196f3' 
              }} 
            />
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" fontSize={14} fontWeight="500">
                    Active Scholarships
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" sx={{ mt: 0.5 }}>
                    {programs.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)', color: '#2196f3' }}>
                  <SchoolIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%', 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: 4, 
                bgcolor: '#4caf50' 
              }} 
            />
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" fontSize={14} fontWeight="500">
                    Approved This Week
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" sx={{ mt: 0.5 }}>
                    42
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}>
                  <CheckCircleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%', 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                height: 4, 
                bgcolor: '#ff9800' 
              }} 
            />
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" fontSize={14} fontWeight="500">
                    Total Disbursed
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" sx={{ mt: 0.5 }}>
                    ₹24.5L
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' }}>
                  <MonetizationOnIcon />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="body2" component="span" color="text.secondary">
                  Budget remaining: 
                </Typography>
                <Typography variant="body2" component="span" sx={{ ml: 0.5, fontWeight: '600' }}>
                  ₹14.8 Lakhs
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 3
                }}
              >
                <Typography variant="h6" component="h2" fontWeight="bold">
                  Scholarship Applications Trend
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                    Last 6 Months
                  </Typography>
                  <IconButton size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ height: 300 }}>
                <Line 
                  data={monthlyApplicationsData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        align: 'end',
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          drawBorder: false,
                        }
                      },
                      x: {
                        grid: {
                          display: false,
                        }
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 3
                }}
              >
                <Typography variant="h6" component="h2" fontWeight="bold">
                  Scholarship Distribution
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut 
                  data={scholarshipDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      }
                    },
                    cutout: '65%'
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Latest Applications and Upcoming Events */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 3
                }}
              >
                <Typography variant="h6" component="h2" fontWeight="bold">
                  Latest Applications
                </Typography>
                <Button 
                  size="small"
                  endIcon={<ArrowUpwardIcon />}
                  onClick={() => setTabValue(2)}
                  sx={{ 
                    textTransform: 'none',
                    color: '#a41421'
                  }}
                >
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Student</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.slice(0, 5).map((app) => (
                      <TableRow
                        key={app.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={app.avatar} sx={{ mr: 2, width: 30, height: 30 }} />
                            <Typography variant="body2">{app.student}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{app.course}</TableCell>
                        <TableCell>{app.type}</TableCell>
                        <TableCell>{app.amount}</TableCell>
                        <TableCell>
                          <Chip 
                            label={app.status} 
                            size="small"
                            sx={{ 
                              backgroundColor: getStatusColor(app.status).bg,
                              color: getStatusColor(app.status).color,
                              fontWeight: 'medium',
                              borderRadius: 1
                            }} 
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              sx={{ mr: 1 }}
                              onClick={() => handleViewDetails(app)}
                            >
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {app.status === 'Pending' && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton 
                                  size="small" 
                                  sx={{ color: '#4caf50', mr: 1 }}
                                  onClick={() => handleApprove(app.id)}
                                >
                                  <CheckCircleIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton 
                                  size="small" 
                                  sx={{ color: '#f44336' }}
                                  onClick={() => handleReject(app.id)}
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 3
                }}
              >
                <Typography variant="h6" component="h2" fontWeight="bold">
                  Upcoming Events
                </Typography>
                <Button 
                  size="small"
                  endIcon={<ArrowUpwardIcon />}
                  onClick={() => setTabValue(3)}
                  sx={{ 
                    textTransform: 'none',
                    color: '#2196f3'
                  }}
                >
                  View All
                </Button>
              </Box>
              <List>
                {upcomingEvents.map((event) => (
                  <ListItem key={event.id} disableGutters>
                    <ListItemText 
                      primary={event.title}
                      secondary={`${event.date} | ${event.time}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>

  );

  const renderApplicationsTab = () => (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2" fontWeight="bold">
          Scholarship Applications
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<FilterIcon />} 
          onClick={handleFilterClick}
        >
          Filter
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Student</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={app.avatar} sx={{ mr: 2, width: 30, height: 30 }} />
                    <Typography variant="body2">{app.student}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{app.course}</TableCell>
                <TableCell>{app.type}</TableCell>
                <TableCell>{app.amount}</TableCell>
                <TableCell>
                  <Chip 
                    label={app.status} 
                    size="small"
                    sx={{ 
                      backgroundColor: getStatusColor(app.status).bg,
                      color: getStatusColor(app.status).color,
                      fontWeight: 'medium',
                      borderRadius: 1
                    }} 
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View Details">
                    <IconButton 
                      size="small" 
                      sx={{ mr: 1 }}
                      onClick={() => handleViewDetails(app)}
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {app.status === 'Pending' && (
                    <>
                      <Tooltip title="Approve">
                        <IconButton 
                          size="small" 
                          sx={{ color: '#4caf50', mr: 1 }}
                          onClick={() => handleApprove(app.id)}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton 
                          size="small" 
                          sx={{ color: '#f44336' }}
                          onClick={() => handleReject(app.id)}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredApplications.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );

  const renderProgramsTab = () => (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2" fontWeight="bold">
          Scholarship Programs
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />} 
          onClick={handleNewScholarship}
        >
          New Program
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Eligibility</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Deadline</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell>{program.name}</TableCell>
                <TableCell>{program.eligibility}</TableCell>
                <TableCell>{program.amount}</TableCell>
                <TableCell>{program.deadline}</TableCell>
                <TableCell>
                  <Chip 
                    label={program.status} 
                    size="small"
                    sx={{ 
                      backgroundColor: getStatusColor(program.status).bg,
                      color: getStatusColor(program.status).color,
                      fontWeight: 'medium',
                      borderRadius: 1
                    }} 
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton 
                      size="small" 
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      size="small" 
                      sx={{ color: '#f44336' }}
                      onClick={() => handleDeleteProgram(program)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  const renderEventsTab = () => (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2" fontWeight="bold">
          Upcoming Events
        </Typography>
      </Box>
      <List>
        {upcomingEvents.map((event) => (
          <ListItem key={event.id} disableGutters>
            <ListItemText 
              primary={event.title}
              secondary={`${event.date} | ${event.time} | ${event.location}`}
            />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* // create a container with mobile responsive design */}
      <Container fluid>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Dashboard" />
          <Tab label="Scholarship Programs" />
          <Tab label="Applications" />
          <Tab label="Events" />
        </Tabs>
        {tabValue === 0 && renderDashboardTab()}
        {tabValue === 1 && renderProgramsTab()}
        {tabValue === 2 && renderApplicationsTab()}
        {tabValue === 3 && renderEventsTab()}
      </Box>
      <Dialog open={detailsDialog} onClose={handleCloseDetails}>
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <>
              <Typography variant="body1" gutterBottom>
                <strong>Student:</strong> {selectedApplication.student}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Course:</strong> {selectedApplication.course}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Type:</strong> {selectedApplication.type}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Amount:</strong> {selectedApplication.amount}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>GPA:</strong> {selectedApplication.gpa}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Date:</strong> {selectedApplication.date}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Status:</strong> {selectedApplication.status}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={newScholarshipDialog} onClose={handleCloseNewScholarship}>
        <DialogTitle>New Scholarship Program</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Program Name"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Eligibility"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Amount"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Deadline"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewScholarship} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddNewScholarship} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteConfirmDialog} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the program "{selectedProgram?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteProgram} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </Container>

    </Box>
  );
};

export default StaffDashboardComponent;