import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = (props) => {
    const { Component } = props;
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('customerJwtToken');
        const user = JSON.parse(localStorage.getItem('currentUser'));

        if (!token || !user || (user.role !== 'ADMIN' && user.role !== 'STAFF' && user.role !== 'CUSTOMER')) {
            navigate('/accounts/login');
        }
    }, [navigate]);

    return <Component />;
};

export default ProtectedRoute;
