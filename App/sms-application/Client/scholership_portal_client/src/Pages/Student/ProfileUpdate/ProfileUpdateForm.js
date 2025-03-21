import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PersonalInfo from './FormSections/PersonalInfo'
import EducationalInfo from './FormSections/EducationalInfo'
import ScholarshipInfo from './FormSections/ScholarshipInfo'
import StudentService from '../../../Services/studentService';
import SessionStorageUtil from '../../../Session/SessionStorageUtils';
import StudentHeader from '../../../Components/StudentHeader'; // Adjust the path as necessary

const StudentProfileLayout = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentId = SessionStorageUtil.getParticularData('userID'); // Get the student ID from session storage
        if (studentId) {
          const data = await StudentService.getStudentProfile(studentId);
          setStudentData(data);
        } else {
          console.error('No student ID found in session storage');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, []);


  // Student information
  // const studentInfo = {
  //   studentName: "John Doe",
  //   studentEmail: "john.doe@example.com",
  //   studentPhone: "123-456-7890",
  //   studentRollnumber: "ST12345"
  // };

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return < PersonalInfo />;
      case 'educational':
        return <EducationalInfo />;
      case 'scholarship':
        return <ScholarshipInfo />;
      default:
        return <PersonalInfo />;
    }
  };

  return (
    <div >
      {/* < StudentHeader /> */}
      <div className="container mt-4">
        {studentData ? (
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              Student Information
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Name:</strong> {studentData.studentName}</p>
                  <p><strong>Email:</strong> {studentData.studentEmail}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Phone:</strong> {studentData.studentPhone}</p>
                  <p><strong>Roll Number:</strong> {studentData.studentRollnumber}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading student information...</p>
        )}

        {/* Tabbed Layout */}
        <div className="card">
          <div className="card-header p-0">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('personal')}
                >
                  Personal
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'educational' ? 'active' : ''}`}
                  onClick={() => setActiveTab('educational')}
                >
                  Educational
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'scholarship' ? 'active' : ''}`}
                  onClick={() => setActiveTab('scholarship')}
                >
                  Scholarship
                </button>
              </li>
            </ul>
          </div>
          <div className="card-body">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileLayout;