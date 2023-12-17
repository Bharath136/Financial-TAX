import React, { useEffect, useState } from 'react';
import Sidebar from '../SideBar/sidebar';
// import { FaFileAlt, FaClock, FaCheck, FaMoneyBillAlt, FaClipboardList } from 'react-icons/fa';
import {  FaUser, FaFileUpload, FaComment, FaClipboardCheck, FaMoneyBillAlt } from "react-icons/fa";

import { FaAnglesRight } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { CardBody, CardText, CardTitle, CurrentUser, DashboardContainer, H1, IntroText, StepCard, StepDetails } from './styledComponents';
import { message } from '../../components/Footer/footer';

const UserDashboard = () => {
    const [currentUser, setCurrentUser] = useState('');

    const user = JSON.parse(localStorage.getItem('currentUser'));

    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            if (user.role === 'ADMIN') {
                navigate('/admin-dashboard')
            } else if (user.role === 'STAFF') {
                navigate('/staff-dashboard')
            }
            setCurrentUser(user.first_name);
        }
    }, [user,navigate]);

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
                <H1>Welcome <CurrentUser className="current-user">{currentUser}</CurrentUser> <span style={{ fontSize: '16px' }}>(Current Step: {user.current_step ? user.current_step : "Null"})</span></H1>
                <div className="intro-section">
                    <IntroText>
                        Embark on a hassle-free tax filing journey with us. Our user-friendly platform ensures a seamless experience
                        as you navigate through the various steps. Take control of your financial responsibilities and complete your
                        tax filing effortlessly in 5 simple steps.
                    </IntroText>
                </div>

                <div className='container p-0 m-0'>
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
                {message}
            </DashboardContainer>
        </div>
    );
};

export default UserDashboard;
