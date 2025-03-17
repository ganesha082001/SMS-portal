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
}

export default StudentService;