const baseURL = 'http://localhost:3006/Student';

class StudentService {
    static checkAuth() {
        const role = localStorage.getItem('role');
        const responseCode = localStorage.getItem('responseCode');
        if (!role || !responseCode) {
            alert('Login expired. Please login again.');
            window.location.href = '/';
            throw new Error('Login expired');
        }
    }

    // create a function to fetch the student data from the server
    static async getStudentProfile(studentId) {
        this.checkAuth();
        const response = await fetch(`${baseURL}/profile/${studentId}`);
        const data = await response.json();
        return data;
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