import SessionStorageUtil from "../Session/SessionStorageUtils";

const baseURL = 'http://localhost:3006';


class StaffService {


    static async gettoken() {
        const token = SessionStorageUtil.getParticularData('activeToken');
        return token;
    }

    static checkAuth() {
        const responseCode = SessionStorageUtil.getParticularData('responseCode');
        if (!responseCode || !responseCode === "allowed") {
            alert('Login expired. Please login again.');
            SessionStorageUtil.clearAppData();
            window.location.href = '/';
            throw new Error('Login expired');
        }
    }
    static async staffLogin(username, password) {
        const response = await fetch(`${baseURL}/Auth/login/staff`, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('responseCode', data.responseCode);

        } else {
            throw new Error(data.message || 'Login failed');
        }
        return data;
    }

    static async createNewStaff(staffData) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Staffs/new`, {
            method: 'POST',
            headers: {
                'accept': 'text/plain',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(staffData)
        });
        if (!response.ok) {
            throw new Error('Failed to create new staff');
        }
        return await response.json();
    }

    // create a function to fetch the staff data from the server
    static async getStaff(staffId) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Staffs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch staff profile');
        }
        return await response.json();
    }

    // create a function to update the staff privilage
    static async updateStaffPrivilege(staffId, privilegeId) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Staffs/setprivilage/${staffId}?privilageId=${privilegeId}`, {
            method: 'PUT',
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to update staff privilege');
        }
        return await response.json();
    }

    // create a function to update the staff privilage
    static async getPrivilage() {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Staffs/getprivilage/${SessionStorageUtil.getParticularData("userID")}`, {
            method: 'GET',
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to update staff profile');
        }
        return await response.json();
    }

    // update the staff profile
    static async updateStaffDetails(staffData) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Staffs/${staffData.id}`, {
            method: 'PUT',
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(staffData)
        });
        if (!response.ok) {
            throw new Error('Failed to update staff profile');
        }
        return await response.json();
    }

    // create scholarship
    static async createScholarship(scholarshipData) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Scholarship/`, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scholarshipData)
        });
        if (!response.ok) {
            throw new Error('Failed to create new scholarship');
        }
        return await response.json();
    }

    // update scholarship
    static async updateScholarship(scholarshipData) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Scholarship/${scholarshipData.scholarshipId}`, {
            method: 'PUT',
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scholarshipData)
        });
        if (!response.ok) {
            throw new Error('Failed to update scholarship');
        }
        return true;
    }

    // get list of activestaffs
    static async getActiveStaffs() {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Staffs/activeStaffs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch active staffs');
        }
        return await response.json();
    }

    // get list of scholarships
    static async getAllScholarships() {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Scholarship`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch scholarships');
        }
        return await response.json();
    }

    // get list of scholarships
    static async getactiveScholarships() {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Scholarship/notify/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch scholarships');
        }
        return await response.json();
    }

    // fetch scholarship by id
    static async getScholarship(scholarshipId) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Scholarship/${scholarshipId}`, {
            headers: {
                'accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch scholarship');
        }
        return await response.json();
    }

    // delete scholarship
    static async deleteScholarship(scholarshipId) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Scholarship/${scholarshipId}`, {
            method: 'DELETE',
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to delete scholarship');
        }
        return await response.json();
    }

    // create a function to add a notification
    static async addNotification(notificationData) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Notification`, {
            method: 'POST',
            headers: {
                'accept': 'text/plain',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(notificationData)
        });
        if (!response.ok) {
            throw new Error('Failed to add notification');
        }
        return await response.json();
    }

    // fetch notifications
    static async getNotifications() {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Notification`, {
            headers: {
                'accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }
        return await response.json();
    }

    // fetch notification by id 
    static async getNotificationById(notificationId) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Notification/${notificationId}`, {
            headers: {
                'accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch notification');
        }
        return await response.json();
    }

    // update notification
    static async updateNotification(notificationData) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Notification/${notificationData.notificationId}`, {
            method: 'PUT',
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(notificationData)
        });
        if (!response.ok) {
            throw new Error('Failed to update notification');
        }
        return await response.json();
    }

    // function to fetch the list of student profiles for review
    static async getReviewList() {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/StudentProfile/ReviewList`, {
            headers: {
                'accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch review list');
        }
        return await response.json();
    }

    // function to get the student profile for review
    static async getFullProfile(studentId) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Personal/PersonalInfo/fullprofile/${studentId}`, {
            headers: {
                'accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch full profile');
        }
        return await response.json();
    }

    // function to review a student profile
    static async reviewStudentProfile(studentId, reviewData) {
        let operationstatus = false;
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/StudentProfile/review/${studentId}`, {
            method: 'PUT',
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });
        if (!response.ok) {
            operationstatus = false
        }
        operationstatus = true;
        return operationstatus;
    }
}

export default StaffService;