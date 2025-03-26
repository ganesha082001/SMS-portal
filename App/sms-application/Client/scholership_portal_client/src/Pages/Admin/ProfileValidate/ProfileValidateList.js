import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TableSortLabel,
  IconButton,
  Container,
  CircularProgress,
  Alert,
  Modal,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import StaffService from '../../../Services/staffService';
import StudentInfoReview from './ProfileValidate'; // Import the modal component

const StudentProfileTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchRollNumber, setSearchRollNumber] = useState('');
  const [orderBy, setOrderBy] = useState('studentName');
  const [order, setOrder] = useState('asc');
  const [selectedStudentId, setSelectedStudentId] = useState(null); // State for selected student ID
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    const fetchStudentProfiles = async () => {
      try {
        const response = await StaffService.getReviewList();
        setData(response);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch student profiles');
        setLoading(false);
      }
    };

    fetchStudentProfiles();
  }, []);

  // Sorting function
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filtering function
  const filteredData = data
    .filter(
      (student) =>
        student.studentName.toLowerCase().includes(searchName.toLowerCase()) &&
        student.studentRollnumber.toLowerCase().includes(searchRollNumber.toLowerCase())
    )
    .sort((a, b) => {
      const comparator = order === 'asc' ? 1 : -1;
      return a[orderBy] < b[orderBy] ? -comparator : comparator;
    });

  // Handle view profile
  const handleViewProfile = (studentId) => {
    setSelectedStudentId(studentId); // Set the selected student ID
    setShowModal(true); // Open the modal
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setSelectedStudentId(null); // Clear the selected student ID
  };

  // Render loading state
  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col xs={12} md={6}>
          <TextField
            fullWidth
            label="Search by Name"
            variant="outlined"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            margin="normal"
          />
        </Col>
        <Col xs={12} md={6}>
          <TextField
            fullWidth
            label="Search by Roll Number"
            variant="outlined"
            value={searchRollNumber}
            onChange={(e) => setSearchRollNumber(e.target.value)}
            margin="normal"
          />
        </Col>
      </Row>

      {data.length === 0 ? (
        <Alert severity="info">No student profiles found</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="student profile table" responsive>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'studentName'}
                    direction={orderBy === 'studentName' ? order : 'asc'}
                    onClick={() => handleSort('studentName')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'studentRollnumber'}
                    direction={orderBy === 'studentRollnumber' ? order : 'asc'}
                    onClick={() => handleSort('studentRollnumber')}
                  >
                    Roll Number
                  </TableSortLabel>
                </TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((student) => (
                <TableRow
                  key={student.studentId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {student.studentName}
                  </TableCell>
                  <TableCell>{student.studentRollnumber}</TableCell>
                  <TableCell>{student.studentEmail}</TableCell>
                  <TableCell>{student.studentPhone}</TableCell>
                  <TableCell>{student.profileStatus}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleViewProfile(student.studentId)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for Student Info Review */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <StudentInfoReview studentId={selectedStudentId} handleClose={handleCloseModal} />
      </Modal>
    </Container>
  );
};

export default StudentProfileTable;