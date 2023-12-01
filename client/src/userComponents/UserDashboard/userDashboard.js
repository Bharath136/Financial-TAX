import React, { useEffect, useState } from 'react';
import Sidebar from '../SideBar/sidebar';
// import { FaFileAlt, FaClock, FaCheck, FaMoneyBillAlt, FaClipboardList } from 'react-icons/fa';
import {  FaUser, FaFileUpload, FaComment, FaClipboardCheck, FaMoneyBillAlt } from "react-icons/fa";

import { FaAnglesRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { CardBody, CardText, CardTitle, CurrentUser, DashboardContainer, H1, StepCard, StepDetails } from './styledComponents';

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

    const steps = [
        {
            name: 'Tax Interview',
            step: 1,
            description: 'Complete your tax interview to provide necessary information.',
            link: '/tax-interview',
            icon: <FaUser size={30} />
        },
        {
            name: 'Upload Document',
            step: 2,
            description: 'Upload the required documents for tax filing.',
            link: '/upload-document',
            icon: <FaFileUpload size={30} />
        },
        {
            name: 'Add Comment',
            step: 3,
            description: 'Add comments if needed to provide additional details.',
            link: '/comment-to-document',
            icon: <FaComment size={30} />
        },
        {
            name: 'Tax Return Review',
            step: 4,
            description: 'Review your tax return for accuracy and completeness.',
            link: '/tax-return-review',
            icon: <FaClipboardCheck size={30} />
        },
        {
            name: 'Payments',
            step: 5,
            description: 'Complete the payment process for your tax filing.',
            link: '/make-payment',
            icon: <FaMoneyBillAlt size={30} />
        },
    ];




    return (
        <div className='d-flex'>
            <Sidebar />
            <DashboardContainer>
                <H1>Welcome <CurrentUser className="current-user">{currentUser}</CurrentUser></H1>
                <div className="intro-section">
                    <p className="intro-text">
                        Embark on a hassle-free tax filing journey with us. Our user-friendly platform ensures a seamless experience
                        as you navigate through the various steps. Take control of your financial responsibilities and complete your
                        tax filing effortlessly in 5 simple steps.
                    </p>
                </div>

                <div className='container'>
                    <div className='row'>
                        {steps.map((step) => (
                            <div key={step.step} className='col-12 col-lg-4 col-md-6'>
                                <StepCard>
                                    <CardBody>
                                        <CardTitle>
                                            {step.icon} {step.name}
                                        </CardTitle>
                                        <CardText>{step.description}</CardText>
                                        <StepDetails>
                                            <div>Step: {step.step}</div>
                                            <Link to={step.link}>
                                                Continue <FaAnglesRight />
                                            </Link>
                                        </StepDetails>
                                    </CardBody>
                                </StepCard>
                            </div>
                        ))}
                    </div>
                </div>

            </DashboardContainer>
        </div>
    );
};

export default UserDashboard;



/* <div className="dashboard-items">
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
            </div> */