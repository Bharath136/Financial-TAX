import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffProtectedRoute = (props) => {
    const { Component } = props;
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('customerJwtToken');
        const user = JSON.parse(localStorage.getItem('currentUser'));

        if (!token || !user || user.role !== 'Staff') {
            // If any of the conditions are not met, navigate to the login page
            navigate('/login');
        }
    }, [navigate]);

    // Render the component only if the conditions are met
    return <Component />;
};

export default StaffProtectedRoute;
