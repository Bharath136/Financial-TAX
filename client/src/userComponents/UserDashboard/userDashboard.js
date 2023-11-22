import React, { useEffect, useState } from 'react';
import Sidebar from '../SideBar/sidebar';
import { FaFileAlt, FaClock, FaCheck, FaMoneyBillAlt, FaClipboardList } from 'react-icons/fa';
import './userDashboard.css';

const UserDashboard = () => {
    const [currentUser, setCurrentUser] = useState('');

    const user = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        if (user) {
            setCurrentUser(user.first_name);
        }
    }, [user]);

    const data = {
        total: { value: 100, description: 'Total documents' },
        pending: { value: 25, description: 'Pending documents' },
        reviewed: { value: 45, description: 'Reviewed documents' },
        payments: { value: 60, description: 'Total payments' },
        summary: { value: 80, description: 'Summary details' },
    };

    return (
        <div className='d-flex'>
            <Sidebar />
            <div className="profile-container">
                <h3>Welcome <span className="current-user">{currentUser}</span></h3>
                <div className="dashboard-container">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className={`col-md-4 dashboard-item ${key === 'payments' || key === 'summary' ? 'dashboard-item-2' : ''}`}>
                            <div className={`dashboard-icon dashboard-icon-${key}`}>
                                {key === 'total' && <FaFileAlt size={80} />}
                                {key === 'pending' && <FaClock size={80} />}
                                {key === 'reviewed' && <FaCheck size={80} />}
                                {key === 'payments' && <FaMoneyBillAlt size={80} />}
                                {key === 'summary' && <FaClipboardList size={80} />}
                            </div>
                            <div className="dashboard-text">
                                <h4>{value.description}</h4>
                                <p>{value.value}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
