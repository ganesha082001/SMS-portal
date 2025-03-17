import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Alert,
  Pagination
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon
} from '@mui/icons-material';

import ScholarshipModal from './ScholarshipModal';
import StaffHeader from '../../Components/StaffHeader'; // Adjust the path as necessary
import ScholarshipService from '../../Services/staffService'; // Assuming you have this service
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const ScholarshipListing = () => {
  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Load scholarships on component mount
  useEffect(() => {
    loadScholarships();
    loadStaffList();
  }, []);

  // Filter scholarships when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredScholarships(scholarships);
    } else {
      const filtered = scholarships.filter(
        scholarship => 
          scholarship.scholarshipTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          scholarship.scholarshipType.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredScholarships(filtered);
    }
  }, [searchTerm, scholarships]);

  const loadScholarships = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ScholarshipService.getAllScholarships();
      setScholarships(data);
      setFilteredScholarships(data);
    } catch (err) {
      console.error('Error loading scholarships:', err);
      setError('Failed to load scholarships. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadStaffList = async () => {
    try {
      const data = await ScholarshipService.getActiveStaffs();
      setStaffList(data);
    } catch (err) {
      console.error('Error loading staff list:', err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddScholarship = () => {
    setSelectedScholarship({
      scholarshipId: '',
      scholarshipTitle: '',
      scholarshipDescription: '',
      eligibilityCriteria: '',
      applicationStartDate: '',
      applicationEndDate: '',
      scholarshipType: '',
      contactStaffId: '',
      createdAt: '',
      updatedAt: '',
      canNotify: false,
      isDeleted: false,
      isSelfEnrollable: false,
      selfEnrollUrl: '',
      contactStaff: null
    });
    setModalShow(true);
  };

  const handleEditScholarship = (scholarshipId) => {
    // fetch scholarship data by id and set it to selectedScholarship
    ScholarshipService.getScholarship(scholarshipId)
      .then(data => {
        setSelectedScholarship(data);
        setModalShow(true);
      })
      .catch(err => {
        console.error('Error fetching scholarship:', err);
        setNotification({
          show: true,
          message: 'Error fetching scholarship data. Please try again.',
          type: 'error'
        });
      });
    setModalShow(true);
  };

  const handleViewDetails = (scholarship) => {
    setSelectedScholarship(scholarship);
    setModalShow(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await ScholarshipService.deleteScholarship(deleteId);
      setDeleteConfirmOpen(false);
      setNotification({
        show: true,
        message: 'Scholarship deleted successfully',
        type: 'success'
      });
      loadScholarships(); // Reload the list
    } catch (err) {
      setNotification({
        show: true,
        message: `Error deleting scholarship: ${err.message || 'Unknown error'}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalShow(false);
  };

  const saveScholarship = async (scholarshipData) => {
    try {
      if (scholarshipData.scholarshipId) {
        await ScholarshipService.updateScholarship(scholarshipData);
        setNotification({
          show: true,
          message: 'Scholarship updated successfully',
          type: 'success'
        });
      } else {
        // delete scholarshipId before saving if it's a new scholarship
        delete scholarshipData.scholarshipId;
        await ScholarshipService.createScholarship(scholarshipData);
        setNotification({
          show: true,
          message: 'Scholarship created successfully',
          type: 'success'
        });
      }
      loadScholarships(); // Reload the list after save
      handleCloseModal();
      return true;
    } catch (err) {
      console.error('Error saving scholarship:', err);
      throw err;
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Pagination calculations
  const indexOfLastScholarship = currentPage * rowsPerPage;
  const indexOfFirstScholarship = indexOfLastScholarship - rowsPerPage;
  const currentScholarships = filteredScholarships.slice(indexOfFirstScholarship, indexOfLastScholarship);
  const pageCount = Math.ceil(filteredScholarships.length / rowsPerPage);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
    < StaffHeader />

    <Container fluid className="py-4">
      {notification.show && (
        <Alert 
          severity={notification.type} 
          onClose={() => setNotification({ ...notification, show: false })}
          sx={{ mb: 3 }}
        >
          {notification.message}
        </Alert>
      )}

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col md={6}>
              <h4 className="mb-0">Scholarship Management</h4>
            </Col>
            <Col md={6} className="d-flex justify-content-md-end">
              <Button 
                variant="primary"
                onClick={handleAddScholarship}
                className="d-flex align-items-center"
              >
                <AddIcon fontSize="small" className="me-1" />
                Add Scholarship
              </Button>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={8}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Col>
            <Col md={4} className="d-flex justify-content-md-end mt-3 mt-md-0">
              <Button 
                variant="outline-secondary"
                onClick={loadScholarships}
                disabled={loading}
                className="d-flex align-items-center"
              >
                <RefreshIcon fontSize="small" className="me-1" />
                Refresh
              </Button>
            </Col>
          </Row>

          {error && (
            <Alert severity="error" className="mb-3">
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              <TableContainer component={Paper} className="mb-3">
                <Table aria-label="scholarships table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentScholarships.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No scholarships found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentScholarships.map((scholarship) => {
                        // Calculate status based on dates
                        const now = new Date();
                        const startDate = new Date(scholarship.applicationStartDate);
                        const endDate = new Date(scholarship.applicationEndDate);
                        let status = "Active";
                        let statusColor = "success";
                        
                        if (now < startDate) {
                          status = "Upcoming";
                          statusColor = "info";
                        } else if (now > endDate) {
                          status = "Expired";
                          statusColor = "error";
                        }

                        return (
                          <TableRow key={scholarship.scholarshipId}>
                            <TableCell>{scholarship.scholarshipTitle}</TableCell>
                            <TableCell>{scholarship.scholarshipType}</TableCell>
                            <TableCell>{formatDate(scholarship.applicationStartDate)}</TableCell>
                            <TableCell>{formatDate(scholarship.applicationEndDate)}</TableCell>
                            <TableCell>
                              <Chip 
                                label={status} 
                                color={statusColor} 
                                size="small" 
                                variant="outlined"
                              />
                              {scholarship.canNotify && (
                                <Tooltip title="Notifications enabled">
                                  <NotificationsIcon fontSize="small" color="primary" sx={{ ml: 1 }} />
                                </Tooltip>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Add Students">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewDetails(scholarship)}
                                  color="primary"
                                  disabled
                                >
                                  <GroupAddIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditScholarship(scholarship.scholarshipId)}
                                  color="secondary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteClick(scholarship.scholarshipId)}
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {filteredScholarships.length > rowsPerPage && (
                <Box display="flex" justifyContent="center" my={2}>
                  <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this scholarship? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary" variant="outline-secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" variant="danger" autoFocus>
            {loading ? <Spinner animation="border" size="sm" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Scholarship Modal for Add/Edit */}
      <ScholarshipModal
        show={modalShow}
        handleClose={handleCloseModal}
        scholarshipData={selectedScholarship}
        saveScholarship={saveScholarship}
        staffList={staffList}
      />
    </Container>
    </>
  );
};

export default ScholarshipListing;