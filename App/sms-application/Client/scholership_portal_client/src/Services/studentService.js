import SessionStorageUtil from "../Session/SessionStorageUtils";

const baseURL = 'http://localhost:3006';


class StudentService {

    static async gettoken() {
        const token = SessionStorageUtil.getParticularData('activeToken');
        return token;
    }


    static checkAuth() {
        const responseCode = SessionStorageUtil.getParticularData('responseCode');
        if ( responseCode && !responseCode === "allowed" ) {
            alert('Login expired. Please login again.');
            SessionStorageUtil.clearAppData();
            window.location.href = '/';
            throw new Error('Login expired');
        }
    }
    static async studentLogin(username, password) {
        const response = await fetch(`${baseURL}/Auth/login/student`, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('role', data.role);
            localStorage.setItem('responseCode', data.responseCode);
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

        } else {
            throw new Error(data.message || 'Login failed');
        }
        return data;
    }


    // create a function to fetch the student data from the server
    static async getStudentProfile(studentId) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Student/profile/${studentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch student profile');
        }
        return await response.json();
    }

    // create a function to perform student registration
    static async registerStudent(student) {
        this.checkAuth();
        const response = await fetch(`${baseURL}/register`, {
            method: 'POST',
            headers: {
                'accept': 'text/plain',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(student),
        });
        const data = await response.json();
        return data;
    }
    
    // create a function to save the student personal information
    static async savePersonalInfo(personalInfo) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Personal/PersonalInfo`, {
            method: 'POST',
            headers: {
                'accept': 'text/plain',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(personalInfo),
        });
        if (!response.ok) {
            throw new Error('Failed to save personal info');
        }
        return await response.json();
    }
    // check if the student has saved the personal information
    static async hasSavedPersonalInfo(studentId) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Personal/PersonalInfo/checkProfileExist/${studentId}`, {
            headers: {
                'accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to check personal info');
        }
        return await response.json();
    }

    // function to update the student personal information
    static async updatePersonalInfo(personalInfo) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Personal/PersonalInfo/${personalInfo.studentId}`, {
            method: 'PUT',
            headers: {
                'accept': 'text/plain',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(personalInfo),
        });
        if (!response.ok) {
            throw new Error('Failed to update personal info');
        }
        return await response.json();
    }

    // function to fetch the student's educational information
    static async getEducationalInfo(studentId) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Education/EducationalInfo/${studentId}`, {
            headers: {
                'accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch educational info');
        }
        return await response.json();
    }

    // function to update the student's educational information
    static async updateEducationalInfo(educationalInfo) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Education/EducationalInfo/${educationalInfo.studentId}`, {
            method: 'PUT',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(educationalInfo),
        });
        if (!response.ok) {
            throw new Error('Failed to update educational info');
        }
        return await response.json();
    }
    static async createEducationalInfo(personalInfo) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Education/EducationalInfo`, {
            method: 'POST',
            headers: {
                'accept': 'text/plain',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(personalInfo),
        });
        if (!response.ok) {
            throw new Error('Failed to save personal info');
        }
        return await response.json();
    }

    // function to fetch the student's scholarship information
    static async getScholarshipInfo(studentId) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Scholarshipinfo/ScholarshipInfo/${studentId}`, {
            headers: {
                'accept': 'text/plain',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch scholarship info');
        }
        return await response.json();
    }

    // function to update the student's scholarship information
    static async updateScholarshipInfo(scholarshipInfo) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Scholarshipinfo/ScholarshipInfo/${scholarshipInfo.studentID}`, {
            method: 'PUT',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(scholarshipInfo),
        });
        if (!response.ok) {
            throw new Error('Failed to update scholarship info');
        }
        return await response.json();
    }

    // function to create a new scholarship application
    static async createScholarshipInfo(scholarshipApplication) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Scholarshipinfo/ScholarshipInfo`, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(scholarshipApplication),
        });
        if (!response.ok) {
            throw new Error('Failed to create scholarship application');
        }
        return await response.json();
    }

    // function to check the student profile required
    static async checkStudentProfile(studentId) {
        this.checkAuth();
        const token = await this.gettoken();
        const response = await fetch(`${baseURL}/Student/profilecheck/${studentId}`, {
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to check student profile');
        }
        return await response.json();
    }
}

export default StudentService;