import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Select, 
  MenuItem,
  IconButton,
  Typography,
  Box,
  Divider,
  AppBar,
  Toolbar,
  Badge,
  Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import 'bootstrap/dist/css/bootstrap.min.css';
import StaffHeader from '../../Components/StaffHeader';
import StaffService from '../../Services/staffService'; // Import the updated staff service

// Privilege Options
const PRIVILEGE_OPTIONS = [
  { id: 1, name: 'New' },
  { id: 2, name: 'Admin' },
  { id: 3, name: 'Incharge' },
  { id: 4, name: 'Expired' }
];

// Stats data - could be connected to real data
// const statsData = [
//   { title: "Total Staff", count: 138, change: "+12% from last month", icon: "👥", color: "#B71C1C" },
//   { title: "Active Privileges", count: 4, value: "₹38.5 Lakhs", icon: "🔑", color: "#1976D2" },
//   { title: "New Staff", count: 42, change: "+18% from previous month", icon: "✓", color: "#388E3C" },
//   { title: "Budget Allocated", count: "₹24.5L", remaining: "₹14.8 Lakhs", icon: "₹", color: "#FF9800" }
// ];

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [privilage, setPrivilage] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    staffName: '',
    staffId: '',
    staffPhone: '',
    staffPassword: '',
    staffUsername: '',
    staffPrivilageId: 1,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Load staff data on component mount
   useEffect(() => {
     const fetchStaffData = async () => {
       try {
         const data = await StaffService.getStaff();
         setStaffList(data);
       } catch (error) {
         console.error('Error fetching staff data:', error);
       }
   };

   const getPrivilage = async () => {
      try {
        const data = await StaffService.getPrivilage();
        setPrivilage(data.staffPrivilageId);
      } catch (error) {
        console.error('Error fetching privilage data:', error);
      }
    };

    fetchStaffData();
    getPrivilage();
  }, []);

  // Handler for input changes in forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validation for phone number - only allow digits
    if (name === 'staffPhone') {
      const digits = value.replace(/\D/g, '');
      const isValidStart = /^[6-9]/.test(digits);
      setFormErrors(prev => ({
        ...prev,
        staffPhone: (digits.length !== 10 || !isValidStart) && digits.length > 0 ? 'Phone number must be 10 digits and start with 6-9' : ''
      }));
      setNewStaffForm(prev => ({
        ...prev,
        [name]: digits
      }));
    } else {
      setNewStaffForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    if (!newStaffForm.staffUsername.trim()) {
      errors.staffUsername = 'Username is required';
    }
    if (!newStaffForm.staffPassword.trim()) {
      errors.staffPassword = 'Password is required';
    }
    if (!newStaffForm.staffPhone.trim()) {
      errors.staffPhone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(newStaffForm.staffPhone)) {
      errors.staffPhone = 'Phone number must be 10 digits';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create new staff member
  const handleCreateStaff = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const newStaff = await StaffService.createNewStaff(newStaffForm);
      setStaffList([...staffList, newStaff]);
      setIsAddModalOpen(false);
      setNewStaffForm({
        staffName: '',
        staffId: '',
        staffPhone: '',
        staffPassword: '',
        staffUsername: '',
        staffPrivilageId: 1,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setFormErrors({});
    } catch (error) {
      console.error('Error creating staff:', error);
    }
  };

  // Edit staff member
  const handleEditStaff = async () => {
    try {
      const updatedStaff = await StaffService.updateStaffDetails(selectedStaff);
      const updatedList = staffList.map(staff => 
        staff.id === updatedStaff.id ? updatedStaff : staff
      );
      setStaffList(updatedList);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  // Open edit modal
  const openEditModal = (staff) => {
    setSelectedStaff(staff);
    setIsEditModalOpen(true);
  };

  // Privilege change handler with confirmation
  const handlePrivilegeChange = async (staff, newPrivilege) => {
    const confirmed = window.confirm(`Are you sure you want to change privilege for ${staff.staffName}?`);
    if (confirmed) {
      try {
        const updatedStaff = {
          ...staff,
          staffPrivilageId: newPrivilege
        };
        const updatedStaffMember = await StaffService.updateStaffPrivilege(updatedStaff.id ,newPrivilege);
        const updatedList = staffList.map(s => 
          s.id === updatedStaffMember.staff.id ? updatedStaffMember.staff : s
        );
        setStaffList(updatedList);
      } catch (error) {
        console.error('Error updating staff privilege:', error);
      }
    }
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Row>
        <StaffHeader />
      </Row>
      <Container fluid="lg" style={{ marginTop: '2rem' }}>
        {/* Stats Cards */}
        {/* <Row className="mb-4">
          {statsData.map((stat, index) => (
            <Col key={index} xs={12} md={6} lg={3} className="mb-3">
              <Card style={{ borderRadius: "10px", borderTop: `4px solid ${stat.color}` }}>
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <Typography variant="subtitle2" color="textSecondary">
                        {stat.title}
                      </Typography>
                      <Typography variant="h3" sx={{ mt: 1, fontWeight: 'bold' }}>
                        {stat.count}
                      </Typography>
                      {stat.change && (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          {stat.change}
                        </Typography>
                      )}
                      {stat.value && (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          Total value: {stat.value}
                        </Typography>
                      )}
                      {stat.remaining && (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          Budget remaining: {stat.remaining}
                        </Typography>
                      )}
                    </div>
                    <div 
                      style={{ 
                        backgroundColor: `${stat.color}20`, 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                      }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row> */}

        {/* Staff Management Section */}
        <Card sx={{ mt: 4, mb: 4, boxShadow: 2, borderRadius: 2 }}>
          <Card.Body>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="div">
                Staff Management
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<PersonAddIcon />}
                onClick={() => setIsAddModalOpen(true)}
              >
                Add New Staff
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            
            {/* Staff Listing Table */}
            <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    {/* <TableCell>ID</TableCell> */}
                    <TableCell>Name</TableCell>
                    <TableCell>Enrollment ID</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Privilege</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {staffList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body1" sx={{ py: 3 }}>
                          No staff members found. Add your first staff member!
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    staffList.map((staff) => (
                      <TableRow key={staff.id} hover>
                        { /* <TableCell>{staff.id}</TableCell>  */ }
                        <TableCell>{staff.staffName}</TableCell>
                        <TableCell>{staff.staffId}</TableCell>
                        <TableCell>{staff.staffPhone}</TableCell>
                        <TableCell>
                          {privilage === 2 ? (
                            <Select
                              value={staff.staffPrivilageId}
                              onChange={(e) => {
                                handlePrivilegeChange(staff, e.target.value);
                              }}
                              size="small"
                              sx={{ minWidth: 120 }}
                            >
                              {PRIVILEGE_OPTIONS.map((priv) => (
                                <MenuItem key={priv.id} value={priv.id}>
                                  {priv.name}
                                </MenuItem>
                              ))}
                            </Select>
                          ) : (
                            <Typography variant="body2">
                              {PRIVILEGE_OPTIONS.find((priv) => priv.id === staff.staffPrivilageId)?.name}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            color="secondary" 
                            onClick={() => openEditModal(staff)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                        </TableRow>
                        ))
                        )}
                        </TableBody>
                        </Table>
                        </TableContainer>
                        </Card.Body>
                        </Card>
                        </Container>

      {/* Add Staff Modal */}
      <Dialog 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle 
          sx={{ 
            backgroundColor: '#B71C1C', 
            color: 'white',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
          }}
        >
          Add New Staff
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            name="staffName"
            label="Staff Name"
            fullWidth
            margin="normal"
            value={newStaffForm.staffName}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            name="staffId"
            label="Enrollment ID"
            fullWidth
            margin="normal"
            value={newStaffForm.staffId}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            name="staffUsername"
            label="Username"
            fullWidth
            margin="normal"
            value={newStaffForm.staffUsername}
            onChange={handleInputChange}
            variant="outlined"
            error={!!formErrors.staffUsername}
            helperText={formErrors.staffUsername}
          />
          <TextField
            name="staffPhone"
            label="Phone Number"
            fullWidth
            margin="normal"
            value={newStaffForm.staffPhone}
            onChange={handleInputChange}
            variant="outlined"
            error={!!formErrors.staffPhone}
            helperText={formErrors.staffPhone}
            inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
          />
          <TextField
            name="staffPassword"
            label="Password"
            fullWidth
            margin="normal"
            type={showPassword ? "text" : "password"}
            value={newStaffForm.staffPassword}
            onChange={handleInputChange}
            variant="outlined"
            error={!!formErrors.staffPassword}
            helperText={formErrors.staffPassword}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Button 
            onClick={() => setIsAddModalOpen(false)} 
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateStaff} 
            variant="contained" 
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Staff Modal */}
      <Dialog 
        open={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle 
          sx={{ 
            backgroundColor: '#B71C1C', 
            color: 'white',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
          }}
        >
          Edit Staff
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            name="staffName"
            label="Staff Name"
            fullWidth
            margin="normal"
            value={selectedStaff?.staffName || ''}
            onChange={(e) => setSelectedStaff(prev => ({
              ...prev,
              staffName: e.target.value
            }))}
            variant="outlined"
          />
          <TextField
            name="staffId"
            label="Enrollment ID"
            fullWidth
            margin="normal"
            value={selectedStaff?.staffId || ''}
            onChange={(e) => setSelectedStaff(prev => ({
              ...prev,
              staffId: e.target.value
            }))}
            variant="outlined"
          />
          <TextField
            name="staffPhone"
            label="Phone Number"
            fullWidth
            margin="normal"
            value={selectedStaff?.staffPhone || ''}
            onChange={(e) => setSelectedStaff(prev => ({
              ...prev,
              staffPhone: e.target.value
            }))}
            variant="outlined"
          />
          <TextField
            name="staffPassword"
            label="Password"
            fullWidth
            margin="normal"
            placeholder="Leave blank to keep current password"
            type={showPassword ? "text" : "password"}
            value={selectedStaff?.staffPassword || ''}
            onChange={(e) => setSelectedStaff(prev => ({
              ...prev,
              staffPassword: e.target.value
            }))}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            }}
          />
          <Select
            value={selectedStaff?.staffPrivilageId || 1}
            onChange={(e) => setSelectedStaff(prev => ({
              ...prev,
              staffPrivilageId: e.target.value
            }))}
            fullWidth
            label="Privilege"
            margin="normal"
            sx={{ mt: 2 }}
          >
            {PRIVILEGE_OPTIONS.map((priv) => (
              <MenuItem key={priv.id} value={priv.id}>
                {priv.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Button 
            onClick={() => setIsEditModalOpen(false)} 
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditStaff} 
            variant="contained" 
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StaffManagement;