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
import 'bootstrap/dist/css/bootstrap.min.css';
import StaffHeader from '../../Components/StaffHeader';

// Mock data service (replace with actual API calls)
const StaffService = {
  getStaff: () => {
    const staffData = localStorage.getItem('staffData');
    return staffData ? JSON.parse(staffData) : [];
  },
  
  createStaff: (staffMember) => {
    const staffData = StaffService.getStaff();
    const newStaff = {
      ...staffMember,
      Staff_id: staffData.length + 1,
      Staff_Privilage_id: 1, // Default to 'New'
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false
    };
    staffData.push(newStaff);
    localStorage.setItem('staffData', JSON.stringify(staffData));
    return newStaff;
  },
  
  updateStaff: (updatedStaff) => {
    const staffData = StaffService.getStaff();
    const index = staffData.findIndex(staff => staff.Staff_id === updatedStaff.Staff_id);
    if (index !== -1) {
      staffData[index] = {
        ...updatedStaff,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('staffData', JSON.stringify(staffData));
    }
    return updatedStaff;
  }
};

// Privilege Options
const PRIVILEGE_OPTIONS = [
  { id: 1, name: 'New' },
  { id: 2, name: 'Admin' },
  { id: 3, name: 'Incharge' },
  { id: 4, name: 'Expired' }
];

// Stats data - could be connected to real data
const statsData = [
  { title: "Total Staff", count: 138, change: "+12% from last month", icon: "👥", color: "#B71C1C" },
  { title: "Active Privileges", count: 4, value: "₹38.5 Lakhs", icon: "🔑", color: "#1976D2" },
  { title: "New Staff", count: 42, change: "+18% from previous month", icon: "✓", color: "#388E3C" },
  { title: "Budget Allocated", count: "₹24.5L", remaining: "₹14.8 Lakhs", icon: "₹", color: "#FF9800" }
];

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    staff_name: '',
    Staff_enroll_Id: '',
    Staff_Phone_Number: '',
    staff_password: ''
  });

  // Load staff data on component mount
  useEffect(() => {
    setStaffList(StaffService.getStaff());
  }, []);

  // Handler for input changes in forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaffForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create new staff member
  const handleCreateStaff = () => {
    const newStaff = StaffService.createStaff(newStaffForm);
    setStaffList([...staffList, newStaff]);
    setIsAddModalOpen(false);
    setNewStaffForm({
      staff_name: '',
      Staff_enroll_Id: '',
      Staff_Phone_Number: '',
      staff_password: ''
    });
  };

  // Edit staff member
  const handleEditStaff = () => {
    const updatedStaff = StaffService.updateStaff(selectedStaff);
    const updatedList = staffList.map(staff => 
      staff.Staff_id === updatedStaff.Staff_id ? updatedStaff : staff
    );
    setStaffList(updatedList);
    setIsEditModalOpen(false);
  };

  // Open edit modal
  const openEditModal = (staff) => {
    setSelectedStaff(staff);
    setIsEditModalOpen(true);
  };

  // Privilege change handler with confirmation
  const handlePrivilegeChange = (staff, newPrivilege) => {
    const confirmed = window.confirm(`Are you sure you want to change privilege for ${staff.staff_name}?`);
    if (confirmed) {
      const updatedStaff = {
        ...staff,
        Staff_Privilage_id: newPrivilege
      };
      const updatedStaffMember = StaffService.updateStaff(updatedStaff);
      const updatedList = staffList.map(s => 
        s.Staff_id === updatedStaffMember.Staff_id ? updatedStaffMember : s
      );
      setStaffList(updatedList);
    }
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>

<Row>
        <StaffHeader />
        </Row>
      <Container fluid="lg" style={{ marginTop: '2rem' }}>


        {/* Stats Cards */}
        <Row className="mb-4">
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
        </Row>

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
                    <TableCell>ID</TableCell>
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
                      <TableRow key={staff.Staff_id} hover>
                        <TableCell>{staff.Staff_id}</TableCell>
                        <TableCell>{staff.staff_name}</TableCell>
                        <TableCell>{staff.Staff_enroll_Id}</TableCell>
                        <TableCell>{staff.Staff_Phone_Number}</TableCell>
                        <TableCell>
                          <Select
                            value={staff.Staff_Privilage_id}
                            onChange={(e) => handlePrivilegeChange(staff, e.target.value)}
                            size="small"
                            sx={{ minWidth: 120 }}
                          >
                            {PRIVILEGE_OPTIONS.map((priv) => (
                              <MenuItem key={priv.id} value={priv.id}>
                                {priv.name}
                              </MenuItem>
                            ))}
                          </Select>
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
            name="staff_name"
            label="Staff Name"
            fullWidth
            margin="normal"
            value={newStaffForm.staff_name}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            name="Staff_enroll_Id"
            label="Enrollment ID"
            fullWidth
            margin="normal"
            value={newStaffForm.Staff_enroll_Id}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            name="Staff_Phone_Number"
            label="Phone Number"
            fullWidth
            margin="normal"
            value={newStaffForm.Staff_Phone_Number}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            name="staff_password"
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={newStaffForm.staff_password}
            onChange={handleInputChange}
            variant="outlined"
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
            name="staff_name"
            label="Staff Name"
            fullWidth
            margin="normal"
            value={selectedStaff?.staff_name || ''}
            onChange={(e) => setSelectedStaff(prev => ({
              ...prev,
              staff_name: e.target.value
            }))}
            variant="outlined"
          />
          <TextField
            name="Staff_enroll_Id"
            label="Enrollment ID"
            fullWidth
            margin="normal"
            value={selectedStaff?.Staff_enroll_Id || ''}
            onChange={(e) => setSelectedStaff(prev => ({
              ...prev,
              Staff_enroll_Id: e.target.value
            }))}
            variant="outlined"
          />
          <TextField
            name="Staff_Phone_Number"
            label="Phone Number"
            fullWidth
            margin="normal"
            value={selectedStaff?.Staff_Phone_Number || ''}
            onChange={(e) => setSelectedStaff(prev => ({
              ...prev,
              Staff_Phone_Number: e.target.value
            }))}
            variant="outlined"
          />
          <TextField
            name="staff_password"
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            placeholder="Leave blank to keep current password"
            onChange={(e) => setSelectedStaff(prev => ({
              ...prev,
              staff_password: e.target.value
            }))}
            variant="outlined"
          />
          <Select
            value={selectedStaff?.Staff_Privilage_id || 1}
            onChange={(e) => setSelectedStaff(prev => ({
              ...prev,
              Staff_Privilage_id: e.target.value
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