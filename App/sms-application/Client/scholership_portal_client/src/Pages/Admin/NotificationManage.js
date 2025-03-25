import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
    Card,
    CardContent,
    CardActions,
    Tooltip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    FormHelperText
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Notifications as NotificationsIcon,
    NotificationsOff as NotificationsOffIcon
} from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';
import staffService from '../../Services/staffService';

// Notification Details Table Component
const NotificationDetailsTable = ({ notification }) => {
    return (
        <TableContainer component={Paper} elevation={3} sx={{ mb: 2 }}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Title</TableCell>
                        <TableCell>{notification.messageTitle}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Recipient</TableCell>
                        <TableCell>
                            {notification.messageTo === 1 ? 'Admin' :
                                notification.messageTo === 2 ? 'Staff' : 'Students'}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell>
                            <Tooltip title={notification.canNotify ? 'Disable Notifications' : 'Enable Notifications'}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={notification.canNotify}
                                            color="primary"
                                            icon={<NotificationsOffIcon />}
                                            checkedIcon={<NotificationsIcon />}
                                        />
                                    }
                                    label={notification.canNotify ? 'Active' : 'Inactive'}
                                />
                            </Tooltip>
                        </TableCell>

                    </TableRow>

                </TableBody>
            </Table>
        </TableContainer>
    );
};

const NotificationManagement = () => {
    // State Management
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [contactPersons, setContactPersons] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        notificationId: '',
        messageTitle: '',
        messageTo: 1,
        message: '',
        contactPersonID: '',
        notificationType: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        canNotify: true
    });
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    // Validation Function
    const validateForm = () => {
        const newErrors = {};

        if (!formData.messageTitle.trim()) {
            newErrors.messageTitle = 'Title is required';
        }

        if (!formData.messageTo) {
            newErrors.messageTo = 'Recipient is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        if (!formData.contactPersonID) {
            newErrors.contactPersonID = 'Contact person is required';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'End date is required';
        }

        // Date validation
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            if (end < start) {
                newErrors.endDate = 'End date must be after start date';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Input Change Handler
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Form Submission Handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const notificationData = {
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString()
            };

            let updatedNotifications;
            if (isEditing) {
                updatedNotifications = await staffService.updateNotification(notificationData);
            } else {
                delete notificationData.notificationId;
                updatedNotifications = await staffService.addNotification(notificationData);
            }

            setNotifications(updatedNotifications);
            handleClose();
        } catch (error) {
            console.error('Failed to save notification', error);
        }
    };

    // Dialog Open Handler
    const handleOpen = (notification = null) => {
        if (notification) {
            // Edit mode
            setFormData({
                ...notification,
                startDate: new Date(notification.startDate).toISOString().split('T')[0],
                endDate: new Date(notification.endDate).toISOString().split('T')[0]
            });
            setIsEditing(true);
        } else {
            // Add mode
            setFormData({
                notificationId: '',
                messageTitle: '',
                messageTo: 1,
                message: '',
                contactPersonID: '',
                notificationType: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                canNotify: true
            });
            setIsEditing(false);
        }
        setOpen(true);
    };

    // Dialog Close Handler
    const handleClose = () => {
        setOpen(false);
        setErrors({});
    };

    // Delete Notification
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/notifications/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setNotifications(notifications.filter(n => n.notificationId !== id));
            }
        } catch (error) {
            console.error('Failed to delete notification', error);
        }
    };

    // Toggle Notification Status
    const handleToggleNotify = async (notification) => {
        try {
            const updatedNotification = {
                ...notification,
                canNotify: !notification.canNotify
            };

            const response = await fetch(`/api/notifications/${notification.notificationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedNotification)
            });

            if (response.ok) {
                fetchNotifications();
            }
        } catch (error) {
            console.error('Failed to toggle notification', error);
        }
    };

    // Fetch Contact Persons
    useEffect(() => {
        const fetchContactPersons = async () => {
            try {
                const response = await staffService.getActiveStaffs();
                setContactPersons(response);
            } catch (error) {
                console.error('Failed to fetch contact persons', error);
            }
        };

        fetchContactPersons();
    }, []);
    const fetchNotifications = async () => {
        try {
            const response = await staffService.getNotifications();
            setNotifications(response);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };
    // Fetch Notifications
    useEffect(() => {

        fetchNotifications();
    }, []);

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4
                    }}
                >
                        <Typography
                            variant="h4"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 'bold'
                            }}
                        >

                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpen()}
                            sx={{
                                boxShadow: 2,
                                ml: 'auto', // This will push the button to the right
                                '&:hover': {
                                    boxShadow: 6
                                }
                            }}
                        >
                            Create Notification
                        </Button>
                        </Box>

                <AnimatePresence>
                    {notifications.map(notification => (
                        <motion.div
                            key={notification.notificationId}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card
                                sx={{
                                    mb: 2,
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.02)'
                                    }
                                }}
                                elevation={3}
                            >
                                <CardContent>
                                    <NotificationDetailsTable notification={notification} />
                                </CardContent>
                                <CardActions>
                                    {/* <Tooltip title={notification.canNotify ? 'Disable Notifications' : 'Enable Notifications'}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={notification.canNotify}
                                                    onChange={() => handleToggleNotify(notification)}
                                                    color="primary"
                                                    icon={<NotificationsOffIcon />}
                                                    checkedIcon={<NotificationsIcon />}
                                                />
                                            }
                                            label={notification.canNotify ? 'Active' : 'Inactive'}
                                        />
                                    </Tooltip> */}
                                    <Box sx={{ flexGrow: 1 }} />
                                    <Tooltip title="Edit Notification">
                                        <Button
                                            startIcon={<EditIcon />}
                                            color="primary"
                                            onClick={() => handleOpen(notification)}
                                        >
                                            Edit
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Delete Notification">
                                        <Button
                                            startIcon={<DeleteIcon />}
                                            color="error"
                                            onClick={() => setSelectedNotification(notification)}
                                        >
                                            Delete
                                        </Button>
                                    </Tooltip>
                                </CardActions>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            p: 1
                        }
                    }}
                >
                    <DialogTitle>
                        {isEditing ? 'Edit Notification' : 'Create Notification'}
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Title"
                                        name="messageTitle"
                                        value={formData.messageTitle}
                                        onChange={handleChange}
                                        error={!!errors.messageTitle}
                                        helperText={errors.messageTitle}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        label="Message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        error={!!errors.message}
                                        helperText={errors.message}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={!!errors.messageTo}>
                                        <InputLabel>Recipient</InputLabel>
                                        <Select
                                            name="messageTo"
                                            value={formData.messageTo}
                                            label="Recipient"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={1}>Admin</MenuItem>
                                            <MenuItem value={2}>Staff</MenuItem>
                                            <MenuItem value={3}>Students</MenuItem>
                                        </Select>
                                        {errors.messageTo && (
                                            <FormHelperText>{errors.messageTo}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={!!errors.notificationType}>
                                        <InputLabel>Notification Type</InputLabel>
                                        <Select
                                            name="notificationType"
                                            value={formData.notificationType}
                                            label="Notification Type"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={1}>Required</MenuItem>
                                            <MenuItem value={2}>Optional</MenuItem>
                                        </Select>
                                        {errors.notificationType && (
                                            <FormHelperText>{errors.notificationType}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={!!errors.contactPersonID}>
                                        <InputLabel>Contact Person</InputLabel>
                                        <Select
                                            name="contactPersonID"
                                            value={formData.contactPersonID}
                                            label="Contact Person"
                                            onChange={handleChange}
                                        >
                                            {contactPersons.map(person => (
                                                <MenuItem
                                                    key={person.id}
                                                    value={person.id}
                                                >
                                                    {person.staffName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.contactPersonID && (
                                            <FormHelperText>{errors.contactPersonID}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Start Date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.startDate}
                                        helperText={errors.startDate}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="End Date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.endDate}
                                        helperText={errors.endDate}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.canNotify}
                                                onChange={(e) =>
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        canNotify: e.target.checked
                                                    }))
                                                }
                                                color="primary"
                                            />
                                        }
                                        label="Enable Notifications"
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={handleSubmit}
                        >
                            {isEditing ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={!!selectedNotification}
                    onClose={() => setSelectedNotification(null)}
                >
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete the notification:
                            "{selectedNotification?.messageTitle}"?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedNotification(null)}>
                            Cancel
                        </Button>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() => {
                                if (selectedNotification) {
                                    handleDelete(selectedNotification.notificationId);
                                }
                                setSelectedNotification(null);
                            }}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Empty State */}
                {notifications.length === 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mt: 4
                        }}
                    >
                        <NotificationsIcon sx={{ fontSize: 100, color: 'text.secondary' }} />
                        <Typography variant="h6" color="text.secondary">
                            No notifications created yet
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default NotificationManagement;