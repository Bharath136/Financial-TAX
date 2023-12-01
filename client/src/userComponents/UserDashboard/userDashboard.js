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
        total: { description: 'Total documents' },
        pending: { description: 'Pending documents' },
        reviewed: { description: 'Reviewed documents' },
        payments: { description: 'Total payments' },
        summary: { description: 'Summary details' },
    };

    return (
        <div className='d-flex'>
            <Sidebar />
            <div className="profile-container">
                <h1>Welcome <span className="current-user">{currentUser}</span></h1>
                <div className="dashboard-items">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className={`dashboard-item ${key === 'payments' || key === 'summary' ? 'dashboard-item-2' : ''}`}>
                            <div className={`dashboard-icon dashboard-icon-${key}`}>
                                {key === 'total' && <FaFileAlt size={80} />}
                                {key === 'pending' && <FaClock size={80} />}
                                {key === 'reviewed' && <FaCheck size={80} />}
                                {key === 'payments' && <FaMoneyBillAlt size={80} />}
                                {key === 'summary' && <FaClipboardList size={80} />}
                            </div>
                            <div className="dashboard-text">
                                <h4>{value.description}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
