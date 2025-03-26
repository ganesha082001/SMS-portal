import React, { useState, useEffect } from 'react';
import StaffHeader from '../../Components/StaffHeader';
import StaffDashboardComponent from '../../Components/StaffDashboardComponent';
import StaffService from '../../Services/staffService'; 
import { Container } from '@mui/material';
import Footer from '../Student/Components/Footer'; // Adjust the path as needed

const StaffHomepage = () => {
    const [privilage, setPrivilage] = useState([]);
  
    // Load staff data on component mount
   useEffect(() => {


   const getPrivilage = async () => {
      try {
        const data = await StaffService.getPrivilage();
        setPrivilage(data.staffPrivilageId);
      } catch (error) {
        console.error('Error fetching privilage data:', error);
      }
    };

    getPrivilage();
  }, []);

  return (
    <div>
 
      <StaffHeader />
      <StaffDashboardComponent />
      < Footer/>

    </div>
  );
};

export default StaffHomepage;