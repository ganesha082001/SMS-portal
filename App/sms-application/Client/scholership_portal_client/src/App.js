import './App.css';
import Login from './Pages/Login/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentHomepage from './Pages/Student/Homepage';
import ProfileUpdateForm from './Pages/Student/ProfileUpdateForm';
import ScholarshipLayout from './Pages/Student/ScholarshipLayout';

import StaffHomepge from './Pages/Admin/StaffHomepage';
import Register from './Pages/Login/Register';
import DevelopmentPage from './Pages/development';
import StaffManagement from './Pages/Admin/staffsList';
import ScholarshipList from './Pages/Admin/ScholarshipListing';
import ProfileUpdateFormNew from './Pages/Student/ProfileUpdate/ProfileUpdateForm';
import NotificationManagement from './Pages/Admin/NotificationManage';
import StudentProfileTable from './Pages/Admin/ProfileValidate/ProfileValidateList';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* For students */}
          <Route path="*" element={<DevelopmentPage />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student/home" element={<StudentHomepage />} />
          <Route path="/student/profileold" element={<ProfileUpdateForm />} />
          <Route path="/student/profile" element={<ProfileUpdateFormNew />} />
          <Route path="/student/scholarshiplist" element={<ScholarshipLayout />} />

          {/* For staffs */}
          <Route path="/staff/home" element={<StaffHomepge />} />
          <Route path="/staff/scholarshiplist" element={<ScholarshipList />} />
          <Route path="/staff/stafflist" element={<StaffManagement />} />
          <Route path="/staff/notifications" element={<NotificationManagement />} />
          <Route path="/staff/review/:id" element={<StudentProfileTable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
