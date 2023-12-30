import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, getUserData } from '../../StorageMechanism/storageMechanism';

const ProtectedRoute = (props) => {
    const { Component } = props;
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        const user = getUserData()

        if (!token || !user || (user.role !== 'ADMIN' && user.role !== 'STAFF' && user.role !== 'CUSTOMER')) {
            navigate('/accounts/login');
        }
    }, [navigate]);

    return <Component />;
};

export default ProtectedRoute;
